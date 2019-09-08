const request = require('request');

const getWeather = function getSun(req) {
    const local = req.query.local;
    
    const localCode = encodeURI(local + "날씨");
    const URL = `https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=${localCode}`;

    return new Promise ((resolve, reject) => {
        if (local == null) {
            reject(0); //클라이언트 오류
        }
        try {
            request(URL, (err, res, html) => {
                if (err) {
                    reject(err);
                }
                let ozonData;
                let temData ;
                let rehData ;
                let pm10Data;
                let pm25Data;
                let skyData ;
                let popData;
                let picturNumData;

                try {
                    ozonData = html.split("오존지수")[1].split('"num">')[1].split("ppm")[0];
                    temData = html.split('"todaytemp">')[1].split("</span>")[0]
                    rehData = html.split("예상 습도")[1].split("<span>")[1].split("</span>")[0];
                    pm10Data = html.split("미세먼지")[1].split('"num">')[1].split("㎍/㎥")[0];
                    pm25Data = html.split("초미세먼지")[1].split('"num">')[1].split("㎍/㎥")[0];
                    skyData = html.split('"item_condition">')[1].split("</span>")[0].split(">")[1];
                    picturNumData = html.split("ico_state ws")[1].split('"')[0];
                    if (new Date().getHours() < 11) {
                        popData = html.split('"point_time morning">')[1].split('"num">')[1].split("</span>")[0];
                    } else {
                        popData = html.split('"point_time afternoon">')[1].split('"num">')[1].split("</span>")[0];
                    }
                } catch (err) {
                    reject(err);
                }
                
                const weatherData = [{
                    popData,
                    ozonData,
                    skyData,
                    pm10Data,
                    pm25Data,
                    rehData,
                    temData,
                    pictureNumData
                }]

                resolve(weatherData);
            });
        }
        catch(err) {
            reject(err);
        }
    })
}

module.exports = getWeather;