import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import Loader from "./Loader";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/data/german_english.json")
      .then((response) => response.json())
      .then((data) => {
        const entries = shuffleArray(Object.entries(data));
        const quizQuestions = entries.slice(0, 10).map(([german, english]) => {
          const allAnswers = shuffleArray(Object.values(data)).slice(0, 3);
          const options = shuffleArray([english, ...allAnswers]);
          return {
            question: `What is the English word for "${german}"?`,
            options,
            answer: options.indexOf(english),
          };
        });
        setQuestions(quizQuestions);
        setLoadingProgress(100);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  const handleAnswer = (selectedIndex) => {
    const isCorrect = questions[currentQuestionIndex].answer === selectedIndex;
    setResults((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: questions[currentQuestionIndex].options[selectedIndex],
        correctAnswer:
          questions[currentQuestionIndex].options[
            questions[currentQuestionIndex].answer
          ],
        isCorrect,
      },
    ]);

    setSelectedAnswer(selectedIndex);
    setTimeout(() => {
      if (isCorrect) setScore(score + 1);
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setIsQuizFinished(true);
      }
      setSelectedAnswer(null);
    }, 500);
  };

  if (loadingProgress < 100) {
    return (
      <div className="Quiz">
        <Loader progress={loadingProgress} />
      </div>
    );
  }

  if (isQuizFinished) {
    return (
      <div className="Quiz">
        <h1>Quiz Finished!</h1>
        <p>Your score: {score} / {questions.length}</p>
        <h2>Summary</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <strong>{result.question}</strong>
              <br />
              Your answer:{" "}
              <span style={{ color: result.isCorrect ? "green" : "red" }}>
                {result.selectedAnswer}
              </span>
              <br />
              Correct answer: {result.correctAnswer}
            </li>
          ))}
        </ul>
        <button onClick={() => window.location.reload()}>Restart Quiz</button>
        <Link to="/">
          <button className="go-home-button">Go to Home</button>
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="Quiz">
      <ProgressBar progress={progress} />
      <h2>{currentQuestion.question}</h2>
      <p className="score-label">Score: {score} / {questions.length}</p> {/* Skor gösterimi */}
      <div className="options">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={
              selectedAnswer !== null
                ? index === currentQuestion.answer
                  ? "correct"
                  : index === selectedAnswer
                  ? "wrong"
                  : ""
                : ""
            }
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      <Link to="/">
        <button className="go-home-button">Go to Home</button>
      </Link>
    </div>
  );
  
}

export default Quiz;
