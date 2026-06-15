import jwt from 'jsonwebtoken'

export async function verifyUser(req, res, next){
    try {
        const token = req.cookies.token
        console.log(token);

        if (!token) {
            return res.status(401).json({
                message: "Token Missing, user not logged in",
                success: false,
                err: "Token Missing"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded.email) {
            return res.status(401).json({
                message: "Unauthorized token",
                success: false,
                err: "Unauthorized token"
            })
        }

        req.email = decoded.email
        next()
    } catch (err) {
        return res.status(409).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}