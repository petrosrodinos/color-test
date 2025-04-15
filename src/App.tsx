import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { saveToGoogleSheet, formatDataForGoogleSheet } from "./googleSheets";
import Result from "./components/Result";
import Stats from "./pages/Stats";
import "./App.css";
import { musicNotes, colors, correctAnswers, audioFiles, SolfegeName } from "./constants";

function App() {
  // State to track the selected color for each note
  const [noteColors, setNoteColors] = useState<Record<string, string>>({});

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // State to show results
  const [showResults, setShowResults] = useState(false);

  // Create audio elements for each note
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Initialize audio elements
  useEffect(() => {
    musicNotes.forEach(({ solfege }) => {
      if (!audioRefs.current[solfege] && audioFiles[solfege as SolfegeName]) {
        audioRefs.current[solfege] = new Audio(audioFiles[solfege as SolfegeName]);
      }
    });
  }, []);

  // Handle color selection for a note
  const handleColorChange = (note: string, color: string) => {
    setNoteColors((prev) => ({
      ...prev,
      [note]: color,
    }));
  };

  // Handle playing a note
  const playNote = (solfege: string) => {
    const audio = audioRefs.current[solfege];
    if (audio) {
      audio.currentTime = 0; // Reset to beginning
      audio.play().catch((error) => {
        console.error(`Error playing note ${solfege}:`, error);
      });
    } else {
      console.error(`Audio not found for note ${solfege}`);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check if all notes have a color selected
    const allNotesColored = musicNotes.every(({ note }) => noteColors[note]);

    if (!allNotesColored) {
      alert("Please select a color for all notes before submitting.");
      return;
    }

    // Log the results
    console.log("Music Note to Color Matching Results:");
    musicNotes.forEach(({ note, solfege }) => {
      console.log(`${note} (${solfege}): ${noteColors[note]}`);
    });

    // Save to Google Sheet
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Format the data for Google Sheets
      const formattedData = formatDataForGoogleSheet(noteColors, musicNotes);

      console.log("Formatted Data:", formattedData);

      // Save to Google Sheet
      const result = await saveToGoogleSheet(formattedData);

      setSubmitStatus({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        // Show results after successful submission
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setSubmitStatus({
        success: false,
        message: "An error occurred while saving your data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setNoteColors({});
    setShowResults(false);
    setSubmitStatus(null);
  };

  return (
    <Router>
      <div className="App">
        <nav className="nav-container">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/stats" className="nav-link">
            Statistics
          </NavLink>
        </nav>

        <Routes>
          <Route path="/stats" element={<Stats />} />
          <Route
            path="/"
            element={
              <div className="container">
                {!showResults ? (
                  <>
                    <h1>Music Note to Color Matching</h1>
                    <p>Select a color for each music note</p>

                    <div className="notes-container">
                      {musicNotes.map(({ note, solfege }) => (
                        <div key={note} className="note-item">
                          <div className="note-header">
                            <div className="note-name">
                              {note} <span className="solfege-label">({solfege})</span>
                            </div>
                            <button
                              className="play-button"
                              onClick={() => playNote(solfege)}
                              aria-label={`Play ${note} note`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="play-icon"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                          <div className="color-options">
                            {colors.map((color) => (
                              <label key={color.name} className="color-option">
                                <input
                                  type="radio"
                                  name={`note-${note}`}
                                  value={color.name}
                                  checked={noteColors[note] === color.name}
                                  onChange={() => handleColorChange(note, color.name)}
                                />
                                <span
                                  className="color-swatch"
                                  style={{ backgroundColor: color.value }}
                                ></span>
                                <span className="color-name">{color.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="submit-container">
                      <button
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Submit"}
                      </button>

                      {submitStatus && (
                        <div
                          className={`status-message ${submitStatus.success ? "success" : "error"}`}
                        >
                          {submitStatus.message}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="results-section">
                    <Result
                      userAnswers={noteColors}
                      correctAnswers={correctAnswers}
                      musicNotes={musicNotes}
                    />
                    <div className="reset-container">
                      <button onClick={handleReset} className="reset-button">
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
