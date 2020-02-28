import fs from 'fs'
import { stats } from 'fs'
import { join, init } from 'lodash/fp'

const forwadSlash = /\//ig

const mountDir = (dir) => {
  const splited = dir.split(forwadSlash)
  const dired = removeDotJs(join('.', splited))

  return dired
}

const removeDotJs = (filename) => {
  const extension = /\.[0-9a-z]+$/i

  return join('', init((filename.split(extension))))
}

export const services = new Map()

export const logServices = () => {
  console.log('Logging services')

  for (const service of services.entries()) {
    console.log(`${service[0]} up`)
  }
}

export const initializeServices = (dir) => fs.readdir(`${process.cwd()}/src/${dir}`, (err, itens) => {
  if (err instanceof Error && err.code == 'ENOTDIR') {
    services.set(`${mountDir(dir)}`, `./src/${dir}`)
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
        services.set(`api.${mountDir(dir)}.${removeDotJs(file)}`, `./src/${dir}`)
      } else {
        const currentDir = `${dir}/${file}`
        initializeServices(currentDir)
      }
    })
  }
})
