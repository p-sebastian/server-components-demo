import {createMuiTheme} from '@material-ui/core/styles'
import {useMemo} from 'react'

const useRootTheme = () => {
  const theme = useMemo(() =>
    createMuiTheme({
      palette: {
        type: 'dark',
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#00796b',
          // dark: will be calculated from palette.primary.main,
          // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
          // light: '#0066ff',
          main: '#fff3e0',
          // dark: will be calculated from palette.secondary.main,
          // contrastText: '#ffcc00',
        },
        // error: will use the default color
      },
    })
  )

  return theme
}

export const RootHooks = {useRootTheme}
