import express from 'express'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

const router = express.Router()

// router.get('/currentuser', (req, res) => {
//   const user = req.user
//   console.log(user)
//   if (user) {
//     res.json({
//       _id: user._id,
//       googleId: user.googleId,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user._id),
//     })
//   } else {
//     res.send(null)
//   }
// })

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
    res.json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser._id),
    })
  }
})

export default router
