import {
  registerUser,
  loginUser,
  getUserFromToken,
} from "../services/authService.js";
import { setAuthCookies } from "../utils/cookieSetter.js";

export const signupform = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    setAuthCookies(res, user.username, req.body.rememberMe);
    const { password, ...others } = user._doc;
    res.status(201).json(others);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    setAuthCookies(res, user.username, req.body.rememberMe);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(err.status || 401).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("rememberMe");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserFromToken(req.cookies.token);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(err.status || 401).json({ message: err.message });
  }
};
