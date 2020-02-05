const Admins = require('./admin-model')
const db = require('../database/db-config');

describe('admin-model', function() {

    describe('test environment', function() {
        it('should use the testing environment', function() {
            expect(process.env.DB_ENV).toBe('testing')
        })
    })

    beforeEach(async function() {
        await db('admins').truncate();
        await db('prisons').truncate();
        await db('prisoners').truncate();
    })

    afterEach(async function() {
        await db('admins').truncate();
        await db('prisons').truncate();
        await db('prisoners').truncate();
    })

    describe('add()', function() {
        it('adds admin to db', async function() {
            await Admins.add({
                name:'name',
                username: 'username', 
                password: 'password', 
            });
            const admins = await db('admins')
            expect(admins).toHaveLength(1);
        })
    })

    describe('find()', function() {
        it('finds all admins in db', async function() {
            await Admins.addPrison({
                name: "Parnall Correctional Facility",
                address: "1780 East Parnall Road",
                city: "Jackson",
                state: "MI",
                postal_code: 49201
            });
            await Admins.add({
                name: 'cody', 
                username: 'cmruss', 
                password: 'password',
                prison_id: 1 
            });
            await Admins.add({
                name: 'mutch',
                username: 'mmmeans', 
                password: 'password', 
                prison_id: 1 
            });
           
            const admins = await Admins.find()

            expect(admins).toHaveLength(2);
        })
    })

    describe('findById()', function() {
        it('finds user by id from db', async function() {
        await Admins.add({
                name: 'cody', 
                username: 'cmruss', 
                password: 'password', 
            });
            await Admins.add({
                name: 'mutch',
                username: 'mmmeans', 
                password: 'password', 
            });
           
            const user = await Admins.findById(2)
            expect(user.name).toBe('mutch');
        })
    })

    describe('findBy(prop)', function() {
        it('finds user by property from db', async function() {
        await Admins.add({
                name: 'cody', 
                username: 'cmruss', 
                password: 'password', 
            });
            await Admins.add({
                name: 'mutch',
                username: 'mmmeans', 
                password: 'password', 
            });
           
            const user = await Admins.findById(2)
            expect(user.name).toBe('mutch');
        })
    })

    describe('remove()', function() {
        it('deletes user from db', async function() {
        await Admins.add({
                name: 'cody', 
                username: 'cmruss', 
                password: 'password', 
            });
            await Admins.add({
                name: 'mutch',
                username: 'mmmeans', 
                password: 'password', 
            });
            await Admins.remove(2)

            const admins = await db('admins')
            expect(admins).toHaveLength(1);
        })
    })

    describe('edit()', function() {
        it('edits user in db', async function() {
            await Admins.add({
                name: 'cody', 
                username: 'cmruss', 
                password: 'password', 
            });
            await Admins.edit(1, ({
                username: 'mutch', 
                password: 'password', 
            }));

            const user = await Admins.findById(1)
            expect(user.username).toBe('mutch');
            expect(user.password).toBe('password');

        })
    });

    /**  PRISON SPEC **/
    
    describe('addPrison()', function() {
        it('adds prison to db', async function() {
            await Admins.addPrison({
                name: "Parnall Correctional Facility",
                address: "1780 East Parnall Road",
                city: "Jackson",
                state: "MI",
                postal_code: 49201
            });
            const prisons = await db('prisons')
            expect(prisons).toHaveLength(1);
            expect(prisons).toEqual(expect.arrayContaining([
                {
                    id: 1,
                    name: "Parnall Correctional Facility",
                    address: "1780 East Parnall Road",
                    city: "Jackson",
                    state: "MI",
                    postal_code: 49201
                }
            ]))
        })
    })

    describe('findPrisonById()', function() {
        it('returns prison by id', async function() {
            await Admins.addPrison({
                name: "Parnall Correctional Facility",
                address: "1780 East Parnall Road",
                city: "Jackson",
                state: "MI",
                postal_code: 49201
            });
            const prison = await Admins.findPrisonById(1)
            expect(prison).toMatchObject(
                {
                    id: 1,
                    name: "Parnall Correctional Facility",
                    address: "1780 East Parnall Road",
                    city: "Jackson",
                    state: "MI",
                    postal_code: 49201
                }
            )
        })
    })    

    /* PRISONER SPEC */

    describe('addPrisoner()', function() {
        it('adds prisoner to db', async function() {
            await Admins.addPrisoner({
                name: "Andy Dufresne",
                work_exp: "Accounting",
                skills: "Math, Planning",
                availability: "Day pass",
                prison_id: 1
            });
            const prisoners = await db('prisoners')
            expect(prisoners).toHaveLength(1);
            expect(prisoners).toEqual(expect.arrayContaining([
                {
                    id: 1,
                    name: "Andy Dufresne",
                    work_exp: "Accounting",
                    skills: "Math, Planning",
                    availability: "Day pass",
                    prison_id: 1
                }
            ]))
        })
    })

    describe('findPrisonerById()', function() {
        it('returns prisoner by id', async function() {
            await Admins.addPrisoner({
                name: "Andy Dufresne",
                work_exp: "Accounting",
                skills: "Math, Planning",
                availability: "Day pass",
                prison_id: 1
            });
            const prisoner = await Admins.findPrisonerById(1)
            expect(prisoner).toMatchObject(
                {
                    id: 1,
                    name: "Andy Dufresne",
                    work_exp: "Accounting",
                    skills: "Math, Planning",
                    availability: "Day pass",
                    prison_id: 1
                }
            )
        })
    })    

    describe('removePrisoner()', function() {
        it('deletes prisoner from db', async function() {
            await Admins.addPrisoner({
                name: "Andy Dufresne",
                work_exp: "Accounting",
                skills: "Math, Planning",
                availability: "Day pass",
                prison_id: 1
            });
            await Admins.addPrisoner({
                name: "Lucas Jackson",
                work_exp: "Veteran",
                skills: "Tenacity, Good under pressure",
                availability: "On Site",
                prison_id: 2
            });
            await Admins.removePrisoner(2)

            const prisoners = await db('prisoners')
            expect(prisoners).toHaveLength(1);
        })
    })

    describe('editPrisoner()', function() {
        it('edits prisoner in db', async function() {
            await Admins.addPrisoner({
                name: "Andy Dufresne",
                work_exp: "Accounting",
                skills: "Math, Planning",
                availability: "Day pass",
                prison_id: 1
            });
            await Admins.editPrisoner(1, ({
                name: "Lucas Jackson",
                work_exp: "Veteran",
                skills: "Tenacity, Good under pressure",
                availability: "On Site",
                prison_id: 2
            }));

            const prisoner = await Admins.findPrisonerById(1)
            expect(prisoner.name).toBe('Lucas Jackson');
            expect(prisoner.availability).toBe('On Site');
        })
    });

});