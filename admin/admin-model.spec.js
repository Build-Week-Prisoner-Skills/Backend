const Admins = require('./admin-model')
const db = require('../database/db-config');

describe('admin-model', function() {

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
    });

    describe('add()', function() {
        it('adds admin to db', async function() {
            await Admins.add({
                name:'name',
                username: 'username', 
                password: 'password', 
            });
            const admins = await db('admins')
            expect(admins).toHaveLength(1);
        });
    });

    describe('find()', function() {
        it('finds all admins in db', async function() {
            await db.seed.run();
            const admins = await Admins.find();

            expect(admins).toHaveLength(3);
        });
    });

    describe('findById()', function() {
        it('finds user by id from db', async function() {
            await db.seed.run();
            const admin = await Admins.findById(3);

            expect(admin.name).toBe('Hal Moores');
            expect(admin.id).toBe(3);
        });
    });

    describe('findBy(prop)', function() {
        it('finds user by property from db', async function() {
            await db.seed.run();
            let prop = { username: 'smartin' };
            const admins = await Admins.findBy(prop)

            expect(admins).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name:'the Captain' }),
                    expect.objectContaining({ prison_id: 2 })
                ])
            )
        });
    });

    describe('remove()', function() {
        it('deletes user from db', async function() {
            await db.seed.run();
            await Admins.remove(2);

            const admins = await db('admins')
            expect(admins).toHaveLength(2);
        });
    });

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

        });
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
            ]));
        });
    });

    describe('findPrisonById()', function() {
        it('returns prison by id', async function() {
            await db.seed.run();
            const prison = await Admins.findPrisonById(2)
            expect(prison).toEqual(
                expect.objectContaining({ 
                    name: 'Road Prison 36',
                    postal_code: 32778
                })
            );
        });
    });

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
            ]));
        });
    });

    describe('findPrisonerById()', function() {
        it('returns prisoner by id', async function() {
            await db.seed.run();
            const prisoner = await Admins.findPrisonerById(6)
            expect(prisoner).toMatchObject(
                {
                    id: 6, 
                    name: 'Eduard Delacroix',
                    work_exp: 'Animal Trainer',
                    skills: 'Bilingual, Animal ',
                    availability: 'On Site',
                    prison_id: 3
                }
            )
        });
    });

    describe('removePrisoner()', function() {
        it('deletes prisoner from db', async function() {
            await db.seed.run()
            await Admins.removePrisoner(2)

            const prisoners = await db('prisoners')
            expect(prisoners).toHaveLength(5);
        });
    });

    describe('editPrisoner()', function() {
        it('edits prisoner in db', async function() {
            await db.seed.run();
            await Admins.editPrisoner(1, ({
                name: "Cody Russell",
                work_exp: "Prototyping",
                skills: "Art, dev",
                availability: "Day Pass",
                prison_id: 2
            }));

            const prisoner = await Admins.findPrisonerById(1)
            expect(prisoner.name).toBe('Cody Russell');
            expect(prisoner.availability).toBe('Day Pass');
        })
    });

});