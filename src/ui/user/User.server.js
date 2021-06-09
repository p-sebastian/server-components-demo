import Authenticated from './Authenticated.client'
import NoAuth from './NoAuth.client'

export default function User({user, token}) {
  if (token) {
    return <Authenticated user={user} token={token} />
  }
  return <NoAuth />
}
