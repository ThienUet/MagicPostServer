const PointController = require('../controllers/point-controller');
const AuthToken = require('../libs/auth/AuthToken');
function connectRoutes(router) {
   router.post('/create-point', AuthToken.authTokenAdmin, PointController.createPoint);
   router.get('/list-point-transaction', AuthToken.authTokenAdmin, PointController.getListPointTranSaction);
   router.get('/list-point-hubs', AuthToken.authTokenAdmin, PointController.getListPointHubs);
}

module.exports.connect = connectRoutes;