

import Subject from '../models/subject.model.js';

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Server error while fetching subjects." });
  }
};

export const addSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      return res.status(400).json({ error: "Subject already exists." });
    }

    const subject = new Subject({ name });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ error: "Server error while adding subject." });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id, name } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

   
    const existingSubject = await Subject.findOne({ name, _id: { $ne: id } });
    if (existingSubject) {
      return res.status(400).json({ error: "Another subject with this name already exists." });
    }

    subject.name = name;
    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Server error while updating subject." });
  }
};


export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.body;

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }


    res.json({ message: "Subject deleted successfully." });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Server error while deleting subject." });
  }
};
