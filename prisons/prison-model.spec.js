const Prisons = require('./prison-model')
const db = require('../database/db-config');

describe('prison-model', function() {

    describe('test environment', function() {
        it('should use the testing environment', function() {
            expect(process.env.DB_ENV).toBe('testing')
        });
    });

    beforeEach(async function() {
        await db('prisons').truncate();
        await db('prisons').truncate();
        await db('prisons').truncate();
        await db.seed.run();
    });

    afterAll(async function() {
        await db('prisons').truncate();
        await db('prisons').truncate();
        await db('prisons').truncate();
    });

    describe('add()', function() {
        it('adds Prison to db', async function() {
            await Prisons.add({
                name: "Parnall Correctional Facility",
                address: "1780 East Parnall Road",
                city: "Jackson",
                state: "MI",
                postal_code: 49201
            });
            const prisons = await db('prisons')
            expect(prisons).toHaveLength(4);
            expect(prisons).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Parnall Correctional Facility' }),
                    expect.objectContaining({ id: 1 }),
                    expect.objectContaining({ postal_code: 32778 })
                ])
            );
        });
    });

    describe('find()', function() {
        it('finds all prisons in db', async function() {
            const prisons = await Prisons.find()
            expect(prisons).toHaveLength(3);
            expect(prisons).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Cold Mountain Penitentiary' }),
                    expect.objectContaining({ id: 1 }),
                    expect.objectContaining({ postal_code: 32778 })
                ])
            );
        });
    });

    describe('findById()', function() {
        it('finds Prison by id from db', async function() {
            const Prison = await Prisons.findById(2)
            expect(Prison.name).toBe('Road Prison 36');
            expect(Prison.postal_code).toBe(32778);
        });
    });

    describe('findBy(prop)', function() {
        it('finds Prison by property from db', async function() {    
            let prop = { postal_code: 70712 }       
            const prisons = await Prisons.findBy(prop)
            expect(prisons).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Cold Mountain Penitentiary' }),
                    expect.objectContaining({ id: 3 })
                ])
            );
        })
    });

    describe('findPrisoners()', function() {
        it('returns prison object with prisoners as an array property ', async function() {
            const prison = await Prisons.findPrisoners(2)
            expect(prison).toEqual(
                expect.objectContaining({ prisoners: expect.arrayContaining([
                    expect.objectContaining({ name: 'Dragline' }),
                    expect.objectContaining({ name: 'Lucas Jackson' }),
                    expect.not.objectContaining({ name: 'John Coffey' }),
                    expect.not.objectContaining({ name: 'Andy Dufresne' }),
                ])})
            );
            expect(prison.zip).toEqual(32778);
        });
    });

    describe('remove()', function() {
        it('deletes Prison from db', async function() {
            await Prisons.remove(2)
            const prisons = await db('prisons')
            expect(prisons).toHaveLength(2);
            expect(prisons).toEqual(
                expect.arrayContaining([
                    expect.not.objectContaining({ id: 2 }),
                    expect.not.objectContaining({ name: 'Road Prison 36' })
                ])
            );
        });
    });

    describe('edit()', function() {
        it('edits Prison in db', async function() {
            await Prisons.edit(1, ({
                name: "Parnall Correctional Facility",
                address: "1780 East Parnall Road",
                city: "Jackson",
                state: "MI",
                postal_code: 49201
            }));
            const prison = await Prisons.findById(1);
            expect(prison.name).toBe('Parnall Correctional Facility');
            expect(prison.postal_code).toEqual(49201);

        });
    });   

});