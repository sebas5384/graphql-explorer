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

      return current.marks.length
        ? ({ ...carry, type: clean(current.text) })
        : ({ ...carry, name: clean(current.text) })
    }, {})
  )
  // Remove invalid fields.
  .filter(
    field => typeof field !== 'undefined'
      && field.hasOwnProperty('name')
      && field.hasOwnProperty('type')
      && Object.values(field).every(value => value.length)
  )