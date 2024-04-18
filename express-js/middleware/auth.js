const ErrorHander = require('../utils/errorhander')
const jwt = require('jsonwebtoken')
// const User = require('../models/userModel')
const catchAsyncError = require('./catchAsyncError')
const { JWT_SECRET } = require('../constant')

// Universal Authentication Middleware
exports.isAuthenticated = catchAsyncError(async (req, _, next) => {
  //   const { token } = req.cookies;
  const authHeader = req.headers['authorization']

  if (typeof authHeader === 'undefined') {
    return next(new ErrorHander('un-authorized', 401))
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return next(new ErrorHander('Please Login to access this resource', 401))
  }
  const secret = JWT_SECRET
  const decodedData = jwt.verify(token, secret)
  req.user = decodedData
  // req.user = await User.findById(decodedData.id)
  next()
})

exports.isAuthorizeRoles = (...roles) => {
    return (req, _, next) => {
    const userRole = req.user.role;

    const isAuthorized = roles.some((role) => userRole === role);

    if (!isAuthorized) {
      return next(
        new ErrorHander(
          `Role: ${userRole} is not allowed to access this resource`,
          403,
        ),
      );
    }

    next(); 
  };
}
