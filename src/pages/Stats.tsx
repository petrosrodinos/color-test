import React, { useState, useEffect } from "react";
import "../styles/Stats.css";
import { getSpreasheetData } from "../sheets";
import { colors, correctAnswers, noteToSolfege } from "../constants";

interface TestResult {
  timestamp: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  A: string;
  B: string;
}

interface ColorDistribution {
  [color: string]: number;
}

// Define the colors array (same as in App.tsx)

const Stats: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getSpreasheetData();
        // Skip the header row and process the data
        const processedResults = response.values.slice(1).map((row) => ({
          timestamp: row[7], // Assuming timestamp is the last column
          C: row[0],
          D: row[1],
          E: row[2],
          F: row[3],
          G: row[4],
          A: row[5],
          B: row[6],
        }));
        setResults(processedResults);
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
    let totalCorrect = 0;
    let totalAnswers = 0;

    results.forEach((result) => {
      Object.entries(correctAnswers).forEach(([note, correctColor]) => {
        if (result[note as keyof TestResult]) {
          totalAnswers++;
          if (result[note as keyof TestResult] === correctColor) {
            totalCorrect++;
          }
        }
      });
    });

    return Math.round((totalCorrect / totalAnswers) * 100);
  };

  const getMostCommonColor = (note: string) => {
    const colorCounts: Record<string, number> = {};
    results.forEach((result) => {
      const color = result[note as keyof TestResult];
      if (color) {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
    });

    if (Object.keys(colorCounts).length === 0) return "N/A";
    return Object.entries(colorCounts).sort(([, a], [, b]) => b - a)[0][0];
  };

  const calculateNoteAccuracy = (note: string) => {
    const noteResults = results.filter((result) => result[note as keyof TestResult]);
    if (noteResults.length === 0) return 0;

    const correctCount = noteResults.filter(
      (result) => result[note as keyof TestResult] === correctAnswers[note]
    ).length;

    return Math.round((correctCount / noteResults.length) * 100);
  };

  const getColorDistribution = (note: string): ColorDistribution => {
    const distribution: ColorDistribution = {};
    // Initialize all colors with 0
    colors.forEach((color) => {
      distribution[color.name] = 0;
    });

    // Count occurrences of each color
    results.forEach((result) => {
      const color = result[note as keyof TestResult];
      if (color) {
        distribution[color] = (distribution[color] || 0) + 1;
      }
    });

    return distribution;
  };

  // Calculate individual test scores
  const calculateTestScore = (result: TestResult) => {
    let correct = 0;
    let total = 0;

    Object.entries(correctAnswers).forEach(([note, correctColor]) => {
      if (result[note as keyof TestResult]) {
        total++;
        if (result[note as keyof TestResult] === correctColor) {
          correct++;
        }
      }
    });

    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  // Get color style for display
  const getColorStyle = (colorName: string) => {
    const color = colors.find((c) => c.name === colorName);
    return color ? { color: color.value } : {};
  };

  // Compare with average score
  const compareWithAverage = (score: number) => {
    const avgScore = calculateAccuracy();
    const diff = score - avgScore;

    if (diff > 5) return { text: `+${diff}% above average`, class: "better-than-average" };
    if (diff < -5) return { text: `${diff}% below average`, class: "worse-than-average" };
    return { text: "Average", class: "average" };
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
            {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
              <tr key={note}>
                <td>
                  {note} ({noteToSolfege[note]})
                </td>
                <td style={getColorStyle(getMostCommonColor(note))}>{getMostCommonColor(note)}</td>
                <td style={getColorStyle(correctAnswers[note])}>{correctAnswers[note]}</td>
                <td>{calculateNoteAccuracy(note)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="results-table">
        <h2>Color Distribution by Note</h2>
        <table>
          <thead>
            <tr>
              <th>Note</th>
              {colors.map((color) => (
                <th key={color.name} style={{ color: color.value }}>
                  {color.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["C", "D", "E", "F", "G", "A", "B"].map((note) => {
              const distribution = getColorDistribution(note);
              return (
                <tr key={note}>
                  <td>
                    {note} ({noteToSolfege[note]})
                  </td>
                  {colors.map((color) => (
                    <td key={color.name}>{distribution[color.name]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="results-table">
        <h2>Individual Test Results</h2>
        <table className="test-results-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>C</th>
              <th>D</th>
              <th>E</th>
              <th>F</th>
              <th>G</th>
              <th>A</th>
              <th>B</th>
              <th>Score</th>
              <th>Comparison</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              const score = calculateTestScore(result);
              const comparison = compareWithAverage(score);

              return (
                <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{formatTimestamp(result.timestamp)}</td>
                  {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
                    <td key={note} style={getColorStyle(result[note as keyof TestResult])}>
                      {result[note as keyof TestResult]}
                    </td>
                  ))}
                  <td className="score-cell">{score}%</td>
                  <td className={`comparison-cell ${comparison.class}`}>{comparison.text}</td>
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
