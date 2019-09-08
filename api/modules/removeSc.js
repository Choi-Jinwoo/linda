const mysql = require("mysql");
const dbInfo = require("../../config/dbInfo");

const connection = mysql.createConnection(dbInfo)

connection.connect();

const removeSc = function (req) {
    const id = req.params.id;
    if (!parseInt(id)) {
        return 0; //클라이언트 오류
    }

    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM calendar WHERE id = ?", [id], (err , rows , fields) => {
            if (err) {
                reject(err);
            }
            resolve(rows.affectedRows);
        })
    })
}

module.exports = removeSc;