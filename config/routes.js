var express = require('express');
var router  = express.Router();

var mainController = require('../controllers/mainController');

router.route('/')
  .get(mainController.index);

router.route('/main')
  .get(mainController.index)
  .post(mainController.create);

router.route('/main/:id')
  .get(mainController.show)
  .put(mainController.update)
  .delete(mainController.delete);

module.exports = router;
