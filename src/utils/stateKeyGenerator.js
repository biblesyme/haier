export default (type, payload)=>{
  switch(type){
    case 'save':
      return `state_save_${payload.type}`
    case 'doAction':
      let {data, action} = payload
      return `state_doAction_${data.type}-${data.id}-${action}`
    case 'followLink':
      let {data, link} = payload
      return `state_followLink_${data.type}-${data.id}-${link}`
  }
}