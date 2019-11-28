import { createStore, action } from 'easy-peasy'

export default createStore({
  modals: {
    showModal: false,
    showLoginModal: false,
    showRegisterModal: false,
    setShowModal: action(state => {
      state.showModal = true
    }),
    setHideModal: action(state => {
      state.showModal = false
    }),
    setShowLoginModal: action(state => {
      state.showModal = true
      state.showLoginModal = true
      state.showRegisterModal = false
    }),
    setShowRegisterModal: action(state => {
      state.showModal = true
      state.showLoginModal = false
      state.showRegisterModal = true
    })
  }
})