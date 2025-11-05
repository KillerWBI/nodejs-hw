import createHttpError from "http-errors";
import { Note } from "../models/note.js";
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
export const getNoteById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const note = await Note.findById(id);
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        res.status(200).json(note);
    }catch (error) {
        next(error);
    }
};

export const createNote = async (req, res, next) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};
export const deleteNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
        throw createHttpError(404, "Note not found");
    }
    res.status(200).json({ message: "Note deleted successfully" });
  }
    catch (error) {
    next(error);
    }
};

export const updateNote  = async (req, res, next) => {
  try {
    const { noteId } = req.params.id;
    const updatedData = req.body;
    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, { new: true });
    if (!updatedNote) {
        throw createHttpError(404, "Note not found");
    }
    res.status(200).json(updatedNote);
    } catch (error) {
    next(error);
    }
};
