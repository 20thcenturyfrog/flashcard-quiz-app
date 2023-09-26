import React, { useState } from "react";

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);

  return (
    <div
      className={`card ${flip ? "card-flipped" : ""}`}
      onClick={() => setFlip(!flip)}
    >
      <div className="card__front">
        {flashcard.question}
        <div className="card__options">
          {flashcard.options.map((option) => {
            return (
              <div className="card__option" key={option}>
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className="card__back">{flashcard.answer}</div>
    </div>
  );
}
