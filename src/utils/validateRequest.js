//Helper function to validate request body against a Joi schema.
const validateRequest = (schema, data) => {
  const { error } = schema.validate(data);
  return error ? error.details[0].message : null;
};

module.exports = validateRequest;
