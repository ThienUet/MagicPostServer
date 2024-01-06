const OrderModel = require('../models/orders');
const moment = require('moment')
module.exports.createNewOrder = (req, res) => {
    try {
        const data = req.body;
        if (data) {
            let query = {$or: []}
            let _lat = data.lat;
            query.push({lat: _lat});
            let _lng = data.lng;
            query.push({lng: _lng});
            let existedOrder = OrderModel.findOne(query).exec();
            if (existedOrder) {
                return res.status(404).send({code: 1, message: "Đã tồn tại đơn !"}).end();
            } else {
                const order = {
                    name: data.name,
                    address: data.address,
                    sentUser: data.sentUser,
                    receiveUser: data.receiveUser,
                    lat: data.lat,
                    lng: data.lng,
                    sentCoordinate: data.sentCoordinate,
                    receiveCoordinate: data.receiveCoordinate,
                    status: data.status,
                    weight: data.weight,
                    createBy: data.createBy,
                    createDate: moment().format(),
                    updatedBy: data.updatedBy,
                    updatedDate: data.updatedDate
                }
                const orderNew = new OrderModel(order);
                let result = orderNew.save();
                return res.status(200).send({code: 0, message: "Tạo đơn thành công !", data: result}).end();
            }
        } else {
            return res.status(404).send({code: 1, message: "Lỗi tạo đơn", error: "Không có data"}).end();
        }
    } catch (error) {
        return res.status(404).send({code: 1, message: "Lỗi tạo đơn hàng !", error: error}).end();
    }
}