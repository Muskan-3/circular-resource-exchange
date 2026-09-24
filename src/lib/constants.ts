export const CATEGORIES = [
  { value: "fabric_scraps", label: "Fabric Scraps" },
  { value: "wood_offcuts", label: "Wood Offcuts" },
  { value: "packaging", label: "Packaging" },
  { value: "surplus_inventory", label: "Surplus Inventory" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "other", label: "Other" },
] as const;

export type ListingCategory = (typeof CATEGORIES)[number]["value"];

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
] as const;

export type ListingCondition = (typeof CONDITIONS)[number]["value"];

export const ROLES = [
  { value: "donor", label: "Donor" },
  { value: "business", label: "Business" },
  { value: "collector", label: "Collector" },
] as const;

export type UserRole = (typeof ROLES)[number]["value"];

export const LISTING_STATUSES = ["available", "pending", "exchanged"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function conditionLabel(value: string) {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}
