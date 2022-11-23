import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import { forgotPasswordAction } from '../actions/userActions'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [messageSuccess, setMessageSuccess] = useState(null)

  const origURL = window.location.host

  const dispatch = useDispatch()

  const forgotPassword = useSelector((state) => state.forgotPassword)
  const { loading, error } = forgotPassword

  const submitHandler = (e) => {
    e.preventDefault()
    if (!email) {
      setMessage('You must enter an email address')
    } else {
      dispatch(forgotPasswordAction(email, origURL))
      setMessageSuccess('Reset link sent to your email')
    }
  }

  return (
    <FormContainer>
      <h1>Enter your email here</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {messageSuccess && <Message variant='success'>{messageSuccess}</Message>}

      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3'>
          Send password reset link
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ForgotPasswordScreen
