import React from "react";

// get correct words from local storage
const getCorrectWords = () => {
  return JSON.parse(localStorage.getItem("correctWords")) || [];
};

function YourVocabulary() {
  let correctWords = getCorrectWords(); // retrieve correctly known words

  // filter out improperly structured data
  correctWords = correctWords.filter((word) => word && word.german && word.english);

  // sort in alphabetical order
  const sortedWords = correctWords.sort((a, b) =>
    a.german.localeCompare(b.german)
  );

  return (
    <div className="your-vocabulary">
      <h1>Your Vocabulary</h1>
      {sortedWords.length === 0 ? (
        <p>You haven't learned any words yet.</p>
      ) : (
        <ul>
          {sortedWords.map((word, index) => (
            <li key={index}>
              <strong>{word.german}:</strong> {word.english}
            </li>
          ))}
        </ul>
      )}
      <a href="/">
        <button className="go-home-button">Go to Home</button>
      </a>
    </div>
  );
}

export default YourVocabulary;
