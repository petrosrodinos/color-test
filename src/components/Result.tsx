import React from "react";
import "./Result.css";

interface ResultProps {
  userAnswers: Record<string, string>;
  correctAnswers: Record<string, string>;
  musicNotes: Array<{ note: string; solfege: string }>;
}

const Result: React.FC<ResultProps> = ({ userAnswers, correctAnswers, musicNotes }) => {
  // Calculate the number of correct answers
  const calculateScore = () => {
    let correctCount = 0;

    musicNotes.forEach(({ note }) => {
      if (userAnswers[note] === correctAnswers[note]) {
        correctCount++;
      }
    });

    return {
      correct: correctCount,
      total: musicNotes.length,
      percentage: Math.round((correctCount / musicNotes.length) * 100),
    };
  };

  const score = calculateScore();

  return (
    <div className="result-container">
      <h2>Your Results</h2>

      <div className="score-display">
        <div className="score-circle">
          <span className="score-percentage">{score.percentage}%</span>
        </div>
        <p className="score-text">
          You got {score.correct} out of {score.total} correct
        </p>
      </div>

      <div className="answers-comparison">
        <h3>Your Answers vs. Correct Answers</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Note</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {musicNotes.map(({ note, solfege }) => (
              <tr
                key={note}
                className={userAnswers[note] === correctAnswers[note] ? "correct" : "incorrect"}
              >
                <td>
                  {note} ({solfege})
                </td>
                <td>{userAnswers[note] || "Not answered"}</td>
                <td>{correctAnswers[note]}</td>
                <td>
                  {userAnswers[note] === correctAnswers[note] ? (
                    <span className="checkmark">✓</span>
                  ) : (
                    <span className="x-mark">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Result;
