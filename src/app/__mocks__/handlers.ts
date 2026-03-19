import { HttpHandler } from 'msw';
import authHandler from './auth/loggedInHandler';
import { resourceHandlers } from './resources/handler';

export const handlers: HttpHandler[] = [...authHandler, ...resourceHandlers];
