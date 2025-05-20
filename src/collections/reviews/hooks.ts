import { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload/types'

// Fetch movie title when creating/updating a review
const fetchMovieTitle: CollectionBeforeChangeHook = async ({ 
  data,
  req,
}) => {
  if (data.movie) {
    const movieId = typeof data.movie === 'object' ? data.movie.id : data.movie
    try {
      const movie = await req.payload.findByID({
        collection: 'movies',
        id: movieId,
      })
      
      if (movie) {
        data.movieTitle = movie.title
      }
    } catch (err) {
      console.error('Error fetching movie title:', err)
    }
  }
  
  return data
}

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
    // You could send notifications, update stats, etc.
    console.log(`New review created for movie: ${doc.movieTitle}`)
  }
  
  return doc
}

export const reviewHooks = {
  beforeChange: [
    fetchMovieTitle,
    addCreatedAt,
  ],
  afterChange: [
    notifyAboutReview,
  ]
}