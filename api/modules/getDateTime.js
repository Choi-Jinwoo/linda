const formatNum = (data) => {
    try {
        if (isNaN(data)) {
            throw "Data is NaN";
        }
        if (parseInt(data) < 10) {
            try {
                return `0${parseInt(data)}`;
            } catch(err) {
                console.error(err);
                return err;
            } 
        }
        return data.toString();
    } catch(err) {
        console.error(err);
        return err;
    }
}

const getDateInfo = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = formatNum(today.getMonth() + 1);
    const date = formatNum(today.getDate());
    return `${year}-${month}-${date}`
}

const getTimeInfo = () => {
    const today = new Date();
    const hours = formatNum(today.getHours());
    const minuates = formatNum(today.getMinutes());
    const seconds = formatNum(today.getSeconds());    
    return `${hours}:${minuates}:${seconds}`
}

const getDateTime = { getDateInfo , getTimeInfo, formatNum };
module.exports = getDateTime;