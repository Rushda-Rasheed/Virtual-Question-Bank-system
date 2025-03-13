"use client";
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout'; 
import AuthContext from "@/context/AuthContext"; 
import toast from 'react-hot-toast';

export default function UserManagement() {
  const router = useRouter();
  const { users, fetchAllUsers, addUser, updateUser, deleteUser, getAllExamResults } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({ fullName: '', userName: '', phoneNumber: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [view, setView] = useState('list'); 
  const [selectedUserResults, setSelectedUserResults] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    fetchAllUsers(); 
  }, [fetchAllUsers]);

  // Handler to add a new user
  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      await addUser(newUser);
      setNewUser({ fullName: '', userName: '', phoneNumber: '', email: '', password: '' });
      setView('list'); // Switch to list view
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user.');
    }
  };

  const handleActivitiesClick = async (userId) => {
    try {
      const allResults = await getAllExamResults(); 
      console.log('Fetched all results:', allResults);
  
      const selectedUser = users.find(user => user._id === userId);
      const filteredResults = allResults.filter(result => result.userId === userId);
  
      if (filteredResults.length === 0) {
        setSelectedUserResults('User has not participated in any activities');
      } else {
        setSelectedUserResults(filteredResults);
        setSelectedUser(selectedUser); 
      }
      setView('results'); 
    } catch (error) {
      console.error('Error fetching exam results:', error);
      toast.error('Failed to fetch exam results.');
    }
  };
 
  const handleUpdateUser = async () => {
    if (!newUser.fullName || !newUser.email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const updatedData = { fullName: newUser.fullName, userName: newUser.userName, phoneNumber: newUser.phoneNumber, email: newUser.email };
      if (newUser.password) updatedData.password = newUser.password;

      await updateUser(editingUserId, updatedData);
      setNewUser({ fullName: '', userName: '', phoneNumber: '', email: '', password: '' });
      setIsEditing(false);
      setEditingUserId(null);
      setView('list'); 
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  // Handler to delete a user
  const handleDeleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user.');
      }
    }
  };

  // Handler to start editing a user
  const handleEditClick = (user) => {
    setIsEditing(true);
    setEditingUserId(user._id);
    setNewUser({ fullName: user.fullName, userName: user.userName, phoneNumber: user.phoneNumber, email: user.email, password: '' });
    setView('edit'); 
  };

  // Handler to cancel add/edit actions
  const handleCancel = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setNewUser({ fullName: '', userName: '', phoneNumber: '', email: '', password: '' });
    setView('list'); 
  };

  // Handler to switch to add user form
  const handleAddButtonClick = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setNewUser({ fullName: '', userName: '', phoneNumber: '', email: '', password: '' });
    setView('add'); 
  };

  return (
    <Layout>
      <div className="p-8">
        {view === 'list' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <button
                onClick={handleAddButtonClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add User
              </button>
            </div>

            {/* Users List */}
            <ul className="space-y-4">
              {users.map(user => (
                <li key={user._id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">Role: {user.role}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleActivitiesClick(user._id)}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                      Activities
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

         
         {view === 'results' && (
              <div className="mt-8 p-4 bg-gray-100 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                  {selectedUser ? `Exam Results for ${selectedUser.fullName}` : 'User has no results'}
                </h2>
                {selectedUserResults === 'User has not participated in any activities' ? (
                  <p className="text-red-500 font-semibold">{selectedUserResults}</p>
                ) : (
                  <ul className="space-y-4">
                    {selectedUserResults.map((result, index) => (
                      <li key={index} className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-md">
                        <h3 className="font-semibold text-lg text-blue-600">
                          Exam on {result.subject.name} - {result.topic.name}
                        </h3>
                        <p>Score: {result.score} / {result.totalQuestions}</p>
                        <p>Time Taken: {result.timeTaken}</p>
                        <ul>
                          {result.selectedAnswers.map((answer, idx) => (
                            <li key={idx} className="mt-2">
                              <p><strong>Question:</strong> {answer.questionId?.questionText}</p>
                              <p><strong>Your Answer:</strong> {answer.userAnswer}</p>
                              <p><strong>Explanation:</strong> {answer.explanation}</p>
                              <p><strong>Status:</strong> {answer.isCorrect ? 'Correct' : 'Incorrect'}</p>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={handleCancel} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Back to Users List
                </button>
              </div>
            )}


        {(view === 'add' || view === 'edit') && (
          <div className="mt-8 p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">{view === 'add' ? 'Add New User' : 'Edit User'}</h2>
            <input
              type="text"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              placeholder="Full Name"
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              value={newUser.userName}
              onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
              placeholder="Username"
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              placeholder="Phone Number"
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Password"
              className="block w-full p-2 mb-2 border rounded"
            />
            <div className="mt-4">
              <button
                onClick={view === 'add' ? handleAddUser : handleUpdateUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {view === 'add' ? 'Add User' : 'Update User'}
              </button>
              <button
                onClick={handleCancel}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
