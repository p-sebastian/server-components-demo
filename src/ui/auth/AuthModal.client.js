import Modal from '@material-ui/core/Modal'
import {AuthModalHooks} from './AuthModal.hooks'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

export const AuthModal = ({open, onClose}) => {
  const c = useStyles()
  const {onToggle, toggle, onSubmit, onChange, state} = useAuthModal()
  const {email, password} = state

  return (
    <Modal open={open} onClose={onClose} className={c.root}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className={c.paper}>
          <CssBaseline />
          <Avatar className={c.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {toggle ? 'Sign Up' : 'Sign In'}
          </Typography>
          <form className={c.form} noValidate>
            <TextField
              value={email}
              onChange={onChange('email')}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={password}
              onChange={onChange('password')}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button fullWidth variant="contained" color="primary" className={c.submit} onClick={onSubmit}>
              {toggle ? 'Sign Up' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item>
                <Button onClick={onToggle}>Don&apos;t have an account? Sign Up</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Modal>
  )
}

const {useStyles, useAuthModal} = AuthModalHooks
