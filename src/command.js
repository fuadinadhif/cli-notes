import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  createNote,
  findNotes,
  getAllNotes,
  removeAllNotes,
  removeNoteById,
} from "./note.js";
import { startServer } from "./server.js";

function formatNotesCLI(notes) {
  notes.forEach(({ id, content, tags }) => {
    console.log("id: ", id);
    console.log("content: ", content);
    console.log("tags: ", tags);
    console.log("\n");
  });
}

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "Create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      try {
        const newNote = await createNote(argv.note, tags);
        console.log(`Added new note! Note ID: ${newNote.id}`);
      } catch (error) {
        console.error(error);
      }
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "Tags to add to the note",
  })

  .command(
    "all",
    "Get all notes",
    () => {},
    async () => {
      try {
        const notes = await getAllNotes();
        if (notes.length === 0) return console.log("You don't have any notes");
        formatNotesCLI(notes);
      } catch (error) {
        console.error(error);
      }
    }
  )

  .command(
    "find <filter>",
    "Get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe: "The search term to filter notes",
        type: "string",
      });
    },
    async (argv) => {
      const filter = argv.filter;
      try {
        const filteredNotes = await findNotes(filter);
        if (filteredNotes.length === 0) return console.log("No mathes found");
        formatNotesCLI(filteredNotes);
      } catch (error) {
        console.error(error);
      }
    }
  )

  .command(
    "remove <id>",
    "Remove a note by ID",
    (yargs) => {
      return yargs.positional("id", {
        describe: "The ID of the note you want to remove",
        type: "number",
      });
    },
    async (argv) => {
      const id = argv.id;
      try {
        await removeNoteById(id);
        console.log(`Successfully remove note with ID: ${id}`);
      } catch (error) {
        console.error(error);
      }
    }
  )

  .command(
    "clean",
    "Remove all notes",
    () => {},
    async () => {
      try {
        await removeAllNotes();
        console.log(`Successfully remove all notes`);
      } catch (error) {
        console.error(error);
      }
    }
  )

  .command(
    "web [port]",
    "Launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "Port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      startServer(notes, argv.port);
    }
  )

  .demandCommand(1)
  .parse();
