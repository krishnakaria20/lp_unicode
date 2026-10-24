const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "You are not allowed to perform this action"
      });
    }

    next();
  };
};

export default roleMiddleware;
