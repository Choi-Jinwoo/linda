const mysql = require("mysql");
const getDateTime = require("./getDateTime");
const dbInfo = require("../../config/dbInfo");

const connection = mysql.createConnection(dbInfo)
connection.connect();

const getCalendarSc = function getCalendarSc(req) {
    let schoolName;
    try {
        schoolName = req.query.school.replace(/(\s*)/g, "");
    } catch(err) {
        return new Promise((resolve, reject) => {
            reject(0);
        })
    }
    const grade = req.query.grade;
    const _class = req.query.class;
    const schoolCode = req.query.schoolcode;

    let year = req.query.year;
    let month = req.query.month;

    if (schoolName == null || grade == null || _class == null || schoolName == "" || grade == "" || _class == "" || schoolCode == null || schoolCode == ""){
        return new Promise((resolve, reject)=> {
            reject(0);
        })  //클라이언트 요청오류
    }

    if (year == undefined || year == "") {
       year = new Date().getFullYear(); 
    }

    if (month == undefined || month == "") {
        month = new Date().getMonth() + 1; 
    }

    const sql = "SELECT *FROM calendar WHERE school = ? AND schoolcode = ? AND (grade = ? OR grade is NULL) AND (class = ? OR class is NULL) AND YEAR(date) = ? AND MONTH(date) = ?";
    const sqlArr = [schoolName, schoolCode, grade, _class, year, month];

    return new Promise((resolve, reject) => {
        connection.query(sql, sqlArr, (err, rows, fielsds) => {
            if (err) {
                reject(err); //서버 오류
            }

            if (rows == null) {
                reject(0);
            }

            for (let i = 0; i < rows.length; i++) {
                rows[i].date = rows[i].date.toLocaleDateString();
                rows[i].date = `${rows[i].date.split("-")[0]}-${getDateTime.formatNum(rows[i].date.split("-")[1])}-${getDateTime.formatNum(rows[i].date.split("-")[2])}`
                rows[i]._class = rows[i].class
                delete rows[i].class
            }
            resolve(rows);
        })
    })
}


module.exports = getCalendarSc;