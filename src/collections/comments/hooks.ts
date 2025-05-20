import { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload/types'

// Add timestamps on creation
const addCreatedAt: CollectionBeforeChangeHook = async ({
  operation,
  data,
}) => {
  if (operation === 'create') {
    data.createdAt = new Date()
  }
  
  return data
}

// Notify when comment is created
const notifyAboutComment: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation === 'create') {
    console.log(`New comment created with ID: ${doc.id}`)
  }
  
  return doc
}

export const commentHooks = {
  beforeChange: [
    addCreatedAt,
  ],
  afterChange: [
    notifyAboutComment,
  ]
}