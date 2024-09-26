import fs from "node:fs/promises";

const DB_PATH = new URL("../db.json", import.meta.url);

export async function getDB() {
  try {
    const response = await fs.readFile(DB_PATH, "utf-8");
    const data = JSON.parse(response);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function saveDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

export async function insertDB(newData, field) {
  try {
    const data = await getDB();
    data[field].push(newData);
    await saveDB(data);
  } catch (error) {
    console.error(error);
  }
}
