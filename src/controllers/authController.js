import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";
import { createSession, setSessionCookies } from "../services/auth.js";

export const registerUser = async (req, res, next) => {

   const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, "Email in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);

    // повертаємо користувача напряму, без обгортки
    res.status(201).json(newUser);
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email});
    if (!user) {
        return next(createHttpError(401 , "User not found"));
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return next(createHttpError(401, "User not found"));
    }

    await Session.deleteOne({ userId: user._id});

    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);

    const safeUser = user.toJSON ? user.toJSON() : user;
    delete safeUser.password;

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

  export const logoutUser = async (req, res, next) => {

    const { sessionId } = req.cookies;

    if (!sessionId) {
        return next(createHttpError(401, "Session not found"));
    }

    await Session.deleteOne({_id: sessionId});

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");


    res.sendStatus(204);
  };
