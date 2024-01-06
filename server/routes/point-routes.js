const PointController = require('../controllers/point-controller');
const AuthToken = require('../libs/auth/AuthToken');
function connectRoutes(router) {
   router.post('/create-point-transaction', AuthToken.authTokenAdmin, PointController.createPoint);
   router.post('/create-point-hub', AuthToken.authTokenAdmin, PointController.createPoint);
   router.get('/list-point-transaction', AuthToken.authTokenAdmin, PointController.getListPointTranSaction);
   router.get('/list-point-hubs', AuthToken.authTokenAdmin, PointController.getListPointHubs);
   router.get('/list-point', AuthToken.authTokenAdmin, PointController.getAllPoint);
}

module.exports.connect = connectRoutes;