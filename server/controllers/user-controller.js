const UserModel = require('../models/users');
const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const moment = require('moment');
// take secret_key
const privateJwtKey = process.env.PRIVATE_KEY;

// encrypt password by Bcrypt
const _hashPassword = async(password) => {
    const salt = await Bcrypt.genSalt();
    let hash = await Bcrypt.hash(password, salt);
    return hash;
}

// tạo token đăng nhập
const userLogin = (user) => {
    const tokenData = {
        id: user._id,
        role: user.role
    }
    return tokenData;
}

// Lấy token đăng nhập
const getToken = (tokenData) => {
    return Jwt.sign(tokenData, privateJwtKey, {
        expiresIn: 86400 // 24hours
    });
}

// Tạo mới người dùng tương ứng chức năng đăng ký
module.exports.createUser = async (req, res) => {
     try {
        const data = req.body;
            // Check xem có data trong request.body hay không, Nếu không trả về lỗi
            if (Object.keys(data).length !== 0) {
                // Đầu tiên check xem số điện thoại hoặc email đã có tồn tại trong database hay chưa nếu có thì gửi về mã lỗi 404.
                // Check xem sdt hoặc email của người đăng ký đã có trong database hay chưa. Có gửi lỗi 404.
                // $or là cú pháp truy vấn MongoDB, cho phép xác định một điều kiện để tìm kiếm các bản ghi
                // thỏa mãn ít nhất một trong những điều kiện đó.
                // $or: [] => $or được gán cho [], [] là một mảng trống, nghĩa là chưa có điều kiện nào đươc
                // xác định ngay từ đầu
                const query = {$or: []}
                if (data.email && data.phone) {
                    let email = data.email;
                    if (email) {
                        email = email.trim().toLowerCase();
                        query.$or.push({ email: email });
                    }
                    let phone = data.phone;
                    if (phone) {
                        phone = phone.trim().toLowerCase();
                        query.$or.push({ phone: phone });
                    }

                    let existedPhoneOrEmail = await UserModel.findOne(query).exec();
                    if (existedPhoneOrEmail) {
                        // Nếu đã tồn tại số điện thoại hoặc email thì trả về mã lỗi 404.
                        return res.status(404).send({code: 0, error: `Email hoặc số điện thoại đã tồn tại !`}).end();
                    } else {
                        // Tại đây tiến hành mã hóa mật khẩu của người dùng đẩy lên qua request.
                        const password = await _hashPassword(data.password);
                        const user = {
                            password: password,
                            email: email,
                            phone: phone,
                            address: data.address,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            gender: data.gender,
                            role: data.role || 'client',
                            banned: false,
                            birthDate: data.birthDate,
                            createdAt: Date.now(),
                            createdBy: data.createdBy || '',
                        }
                        const userModel = new UserModel(user);
                        let result = await userModel.save();
                        return res.status(200).send({code: 1, message: 'Tạo người dùng thành công', data: result}).end();
                    }
                } else {
                    return res.status(401).send({code: 1, message: 'Thiếu email hoặc số điện thoại'});
                }
            } else {
                return res.status(401).send({code: 1, message: 'Chưa nhận được data trong request!'});
            }
    } catch (error) {
        return res.status(500).send({ code: 0, message: "Lỗi thêm người dùng mới", error: error }).end();
    } 
}


// Người dùng đăng nhập
module.exports.userLogin = async(req, res) => {
    try {
        let {accountName, password} = req.body;
        accountName = accountName.toLowerCase();
        return UserModel.findOne({$or: [{email: accountName}, {phone: accountName}]}).then((user) => {
            if (!user) {
                return res.status(404).send({code: 1, message: 'Tài khoản không tồn tại !', error: 'Tài khoản không tồn tại !'}).end();
            } else {
                if (user.isBanned) {
                    return res.status(404).send({code: 1, message: 'Tài khoản của bạn bị khóa, vui lòng liên hệ quản trị viên !', error: 'Tài khoản của bạn bị khóa, vui lòng liên hệ quản trị viên !'}).end();
                } else {
                    Bcrypt.compare(password, user.password, async(err, result) => {
                        if (err) {
                            return res.status(404).send({code: 1, message: 'Đăng nhập thất bại, Lỗi: ' + err, error: err}).end();
                        }
                        if (result) {
                            const userData = userLogin(user);
                            const token = getToken(userData);
                            return res.status(200).send({code: 0, message: "Đăng nhập thành công !", data: {token: token}}).end();
                        } else {
                            return res.status(404).send({code: 1, message: "Đăng nhập thất bại, mật khẩu không chính xác !", error: 'Đăng nhập thất bại, mật khẩu không chính xác !'}).end();
                        }
                    })
                }
            }
        }).catch(err => res.status(404).send({code: 1, message: "Lỗi xảy ra phía database !", error: err}).end());
    } catch(error) {
        return res.status(500).send({ code: 1, message: "Lỗi thêm người dùng mới", error: error }).end();
    }
}

// Lấy thông tin người dùng qua ID:
module.exports.getUserByID = async (req, res) => {
    try {
        const id = req.userId;
        if (id) {
            return UserModel.findById({ _id: id}).select('-password').then((user) => {
                if (!user) {
                    return res.status(404).send({ code: 1, message: "Không tìm thấy người dùng với id", error: "Không tìm thấy người dùng với id"}).end();
                } else {
                    return res.status(200).send({ code: 0, message: "Đã tìm thấy người dùng", data: user}).end();
                }
            }).catch((error) => {
                return res.status(404).send({ code: 1, message: "Lỗi tìm người dùng", error: error}).end();
            })
        } else {
            return res.status(404).send({ code: 1, message: "Không có ID truyền lên", error: "Không có id truyền lên !"}).end();
        }
    } catch(err) {
        return res.status(500).send({ code: 1, message: "Không thể lấy thông tin người dùng", error: err}).end();
    }
}


