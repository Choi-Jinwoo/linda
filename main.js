const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(cors());
app.use((req, res, next) => {
    require("./api/log").printLog(req);
    next();
})
app.use("/calendar", require("./api/calendar"));
app.use("/meal", require("./api/meal"));
app.use("/weather", require("./api/weather"));
app.use("/time", require("./api/time"));
app.use("/timetable", require("./api/timeTable"));
app.use("/searchschool", require("./api/searchSchool"));

app.listen(3000, () => {
    console.log("Server is listening at port 3000");
})