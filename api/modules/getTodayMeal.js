const request = require("request");
const getDateTime = require("./getDateTime");
const niesInfo = require("../../config/neisInfo");

const getMeal = function getMeal(req) {
    const officeCode = req.query.officecode;
    const schoolCode = req.query.schoolcode;

    if (officeCode == null || schoolCode == null || officeCode == "" || schoolCode == "") {
        return new Promise((resolve, reject) => {
            reject(0); //클라리언트 요청 오류
        })
    }

    return new Promise((resolve, reject) => {
        const KEY= niesInfo.key;
        const today = new Date();
        const mealTime = `${today.getFullYear()}${getDateTime.formatNum(today.getMonth() + 1)}${getDateTime.formatNum(today.getDate())}`;
        const url = `http://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${mealTime}&Type=json&KEY=${KEY}`;
        request(url, (err, response, mealData) => {
            if (err) {
                reject(err);
            }
    
            try {
                mealData = JSON.parse(mealData);

                if (mealData.RESULT != undefined) {
                    if (mealData.RESULT.CODE == 'INFO-200'){
                        resolve(1); //성공 , 데이터가 없음
                    } else {
                        reject ("NOT PROCESSING ERROR CODE") //서버 오류
                    }
                }
                let breakfast;
                let launch;
                let dinner;
        
                try {
                    breakfast = (mealData.mealServiceDietInfo[1].row[0].DDISH_NM);
                    breakfast = breakfast.replace(/<br\/>/gi, "\n");
                } catch (err) {
                    breakfast = null;
                }
                try {
                    launch = (mealData.mealServiceDietInfo[1].row[1].DDISH_NM);
                    launch = launch.replace(/<br\/>/gi, "\n");
                } catch (err) {
                    launch = null;
                }
                try {
                    dinner = (mealData.mealServiceDietInfo[1].row[2].DDISH_NM);
                    dinner = dinner.replace(/<br\/>/gi, "\n");
                } catch (err) {
                    dinner = null;
                }
                
                const meal = [{ breakfast, launch, dinner }];
                resolve(meal);
            } catch(err) {
                reject(err);
            }
            
        })
    })
    
}

module.exports = getMeal;
