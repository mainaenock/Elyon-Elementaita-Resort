"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Utensils,
  Sun,
  Search,
  X,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  CalendarDays,
} from "lucide-react";
import { Photo, Intro, TextLink, Banner } from "./ui";
import {
  rooms as initialRooms,
  photos,
  money,
  demoBookings,
  type Booking,
} from "@/lib/data";
import { useLocalData, today, useToday, nightsBetween } from "@/lib/store";
import { sitePath } from "@/lib/site-path";

function DateSearch() {
  const currentDate = useToday();
  return (
    <form action={sitePath("/stays/")} className="date-search" aria-label="Find a room">
      <p className="booking-heading">Plan your stay</p>
      <label>
        <span>CHECK IN</span>
        <input
          type="date"
          name="checkin"
          aria-label="Check in"
          min={currentDate}
          required
        />
      </label>
      <label>
        <span>CHECK OUT</span>
        <input
          type="date"
          name="checkout"
          aria-label="Check out"
          min={currentDate}
          required
        />
      </label>
      <label>
        <span>GUESTS</span>
        <select name="guests" aria-label="Number of guests">
          <option value="2">2 guests</option>
          <option value="1">1 guest</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
        </select>
      </label>
      <button className="button gold" type="submit">
        Find a room <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
const heroPhotos = [
  { id: "resort", alt: "Timber architecture and lush gardens at Elyon Elementaita Resort" },
  { id: "gardens", alt: "Landscaped gardens and greenery at Elyon" },
  { id: "courtyard", alt: "The courtyard and garden approach at Elyon" },
] as const;

const homeExperiences = [
  {
    id: "resort",
    title: "Stay at Elyon",
    href: "/stays",
    text: "Explore room options for couples, friends and families.",
  },
  {
    id: "breakfast",
    title: "Dine with us",
    href: "/dining",
    text: "Take your time over breakfast or gather around a table for lunch.",
  },
  {
    id: "aerial",
    title: "Spend time outdoors",
    href: "/experiences",
    text: "Follow a garden path or spend an afternoon on the lawn.",
  },
] as const;

function HomeHero() {
  const [active, setActive] = useState(0);
  const photo = heroPhotos[active];

  function changePhoto(direction: number) {
    setActive((current) => (current + direction + heroPhotos.length) % heroPhotos.length);
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Photo key={photo.id} id={photo.id} alt={photo.alt} eager />
      <div className="hero-shade" />
      <div className="hero-content">
        <h1 id="hero-title">At home in the<br />Rift Valley.</h1>
        <Link href="/stays" className="button outline-light">
          Explore the rooms <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="hero-controls" role="group" aria-label="Resort photos">
        <button type="button" onClick={() => changePhoto(-1)} aria-label="Previous resort photo">
          <ChevronLeft size={19} />
        </button>
        <span aria-live="polite">{active + 1} / {heroPhotos.length}</span>
        <button type="button" onClick={() => changePhoto(1)} aria-label="Next resort photo">
          <ChevronRight size={19} />
        </button>
      </div>
      <Link className="hero-gallery" href="/gallery">
        Resort gallery <ArrowUpRight size={15} />
      </Link>
    </section>
  );
}

export function Home() {
  return (
    <>
      <HomeHero />
      <div className="booking-strip">
        <DateSearch />
      </div>
      <section className="section resort-intro">
        <h2>Elyon Elementaita<br />Resort</h2>
        <div>
          <p>
            A garden retreat in Gilgil, with open lawns, leisurely breakfasts
            and a warm Kenyan welcome.
          </p>
          <TextLink href="/about">Get to know Elyon</TextLink>
        </div>
      </section>
      <section className="home-experiences">
        <div className="section">
          <div className="section-heading">
            <h2>Make the most of your stay.</h2>
            <p>
              Settle in for the weekend, share a meal or spend the afternoon outdoors.
            </p>
          </div>
          <div className="experience-grid">
            {homeExperiences.map((item) => (
              <Link href={item.href} className="experience-card" key={item.id}>
                <div className="card-photo">
                  <Photo id={item.id} alt="" />
                </div>
                <div className="card-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ArrowUpRight className="experience-arrow" size={20} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-gather">
        <Photo id="hall" alt="Tables arranged for a gathering in the Elyon events hall" />
        <div>
          <p className="eyebrow">Meetings &amp; celebrations</p>
          <h2>Bring your people together.</h2>
          <p>
            Host a team retreat or celebrate a milestone, with an indoor hall
            and gardens for time together outdoors.
          </p>
          <TextLink href="/events">Explore meetings and events</TextLink>
        </div>
      </section>
      <Banner />
    </>
  );
}

function Stays() {
  const [rooms] = useLocalData("elyon-rooms", initialRooms);
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] = useState("0");
  const [dates, setDates] = useState("");
  const [dateError, setDateError] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setCapacity(p.get("guests") || "0");
    if (p.get("checkin") && p.get("checkout")) {
      const a = p.get("checkin")!,
        b = p.get("checkout")!;
      if (a < today() || nightsBetween(a, b) < 1) {
        setDateError(
          "Please choose a future arrival and a departure after your arrival.",
        );
      } else
        setDates(`checkin=${a}&checkout=${b}&guests=${p.get("guests") || 2}&`);
    }
  }, []);
  const results = rooms.filter(
    (r) =>
      r.guests >= Number(capacity) &&
      `${r.name} ${r.category} ${r.amenities.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <Intro
        label="Stay at Elyon"
        title={
          <>
            A place to <em>settle in.</em>
          </>
        }
      >
        Explore room options for time away together, from a weekend for two to a family break.
      </Intro>
      <section className="section compact">
        <div className="notice">
          Preview collection · Room types, amenities and rates are illustrative.
          Photos show the resort grounds; bedroom photographs are coming soon.
        </div>
        {dateError && (
          <p className="error" role="alert">
            {dateError} <Link href="/booking">Choose dates</Link>
          </p>
        )}
        <div className="filter-bar">
          <label className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms or amenities"
              aria-label="Search rooms"
            />
          </label>
          <label className="inline-label">
            Guests
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            >
              <option value="0">Any</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} guests
                </option>
              ))}
            </select>
          </label>
          <span className="result-count">{results.length} stays</span>
        </div>
        <div className="room-grid">
          {results.map((room) => (
            <article className="room-card" key={room.id}>
              <div className="card-photo">
                <Photo
                  id={room.image}
                  alt={`${room.name} — resort grounds reference photograph`}
                />
                <span className="image-label">Resort grounds</span>
              </div>
              <div className="room-body">
                <p className="eyebrow">
                  {room.category} · UP TO {room.guests} GUESTS
                </p>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <details>
                  <summary>
                    Room details <Plus size={15} />
                  </summary>
                  <ul>
                    {room.amenities.map((a) => (
                      <li key={a}>
                        {a} <small>(sample)</small>
                      </li>
                    ))}
                  </ul>
                  <p className="muted">
                    Final facilities and room images will be confirmed by the
                    resort.
                  </p>
                </details>
                <div className="room-price">
                  <span>
                    <strong>{money(room.price)}</strong>
                    <small> / night · sample rate</small>
                  </span>
                  <Link
                    aria-label={`Choose ${room.name}`}
                    href={`/booking?${dates}room=${room.id}`}
                    className="round-arrow dark"
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!results.length && (
          <div className="empty">
            <h3>A little more room to search.</h3>
            <p>Try fewer filters to find your stay.</p>
            <button
              className="button"
              onClick={() => {
                setCapacity("0");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <Banner />
    </>
  );
}

const editorial = {
  dining: {
    label: "Dining at Elyon",
    title: "A table to come back to.",
    image: "breakfast",
    heading: "Breakfasts worth lingering over.",
    copy: "Start with breakfast or meet over lunch after a morning outdoors. Ask our team about menus for family lunches, groups and special occasions.",
    cards: [
      [
        "fruit",
        "A fresh start",
        "Seasonal fruit, breakfast favourites and a gentle start to your morning.",
      ],
      [
        "chef",
        "From our kitchen",
        "Thoughtful cooking and familiar flavours, prepared by our kitchen team.",
      ],
      [
        "service",
        "Shared with care",
        "A warm welcome for family lunches, group dining and special occasions.",
      ],
    ],
    action: "Enquire about dining",
  },
  experiences: {
    label: "Experiences",
    title: "Time in the open air.",
    image: "gardens",
    heading: "An afternoon in the gardens.",
    copy: "Follow a path through the gardens, find a quiet spot on the lawn or bring your group together outdoors.",
    cards: [
      [
        "path",
        "Garden wanderings",
        "Find a quiet path and reconnect with the small things.",
      ],
      [
        "aerial",
        "Better, together",
        "Open green spaces for group activities and team connection.",
      ],
      [
        "lawn",
        "Unhurried afternoons",
        "Fresh air, a good conversation and a little room to simply be.",
      ],
    ],
    action: "Plan an experience",
  },
  events: {
    label: "Meetings & celebrations",
    title: "Bring your people together.",
    image: "hall",
    heading: "A hall and gardens for your occasion.",
    copy: "Bring your team, celebrate a milestone or get the family together. Our indoor gathering space and green lawns offer a starting point for an occasion that feels like you. Talk to us about capacity, catering and arrangements.",
    cards: [
      [
        "aerial",
        "Team retreats",
        "Time away to connect, reflect and share a new perspective.",
      ],
      [
        "hall",
        "Meetings & occasions",
        "An adaptable indoor space for meaningful gatherings.",
      ],
      [
        "lawn",
        "Garden celebrations",
        "A green backdrop for the moments you want to remember.",
      ],
    ],
    action: "Enquire about your event",
  },
};
function Editorial({ section }: { section: keyof typeof editorial }) {
  const data = editorial[section];
  return (
    <>
      <Intro label={data.label} title={data.title} />
      <section className="editorial-feature">
        <Photo id={data.image} alt={data.title} eager />
        <div>
          <p className="eyebrow">THE ELYON WAY</p>
          <h2>{data.heading}</h2>
          <p>{data.copy}</p>
          <Link className="button" href={`/contact?interest=${section}`}>
            {data.action}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="experience-grid">
          {data.cards.map(([id, title, text]) => (
            <article className="experience-card" key={id}>
              <div className="card-photo">
                <Photo id={id} alt={title} />
              </div>
              <div className="card-copy">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
        {section === "dining" && (
          <div className="menu-preview">
            <div>
              <p className="eyebrow">A TASTE OF WHAT’S TO COME</p>
              <h2>At the table</h2>
              <p className="muted">
                Sample menu and prices. Final menu to be confirmed.
              </p>
            </div>
            <div>
              {[
                ["Country breakfast", 1200],
                ["Chef’s lunch buffet", 2200],
                ["Seasonal fruit platter", 650],
              ].map(([name, price]) => (
                <div className="menu-row" key={name}>
                  <span>{name}</span>
                  <strong>{money(Number(price))}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <Banner />
    </>
  );
}

function About() {
  return (
    <>
      <Intro
        label="Our story"
        title={
          <>
            A garden retreat <em>in Gilgil.</em>
          </>
        }
      />
      <section className="editorial-feature">
        <Photo
          id="entrance"
          alt="Elyon Elementaita Resort entrance sign"
          eager
        />
        <div>
          <p className="eyebrow">OUR STORY</p>
          <h2>
            A place to spend time together.
          </h2>
          <p>
            Elyon Elementaita Resort is a place for rest, good company and time
            outdoors in Gilgil, Nakuru County. Our gardens and gathering spaces
            give guests space to spend time together.
          </p>
          <p>
            Guests come for weekend stays, meals with friends and occasions
            worth bringing everyone together for.
          </p>
          <TextLink href="/team">Meet the people of Elyon</TextLink>
        </div>
      </section>
      <section className="section values">
        <div>
          <Leaf />
          <h3>Close to nature</h3>
          <p>Gardens and open spaces at the heart of your visit.</p>
        </div>
        <div>
          <Utensils />
          <h3>Heartfelt hospitality</h3>
          <p>Shared meals and the pleasure of being welcomed.</p>
        </div>
        <div>
          <Sun />
          <h3>Time well spent</h3>
          <p>A setting for quiet breaks and meaningful gatherings.</p>
        </div>
      </section>
      <section className="journey section compact">
        <p className="eyebrow">OUR JOURNEY</p>
        <h2>A story still unfolding.</h2>
        <p>
          We look forward to sharing the people, milestones and inspiration
          behind Elyon. Our full story is being prepared by the resort team.
        </p>
      </section>
      <Banner />
    </>
  );
}
function Team() {
  return (
    <>
      <Intro
        label="Our team"
        title={
          <>
            The people <em>of Elyon.</em>
          </>
        }
      >
        Meet the teams helping shape every stay, shared meal and gathering.
      </Intro>
      <section className="section compact">
        <div className="team-feature">
          <Photo
            id="service"
            alt="A member of the resort hospitality team serving guests"
          />
          <div>
            <p className="eyebrow">A HUMAN TOUCH</p>
            <h2>
              From the kitchen to your welcome.
            </h2>
            <p>
              Behind every warm welcome is a team. From the kitchen to guest
              relations, thoughtful service is at the heart of Elyon.
            </p>
            <p className="muted">
              Leadership names, portraits and biographies will be added once
              provided by the resort.
            </p>
          </div>
        </div>
        <div className="team-grid">
          {[
            ["01", "Chief executive", "Vision & leadership"],
            ["02", "Resort director", "Operations & guest experience"],
            ["03", "Legal team", "Governance & advisory"],
            ["04", "Communications team", "Stories & guest relations"],
          ].map(([n, title, role]) => (
            <article className="team-card" key={n}>
              <span className="team-number">{n}</span>
              <p className="eyebrow">{role}</p>
              <h3>{title}</h3>
              <p>Profile coming soon</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Gallery() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const result = photos.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.title.toLowerCase().includes(query.toLowerCase()),
  );
  const photo = result[active];
  return (
    <>
      <Intro
        label="Gallery"
        title={
          <>
            A closer look <em>at Elyon.</em>
          </>
        }
      />
      <section className="section compact">
        <div className="filter-bar">
          <div className="filter-tabs" aria-label="Photo categories">
            {["All", "The resort", "Gardens", "Dining", "Experiences"].map(
              (c) => (
                <button
                  className={category === c ? "active" : ""}
                  aria-pressed={category === c}
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setActive(0);
                  }}
                >
                  {c}
                </button>
              ),
            )}
          </div>
          <label className="search">
            <Search size={18} />
            <input
              aria-label="Search gallery"
              placeholder="Find a moment…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
            />
          </label>
        </div>
        <div className="gallery-grid-layout">
          {result.map((p, i) => (
            <button
              className="gallery-photo"
              key={p.id}
              onClick={() => {
                setActive(i);
                dialog.current?.showModal();
              }}
            >
              <Photo id={p.id} alt={p.title} />
              <span>
                {p.title}
                <ArrowUpRight size={18} />
              </span>
            </button>
          ))}
        </div>
        {!result.length && (
          <p className="empty">
            No photos match this search. Try “garden” or choose another
            category.
          </p>
        )}
        <dialog
          ref={dialog}
          className="lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
          aria-label="Resort photo viewer"
        >
          {photo && (
            <>
              <button
                className="close-modal"
                aria-label="Close photo"
                onClick={() => dialog.current?.close()}
              >
                <X />
              </button>
              <Photo id={photo.id} alt={photo.title} eager />
              <div className="lightbox-controls">
                <button
                  aria-label="Previous photo"
                  onClick={() =>
                    setActive((active - 1 + result.length) % result.length)
                  }
                >
                  <ChevronLeft />
                </button>
                <span>
                  {photo.title} · {active + 1} / {result.length}
                </span>
                <button
                  aria-label="Next photo"
                  onClick={() => setActive((active + 1) % result.length)}
                >
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
        </dialog>
      </section>
    </>
  );
}

export function BookingForm() {
  const currentDate = useToday();
  const [rooms] = useLocalData("elyon-rooms", initialRooms);
  const [bookings, saveBookings, ready, storageError] = useLocalData<Booking[]>(
    "elyon-bookings",
    demoBookings,
  );
  const [roomId, setRoomId] = useState(initialRooms[0].id);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Booking | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (initialRooms.some((r) => r.id === p.get("room")))
      setRoomId(p.get("room")!);
    setCheckin(p.get("checkin") || "");
    setCheckout(p.get("checkout") || "");
    setGuests(Math.max(1, Math.min(4, Number(p.get("guests")) || 2)));
  }, []);
  const room = rooms.find((r) => r.id === roomId) || rooms[0];
  const nights = nightsBetween(checkin, checkout);
  const validNights = Number.isFinite(nights) && nights > 0 ? nights : 0;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checkin < today() || !validNights || validNights > 30) {
      setError("Choose a future arrival and a stay of 1–30 nights.");
      return;
    }
    if (guests > room.guests) {
      setError(
        `This room accommodates up to ${room.guests} guests. Please choose a larger room.`,
      );
      return;
    }
    const data = new FormData(e.currentTarget);
    const request: Booking = {
      id: `ELY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      room: room.name,
      checkin,
      checkout,
      guests,
      total: validNights * room.price,
      status: "Requested",
      created: today(),
    };
    saveBookings([...bookings, request]);
    setDone(request);
    setError("");
  }
  if (done)
    return (
      <section className="success-panel" role="status">
        <span className="success-icon">
          <Check />
        </span>
        <p className="eyebrow">YOUR DEMO REQUEST</p>
        <h2>A little escape, pencilled in.</h2>
        <p>
          Reference <strong>{done.id}</strong>
        </p>
        <p>
          {done.room} · {done.checkin} to {done.checkout}
          <br />
          {done.guests} guests · estimated {money(done.total)}
        </p>
        <div className="notice">
          Saved in this browser only. No reservation has been sent to the
          resort, no room is held and no payment has been taken.
        </div>
        {storageError && <p role="alert">{storageError}</p>}
        <Link className="button" href="/stays">
          Explore more stays <ArrowRight size={18} />
        </Link>
      </section>
    );
  return (
    <div className="booking-layout">
      <form className="booking-form" onSubmit={submit}>
        <div className="form-heading">
          <span>01</span>
          <h3>Make it your stay</h3>
        </div>
        <label>
          Your room
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            {rooms.map((r) => (
              <option value={r.id} key={r.id}>
                {r.name} · up to {r.guests} guests
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid">
          <label>
            Arrival
            <input
              type="date"
              required
              min={currentDate}
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
            />
          </label>
          <label>
            Departure
            <input
              type="date"
              required
              min={checkin || currentDate}
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
            />
          </label>
        </div>
        <label>
          Guests
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
        <div className="form-heading">
          <span>02</span>
          <h3>A few details</h3>
        </div>
        <label>
          Your name
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Full name"
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" required />I understand this is a local demo
          request and not a confirmed booking.
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {storageError && <p className="error">{storageError}</p>}
        <button disabled={!ready} className="button" type="submit">
          Save demo booking request <ArrowRight size={18} />
        </button>
      </form>
      <aside className="booking-summary">
        <Photo id={room.image} alt="Resort grounds reference photo" />
        <div>
          <p className="eyebrow">YOUR ELYON ESCAPE</p>
          <h3>{room.name}</h3>
          <p>
            <Users size={16} /> Up to {room.guests} guests
          </p>
          <div className="summary-line">
            <span>Sample nightly rate</span>
            <strong>{money(room.price)}</strong>
          </div>
          <div className="summary-line">
            <span>Length of stay</span>
            <span>{validNights || "—"} nights</span>
          </div>
          <div className="summary-line total">
            <span>Estimated total</span>
            <strong>
              {validNights ? money(validNights * room.price) : "Select dates"}
            </strong>
          </div>
          <p className="muted">
            Illustrative pricing. Taxes, inclusions, availability and final
            terms must be confirmed by the resort. No payment is required in
            this preview.
          </p>
        </div>
      </aside>
    </div>
  );
}

export const defaultSettings = {
  email: "",
  phone: "",
  welcome: "A little closer to nature.",
};
function Contact() {
  const [settings] = useLocalData("elyon-settings", defaultSettings);
  const [enquiries, saveEnquiries, , storageError] = useLocalData<
    Record<string, string>[]
  >("elyon-enquiries", []);
  const [sent, setSent] = useState(false);
  const [interest, setInterest] = useState("stay");
  useEffect(() => {
    const i = new URLSearchParams(location.search).get("interest");
    if (i) setInterest(i);
  }, []);
  return (
    <>
      <Intro
        label="Contact & directions"
        title={
          <>
            Get in <em>touch.</em>
          </>
        }
      />
      <section className="section compact contact-layout">
        <div>
          <p className="eyebrow">FIND US IN GILGIL</p>
          <h2>
            Find us in Gilgil.
          </h2>
          <p>
            Elyon Elementaita Resort
            <br />
            Gilgil, Nakuru County, Kenya
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Elyon+Elementaita+Resort+Gilgil+Kenya"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Find the resort on Google Maps <ArrowUpRight size={18} />
          </a>
          <p className="muted">
            Please confirm the exact route with the resort before travelling.
          </p>
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          )}
          {settings.phone && (
            <p>
              <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
                {settings.phone}
              </a>
            </p>
          )}
          {!settings.email && !settings.phone && (
            <p className="muted">
              Direct phone and email details will be added shortly.
            </p>
          )}
          <Photo
            className="contact-photo"
            id="gate"
            alt="The timber gate at Elyon"
          />
        </div>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(
              new FormData(e.currentTarget),
            ) as Record<string, string>;
            saveEnquiries([
              ...enquiries,
              { ...data, id: crypto.randomUUID(), created: today() },
            ]);
            setSent(true);
            e.currentTarget.reset();
          }}
        >
          <h3>Send an enquiry</h3>
          <p className="muted">
            Demo enquiry form. Messages stay in this browser and are not sent to
            the resort.
          </p>
          <label>
            Your name
            <input name="name" required maxLength={100} />
          </label>
          <label>
            Email address
            <input name="email" type="email" required maxLength={200} />
          </label>
          <label>
            I’m interested in
            <select
              name="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option value="stay">A stay at Elyon</option>
              <option value="dining">Dining</option>
              <option value="experiences">Experiences</option>
              <option value="events">An event or team retreat</option>
              <option value="other">Something else</option>
            </select>
          </label>
          <label>
            Tell us a little more
            <textarea name="message" required rows={4} maxLength={2000} />
          </label>
          <button className="button" type="submit">
            Save demo enquiry <ArrowUpRight size={18} />
          </button>
          {sent && (
            <p className="success-message" role="status">
              Your demo enquiry was saved on this device. It has not been sent.
            </p>
          )}
          {storageError && <p role="alert">{storageError}</p>}
        </form>
      </section>
    </>
  );
}
function Policies({ section }: { section: string }) {
  return (
    <>
      <Intro
        label="HELPFUL INFORMATION"
        title={section === "privacy" ? "Your privacy." : "Before you book."}
      />
      <section className="prose section compact">
        {section === "privacy" ? (
          <>
            <h2>This website is a front-end preview</h2>
            <p>
              Demo booking requests, enquiries and admin edits are stored in
              your browser’s local storage. They are not sent to the resort or a
              shared database. Please use sample details and do not enter
              payment or sensitive personal information.
            </p>
            <h3>Removing demo information</h3>
            <p>
              Clear this site’s data in your browser settings to remove locally
              saved records. The resort’s full privacy notice, data controller
              contact and retention policy will be published before live
              bookings begin.
            </p>
            <h3>External links</h3>
            <p>
              Opening Google Maps takes you to a separate service with its own
              privacy practices.
            </p>
          </>
        ) : (
          <>
            <h2>Plan now. Confirm with the resort.</h2>
            <p>
              Room names, amenities, meal prices and nightly rates in this
              preview are illustrative. Availability is not connected to live
              inventory. Saving a demo booking does not reserve a room.
            </p>
            <h3>Payments & cancellations</h3>
            <p>
              No payments are collected here. Final rates, applicable taxes,
              arrival times, deposits, cancellation rules and refund conditions
              must be agreed with the resort before a real reservation is made.
            </p>
            <h3>Special arrangements</h3>
            <p>
              Ask the resort to confirm dietary requirements, accessibility
              needs, room setup, event capacity and any special requests before
              travelling.
            </p>
          </>
        )}
      </section>
    </>
  );
}
export function SectionPage({ section }: { section: string }) {
  if (section === "stays") return <Stays />;
  if (section in editorial)
    return <Editorial section={section as keyof typeof editorial} />;
  if (section === "about") return <About />;
  if (section === "team") return <Team />;
  if (section === "gallery") return <Gallery />;
  if (section === "contact") return <Contact />;
  if (section === "booking")
    return (
      <>
        <Intro
          label="Reservations"
          title={
            <>
              Plan <em>your stay.</em>
            </>
          }
        >
          Choose your dates and room to see an estimated total.
        </Intro>
        <section className="section compact">
          <div className="notice">
            Booking preview · Use sample details. Requests are saved on this
            device only.
          </div>
          <BookingForm />
        </section>
      </>
    );
  return <Policies section={section} />;
}
