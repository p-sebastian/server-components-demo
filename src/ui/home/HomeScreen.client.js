import Products from '../products/Products.server'
import {useLocation} from '../../LocationContext.client'
import {Suspense} from 'react'
import NoteListSkeleton from '../../NoteListSkeleton'

export default function HomeScreen() {
  const [location] = useLocation()
  console.info(location)
  return (
    <Suspense fallback={<NoteListSkeleton />}>
      <Products searchText={location.searchText} />
    </Suspense>
  )
}
