const request = require("request");
const niesInfo = require("../../config/neisInfo");

const getClass = function getClass(req) {
    schoolCode = req.query.schoolcode;
    officeCode = req.query.officecode;
    if (schoolCode == null || schoolCode == "" || officeCode == null || officeCode == "") {
        return new Promise((resolve, reject) => {
            reject(0) //클라리언트 요청 오류
        })
    }

    return new Promise ((resolve, reject) => {
        const KEY = niesInfo.key;
        const url = `http://open.neis.go.kr/hub/classInfo?ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&pSize=100&Type=json&KEY=${KEY}`
        
        request(url, (err, response, classInfo) => {
            if (err) {
                reject(err);
            }
            try {
                classInfo = JSON.parse(classInfo); //classInfo -> 모든 json파일 전체
                let listCount;
                listCount = classInfo.classInfo[0].head[0].list_total_count;
                let schoolClass = [""] //리턴값 (1-2^1-3...)
                for (let i = 0; i < listCount; i++) {
                    try {
                        schoolClass[0] = schoolClass + "^" + classInfo.classInfo[1].row[i].GRADE + "-" + classInfo.classInfo[1].row[i].CLASS_NM;
                    } catch(err) {
                        reject(err);
                    } 
                }
                resolve(schoolClass);
            } catch(err) {
                reject(err);
            }
        })
    })
}

module.exports = getClass;