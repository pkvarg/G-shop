import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import {
  sendContactFormAction,
  sendCounter,
  ccc,
} from '../actions/contactActions'

const ContactScreen = () => {
  const x = process.env.REACT_APP_PASSWORD_GROUP_ONE
  const y = process.env.REACT_APP_PASSWORD_GROUP_TWO

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [passwordGroupOne, setPasswordGroupOne] = useState(x)
  const [passwordGroupTwo, setPasswordGroupTwo] = useState(y)

  const [message, setMessage] = useState(null)
  const [messageSuccess, setMessageSuccess] = useState(null)

  const dispatch = useDispatch()

  const forgotPassword = useSelector((state) => state.forgotPassword)
  const { loading, error } = forgotPassword

  const contactForm = {
    name,
    email,
    subject,
    emailMessage,
  }
  const submitHandler = (e) => {
    e.preventDefault()
    if (passwordGroupOne !== x || passwordGroupTwo !== y) {
      setMessage('Not sent! Try to contact us via email or phone, please')
      setName('')
      setEmail('')
      setSubject('')
      setEmailMessage('')
    } else {
      dispatch(sendContactFormAction(contactForm))
      setMessageSuccess('Your message was successfully sent')
      setName('')
      setEmail('')
      setSubject('')
      setEmailMessage('')
    }
  }

  return (
    <>
      <FormContainer>
        <h1>Send us a message</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {messageSuccess && (
          <Message variant='success'>{messageSuccess}</Message>
        )}

        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name and Surname</Form.Label>
            <Form.Control
              required
              type='name'
              placeholder='Enter name and surname'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              required
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='subject'>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              required
              type='subject'
              placeholder='Enter subject'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='message'>
            <Form.Label>Message</Form.Label>
            <Form.Control
              required
              as='textarea'
              rows={10}
              type='textarea'
              placeholder='Enter message'
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            />
          </Form.Group>
          {/* passwords  */}
          <Form.Group controlId='password-one'>
            <Form.Control
              className='password-group'
              placeholder=''
              type='text'
              defaultValue={passwordGroupOne}
              onChange={(e) => setPasswordGroupOne(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password-two'>
            <Form.Control
              className='password-group'
              placeholder=''
              type='text'
              defaultValue={passwordGroupTwo}
              onChange={(e) => setPasswordGroupTwo(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-3'>
            Send
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default ContactScreen
