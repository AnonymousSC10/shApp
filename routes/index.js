var express = require('express'),
    router = express.Router();


function view_index(req, res, next) {
    res.render('index')
}

function view_indexContent(req, res, next) {
    res.render('index-content')
}

function view_pool(req, res, next) {
    res.render('pool')
}

function view_bury(req, res, next) {
    res.render('bury')
}

function view_swap(req, res, next) {
    res.render('swap')
}

function view_yield(req, res, next) {
    res.render('yield')
}

function view_burn(req, res, next) {
    res.render('burn')
}


/* GET home page */
router.get('/', view_index)
router.get('/content', view_indexContent)
router.get('/pool', view_pool)
router.get('/bury', view_bury)
router.get('/swap', view_swap)
router.get('/yield', view_yield)
router.get('/burn', view_burn)

/* GET errors */
router.get('*', view_index)

module.exports = router