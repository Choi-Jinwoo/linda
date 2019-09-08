const express = require("express");
const getCalendarSc = require("./modules/getCalendarSc");
const getSchoolSc = require("./modules/getSchoolSc");
const addSc = require("./modules/addSc");
const removeSc = require("./modules/removeSc");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

router.get("/" , (req, res) => {
    getCalendarSc(req)
    .then((calendarSc) => {
        getSchoolSc(req)
        .then((schoolSc) => {
            return res.status(200).json({status : 200, message : "일정조회에 성공하였습니다", data : {calendarSchedule : calendarSc, schoolSchedule : schoolSc.schoolSc, mSchoolSchedule : schoolSc.mSchoolSc }});
        }).catch((err) => {
            if (err === 0) {
                return res.status(400).json({status : 400, message : "학교정보를 입력하세요"});
            }
            console.log(err);
            return res.status(500).json({status : 500, message : "일정조회에 실패하였습니다"});
        })
        
    })
    .catch((err) => {
        if (err === 0) {
            return res.status(400).json({status : 400, message : "학교,학년, 반을 확인해주세요"});    
        }
        console.error(err);
        return res.status(500).json({status : 500, message : "일정조회에 실패하였습니다"});
    })

})

router.post("/add", (req, res) => {
    try {
        addSc(req)
        .then((addedSc)=> {
            return res.status(200).json({status : 200, message : "일정추가에 성공하였습니다", data : {newSchedule : addedSc}});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({status : 500, message : "일정추가에 실패하였습니다"});
        })
    } catch(err) {
        console.error(err);
        return res.status(400).json({status : 400, message : "학교를 입력해주세요"});
    }
})

router.delete("/remove/:id", (req, res) => {
    try {
        removeSc(req)
        .then((affectedRows) => {
            if (affectedRows === 0) {
                console.error("NO ID TO DELETE");
                return res.status(500).json({status : 400, message : "일정삭제에 실패하였습니다"});
            }
            return res.status(200).json({status : 200, message : "일정삭제에 성공하였습니다", data : {}});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({status : 500, message : "일정삭제에 실패하였습니다"});
        })
    } catch(err){
        console.error(err);
        return res.status(400).json({status : 400, message : "일정삭제에 실패하였습니다"});
    }
})

router.put("/update/:id", (req, res) => {
    
})

module.exports = router;
