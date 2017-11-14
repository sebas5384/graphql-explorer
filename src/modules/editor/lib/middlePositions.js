import R from 'ramda'

const lowestPos = prop => R.pipe(
  R.sortWith([R.ascend(R.prop(prop))]),
  R.head,
  R.prop(prop)
)

const biggestPos = prop => R.pipe(
  R.sortWith([R.descend(R.prop(prop))]),
  R.head,
  R.prop(prop)
)

export const middlePositions = nodes => {
  const yA = biggestPos('y')(nodes)
  const yB = lowestPos('y')(nodes)

  const xA = biggestPos('x')(nodes)
  const xB = lowestPos('x')(nodes)

  const x = ((xA - xB) / 2) + xB
  const y = ((yA - yB) / 2) + yB

  return { x, y }
}