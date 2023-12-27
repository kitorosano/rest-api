import { MovieModel } from '../models/database/movie.js ';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
  static async getAll(req, res) {
    const { genre, year } = req.query;
    const filteredMovies = await MovieModel.getAll({ genre, year });
    res.json(filteredMovies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);

    res.status(404).json({ message: 'Movie not found' });
  }

  static async create(req, res) {
    const result = validateMovie(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map((error) => error.message)
      });
    }

    const newMovie = await MovieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map((error) => error.message)
      });
    }

    const updatedMovie = await MovieModel.update({ id, input: result.data });
    if (!updatedMovie)
      return res.status(404).json({ message: 'Movie not found' });

    res.json(updatedMovie);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const deletedMovie = await MovieModel.delete({ id });

    if (!deletedMovie)
      return res.status(404).json({ message: 'Movie not found' });

    res.json({ message: 'Movie deleted' });
  }
}
