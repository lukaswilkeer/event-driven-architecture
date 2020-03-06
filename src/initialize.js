import fs from 'fs'
import debug from 'debug'
import { stats } from 'fs'
import { join, init } from 'lodash/fp'

const log = debug('app')

class InitializeServices {
  constructor(dir) {
    this.services = new Map()
    this.initializeServices(dir)
  }

  // note: static methods doens't bind
  mountDir(dir) {
    const forwadSlash = /\//ig
    const splited = dir.split(forwadSlash)
    const dired = this.removeDotJs(join('.', splited))

    return dired
  }


  // note: static methods doesn't bind
  removeDotJs(filename) {
    const extension = /\.[0-9a-z]+$/i

    return join('', init((filename.split(extension))))
  }

  logServices() {
    log('Logging services')

    for (const service of this.services.entries()) {
      log(`${service[0]} up`)
    }
  }

  initializeServices(dir) {
    return fs.readdir(`${process.cwd()}/src/${dir}`, (err, itens) => {
      if (err instanceof Error && err.code == 'ENOTDIR') {
        this.services.set(`${this.mountDir(dir)}`, `./src/${dir}`)
        const fileToLog = this.services.get(`${this.mountDir(dir)}`)
      } else {
        itens.map((file) => {
          const isFile = fs.stat(`${process.cwd()}/src/${dir}/${file}`, (err, stat) => {
            if (err) {
              return false
            } else {
              return !stat.isDirectory()
            }
          })

          if (isFile) {
            this.services.set(`api.${this.mountDir(dir)}.${this.removeDotJs(file)}`, `./src/${dir}`)
          } else {
            this.initializeServices(`${dir}/${file}`)
          }
        })
      }
    })
  }
}

export default InitializeServices
