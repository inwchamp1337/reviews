import payload from 'payload'

export const commentServices = {
  // ดึง comments ตาม reviewId
  async getReviewComments(reviewId: string) {
    try {
      return await payload.find({
        collection: 'comments',
        where: {
          review: {
            equals: reviewId,
          },
        },
        sort: '-createdAt',
      })
    } catch (error) {
      console.error('Error fetching review comments:', error)
      return { docs: [] }
    }
  },

  // ดึง comments ของ user
  async getUserComments(userId: string) {
    try {
      return await payload.find({
        collection: 'comments',
        where: {
          user: {
            equals: userId,
          },
        },
        sort: '-createdAt',
      })
    } catch (error) {
      console.error('Error fetching user comments:', error)
      return { docs: [] }
    }
  },

  // สร้าง comment
  async createComment(reviewId: string, userId: string, content: string) {
    try {
      return await payload.create({
        collection: 'comments',
        data: {
          review: reviewId,
          user: userId,
          content,
        }
      })
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  // นับ comments ต่อ review
  async countReviewComments(reviewId: string) {
    try {
      const result = await payload.find({
        collection: 'comments',
        where: {
          review: {
            equals: reviewId,
          },
        },
        limit: 0,
      })
      
      return result.totalDocs
    } catch (error) {
      console.error('Error counting review comments:', error)
      return 0
    }
  },

  // ฟังก์ชันแก้ไขความเห็น
  async updateComment(commentId: string, userId: string, newContent: string) {
    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของความเห็น
    const comment = await payload.findByID({ collection: 'comments', id: commentId })
    if (comment.user !== userId) {
      throw new Error('Unauthorized: You can only edit your own comments')
    }
    
    return await payload.update({
      collection: 'comments',
      id: commentId,
      data: { content: newContent }
    })
  },

  // ฟังก์ชันลบความเห็น
  async deleteComment(commentId: string, userId: string, isAdmin: boolean = false) {
    if (!isAdmin) {
      // ตรวจสอบว่าผู้ใช้เป็นเจ้าของความเห็น
      const comment = await payload.findByID({ collection: 'comments', id: commentId })
      if (comment.user !== userId) {
        throw new Error('Unauthorized: You can only delete your own comments')
      }
    }
    
    return await payload.delete({ collection: 'comments', id: commentId })
  }
}