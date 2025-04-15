import React, { useState, useEffect } from "react";
import "../styles/Stats.css";

interface TestResult {
  id: string;
  timestamp: string;
  note: string;
  selectedColor: string;
  correctColor: string;
  isCorrect: boolean;
}

const Stats: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // In a real application, this would fetch from your backend
        // For now, we'll use localStorage as a placeholder
        const storedResults = localStorage.getItem("testResults");
        if (storedResults) {
          setResults(JSON.parse(storedResults));
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load statistics");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const calculateAccuracy = () => {
    if (results.length === 0) return 0;
    const correctAnswers = results.filter((result) => result.isCorrect).length;
    return Math.round((correctAnswers / results.length) * 100);
  };

  const getMostCommonColor = (note: string) => {
    const noteResults = results.filter((result) => result.note === note);
    if (noteResults.length === 0) return "N/A";

    const colorCounts: Record<string, number> = {};
    noteResults.forEach((result) => {
      colorCounts[result.selectedColor] = (colorCounts[result.selectedColor] || 0) + 1;
    });

    return Object.entries(colorCounts).sort(([, a], [, b]) => b - a)[0][0];
  };

  if (loading) return <div className="stats-container">Loading statistics...</div>;
  if (error) return <div className="stats-container error">{error}</div>;

  return (
    <div className="stats-container">
      <h1>Test Statistics</h1>

      <div className="stats-summary">
        <div className="stats-card">
          <h3>Total Tests</h3>
          <p>{results.length}</p>
        </div>
        <div className="stats-card">
          <h3>Overall Accuracy</h3>
          <p>{calculateAccuracy()}%</p>
        </div>
      </div>

      <div className="results-table">
        <h2>Note-by-Note Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>Note</th>
              <th>Most Common Color</th>
              <th>Correct Color</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {["C", "D", "E", "F", "G", "A", "B"].map((note) => {
              const noteResults = results.filter((result) => result.note === note);
              const correctCount = noteResults.filter((result) => result.isCorrect).length;
              const accuracy =
                noteResults.length > 0 ? Math.round((correctCount / noteResults.length) * 100) : 0;

              return (
                <tr key={note}>
                  <td>{note}</td>
                  <td>{getMostCommonColor(note)}</td>
                  <td>{noteResults[0]?.correctColor || "N/A"}</td>
                  <td>{accuracy}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stats;
