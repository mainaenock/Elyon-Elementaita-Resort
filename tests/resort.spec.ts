import { test, expect, type Page } from "@playwright/test";
for (const width of [1440, 768, 390, 360]) {
test(`public routes render without horizontal overflow at ${width}px`, async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/stays",
      "/dining",
      "/experiences",
      "/events",
      "/about",
      "/team",
      "/gallery",
      "/contact",
      "/booking",
      "/privacy",
      "/terms",
      "/admin",
    ]) {
      await openPage(page, route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  expect(errors).toEqual([]);
});
}
test("booking validation, request persistence and admin status management", async ({
  page,
}) => {
  await openPage(page, "/booking?room=garden-deluxe");
  await page.getByLabel("Arrival", { exact: true }).fill("2027-04-10");
  await page.getByLabel("Departure", { exact: true }).fill("2027-04-12");
  await page.getByRole("combobox", { name: "Guests", exact: true }).selectOption("4");
  await page.getByLabel("Your name", { exact: true }).fill("Demo Tester");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("demo@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Save demo booking request" }).click();
  await expect(page.getByRole("alert")).toContainText("up to 2 guests");
  await page
    .getByRole("combobox", { name: "Your room", exact: true })
    .selectOption("family-retreat");
  await page.getByRole("button", { name: "Save demo booking request" }).click();
  await expect(page.getByRole("status")).toContainText("KES 29,000");
  await expect(page.getByRole("status")).toContainText(
    "No reservation has been sent",
  );
  await openPage(page, "/admin");
  await page.getByRole("button", { name: "Reservations", exact: true }).click();
  await page.getByLabel("Search reservations").fill("Demo Tester");
  await expect(page.locator(".reservation-row")).toHaveCount(1);
  await page.getByLabel("Status for Demo Tester").selectOption("Confirmed");
  await page.reload();
  await expect(page.getByLabel("Status for Demo Tester")).toHaveValue(
    "Confirmed",
  );
});
test("room rates, search and contact enquiries use local demo data", async ({
  page,
}) => {
  await openPage(page, "/admin");
  await page
    .getByRole("button", { name: "Rooms & rates", exact: true })
    .click();
  const room = page.locator(".admin-room-grid form").first();
  await room.getByLabel("Nightly rate (KES)").fill("9200");
  await room.getByRole("button", { name: "Save room" }).click();
  await openPage(page, "/stays");
  await page.getByLabel("Search rooms").fill("Garden");
  await expect(page.locator(".room-card")).toHaveCount(1);
  await expect(page.locator(".room-card")).toContainText("KES 9,200");
  await page.getByLabel("Search rooms").fill("no-such-room");
  await expect(
    page.getByRole("button", { name: "Clear filters" }),
  ).toBeVisible();
  await openPage(page, "/contact");
  await page.getByLabel("Your name").fill("Demo Enquiry");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("Tell us a little more")
    .fill("A sample team retreat enquiry.");
  await page.getByRole("button", { name: "Save demo enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("not been sent");
  await openPage(page, "/admin");
  await page.getByRole("button", { name: "Enquiries", exact: true }).click();
  await expect(page.locator(".enquiry-list")).toContainText(
    "A sample team retreat enquiry.",
  );
});
test("gallery filters, modal keyboard dismissal and mobile menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page, "/gallery");
  await page.getByRole("button", { name: "Gardens", exact: true }).click();
  await expect(page.locator(".gallery-photo")).toHaveCount(3);
  await page.locator(".gallery-photo").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(page.locator(".lightbox-controls")).toContainText("2 / 3");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Our team" })
    .click();
  await expect(page).toHaveURL(/\/team/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("homepage hero plays the clips in sequence and can pause", async ({ page }) => {
  await openPage(page, "/");
  const hero = page.locator(".hero");
  const video = hero.locator('video[data-active="true"]');
  await expect(video).toHaveAttribute("src", "/videos/hero/entrance.mp4");
  await expect(video).toHaveAttribute("data-visible", "true");
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("playsInline", true);

  const buffered = hero.locator('video[data-active="false"]');
  await expect(buffered).toHaveAttribute("src", "/videos/hero/driveway.mp4");
  const nextVideo = await buffered.elementHandle();

  await expect(video).toHaveAttribute("src", "/videos/hero/driveway.mp4", { timeout: 12000 });
  expect(await nextVideo!.evaluate((el) => el === document.querySelector('video[data-active="true"]'))).toBe(true);
  await expect(video).toHaveAttribute("data-visible", "true");
  await hero.getByRole("button", { name: "Pause resort videos" }).click();
  await expect(video).toHaveJSProperty("paused", true);
  await hero.getByRole("button", { name: "Play resort videos" }).click();
  await expect(video).toHaveJSProperty("paused", false);
});

test("mobile hero uses lighter footage and compact, readable branding", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const desktopRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/videos\/hero\/[^/]+\.mp4$/.test(request.url()) && !request.url().endsWith("-mobile.mp4")) {
      desktopRequests.push(request.url());
    }
  });
  await openPage(page, "/");
  const hero = page.locator(".hero");
  const video = hero.locator('video[data-active="true"]');
  await expect(video).toHaveAttribute("src", "/videos/hero/entrance-mobile.mp4");
  await expect(video).toHaveAttribute("data-visible", "true");
  await expect(video).toHaveAttribute("src", "/videos/hero/driveway-mobile.mp4", { timeout: 12000 });
  expect(desktopRequests).toEqual([]);
  const layout = await page.evaluate(() => {
    const logo = document.querySelector('footer .brand img')!.getBoundingClientRect();
    const name = document.querySelector('footer .brand > span')!.getBoundingClientRect();
    return {
      logoBottom: logo.bottom, nameTop: name.top, logoLeft: logo.left, nameLeft: name.left,
      subtitleWeight: getComputedStyle(document.querySelector('.header .brand small')!).fontWeight,
      subtitleSize: parseFloat(getComputedStyle(document.querySelector('.header .brand small')!).fontSize),
      headlineSize: parseFloat(getComputedStyle(document.querySelector('.hero h1')!).fontSize),
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(layout.nameTop).toBeGreaterThan(layout.logoBottom);
  expect(layout.nameLeft).toBe(layout.logoLeft);
  expect(Number(layout.subtitleWeight)).toBeGreaterThanOrEqual(600);
  expect(layout.subtitleSize).toBeGreaterThanOrEqual(9);
  expect(layout.headlineSize).toBeLessThan(40);
  expect(layout.overflow).toBe(false);
});

test("homepage hero offers manual navigation with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await openPage(page, "/");
  const hero = page.locator(".hero");
  const poster = hero.getByRole("img");
  const controls = hero.getByRole("group", { name: "Resort video slides" });
  await expect(hero.locator("video")).toHaveCount(0);
  await expect(poster).toHaveAttribute("src", "/videos/hero/entrance.webp");
  await hero.getByRole("button", { name: "Previous resort video" }).click();
  await expect(poster).toHaveAttribute("src", "/videos/hero/aerial.webp");
  await expect(controls).toContainText("5 / 5");
  await hero.getByRole("button", { name: "Next resort video" }).click();
  await expect(poster).toHaveAttribute("src", "/videos/hero/entrance.webp");
  await expect(controls).toContainText("1 / 5");
  const controlsBox = await controls.boundingBox();
  const galleryBox = await hero.getByRole("link", { name: "Resort gallery" }).boundingBox();
  expect(controlsBox!.x + controlsBox!.width).toBeLessThan(galleryBox!.x);
});

test("homepage hero keeps the poster when video cannot load", async ({ page }) => {
  await page.route("**/videos/hero/*.mp4", (route) => route.abort());
  await openPage(page, "/");
  const hero = page.locator(".hero");
  await expect(hero.getByRole("button", { name: "Play resort videos" })).toBeVisible();
  const poster = hero.getByRole("img");
  await expect.poll(() => poster.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

async function openPage(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true', {timeout: 20000});
}
