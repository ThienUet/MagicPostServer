const UserController = require('../controllers/user-controller');
const AuthToken = require('../libs/auth/AuthToken');
function connectRoutes(router) {
    router.post('/sign-in', UserController.createUser);
    router.post('/login', UserController.userLogin);
    router.get('/get-user', AuthToken.authTokenUser, UserController.getUserByID);
    router.get('/list-user', AuthToken.authTokenAdmin, UserController.getListUser);
    router.post('/create-user', AuthToken.authTokenAdmin, UserController.createUser);
    router.get('/list-trans-manager', AuthToken.authTokenAdmin, UserController.getListTransManager);
    router.get('/list-hubs-manager', AuthToken.authTokenAdmin, UserController.getListHubsManager);
    router.post('/delete-user', AuthToken.authTokenAdmin, UserController.deleteUser);
    router.post('/update-user', AuthToken.authTokenAdmin, UserController.updateUser);
    
}

module.exports.connect = connectRoutes;