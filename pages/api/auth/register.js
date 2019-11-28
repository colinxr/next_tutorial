import { User } from '../../../model.js'

export default async (req, res) => {
  // make sure to only accept post requests
  // check if pass word and passwordconfirmation match 
  // try to create the user 
  // send success JSON
  // else end error message 
  
  // res.end(JSON.stringify(object))

  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const { email, password, passwordConfirmation } = req.body

  if (password !== passwordConfirmation) {
    res.end(
      JSON.stringify({stats: 'error', message: 'Passwords do not match'})
    )
    return false;
  }

  try {
    const user = await User.create({ email, password })
    res.end(JSON.stringify({ status: 'success', message: 'User Added' }))
  } catch (err) {
    res.statusCode = 500
    let message = 'An error occurred'
    if (err.name === 'SequelizeUniqueConstraintError') {
      message = 'user already exists'
    }
    res.end(JSON.stringify({status: 'error', message}))
  }
}