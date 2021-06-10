/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {fetch} from 'react-fetch'
import {Suspense} from 'react'
import AppNavbar from './ui/navbar/Navbar.client'
import NoteListSkeleton from './NoteListSkeleton'
import Products from './ui/products/Products.server'
import User from './ui/user/User.server'

// somehow Im gettin the location context passed as a prop
export default function App(props) {
  const {searchText, user, token} = props
  const auth = authenticate(props)

  return (
    <div style={{height: '100vh'}}>
      <AppNavbar>
        <Suspense fallback={<NoteListSkeleton />}>
          <User user={auth.data.user || user} token={auth.token || token} />
        </Suspense>
      </AppNavbar>
      <Suspense fallback={<NoteListSkeleton />}>
        <Products searchText={searchText} />
      </Suspense>
    </div>
  )
}

const authenticate = ({signUp, token, email, password}) => {
  if (token || !email || !password) {
    return {data: {}}
  }
  const data = fetch(
    `http://localhost:4000/auth/${signUp ? 'signup' : 'login'}?email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`
  ).json()
  console.info(data)
  return data
}
