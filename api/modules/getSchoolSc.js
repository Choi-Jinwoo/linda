const request = require("request");
const getDateTime = require("./getDateTime");
const niesInfo = require("../../config/neisInfo");

const getSchoolSc = function getSchoolSc(req) {
    const officeCode = req.query.officecode;
    const schoolCode = req.query.schoolcode;

    //const officeCode = "D10";
    //const schoolCode = 7240393;

    let year = req.query.year;
    let month = req.query.month;
    
    if (officeCode == null || schoolCode == null) {
        return new Promise((resolve, reject) => {
            reject(0); //클라이언트 요청 오류
        })
    }

    if (year == undefined || year == "") {
        year = new Date().getFullYear();
    }
    
    if (month == undefined || month == "") {
        month = new Date().getMonth() + 1
    }

    month = getDateTime.formatNum(month)

    return new Promise((resolve, reject) => {
        const KEY= niesInfo.key;
        const url = `http://open.neis.go.kr/hub/SchoolSchedule?ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AA_YMD=${year}${month}&pSize=40&KEY=${KEY}&Type=json`;
        request(url, (err, response, schoolAllSc)=>{
            if (err) {
                reject(err);
            }

            try {
                schoolAllSc = JSON.parse(schoolAllSc);
                if (schoolAllSc.RESULT != undefined) {
                    if (schoolAllSc.RESULT.CODE == 'INFO-200'){
                        const schoolSc = [];
                        const mSchoolSc = [];
                    
                        resolve({schoolSc, mSchoolSc}); //성공 , 데이터가 없음
                    } else {
                        reject ("NOT PROCESSING ERROR CODE") //서버 오류
                    }
                }

                const schoolSc = [{}];
                const mSchoolSc = [];
                for (let i = 0; i < schoolAllSc.SchoolSchedule[1].row.length; i++) {
                    const date = `${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[0]}${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[1]}${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[2]}${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[3]}-${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[4]}${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[5]}-${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[6]}${schoolAllSc.SchoolSchedule[1].row[i].AA_YMD[7]}`;
                    const content = schoolAllSc.SchoolSchedule[1].row[i].EVENT_NM;
                    schoolSc[0][date] = content;
                    mSchoolSc[i] = {
                        date,
                        content
                    }
                }
                
                resolve({schoolSc, mSchoolSc});
                
            } catch(err) {
                reject(err);
            }
        })
    })
}

module.exports = getSchoolSc