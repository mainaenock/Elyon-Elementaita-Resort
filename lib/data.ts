export const money = (value: number) => `KES ${value.toLocaleString("en-KE")}`;
export type Room = {
  id: string;
  name: string;
  category: string;
  price: number;
  guests: number;
  image: string;
  description: string;
  amenities: string[];
};
export const rooms: Room[] = [
  {
    id: "garden-deluxe",
    name: "Garden Deluxe",
    category: "For two",
    price: 8500,
    guests: 2,
    image: "resort",
    description:
      "A restful base for slow mornings and time together, surrounded by the greenery of Elyon.",
    amenities: ["Double bed", "Breakfast plan", "Garden setting"],
  },
  {
    id: "courtyard-twin",
    name: "Courtyard Twin",
    category: "With friends",
    price: 10500,
    guests: 2,
    image: "courtyard",
    description:
      "An easy retreat to share, with space to unwind after a day exploring the region.",
    amenities: ["Twin beds", "Breakfast plan", "Courtyard setting"],
  },
  {
    id: "family-retreat",
    name: "Family Retreat",
    category: "For families",
    price: 14500,
    guests: 4,
    image: "gardens",
    description:
      "Make room for everyone. A relaxed option for family weekends and longer escapes.",
    amenities: ["Family layout", "Breakfast plan", "Up to four guests"],
  },
];
export const photos = [
  {
    id: "resort",
    title: "A welcome among the greenery",
    category: "The resort",
  },
  { id: "gardens", title: "The garden, in its own time", category: "Gardens" },
  { id: "path", title: "Take the slower path", category: "Gardens" },
  {
    id: "aerial",
    title: "A little space to reconnect",
    category: "Experiences",
  },
  { id: "breakfast", title: "A taste of home", category: "Dining" },
  { id: "chef", title: "From our kitchen", category: "Dining" },
  { id: "entrance", title: "Welcome to Elyon", category: "The resort" },
  { id: "gate", title: "Your escape begins here", category: "The resort" },
  { id: "courtyard", title: "Room to breathe", category: "The resort" },
  { id: "fruit", title: "Fresh beginnings", category: "Dining" },
  { id: "terrace", title: "A different perspective", category: "The resort" },
  { id: "lawn", title: "Under an open sky", category: "Gardens" },
  { id: "service", title: "Hospitality from the heart", category: "Dining" },
  { id: "hall", title: "A place to come together", category: "Experiences" },
  { id: "reception", title: "Step inside", category: "The resort" },
];
export const nav = [
  ["/", "Home"],
  ["/stays", "Rooms"],
  ["/dining", "Dining"],
  ["/experiences", "Experiences"],
  ["/events", "Meetings & events"],
  ["/about", "Our story"],
] as const;
export type Booking = {
  id: string;
  name: string;
  email: string;
  room: string;
  checkin: string;
  checkout: string;
  guests: number;
  total: number;
  status: "Requested" | "Confirmed" | "Cancelled";
  created: string;
};
export const demoBookings: Booking[] = [
  {
    id: "ELY-DEMO01",
    name: "Sample guest A",
    email: "guest-a@example.com",
    room: "Garden Deluxe",
    checkin: "2026-10-16",
    checkout: "2026-10-18",
    guests: 2,
    total: 17000,
    status: "Requested",
    created: "2026-09-30",
  },
  {
    id: "ELY-DEMO02",
    name: "Sample guest B",
    email: "guest-b@example.com",
    room: "Family Retreat",
    checkin: "2026-10-22",
    checkout: "2026-10-25",
    guests: 4,
    total: 43500,
    status: "Confirmed",
    created: "2026-09-30",
  },
];
