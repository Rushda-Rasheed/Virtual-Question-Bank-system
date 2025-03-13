
"use client";

import React, { useState, useContext, useEffect } from 'react';
import Layout from '../../components/Layout';
import AuthContext from "@/context/AuthContext";
import dynamic from 'next/dynamic';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select'; 
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid'; 
import ErrorBoundary from '../../components/ErrorBoundary';
import { useRouter } from 'next/router';
import Axios from '@/utilities/Axios';
import toast from 'react-hot-toast';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminQuestionManagement = () => {
  const { 
    addQuestion, 
    uploadImages, 
    updateQuestion, 
    deleteQuestion, 
    questions,
    subjects,    
    topics,       
    submitAnswer,
    fetchAllQuestions
  } = useContext(AuthContext);

  const router = useRouter();

  
  const [questionType, setQuestionType] = useState('mcq');
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [questionText, setQuestionText] = useState('');
  const [modelAnswer, setModelAnswer] = useState(''); 
  const [keyPhrases, setKeyPhrases] = useState(''); 
  const [image, setImage] = useState(null); 
  const [options, setOptions] = useState([{ id: uuidv4(), text: '' }, { id: uuidv4(), text: '' }]); 
  const [correctOption, setCorrectOption] = useState(null);
  const [explanation, setExplanation] = useState(''); 
  const [editingId, setEditingId] = useState(null); 
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterSubject, setFilterSubject] = useState({ value: '', label: '' });
  const [filterTopic, setFilterTopic] = useState({ value: '', label: '' });
  const [filterDifficulty, setFilterDifficulty] = useState({ value: 'easy', label: 'Easy' });
  const [filterType, setFilterType] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [bulkDifficulty, setBulkDifficulty] = useState(null); 
  const [bulkCategory, setBulkCategory] = useState(null); 
  const [isAdding, setIsAdding] = useState(false); 

  
  const handleAddQuestion = async (e) => {
    e.preventDefault();

    
    if (!subject || !topic || !questionText) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (questionType === 'mcq') {
      if (options.length < 2 || options.some(opt => !opt.text.trim())) {
        toast.error('Please provide at least two options for MCQ.');
        return;
      }
      if (correctOption === null) {
        toast.error('Please select the correct option for MCQ.');
        return;
      }
    }

    let imageUrls = [];
    if (image) {
      const formData = new FormData();
      formData.append('images', image);
      try {
        imageUrls = await uploadImages(formData);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed.");
        return;
      }
    }

    const newQuestion = { 
      type: questionType, 
      subject: subject.value, 
      topic: topic.value, 
      difficulty, 
      text: questionText, 
      images: imageUrls,
      ...(questionType === 'mcq' ? {
        options: options.map(opt => opt.text),
        correctOption,
        explanation
      } : {
        modelAnswer,
        keyPhrases
      })
    };


    
    try {
      if (editingId) {
        await updateQuestion(editingId, newQuestion);
        toast.success("Question updated successfully!");
        setEditingId(null);
      } else {
        await addQuestion(newQuestion);
        toast.success("Question added successfully!");
      }
      resetForm();
      setIsAdding(false); 
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question.");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        toast.success("Question deleted successfully!");
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Failed to delete question.");
      }
    }
  };

  const handleEditQuestion = (question) => {
    setQuestionType(question.type);
    setSubject({ value: question.subject._id, label: question.subject.name });
    setTopic({ value: question.topic._id, label: question.topic.name });
    setDifficulty(question.difficulty);
    setQuestionText(question.text);
    if (question.type === 'mcq') {
      setOptions(question.options.map((opt, index) => ({ id: uuidv4(), text: opt })));
      setCorrectOption(question.correctOption);
      setExplanation(question.explanation || '');
    } else {
      setModelAnswer(question.modelAnswer || '');
      setKeyPhrases(question.keyPhrases || '');
    }
    setEditingId(question._id);
    setIsAdding(true); 
  };

  const resetForm = () => {
    setQuestionType('mcq');
    setSubject(null);
    setTopic(null);
    setDifficulty('easy');
    setQuestionText('');
    setModelAnswer('');
    setKeyPhrases('');
    setImage(null);
    setOptions([{ id: uuidv4(), text: '' }, { id: uuidv4(), text: '' }]);
    setCorrectOption(null);
    setExplanation('');
    setEditingId(null);
  };
  

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("No questions selected for deletion.");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedQuestions.length} selected question(s)?`)) {
      try {
        await Promise.all(selectedQuestions.map(id => deleteQuestion(id)));
        toast.success("Selected questions deleted successfully!");
        setSelectedQuestions([]);
      } catch (error) {
        console.error("Error deleting selected questions:", error);
        toast.error("Failed to delete selected questions.");
      }
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("No questions selected for bulk update.");
      return;
    }

    const updateData = {};
    if (bulkDifficulty) {
      updateData.difficulty = bulkDifficulty.value;
    }
   
    if (Object.keys(updateData).length === 0) {
      toast.error("Please select at field to update.");
      return;
    }

    try {
      await Axios.put('/questions/bulk-update', {
        questionIds: selectedQuestions,
        updateData,
      });
      toast.success("Selected questions updated successfully!");
      fetchAllQuestions(); 
      setSelectedQuestions([]);
      setBulkDifficulty(null);
    } catch (error) {
      console.error("Error bulk updating questions:", error);
      toast.error("Failed to bulk update questions.");
    }
  };

  const handleSearchAndFilter = async () => {
    try {
      
      const filters = {};
  
      if (searchKeyword) filters.search = searchKeyword;
      if (filterSubject && filterSubject.value) filters.subject = filterSubject.value;
      if (filterTopic && filterTopic.value) filters.topic = filterTopic.value;
      if (filterDifficulty && filterDifficulty.value) filters.difficulty = filterDifficulty.value;
      if (filterType && filterType.value) filters.type = filterType.value;
  
      
      const queryString = new URLSearchParams(filters).toString();
  
      
      const response = await Axios.get(`/questions/get?${queryString}`);
      
      if (response.data) {
        setSelectedQuestions(response.data);
      } else {
        throw new Error("No data received from the API.");
      }
    } catch (error) {
      console.error("Error fetching filtered questions:", error);
      toast.error(`Failed to fetch filtered questions: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map(q => q._id));
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedOptions = Array.from(options);
    const [movedOption] = reorderedOptions.splice(result.source.index, 1);
    reorderedOptions.splice(result.destination.index, 0, movedOption);
    setOptions(reorderedOptions);
  };



