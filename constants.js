// Shipment statuses exactly as the Django backend sends them.
export const STATUS = {
  created:         { label: "Created",          color: "var(--st-created)" },
  pickup:          { label: "Pickup",           color: "var(--st-pickup)" },
  in_transit:      { label: "In transit",       color: "var(--st-in-transit)" },
  out_for_transit: { label: "Out for delivery", color: "var(--st-out)" },
  delivered:       { label: "Delivered",        color: "var(--st-delivered)" },
  cancelled:       { label: "Cancelled",        color: "var(--st-cancelled)" },
};

// The normal journey of a parcel, in order (cancelled is outside the journey).
export const JOURNEY = ["created", "pickup", "in_transit", "out_for_transit", "delivered"];

// `value` must match the backend choices exactly (note "medcine" is spelled that way in the API).
export const ITEM_TYPES = [
  { value: "Electronics", label: "Electronics" },
  { value: "electrical",  label: "Electrical" },
  { value: "Furniture",   label: "Furniture" },
  { value: "wood",        label: "Wood" },
  { value: "medcine",     label: "Medicine" },
  { value: "etc",         label: "Other" },
];

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];
