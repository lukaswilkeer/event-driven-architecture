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

  mountDir(dir) {
    const forwadSlash = /\//ig
    const splited = dir.split(forwadSlash)
    const dired = this.removeDotJs(join('.', splited))

    return dired
  }


  removeDotJs(filename) {
    const extension = /\.[0-9a-z]+$/i

    return join('', init((filename.split(extension))))
  }

  initializeServices(dir) {
    return fs.readdir(`${process.cwd()}/src/${dir}`, (err, itens) => {
      if (err instanceof Error && err.code == 'ENOTDIR') {
        const service = `${this.mountDir(dir)}`
        this.services.set(service, `../src/${dir}`)
        log(`Service ${service} up`)
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
            const service = `api.${this.mountDir(dir)}.${this.removeDotJs(file)}`
            this.services.set(service, `../src/${dir}`)
            log(`Service ${service} up`)
          } else {
            this.initializeServices(`${dir}/${file}`)
          }
        })
      }
    })
  }
}

export default InitializeServices
