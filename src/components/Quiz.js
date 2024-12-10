import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import Loader from "./Loader";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// get correct words from local storage
const getCorrectWords = () => {
  return JSON.parse(localStorage.getItem("correctWords")) || [];
};

const updateCorrectWords = (newCorrectWords) => {
  const correctWords = getCorrectWords();
  const updatedCorrectWords = [...correctWords];

  // add new words with dıplicate checking
  newCorrectWords.forEach((newWord) => {
    if (!correctWords.some((word) => word.german === newWord.german)) {
      updatedCorrectWords.push(newWord);
    }
  });

  localStorage.setItem("correctWords", JSON.stringify(updatedCorrectWords));
};

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
        const correctWords = getCorrectWords();
        const shuffledEntries = shuffleArray(Object.entries(data));
        const filteredEntries = shuffledEntries.filter(
          ([german]) => !correctWords.some((word) => word.german === german)
        );

        const quizQuestions = filteredEntries.slice(0, 10).map(([german, english]) => {
          const allAnswers = shuffleArray(Object.values(data)).slice(0, 3);
          const options = shuffleArray([english, ...allAnswers]);
          return {
            question: `What is the English word for "${german}"?`,
            options,
            answer: options.indexOf(english),
            german,
          };
        });

        setQuestions(quizQuestions);
        setLoadingProgress(100);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  const handleAnswer = (selectedIndex) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === selectedIndex;

    setResults((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedAnswer: currentQuestion.options[selectedIndex],
        correctAnswer: currentQuestion.options[currentQuestion.answer],
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore((prev) => prev + 1); // Skoru artır
      updateCorrectWords([
        {
          german: currentQuestion.german,
          english: currentQuestion.options[currentQuestion.answer],
        },
      ]);
    }

    setSelectedAnswer(selectedIndex);
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setIsQuizFinished(true);
      }
      setSelectedAnswer(null);
    }, 500);
  };

  const finishQuizEarly = () => {
    setIsQuizFinished(true);
  };

  if (loadingProgress < 100) {
    return (
      <div className="Quiz">
        <Loader progress={loadingProgress} />
      </div>
    );
  }

  if (isQuizFinished) {
    const answeredQuestionsCount = results.length;

    return (
      <div className="Quiz">
        <h1 className="quiz-screen">Quiz Finished!</h1>
        <p className="quiz-score">Your score: {score} / {answeredQuestionsCount}</p>
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
        <a href="/">
        <button className="go-home-button">
          Go to Home
          </button>
      </a>
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
      <button onClick={finishQuizEarly} className="finish-quiz-button">
        Finish Quiz
      </button>

      
    </div>
  );
}

export default Quiz;
