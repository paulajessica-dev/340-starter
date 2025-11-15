module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).render("errors/error", {
    title: `${status} - Error`,
    message: err.message,
    status,
    layout: false
  });
};
