import {AuthenticatedHooks} from './Authenticated.hooks.client'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import Fab from '@material-ui/core/Fab'

export default function Authenticated({user = {}, token}) {
  const {} = useAuthenticated(user, token)
  const c = useStyles()

  return (
    <div className={c.root}>
      <IconButton color="inherit">
        <ExitToAppIcon />
      </IconButton>
      <Typography variant="subtitle1" noWrap>
        {user.first_name} {user.last_name}
      </Typography>
      <Fab color="secondary" aria-label="add" style={{marginLeft: '2rem'}}>
        <ShoppingCartIcon />
      </Fab>
      {/* <IconButton color="secondary">
      </IconButton> */}
    </div>
  )
}

const {useAuthenticated, useStyles} = AuthenticatedHooks
