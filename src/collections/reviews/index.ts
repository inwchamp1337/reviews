import type { CollectionConfig } from 'payload'
import { reviewHooks } from './hooks'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    // เปลี่ยนจาก useAsTitle: 'movieTitle' เป็น rating หรือ id
    useAsTitle: 'id',
    // เอา movieTitle ออกจาก defaultColumns
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
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
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