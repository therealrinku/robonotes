import { app } from 'electron';
import sqlite3 from 'sqlite3';

interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export default class RobonoteActions {
  private db: sqlite3.Database | null = null;

  constructor() {
    this.db = null;
  }

  private runQuery<T>(query: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db!.all(query, params, (err: Error | null, result: T) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  private runUpdate(
    query: string,
    params: any[] = [],
  ): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db!.run(query, params, function (err: Error | null) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  async init(): Promise<void> {
    const dbPath = `${app.getPath('documents')}/robonotes.db`;
    this.db = new sqlite3.Database(dbPath);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`;

    await this.runUpdate(createTableQuery);
  }

  getNotes(): Promise<Note[]> {
    return this.runQuery<Note[]>('SELECT * FROM notes');
  }

  async upsertNote(id: number | null, content: string): Promise<Note> {
    const currentTimestamp = new Date().toISOString();
    const queryParams = [content, currentTimestamp];

    if (id) {
      await this.runUpdate(
        'UPDATE notes SET content = ?, updated_at = ? WHERE id = ?',
        [...queryParams, id],
      );
      const data = await this.runQuery<Note[]>(
        'SELECT * FROM notes WHERE id = ?',
        [id],
      );
      return data[0];
    }

    const res = await this.runUpdate(
      'INSERT INTO notes (content, updated_at, created_at) VALUES(?, ?, ?)',
      [...queryParams, currentTimestamp],
    );
    const data = await this.runQuery<Note[]>(
      'SELECT * FROM notes WHERE id = ?',
      [res.lastID],
    );
    return data[0];
  }

  deleteNote(id: number): Promise<sqlite3.RunResult> {
    return this.runUpdate('DELETE FROM notes WHERE id = ?', [id]);
  }
}
