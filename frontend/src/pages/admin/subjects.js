

"use client";

import { useState, useContext, useEffect } from 'react';
import AuthContext from "@/context/AuthContext"; 
import Layout from '../../components/Layout'; 
import toast from 'react-hot-toast';

export default function SubjectManagement() {
  const { 
    subjects, 
    fetchAllSubjects, 
    addSubject, 
    updateSubject, 
    deleteSubject 
  } = useContext(AuthContext);
  
  const [subjectName, setSubjectName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [view, setView] = useState('list'); 

  useEffect(() => {
    fetchAllSubjects();
  }, [fetchAllSubjects]);

  const handleAddSubject = async () => {
    const trimmedName = subjectName.trim();
    if (!trimmedName) {
      toast.error('Please enter a subject name.');
      return;
    }
    
    try {
      await addSubject(trimmedName);
      setSubjectName('');
      setView('list'); 
      toast.success('Subject added successfully!');
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Failed to add subject');
    }
  };

  const handleUpdateSubject = async () => {
    const trimmedName = subjectName.trim();
    if (!trimmedName) {
      toast.error('Please enter a subject name.');
      return;
    }

    try {
      await updateSubject(editingSubjectId, trimmedName);
      setSubjectName('');
      setIsEditing(false);
      setEditingSubjectId(null);
      setView('list');
      toast.success('Subject updated successfully!');
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error(error.response?.data?.error || 'Failed to update subject.');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(id);
        toast.success('Subject deleted successfully!');
      } catch (error) {
        console.error('Error deleting subject:', error);
        toast.error(error.response?.data?.error || 'Failed to delete subject.');
      }
    }
  };

  const handleEditClick = (subject) => {
    setIsEditing(true);
    setEditingSubjectId(subject._id);
    setSubjectName(subject.name);
    setView('edit'); 
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSubjectId(null);
    setSubjectName('');
    setView('list'); 
  };

  const handleAddButtonClick = () => {
    setIsEditing(false);
    setEditingSubjectId(null);
    setSubjectName('');
    setView('add'); 
  };

  return (
    <Layout>
      <div className="p-8">
        {view === 'list' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Manage Subjects</h1>
              <button
                onClick={handleAddButtonClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Subject
              </button>
            </div>

            
            <ul className="space-y-4">
              {subjects.map(subject => (
                <li key={subject._id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                  <p className="font-semibold">{subject.name}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditClick(subject)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject._id)}
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
              {view === 'add' ? 'Add New Subject' : 'Edit Subject'}
            </h2>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Subject Name"
              className="block w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={view === 'add' ? handleAddSubject : handleUpdateSubject}
              className={`${view === 'add' ? 'bg-green-500' : 'bg-blue-500'} text-white px-4 py-2 rounded hover:${view === 'add' ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              {view === 'add' ? 'Add Subject' : 'Update Subject'}
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

