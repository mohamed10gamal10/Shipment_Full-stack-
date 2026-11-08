export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function formatMoney(value) {
  const n = Number(value) || 0;
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP`;
}

// Tracking number: first 8 characters of the UUID.
export function trackingId(id) {
  return id ? id.replace(/-/g, "").slice(0, 8).toUpperCase() : "";
}

export function shipmentTotal(items = []) {
  return items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
}
