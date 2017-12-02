import { deserializeFields } from '../deserialize'

it('should deserialize fields to Slate value', () => {
  const fields = [
    { name: 'id', type: 'ID!' },
    { name: 'title', type: 'String!' }
  ]

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

  expect(deserializeFields(fields)).toMatchObject(deserializedFields)
})
