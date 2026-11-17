import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const base = "C:/Users/maina/Downloads/";
const assets = {
  breakfast: "ChatGPT Image Sep 30, 2026, 11_04_10 AM-10.png",
  chef: "ChatGPT Image Sep 30, 2026, 11_04_07 AM-9.png",
  reception: "ChatGPT Image Sep 30, 2026, 11_04_02 AM-6.png",
  gardens: "ChatGPT Image Sep 30, 2026, 11_04_00 AM-5.png",
  resort: "ChatGPT Image Sep 30, 2026, 11_03_58 AM-4.png",
  courtyard: "ChatGPT Image Sep 30, 2026, 11_03_57 AM-3.png",
  gate: "ChatGPT Image Sep 30, 2026, 11_03_55 AM-2.png",
  entrance: "ChatGPT Image Sep 30, 2026, 11_03_53 AM-1.png",
  aerial: "ChatGPT Image Sep 30, 2026, 10_34_04 AM-7.png",
  path: "ChatGPT Image Sep 30, 2026, 10_34_02 AM-6.png",
  fruit: "ChatGPT Image Sep 30, 2026, 10_34_00 AM-5.png",
  terrace: "ChatGPT Image Sep 30, 2026, 10_33_56 AM-3.png",
  lawn: "ChatGPT Image Sep 30, 2026, 10_33_54 AM-2.png",
  service: "ChatGPT Image Sep 30, 2026, 10_33_51 AM-1.png",
  logo: "ChatGPT Image Sep 30, 2026, 12_35_00 PM.png",
  hall: "C:/Users/maina/AppData/Local/Temp/codex-clipboard-2702792e-2ab8-449e-a6dd-bdfb10c33ca6.png",
};
await mkdir("public/images", { recursive: true });
let total = 0;
for (const [name, file] of Object.entries(assets)) {
  const input = file.startsWith("C:") ? file : base + file;
  for (const [suffix, width] of name === "logo"
    ? [["", 180]]
    : [
        ["", 1672],
        ["-small", 640],
      ]) {
    const result = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`public/images/${name}${suffix}.webp`);
    total += result.size;
  }
}
await writeFile(
  "docs/ASSETS.md",
  "# Image provenance\n\nAll photographs and the logo were supplied by the user. WebP conversions preserve the original source content. Room cards use labelled property photographs until room photography is available.\n\n" +
    Object.entries(assets)
      .map(([key, file]) => `- ${key}: ${file}`)
      .join("\n") +
    "\n",
);
console.log(
  `Prepared ${Object.keys(assets).length} assets; ${(total / 1024 / 1024).toFixed(2)} MB including responsive derivatives.`,
);
