import { api } from "../api/api";

export const getDestinations = () =>
  api("/destinations");

export const getDestinationById = (id) =>
  api(`/destinations/${id}`);