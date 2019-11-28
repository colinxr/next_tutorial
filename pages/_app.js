import App from 'next/app'
import { StoreProvider } from 'easy-peasy'
import store from '../store'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <StoreProvider store={store}>
        <Component {...pageProps} />
      </StoreProvider>
    )
  }
}

export default MyApp