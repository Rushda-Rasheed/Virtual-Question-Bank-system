
"use client";

import { useState, useContext, useEffect } from 'react';
import AuthContext from "@/context/AuthContext"; 
import Layout from '../../components/Layout'; 
import toast from 'react-hot-toast';

export default function TopicManagement() {
 
  const { 
    topics, 
    subjects, 
    fetchAllTopics, 
    addTopic, 
    updateTopic, 
    deleteTopic 
  } = useContext(AuthContext);
  
  const [topicName, setTopicName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [view, setView] = useState('list'); 
  useEffect(() => {
    fetchAllTopics(); 
  }, [fetchAllTopics]);

 
  const handleAddTopic = async () => {
    const trimmedName = topicName.trim();
    if (!trimmedName) {
      toast.error('Please enter a topic name.');
      return;
    }

    if (!selectedSubjectId) {
      toast.error('Please select a subject.');
      return;
    }
    
    try {
      await addTopic(trimmedName, selectedSubjectId);
      setTopicName('');
      setSelectedSubjectId('');
      setView('list'); 
      toast.success('Topic added successfully!');
    } catch (error) {
      console.error('Error adding topic:', error);
      toast.error(error.response?.data?.error || 'Failed to add topic.');
    }
  };

 
  const handleUpdateTopic = async () => {
    const trimmedName = topicName.trim();
    if (!trimmedName) {
      toast.error('Please enter a topic name.');
      return;
    }

    if (!selectedSubjectId) {
      toast.error('Please select a subject.');
      return;
    }

    try {
      await updateTopic(editingTopicId, trimmedName, selectedSubjectId);
      setTopicName('');
      setSelectedSubjectId('');
      setIsEditing(false);
      setEditingTopicId(null);
      setView('list'); 
      toast.success('Topic updated successfully!');
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error(error.response?.data?.error || 'Failed to update topic.');
    }
  };

 
  const handleDeleteTopic = async (id) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(id);
        toast.success('Topic deleted successfully!');
      } catch (error) {
        console.error('Error deleting topic:', error);
        toast.error(error.response?.data?.error || 'Failed to delete topic.');
      }
    }
  };

  
  const handleEditClick = (topic) => {
    setIsEditing(true);
    setEditingTopicId(topic._id);
    setTopicName(topic.name);
    setSelectedSubjectId(topic.subject._id);
    setView('edit');
  };

  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingTopicId(null);
    setTopicName('');
    setSelectedSubjectId('');
    setView('list'); 
  };

  
  const handleAddButtonClick = () => {
    setIsEditing(false);
    setEditingTopicId(null);
    setTopicName('');
    setSelectedSubjectId('');
    setView('add');
  };

  return (
    <Layout>
      <div className="p-8">
        {view === 'list' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Manage Topics</h1>
              <button
                onClick={handleAddButtonClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Topic
              </button>
            </div>

            
            <ul className="space-y-4">
              {topics.map(topic => (
                <li key={topic._id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{topic.name}</p>
                    <p className="text-sm text-gray-600">Subject: {topic.subject.name}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditClick(topic)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {(view === 'add' || view === 'edit') && (
          <div className="mt-8 p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">
              {view === 'add' ? 'Add New Topic' : 'Edit Topic'}
            </h2>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Topic Name"
              className="block w-full p-2 mb-2 border rounded"
            />
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="block w-full p-2 mb-2 border rounded"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <button
              onClick={view === 'add' ? handleAddTopic : handleUpdateTopic}
              className={`${view === 'add' ? 'bg-green-500' : 'bg-blue-500'} text-white px-4 py-2 rounded hover:${view === 'add' ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              {view === 'add' ? 'Add Topic' : 'Update Topic'}
            </button>
            <button
              onClick={handleCancel}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

