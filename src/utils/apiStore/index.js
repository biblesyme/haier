import {Store} from 'rancher-api-store-haier'

let apiStore = new Store('appStore', {
  baseURL: '/v1'
})

if(process.env.ENV_NODE !== 'production'){
  window.APISTORE = apiStore
}
export default apiStore
