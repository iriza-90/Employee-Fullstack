const Joi = require('joi');

const employeeSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  salary: Joi.number().positive(),
  hireDate: Joi.date().iso()
});

module.exports = (req, res, next) => {
  const { error } = employeeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};