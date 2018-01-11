// replace an item with newItem in ary
export default function(ary, newItem, path = 'id') {
  const out = []
  for (let i = 0; i < ary.length; i++) {
    if (ary[i][path] === newItem[path]) {
      out.push(newItem)
    } else {
      out.push(ary[i])
    }
  }
  return out
}
