const UserController = require('../controllers/user-controller');
// const AuthToken = require('../libs/auth/AuthToken');
function connectRoutes(router) {
    router.post('/sign-in', UserController.createUser);
}

module.exports.connect = connectRoutes;