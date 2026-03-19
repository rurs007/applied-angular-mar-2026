import { delay, http, HttpResponse } from 'msw';

let fakeResources = [
  {
    id: '1',
    title: 'Angular Site',
    url: 'https://angular.dev',
  },
  {
    id: '2',
    title: 'NGRX',
    url: 'https://ngrx.io',
  },
  {
    id: '3',
    title: 'RxJS',
    url: 'https://rxjs.dev',
  },
  {
    id: '4',
    title: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
  },
  {
    id: '5',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
  },
  {
    id: '6',
    title: 'Web.dev',
    url: 'https://web.dev',
  },
  {
    id: '7',
    title: 'Can I Use',
    url: 'https://caniuse.com',
  },
  {
    id: '8',
    title: 'CSS Tricks',
    url: 'https://css-tricks.com',
  },
  {
    id: '9',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
  },
  {
    id: '10',
    title: 'Vite',
    url: 'https://vitejs.dev',
  },
  {
    id: '11',
    title: 'Vitest',
    url: 'https://vitest.dev',
  },
  {
    id: '12',
    title: 'Playwright',
    url: 'https://playwright.dev',
  },
  {
    id: '13',
    title: 'TC39 Proposals',
    url: 'https://tc39.es/ecma262/',
  },
  {
    id: '14',
    title: 'Jake Archibald on the Web',
    url: 'https://jakearchibald.com',
  },
];

export const resourceHandlers = [
  http.get('/api/resources', async () => {
    await delay();
    return HttpResponse.json(fakeResources);
  }),

  http.get('/api/resources/:id', async ({ params }) => {
    await delay();
    const resource = fakeResources.find((r) => r.id === params['id']);
    if (!resource) {
      return HttpResponse.json({ message: 'Resource not found' }, { status: 404 });
    }
    return HttpResponse.json(resource);
  }),

  http.post('/api/resources', async ({ request }) => {
    await delay();
    const body = await request.json() as { title: string; url: string };
    if (new URL(body.url).hostname.includes('geico.com')) {
      return HttpResponse.json(
        { message: 'We do not allow links to our competitors.' },
        { status: 400 },
      );
    }
    const newResource = { id: crypto.randomUUID(), ...body };
    fakeResources = [...fakeResources, newResource];
    return HttpResponse.json(newResource, { status: 201 });
  }),
];
