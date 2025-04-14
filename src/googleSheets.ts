import { appendSpreadsheetData } from "./sheets";

export type NoteColorData = string[];

// Function to format the data for Google Sheets
export function formatDataForGoogleSheet(
    noteColors: Record<string, string>,
    musicNotes: Array<{ note: string; solfege: string }>
): NoteColorData {
    // Create an array of colors in the order of the music notes
    return musicNotes.map(({ note }) => noteColors[note] || '');
}


// Function to save data to Google Sheets
export async function saveToGoogleSheet(data: NoteColorData): Promise<{ success: boolean; message: string }> {
    const timestamp = new Date().toISOString();
    const values = [...Object.values(data), timestamp];

    try {

        const res = await appendSpreadsheetData(values);
        console.log('Appended to sheet:', res);
        return { success: true, message: 'Data saved successfully.' };
    } catch (err) {
        console.error('Google Sheets append error:', err);
        return { success: false, message: 'Failed to write to sheet.' };
    }
}
