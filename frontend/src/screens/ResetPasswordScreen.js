import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import { resetPasswordAction } from '../actions/userActions'

const ResetPasswordScreen = () => {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const resetPassword = useSelector((state) => state.resetPassword)
  const { loading, error, userInfo } = resetPassword
  const location = useLocation()
  const redirect = location.search ? location.search.split('=')[1] : '/'
  const params = useParams()
  const token = params.token
  console.log(token)

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
      dispatch(resetPasswordAction(password, confirmPassword, token))
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='my-3'
          data-token={token ? token : ''}
        >
          Change Password
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ResetPasswordScreen
