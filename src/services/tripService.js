import { api } from "../api/api";

export const getTrips = () =>
  api("/trips");

export const createTrip = (data) =>
  api("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteTrip = (id) =>
  api(`/trips/${id}`, {
    method: "DELETE",
  });