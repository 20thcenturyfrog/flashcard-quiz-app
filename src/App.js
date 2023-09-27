import React, { useState, useEffect, useRef } from "react";
import FlashcardList from "./components/FlashcardList";
import { MagnifyingGlass } from "react-loader-spinner";
import axios from "axios";
import he from "he";
import "./app.scss";

function App() {
  const [welcome, setWelcome] = useState(true);
  const [categoryFetchError, setCategoryFetchError] = useState("");
  const [flashcardFetchError, setFlashcardFetchError] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios
      .get("https://opentdb.com/api_category.php")
      .then((res) => {
        setCategories(res.data.trivia_categories);
      })
      .catch((error) => {
        setWelcome(false);
        if (error.response) {
          setCategoryFetchError(
            `Oops! No categories to show due to a server error (${error.response.status}). Come back another time!`
          );
        } else if (error.request) {
          setCategoryFetchError(
            "Oops! No categories to show due to a network error. Come back another time!"
          );
        } else {
          setCategoryFetchError(
            "Oops! No categories to show due to an error. Come back another time!"
          );
        }
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (welcome == true) setWelcome(false);
    if (flashcardFetchError != "") setFlashcardFetchError("");
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
      })
      .catch((error) => {
        if (error.response) {
          setFlashcardFetchError(
            `Oops! No flashcards to show due to a server error (${error.response.status}). Come back another time!`
          );
        } else if (error.request) {
          setFlashcardFetchError(
            "Oops! No flashcards to show due to a network error. Come back another time!"
          );
        } else {
          setFlashcardFetchError(
            "Oops! No flashcards to show due to an error. Come back another time!"
          );
        }
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
      {categoryFetchError && (
        <p className="error-message">{categoryFetchError}</p>
      )}
      {flashcardFetchError && (
        <p className="error-message">{flashcardFetchError}</p>
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
