import fs from "node:fs/promises";
import http from "node:http";
import open from "open";

function interpolate(html, data) {
  const result = html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    console.log(match);
    console.log(placeholder);
    return data[placeholder] || "";
  });

  return result;
}

function formatNotesHTML(notes) {
  const formattedNotes = notes
    .map((note) => {
      return `
      <div class="note">
        <p>${note.content}</p>
        <ul>
          ${note.tags.map((tag) => {
            return `
              <li>${tag}</li>
            `;
          })}
        </ul>
      </div>
    `;
    })
    .join("\n");

  return formattedNotes;
}

function createServer(notes) {
  return http.createServer(async (req, res) => {
    const TEMPLATE_HTML_PATH = new URL("./template.html", import.meta.url);
    try {
      const templateHTML = await fs.readFile(TEMPLATE_HTML_PATH, "utf-8");
      const noteHMTL = interpolate(templateHTML, {
        notes: formatNotesHTML(notes),
      });

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(noteHMTL);
    } catch (error) {
      console.error(error);
    }
  });
}

export function startServer(notes, port) {
  const server = createServer(notes);
  server.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
  open(`http://localhost:${port}`);
}
