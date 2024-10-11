import express from 'express'
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get('/user', async (req, res) => {
    res.send(req.user ? req.user : { });
}) 

// Route to start Google OAuth login
authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// OAuth callback route
authRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
        console.log("Authentication success!")
        // Successful authentication
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Redirect to frontend
    }
);

authRouter.post('/logout', (req, res) => {
    // Destroy the session
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        // Clear the session cookie
        req.session.destroy(() => {
            res.clearCookie('connect.sid');  // Clear the session cookie
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});