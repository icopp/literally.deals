require('dotenv').config()

const withPlugins = require('next-compose-plugins')
const withCss = require('@zeit/next-css')
const withFonts = require('next-fonts')
const withTypescript = require('@zeit/next-typescript')

module.exports = withPlugins([withCss, withFonts, withTypescript], {
  publicRuntimeConfig: {
    API_SERVER: process.env.API_SERVER
  }
})
