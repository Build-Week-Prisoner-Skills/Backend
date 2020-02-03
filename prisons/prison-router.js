const express = require('express');
const Prisons = require('./prison-model');
const router = express.Router();

router.get('/', (req, res) => {
    Prisons.find()
    .then(prisons => {
        res.json(prisons)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: 'Problem fetching facilities'})
    });
});

router.get('/:id', (req, res) => {
    Prisons.findById(req.params.id)
    .then(prison => {
        if(prison){
            res.json(prison)
        } else {
            res.status(404).json({ errorMessage: 'Facility not found.'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: 'Problem fetching facility'})
    });
});

router.get('/:id/inmates', (req, res) => {
    Prisons.findPrisoners(req.params.id)
    .then(prison => {
        if(prison.prisoners.length > 0){
            res.json(prison)
        } else {
            res.json({ message: 'No inmates available.'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ errorMessage: 'Problem fetching inmates.'})
    });
})

router.post('/', (req, res) => {
    let prison = req.body
    Prisons.insert(prison)
    .then(prison => {
        res.status(201).json(prison)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Could not add facility."})
    });
});

module.exports = router;