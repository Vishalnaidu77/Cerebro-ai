import 'dotenv/config'
import { userModel } from "../models/user.model.js"
import jwt, { decode } from 'jsonwebtoken'
import { sendEmail } from "../services/email.service.js"
import mongoose from 'mongoose'

export async function registerController(req, res) {
    const { username, email, password } = req.body

    const userExists = await userModel.findOne({ email })
    if(userExists){
        return res.status(409).json({
            message: "User already exist with this email.",
            success: false,
            err: "User already exist."
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const [user] = await userModel.create([{
            username,
            email,
            password
        }], { session })

        const emailVerificationtoken = jwt.sign({
            email: user.email
        }, process.env.JWT_SECRET)

        const emailResponse = await sendEmail({
            to: email,
            subject: "Welcome to Cerebro AI",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
                
                <h2 style="color: #111;">Welcome to Cerebro AI.</h2>

                <p>Hi ${username},</p>

                <p>
                    Thank you for registering with Cerebro AI.
                    Please verify your email address to activate your account.
                </p>

                <div style="margin: 30px 0;">
                    <a 
                        href="http://localhost:8000/api/auth/verify-email?token=${emailVerificationtoken}"
                        style="
                            background-color: #111827;
                            color: #ffffff;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 6px;
                            display: inline-block;
                            font-weight: bold;
                        "
                    >
                        Verify Email
                    </a>
                </div>

                <p>This verification link will expire in 30 minutes.</p>

                <p>
                    If you didn’t create this account, you can safely ignore this email.
                </p>

                <br />

                <p>Welcome aboard!</p>

                <p>
                    — Team Cerebro AI
                </p>
            </div>
            `
        })

        await session.commitTransaction()
        session.endSession()

        res.status(200).json({
            message: "User register successfully, verification mail sent.",
            success: true,
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        await session.abortTransaction()
        session.endSession()

        return res.status(400).json({
            message: "Registration failed, please try again.",
            success: false,
            err: err.message
        })
    }
}

export async function verifyEmail(req, res) {
    const { token } = req.query

    if(!token){
        return res.status(404).json({
            message: "Missing token",
            success: false,
            err: "Missing token"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findOne({ email: decoded.email })

    if(!user){
        return res.status(401).json({
            message: "Unauthorized token",
            success: false,
            err: "Unauthorized token"
        })
    }

    user.verified = true
    user.save()

    const html = `
        <h1>Email verified successfull</h1>
        <p>Your email has been verified. You can now login to your account.</p>
        <a href='http://localhost:8000/api/auth/login'>Login</a>
    `

    res.send(html)
}

export async function loginController(req, res){
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if(!user){
        return res.status(404).json({
            message: "User not exist with this email, please register first.",
            success: false,
            err: "User not exists."
        })
    }

    if(!user.verified){
        res.status(401).json({
            message: "User email not verified yet, please verify the email.",
            succes: false,
            err: "Email not verified"
        })
    }

    const passVerify = await user.comparePassword(password)
    if(!passVerify){
        return res.status(401).json({
            message: "Invalid credentials.",
            success: false,
            err: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in sucessfully.",
        success: true,
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })
}

export async function resendVerificationEmail(req, res){
    const { email } = req.body

    const user = await userModel.findOne({ email })
    if(!user){
        return res.status(404).json({
            message: "User not found.",
            succes: false,
            err: "User not found"
        })
    }

    if(user.verified){
        return res.status(409).json({
            message: "User alreadyy verified",
            success: false,
            err: "Already verified"
        })
    }

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    sendEmail({
        to: email,
        subject: "New verification link",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;"> 
                <h2 style="color: #111;">Verify Your Email</h2> 
                <p>Hi ${user.username},</p> 
                <p> You requested a new email verification link for your Cerebro AI account. </p> 
                <div style="margin: 30px 0;"> 
                    <a href="http://localhost:8000/api/auth/verify-email?token=${emailVerificationToken}" style=" background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; " > Verify Email </a> 
                </div> <p>This link will expire in 30 minutes.</p> 
                <p> If you didn’t request this email, you can safely ignore it. </p> 
                <br /> 
                <p> — Team Cerebro AI </p> 
            </div>
        `
    })

    res.status(200).json({
        message: "Resent verification mail successfully.",
        succes: true
    })
}

export async function getMeController(req, res){
    const  email  = req.email
    console.log(email);

    const user = await userModel.findOne({ email })
    if(!user){
        return res.status(401).json({
            message: "Unauthorized user",
            success: false,
            err: "Unauthorized"
        })
    }

    res.status(200).json({
        message: "User data fetched",
        succes: true,
        user: {
            username: user.username,
            email: user.email
        }
    })
}