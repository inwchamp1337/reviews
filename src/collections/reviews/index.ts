import type { CollectionConfig } from 'payload'
import { reviewHooks } from './hooks'
import { reviewValidation } from './validation'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'movieTitle',
    defaultColumns: ['rating', 'user', 'movie', 'createdAt'],
  },
  hooks: reviewHooks,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who wrote this review',
      },
    },
    {
      name: 'movie',
      type: 'relationship',
      relationTo: 'movies',
      required: true,
      admin: {
        description: 'The movie being reviewed',
      },
    },
    {
      name: 'movieTitle',
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            // This will be populated via a hook
            return data.movieTitle;
          }
        ]
      }
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      validate: reviewValidation.validateRating,
      admin: {
        description: 'Rating from 1-10',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
      },
      defaultValue: () => new Date(),
    },
  ],
}

// export default Reviews