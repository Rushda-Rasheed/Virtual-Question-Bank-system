
"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "@/utilities/Axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const token = localStorage.getItem("accessToken");
      console.log({ token });
      if (token) {
        setIsLoggedIn(true);
        fetchUserDetails(token);
        fetchAllQuestions();
        fetchAllUsers();
        
      } else {
        setIsLoggedIn(false);
        setUserDetails(null);
        setQuestions([]);
        setUsers([]);
      }
     
      fetchAllSubjects();
      fetchAllTopics();
      fetchMessages();
      
    }
  }, [isHydrated]);
  useEffect(() => {
    fetchMessages();
  }, []);

  // const fetchUserDetails = async (token) => {
  //   try {
  //     const response = await Axios.get("/users/profile", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUserDetails(response.data);
      
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //     setIsLoggedIn(false);
  //   }
  // };

  // const updateUserDetails = async (token) => {
  //   try {
  //     const response = await Axios.get("/users/update-profile", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUserDetails(response.data);
      
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //     setIsLoggedIn(false);
  //   }
  // };
  // const profileUserDetails = async () => {
  //   try {
  //     // Send a GET request to the '/user/details' endpoint with Authorization header
  //     const response = await Axios.get('/addusers/getuser', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Fetching the token from localStorage
  //       },
  //       // headers: {
  //       //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       // },
  //     );
  
  //     // Return the response data (user details)
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching user details:", error.response?.data || error);
  //     throw error; // Throw error to be handled in the component
  //   }
  // // };
  // const profileUserDetails = async () => {
  //   try {
  //     // Send a GET request to the correct '/user/details' endpoint with Authorization header
  //     const response = await Axios.get('/addusers/getuser', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Fetch the token from localStorage
  //       },
  //     });
  
  //     // Return the response data (user details)
  //     setUsers(response.data);
  //   } catch (error) {
  //     // Handle errors properly
  //     console.error("Error fetching user details:", error.response?.data || error.message);
  //     throw error; // Throw error to be handled in the component
  //   }
  // };
  
  const profileUserDetails = async () => {
    try {
      // Send a GET request to the backend API
      const response = await Axios.get('/addusers/getuser', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Fetch the token from localStorage
        },
      });
  
      // Log and return the user details
      console.log("API Response:", response.data);
      return response.data; // Return the data to the calling component
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching user details:", error.response?.data || error.message);
      throw error; // Rethrow the error to handle it in the component
    }
  };
  
  const fetchUserDetails = async (token) => {
    try {
      const response = await Axios.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setIsLoggedIn(false);
    }
  };
  
  const updateUserDetails = async (updatedDetails) => {
    try {
      const response = await Axios.put("/users/update-profile", updatedDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile. Please try again.");
    }
  };
  

  const handleLogin = async (credentials) => {
    try {
      const response = await Axios.post("/users/login", credentials);
      console.log({ response });
      const { accessToken, user } = response.data.data;
      console.log({ accessToken });
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      setUserDetails(user);
      fetchAllQuestions();
      fetchAllUsers();
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggedIn(false);
      throw error; 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserDetails(null);
    setQuestions([]);
    setUsers([]);
    router.push("/login");
  };

  const notify = (type, message) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await Axios.get("/questions/get");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const addQuestion = async (questionData) => {
    try {
      const response = await Axios.post("/questions/add", questionData);
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  };

  const updateQuestion = async (id, updatedData) => {
    try {
      const response = await Axios.put(`/questions/edit`, { id, ...updatedData });
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === id ? response.data : question
        )
      );
      return response.data;
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await Axios.delete(`/questions/delete`, { data: { id } });
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question._id !== id)
      );
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  };


