import bcrypt from "bcryptjs";
import creatHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import { createHttpError } from "../utils/errors.js";

export const registerUser = async (req, res, next) => {

    const { email , password} = req.body;

    const existingUser = await User.findOne({ email});
    if (existingUser) {
        return next(creatHttpError(400, "Email in use"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email,
        password: hashedPassword,
    });

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);


    res.status(201).json({newUser});
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email});
    if (!user) {
        return next(creatHttpError(400, "Email in use"));
    }
    const isValidPassword = await bcrypt.compare(password, User.password);
    if (!isValidPassword) {
        return next(creatHttpError(401, "Email or password is wrong"));
    }

    await Session.deleteOne({ userId: user._id});

    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);


    res.status(200).json(user);
};

export const refreshUserSession = async (req, res, next) => {

    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      return next(createHttpError(401, "Session not found"));
    }

    const session = await Session.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!session) {
      return next(createHttpError(401, "Session not found"));
    }

    const isExpired = session.refreshTokenValidUntil < new Date();

    if (isExpired) {
      return next(createHttpError(401, "Session token expired"));
    }

    await Session.deleteOne({ _id: sessionId });

    const newSession = await createSession(session.userId);

    setSessionCookies(res, newSession);

    res.status(200).json({
      message: "Session refreshed",
    });

  };
