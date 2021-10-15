const User = require('../models/user');

const showRegisterForm = (req, res) => {
    res.render('users/register')
}

const showLoginForm = (req, res) => {
    res.render('users/login')
}

const registerUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, error => {
            if(error) return next();
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('register')
    }
}

const loginUser = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

const logoutUser = (req, res) => {
    req.logOut()
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}

module.exports.showRegisterForm = showRegisterForm;
module.exports.registerUser = registerUser;
module.exports.showLoginForm = showLoginForm;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;



