const express = require("express");
const router = express.Router();
const getDateTime = require("./modules/getDateTime");
router.get("/" , (req, res) => {
    const dateTime = [{
        date : getDateTime.getDateInfo(),
        time : getDateTime.getTimeInfo()
    }]
    
    if (dateTime[0] == null) {
        return res.status(500).json({status : 500, message : "시간조회에 실패하였습니다"})
    }

    return res.status(200).json({status : 200, message : "시간조회에 성공하였습니다", data : { date :  dateTime}});
})

module.exports = router;
