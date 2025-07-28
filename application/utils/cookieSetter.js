const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const COOKIE_MAX_AGE_30_MINUTES = 30 * 60 * 1000; // 30 minutes

export const setAuthCookies = (res, username, rememberMe) => {
  const token = jwt.sign({ username }, JWT_SECRET, {
    expiresIn: rememberMe ? "7d" : "30m",
  });

  const maxAge = rememberMe ? COOKIE_MAX_AGE : COOKIE_MAX_AGE_30_MINUTES;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAge,
    sameSite: "Lax",
  });

  if (rememberMe) {
    res.cookie("rememberMe", "true", {
      httpOnly: false, // httpOnly must be false for client-side access
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge,
      sameSite: "Lax",
    });
  }
};
