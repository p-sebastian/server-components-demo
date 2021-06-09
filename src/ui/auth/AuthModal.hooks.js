import {makeStyles} from '@material-ui/core/styles'
import {useCallback, useState} from 'react'
import {useAuth} from '../../LocationContext.client'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    padding: '3rem',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
}))

const useAuthModal = () => {
  const [, setAuth] = useAuth()
  const [toggle, setToggle] = useState(false)
  const [state, setState] = useState(() => initState())

  const onToggle = useCallback(() => setToggle(!toggle), [toggle])

  const onSubmit = useCallback(() => {
    setAuth({...state, signUp: toggle})
  }, [toggle, state])

  const onChange = useCallback(key => e => setState({...state, [key]: e.target.value}), [state])

  return {toggle, onToggle, onSubmit, onChange, state}
}

export const AuthModalHooks = {useStyles, useAuthModal}

const initState = () => ({
  email: '',
  password: '',
})
