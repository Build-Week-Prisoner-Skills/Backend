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
});