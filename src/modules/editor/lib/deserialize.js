export const deserializeFields = fields => ({
  document: {
    nodes: fields.map(({ name, type }) => ({
      kind: 'block',
      type: 'field',
      nodes: [
        {
          kind: 'text',
          leaves: [
            {
              text: `${name}: `,
            },
            {
              text: `${type}`,
              marks: [
                {
                  type: "type"
                }
              ]
            }
          ]
        }
      ]
    }))
  }
})