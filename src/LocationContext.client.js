/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {createContext, useContext} from 'react'

export const LocationContext = createContext()
export function useLocation() {
  const [location, setLocation] = useContext(LocationContext)
  const setData = (data = {}) => setLocation({...location, ...data})

  return [location, setData]
}

export function useAuth() {
  const [location, setLocation] = useContext(LocationContext)

  const setAuth = auth => setLocation({...location, ...auth})
  return [location, setAuth]
}

export function useUser() {
  const [location, setLocation] = useContext(LocationContext)

  const setUser = user => setLocation({...location, user: {...user}})
  return [location.user, setUser]
}
