const express = require("express");
const getTimeTable = require("./modules/getTimeTable");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

router.get("/" , (req, res) => {
    
    getTimeTable(req)
    .then((timeTable) => {
        if (timeTable === 1) {
            return res.status(200).json({status : 200, message : "등록된 시간표 정보가 없습니다"});
        }
        return res.status(200).json({status : 200, message : "시간표조회에 성공하였습니다", data : { timeTable } });
    })
    .catch((err) => {
        if (err === 0) {
            return res.status(400).json({status : 400, message : "학교,학년, 반을 확인해주세요"});
        }
        console.log(err);
        return res.status(500).json({status : 500, message : "시간표조회에 실패하였습니다"});
    })
})


module.exports = router;
