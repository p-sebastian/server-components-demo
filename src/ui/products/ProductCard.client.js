import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

export default function ProductCard({product}) {
  const classes = useStyles()
  const {name, image, description} = product
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box boxShadow={3}>
        <Card className={classes.root}>
          <CardMedia className={classes.media} image={image} title={name} />
          <CardContent>
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>
    </Grid>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    backgroundColor: theme.palette.background.default,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}))
