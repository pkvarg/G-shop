import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FC'
import { login, getGoogleUserInfo } from '../actions/userActions'
// import GoogleLogin from 'react-google-login'
// import { gapi } from 'gapi-script'

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

  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  )
  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId:
  //         '336257746111-nc1cme4gda545cohoqgbmsbq3hsr048k.apps.googleusercontent.com',
  //       scope: 'email',
  //     })
  //   }

  //   gapi.load('client:auth2', start)
  // }, [])

  const handleFailure = (result) => {
    console.log(result)
    alert(result)
  }

  const handleLogin = async (googleData) => {
    console.log(googleData)

    const res = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    setLoginData(data)
    localStorage.setItem('loginData', JSON.stringify(data))
    // G
    console.log(googleData.profileObj.email, googleData.googleId)
    data.googleId = googleData.googleId
    //data._id = googleData.googleId
    data.token = googleData.tokenId
    data.isAdmin = false
    // localStorage.setItem('userInfo', JSON.stringify(data))
    dispatch(getGoogleUserInfo(data))
    console.log(userInfo)
  }
  const handleLogout = () => {
    localStorage.removeItem('loginData')
    setLoginData(null)
    // G
    // const x = localStorage.getItem('userInfo')
    // console.log(x)
    //localStorage.removeItem('userInfo')
  }

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

        {/* <h1>Google Log in</h1>
        <div>
          {loginData ? (
            <div>
              <h3>You logged in as {loginData.email}</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <GoogleLogin
              clientId='336257746111-nc1cme4gda545cohoqgbmsbq3hsr048k.apps.googleusercontent.com'
              buttonText={'Log in with Google'}
              onSuccess={handleLogin}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
              plugin_name='WebAppProShop'
            ></GoogleLogin>
          )}
        </div> */}
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
