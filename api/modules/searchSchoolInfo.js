const request = require("request");
const niesInfo = require("../../config/neisInfo");

const searchSchool = function searchSchool(req) {
    let school = req.query.school;

    if (school == null) {
        return new Promise((resolve, reject) => {
            reject(0); //클라이언트 오류
        })
    }

    if (school.indexOf("학교") == -1) {
        if (school.substr(school.length -1, school.length) == "초" || school.substr(school.length -1, school.length) == "고") {
            school = school + "등학교"
        } else {
            school = school + "학교"
        }
    }
    const KEY=niesInfo.key;
    const url = `http://open.neis.go.kr/hub/schoolInfo?SCHUL_NM=${encodeURI(school)}&Type=json&KEY=${KEY}`;
    return new Promise((resolve, reject) => {
        request(url, (err, res, schoolInfo) => {
            if (err) {
                reject(err);
            }
            try {
                schoolInfo = JSON.parse(schoolInfo);
                let listCount;
                listCount = schoolInfo.schoolInfo[0].head[0].list_total_count;
                
                const schoolList = [];
                for (let i = 0; i < listCount; i++) {
                    schoolList[i] = {
                        schoolName : schoolInfo.schoolInfo[1].row[i].SCHUL_NM,
                        schoolLocate : schoolInfo.schoolInfo[1].row[i].ORG_RDNMA,
                        officeCode : schoolInfo.schoolInfo[1].row[i].ATPT_OFCDC_SC_CODE,
                        schoolCode : schoolInfo.schoolInfo[1].row[i].SD_SCHUL_CODE,
                        schoolKind : schoolInfo.schoolInfo[1].row[i].SCHUL_KND_SC_NM
                    }
                }
                resolve(schoolList);
            } catch(err) {
                reject(err);
            }
        })
    })
}

module.exports = searchSchool