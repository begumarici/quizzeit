import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Quiz from './components/Quiz';
import YourVocabulary from './components/YourVocabulary'; 
import './styles/App.css';

function resetProgress() {
  const confirmation = window.confirm("Are you sure you want to reset your progress?");
  if (confirmation) {
    localStorage.removeItem("correctWords");
    window.location.reload();
  }
}

function Home() {
  return (
    <div className="App">
      <h1 className='title'>Quiz Zeit</h1>
      <p className='info1'>Test your knowledge of German words!</p>
      <p className='info-text-container'>
  Take the quiz to test your German vocabulary. Each quiz consists of 10 random words. 
  Words you answer correctly will be saved in the 'Your Vocabulary' section, so you can track your progress and avoid repetition!
</p>

      <Link to="/quiz">
        <button className='start-button'>🇩🇪 Start Quiz 🇬🇧</button>
      </Link>
      <Link to="/your-vocabulary">
        <button className="vocabulary-button">Your Vocabulary</button>
      </Link>
      <button onClick={resetProgress} className="reset-button">
        Reset Progress
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/your-vocabulary" element={<YourVocabulary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
