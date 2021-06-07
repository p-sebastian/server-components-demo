import ProductCard from './ProductCard.client'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'

export default function ProductContainer({products}) {
  const c = useStyles()
  return (
    <Grid container spacing={4} className={c.root}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
  },
}))
