const PointModel = require('../models/points');
const moment = require('moment');

module.exports.createPoint = async(req, res) => {
    try {
        const role = req.role;
        const data = req.body;
        const query = {$or: []};
        if (role) {
            if (data.name && data.address && data.lat && data.lng) {
                let _name = data.name;
                _name = _name.trim().toLowerCase();
                query.$or.push({name: _name});
                let _address = data.address;
                _address = _address.trim().toLowerCase();
                query.$or.push({address: _address});
                let _lat = data.lat;
                query.$or.push({lat: _lat});
                let _lng = data.lng;
                query.$or.push({lng: _lng});

                let existedPlace = await PointModel.findOne(query).exec();
                if (existedPlace) {
                    return res.status(404).send({code: 1, message: "Đã tồn tại địa điểm này", error: 'Existed'}).end();
                } else {
                    const point = {
                        name: _name,
                        address: _address,
                        pointType: data.pointType,
                        lat: _lat,
                        lng: _lng,
                        pointRelation: data.pointRelation || null,
                        pointManager: data.pointManager,
                        createBy: 'admin',
                        createDate: moment().format(),
                        updateBy: 'admin',
                        updatedDate: moment().format()
                    }
                    const pointModel = new PointModel(point);
                    let result = await pointModel.save();
                    return res.status(200).send({code: 0, message: "Tạo điểm thành công !", data: result}).end();
                }
            } else {
                return res.status(404).send({code: 1, message: "Tạo điểm thất bại !", error: "Thiếu thông tin truyền lên !"});
            }
        } else {
            return res.status(404).send({code: 1, message: 'Không thể tạo điểm, không có quyền tạo!', error: 'No privilege provided !'})
        }
    } catch (error) {
        return res.status(404).send({code: 0, message: "Không thể tạo điểm !", error: error}).end();
    }
}

module.exports.getListPointTranSaction = (req, res) => {
    try {
        const role = req.role;
        if (role !== 'admin') {
            return res.status(404).send({code: 1, message: "Không thể lấy danh sách !", error: "Không được cấp quyền !"}).end();
        } else {
            PointModel.find({pointType: 'transaction-point'}).then((point) => {
                if (point) {
                    return res.status(200).send({code: 0, message: "Lấy dữ liệu thành công !", data: point}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Lấy dữ liệu thất bại", error: "Không có data !"}).end();
                }
            })
        }
    } catch (error) {
        return res.status(404).send({code: 1, message: "Không thể lấy danh sách", error: error}).end();
    }
}

module.exports.getListPointHubs = (req, res) => {
    try {
        const role = req.role;
        if (role !== 'admin') {
            return res.status(404).send({code: 1, message: "Không thể lấy danh sách !", error: "Không được cấp quyền !"}).end();
        } else {
            PointModel.find({pointType: 'hub-point'}).then((point) => {
                if (point) {
                    return res.status(200).send({code: 0, message: "Lấy dữ liệu thành công !", data: point}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Lấy dữ liệu thất bại", error: "Không có data !"}).end();
                }
            })
        }
    } catch (error) {
        return res.status(404).send({code: 1, message: "Không thể lấy danh sách", error: error}).end();
    }
}


module.exports.deletePoint = (req, res) => {
    try {
        const role = req.role;
        const {id} = req.body;
        if (role !== 'admin') {
            return res.status(404).send({code: 1, message: "Không thể lấy danh sách !", error: "Không được cấp quyền !"}).end();
        } else {
            PointModel.deleteOne({_id: id}).then(() => {
                return res.status(200).send({code: 0, message: "Xóa địa điểm thành công !"});
            }).catch((err) => {
                return res.status(404).send({code: 1, message: "Không thể xóa địa điểm", error: err});
            });
        }
    } catch (error) {
        return res.status(404).send({code: 1, message: "Không thể lấy danh sách", error: error}).end();
    }
}


