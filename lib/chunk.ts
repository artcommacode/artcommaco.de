export default (xs, n) => (
  Array.from(Array(Math.ceil(xs.length / n)), (_,i) => (
    xs.slice(i * n, i * n + n)
  ))
)
