import { request } from "./client";

export const authApi = {
  register: (body) => request("/auth/registeruser", { method: "POST", body, auth: false }),
  login: (body) => request("/auth/loginuser", { method: "POST", body, auth: false }),
  me: () => request("/auth/me"),
};

export const customerApi = {
  create: (body) => request("/Customer/ADD", { method: "POST", body }),
  me: () => request("/Customer/me"),
  list: (page = 1) => request(`/Customer/get?page=${page}`),
};

export const shipmentApi = {
  create: (body) => request("/Shipment/add", { method: "POST", body }),
  list: (page = 1) => request(`/Shipment/Get?page=${page}`),
  get: (id) => request(`/Shipment/${id}`),
};

// The API returns 10 items per page. This walks through all pages and returns one array.
export async function fetchAllPages(fetchPage, maxPages = 30) {
  let all = [];
  for (let page = 1; page <= maxPages; page++) {
    const data = await fetchPage(page);
    all = all.concat(data.results || []);
    if (!data.next) break;
  }
  return all;
}
