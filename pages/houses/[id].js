import { useState } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import Axios from 'axios'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import Layout from '../../components/Layout'
import DateRangePicker from '../../components/DateRangePicker'

const getBookedDates = async (houseID) => {
  try {
    const resp = await Axios.post(`${process.env.BASE_URL}/api/houses/booked`, { houseID })
    
    if (resp.data.status === 'error') {
      alert(resp.data.message)
      return
    }

    return resp.data.dates
  } catch (err) {
    console.error(err)
    return
  }
}

const canReserve = async (house) => {
  try {
    const resp = await Axios.post(`${process.env.BASE_URL}/api/houses/check`, house)

    if (resp.data.status === 'error') {
      alert(resp.data.message)
      return
    }

    if (resp.data.message === 'busy') return false
    return true
  } catch (error) {
    console.error(error)
    return
  }
}

const House = (props) => {
  const [dateChosen, setDateChosen] = useState(false)
  const [numberOfNights, setNumberOfNights] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const user = useStoreState(state => state.user.user)

  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )

  const findNumberOfNights = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    let dayCount = 0
    while (end > start) {
      dayCount++
      start.setDate(start.getDate() + 1)
    }

    return dayCount
  }

  const handleBooking = async () => {
    const house = {
      houseID: props.house.id,
      startDate,
      endDate,
    }

    if (!(await canReserve(house))) {
      alert('the dates chosen are not available')
      return 
    }

    try {
      const resp = await Axios.post('/api/houses/reserve', house)
      if (resp.data.status === 'error') {
        alert(resp.data.message)
        return
      }
    } catch(err) {
      console.log(error)
      return
    }
  }

  return (
    <Layout
      content={
        <div className="container">
          <Head>
            <title>{props.house.title}</title>
          </Head>
          <article>
            <img src={props.house.picture} width='100%' alt='House picture' />
            <p>
              {props.house.type} - {props.house.town}
            </p>
            <p>{props.house.title}</p>
            {
              props.house.reviewsCount ? (
                <div className="reviews">
                  <h3>{
                    props.house.reviewsCount === 1 ? 
                      `${props.house.reviewsCount} Review` : 
                      `${props.house.reviewsCount} Reviews`
                  }</h3>
                  {
                    props.house.reviews.map((review, index) => {
                      return (
                        <div key={index}>
                          <p>{new Date(review.createdAt).toDateString()}</p>
                          <p>{review.comment}</p>
                        </div>
                      )
                    })
                  }

                </div>
              ) : ''
            }
          </article>
          <aside>
            <h2>Add Dates for Prices</h2>
            <DateRangePicker 
              datesChanged={(startDate, endDate) => {
                const length = findNumberOfNights(startDate, endDate);
                setNumberOfNights(length)
                setDateChosen(true)
                setStartDate(startDate)
                setEndDate(endDate)
              }} 
              bookedDates={props.bookedDates}
            />
            {dateChosen && (
              <div>
                <h2>Price per night</h2>
                <p>${props.house.price}</p>
                <h2>Total price for booking</h2>
                <p>
                  ${(numberOfNights * props.house.price).toFixed(2)}
                </p>
                <button 
                  className="reserve"
                  onClick={() => {
                    if (!user) setShowLoginModal()
                    if (user) handleBooking()
                  }}>
                  Reserve
                </button>
              </div>
            )}
          </aside>

          <style jsx>{`
            .container {
              display: grid;
              grid-template-columns: 60% 40%;
              grid-gap: 30px;
            }

            aside {
              border: 1px solid #ccc;
              padding: 20px;
            }
          `}</style>
        </div>
      }
    />
  )
}

House.getInitialProps = async ({ query }) => {
  const { id } = query
  const resp = await fetch(`${process.env.BASE_URL}/api/houses/${id}`)
  const house = await resp.json()

  const bookedDates = await getBookedDates(id)

  return { house, bookedDates }
}

export default House