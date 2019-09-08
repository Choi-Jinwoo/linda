const mysql = require("mysql");
const dbInfo = require("../../config/dbInfo");

const connection = mysql.createConnection(dbInfo)

connection.connect();

const addSc = function (req) {
    const date = req.body.date;
    const content = req.body.content;
    const writer = req.body.writer;
    const schoolCode = req.body.schoolcode;
    let school;
    try {
        school = req.body.school.replace(/(\s*)/g, "");
    } catch(err) {
        return new Promise((resolve, reject) => {
            reject(0);
        });
    }
    const grade = req.body.grade;
    const _class = req.body._class;
    
    const sqlArr = [date, content, writer, school, grade, _class, schoolCode];
    const sql = "INSERT INTO calendar (date, content, writer, school, grade, class, schoolcode) VALUES (?, ?, ?, ?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(sql,sqlArr, (err, rows, fields) => {
            if (err) {
                reject(err);
            }

            const addedSc = [{
                date,
                content,
                writer,
                school,
                grade,
                class : _class,
                schoolCode
            }];
            resolve(addedSc);
        })
    })
}

module.exports = addSc;