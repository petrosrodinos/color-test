import doAudio from "../assets/notes/Do.mp3";
import reAudio from "../assets/notes/Re.mp3";
import miAudio from "../assets/notes/Mi.mp3";
import faAudio from "../assets/notes/Fa.mp3";
import solAudio from "../assets/notes/Sol.mp3";
import laAudio from "../assets/notes/La.mp3";
import siAudio from "../assets/notes/Si.mp3";


interface Color {
    label: string;
    name: string;
    value: string;
}


export const correctAnswers: Record<string, string> = {
    C: "red",
    D: "orange",
    E: "yellow",
    F: "green",
    G: "blue",
    A: "indigo",
    B: "violet",
};

export const musicNotes = [
    { note: "C", solfege: "Do" },
    { note: "D", solfege: "Re" },
    { note: "E", solfege: "Mi" },
    { note: "F", solfege: "Fa" },
    { note: "G", solfege: "Sol" },
    { note: "A", solfege: "La" },
    { note: "B", solfege: "Si" },
];

export const colors: Color[] = [
    { label: "Red", name: "red", value: "#FF0000" },
    { label: "Orange", name: "orange", value: "#FF7F00" },
    { label: "Yellow", name: "yellow", value: "#FFFF00" },
    { label: "Green", name: "green", value: "#00FF00" },
    { label: "Blue", name: "blue", value: "#0000FF" },
    { label: "Indigo", name: "indigo", value: "#4B0082" },
    { label: "Violet", name: "violet", value: "#9400D3" },
];

export type SolfegeName = "Do" | "Re" | "Mi" | "Fa" | "Sol" | "La" | "Si";

// Map solfège names to audio files
export const audioFiles: Record<SolfegeName, string> = {
    Do: doAudio,
    Re: reAudio,
    Mi: miAudio,
    Fa: faAudio,
    Sol: solAudio,
    La: laAudio,
    Si: siAudio,
};