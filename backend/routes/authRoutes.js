import express from 'express'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import authController from '../controllers/authController.js'
import Email from '../utils/email.js'

const router = express.Router()

//
// @desc POST /api/users/login
// @access Public

router.post('/currentUser', async (req, res) => {
  const { dataInfo } = req.body
  const email = dataInfo.email

  const user = await User.findOne({ email })

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    const createdUser = await User.create({
      name: dataInfo.name,
      email: dataInfo.email,
      googleId: dataInfo.googleId,
    })
    // send welcome to new G user
    const url = `${req.protocol}://${req.get('host')}`

    await new Email(createdUser, url).sendWelcome()

    res.json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser._id),
    })
  }
})

router.post('/forgot-password', authController.forgotPassword)

//router.patch('/reset-password/:token', authController.resetPassword)

router.post('/contact', async (req, res) => {
  const data = req.body.contactForm
  const emailForm = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.emailMessage,
  }
  console.log(emailForm)
  await new Email(emailForm).sendContactForm()
})

export default router
