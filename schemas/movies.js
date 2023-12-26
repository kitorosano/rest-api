const z = require('zod');

const movieSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'Title must be a string',
      required_error: 'Title is required'
    })
    .min(1)
    .max(255),
  year: z.number({
    invalid_type_error: 'Year must be a number',
    required_error: 'Year is required'
  }).int({
    invalid_type_error: 'Year must be an integer'
  }).min(1900).max(2024),
  director: z.string({
    invalid_type_error: 'Director must be a string',
    required_error: 'Director is required'
  }),
  duration: z.number({
    invalid_type_error: 'Duration must be a number',
    required_error: 'Duration is required'
  }).int().min(1).max(500),
  poster: z.string({
    invalid_type_error: 'Poster must be a string',
    required_error: 'Poster is required'
  }).url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Comedy',
      'Crime',
      'Drama',
      'Fantasy',
      'Horror',
      'Mystery',
      'Thriller',
      'Western',
      'Sci-Fi'
    ]),
    {
      required_error: 'Genre is required',
      invalid_type_error: 'Genre must be an array of valid genres'
    }
  ),
  rate: z.number({
    invalid_type_error: 'Rate must be a number',
    required_error: 'Rate is required'
  }).min(0).max(10)
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = { validateMovie, validatePartialMovie };
