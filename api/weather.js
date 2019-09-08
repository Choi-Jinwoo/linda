const express = require("express");
const getWeatherData = require("./modules/getWeatherData");
const router = express.Router();

router.get("/" , (req, res) => {
    getWeatherData(req)
    .then((weatherData) => {
        return res.status(200).json({status : 200, message : "날씨조회에 성공하였습니다", data : {weatherData}});
    })
    .catch((err) =>{
        if (err === 0) {
            return res.status(400).json({status : 400, message : "지역정보를 입력해주세요"});
        }
        return res.status(500).json({status : 500, message : "날씨조회에 실패하였습니다"});
    })
})

module.exports = router;