return (
  <Layout>
    <div className="p-8">
     
      <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>

      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Question Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Question
        </button>
      </div>

     
      {isAdding ? (
        <form
          className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8"
          onSubmit={handleAddQuestion}
        >
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Question' : 'Add Question'}
            </h2>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsAdding(false);
              }}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-700">Question Type</label>
            <div className="flex space-x-4 mt-2">
              <button
                type="button"
                className={`p-2 rounded ${
                  questionType === 'mcq'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => setQuestionType('mcq')}
              >
                MCQ
              </button>
              <button
                type="button"
                className={`p-2 rounded ${
                  questionType === 'descriptive'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => setQuestionType('descriptive')}
              >
                Descriptive
              </button>
            </div>
          </div>

        
          <div className="mb-4">
            <label className="block text-gray-700">Subject</label>
            <Select
              value={subject}
              onChange={setSubject}
              options={subjects.map((sub) => ({
                value: sub._id,
                label: sub.name,
              }))}
              className="mt-2"
              placeholder="Select Subject"
              isClearable
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Topic</label>
            <Select
              value={topic}
              onChange={setTopic}
              options={topics
                .filter((t) => !subject || t.subject._id === subject.value)
                .map((t) => ({ value: t._id, label: t.name }))}
              className="mt-2"
              placeholder="Select Topic"
              isClearable
              required
            />
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-700">Difficulty</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={difficulty === 'easy'}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mr-2"
                />
                Easy
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={difficulty === 'medium'}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mr-2"
                />
                Medium
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={difficulty === 'hard'}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mr-2"
                />
                Hard
              </label>
            </div>
          </div>

          
          <div className="mb-4">
            <label className="block text-gray-700">Question Text</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="mt-2 w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter question text"
            />
          </div>

          
          <div className="mb-4">
              <label className="block text-gray-700">Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files[0])} 
                className="mt-2 p-2 border border-gray-300 rounded-md w-full" 
              />
              {image && (
                <div className="mt-2">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="max-w-xs h-auto"
                  />
                </div>
              )}
            </div>


