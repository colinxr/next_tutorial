export default props => (
  <>
    <h2>Log in</h2>
    <div>
      <form
        onSubmit={e => {
          alert('Login up!')
          e.preventDefault();
        }}>
        <input id='email' type='email' placeholder='Email address' />
        <input id='password' type='password' placeholder='Password' />
        <button>Log in</button>
      </form>
    </div>
    <p>
      Don't have an account yet?{' '}
      <a href='javascript:;' onClick={() => props.showSignup()}>Sign up</a>
    </p>
  </>
)