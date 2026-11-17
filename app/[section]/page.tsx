import { notFound } from "next/navigation";
import { SectionPage } from "@/components/pages";
const titles: Record<string, string> = {
  stays: "Stay with us",
  dining: "At our table",
  experiences: "The art of slowing down",
  events: "Gather beautifully",
  about: "Our story",
  team: "The people behind your stay",
  gallery: "A glimpse of Elyon",
  contact: "Let’s plan your escape",
  booking: "Your next chapter",
  privacy: "Privacy",
  terms: "Booking information",
};
export function generateStaticParams() {
  return Object.keys(titles).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return { title: titles[section] || "Not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!titles[section]) notFound();
  return <SectionPage section={section} />;
}
