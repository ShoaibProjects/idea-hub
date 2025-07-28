export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred' 
    : err.message;

  res.status(500).json({ message });
};