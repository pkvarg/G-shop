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
  // const { search } = useLocation()
  const redirect = location.search ? location.search.split('=')[1] : '/'
  useEffect(() => {
    if (userInfo) {
      console.log('userInfoLogin: ', userInfo)
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const [user, setUser] = useState({})

  const handleCallbackResponse = (response) => {
    console.log('Encoded JWT ID token: ' + response.credential)
    let userObject = jwt_decode(response.credential)
    console.log(userObject)
    setUser(userObject)
    document.getElementById('signInDiv').hidden = true
  }

  const handleSignOut = (event) => {
    setUser({})
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

    google.accounts.id.prompt()
  }, [])
  // If no user: sign in btn
  // If user: log out btn
  const handleFailure = (result) => {
    console.log(result)
    alert(result)
  }

  // const handleLogin = async (googleData) => {
  //   console.log(googleData)

  //   const res = await fetch('/api/google-login', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       token: googleData.tokenId,
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })

  //   const data = await res.json()
  //   setLoginData(data)
  //   localStorage.setItem('loginData', JSON.stringify(data))
  //   // G
  //   console.log(googleData.profileObj.email, googleData.googleId)
  //   data.googleId = googleData.googleId
  //   //data._id = googleData.googleId
  //   data.token = googleData.tokenId
  //   data.isAdmin = false
  //   // localStorage.setItem('userInfo', JSON.stringify(data))
  //   dispatch(getGoogleUserInfo(data))
  //   console.log(userInfo)
  // }
  // const handleLogout = () => {
  //   localStorage.removeItem('loginData')
  //   setLoginData(null)
  //   // G
  //   // const x = localStorage.getItem('userInfo')
  //   // console.log(x)
  //   //localStorage.removeItem('userInfo')
  // }

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

        <div id='signInDiv'></div>

        {user && (
          <div className='my-3'>
            <img src={user.picture}></img>
            <h3>{user.name}</h3>
          </div>
        )}

        {Object.keys(user).length != 0 && (
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
