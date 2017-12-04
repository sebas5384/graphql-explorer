import { getModelFromRelation } from '../store'

describe('[Editor] Store', () => {
  it('should get the model node from a relation node', () => {
    const edgesMock = [
      { nodes: ['ModelA', 'modelB'] },
      { nodes: ['modelB', 'ModelB'] },
    ]

    const result = getModelFromRelation({ edges: edgesMock, nodeB: 'modelB' })
    expect(result).toBe('ModelB')
  })
})