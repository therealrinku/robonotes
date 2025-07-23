const sqlite3 = require('sqlite3').verbose();

export class RobonoteActions {
	constructor(){
		this.db = null;
	}

	async init(filepath){
		this.db = new sqlite3.Database(filepath);

		await this.db.run(`create table if not exists notes (
			 id integer primary key autoincrement,
			 title text,
			 content text,
			 created_at datetime default current_timestamp,
			 updated_at datetime default current_timestamp)`
		);
	}

	getNotes(){
		return new Promise((resolve, reject)=>{
			this.db.all('select * from notes', (err, rows)=>{
				if(!err){
					resolve(rows);
				} else {
					reject(err);
				}
			})
		})
	}

	upsertNote(id, title, content){
		const currentTimestamp = new Date().toISOString();

		if(id){
			return new Promise((resolve, reject) => {
				this.db.run(`update notes set title = ?, content = ?, updated_at = ? where id = ?`, [title, content, currentTimestamp, id], (err)=> {
					if(err) reject();

					db.get("SELECT * FROM users WHERE id = ?", [1], (err, updatedRow) => {
						if (err) reject();
						return updatedRow;
					})
			)}	
		} else {
			return new Promise((resolve, reject) => {
				this.db.run(`insert into notes (title, content, updated_at, created_at)
					values(?, ?, ?, ?)`, [title, content, currentTimestamp, currentTimestamp], (err)=> {
					if(err) reject();

					db.get("SELECT * FROM users WHERE id = ?", [1], (err, updatedRow) => {
						if (err) reject();
						return updatedRow;
					})
				}
			})				
		}
	}

	deleteNote(id){
		return new Promise((resolve, reject) => {
			this.db.run(`delete from notes where id = ?`, [id], (err)=> {
				return err ? reject() : resolve();
			}
		})				
  }
}
