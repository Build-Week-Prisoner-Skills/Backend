const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { signToken, authToken } = require('./admin-middleware');
const Admins = require('./admin-model');
const Prisoners = require('../prisoners/prisoner-model');
const Prisons = require('../prisons/prison-model');

router.post('/register', (req, res) => {
    let admin = req.body
    const hash = bcrypt.hashSync(admin.password, 10);
    admin.password = hash;

    Admins.add(admin)
    .then(saved => {
    res.status(201).json(saved);
    })
    .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: 'Could not add user.' })
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Admins.findBy({ username })
    .first()
    .then(admin => {
    if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = signToken(admin);
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' })
    }
    })
    .catch(err => {
    console.error(err);
    res.status(500).json({ errorMessage: 'Server error'})
    });
});

router.get('/', (req, res) => {
    Admins.find()
    .then(admins => {
        res.json(admins)
    })
})

//**  PRISON ROUTES  **//

router.get('/facilities', authToken, (req, res) => {
    if (req.admin.prison_id === null){
        res.status(404).json({ message: 'No facility associated with account.' })
    } else{
        Prisons.findBy(req.admin.prison_id)
        .then(prison => {
            if (prison.length > 0) {
                res.status(200).json(prison);
            } else {
                res.status(404).json({ message: 'No facility found with that ID.'})
            }
        })
        .catch(err => res.status(500).json(err));
    }
});

router.post('/facilities', authToken, (req, res) => {
        let prison = req.body
        
        Admins.addPrison(prison)
            .then(prison => {
                let changes = ({prison_id : prison.id})
                Admins.edit(req.admin.userId, changes)
                res.status(201).json(prison);
            })
            .catch(err =>
        res.status(500).json({ errorMessage: 'Could not add facility.'}))
});

//**  PRISONER ROUTES  **//

router.post('/inmates', authToken, (req, res) => {

    if (req.admin.prison_id !== null ) {
        let prisoner = req.body
        prisoner = {
            ...prisoner, prison_id: req.admin.prison_id
        }
    
        Admins.addPrisoner(prisoner)
            .then(prisoner => {
                res.status(201).json(prisoner);
            })
            .catch(err => res.status(500).json(err));
    } else {
        res.status(401).json({ errorMessage: 'No facilities linked to account.'})
    };
});

router.get('/inmates', authToken, (req, res) => {
    if (req.admin.prison_id === null){
        res.status(404).json({ message: 'No facility associated with account.' })
    } else{
        Prisoners.findBy(req.admin.prison_id)
        .then(prisoners => {
            if (prisoners.length > 0) {
                res.status(200).json(prisoners);
            } else {
                res.status(404).json({ message: 'No inmate information added yet.'})
            }
        })
        .catch(err => res.status(500).json(err));
    }
});

router.get('/inmates/:id', authToken, (req, res) => {

    Admins.findPrisonerById(req.params.id)
        .then(prisoner => {
            if (!prisoner) { 
                res.status(404).json({ errorMessage: 'Inmate not found.'})
            } else if (prisoner.prison_id !== req.admin.prison_id) {
                res.status(401).json({ message: 'Not authorized.'})
            } else {
                res.status(200).json(prisoner)
            }   
        })
        .catch(err => res.status(500).json(err));
});

router.put('/inmates/:id', authToken, (req, res, end) => {

    Admins.findPrisonerById(req.params.id)
        .then(prisoner => {
            if (prisoner.prison_id !== req.admin.prison_id) {
                res.status(401).json({ message: 'Not authorized.'})
            } else {
                Admins.editPrisoner(req.params.id, req.body)
                .then(edited => {
                    console.log(edited)
                    res.status(200).json(edited)
                })
                .catch(err => {
                    res.status(500).json({ errorMessage: 'Error updating information.'})
                })
            }
        })
        .catch(err => res.status(500).json(err));
});

router.delete('/inmates/:id', authToken, (req, res, end) => {

    Admins.findPrisonerById(req.params.id)
        .then(prisoner => {
            if (prisoner.prison_id !== req.admin.prison_id) {
                res.status(401).json({ message: 'Not authorized.'})
            } else {
                Admins.removePrisoner(req.params.id)
                .then(deleted => {
                    if(!deleted) {
                        res.status(200).json({ message: 'Inmate information deleted.' })
                    } else {
                        res.status(500).json({ errorMessage: 'Error removing information.'})
                    }
                })
            }
        })
        .catch(err => res.status(500).json({ errorMessage: 'Error handling delete.'}));
});

module.exports = router;