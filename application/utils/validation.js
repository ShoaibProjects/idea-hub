export const validatePassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // at least one digit, one lowercase, one uppercase, min length 8
  return regex.test(password);
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") {
    return input;
  }

  const trimmed = input.trim();

  const sanitized = trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return sanitized;
};
