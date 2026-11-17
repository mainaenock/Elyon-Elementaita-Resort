"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { sitePath } from "@/lib/site-path";
export function Photo({
  id,
  alt,
  className = "",
  eager = false,
}: {
  id: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const portrait = [
    "aerial",
    "path",
    "fruit",
    "terrace",
    "lawn",
    "service",
  ].includes(id);
  return (
    <img
      className={className}
      src={sitePath(`/images/${id}.webp`)}
      srcSet={
        id === "logo"
          ? undefined
          : `${sitePath(`/images/${id}-small.webp`)} 640w, ${sitePath(`/images/${id}.webp`)} ${portrait ? 941 : 1672}w`
      }
      sizes={
        eager
          ? "100vw"
          : "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 40vw"
      }
      width={portrait ? 941 : 1672}
      height={portrait ? 1672 : 941}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
    />
  );
}
export function Intro({
  label,
  title,
  children,
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {children && <p className="intro-copy">{children}</p>}
    </div>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function Banner() {
  return (
    <section className="cta-banner">
      <div>
        <h2>Make time for Elementaita.</h2>
      </div>
      <Link href="/booking" className="button gold">
        Plan your stay <ArrowRight size={18} />
      </Link>
    </section>
  );
}
