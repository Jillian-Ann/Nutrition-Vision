const router = require('express').Router()
const unirest = require('unirest')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    unirest
      .get(
        'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/guessNutrition?title=Spaghetti+Aglio+et+Olio'
      )
      .header('X-Mashape-Key', process.env.XMashKey)
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
