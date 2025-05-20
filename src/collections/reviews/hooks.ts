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

// Example of an after-change hook to notify users
const notifyAboutReview: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation === 'create') {
    // เปลี่ยนจาก doc.movieTitle เป็น doc.id หรือ movie id
    console.log(`New review created with ID: ${doc.id}`)
  }
  
  return doc
}

export const reviewHooks = {
  beforeChange: [
    // ลบ fetchMovieTitle ออก
    addCreatedAt,
  ],
  afterChange: [
    notifyAboutReview,
  ]
}