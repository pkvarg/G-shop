import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import { login, getGoogleUserInfo } from '../actions/userActions'
import jwt_decode from 'jwt-decode'
const LoginScreen = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin
  const location = useLocation()
  const redirect = location.search ? location.search.split('=')[1] : '/'
  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const [user, setUser] = useState({})

  const handleCallbackResponse = (response) => {
    let userObject = jwt_decode(response.credential)
    setUser(userObject)
    document.getElementById('signInDiv').hidden = true
    // G
    const data = {
      name: userObject.name,
      email: userObject.email,
      googleId: userObject.sub,
      //token: response.credential,
      isAdmin: false,
    }
    //console.log(data)
    dispatch(getGoogleUserInfo(data))
  }

  const handleSignOut = (event) => {
    setUser({})
    localStorage.removeItem('userInfo')
    document.getElementById('signInDiv').hidden = false
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_ID,
      callback: handleCallbackResponse,
    })

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    })

    // google.accounts.id.prompt()
  })

  return (
    <FormContainer>
      <h1>Sign In</h1>
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

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-3'>
          Sign In
        </Button>

        <Row className='py-3'>
          <Col>
            <Link
              to={
                redirect
                  ? `/forgot-password?redirect=${redirect}`
                  : '/forgot-password'
              }
            >
              Forgot password?
            </Link>
          </Col>
        </Row>

        <div id='signInDiv'></div>

        {user && (
          <div className='my-3'>
            <img src={user.picture} alt={user.picture}></img>
            <h3>{user.name}</h3>
          </div>
        )}

        {Object.keys(user).length !== 0 && (
          <Button
            className='my-1'
            variant='primary'
            onClick={(e) => handleSignOut(e)}
          >
            Google Sign Out
          </Button>
        )}
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
