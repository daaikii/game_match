import axios from "axios";
import {response} from "./data"

export function getStatus(title,platform,id){  //{platform:"",id:"",level:"",rank]:""}の形で返す
  switch(title){
    case "LoL":{
      const data=response.data
      return {
        platform:data.platformInfo.platformSlug,
        id:data.platformInfo.platformUserId,
        level:data.segments[0].stats.level.value,
        rank:data.segments[0].stats.rankScore.metadata.rankName
      }
    }
    case "Valorant":{
      const data=response.data
      return {
        platform:data.platformInfo.platformSlug,
        id:data.platformInfo.platformUserId,
        level:data.segments[0].stats.level.value,
        rank:data.segments[0].stats.rankScore.metadata.rankName
      }
    }
    case "Apex" :{
      /* jsではcorsの制限があるためデータを用意してそれを返す
      await axios.get(`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${id}`,{params:{"TRN-Api-Key":process.env.TRACKER_APIKEY},headers:{"Accept": "application/json",
      "Accept-Encoding": "gzip"}},)*/
        const data=response.data
        return {
          platform:data.platformInfo.platformSlug,
          id:data.platformInfo.platformUserId,
          level:data.segments[0].stats.level.value,
          rank:data.segments[0].stats.rankScore.metadata.rankName
        }
    }
    case "Fortnite" :{
      /*axios.get(`https://api.fortnitetracker.com/v1/profile/${platform}/${id}`),{params:{"TRN-Api-Key":process.env.TRACKER_APIKEY}}*/
        const data=response.data
        return {
          platform:data.platformInfo.platformSlug,
          id:data.platformInfo.platformUserId,
          level:data.segments[0].stats.level.value,
          rank:data.segments[0].stats.rankScore.metadata.rankName
        }
    }
  }
}