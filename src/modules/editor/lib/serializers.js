import * as R from 'ramda'

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

      const cleanType = R.pipe(R.replace(/[^a-zA-Z_@() ":[\]!]/, ''), R.trim)
      const cleanName = R.pipe(R.replace(/[^a-zA-Z_]/g, ''), R.trim)

      return current.marks.length
        ? ({ ...carry, type: cleanType(current.text) })
        : ({ ...carry, name: cleanName(current.text) })
    }, {})
  )
  // Remove invalid fields.
  .filter(
    field => typeof field !== 'undefined'
      && field.hasOwnProperty('name')
      && field.hasOwnProperty('type')
      && Object.values(field).every(value => value.length)
  )