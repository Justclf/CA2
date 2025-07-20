const express = require('express');
const router = express.Router();

const pokedexController = require('../controllers/pokedexController');
const pokemonController = require('../controllers/pokemonController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// router.post('/', jwtMiddleware.verifyToken, pokedexController.getRandomDex, pokemonController.createNewPokemon, pokemonController.readNewPokemonById)

router.get('/', pokemonController.readAllPokemon); // means GET /api/pokemon

module.exports = router;