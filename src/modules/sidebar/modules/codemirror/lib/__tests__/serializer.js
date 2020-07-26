import { buildSchema } from 'graphql'
import { serializeSchemaToEditor } from '../serializer'

const BASIC_SCHEMA = `
type Post {
  id: ID!
  comments: [Comment!]! 
}

type Comment {
  id: ID!
  post: Post!
}

type RootQuery {
  post(id: ID!): Post
}

schema {
  query: RootQuery
}
`

const compiledSchema = buildSchema(BASIC_SCHEMA)

describe('Editor Serializer', () => {
  it('should extract nodes of type model from compiled schema', () => {
    const nodes = [
      {
        fields: [
          {
            name: 'id',
            type: 'ID!',
          },
          {
            name: 'comments',
            type: '[Comment!]!',
          },
        ],
        name: 'Post',
        type: 'model',
      },
      {
        fields: [
          {
            name: 'id',
            type: 'ID!',
          },
          {
            name: 'post',
            type: 'Post!',
          },
        ],
        name: 'Comment',
        type: 'model',
      },
    ]

    const result = serializeSchemaToEditor(compiledSchema)

    expect(result.nodes).toEqual(expect.arrayContaining(nodes))
  })

  it('should extract nodes of type relation from compiled schema', () => {
    const nodes = [
      {
        fields: [
          {
            name: 'id',
            type: 'ID!',
          },
          {
            name: 'comments',
            type: '[Comment!]!',
          },
        ],
        name: 'Post',
        type: 'model',
      },
      {
        fields: [
          {
            name: 'id',
            type: 'ID!',
          },
          {
            name: 'post',
            type: 'Post!',
          },
        ],
        name: 'Comment',
        type: 'model',
      },
      {
        name: 'comments',
        type: 'relation',
        cardinality: 'hasMany',
      },
      {
        name: 'post',
        type: 'relation',
        cardinality: 'hasOne',
      },
    ]

    const result = serializeSchemaToEditor(compiledSchema)

    expect(result.nodes).toEqual(expect.arrayContaining(nodes))
  })

  it('should extract edges for nodes from compiled schema', () => {
    const edges = [
      {
        type: 'hasOne',
        nodes: ['Comment', 'post'],
      },
      {
        type: 'hasMany',
        nodes: ['Post', 'comments'],
      },
      {
        type: 'hasOne',
        nodes: ['post', 'Post'],
      },
      {
        type: 'hasMany',
        nodes: ['comments', 'Comment'],
      },
    ]

    const result = serializeSchemaToEditor(compiledSchema)

    expect(result.edges).toEqual(expect.arrayContaining(edges))
  })
})
