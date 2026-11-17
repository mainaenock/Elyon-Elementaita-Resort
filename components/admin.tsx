"use client";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Receipt,
  Images,
  Settings,
  ArrowUpRight,
  Search,
  Check,
  MessageSquare,
} from "lucide-react";
import { Brand } from "./shell";
import { Photo } from "./ui";
import { defaultSettings } from "./pages";
import { useLocalData } from "@/lib/store";
import {
  rooms as initialRooms,
  demoBookings,
  photos,
  money,
  type Booking,
} from "@/lib/data";
const sections = [
  ["Overview", LayoutDashboard],
  ["Reservations", CalendarDays],
  ["Rooms & rates", BedDouble],
  ["Billing", Receipt],
  ["Enquiries", MessageSquare],
  ["Media library", Images],
  ["Settings", Settings],
] as const;
export function Admin() {
  const [tab, setTab] = useState("Overview");
  const [bookings, saveBookings, , bookingError] = useLocalData<Booking[]>(
    "elyon-bookings",
    demoBookings,
  );
  const [rooms, saveRooms, , roomError] = useLocalData(
    "elyon-rooms",
    initialRooms,
  );
  const [settings, saveSettings, , settingsError] = useLocalData(
    "elyon-settings",
    defaultSettings,
  );
  const [enquiries] = useLocalData<Record<string, string>[]>(
    "elyon-enquiries",
    [],
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [saved, setSaved] = useState("");
  const filtered = bookings.filter(
    (b) =>
      (status === "All" || b.status === status) &&
      `${b.id} ${b.name} ${b.room}`.toLowerCase().includes(query.toLowerCase()),
  );
  function changeStatus(id: string, value: Booking["status"]) {
    saveBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: value } : b)),
    );
    setSaved("Reservation status saved on this device.");
  }
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Brand />
        <p className="eyebrow">RESORT MANAGEMENT</p>
        <nav aria-label="Admin sections">
          {sections.map(([label, Icon]) => (
            <button
              key={label}
              className={tab === label ? "active" : ""}
              onClick={() => {
                setTab(label);
                setSaved("");
                setQuery("");
                setStatus("All");
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="demo-dot" /> Local demo workspace
          <Link href="/">
            View resort website <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>
      <main id="main" className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow">ELYON ELEMENTAITA RESORT</p>
            <h1>{tab === "Overview" ? "Welcome back." : tab}</h1>
          </div>
          <span className="admin-avatar">E</span>
        </header>
        <div className="notice">
          Front-end demo · No authentication, live inventory or payments. Data
          and edits are stored only in this browser. Use sample guest details.
        </div>
        {(bookingError || roomError || settingsError) && (
          <p className="error" role="alert">
            {bookingError || roomError || settingsError}
          </p>
        )}
        {saved && (
          <p className="success-message" role="status">
            <Check size={16} /> {saved}
          </p>
        )}
        {tab === "Overview" && (
          <>
            <div className="stat-grid">
              {[
                ["Booking requests", bookings.length],
                [
                  "Awaiting review",
                  bookings.filter((b) => b.status === "Requested").length,
                ],
                [
                  "Confirmed · demo",
                  bookings.filter((b) => b.status === "Confirmed").length,
                ],
                [
                  "Quoted value",
                  money(
                    bookings
                      .filter((b) => b.status !== "Cancelled")
                      .reduce((s, b) => s + b.total, 0),
                  ),
                ],
              ].map(([label, value]) => (
                <article key={label} className="stat-card">
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>Browser-local sample data</small>
                </article>
              ))}
            </div>
            <div className="admin-section-heading">
              <h2>Recent reservations</h2>
              <button
                className="text-link"
                onClick={() => setTab("Reservations")}
              >
                View all <ArrowUpRight size={17} />
              </button>
            </div>
            <ReservationList
              bookings={bookings.slice(-5).reverse()}
              onChange={changeStatus}
            />
            <div className="admin-bottom-grid">
              <section className="admin-panel">
                <p className="eyebrow">READY FOR YOUR NEXT STEP</p>
                <h3>Your resort, connected.</h3>
                <p>
                  Connect Cloudflare, verified contact details and a payment
                  provider to bring the live booking experience online.
                </p>
                <button
                  className="text-link"
                  onClick={() => setTab("Settings")}
                >
                  Manage resort details <ArrowUpRight size={17} />
                </button>
              </section>
              <section className="admin-panel">
                <p className="eyebrow">QUICK ACTIONS</p>
                <button
                  className="admin-quick"
                  onClick={() => setTab("Rooms & rates")}
                >
                  Update nightly rates <ArrowUpRight size={17} />
                </button>
                <button
                  className="admin-quick"
                  onClick={() => setTab("Enquiries")}
                >
                  Review {enquiries.length} enquiries <ArrowUpRight size={17} />
                </button>
                <Link className="admin-quick" href="/booking">
                  Try a guest booking <ArrowUpRight size={17} />
                </Link>
              </section>
            </div>
          </>
        )}
        {tab === "Reservations" && (
          <>
            <div className="filter-bar">
              <label className="search">
                <Search size={18} />
                <input
                  aria-label="Search reservations"
                  placeholder="Search guest, room or reference"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <select
                aria-label="Reservation status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["All", "Requested", "Confirmed", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <ReservationList bookings={filtered} onChange={changeStatus} />
          </>
        )}
        {tab === "Rooms & rates" && (
          <div className="admin-room-grid">
            {rooms.map((room) => (
              <form
                className="admin-panel"
                key={room.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  saveRooms(
                    rooms.map((r) =>
                      r.id === room.id
                        ? {
                            ...r,
                            name: String(f.get("name")).trim(),
                            price: Number(f.get("price")),
                          }
                        : r,
                    ),
                  );
                  setSaved(
                    "Room updated. The stay and booking pages now use this rate on this device.",
                  );
                }}
              >
                <Photo id={room.image} alt={room.name} />
                <label>
                  Room name
                  <input
                    name="name"
                    defaultValue={room.name}
                    required
                    maxLength={80}
                  />
                </label>
                <label>
                  Nightly rate (KES)
                  <input
                    name="price"
                    type="number"
                    defaultValue={room.price}
                    min="1"
                    max="1000000"
                    step="1"
                    required
                  />
                </label>
                <p className="muted">
                  Sample room · up to {room.guests} guests
                </p>
                <button className="button" type="submit">
                  Save room <Check size={16} />
                </button>
              </form>
            ))}
          </div>
        )}
        {tab === "Billing" && (
          <>
            <div className="stat-grid">
              <article className="stat-card">
                <span>Quoted value · active requests</span>
                <strong>
                  {money(
                    bookings
                      .filter((b) => b.status !== "Cancelled")
                      .reduce((s, b) => s + b.total, 0),
                  )}
                </strong>
              </article>
              <article className="stat-card">
                <span>Payments collected</span>
                <strong>{money(0)}</strong>
                <small>Payment provider not connected</small>
              </article>
            </div>
            <h2>Booking estimates</h2>
            <p className="muted">
              These are draft estimates, not tax invoices. No charges or payment
              statuses are simulated.
            </p>
            <div className="reservation-list">
              {bookings.map((b) => (
                <article className="reservation-row" key={b.id}>
                  <div>
                    <strong>{b.id}</strong>
                    <small>
                      {b.name} · {b.status}
                    </small>
                  </div>
                  <div>
                    <strong>{money(b.total)}</strong>
                    <small>Draft estimate</small>
                  </div>
                  <span className="status">Unpaid · demo</span>
                  <button
                    className="text-link"
                    onClick={() => {
                      const content = `ELYON ELEMENTAITA RESORT\nDEMO ESTIMATE — NOT A TAX INVOICE\nReference: ${b.id}\nGuest: ${b.name}\nRoom: ${b.room}\nDates: ${b.checkin} to ${b.checkout}\nEstimated total: ${money(b.total)}\nNo payment collected. Final rates and taxes require resort confirmation.\n`;
                      const url = URL.createObjectURL(
                        new Blob([content], { type: "text/plain" }),
                      );
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${b.id}-estimate.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      setSaved("Demo estimate downloaded.");
                    }}
                  >
                    Download estimate <ArrowUpRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
        {tab === "Enquiries" && (
          <div className="enquiry-list">
            {!enquiries.length ? (
              <div className="empty">
                <h3>No enquiries yet.</h3>
                <p>
                  Try the demo contact form to add an enquiry on this device.
                </p>
                <Link href="/contact" className="button">
                  Open contact form
                </Link>
              </div>
            ) : (
              enquiries.map((e) => (
                <article className="admin-panel" key={e.id}>
                  <p className="eyebrow">
                    {e.interest} · {e.created}
                  </p>
                  <h3>{e.name}</h3>
                  <p>{e.email}</p>
                  <p className="enquiry-message">{e.message}</p>
                </article>
              ))
            )}
          </div>
        )}
        {tab === "Media library" && (
          <>
            <p className="muted">
              Your supplied resort photography, optimized for the web. Media
              uploads will be connected to Cloudflare R2.
            </p>
            <div className="gallery-grid-layout">
              {photos.map((p) => (
                <article className="admin-media" key={p.id}>
                  <Photo id={p.id} alt={p.title} />
                  <strong>{p.title}</strong>
                  <small>{p.category} · WebP</small>
                </article>
              ))}
            </div>
          </>
        )}
        {tab === "Settings" && (
          <form
            className="admin-panel settings-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              saveSettings({
                ...settings,
                email: String(f.get("email")).trim(),
                phone: String(f.get("phone")).trim(),
              });
              setSaved(
                "Contact details saved and shown on the contact page on this device.",
              );
            }}
          >
            <h2>Resort contact details</h2>
            <p className="muted">
              Add verified details when available. Blank values stay
              unpublished.
            </p>
            <label>
              Email
              <input
                type="email"
                name="email"
                defaultValue={settings.email}
                placeholder="Add the resort email"
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                defaultValue={settings.phone}
                placeholder="+254…"
                pattern="[+0-9 ()-]{7,25}"
              />
            </label>
            <button className="button" type="submit">
              Save details <Check size={16} />
            </button>
            <hr />
            <h3>Connections</h3>
            {[
              "Cloudflare Workers hosting",
              "D1 booking database",
              "R2 media storage",
              "Admin authentication",
              "M-Pesa / payment provider",
            ].map((c) => (
              <div className="summary-line" key={c}>
                <span>{c}</span>
                <span className="status">Not connected</span>
              </div>
            ))}
          </form>
        )}
      </main>
    </div>
  );
}
function ReservationList({
  bookings,
  onChange,
}: {
  bookings: Booking[];
  onChange: (id: string, status: Booking["status"]) => void;
}) {
  return (
    <div className="reservation-list">
      {!bookings.length && (
        <p className="empty">No reservations match your search.</p>
      )}
      {bookings.map((b) => (
        <article className="reservation-row" key={b.id}>
          <div>
            <strong>{b.name}</strong>
            <small>{b.id}</small>
          </div>
          <div>
            <strong>{b.room}</strong>
            <small>
              {b.checkin} → {b.checkout} · {b.guests} guests
            </small>
          </div>
          <strong>{money(b.total)}</strong>
          <label className="sr-only" htmlFor={b.id}>
            Status for {b.name}
          </label>
          <select
            id={b.id}
            value={b.status}
            onChange={(e) =>
              onChange(b.id, e.target.value as Booking["status"])
            }
          >
            {["Requested", "Confirmed", "Cancelled"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </article>
      ))}
    </div>
  );
}
