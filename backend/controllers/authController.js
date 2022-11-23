import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Email from '../utils/email.js'
import crypto from 'crypto'
import generateToken from '../utils/generateToken.js'

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })

  const id = user._id
  const name = user.name
  const email = user.email
  const origURL = req.body.origURL
  if (!user) {
    res.status(404)
    throw new Error('There is no user with email address.')
  }

  // 2) Generate the random reset token
  //login token
  const genToken = generateToken(user._id)
  // email token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
  // 3) Send it to user's email
  try {
    // url with PARAMS to frontend
    const resetURL = `${req.protocol}://${origURL}/reset-password/${resetToken}/${name}/${email}/${id}/${genToken}`
    // url to frontend
    //const resetURL = `${req.protocol}://${origURL}/reset-password/${resetToken}`
    // url to backend
    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/reset-password?token=${resetToken}`
    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      Error('There was an error sending the email. Try again later!'),
      500
    )
  }
})

// const resetPassword = asyncHandler(async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex')

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   })
//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(Error('Token is invalid or has expired', 400))
//   }
//   user.password = req.body.password
//   user.passwordConfirm = req.body.passwordConfirm
//   user.passwordResetToken = undefined
//   user.passwordResetExpires = undefined
//   await user.save()
//   // 3 Update changedPasswordat property for the user
//   // 4 Log the user in, send JWT
//   createSendToken(user, 200, req, res)
// })

export default { forgotPassword }