const bulkUpdateSelectedQuestions = async (selectedQuestionIds, updates) => {
  try {
    const response = await Axios.put("/questions/bulk-update", {
      questionIds: selectedQuestionIds,
      updates,
    });
    
    fetchAllQuestions(); 
    return response.data;
  } catch (error) {
    console.error("Error bulk updating questions:", error);
    throw error;
  }
};

  const uploadImages = async (formData) => {
    try {
      const response = await Axios.post("/questions/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await Axios.get("/addusers/get");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
    
  const fetchUsers = async () => {
    try {
      const { data } = await Axios.get("/addusers/get");
      console.log("Fetched users:", data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      return [];
    }
  };
  const addUserFunc = async (userData) => {
    try {
      const response = await Axios.post("/addusers/post", userData);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const updateUserFunc = async (id, updatedData) => {
    try {
      const response = await Axios.put(`/addusers/put`, { id, ...updatedData });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? response.data : user
        )
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const deleteUserFunc = async (id) => {
    try {
      await Axios.delete(`/addusers/delete`, { data: { id } });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  
  const fetchAllSubjects = async () => {
    try {
      const response = await Axios.get("/subjects/get");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const addSubjectFunc = async (subjectName) => {
    try {
      const response = await Axios.post("/subjects/add", { name: subjectName });
      setSubjects((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };

  const updateSubjectFunc = async (id, updatedSubject) => {
    try {
      const response = await Axios.put(`/subjects/edit`, { id, name: updatedSubject });
      setSubjects((prev) => prev.map((sub) => (sub._id === id ? response.data : sub)));
      return response.data;
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const deleteSubjectFunc = async (id) => {
    try {
      await Axios.delete(`/subjects/delete`, { data: { id } });
      setSubjects((prev) => prev.filter((sub) => sub._id !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  };

  const fetchAllTopics = async () => {
    try {
      const response = await Axios.get("/topics/get");
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
   };

   
   const addTopicFunc = async (topicName, subjectId) => {
    try {
      const response = await Axios.post("/topics/add", { name: topicName, subjectId });
     setTopics((prev) => [...prev, response.data]);
      return response.data;
     } catch (error) {
       console.error("Error adding topic:", error);
       throw error;
     }
   };


  const updateTopicFunc = async (id, updatedTopic, subjectId) => {
    try {
       const response = await Axios.put("/topics/edit", { id, name: updatedTopic, subjectId });
     setTopics((prev) => prev.map((topic) => (topic._id === id ? response.data : topic)));
     return response.data;
     } catch (error) {
      console.error("Error updating topic:", error);
       throw error;
     }
   };

   
   const deleteTopicFunc = async (id) => {
    try {
      await Axios.delete(`/topics/delete`, { data: { id } });
      setTopics((prev) => prev.filter((topic) => topic._id !== id));
     } catch (error) {
      console.error("Error deleting topic:", error);
      throw error;
    }
   };

  const fetchQuestions = async (filters) => {
    try {
      const response = await Axios.get('/practice/questions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  };
  

const submitExam = async (examData) => {
  try {
    const response = await Axios.post("/exams/submit-exam", examData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
    });
    
    return response.data; 
  } catch (error) { 
    console.error("Error submitting exam results:", error);
    throw error; 
  }
};



const startExam = async (examData) => {
  try {
    const response = await Axios.post("/practice/start-exam", examData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error starting exam:", error);
    throw error;
  }
};

const getExamResults = async () => {
  try {
    const response = await Axios.get("/exams/results", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching exam results:", error.response?.data || error);
    throw error;
  }
};
const getAllExamResults = async () => {
  try {
    const response = await Axios.get("/exams/all-results", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all exam results:", error.response?.data || error);
    throw error;
  }
};

const fetchMessages = async () => {
  try {
    const response = await Axios.get('/messages/messages', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    setMessages(response.data.messages);
  } catch (error) {
    setError(error?.response?.data?.error || 'Failed to fetch messages');
  }
};

const sendMessage = async (receiverRole, content) => {
  try {
    const response = await Axios.post(
      '/messages/send-message',
      { receiverRole, content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    setError(error?.response?.data?.error || 'Failed to send message');
    throw error;
  }
};

const replyToMessage = async (messageId, replyContent) => {
  try {
    const response = await Axios.post(
      '/messages/reply-message',
      { messageId, replyContent }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    setError(error?.response?.data?.error || 'Failed to reply to message');
    throw error;
  }
};

const updateProfile = async (updatedData) => {
  try {
    const response = await Axios.put(
      '/addusers/putprofile', // Adjust the endpoint path if necessary
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include the token
        },
      }
    );
    
    // Optional: Update the context state if needed (e.g., user details in context)
    setUsers((prevUser) => ({
      ...prevUser,
      ...response.data.user,
    }));

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw error;
  }
};
// const updateProfile = async () => {
//   try {
//     const response = await Axios.get("/addusers/putprofile", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//     });
//     setNotifications(response.data);
//   } catch (error) {
//     console.error("Error fetching profileauthcontex-update:", error.response?.data || error);
//     throw error;
//   }
// };
const fetchNotifications  = async () => {
  try {
    const response = await Axios.get("/notifications/notification", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setNotifications(response.data);
  } catch (error) {
    console.error("Error fetching exam results:", error.response?.data || error);
    throw error;
  }
};
const markNotificationAsRead = async (notificationId) => {
  try {
    await Axios.post('/notifications/mark-read', { notificationId });
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prevCount => prevCount - 1);
  } catch (error) {
    console.error('Error marking notification as read', error);
  }
};
  
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userDetails,
        questions,
        users,
        subjects,
        topics,
        messages, 
        updateProfile,
        fetchUserDetails,
        handleLogin,
        handleLogout,
        updateUserDetails,
        fetchAllQuestions,
        fetchQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        uploadImages,
        fetchUsers,
        profileUserDetails,
        fetchAllUsers,
        addUser: addUserFunc,
        updateUser: updateUserFunc,
        deleteUser: deleteUserFunc,
        bulkUpdateSelectedQuestions,
        
        fetchAllSubjects,
        addSubject: addSubjectFunc,
        updateSubject: updateSubjectFunc,
        deleteSubject: deleteSubjectFunc,

        fetchAllTopics,
        addTopic: addTopicFunc,
        updateTopic: updateTopicFunc,
        deleteTopic: deleteTopicFunc,

        submitExam ,
       
        startExam, 
        
        getExamResults,
        getAllExamResults,

        sendMessage, 
        replyToMessage, 
        fetchMessages, 
        error,
        setNotifications,
        
        fetchNotifications,
        notifications,
        
        markNotificationAsRead 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