module.exports.getListUser = (req, res) => {
    try {
        const role = req.role;
        if (!role) {
            return res.status(404).send({code: 1, message: "Không có quyền lấy dữ liệu", error: "No privilege provided !"}).end();
        }
        if (role === 'admin') {
            UserModel.find({$or: [{role: 'point-transaction-manager'}, {role: 'goods-hub-manager'}]}).select('-password').then((user) => {
                if (user) {
                    return res.status(200).send({code: 0, message: "Lấy danh sách người dùng thành công !", data: user}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Không lấy được danh sách người dùng"}).end();
                }
            } )
        }
        if (role === 'point-transaction-manager') {
            UserModel.find({role: 'point-transaction-officer'}).select('-password').then((user) => {
                if (user) {
                    return res.status(200).send({code: 0, message: "Lấy danh sách người dùng thành công !", data: user}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Không lấy được danh sách người dùng"}).end();
                }
            })
        }
        if (role === 'goods-hub-manager') {
            UserModel.find({role: 'goods-hub-officer'}).select('-password').then((user) => {
                if (user) {
                    return res.status(200).send({code: 0, message: "Lấy danh sách người dùng thành công !", data: user}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Không lấy được danh sách người dùng"}).end();
                }
            })
        }
    } catch(err) {
        return res.status(500).send({code: 1, message: "Không thể lấy danh sách người dùng !", error: err}).end();
    }
}

module.exports.updateUser = (req, res) => {
    try {
        const id = req.userId;
        const user = req.body;
        if (user) {
            const payload = {
                updatedDate: moment().locale('vi').format(),
                updatedBy: req.userId
            }
            payload.updatedBy = id;
            payload.updatedDate = moment().format();
            if (user.role !== undefined) payload.role = user.role;
            if (user.firstName !== undefined) payload.firstName = user.firstName;
            if (user.lastName !== undefined) payload.lastName = user.lastName;
            if (user.email !== undefined) payload.email = user.email;
            if (user.phone !== undefined) payload.phone = user.phone;
            if (user.address !== undefined) payload.address = user?.address;
            if (user.gender !== undefined) payload.gender = user.gender;
            if (user.birthDate !== undefined) payload.birthDate = user.birthDate;

            UserModel.updateOne({_id: user._id}, {$set: payload}).then((user) => {
                if (user) {
                    return res.status(200).send({code: 0, message: "Cập nhật thành công !"});
                } else {
                    return res.status(404).send({code: 1, message: 'Cập nhật thất bại !'});
                }
            });
        } else {
            return res.status(404).send({code: 1, message: "Không thể cập nhật người dùng", error: 'Không có user truyền lên'}).end();
        }
    } catch (error) {
        return res.status(404).send({code: 1, message: "Không thể cập nhật người dùng", error: error}).end();
    }
}


module.exports.getListTransManager = (req, res) => {
    try {
        const role = req.role;
        if (!role) {
            return res.status(404).send({code: 1, message: "Không có quyền lấy dữ liệu", error: "No privilege provided !"}).end();
        } else {
            UserModel.find({role: 'point-transaction-manager'}).select('-password').then((user) => {
                if (user) {
                    return res.status(200).send({code: 0, message: "Lấy danh sách người dùng thành công !", data: user}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Không lấy được danh sách người dùng"}).end();
                }
            }).catch((err) => {
                return res.status(404).send({code: 1, message: "Lấy danh sách thất bại !", error: err});
            })
        }
    } catch(err) {
        return res.status(500).send({code: 1, message: "Không thể lấy danh sách người dùng !", error: err}).end();
    }
}


module.exports.getListHubsManager = (req, res) => {
    try {
        const role = req.role;
        if (!role) {
            return res.status(404).send({code: 1, message: "Không có quyền lấy dữ liệu", error: "No privilege provided !"}).end();
        } else {
            UserModel.find({role: 'goods-hub-manager'}).select('-password').then((user) => {
                if (user) {
                    return res.status(200).send({code: 0, message: "Lấy danh sách người dùng thành công !", data: user}).end();
                } else {
                    return res.status(404).send({code: 1, message: "Không lấy được danh sách người dùng"}).end();
                }
            }).catch((err) => {
                return res.status(404).send({code: 1, message: "Lấy danh sách thất bại !", error: err});
            })
        }
    } catch(err) {
        return res.status(500).send({code: 1, message: "Không thể lấy danh sách người dùng !", error: err}).end();
    }
}


module.exports.deleteUser = (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            UserModel.deleteOne({_id: id}).then(() => {
                return res.status(200).send({code: 0, message: "Xóa thành công !"}).end();
            }).catch((error) => {
                return res.status(404).send({code: 1, message: "Xóa thất bại !", error: error}).end();
            })
        } else {
            return res.status(404).send({code: 1, message: "Không có user truyền lên !", error: "Không có user truyền lên !"}).end();
        }
    } catch (error) {
        return res.status(404).send({code: 1, message: "Không thể xóa !", error: error}).end();
    }
}