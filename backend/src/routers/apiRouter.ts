import express from 'express'
import { db } from '../database'
import { authMiddleware } from '../middlewares/authMiddleware'

export const apiRouter = express.Router();

apiRouter.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await db.selectFrom('users').selectAll().execute()
        res.json(users)
        console.log("User requested!")
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).send("Error fetching users!")
    }
})

apiRouter.get('/auth', async (req, res) => {
    console.log("Get auth req.user: " + req.user)
    if (!req.user) {
        res.status(401).json({ message: 'User not logged in' });
    } else {
        res.status(200).json({ message: 'User is logged in' });
    }
})

apiRouter.get('/test', async (req, res) => {
    res.status(200).json({ message: 'Test successful!' });
})

apiRouter.post('/users', authMiddleware, async (req, res) => {
    // TODO: check if username is already existent
    const { username, email } = req.body
    console.log("Post user req.user: " + req.user)
    try {
        await db.insertInto('users').values({ user_name: username, user_email: email }).execute()
        res.send("User created!")
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).send("Error creating user!")
    }
})

apiRouter.put('/users', authMiddleware, async (req, res) => {
    // TODO: check if user is already existent
    const { username, email } = req.body
    try {
        await db.updateTable('users').set('user_name', username).where('user_email', '=', email).execute()
        res.send(username +"")
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).send("Error updating user!")
    }
})

apiRouter.delete('/users', authMiddleware, async (req, res) => {
    try {
        await db.deleteFrom('users').execute()
        res.send("Users deleted!")
    } catch (error) {
        console.error('Error deleting users:', error)
        res.status(500).send("Error deleting users!")
    }
})