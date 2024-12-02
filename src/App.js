import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Quiz from './components/Quiz';
import './styles/App.css';

function Home() {
  return (
    <div className="App">
      <h1>German-English Quiz</h1>
      <p>Test your knowledge of German words!</p>
      <Link to="/quiz">
        <button>Start Quiz</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
