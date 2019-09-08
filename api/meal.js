const express = require("express");
const getMeal = require("./modules/getTodayMeal");
const router = express.Router();


router.get("/" , (req, res) => {
    getMeal(req)
    .then((meal) => {
        if (meal === 1) {
            return res.status(200).json({status : 200, message : "등록된 급식이 없습니다"});    
        }
        return res.status(200).json({status : 200, message : "급식조회에 성공하였습니다", data : { meal }});
    }).catch((err) => {
        if (err === 0) {
            return res.status(400).json({status : 400, message : "학교, 시도교육청코드를 확인해주세요"});
        }
    })
})

module.exports = router;
