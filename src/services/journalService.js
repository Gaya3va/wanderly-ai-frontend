import { api } from "../api/api";

export const getJournals = () =>
  api("/journals");

export const createJournal = (data) =>
  api("/journals", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteJournal = (id) =>
  api(`/journals/${id}`, {
    method: "DELETE",
  });