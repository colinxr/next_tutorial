export default props => (
  <>
    <h2>Sign up</h2>
    <div>
      <form
        onSubmit={e => {
          alert('Sign Up up!')
          e.preventDefault();
        }}>
        <input id='email' type='email' placeholder='Email address' />
        <input id='password' type='password' placeholder='Password' />
        <input
          id='passwordconfirmation'
          type='password'
          placeholder='Enter password again'
        />
        <button>Sign up</button>
      </form>
    </div>
    <p>
      Already have an account? <a href='javascript:;' onClick={() => props.showLogin()}>Log in</a>
    </p>
  </>
)