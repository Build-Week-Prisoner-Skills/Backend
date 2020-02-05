const request = require('supertest');
const server = require('./server');
const db = require('../database/db-config')
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

    beforeEach(async function() {
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
        it('should post admin to the database and return token', function() {
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
                })
                .then(res => {
                    expect(res.status).toBe(200)
                    expect(res.type).toMatch(/json/i)
                    expect(res.body).toHaveProperty('token')
                    expect(res.body).toHaveProperty('message')
                    expect(res.body).toHaveProperty('username')
                    expect(res.body.message).toMatch(/Login successful, name/i)
                    expect(res.body.username).toBe('username')
                    let response = jwt.verify(res.body.token, jwtSecret)
                    expect(response.username).toBe('username')
                    expect(response.userId).toBe(1)
                });
            });
        });
    });

    describe('PUT /api/admin/', function() {
        it('should update admin to the database', function() {
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
                    return request(server).put('/api/admin/')
                    .set({ authorization: token })
                    .send({
                        username: 'username1',
                        password: 'password1',
                    })
                    .then(res => {
                        expect(res.status).toBe(201)
                        expect(res.type).toMatch(/json/i)
                        expect(res.body).toHaveProperty('username')
                        expect(res.body.username).toBe('username1')
                        let user = res.body;
                        const hash = bcrypt.hashSync(user.password, 10);
                        user.password = hash;
                        expect(res.body.password).toBe(hash)
                    })
                })
            });
        });
    });

    describe('DELETE /api/admin/', function() {
        it('should delete admin from the database', function() {
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
                    return request(server).delete('/api/admin/')
                    .set({ authorization: token })
                    .then(res => {
                        expect(res.status).toBe(200)
                        expect(res.type).toMatch(/json/i)
                        expect(res.body).toHaveProperty('message')
                        expect(res.body.message).toBe('Account successfully deleted')
                    })
                })
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
        it('should post and return added inmate', function() {
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
                    .then(function() {
                        let token = signToken({
                            id : 1,
                            username: 'username',
                            prison_id: 1
                        })
                        return request(server).post('/api/admin/inmates')
                        .set({ authorization: token})
                        .send({
                            name: "Lucas Jackson",
                            work_exp: "Veteran",
                            skills: "Tenacity, Good under pressure",
                            availability: "On Site"
                         }).then(res => {
                            expect(res.status).toBe(201)
                            expect(res.type).toMatch(/json/i)
                            expect(res.body).toEqual({
                                id: 1,
                                name: "Lucas Jackson",
                                work_exp: "Veteran",
                                skills: "Tenacity, Good under pressure",
                                availability: "On Site",
                                prison_id: 1
                            })
                         })
                    })
                })
            });
        });
    });

    describe('GET /api/admin/inmates', function() {
        it('should return inmates', function() {
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
                    .then(function() {
                        let token = signToken({
                            id : 1,
                            username: 'username',
                            prison_id: 1
                        })
                        return request(server).post('/api/admin/inmates')
                        .set({ authorization: token})
                        .send({
                            name: "Lucas Jackson",
                            work_exp: "Veteran",
                            skills: "Tenacity, Good under pressure",
                            availability: "On Site"
                         }).then(function() {
                             return request(server).get('/api/admin/inmates')
                             .set({ authorization: token})
                             .then(res => {
                                expect(res.status).toBe(200)
                                expect(res.type).toMatch(/json/i)
                                expect(res.body).toEqual([{
                                    id: 1,
                                    name: "Lucas Jackson",
                                    work_exp: "Veteran",
                                    skills: "Tenacity, Good under pressure",
                                    availability: "On Site",
                                    prison_id: 1
                                }])
                             })
                         })
                    })
                })
            });
        });
    });

    describe('GET /api/admin/inmates/:id', function() {
        it('should return inmate by id', function() {
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
                    .then(function() {
                        let token = signToken({
                            id : 1,
                            username: 'username',
                            prison_id: 1
                        })
                        return request(server).post('/api/admin/inmates')
                        .set({ authorization: token})
                        .send({
                            name: "Lucas Jackson",
                            work_exp: "Veteran",
                            skills: "Tenacity, Good under pressure",
                            availability: "On Site"
                         }).then(function() {
                             return request(server).get('/api/admin/inmates/1')
                             .set({ authorization: token})
                             .then(res => {
                                expect(res.status).toBe(200)
                                expect(res.type).toMatch(/json/i)
                                expect(res.body).toEqual({
                                    id: 1,
                                    name: "Lucas Jackson",
                                    work_exp: "Veteran",
                                    skills: "Tenacity, Good under pressure",
                                    availability: "On Site",
                                    prison_id: 1
                                })
                             }).then(function() {
                                return request(server).get('/api/admin/inmates/2')
                                .set({ authorization: token})
                                .then(res => {
                                   expect(res.status).toBe(404)
                                   expect(res.type).toMatch(/json/i)
                                   expect(res.body).toEqual({errorMessage: 'Inmate not found.'})
                                })
                             })
                         })
                    })
                })
            });
        });
    });

    describe('DELETE /api/admin/inmates/:id', function() {
        it('should delete inmate by id', function() {
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
                    .then(function() {
                        let token = signToken({
                            id : 1,
                            username: 'username',
                            prison_id: 1
                        })
                        return request(server).post('/api/admin/inmates')
                        .set({ authorization: token})
                        .send({
                            name: "Lucas Jackson",
                            work_exp: "Veteran",
                            skills: "Tenacity, Good under pressure",
                            availability: "On Site"
                         }).then(function() {
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
                             })
                         })
                    })
                })
            });
        });
    });

    describe('PUT /api/admin/inmates/:id', function() {
        it('should update inmate and return by id', function() {
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
                    .then(function() {
                        let token = signToken({
                            id : 1,
                            username: 'username',
                            prison_id: 1
                        })
                        return request(server).post('/api/admin/inmates')
                        .set({ authorization: token})
                        .send({
                            name: "Lucas Jackson",
                            work_exp: "Veteran",
                            skills: "Tenacity, Good under pressure",
                            availability: "On Site"
                         }).then(function() {
                             return request(server).put('/api/admin/inmates/1')
                             .set({ authorization: token})
                             .send({
                                name: "Lucas Jackson",
                                work_exp: "Veteran",
                                skills: "Cool hands, Luke",
                                availability: "On Site"
                             }).then(res => {
                                expect(res.status).toBe(200)
                                expect(res.type).toMatch(/json/i)
                                expect(res.body).toEqual({
                                    id: 1,
                                    name: "Lucas Jackson",
                                    work_exp: "Veteran",
                                    skills: "Cool hands, Luke",
                                    availability: "On Site",
                                    prison_id: 1
                                 })
                             })
                         })
                    })
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
        it('should return response status 200, json object with array property', function() {
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
                    .then(function() {
                        let token = signToken({
                            id : 1,
                            username: 'username',
                            prison_id: 1
                        })
                        return request(server).post('/api/admin/inmates')
                        .set({ authorization: token})
                        .send({
                            name: "Lucas Jackson",
                            work_exp: "Veteran",
                            skills: "Tenacity, Good under pressure",
                            availability: "On Site"
                         }).then(function() {
                             return request(server).get('/api/facilities/1/inmates')
                             .then(res => {
                                 expect(res.status).toBe(200)
                                 expect(res.type).toMatch(/json/i)
                                 expect(res.body).toEqual(expect.objectContaining({name: "Parnall Correctional Facility"}))
                                 expect(res.body.prisoners).toEqual(expect.arrayContaining([
                                        {
                                            "availability": "On Site", "experience": "Veteran", "name": "Lucas Jackson", "skills": "Tenacity, Good under pressure"
                                        }
                                    ]))
                             })
                        })
                    })
                })
            }); 
        });
    });

});    '\nn/_   _\nn/'