import axios from 'axios'
import {
  SEND_CONTACT_FORM_FAIL,
  SEND_CONTACT_FORM_REQUEST,
  SEND_CONTACT_FORM_SUCCESS,
} from '../constants/contactConstants'

export const sendContactFormAction = (contactForm) => async (dispatch) => {
  try {
    dispatch({
      type: SEND_CONTACT_FORM_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/auth/contact',
      { contactForm },
      config
    )

    dispatch({
      type: SEND_CONTACT_FORM_SUCCESS,
      payload: data,
    })

    //localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: SEND_CONTACT_FORM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
