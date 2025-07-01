module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Erreur interne du serveur';
  const details = err.details || undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }

  res.status(status).json({
    success: false,
    error: message,
    details,
    status,
  });
};