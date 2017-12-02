import { deserializeFields } from '../serializers'

const deserializedFields = {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'field',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                text: 'id: ',
              },
              {
                text: 'ID!',
                marks: [
                  {
                    type: "type"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        kind: 'block',
        type: 'field',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                text: 'title: ',
              },
              {
                text: 'String!',
                marks: [
                  {
                    type: "type"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

const serializedFields = [
  { name: 'id', type: 'ID!' },
  { name: 'title', type: 'String!' }
]

describe('[Lib] Serializers', () => {
  it('should deserialize fields to Slate value', () => {
    expect(deserializeFields(serializedFields)).toMatchObject(deserializedFields)
  })

  it('should serialize fields from Slate value', () => {
    expect(serializeFields(serializedFields)).toMatchObject(serializedFields)
  })
})