const path=require('path')
require('dotenv').config();

module.exports = {
  env: {
    APIKEY:process.env.APIKEY,
    AUTHDOMAIN:process.env.AUTHDOMAIN,
    DATABASEURL:process.env.DATABASEURL,
    PROJECTID:process.env.PROJECTID,
    STORAGEBUCKET:process.env.STORAGEBUCKET,
    MESSAGINGSENDERID:process.env.MESSAGINGSENDERID,
    APPID:process.env.APPID,
    TRACKER_APIKEY:process.env.TRACKER_APIKEY,
    RIOT_APIKEY:process.env.RIOT_APIKEY,
  },
}

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      type: 'url-loader',
    })
    return config
  },
}