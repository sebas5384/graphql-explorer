import { buildSchema } from 'graphql'
import {
  serializeSchemaToEditor,
  mergeSerializedToEditorState,
} from '../serializer'

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
    expect(result.nodes).toEqual(nodes)
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

  it('should merge nodes positions from state with serialized schema', () => {
    const nodesState = [
      {
        fields: [
          {
            name: 'comments',
            type: '[Comment!]!',
          },
        ],
        name: 'Post',
        type: 'model',
        selected: false,
        pos: {
          x: 426,
          y: 605,
        },
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
        selected: false,
        pos: {
          x: 332,
          y: 444,
        },
      },
      {
        cardinality: 'hasMany',
        name: 'comments',
        type: 'relation',
        pos: {
          x: 554,
          y: 444,
        },
      },
      {
        cardinality: 'hasOne',
        name: 'post',
        type: 'relation',
        pos: {
          x: 339,
          y: 222,
        },
      },
    ]

    const expectedNodesState = [
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
        selected: false,
        pos: {
          x: 426,
          y: 605,
        },
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
        selected: false,
        pos: {
          x: 332,
          y: 444,
        },
      },
      {
        cardinality: 'hasMany',
        name: 'comments',
        type: 'relation',
        pos: {
          x: 554,
          y: 444,
        },
      },
      {
        cardinality: 'hasOne',
        name: 'post',
        type: 'relation',
        pos: {
          x: 339,
          y: 222,
        },
      },
    ]

    const serialized = serializeSchemaToEditor(compiledSchema)
    const result = mergeSerializedToEditorState(serialized, {
      nodes: nodesState,
    })

    // nodes: model
    expect(result.nodes[0]).toEqual(expectedNodesState[0])
    expect(result.nodes[1]).toEqual(expectedNodesState[1])

    // nodes: relation
    expect(result.nodes[2]).toEqual(expectedNodesState[2])
    expect(result.nodes[3]).toEqual(expectedNodesState[3])
  })
})
