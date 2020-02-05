const Prisoners = require('./prisoner-model')
const Admins = require('../admin/admin-model')
const db = require('../database/db-config');


describe('prisoner-model', function() {
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
        await db.seed.run()
    });

    describe('find()', function() {
        it('finds all prisoners in db', async function() {
            const prisoners = await Prisoners.find()

            expect(prisoners).toHaveLength(6);
            expect(prisoners).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: 1 }),
                    expect.objectContaining({ name: 'Lucas Jackson' })
                ])
            )
        });
    });

    describe('findByPrisonId()', function() {
        it('returns prisoners by prison_id', async function() {
            let prisoners = await Prisoners.findByPrisonId(3)
            expect(prisoners).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: 3}),
                    expect.objectContaining({ id: 6})
                ])
            )
        });
    });

    describe('findById()', function() {
        it('returns prisoner by id', async function() {
            let prisoner1 = await Prisoners.findById(1)
            expect(prisoner1).toMatchObject({
                id: 1,
                name: "Andy Dufresne",
                work_exp: "Accounting",
                skills: "Math, Planning",
                availability: "Day pass",
                prison_id: 1
            });
            let prisoner2 = await Prisoners.findById(2)
            expect(prisoner2).toMatchObject({
                id: 2,
                name: "Lucas Jackson",
                work_exp: "Veteran",
                skills: "Tenacity, Good under pressure",
                availability: "On Site",
                prison_id: 2
            });
        });
    });
    
});