import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

// Rutas
app.use('/movies', moviesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
