function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;

  
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    error: message,
  });
}

module.exports = errorHandler;