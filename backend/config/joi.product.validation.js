import Joi from 'joi';

export const ProductSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 30 characters',
  }),

  category: Joi.string().required().messages({
    'string.empty': 'CategoryID is required',
  }),

  description: Joi.string().required().min(20).max(300).messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 20 characters',
    'string.max': 'Description must be at most 300 characters',
  }),

  daily: Joi.string().min(1).max(10).required().messages({
    'string.empty': 'Daily price is required',
    'string.min': 'Daily price must be at least 1 character',
    'string.max': 'Daily price must be at most 10 characters',
  }),

  image: Joi.string().uri().optional().messages({
    'string.uri': 'Image must be a valid URL',
  }),
});