import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZARand(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatSAPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) return `+27 ${cleaned.slice(1)}`;
  if (cleaned.startsWith("27")) return `+${cleaned}`;
  return phone;
}

export const CATEGORIES = {
  new_launch: "New Launch",
  clearance: "Clearance",
  out_of_season: "Out of Season",
  odd_sizing: "Odd Sizing",
  closing_down: "Closing Down Inventory",
} as const;

export const BOX_SIZES = {
  XS: "XS — 1-2 items",
  S: "S — Small package",
  M: "M — Medium package",
  L: "L — Large package",
  XL: "XL — Bulk/Boxing",
} as const;

export const PUDO_BOX_PRICES = {
  XS: 35,
  S: 45,
  M: 55,
  L: 65,
  XL: 85,
} as const;

export const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
] as const;