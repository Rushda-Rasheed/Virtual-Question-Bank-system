
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { FiUsers, FiBarChart2, FiActivity } from "react-icons/fi";
import Layout from "../../components/Layout";
import AuthContext from "@/context/AuthContext";

const Dashboard = () => {
  const { fetchUsers, getAllExamResults, fetchQuestions } = useContext(AuthContext);

  const [userCount, setUserCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const fetchData = async () => {
    try {
      const users = await fetchUsers();
      const userRoleCount = users.filter((user) => user.role === "user").length;
      setUserCount(userRoleCount);

      const exams = (await getAllExamResults()) || [];
      setExamCount(exams.length);

      const questions = (await fetchQuestions()) || [];
      setQuestionCount(questions.length);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b   from-indigo-50 via-purple-10 to-pink-10 p-10" >
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-lg p-8 text-center text-white">
            <h1 className="text-4xl font-extrabold mb-4">
              Dashboard Overview
            </h1>
            <p className="text-lg font-medium">
              Monitor and manage your system's key metrics effortlessly.
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            <div className="bg-white shadow-md rounded-lg p-6 text-center transition-transform transform hover:scale-105">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 mx-auto">
                <FiUsers className="text-4xl" />
              </div>
              <h2 className="text-lg font-semibold mt-4">Total Users</h2>
              <p className="text-3xl font-bold mt-2">{userCount}</p>
              <p className="text-sm text-gray-500 mt-2">
                Registered users in the system.
              </p>
            </div>

            
            <div className="bg-white shadow-md rounded-lg p-6 text-center transition-transform transform hover:scale-105">
              <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 mx-auto">
                <FiBarChart2 className="text-4xl" />
              </div>
              <h2 className="text-lg font-semibold mt-4">Exams Taken</h2>
              <p className="text-3xl font-bold mt-2">{examCount}</p>
              <p className="text-sm text-gray-500 mt-2">
                Exams completed by users.
              </p>
            </div>

           
            <div className="bg-white shadow-md rounded-lg p-6 text-center transition-transform transform hover:scale-105">
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-4 w-16 h-16 mx-auto">
                <FiActivity className="text-4xl" />
              </div>
              <h2 className="text-lg font-semibold mt-4">Total Questions</h2>
              <p className="text-3xl font-bold mt-2">{questionCount}</p>
              <p className="text-sm text-gray-500 mt-2">
                Questions available in the database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
