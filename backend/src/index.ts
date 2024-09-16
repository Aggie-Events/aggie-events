import { app } from './express'
import { db } from './database'
import dotenv from 'dotenv'; 
dotenv.config();

app.get('/api/users/usernames', async (req, res) => {
    try {
        const users = await db.selectFrom('users').select('user_name').execute()
        res.json(users)
        console.log("User requested!")
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).send("Error fetching users!")
    }
})

app.post('/api/users', async (req, res) => {
    const { username, email } = req.body
    try {
        await db.insertInto('users').values({user_name: username, user_email: email}).execute()
        res.send("User created!")
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).send("Error creating user!")
    }
})
