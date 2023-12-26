const express = require('express');
const crypto = require('crypto');
const movies = require('./movies');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:3000',
        'https://movies-app-frontend.herokuapp.com'
      ];

      if (ACCEPTED_ORIGINS.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    }
  })
);
app.disable('x-powered-by');

app.get('/movies', (req, res) => {
  const { genre, year } = req.query;
  let filteredMovies = movies;

  if (genre)
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  if (year)
    filteredMovies = filteredMovies.filter(
      (movie) => movie.year === Number(year)
    );

  res.json(filteredMovies);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors.map((error) => error.message)
    });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors.map((error) => error.message)
    });
  }

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1)
    return res.status(404).json({ message: 'Movie not found' });

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  };

  movies[movieIndex] = updatedMovie;
  res.json(updatedMovie);
});

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1)
    return res.status(404).json({ message: 'Movie not found' });

  movies.splice(movieIndex, 1);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
