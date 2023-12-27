import { readJSON } from '../utils.js';
import { randomUUID } from 'crypto';

const movies = readJSON('./movies.json');

export class MovieModel {
  static async getAll({ genre, year }) {
    let filteredMovies = movies;

    if (genre)
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );

    if (year)
      filteredMovies = filteredMovies.filter(
        (movie) => movie.year === Number(year)
      );

    return filteredMovies;
  }

  static async getById({ id }) {
    return movies.find((movie) => movie.id === id);
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    };
    movies.push(newMovie);
    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    const updatedMovie = {
      ...movies[movieIndex],
      ...input
    };

    movies[movieIndex] = updatedMovie;
    return updatedMovie;
  }
}
