import { middlePositions } from '../middlePositions'

it('should extract middle positions from x and y vectors', () => {
  const nodeA = {
    name: 'NodeA',
    x: 50,
    y: 40
  }

  const nodeB = {
    name: 'NodeB',
    x: 10,
    y: 50
  }

  const positions = middlePositions([nodeB, nodeA])

  expect(positions).toMatchObject({ x: 30, y: 45 })
})
