const fs = require('fs').promises
const cloudinary = require('cloudinary')
const bcrypt = require('bcryptjs')
const otpGenerator = require('otp-generator')
const User = require('../models/userModel')
const sendToken = require('../utils/generateJwtToken.js')
const ErrorHandler = require('../utils/errorhander.js')
const catchAsyncError = require('../middleware/catchAsyncError.js')

//Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !password) {
      return next(new ErrorHandler('Please provide a name and password', 400));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler(`${email} is already registered`, 401));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const createdUser = await User.create({ name, email, password: hashedPassword, role });

    // Prepare response payload
    const responsePayload = {
      id: createdUser._id,
      role: createdUser.role,
    };

    // Send token in response
    sendToken(responsePayload, 201, res);
  } catch (error) {
    // Handle any errors
    return next(new ErrorHandler(error.message, 500));
  }
});


//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid Email & Password', 401))
  }

  // Prepare response payload
  const responsePayload = {
    id: user._id,
    role: user.role,
  };

  try {
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid Email & Password !', 401))
    }

    sendToken(responsePayload, 200, res)
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})

//Logout
exports.logout = catchAsyncError(async (_, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.status(200).json({ success: true, message: 'Logged Out' })
})

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select('status')

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  // Check if user is active
  // if (user.status !== 'active') {
  //   return next(new ErrorHandler('User not active', 404))
  // }

  // generate otp
  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })

    // Save OTP to user
    user.otp = otp;
    user.otpVerified = false;
    await user.save();

    // Optionally, send OTP to the user via email or SMS

    res.status(200).json({ success: true, message: 'OTP sent successfully', otp });
  return res.json({
    success: true,
    message: 'OTP sent successfully',
  })
})

//Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { otp, email, password } = req.body

  // check user
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  // if (user.status !== 'active') {
  //   return next(new ErrorHandler('User not active', 404))
  // }

  if (otp === '1234') {
    // this otp from development and no need to be checked
  } else {
    if (user.otp != otp) {
      return next(new ErrorHandler("OTP doesn't matched", 401))
    }
  }

  // update password
  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)

  // udpate user by email
  user.password = newPassword
  await user.save()

  // return response
  return res.json({
    success: true,
    message: 'Password updated successfully',
  })
})

//Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    .populate('parent', 'name email') 
    .populate('children', 'name email').exec() 

  res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
})

//Update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old Password is incorrect', 400))
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't matched", 400))
  }

  user.password = req.body.newPassword

  await user.save()

  return res.json({
    success: true,
    message: 'Password updated successfully',
  })
})

//Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, _) => {
  const newUserData = req.body

  if (req.files && req.files.avatar) {
    if (req.user.avatar !== '') {
      const user = await User.findById(req.user.id)
      const imageId = user.avatar.public_id
      const tempFilePath = `temp_${Date.now()}.jpg`
      await fs.writeFile(tempFilePath, req.files.avatar.data)

      if (imageId === '') {
        const myCloud = await cloudinary.v2.uploader.upload(tempFilePath, {
          folder: 'avatars',
          width: 150,
          crop: 'scale',
        })

        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
        await fs.unlink(tempFilePath)
      } else {
        await cloudinary.v2.uploader.destroy(imageId)

        const myCloud = await cloudinary.v2.uploader.upload(tempFilePath, {
          folder: 'avatars',
          width: 150,
          crop: 'scale',
        })

        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
        await fs.unlink(tempFilePath)
      }
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({ success: true, user })
})

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`, 400),
    )
  }

  await user.deleteOne()
  res.status(200).json({ success: true, message: 'User Deleted Successfully' })
})

exports.imageUpload = catchAsyncError(async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

      let images = req.files.images; 

    // Check if images is not an array
    if (!Array.isArray(images)) {
      images = [images];
    }

    if (!images || images.length === 0) {
      return next(new ErrorHandler('Images not found', 404));
    }

    const uploadedImages = [];
    for (const image of images) {
      const tempFilePath = `temp_${Date.now()}_${image.name}`;
      await image.mv(tempFilePath);

      const myCloudImage = await cloudinary.v2.uploader.upload(tempFilePath, {
        folder: 'images',
        crop: 'scale',
      });

      uploadedImages.push({
        public_id: myCloudImage.public_id,
        url: myCloudImage.secure_url,
      });

      await fs.unlink(tempFilePath);
    }

    res.status(200).json({ success: true, imageUrls: uploadedImages });
  } catch (error) {
    next(error);
  }
})
