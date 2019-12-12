import Axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'

import Layout from '../../components/Layout'

const Host = (props) => {
  return (
    <Layout 
      content={
        <div>
          <Head>
            <title>Your Houses</title>
          </Head>
          <h2>Your Houses</h2>
          <div className="container">
            <div className="houses">
            <div className="list">
              {
                props.houses.map((house,index) => {
                  return (
                    <div className="house" kye={index}>
                      <img src={house.picture} alt='House picture' />
                      <div>
                        <h2> {house.title} in {house.town} </h2>
                        <p>
                          <Link href={`/houses/${house.id}`}>
                            <a>View house page</a>
                          </Link>
                        </p>
                        <p>
                          <Link href={`/host/${house.id}`}>
                            <a>Edit house details</a>
                          </Link>
                        </p>
                      </div>
                    </div>
                  )
                })
              }
              </div>
            </div>
            <div className="bookings">
            <div className="list">
              {
                props.bookings.map((booking, index) => {
                 return (
                   <div class='booking' key={index}>
                     <div>
                       <h2>
                         {booking.house.title} in {booking.house.town}
                       </h2>
                       <p>
                         Booked from{' '}
                         {new Date(booking.booking.startDate).toDateString()}{' '}
                         to {new Date(booking.booking.endDate).toDateString()}
                       </p>
                     </div>
                   </div>
                 ) 
                })
              }
              </div>
            </div>
          </div> 
          <style jsx>{`
           .container {
              display: grid;
              grid-template-columns: 60% 40%;
              grid-gap: 50px;
            }

            .list {
              display: grid;
              grid-template-columns: 100%;
              grid-gap: 40px;
              margin-top: 60px;
            }

            .houses {
              display: grid;
              grid-template-columns: 100%;
              grid-gap: 40px;
            }

            .house {
              display: grid;
              grid-template-columns: 30% 70%;
              grid-gap: 40px;
            }

            .house img {
              width: 100% ;
            }
          `}</style>
        </div>
      }
    />
  )
}

Host.getInitialProps = async ctx => {
  const resp = await Axios.get(`${process.env.BASE_URL}/api/host/list`, { 
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined
  })
  
  console.log(resp.data)

  const houses = resp.data.houses
  const bookings = resp.data.bookings 

  return { houses, bookings }
}

export default Host
