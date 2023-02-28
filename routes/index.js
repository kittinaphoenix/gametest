const express = require('express');
const router = express.Router();

// Import controllers
const gameEngine = require('../engine/engine');

router.get('/game', gameEngine.getGame);
router.get('/getUserTimeline', gameEngine.getUserTimeline);
router.get('/dodialog', gameEngine.doDialog);

//home site
router.get('/', gameEngine.homeSite);

//game engine methods
router.post('/login', gameEngine.postLogin);


module.exports = router;
