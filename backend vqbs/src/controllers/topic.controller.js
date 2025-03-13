
import Topic from '../models/topic.model.js';
import Subject from '../models/subject.model.js';

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate('subject', 'name') 
      .sort({ name: 1 });
    res.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Server error while fetching topics." });
  }
};

export const addTopic = async (req, res) => {
  try {
    const { name, subjectId } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }


    const existingTopic = await Topic.findOne({ name, subject: subjectId });
    if (existingTopic) {
      return res.status(400).json({ error: "Topic already exists under this subject." });
    }
    

    const topic = new Topic({ name, subject: subjectId });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({ error: "Server error while adding topic." });
  }
};


export const updateTopic = async (req, res) => {
  try {
    const { id, name, subjectId } = req.body;

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    if (subjectId && subjectId !== topic.subject.toString()) {
      const newSubject = await Subject.findById(subjectId);
      if (!newSubject) {
        return res.status(404).json({ error: "New subject not found." });
      }
      topic.subject = subjectId;
    }

    if (name) {
      const existingTopic = await Topic.findOne({ name, subject: topic.subject, _id: { $ne: id } });
      if (existingTopic) {
        return res.status(400).json({ error: "Another topic with this name already exists under the same subject." });
      }
      topic.name = name;
    }

    await topic.save();
    res.json(topic);
  } catch (error) {
    console.error("Error updating topic:", error);
    res.status(500).json({ error: "Server error while updating topic." });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.body;

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    await Topic.deleteOne({ _id: id }); 
    res.json({ message: "Topic deleted successfully." });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ error: "Server error while deleting topic." });
  }
};
