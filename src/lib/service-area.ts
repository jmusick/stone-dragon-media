/**
 * The business's authorized service area — the single source of truth.
 *
 * Consumed by the homepage "Areas We Serve" list and `LocalBusiness`/`Organization` JSON-LD,
 * and by the `Service` JSON-LD on the `/services/<category>/` pages. Keep them fed from here
 * so the visible list and `areaServed` can't drift apart.
 *
 * `inPersonCities` is the in-person ring (about an hour from Sandusky) and is the ONLY thing
 * that goes into `areaServed`. Remote coverage is described separately and must never be mixed
 * into it. Don't move Columbus/Akron/Canton/Lima into the in-person ring. City/state only —
 * the business is home-based, so no street address anywhere.
 */
export const serviceAreaState = "OH";

export const inPersonCities: string[] = [
  "Sandusky",
  "Huron",
  "Castalia",
  "Milan",
  "Berlin Heights",
  "Vermilion",
  "Wakeman",
  "Norwalk",
  "Monroeville",
  "Bellevue",
  "Clyde",
  "Willard",
  "New London",
  "Fremont",
  "Tiffin",
  "Port Clinton",
  "Marblehead",
  "Catawba Island",
  "Oak Harbor",
  "Kelleys Island",
  "Put-in-Bay",
  "Amherst",
  "Oberlin",
  "Lorain",
  "Elyria",
  "Toledo",
  "Cleveland",
];

/** In-person cities as "City, ST" strings, for schema.org `areaServed`. */
export const inPersonAreaServed: string[] = inPersonCities.map(
  (city) => `${city}, ${serviceAreaState}`,
);

/** Remote coverage: described in visible copy only, never in `areaServed`. */
export const remoteCoverage = {
  /** Larger cities beyond the in-person ring that are worked with remotely. */
  exampleCities: ["Columbus", "Akron", "Canton", "Lima"],
  /** Who else is served remotely. */
  scope: "clients anywhere in the US",
};

/** "A, B, C, and D" */
export function joinList(items: string[]): string {
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
