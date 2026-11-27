import type { Guest } from "../rsvp";

export function confirmationText(adults: Guest[], children: Guest[]) {
  return [
    { label: "Adultos", guests: adults },
    { label: "Crianças", guests: children },
  ]
    .filter(({ guests }) => guests.length > 0)
    .map(({ label, guests }) => `${label} (${guests.length})\n${guests.map(({ name }) => `• ${name}`).join("\n")}`)
    .join("\n\n");
}
