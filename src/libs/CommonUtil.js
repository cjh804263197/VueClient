import moment from 'moment'

let checkTime = (stime, etime) => {
    stime = moment(stime).format('YYYY-MM-DD')
    etime = moment(etime).format('YYYY-MM-DD')
    // 开始时间
    var arrs = stime.split('-')
    var startTime = new Date(arrs[0], arrs[1], arrs[2])
    var startTimes = startTime.getTime()
    // 结束时间
    var arre = etime.split('-')
    var endTime = new Date(arre[0], arre[1], arre[2])
    var endTimes = endTime.getTime()
    // 当前时间
    var thisDate = new Date()
    var thisDates = thisDate.getFullYear() + '-0' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
    var arrn = thisDates.split('-')
    var nowTime = new Date(arrn[0], arrn[1], arrn[2])
    var nowTimes = nowTime.getTime()
    if (nowTimes < startTimes || nowTimes > endTimes) {
        return false
    }
    return true
}

module.exports = {
    checkTime
}
