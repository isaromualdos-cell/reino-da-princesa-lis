import { get, head, list, put } from "@vercel/blob";

export type GuestKind = "adulto" | "crianca";
export type Guest = { name: string; kind: GuestKind };
export type Rsvp = { respondent: string; guests: Guest[]; attending: boolean; submittedAt: string };

export const guestLimit = 25;
export const nameLimit = 100;
export const validRsvpId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const prefix = "confirmacoes-lis/";
const testPrefix = "teste-confirmacoes-lis/";

function cleanedName(value: unknown) {
  if (typeof value !== "string") return "";
  const name = value.trim().replace(/\s+/g, " ");
  return name.length <= nameLimit ? name : "";
}

export function parseRsvp(value: unknown): Omit<Rsvp, "submittedAt"> | null {
  if (!value || typeof value !== "object") return null;
  const { respondent, guests, attending } = value as Record<string, unknown>;
  const name = cleanedName(respondent);
  if (!name || typeof attending !== "boolean" || !Array.isArray(guests)) return null;
  if (!attending) return guests.length === 0 ? { respondent: name, attending, guests: [] } : null;
  if (guests.length === 0 || guests.length > guestLimit) return null;
  const validated: Guest[] = [];
  for (const entry of guests) {
    const guestName = cleanedName(entry?.name);
    if (!guestName || (entry.kind !== "adulto" && entry.kind !== "crianca")) return null;
    validated.push({ name: guestName, kind: entry.kind });
  }
  return { respondent: name, attending, guests: validated };
}

function storagePrefix() {
  return process.env.LIS_RSVP_MODE === "live" ? prefix : testPrefix;
}

export async function saveRsvp(id: string, data: Omit<Rsvp, "submittedAt">) {
  const pathname = storagePrefix() + id + ".json";
  try {
    await put(pathname, JSON.stringify({ ...data, submittedAt: new Date().toISOString() }), {
      access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: false,
    });
  } catch {
    await head(pathname);
  }
}

export async function listRsvps() {
  let cursor: string | undefined;
  const responses: Rsvp[] = [];
  do {
    const page = await list({ prefix: storagePrefix(), limit: 100, cursor });
    for (let index = 0; index < page.blobs.length; index += 12) {
      const batch = page.blobs.slice(index, index + 12);
      const entries = await Promise.all(batch.map(async (blob) => {
        const result = await get(blob.url, { access: "private" });
        if (result?.statusCode !== 200) throw new Error("Missing RSVP");
        return new Response(result.stream).json() as Promise<Rsvp>;
      }));
      responses.push(...entries);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return responses.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}
