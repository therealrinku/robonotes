const sqlite3 = require('sqlite3').verbose();

export class RobonoteActions {
  constructor() {
    this.db = null;
  }

  async init(rootDir) {
    if (!rootDir) {
      return;
    }

    const dbPath = `${rootDir}/robonotes.db`;

    this.db = new sqlite3.Database(dbPath);

    await new Promise((resolve, reject) => {
      this.db.run(
        `
                create table if not exists notes (
                    id integer primary key autoincrement,
                    content text,
                    created_at datetime default current_timestamp,
                    updated_at datetime default current_timestamp
                )`,
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  }

  getNotes() {
    return new Promise((resolve, reject) => {
      this.db.all('select * from notes', (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  }

  upsertNote(id, content) {
    const currentTimestamp = new Date().toISOString();
    const thisDb = this.db;

    if (id) {
      return new Promise((resolve, reject) => {
        thisDb.run(
          `update notes set content = ?, updated_at = ? where id = ?`,
          [content, currentTimestamp, id],
          function (err) {
            if (err) reject(err);

            thisDb.get(`select * from notes where id = ?`, [id], (err, row) => {
              if (err) reject(err);
              resolve(row);
            });
          },
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        thisDb.run(
          `insert into notes (content, updated_at, created_at) values(?, ?, ?)`,
          [content, currentTimestamp, currentTimestamp],
          function (err) {
            if (err) reject(err);

            thisDb.get(
              `select * from notes where id = ?`,
              [this.lastID],
              (err, row) => {
                if (err) reject(err);
                resolve(row);
              },
            );
          },
        );
      });
    }
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      this.db.run(`delete from notes where id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
