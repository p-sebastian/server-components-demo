import {useEffect} from 'react'
import {useLocation} from '../../LocationContext.client'
import {makeStyles} from '@material-ui/core/styles'

const useAuthenticated = (user, token) => {
  const [location] = useLocation()

  useEffect(() => {
    if (location.token === token || !token || !user) {
      return
    }
    localStorage.setItem('token', JSON.stringify(token))
    localStorage.setItem('user', JSON.stringify(user))
  }, [location, user, token])

  return {}
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

export const AuthenticatedHooks = {useAuthenticated, useStyles}
