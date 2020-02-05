const request = require('supertest');
const server = require('./server');
const db = require('../database/db-config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signToken } = require('../admin/admin-middleware');
const { jwtSecret } = require('../config/secret');

describe('server', function() {
    it('runs the tests', function() {
        expect(true).toBe(true)
    });

    describe('test environment', function() {
        it('should use the testing environment', function() {
            expect(process.env.DB_ENV).toBe('testing')
        });
    });

    beforeAll(async function() {
        await db('admins').truncate();
        await db('prisons').truncate();
        await db('prisoners').truncate();
    });

    afterEach(async function() {
        await db('admins').truncate();
        await db('prisons').truncate();
        await db('prisoners').truncate();
    })

    describe('GET /', function() {
        it('should return connection message', function() {
            return request(server).get('/').then(res => {
                expect(res.type).toMatch(/html/i)
                expect(res.text).toMatch(/Inmate-Skills API/i)
            });
        });
    });

    describe('POST /api/admin/register', function() {
        it('should post admin to the database', function() {
            return request(server).post('/api/admin/register')
            .send({
                name: 'name',
                username: 'username',
                password: 'password'
            })
            .then(res => {
                expect(res.status).toBe(201)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toHaveProperty('id')
                expect(res.body).toEqual(expect.objectContaining({username: 'username'}))
                expect(res.body.name).toBe('name')
                let user = res.body;
                const hash = bcrypt.hashSync(user.password, 10);
                user.password = hash;
                expect(res.body.password).toEqual(hash)
                expect(res.body.prison_id).toEqual(null)
            });
        });
    });

    describe('POST /api/admin/login', function() {
        it('should post admin to the database and return token', async function() {
            await db.seed.run();
            return request(server).post('/api/admin/login')
            .send({
                username: 'snorton',
                password: 'password',
            })
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toHaveProperty('token')
                expect(res.body).toHaveProperty('message')
                expect(res.body).toHaveProperty('username')
                expect(res.body.message).toMatch(/Login successful/i)
                expect(res.body.username).toBe('snorton')
                let response = jwt.verify(res.body.token, jwtSecret)
                expect(response.username).toBe('snorton')
                expect(response.userId).toBe(1)
        
            });
        });
    });

    describe('PUT /api/admin/', function() {
        it('should update admin to the database', async function() {
            await db.seed.run();
            let token = signToken({
                id : 1,
                username: 'snorton',
                prison_id: 1
            })
            return request(server).put('/api/admin/')
            .set({ authorization: token })
            .send({
                username: 'snorton1',
                password: 'password1',
            })
            .then(res => {
                expect(res.status).toBe(201)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toHaveProperty('username')
                expect(res.body.username).toBe('snorton1')
                let user = res.body;
                const hash = bcrypt.hashSync(user.password, 10);
                user.password = hash;
                expect(res.body.password).toBe(hash)
        
            });
        });
    });

    describe('DELETE /api/admin/', function() {
        it('should delete admin from the database', async function() {
            await db.seed.run();
            let token = signToken({
                id : 1,
                username: 'snorton',
                prison_id: 1
            })
            return request(server).delete('/api/admin/')
            .set({ authorization: token })
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe('Account successfully deleted')
            });
        });
    });

    describe('GET /api/admin/facilities', function() {
        it('should return response status 404', function() {
            return request(server).post('/api/admin/register')
            .send({
                name: 'name',
                username: 'username',
                password: 'password'
            }).then(function() {
                return request(server).post('/api/admin/login')
                .send({
                    username: 'username',
                    password: 'password',
                }).then(function() {
                    let token = signToken({
                        id : 1,
                        username: 'username',
                        prison_id: null
                    })
                    return request(server).get('/api/admin/facilities')
                    .set({ authorization: token })
                    .then(res => {
                        expect(res.status).toBe(404)
                        expect(res.type).toMatch(/json/i)
                        expect(res.body).toEqual({ message: 'No facility associated with account.' })
                    })
                })
            });
        });
    });

    describe('POST /api/admin/facilities', function() {
        it('should post and return added facility and new token', function() {
            return request(server).post('/api/admin/register')
            .send({
                name: 'name',
                username: 'username',
                password: 'password'
            }).then(function() {
                return request(server).post('/api/admin/login')
                .send({
                    username: 'username',
                    password: 'password',
                }).then(function() {
                    let token = signToken({
                        id : 1,
                        username: 'username',
                        prison_id: null
                    })
                    return request(server).post('/api/admin/facilities')
                    .set({ authorization: token })
                    .send({
                        name: "Parnall Correctional Facility",
                        address: "1780 East Parnall Road",
                        city: "Jackson",
                        state: "MI",
                        postal_code: 49201
                      })
                    .then(res => {
                        expect(res.status).toBe(201)
                        expect(res.type).toMatch(/json/i)
                        expect(res.body).toHaveProperty('token')
                        let response = jwt.verify(res.body.token, jwtSecret)
                        expect(response.username).toBe('username')
                        expect(response.userId).toBe(1)
                        expect(response.prison_id).toBe(1)
                        expect(res.body.message).toEqual('Facility added successfully, name.')
                        expect(res.body.prison).toEqual({
                            id: 1,
                            name: "Parnall Correctional Facility",
                            address: "1780 East Parnall Road",
                            city: "Jackson",
                            state: "MI",
                            postal_code: 49201
                        })
                    })
                })
            });
        });
    });

    describe('GET /api/admin/inmates', function() {
        it('should return response status 404', function() {
                return request(server).post('/api/admin/register')
                .send({
                    name: 'name',
                    username: 'username',
                    password: 'password'
                }).then(function() {
                    return request(server).post('/api/admin/login')
                    .send({
                        username: 'username',
                        password: 'password',
                    }).then(function() {
                    let token = signToken({
                        id : 1,
                        username: 'username',
                        prison_id: null
                    })
                    return request(server).get('/api/admin/inmates')
                    .set({ authorization: token })
                    .then(res => {
                        expect(res.status).toBe(404)
                        expect(res.type).toMatch(/json/i)
                        expect(res.body).toEqual({ message: 'No facility associated with account.' })
                    })
                })
            });
        });
    });

    describe('POST /api/admin/inmates', function() {
        it('should post and return added inmate', async function() {
            await db.seed.run();
            let token = signToken({
                id : 1,
                username: 'snorton',
                prison_id: 1
            })
            return request(server).post('/api/admin/inmates')
            .set({ authorization: token})
            .send({
                name: "Shawn Johnson",
                work_exp: "Cook",
                skills: "Kindness, sharing",
                availability: "Work Release"
            })
            .then(res => {
                expect(res.status).toBe(201)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual({
                    id: 7,
                    name: "Shawn Johnson",
                    work_exp: "Cook",
                    skills: "Kindness, sharing",
                    availability: "Work Release",
                    prison_id: 1
                })
            });
        });
    });

    describe('GET /api/admin/inmates', function() {
        it('should return inmates', async function() {
            await db.seed.run();
            let token = signToken({
                id : 1,
                username: 'snorton',
                prison_id: 1
            })
            return request(server).get('/api/admin/inmates')
                .set({ authorization: token})
                .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ id: 1}),
                        expect.objectContaining({ id: 4})
                    ])
                )
            });
        });
    });

    describe('GET /api/admin/inmates/:id', function() {
        it('should return inmate by id', async function() {
            await db.seed.run();
            let token = signToken({
                id : 3,
                username: 'hmoores',
                prison_id: 3
            })
            return request(server).get('/api/admin/inmates/3')
                .set({ authorization: token})
                .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual({
                    id: 3, 
                    name: 'John Coffey',
                    work_exp: 'Healthcare',
                    skills: 'Healing, Compassion',
                    availability: 'Work Release',
                    prison_id: 3
                    })
                }).then(function() {
                return request(server).get('/api/admin/inmates/2')
                .set({ authorization: token})
                .then(res => {
                    expect(res.status).toBe(401)
                    expect(res.type).toMatch(/json/i)
                    expect(res.body).toEqual({ message: 'Not authorized.' })
                })
            });
        });
    });

    describe('DELETE /api/admin/inmates/:id', function() {
        it('should delete inmate by id', async function() {
           await db.seed.run()
            let token = signToken({
                id : 1,
                username: 'snorton',
                prison_id: 1
            })
            return request(server).delete('/api/admin/inmates/1')
            .set({ authorization: token})
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual({ message: 'Inmate information deleted.' })
            }).then(function() {
                return request(server).get('/api/admin/inmates/1')
                .set({ authorization: token})
                .then(res => {
                    expect(res.status).toBe(404)
                    expect(res.type).toMatch(/json/i)
                    expect(res.body).toEqual({errorMessage: 'Inmate not found.'})
                
                })
            });
        });
    });

    describe('PUT /api/admin/inmates/:id', function() {
        it('should update inmate and return by id', async function() {
            await db.seed.run();
            let token = signToken({
                id : 2,
                username: 'smartin',
                prison_id: 2
            })          
            return request(server).put('/api/admin/inmates/2')
            .set({ authorization: token})
            .send({
                name: "Lucas Jackson",
                work_exp: "Veteran",
                skills: "Cool hands, Luke",
                availability: "On Site"
            })
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual({
                    id: 2,
                    name: "Lucas Jackson",
                    work_exp: "Veteran",
                    skills: "Cool hands, Luke",
                    availability: "On Site",
                    prison_id: 2
                })
            });
        });
    });

    describe('GET /api/inmates', function() {
        it('should return response status 200, json, and array', function() {
            return request(server).get('/api/inmates').then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual(expect.arrayContaining([]))
            });
        });
    });

    describe('GET /api/facilities', function() {
        it('should return response status 200, json, and array', function() {
            return request(server).get('/api/facilities').then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual(expect.arrayContaining([]))
            });
        });
    });

    describe('GET /api/facilities/:id/inmates', function() {
        it('should return response status 200, json object with array property', async function() {
            await db.seed.run();
            return request(server).get('/api/facilities/1/inmates')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.type).toMatch(/json/i)
                expect(res.body).toEqual(expect.objectContaining({name: "Shawshank State Prison"}))
                expect(res.body.prisoners).toEqual(
                    expect.arrayContaining([
                    expect.objectContaining({name: 'Andy Dufresne'}),
                    expect.objectContaining({name: 'Ellis Boyd Redding'}),
                    expect.not.objectContaining({name: 'John Coffey'}),
                    expect.not.objectContaining({name: 'Lucas Jackson'})
                ]))
            }); 
        });
    });

});    

'\nn/_   _\nn/'