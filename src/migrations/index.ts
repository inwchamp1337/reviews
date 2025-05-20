import * as migration_20250520_070632_seed_users from './20250520_070632_seed_users';
import * as migration_20250520_071205_seed_reviews from './20250520_071205_seed_reviews';
import * as migration_20250520_071250_seed_movies from './20250520_071250_seed_movies';
import * as migration_20250520_071328_seed_comments from './20250520_071328_seed_comments';

export const migrations = [
  {
    up: migration_20250520_070632_seed_users.up,
    down: migration_20250520_070632_seed_users.down,
    name: '20250520_070632_seed_users',
  },
  {
    up: migration_20250520_071205_seed_reviews.up,
    down: migration_20250520_071205_seed_reviews.down,
    name: '20250520_071205_seed_reviews',
  },
  {
    up: migration_20250520_071250_seed_movies.up,
    down: migration_20250520_071250_seed_movies.down,
    name: '20250520_071250_seed_movies',
  },
  {
    up: migration_20250520_071328_seed_comments.up,
    down: migration_20250520_071328_seed_comments.down,
    name: '20250520_071328_seed_comments'
  },
];
