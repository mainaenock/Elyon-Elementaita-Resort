"use client";
import { useEffect, useState } from "react";
export function useLocalData<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {
      setError(
        "Local storage is unavailable. Changes will last only for this visit.",
      );
    }
    setReady(true);
  }, [key]);
  function save(next: T) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setError("Could not save on this device. Please keep this page open.");
    }
  }
  return [value, save, ready, error] as const;
}
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function useToday() {
  const [date, setDate] = useState<string>();
  useEffect(() => setDate(today()), []);
  return date;
}
export function nightsBetween(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}
