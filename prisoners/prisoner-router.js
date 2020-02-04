const express = require('express');
const Prisoners = require('./prisoner-model');
const router = express.Router();

router.get('/', (req, res) => {
    Prisoners.find()
    .then(prisoners => {
        res.json(prisoners)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: 'Problem fetching inmates.'})
    });
});

router.get('/:id', (req, res) => {
    Prisoners.findById(req.params.id)
    .then(prisoner => {
        if(prisoner){
            res.json(prisoner)
        } else {
            res.status(404).json({ errorMessage: 'Inmate not found.'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: 'Problem fetching inmate'})
    });
});

module.exports = router;