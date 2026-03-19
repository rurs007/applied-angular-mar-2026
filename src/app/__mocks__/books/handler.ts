import { HttpResponse, http } from 'msw';
import books from './books';

export const Books_Handlers = [
  http.get('/api/books', () => {
    return HttpResponse.json(books);
  }),
];
