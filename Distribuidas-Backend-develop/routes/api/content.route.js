var express = require('express')
var router = express.Router()
var ContentController = require('../../controllers/content.controller');
var Authorization = require('../../auth/authorization');

// Authorize each API with middleware and map to the Controller Functions
router.get('/test', function (req, res, next) {
  res.send('Llegaste a api/content.routes');
});

//Obtener contenidos desde la api utilizando una frase como criterio
router.get('/search', ContentController.contentSearch);
//Salvar el contenido con los datos ingresados.
router.post('/saveContent', ContentController.saveContent);
router.post('/addComment', ContentController.addComment);
router.get('/getCommentedContentByUser', ContentController.getCommentedContentByUser);

// Export the Router
module.exports = router;