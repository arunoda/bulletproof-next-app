const { promises: fsPromises } = require('fs')
const os = require('os')
const path = require('path')

module.exports = (on, config) => {
  on('task', {
    async resetData() {
      const dataDir = path.join(os.tmpdir(), 'bulletproof-next-app')
      await fsPromises.rmdir(dataDir, { recursive: true })
      return null
    }
  })
}