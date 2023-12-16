const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.authTokenUser = (req, res, next) => {
    // Vì axios đã cấu hình sẵn bên client là gửi header chưa authorization lên rồi nên là ở cái middleware này sẽ nhận được !
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (!token) return res.send({code: 5, auth: false, message: 'Không có token để xác thực !'});

    // Tiến hành dùng JWT phân giải cái token ra lấy dữ liệu.
    jwt.verify(token, config.privateKey, (err, user) => {
        if (err) return res.send({code: 5, auth: false, message: 'Xác thực token thất bại !'});
        req.userId = user.id;
        req.user = user;
        return next();
    })
};

module.exports.authTokenAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (!token) return res.send({code: 5, auth: false, message: 'Không có token để xác thực !'});
    // Tiến hành dùng JWT phân giải cái token ra lấy dữ liệu.
    jwt.verify(token, config.privateKey, (err, user) => {
        if (err) return res.send({code: 5, auth: false, message: 'Xác thực token thất bại !'});
        if (user.role === 'admin') {
            req.userId = user.id;
            req.user = user;
            return next();
        } else {
            return res.send({code: 5, auth: false, message: 'Không có quyền ADMIN'});
        }
        
    })
}