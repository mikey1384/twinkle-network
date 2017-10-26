module.exports = {
  formatDate(timeStamp) {
    let d = new Date(timeStamp * 1000)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    return `${year}-${month}-${day}`
  }
}
