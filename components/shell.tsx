"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, X, MapPin, ArrowRight } from "lucide-react";
import { nav } from "@/lib/data";
import { sitePath } from "@/lib/site-path";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Elyon Elementaita Resort home">
      <img src={sitePath("/images/logo.webp")} alt="" width="52" height="52" />
      <span>
        ELYON<small>ELEMENTAITA RESORT</small>
      </span>
    </Link>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
    return () => { delete document.documentElement.dataset.hydrated; };
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  if (path.startsWith("/admin"))
    return (
      <>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="location-bar">
        <span>
          <MapPin size={12} /> GILGIL, NAKURU COUNTY · KENYA
        </span>
        <div className="utility-links">
          <Link href="/gallery">Gallery</Link>
          <Link href="/contact">Contact &amp; directions <ArrowUpRight size={12} /></Link>
        </div>
      </div>
      <header className="header">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/booking" className="button small">
            Book your stay <ArrowUpRight size={16} />
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="menu-button"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[
              ...nav,
              ["/gallery", "Gallery"],
              ["/team", "Our team"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main">{children}</main>
      <footer>
        <div className="footer-top">
          <div>
            <Brand />
            <p>A garden retreat in Kenya’s Great Rift Valley.</p>
          </div>
          <div>
            <span className="eyebrow">Explore Elyon</span>
            <Link href="/stays">Stay with us</Link>
            <Link href="/dining">Dining</Link>
            <Link href="/experiences">Experiences</Link>
            <Link href="/events">Meetings & celebrations</Link>
          </div>
          <div>
            <span className="eyebrow">Get to know us</span>
            <Link href="/about">Our story</Link>
            <Link href="/team">Our people</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact & directions</Link>
          </div>
          <div className="footer-invite">
            <h3>Spend a few days in Gilgil.</h3>
            <Link href="/booking" className="text-link">
              Plan your stay <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Elyon Elementaita Resort</span>
          <span>Gilgil, Nakuru County, Kenya</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Booking info</Link>
            <Link href="/admin">Admin demo</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
