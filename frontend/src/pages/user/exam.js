import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import AuthContext from "@/context/AuthContext";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Exam() {
  const { submitExam } = useContext(AuthContext);
  const router = useRouter();
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showNextButton, setShowNextButton] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const questions = JSON.parse(localStorage.getItem("filteredQuestions")) || [];
    const examDetails = JSON.parse(localStorage.getItem("examDetails")) || {};
    if (questions.length === 0) {
      toast.error("No questions available for this exam.");
      router.push("/user/performance");
    } else {
      setExamQuestions(questions);
      setFilteredQuestions(questions);
      setTimeLeft(questions.length * 120); 
      setSubject(examDetails.subject || {});
      setTopic(examDetails.topic || {});
      setDifficulty(examDetails.difficulty || "");
      setStartTime(Date.now());
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
    setShowNextButton(false);
  };

  const handleSaveAnswer = () => {
    toast.success("Answer saved!");
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowNextButton(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowNextButton(true);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      const endTime = Date.now();
      const timeTakenMilliseconds = endTime - startTime;
      const timeTakenMinutes = Math.floor(timeTakenMilliseconds / 1000 / 60);
      const timeTakenSeconds = Math.floor((timeTakenMilliseconds / 1000) % 60);
      const timeTakenFormatted = `${timeTakenMinutes}:${String(timeTakenSeconds).padStart(2, "0")}`;

      const answerData = examQuestions.map((question, index) => ({
        questionId: question.questionId || "Unknown ID",
        userAnswer: selectedAnswers[index] || "",
      }));

      await submitExam({
        answerData,
        subject: { id: subject?.id, name: subject?.name },
        topic: { id: topic?.id, name: topic?.name },
        difficulty,
        timeTaken: timeTakenFormatted,
      });

      toast.success("Exam submitted automatically due to time expiry!");
      router.push("/user/result");
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Error during auto-submission!");
    }
  };

  const handleManualSubmit = async () => {
    if (!isChecked) {
      toast.error("Please check the finish exam box to submit.");
      return;
    }

    if (window.confirm("Are you sure you want to finish the exam?")) {
      await handleAutoSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Question Number */}
          <div className="flex items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full px-4 py-2 shadow-md">
            <span className="text-sm font-semibold">Question:</span>
            <span className="ml-2 text-lg font-bold">
              {currentQuestionIndex + 1} / {filteredQuestions.length}
            </span>
          </div>

          {/* Time Left */}
          <div className="flex items-center bg-gray-800 text-yellow-400 rounded-full px-4 py-2 shadow-md">
            <span className="text-sm font-semibold">Time Left:</span>
            <span className="ml-2 text-lg font-bold">
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
          {/* <p className="text-lg font-semibold mb-4">
            {filteredQuestions.length > 0
              ? filteredQuestions[currentQuestionIndex]?.text
              : "Loading question..."}
          </p> */}

          {/* {filteredQuestions[currentQuestionIndex]?.image && (
            <img
              src={filteredQuestions[currentQuestionIndex]?.image}
              alt="Question"
              className="max-w-full h-auto rounded-lg mb-4"
            />
          )} */}
          {/* <div className="mb-4"> */}
            <p className="text-lg">{filteredQuestions.length > 0 ? filteredQuestions[currentQuestionIndex]?.text : 'Loading question...'}</p>
        
         {filteredQuestions[currentQuestionIndex]?.images && filteredQuestions[currentQuestionIndex].images.length > 0 ? (
          filteredQuestions[currentQuestionIndex].images.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000${image}`} 
              alt={`Question Image ${index + 1}`}
              className="w-48 h-48 mt-4 pb-2" 
            />
          ))
        ) 
        : null}

          {filteredQuestions[currentQuestionIndex]?.type === "mcq" && (
            <div className="space-y-3">
              {filteredQuestions[currentQuestionIndex]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedAnswers[currentQuestionIndex] === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  } hover:shadow-md`}
                  onClick={() => handleAnswerChange(option)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={selectedAnswers[currentQuestionIndex] === option}
                    readOnly
                    className="mr-3"
                  />
                  <label className="text-gray-700">{option}</label>
                </div>
              ))}
            </div>
          )}

          {filteredQuestions[currentQuestionIndex]?.type === "descriptive" && (
            <ReactQuill
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={handleAnswerChange}
              className="mt-4"
              placeholder="Write your answer here..."
              style={{ height: "150px" }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePreviousQuestion}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Previous
            </button>
          )}

          {!showNextButton || currentQuestionIndex === filteredQuestions.length - 1 ? null : (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          )}

          {!showNextButton ? (
            <button
              onClick={handleSaveAnswer}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-auto"
            >
              Save Answer
            </button>
          ) : null}
        </div>

        {/* Submit Section */}
        <div className="mt-8 flex items-center">
          <label className="mr-4">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="mr-2"
            />
            I have finished the exam
          </label>
          <button
            onClick={handleManualSubmit}
            className={`px-6 py-3 rounded-lg ${
              isChecked
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isChecked}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
