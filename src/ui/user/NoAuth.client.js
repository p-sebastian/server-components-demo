import {useCallback, useEffect, useState} from 'react'
import {useLocation} from '../../LocationContext.client'
import {AuthModal} from '../auth/AuthModal.client'
import Button from '@material-ui/core/Button'

export default function NoAuth() {
  const {open, toggle} = useModal()

  return (
    <>
      <Button color="inherit" onClick={toggle(true)}>
        Login
      </Button>
      <AuthModal open={open} onClose={toggle(false)} />
    </>
  )
}

const useModal = () => {
  const [, setLocation] = useLocation()
  const [open, setOpen] = useState(false)

  const toggle = useCallback(v => () => setOpen(v), [])

  useEffect(() => {
    const data = getData()
    if (data.token && data.user) {
      setLocation(data)
    }
  }, [])

  return {open, toggle}
}

const getData = () => {
  const token = JSON.parse(localStorage.getItem('token'))
  const user = JSON.parse(localStorage.getItem('user'))

  return {token, user}
}
