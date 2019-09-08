const express = require("express");
const router = express.Router();
const searchSchoolInfo = require("./modules/searchSchoolInfo");
const getClassInfo = require("./modules/getClassInfo");

router.get("/" , (req, res) => {
    searchSchoolInfo(req)
    .then((schoolInfo) => {
        return res.status(200).json({status : 200, message : "학교조회에 성공하였습니다", data : { schoolInfo }});
    })
    .catch((err) => {
        if (err === 0) {
            return res.status(400).json({status : 400, message : "학교정보를 입력하세요"});    
        }
        console.error(err);
        return res.status(500).json({status : 500, message : "학교조회에 실패하였습니다"});
    })  
})

router.get("/classinfo", (req,res) => {
    getClassInfo(req)
    .then((classInfo) => {
        return res.status(200).json({status : 200, message : "학교조회에 성공하였습니다", data : { classInfo }});
    })
    .catch((err) => {
        if (err === 0) {
            return res.status(400).json({status : 400, message : "학교정보를 확인해주세요"});
        }
        console.error(err);
        return res.status(500).json({status : 500, message : "학교조회에 실패하였습니다"});
    })
})

module.exports = router;
