import { Validate } from 'payload/types'

const validateRating: Validate = ({ value, siblingData }) => {
  const rating = Number(value)
  
  if (isNaN(rating)) {
    return 'Rating must be a number'
  }
  
  if (rating < 1 || rating > 10) {
    return 'Rating must be between 1 and 10'
  }
  
  return true
}

export const reviewValidation = {
  validateRating,
}