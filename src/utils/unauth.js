export default function(e) {
  if ((e.error && e.error.response && e.error.response.status === 401)
   || (e.status === 401)
   || (e.response && e.response.status === 401)) {
     
    const url = window.location.origin
    window.location.href=`http://t.c.haier.net/login?url=${url}`
  }
}
