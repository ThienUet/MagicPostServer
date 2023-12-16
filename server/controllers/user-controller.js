const UserModel = require('../models/users');
const Bcrypt = require('bcryptjs');
// const Jwt = require('jsonwebtoken');
// const config = require('../config/config');
// encrypt password by Bcrypt
const _hashPassword = async(password) => {
    const salt = await Bcrypt.genSalt();
    let hash = await Bcrypt.hash(password, salt);
    return hash;
}

// tạo token đăng nhập
// const userLogin = (user) => {
//     const tokenData = {
//         id: user._id,
//         full_name: user.full_name,
//         role: user.role
//     }
//     return tokenData;
// }
// Lấy token đăng nhập
// const getToken = (tokenData) => {
//     return Jwt.sign(tokenData, config.privateKey, {
//         expiresIn: 86400 // 24hours
//     });
// }

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
                        return res.status(404).send({code: 0, message: `Tên tài khoản hoặc email hoặc số điện thoại đã tồn tại`, error: `existed`}).end();
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

