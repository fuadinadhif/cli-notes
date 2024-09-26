import fs from "node:fs/promises";

import { getDB, saveDB, insertDB } from "./db.js";

export async function createNote(note, tags) {
  const newNote = {
    id: Date.now(),
    content: note,
    tags,
  };

  try {
    await insertDB(newNote, "notes");
    return newNote;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllNotes() {
  try {
    const db = await getDB();
    return db.notes;
  } catch (error) {
    console.error(error);
  }
}

export async function findNotes(text) {
  try {
    const db = await getDB();
    const filteredNotes = db.notes.filter((note) => {
      if (note.content.toLowerCase().includes(text.toLowerCase())) return true;
      return false;
    });
    return filteredNotes;
  } catch (error) {
    console.error(error);
  }
}

export async function removeNoteById(id) {
  try {
    const db = await getDB();
    const filteredNotes = db.notes.filter((note) => note.id !== id);
    db.notes = filteredNotes;
    await saveDB(db);
  } catch (error) {
    console.error(error);
  }
}

export async function removeAllNotes() {
  try {
    const db = await getDB();
    db.notes = [];
    await saveDB(db);
  } catch (error) {
    console.error(error);
  }
}
