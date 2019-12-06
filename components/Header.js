import { useStoreState, useStoreActions } from 'easy-peasy'
import Axios from 'axios'

const Header = () => {
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )
  const setShowRegisterModal = useStoreActions(
    actions => actions.modals.setShowRegisterModal
  )

  const user = useStoreState(state => state.user.user)
  const setUser = useStoreActions(actions => actions.user.setUser)

  const handleLogout = async() => {
    await Axios.post('/api/auth/logout')
    setUser(null)
  }

  return (
    <div className='nav-container'>
      <nav>
      <ul>
        {user ? (
          <>
            <li className='username'>{user}</li>
            <li>
              <a href='#' onClick={ () => handleLogout() }>
                Log Out
              </a>
            </li>
          </>
        ) : (
            <>
              <li>
                <a href='#' onClick={() => setShowRegisterModal()}>
                  Sign up
                </a>
              </li>
              <li>
                <a href='#' onClick={() => setShowLoginModal()}>
                  Log in
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>

      <style jsx>{`
        ul {
          margin: 0;
          padding: 0;
        }

        li {
          display: block;
          float: left;
        }

        a {
          text-decoration: none;
          display: block;
          margin-right: 15px;
          color: #333;
        }

        nav a {
          padding: 1em 0.5em;
        }

        .nav-container {
          border-bottom: 1px solid #eee;
          height: 50px;
        }

        img {
          float: left;
        }

        ul {
          float: right;
        }
        .username {
          padding: 1em 0.5em;
        }
      `}</style>
    </div>
  )
}

export default Header