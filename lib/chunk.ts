export default <T>(xs: T[], n: number): T[][] =>
  Array.from(Array(Math.ceil(xs.length / n)), (_, i) => xs.slice(i * n, i * n + n))
