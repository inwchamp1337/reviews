import type { CollectionConfig } from 'payload'

export const Movie: CollectionConfig = {
  slug: 'movies',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'releaseDate',
      type: 'date',
      required: true,
    },
    {
      name: 'genre',
      type: 'text',
      required: true,
    },
    {
      name: 'poster',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      required: false,
      admin: {
        description: 'Select a poster image for this movie',
      },
    },
  ],
}