import {fetch} from 'react-fetch'
import ProductContainer from './ProductContainer.client'

export default function Products({searchText}) {
  const products = fetch(`http://localhost:4000/products?searchText=${encodeURIComponent(searchText)}`).json()

  return products.length > 0 ? (
    <ProductContainer products={products} />
  ) : (
    <div className="notes-empty">
      {searchText ? `Couldn't find any products titled "${searchText}".` : 'No products created yet!'}{' '}
    </div>
  )
}
