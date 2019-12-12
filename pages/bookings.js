import Axios from 'axios'
import Head from 'next/head'
import Layout from '../components/Layout'

const Bookings = (props) => {
  return (
    <Layout 
      content={
        <div>
          <Head>
            <title>You Bookings</title>
          </Head>
          <h2>Your Bookings</h2>
          <div className="bookings">
            {
              props.bookings.map((booking, index) => {
                return (
                  <div className="booking" key={index}>
                    <img src={booking.house.picture} alt=""/>
                    <h2>{booking.house.title}</h2>
                    <p>
                      Booked from{' '}
                      {new Date(booking.booking.startDate).toDateString()} to{' '}
                      {new Date(booking.booking.endDate).toDateString()}
                    </p>
                  </div>
                )
              })
            }
          </div>
          <style jsx>{`
            .bookings {
              display: grid;
              grid-template-columns: 100%;
              grid-gap: 40px;
            }

            .booking {
              display: grid;
              grid-template-columns: 30% 70%;
              grid-gap: 40px;
            }

            .booking img {
              width: 180px;
            }
          `}</style>
        </div>
      } />
  )
}

Bookings.getInitialProps = async (ctx) => {
  const resp = await Axios.get(`${process.env.BASE_URL}/api/bookings/list`)
  const bookings = resp.data 

  return { bookings }
}

export default Bookings