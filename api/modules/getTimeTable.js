const request = require("request");
const getDateTime = require("./getDateTime");
const niesInfo = require("../../config/neisInfo");

const KEY = niesInfo.key;

const getTimeTable = function getTimeTable(req) {
    const schoolKind = req.query.schoolkind;
    if (schoolKind === "초등학교") {
        return getElementryTimeTable(req);
    } else if (schoolKind == "중학교") {
        return getMiddleTimeTable(req);
    } else if (schoolKind == "고등학교") {
        return getHighTimeTable(req);
    } else {
        return new Promise((resolve, reject) => {
            reject(0); //클라이언트 요청 오류
        })
    }
}

function getElementryTimeTable(req) {
    const officeCode = req.query.officecode;
    const schoolCode = req.query.schoolcode;
    const grade = req.query.grade;
    const _class = req.query.class;
  
    if (officeCode == null || officeCode == "" || schoolCode == null || schoolCode == "" || grade == null || grade == "" || _class == null || _class == "") {
        return new Promise((resolve, reject) => {
            reject (0); //클라이언트 요청오류
        })
    }

    const year = new Date().getFullYear();
    const startTime = getTimeZone().startTime;
    const endTime = getTimeZone().endTime;

    const url = `http://open.neis.go.kr/hub/elsTimetable?ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AY=${year}&GRADE=${grade}&CLASS_NM=${_class}&KEY=${KEY}&TI_FROM_YMD=${startTime}&TI_TO_YMD=${endTime}&Type=json`;
    
    return new Promise ((resolve,reject) => {
        request(url, (err, response, timeTableData) => {
            if (err) {
                reject(err);
            }
            try {
                timeTableData = JSON.parse(timeTableData);
                
                try {
                    if (timeTableData.elsTimetable[0].head[1].RESULT.CODE != 'INFO-000'){
                        reject(0); //클라이언트 요청 오류
                    }
                } catch(err) {
                    if (timeTableData.RESULT.CODE != "INFO-000") {
                        resolve(1) //해당 데이터 없음;
                    }
                } 

                const mon = [{}];
                const tue = [{}];
                const wed = [{}];
                const thu = [{}];
                const fri = [{}];
                const timeTable = [{mon, tue, wed, thu, fri}];
                
                const storedSubject = ["", "", "", "", ""];
                for (let i = 0; i < timeTableData.elsTimetable[1].row.length; i++) {
                    const today = timeTableData.elsTimetable[1].row[i].ALL_TI_YMD;
                    const formateDate = new Date(`${today[0]}${today[1]}${today[2]}${today[3]}-${today[4]}${today[5]}-${today[6]}${today[7]}`)
                    const day = formateDate.getDay() - 1;                    
                    const subject = timeTableData.elsTimetable[1].row[i].ITRT_CNTNT.replace("-","");
                    if (day === 0) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].mon = storedSubject[day];
                    } else if(day === 1) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].tue = storedSubject[day];
                    } else if(day === 2) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].wed = storedSubject[day];
                    } else if(day === 3) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].thu = storedSubject[day];
                    } else if(day === 4) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].fri = storedSubject[day];
                    }
                }

                resolve(timeTable);
            } catch(err)
            {
                reject(err);
            }
        })
    })
}

