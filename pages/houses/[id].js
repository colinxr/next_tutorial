import { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import DateRangePicker from '../../components/DateRangePicker'
import houses from '../houses.json'

const House = props => {
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNights, setNumberOfNights] = useState(0)

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
            <p>
              {props.house.rating} ({props.house.reviewsCount})
            </p>
          </article>
          <aside>
            <h2>Add Dates for Prices</h2>
            <DateRangePicker 
              datesChanged={(startDate, endDate) => {
                const length = findNumberOfNights(startDate, endDate);
                setNumberOfNights(length)
                setDateChosen(true)
              }} 
            />
            {dateChosen && (
              <div>
                <h2>Price per night</h2>
                <p>${props.house.price}</p>
                <h2>Total price for booking</h2>
                <p>
                  ${(numberOfNights * props.house.price).toFixed(2)}
                </p>
                <button className="reserve">Reserve</button>
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

House.getInitialProps = ({ query }) => {
  const { id } = query

  return {
    house: houses.filter(house => house.id === id)[0]
  }
}

export default House