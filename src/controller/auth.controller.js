import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


// ======================================================
// HELPERS
// ======================================================

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};


const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );
};


const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            type: "refresh",
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};


// ======================================================
// REGISTER
// ======================================================

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required",
            });
        }

        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email },
            ],
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "Username or email already exists",
            });
        }

        const hashedPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            verified: true,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
}


// ======================================================
// LOGIN
// ======================================================

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const hashedPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        if (hashedPassword !== user.password) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token hash in DB
        await sessionModel.create({
            user: user._id,
            refreshTokenHash: hashToken(refreshToken),
            ip: req.ip || "unknown",
            userAgent: req.get("user-agent") || "unknown",
        });

        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",

            accessToken,

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
}


// ======================================================
// GET ME
// ======================================================

export async function getMe(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token required",
            });
        }

        const accessToken = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            accessToken,
            config.JWT_SECRET
        );

        const user = await userModel
            .findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user,
        });

    } catch (error) {
        console.error("GET ME ERROR:", error);

        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired access token",
            });
        }

        return res.status(500).json({
            message: "Failed to get user",
            error: error.message,
        });
    }
}


// ======================================================
// REFRESH TOKEN
// ======================================================

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        if (decoded.type !== "refresh") {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        const refreshTokenHash = hashToken(refreshToken);

        const session = await sessionModel.findOne({
            user: decoded.userId,
            refreshTokenHash,
            revoked: false,
        });

        if (!session) {
            return res.status(401).json({
                message: "Session expired or revoked",
            });
        }

        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Rotate refresh token
        const newRefreshToken = generateRefreshToken(user);

        session.refreshTokenHash = hashToken(newRefreshToken);
        session.ip = req.ip || "unknown";
        session.userAgent = req.get("user-agent") || "unknown";

        await session.save();

        // New access token
        const accessToken = generateAccessToken(user);

        // Update cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Token refreshed successfully",
            accessToken,
        });

    } catch (error) {
        console.error("REFRESH TOKEN ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
}


// ======================================================
// LOGOUT
// ======================================================

export async function logout(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await sessionModel.updateOne(
                {
                    refreshTokenHash: hashToken(refreshToken),
                    revoked: false,
                },
                {
                    $set: {
                        revoked: true,
                    },
                }
            );
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error("LOGOUT ERROR:", error);

        return res.status(500).json({
            message: "Logout failed",
            error: error.message,
        });
    }
}


// ======================================================
// LOGOUT ALL
// ======================================================

export async function logoutAll(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token required",
            });
        }

        const accessToken = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            accessToken,
            config.JWT_SECRET
        );

        await sessionModel.updateMany(
            {
                user: decoded.userId,
                revoked: false,
            },
            {
                $set: {
                    revoked: true,
                },
            }
        );

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Logged out from all devices successfully",
        });

    } catch (error) {
        console.error("LOGOUT ALL ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
}