/*jshint esversion: 8 */ 
"use strict";

const sqlite3 = require('sqlite3').verbose();

class rowingSession {
    constructor() {
      this.sessionId = Date.now() + "session";
      this.startDate = Date.now ();
      this.endDate=0;
      this.duration=0;
      this.totalDistance=0;
      this.values = [];
    }
  
    getValues(){
      return{
        sessionId: this.sessionId,  
        startDate: this.startDate,
        endDate: this.endDate,
        duration: this.duration,
        totalDistance: this.totalDistance,
        values: this.values
      };
    }

    save(){
      let db = new database();
      //db.open
      db.insert(this.sessionId,this.values);
      db.close();  
    }

    reset(){
      this.sessionId = 0;
      this.startDate = 0;
      this.endDate=0;
      this.duration=0;
      this.totalDistance=0;
      this.values = [];   
    }

  }


  class savedSessions{

    constructor(){
      this.label = "I am";
    }

    async getSessions(){
      let db = new database()
     
        return await db.getAllRecords()  
     }

     async getSessionById(id){
      return await this.handleDbResponse(id)
     }

     async handleDbResponse(id) {
      let db = new database()
      let parameter = [id]
      let res = await db.getSessionById(parameter)
      console.log(res[0].id)
      res[0].data = JSON.parse(res[0].data)
      return res[0]
    }



  }

  class database{

    constructor(){
      this.db = new sqlite3.Database('./db/sessions.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Connected to the  database.');
        }
      });

    }
 
    insert(id,values){
      this.db.run(`INSERT INTO session(id,data) VALUES(?,?)`, [id,JSON.stringify(values)], function(err) {
        console.log(typeof values);
        if (err) {
          return console.log(err.message);
        } else {
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
      });

    }

    async getAllRecords() {
      let query = "SELECT oid,id FROM session";
        return this.doQuery(query);
    }

    async getSessionById(array) {
      let query = "SELECT oid,id,data FROM session WHERE oid = ?";
      return this.doQueryParams(query, array);
    }

      // CORE FUNCTIONS DON'T TOUCH
      async doQuery(queryToDo) {
        let pro = new Promise((resolve,reject) => {
            let query = queryToDo;
            this.db.all(query, function (err, result) {
                if (err) throw err // GESTION D'ERREURS
                resolve(result);
            });
        });
        return pro.then((val) => {
            return val;
            
        });
    }
    async doQueryParams(queryToDo, array) {
      let pro = new Promise((resolve,reject) => {
        let query = queryToDo;
        this.db.all(query, array, function (err, result) {
            if (err) throw err // GESTION D'ERREURS
            resolve(result);
        });
      });
      return pro.then((val) => {
        return val;
        
      });
    }


    close(){
      this.db.close((err) => {
        if (err) {
          console.error(err.message);
        } else {
        console.log('Close the database connection.');
      }
      });
    }

  }


  module.exports = {
    rowingSession: rowingSession,
    savedSessions: savedSessions
}