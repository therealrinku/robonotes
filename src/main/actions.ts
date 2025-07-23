const sqlite3 = require('sqlite3').verbose();

export class RobonoteActions {
    constructor(){
        this.db = null;
    }

    async init(filepath){
        this.db = new sqlite3.Database(filepath);

        await new Promise((resolve, reject) => {
            this.db.run(`
                create table if not exists notes (
                    id integer primary key autoincrement,
                    title text,
                    content text,
                    created_at datetime default current_timestamp,
                    updated_at datetime default current_timestamp
                )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    getNotes(){
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

    upsertNote(id, title, content){
        const currentTimestamp = new Date().toISOString();

        if (id) {
            return new Promise((resolve, reject) => {
                this.db.run(
                    `update notes set title = ?, content = ?, updated_at = ? where id = ?`, 
                    [title, content, currentTimestamp, id], 
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            this.db.get("SELECT * FROM notes WHERE id = ?", [id], (err, updatedRow) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(updatedRow);
                                }
                            });
                        }
                    }
                );
            });
        } else {
            return new Promise((resolve, reject) => {
                this.db.run(
                    `insert into notes (title, content, updated_at, created_at) values(?, ?, ?, ?)`, 
                    [title, content, currentTimestamp, currentTimestamp], 
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            this.db.get("SELECT * FROM notes WHERE id = ?", [this.lastID], (err, newRow) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(newRow);
                                }
                            });
                        }
                    }
                );
            });
        }
    }

    deleteNote(id){
        return new Promise((resolve, reject) => {
            this.db.run(
                `delete from notes where id = ?`, 
                [id], 
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
}
