import { useState } from 'react';
import Axios from 'axios';
import { useStoreState, useStoreActions } from 'easy-peasy'

export default props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const setHideModal = useStoreActions(actions => actions.modals.setHideModal)
  const setUser = useStoreActions(actions => actions.user.setUser)

  const submit = async () => {
    try {
      const response = await Axios.post('/api/auth/register', {email, password, passwordConfirmation})
      
      if (response.data.status === 'error') {
        console.log(response.data)
        alert(response.data.message)
        return
      }

      setUser(email)
      setHideModal(false)
    } catch (error) {
      console.log(error)
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