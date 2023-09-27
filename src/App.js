import React, { useState, useEffect, useRef } from "react";
import FlashcardList from "./components/FlashcardList";
import { MagnifyingGlass } from "react-loader-spinner";
import axios from "axios";
import he from "he";
import "./app.scss";

function App() {
  const [welcome, setWelcome] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      setCategories(res.data.trivia_categories);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (welcome == true) setWelcome(false);
    setLoading(true);
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          category: categoryEl.current.value,
          amount: amountEl.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.results.map((item, index) => {
            const answer = he.decode(item.correct_answer);
            const options = [
              ...item.incorrect_answers.map((option) => he.decode(option)),
              answer,
            ];
            return {
              id: `${index}-${Date.now()}`,
              question: he.decode(item.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
        setLoading(false);
      });
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className="form-group">
          <button className="button">Generate</button>
        </div>
      </form>
      {welcome && (
        <p className="welcome-message">
          Welcome to the Flashcard Quiz!
          <br />
          Please select a category and the number of questions to start playing.
        </p>
      )}
      <div className="container">
        {loading ? (
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{}}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
          />
        ) : (
          <FlashcardList flashcards={flashcards} />
        )}
      </div>
    </>
  );
}

export default App;
