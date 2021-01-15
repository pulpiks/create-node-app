export const createUser = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new Error('doesnt have a username or a password');
    }
    
    next()
}