import { objectValues, RuleKinds } from 'graphql-language-service'
import {
  isInputObjectType,
  isIntrospectionType,
  isObjectType,
  isListType,
  valueFromASTUntyped,
} from 'graphql'

const isNotIntrospectionType = (f) => !isIntrospectionType(f)
const isNotInputType = (field) => !isInputObjectType(field)
const getFieldsFromType = (value) => Object.entries(value.getFields())

const getValueFromAstField = (ast) => {
  if (ast?.name?.value && !ast.type) {
    return ast.name.value
  }

  if (!ast?.type) {
    return false
  }

  return getValueFromAstField(ast.type)
}

const isKindFromAst = (ast, predicate) => {
  if (predicate(ast)) {
    return true
  }

  if (!ast.type) {
    return false
  }

  return isKindFromAst(ast.type, predicate)
}

export function serializeSchemaToEditor(schema) {
  const typeMap = schema.getTypeMap()
  // const graphqlTypes = objectValues(typeMap)

  const potentialNodes = Object.entries(typeMap).filter(
    ([key, value]) =>
      isNotIntrospectionType(value) &&
      isNotInputType(value) &&
      isObjectType(value) &&
      key !== schema.getQueryType()?.name &&
      key !== schema.getMutationType()?.name &&
      key !== schema.getSubscriptionType()?.name
  )

  const modelNodes = potentialNodes.map(([key, value]) => {
    const fields = getFieldsFromType(value).map(([name, field]) => {
      return { name, type: field.type.toString() }
    })

    return {
      name: key,
      type: 'model',
      fields,
    }
  })

  const relationFields = potentialNodes
    // flat and extract fields from potential nodes (model) and add the parent
    // type owner of the field as a third item: [fieldName, fieldAst, parentType]
    .reduce((prev, [key, value]) => {
      const result = getFieldsFromType(value).map((pair) => pair.concat(key))
      return prev.concat(result)
    }, [])
    // only fields which relates to potential nodes.
    .filter(([name, field]) =>
      isKindFromAst(field.astNode, (ast) =>
        potentialNodes.some(
          ([name]) => ast?.name?.value && name === ast?.name?.value
        )
      )
    )

  const relationNodes = relationFields.map(([name, field]) => {
    const isHasMany = isKindFromAst(
      field.astNode,
      (ast) => ast?.kind === RuleKinds.LIST_TYPE
    )

    return {
      name,
      type: 'relation',
      cardinality: isHasMany ? 'hasMany' : 'hasOne',
    }
  })

  const edges = relationFields
    .map(([name, field, parentType]) => {
      const type = isKindFromAst(
        field.astNode,
        (ast) => ast?.kind === RuleKinds.LIST_TYPE
      )
        ? 'hasMany'
        : 'hasOne'

      const valueType = getValueFromAstField(field.astNode)

      return [
        {
          type,
          nodes: [name, valueType],
        },
        {
          type,
          nodes: [parentType, name],
        },
      ]
    })
    .flat()

  return { nodes: modelNodes.concat(relationNodes), edges: edges }
}
