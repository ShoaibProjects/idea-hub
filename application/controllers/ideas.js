import {
  createIdea,
  getIdeaById,
  getAllIdeas,
  updateIdeaById,
  deleteIdeaById,
} from "../services/ideaService.js";

export const addIdea = async (req, res) => {
  try {
    const idea = await createIdea(req.body);
    res.status(201).json(idea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getIdea = async (req, res) => {
  try {
    const idea = await getIdeaById(req.params.id);
    res.json(idea);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};

export const getMany = async (req, res) => {
  try {
    const { ideas, total, currentPage, totalPages } = await getAllIdeas(req.query);
    res.json({ ideas, total, currentPage, totalPages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const updatedIdea = await updateIdeaById(req.params.id, req.body, req.user.username);
    res.status(200).json(updatedIdea);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    await deleteIdeaById(req.params.id, req.user.username);
    res.status(201).json({ message: "Idea deleted" });
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
};
