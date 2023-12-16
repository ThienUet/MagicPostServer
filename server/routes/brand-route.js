const BrandController = require('../controllers/brand-controller');

function connectRoutes(router) {
    router.post('/create-brand', BrandController.createBrand);
    router.get('/brand-list', BrandController.getBrandList);
    router.get('/brand/:id', BrandController.getBrandById);
}

module.exports.connect = connectRoutes;