import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import { forgotPasswordAction } from '../actions/userActions'

const ResetPasswordScreen = () => {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const forgotPassword = useSelector((state) => state.forgotPassword)
  const { loading, error, userInfo } = forgotPassword
  const location = useLocation()
  const redirect = location.search ? location.search.split('=')[1] : '/'
  // useEffect(() => {
  //   if (email) {
  //     navigate(redirect)
  //   }
  // }, [navigate, email, redirect])

  // if no email message = enter email ???
  const submitHandler = (e) => {
    e.preventDefault()
    if (!password) {
      setMessage('You must enter a password')
    } else {
      dispatch(forgotPasswordAction(password))
    }
  }

  return (
    <FormContainer>
      <h1>Enter your new password here</h1>
      {message && <Message variant='danger'>{message}</Message>}

      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            //value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            //value={confirmPassword}
            //onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3'>
          Change Password
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ResetPasswordScreen
