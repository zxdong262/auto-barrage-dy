const os = require('os')
const extend = require('recursive-assign')
let config = {
  devCPUCount: os.cpus().length,
  devPort: 8020,
  minimize: false
}

try {
  extend(config, require('./config.js'))
} catch (e) {
  console.log(e.stack)
  console.warn('warn:no custom config file, use "cp config.sample.js config.js" to create one')
}

module.exports = config



