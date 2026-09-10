import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";


// =========================
// REGISTER
// =========================
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const otp = generateOtp();
        const html = getOtpHtml(otp);

        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        await otpModel.create({
            email,
            user: user._id,
            otpHash
        });

        await sendEmail(
            email,
            "OTP Verification",
            `Your OTP code is ${otp}`,
            html
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified,
                role: user.role
            }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
}


// =========================
// LOGIN
// =========================
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "Email not verified"
        });
    }

    const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    const isPasswordValid = hashedPassword === user.password;

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }


    // =========================
    // REFRESH TOKEN
    // =========================
    const refreshToken = jwt.sign(
        {
            id: user._id
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");


    // =========================
    // CREATE SESSION
    // =========================
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });


    // =========================
    // ACCESS TOKEN
    // =========================
    const accessToken = jwt.sign(
        {
            id: user._id,
            sessionId: session._id,
            role: user.role
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );


    // =========================
    // COOKIE
    // =========================
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    return res.status(200).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
            role: user.role
        },
        accessToken
    });
}


// =========================
// GET ME
// =========================
export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified,
                role: user.role
            }
        });

   } catch (error) {
  console.log("JWT ERROR:", error.name, error.message);

  return res.status(401).json({
    message: "Invalid or expired token",
    error: error.message,
  });
}
}

// =========================
// REFRESH TOKEN
// =========================
export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");


        // =========================
        // FIND SESSION
        // =========================
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }


        // =========================
        // FIND USER
        // =========================
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }


        // =========================
        // NEW ACCESS TOKEN
        // =========================
        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id,
                role: user.role
            },
            config.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );


        // =========================
        // NEW REFRESH TOKEN
        // =========================
        const newRefreshToken = jwt.sign(
            {
                id: user._id
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const newRefreshTokenHash = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex");


        session.refreshTokenHash = newRefreshTokenHash;

        await session.save();


        // =========================
        // UPDATE COOKIE
        // =========================
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}


// =========================
// LOGOUT
// =========================
export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        });
    }

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    });

    if (!session) {
        return res.status(400).json({
            message: "Invalid refresh token"
        });
    }

    session.revoked = true;

    await session.save();

    res.clearCookie("refreshToken");

    return res.status(200).json({
        message: "Logged out successfully"
    });
}


// =========================
// LOGOUT ALL
// =========================
export async function logoutAll(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        await sessionModel.updateMany(
            {
                user: decoded.id,
                revoked: false
            },
            {
                revoked: true
            }
        );

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out from all devices successfully"
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}


// =========================
// VERIFY EMAIL
// =========================
export async function verifyEmail(req, res) {
    const { otp, email } = req.body;

    const otpHash = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    });

    if (!otpDoc) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    const user = await userModel.findByIdAndUpdate(
        otpDoc.user,
        {
            verified: true
        },
        {
            new: true
        }
    );

    await otpModel.deleteMany({
        user: otpDoc.user
    });

    return res.status(200).json({
        message: "Email verified successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified,
            role: user.role
        }
    });
}