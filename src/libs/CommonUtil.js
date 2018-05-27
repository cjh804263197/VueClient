import moment from 'moment'

let checkTime = (stime, etime, thisDate = new Date()) => {
    stime = moment(stime).format('YYYY-MM-DD')
    etime = moment(etime).format('YYYY-MM-DD')
    thisDate = moment(thisDate).format('YYYY-MM-DD')
    console.warn(`stime=${stime}, etime=${etime}, thisDate=${thisDate}`)
    // 开始时间
    var arrs = stime.split('-')
    var startTime = new Date(arrs[0], arrs[1], arrs[2])
    var startTimes = startTime.getTime()
    // 结束时间
    var arre = etime.split('-')
    var endTime = new Date(arre[0], arre[1], arre[2])
    var endTimes = endTime.getTime()
    // 当前时间
    var arrn = thisDate.split('-')
    var nowTime = new Date(arrn[0], arrn[1], arrn[2])
    var nowTimes = nowTime.getTime()
    if (nowTimes < startTimes || nowTimes > endTimes) {
        return false
    }
    return true
}

let getMonthDay = (ym) => {
    let arrn = ym.split('-')
    let year = parseInt(arrn[0])
    let month = parseInt(arrn[1])
    var d = new Date(year, month, 0)
    return d.getDate()
}

module.exports = {
    checkTime,
    getMonthDay
}
