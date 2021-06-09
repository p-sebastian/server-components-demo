import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import {useCallback, useState} from 'react'
import {AuthModal} from '../auth/AuthModal.client'

export default function NoAuth() {
  const {open, toggle} = useModal()

  return (
    <>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-haspopup="true"
        color="inherit"
        onClick={toggle(true)}
      >
        <AccountCircle />
      </IconButton>
      <AuthModal open={open} onClose={toggle(false)} />
    </>
  )
}

const useModal = () => {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(v => () => setOpen(v), [])

  return {open, toggle}
}
