import GlobalSearch from '../global_search/GlobalSearch.client'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import MoreIcon from '@material-ui/icons/MoreVert'
import {NavbarClientHooks} from './Navbar.hooks'

export default function AppNavbar({children}) {
  const classes = useStyles()

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Thesis
          </Typography>
          <GlobalSearch />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>{children}</div>
          <div className={classes.sectionMobile}>
            <IconButton aria-label="show more" aria-haspopup="true" color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  )
}

const {useStyles} = NavbarClientHooks
