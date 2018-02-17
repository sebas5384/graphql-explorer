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

export const serializeFields = ({ document: { nodes } }) => nodes
  .map(({ nodes }) => nodes[0].leaves
    .reduce((carry, current) => {
      if (current.text.length < 1) return

      const clean = str => str.replace(/[^a-zA-Z_[\]!]/g, '')
      const value = clean(current.text)

      // Leaves with marks are the "type".
      const propName = current.marks.length
        ? 'type'
        : 'name'

      return ({ ...carry, [propName]: value })
    }, {})
  )
  // Remove invalid fields.
  .filter(
    field => typeof field !== 'undefined'
      && field.hasOwnProperty('name')
      && field.hasOwnProperty('type')
      && Object.values(field).every(value => value.length)
  )