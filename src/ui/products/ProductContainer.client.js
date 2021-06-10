import ProductCard from './ProductCard.client'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import Box from '@material-ui/core/Box'

export default function ProductContainer({products}) {
  const c = useStyles()
  return (
    <Container className={c.box}>
      <Grid container spacing={4} className={c.root}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles(theme => ({
  box: {
    backgroundColor: theme.palette.background.paper,
    padding: '5rem',
    height: '100%',
  },
  root: {
    marginTop: theme.spacing(8),
  },
}))
