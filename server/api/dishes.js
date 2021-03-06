const router = require('express').Router()
const unirest = require('unirest')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    console.log(req.query)
    unirest
      .get(
        `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/guessNutrition?title=${
          req.query.title
        }`
      )
      .header('X-Mashape-Key', process.env.xMashKey)
      .header(
        'X-Mashape-Host',
        'spoonacular-recipe-food-nutrition-v1.p.mashape.com'
      )
      .end(function(result) {
        res.json(result.body)
      })
  } catch (err) {
    next(err)
  }
})

router.get('/check', async (req, res, next) => {
  console.log(req.query)
  try {
    unirest
      .get(
        `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/queries/analyze?q=${
          req.query.title
        }`
      )
      .header('X-Mashape-Key', process.env.xMashKey)
      .header(
        'X-Mashape-Host',
        'spoonacular-recipe-food-nutrition-v1.p.mashape.com'
      )
      .end(function(result) {
        res.json(result.body)
      })
  } catch (err) {
    next(err)
  }
})
