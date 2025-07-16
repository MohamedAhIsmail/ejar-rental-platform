import joi from 'joi';

const processJoiSchema = joi.object({
  startDate: joi.date().greater('now').required(),
  endDate: joi.date().greater(joi.ref('startDate')).required(),
  price: joi.number().positive().required(),
});

export default processJoiSchema;
