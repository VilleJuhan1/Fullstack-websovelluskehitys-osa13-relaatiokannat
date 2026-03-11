const errorHandler = (err, req, res, next) => {
  console.error(err);

	// Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: err.errors.map(e => e.message).join(', '),
    });

	// Handle Sequelize unique constraint errors
	} else if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: err.errors.map(e => e.message).join(', '),
    });

  // Handle unknown endpoints
  } else if (res.status === 404) {
    return res.status(404).json({
      message: err.message,
    });

	// Handle other errors with a specified status
  } else if (err.status) {
    return res.status(err.status).json({
      message: err.message || "Internal Server Error",
    });
		
	// Handle any other unexpected errors
  } else {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = errorHandler
