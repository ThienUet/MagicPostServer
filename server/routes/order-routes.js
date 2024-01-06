const OrderController = require('../controllers/product-controller');
const AuthToken = require('../libs/auth/AuthToken');
function connectRoutes(router) {
   router.post('/create-order', AuthToken.authTokenAdmin, OrderController.createNewOrder);
}

module.exports.connect = connectRoutes;