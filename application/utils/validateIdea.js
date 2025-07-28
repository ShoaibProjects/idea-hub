export const validateIdea = (title, description, creator) => {
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return "Title must be a string and at least 5 characters long.";
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return "Description must be at least 10 characters long.";
  }
  if (!creator || typeof creator !== 'string' || creator.trim().length === 0) {
    return "Creator is required.";
  }
  return null;
};