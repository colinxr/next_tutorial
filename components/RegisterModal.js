import { useState } from 'react';
import Axios from 'axios';

export default props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const submit = async () => {
    try {
      console.log(email, password, passwordConfirmation)
      const response = await Axios.post('/auth/register', {email, password, passwordConfirmation})
      if (response.data.status === 'error') {
        alert(response.data.message)
        return
      }
    } catch (error) {
      alert(error.response.data.message)
      return
    }
  }

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form
          onSubmit={e => {
            submit()
            e.preventDefault();
          }}>
          <input 
            id='email' 
            type='email' 
            placeholder='Email address' 
            onChange={(e) => { setEmail(e.target.value)}}/>
          <input 
            id='password' 
            type='password' 
            placeholder='Password' 
            onChange={(e) => { setPassword(e.target.value)  }}/>
          <input
            id='passwordconfirmation'
            type='password'
            placeholder='Enter password again'
            onChange={(e) => { setPasswordConfirmation(e.target.value) }} />
          <button>Sign up</button>
        </form>
      </div>
      <p>
        Already have an account? <a href='javascript:;' onClick={() => props.showLogin()}>Log in</a>
      </p>
    </>
  )
}