function getMiddleTimeTable(req) {
    const officeCode = req.query.officecode;
    const schoolCode = req.query.schoolcode;
    const grade = req.query.grade;
    const _class = req.query.class;
    
    if (officeCode == null || officeCode == "" || schoolCode == null || schoolCode == "" || grade == null || grade == "" || _class == null || _class == "") {
        return new Promise((resolve, reject) => {
            reject (0); //클라이언트 요청오류
        })
    }

    const year = new Date().getFullYear();
    const startTime = getTimeZone().startTime;
    const endTime = getTimeZone().endTime;

    const url = `http://open.neis.go.kr/hub/misTimetable?ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AY=${year}&GRADE=${grade}&CLASS_NM=${_class}&KEY=${KEY}&TI_FROM_YMD=${startTime}&TI_TO_YMD=${endTime}&Type=json`;
    return new Promise ((resolve,reject) => {
        request(url, (err, response, timeTableData) => {
            if (err) {
                reject(err);
            }
            try {
                timeTableData = JSON.parse(timeTableData);
                try {
                    if (timeTableData.misTimetable[0].head[1].RESULT.CODE != 'INFO-000'){
                        reject(0); //클라이언트 요청 오류
                    }
                } catch(err) {
                    if (timeTableData.RESULT.CODE != "INFO-000") {
                        resolve(1) //해당 데이터 없음;
                    }
                }  
                const mon = [{}];
                const tue = [{}];
                const wed = [{}];
                const thu = [{}];
                const fri = [{}];
                const timeTable = [{mon, tue, wed, thu, fri}];
                const storedSubject = ["", "", "", "", ""];
                for (let i = 0; i < timeTableData.misTimetable[1].row.length; i++) {
                    const today = timeTableData.misTimetable[1].row[i].ALL_TI_YMD;
                    const formateDate = new Date(`${today[0]}${today[1]}${today[2]}${today[3]}-${today[4]}${today[5]}-${today[6]}${today[7]}`)
                    const day = formateDate.getDay() - 1;                    
                    const subject = timeTableData.misTimetable[1].row[i].ITRT_CNTNT.replace("-","");
                    if (day === 0) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].mon = storedSubject[day];
                    } else if(day === 1) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].tue = storedSubject[day];
                    } else if(day === 2) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].wed = storedSubject[day];
                    } else if(day === 3) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].thu = storedSubject[day];
                    } else if(day === 4) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].fri = storedSubject[day];
                    }
                }
                resolve(timeTable);
            } catch(err)
            {
                reject(err);
            }
        })
    })
}

function getHighTimeTable(req) {
    const officeCode = req.query.officecode;
    const schoolCode = req.query.schoolcode;
    const grade = req.query.grade;
    const _class = req.query.class;
    
    if (officeCode == null || officeCode == "" || schoolCode == null || schoolCode == "" || grade == null || grade == "" || _class == null || _class == "") {
        return new Promise((resolve, reject) => {
            reject (0); //클라이언트 요청오류
        })
    }

    const year = new Date().getFullYear();
    const startTime = getTimeZone().startTime;
    const endTime = getTimeZone().endTime;

    const url = `http://open.neis.go.kr/hub/hisTimetable?ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AY=${year}&GRADE=${grade}&CLRM_NM=${_class}&KEY=${KEY}&TI_FROM_YMD=${startTime}&TI_TO_YMD=${endTime}&Type=json`;
    return new Promise ((resolve,reject) => {
        request(url, (err, response, timeTableData) => {
            if (err) {
                reject(err);
            }
            try {
                timeTableData = JSON.parse(timeTableData);
                try {
                    if (timeTableData.hisTimetable[0].head[1].RESULT.CODE != 'INFO-000'){
                        reject(0); //클라이언트 요청 오류
                    }
                } catch(err) {
                    if (timeTableData.RESULT.CODE != "INFO-000") {
                        resolve(1) //해당 데이터 없음;
                    }
                }  
                const mon = [{}]; 
                const tue = [{}];
                const wed = [{}];
                const thu = [{}];
                const fri = [{}];
                const timeTable = [{mon, tue, wed, thu, fri}];
                const storedSubject = ["", "", "", "", ""];
                for (let i = 0; i < timeTableData.hisTimetable[1].row.length; i++) {
                    const today = timeTableData.hisTimetable[1].row[i].ALL_TI_YMD;
                    const formateDate = new Date(`${today[0]}${today[1]}${today[2]}${today[3]}-${today[4]}${today[5]}-${today[6]}${today[7]}`)
                    const day = formateDate.getDay() - 1;                    
                    const subject = timeTableData.hisTimetable[1].row[i].ITRT_CNTNT.replace("-","");
                    if (day === 0) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].mon = storedSubject[day];
                    } else if(day === 1) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].tue = storedSubject[day];
                    } else if(day === 2) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].wed = storedSubject[day];
                    } else if(day === 3) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].thu = storedSubject[day];
                    } else if(day === 4) {
                        storedSubject[day] = storedSubject[day] + "^" + subject;
                        timeTable[0].fri = storedSubject[day];
                    }
                }
                resolve(timeTable);
            } catch(err)
            {
                reject(err);
            }
        })
    })
}

function getTimeZone() {
    const start= new Date();
    const end= new Date();
    start.setDate(start.getDate() - (start.getDay() - 1));
    end.setDate(end.getDate() + (5 - end.getDay()));
    startTime = `${start.getFullYear()}${getDateTime.formatNum(start.getMonth() + 1)}${getDateTime.formatNum(start.getDate())}`;
    endTime = `${end.getFullYear()}${getDateTime.formatNum(end.getMonth() + 1)}${getDateTime.formatNum(end.getDate())}`;

    return {startTime, endTime}
}

module.exports = getTimeTable;