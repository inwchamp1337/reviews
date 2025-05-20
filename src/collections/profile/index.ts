import type { CollectionConfig } from 'payload'

export const Profile: CollectionConfig = {
  slug: 'profile',
  access: {
    
    create: () => false,
    update: () => false,
    delete: () => false,
    read: ({ req }) => {
     
      return Boolean(req.user)
    },
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['email', 'id'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { description: 'ข้อมูลผู้ใช้' },
    },
   
  ],
}