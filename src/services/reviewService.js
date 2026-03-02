import { api } from '../api';

export const getReviews = (destinationId) =>
  api(`/reviews?destinationId=${destinationId}`);