{questionType === 'descriptive' && (
  <>
    
    <div className="mb-4">
      <label className="block text-gray-700">Model Answer</label>
      <ReactQuill
        value={modelAnswer}
        onChange={setModelAnswer}
        className="mt-2"
        placeholder="Enter model answer"
      />
    </div>

    
    <div className="mb-4">
      <label className="block text-gray-700">Key Phrases</label>
      <input
        value={keyPhrases}
        onChange={(e) => setKeyPhrases(e.target.value)}
        className="mt-2 w-full p-2 border rounded focus:outline-none focus:border-blue-500"
        placeholder="Enter key phrases for evaluation"
      />
    </div>
  </>
)}
              
              

          
          {questionType === 'mcq' && (
            <div className="mb-4">
              <label className="block text-gray-700">Options</label>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="options">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="mt-2 space-y-2"
                    >
                      {options.map((option, index) => (
                        <Draggable
                          key={option.id}
                          draggableId={option.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => {
                                  const newOptions = [...options];
                                  newOptions[index].text = e.target.value;
                                  setOptions(newOptions);
                                }}
                                className="p-2 border border-gray-300 rounded-md w-full"
                                placeholder={`Option ${index + 1}`}
                                required
                              />
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="correctOption"
                                  checked={correctOption === index}
                                  onChange={() => setCorrectOption(index)}
                                  className="mr-1"
                                  required
                                />
                                Correct
                              </label>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              <button
                type="button"
                onClick={() =>
                  setOptions([...options, { id: uuidv4(), text: '' }])
                }
                className="mt-2 text-blue-600 hover:underline"
              >
                Add Option
              </button>
              
              <div className="mb-4">
                <label className="block text-gray-700">Explanation</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="mt-2 w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter explanation for the correct answer (optional)"
                />
              </div>
            </div>
          )}

         
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {editingId ? 'Update Question' : 'Add Question'}
          </button>
        </form>
      ) : (
        <>


             <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
             <div className="flex flex-wrap items-center space-x-4">
         
                  <Select
                    value={subject}
                    onChange={setSubject}
                    options={subjects.map((sub) => ({
                      value: sub._id,
                      label: sub.name,
                    }))}
                    className="w-1/5"
                    placeholder="Filter by Subject"
                    isClearable
                    required
                  />
              
                  <Select
                    value={topic}
                    onChange={setTopic}
                    options={topics
                      .filter((t) => !subject || t.subject._id === subject.value)
                      .map((t) => ({ value: t._id, label: t.name }))}
                    className="w-1/5"
                    placeholder="Filter by Topic"
                    isClearable
                    required
                  />
               
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  options={[
                    { value: 'mcq', label: 'MCQ' },
                    { value: 'descriptive', label: 'Descriptive' },
                  ]}
                  className="w-1/5"
                  placeholder="Filter by Type"
                  isClearable
                />

                <Select
                  value={filterDifficulty}
                  onChange={setFilterDifficulty}
                  options={[
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                  ]}
                  className="w-1/5"
                  placeholder="Filter by Difficulty"
                  isClearable
                />
                
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="p-2 mt-3 border border-gray-300 rounded-md w-1/4 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Search questions..."
              />
              <button
                onClick={handleSearchAndFilter}
                className="bg-blue-600 text-white p-2 mt-3 rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>

          
            {selectedQuestions.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-lg mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <p>{selectedQuestions.length} selected</p>
                <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
                  <button 
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                  <div className="flex space-x-2">
                    <Select
                      value={bulkDifficulty}
                      onChange={setBulkDifficulty}
                      options={[
                        { value: 'easy', label: 'Easy' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'hard', label: 'Hard' },
                      ]}
                      className="w-32"
                      placeholder="Difficulty"
                      isClearable
                    />
                    
                    <button 
                      onClick={handleBulkUpdate}
                      className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                    >
                      Bulk Update
                    </button>
                  </div>
                </div>
              </div>
            )}

           
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Questions List</h2>
              {questions.length === 0 ? (
                <p className="text-gray-600">No questions found.</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">
                        <input 
                          type="checkbox" 
                          checked={selectedQuestions.length === questions.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Topic</th>
                      <th className="px-4 py-2">Difficulty</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question._id} className="border-t">
                        <td className="px-4 py-2">
                          <input 
                            type="checkbox" 
                            checked={selectedQuestions.includes(question._id)}
                            onChange={() => handleSelectQuestion(question._id)}
                          />
                        </td>
                        <td className="px-4 py-2">{question._id}</td>
                        <td className="px-4 py-2">{question.subject?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{question.topic?.name || 'N/A'}</td>
                        <td className="px-4 py-2 capitalize">{question.difficulty}</td>
                        <td className="px-4 py-2 capitalize">{question.type}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-white ${question.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                            {question.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button 
                            onClick={() => handleEditQuestion(question)} 
                            className="text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(question._id)} 
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          
        </>
      )}
    </div>
  </Layout>
);
};


const WrappedAdminQuestionManagement = () => (
  <ErrorBoundary>
    <AdminQuestionManagement />
  </ErrorBoundary>
);

export default WrappedAdminQuestionManagement;


























































