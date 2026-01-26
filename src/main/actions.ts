import { app } from 'electron';
import sqlite3 from 'sqlite3';

interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export default class RobonoteActions {
  private db: sqlite3.Database | null;

  constructor() {
    this.db = null;
  }

  async init(): Promise<void> {
    const dbPath = `${app.getPath('documents')}/robonotes.db`;

    this.db = new sqlite3.Database(dbPath);

    await new Promise<void>((resolve, reject) => {
      this.db!.run(
        `
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  }

  getNotes(): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM notes', (err: Error | null, rows: Note[]) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  }

  upsertNote(id: number | null, content: string): Promise<Note> {
    const currentTimestamp = new Date().toISOString();
    const thisDb = this.db!;

    if (id) {
      return new Promise((resolve, reject) => {
        thisDb.run(
          `UPDATE notes SET content = ?, updated_at = ? WHERE id = ?`,
          [content, currentTimestamp, id],
          function (err: Error | null) {
            if (err) {
              reject(err);
              return;
            }

            thisDb.get(`SELECT * FROM notes WHERE id = ?`, [id], (err: Error | null, row: Note) => {
              if (err) reject(err);
              else resolve(row);
            });
          },
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        thisDb.run(
          `INSERT INTO notes (content, updated_at, created_at) VALUES(?, ?, ?)`,
          [content, currentTimestamp, currentTimestamp],
          function (this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }

            thisDb.get(
              `SELECT * FROM notes WHERE id = ?`,
              [this.lastID],
              (err: Error | null, row: Note) => {
                if (err) reject(err);
                else resolve(row);
              },
            );
          },
        );
      });
    }
  }

  deleteNote(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db!.run(`DELETE FROM notes WHERE id = ?`, [id], function (err: Error | null) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
