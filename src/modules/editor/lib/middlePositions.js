import * as R from 'ramda'

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
  const positions = R.reduce((carry, item) => carry.concat(item.pos), [], nodes)

  const yA = biggestPos("y")(positions);
  const yB = lowestPos("y")(positions);

  const xA = biggestPos("x")(positions);
  const xB = lowestPos("x")(positions);

  const x = ((xA - xB) / 2) + xB
  const y = ((yA - yB) / 2) + yB

  return { x, y }
}