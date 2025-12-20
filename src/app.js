import { Hono } from 'hono';
import dotenv from 'dotenv';

import { addMiddleware } from './middleware';
import { contactRouter } from './routes/contact';
import { healthRouter } from './routes/health';

dotenv.config();

const app = new Hono();
const PORT = process.env.PORT || 3000;

addMiddleware(app);

app.route('/', contactRouter);
app.route('/', healthRouter);

export default app;
