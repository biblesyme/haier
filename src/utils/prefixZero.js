export default function(number, length = 2) {
  return ('00000000' + number).substr(-length)
}
