module.exports = (t, reverse)=> (first, second)=> {
  if( first[t] > second[t] ) return reverse ? -1 : 1
  if( first[t] < second[t] ) return reverse ? 1 : -1
  return 0
}