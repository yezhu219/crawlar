const { saleUrl } = require('./config')

const getSaleListUrl = (start = 1, end = 10)=> {
  let arr = []
  for (let i = start; i < end; i++) {
    arr.push(`${saleUrl}list-0-0-0-0-0-2-${i}-0-0-0-0-0.html`)
  }
  return arr
}

module.exports = {
  getSaleListUrl
}
