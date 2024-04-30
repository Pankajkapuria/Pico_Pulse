const usermodel = require('../Config/models/user.js')
const jwt = require('jsonwebtoken');
exports.isAuthenticated = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NTM5ZTAxNmMwNzllYTM4N2I1MjI4ZDUiLCJpYXQiOjE3MTE3ODU0NTYsImV4cCI6MTcxMTg3MTg1Nn0.Bhvgg663SkgAWMtwaXf1CX6jKYIP9tbIfX59-zBDc9k"
        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: 'please login first'
            })
        }

        const decode = jwt.verify(token, process.env.SERACT_KEY);
        const payload = decode.UserId;

        req.user = await usermodel.findOne({ _id: payload });
        next();
    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}