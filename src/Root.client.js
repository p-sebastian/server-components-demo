/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useState, Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {useServerResponse} from './Cache.client'
import {LocationContext} from './LocationContext.client'
import {MuiThemeProvider} from '@material-ui/core/styles'
import {RootHooks} from './Root.hooks.client'

export default function Root({initialCache}) {
  console.info('initial cache', initialCache)
  return (
    <Suspense fallback={null}>
      <ErrorBoundary FallbackComponent={Error}>
        <Content />
      </ErrorBoundary>
    </Suspense>
  )
}

function Content() {
  const theme = useRootTheme()
  // @NOTE also change me in api.server.js `renderReactTree`
  const [location, setLocation] = useState({
    searchText: '',
    token: '',
    // signIn = true; signUp = false
    signUp: false,
    email: '',
    password: '',
    user: {},
  })
  console.info(location)
  const response = useServerResponse(location)
  return (
    <MuiThemeProvider theme={theme}>
      <LocationContext.Provider value={[location, setLocation]}>{response.readRoot()}</LocationContext.Provider>
    </MuiThemeProvider>
  )
}

function Error({error}) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{whiteSpace: 'pre-wrap'}}>{error.stack}</pre>
    </div>
  )
}

const {useRootTheme} = RootHooks
