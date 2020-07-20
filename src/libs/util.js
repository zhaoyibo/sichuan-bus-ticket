import axios from 'axios'
import dateformat from 'dateformat-util'

let util = {

}
let env = process.env.NODE_ENV

util.title = function (title) {
  title = title || 'Bus Ticket'
  window.document.title = title
}

const ajaxUrl = env === 'development'
  ? 'http://127.0.0.1:8089/api/scbus'
  : env === 'production'
    ? 'https://ideassea.com/api/scbus'
    : 'http://127.0.0.1:8089/api/scbus'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})

util.dateformat = dateformat

export default util
