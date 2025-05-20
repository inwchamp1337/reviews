import type { CollectionConfig } from 'payload'
import { commentHooks } from './hooks'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'user', 'review', 'createdAt'],
  },
  hooks: commentHooks,
  fields: [
    {
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
      required: true,
      admin: {
        description: 'The review this comment belongs to',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who wrote this comment',
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