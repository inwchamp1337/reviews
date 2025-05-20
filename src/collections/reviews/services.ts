import payload from 'payload'

export const reviewServices = {
  async getMovieAverageRating(movieId: string) {
    try {
      const reviews = await payload.find({
        collection: 'reviews',
        where: {
          movie: {
            equals: movieId,
          },
        },
      })

      if (!reviews.docs.length) return null

      const total = reviews.docs.reduce((sum, review) => sum + review.rating, 0)
      return total / reviews.docs.length
    } catch (error) {
      console.error('Error calculating average rating:', error)
      return null
    }
  },

  async getUserReviews(userId: string) {
    try {
      return await payload.find({
        collection: 'reviews',
        where: {
          user: {
            equals: userId,
          },
        },
        sort: '-createdAt',
      })
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      return { docs: [] }
    }
  },
}