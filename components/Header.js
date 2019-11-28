import Link from 'next/link'
import { useStoreActions } from 'easy-peasy'

const Header = () => {
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )
  const setShowRegisterModal = useStoreActions(
    actions => actions.modals.setShowRegisterModal
  )

  return (
    <div className='nav-container'>
      <nav>
        <ul>
          <li>
            <a onClick={() => setShowRegisterModal()}>Sign up</a>
          </li>
          <li>
            <a onClick={() => setShowLoginModal()}>Log in</a>
          </li>
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
      `}</style>
    </div>
  )
}

export default Header