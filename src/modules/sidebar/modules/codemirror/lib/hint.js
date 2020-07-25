import CodeMirror from 'codemirror'
import {
  hintList,
  objectValues,
  getTypeInfo,
  canUseDirective,
} from 'graphql-language-service-interface'
import {
  isIntrospectionType,
  isInputType,
  isInputObjectType,
  DirectiveLocation,
} from 'graphql'
import { RuleKinds } from 'graphql-language-service'
import { flatState } from './helpers'

CodeMirror.registerHelper('hint', 'graphql', (editor, options) => {
  const schema = options.schema
  if (!schema) {
    return
  }

  const cur = editor.getCursor()
  const token = editor.getTokenAt(cur)

  const rawResults = getSuggestions(token, schema)

  // console.log({
  //   kind,
  //   names: getSuggestionsForFieldNames(token, typeInfo, schema),
  // })

  const tokenStart =
    token.type !== null && /"|\w/.test(token.string[0])
      ? token.start
      : token.end
  const results = {
    list: rawResults.map((item) => ({
      text: item.label,
      type: item.type,
      description: item.documentation,
      isDeprecated: item.isDeprecated,
      deprecationReason: item.deprecationReason,
    })),
    from: { line: cur.line, column: tokenStart },
    to: { line: cur.line, column: token.end },
  }

  if (results && results.list && results.list.length > 0) {
    results.from = CodeMirror.Pos(results.from.line, results.from.column)
    results.to = CodeMirror.Pos(results.to.line, results.to.column)
    CodeMirror.signal(editor, 'hasCompletion', editor, results, token)
  }

  return results
})

const isNotIntrospectionType = (f) => !isIntrospectionType(f)
const isNotInputType = (field) => !isInputObjectType(field)

const isInputValueInArgs = (state) => {
  const flatedState = flatState(state)
  return (
    flatedState.includes(RuleKinds.ARGUMENTS_DEF) &&
    flatedState.includes(RuleKinds.INPUT_VALUE_DEF)
  )
}

// Helper functions to get suggestions for each kinds
// @TODO Features:
//                [X] Input arguments.
//                [x] Directives arguments.
//                [x] Directives locations.
//                [x] Filter possible field types in Input types.
//                [] Multiline comments.
//                [] Machine fucking learning.
function getSuggestions(token, schema) {
  // Get state
  const state =
    token.state.kind === 'Invalid' ? token.state.prevState : token.state

  // relieve flow errors by checking if `state` exists
  if (!state || !schema) {
    return []
  }

  const kind = state.kind
  const step = state.step
  const typeInfo = getTypeInfo(schema, token.state)

  console.log({ state, typeInfo, schema })

  if (kind === RuleKinds.DOCUMENT) {
    return hintList(token, [
      { label: 'type' },
      { label: 'schema' },
      { label: 'extend' },
      { label: 'enum' },
      { label: 'scalar' },
      { label: 'interface' },
      { label: 'union' },
      { label: 'input' },
      { label: 'directive' },
    ])
  }

  if (kind === RuleKinds.EXTEND_DEF) {
    return hintList(token, [{ label: 'type' }])
  }

  const isDefiningInputValueInArgs = isInputValueInArgs(state)

  console.log(state.rule, 'RULES')

  // Defining the returning type of a field.
  if (
    // foo: S
    (kind === RuleKinds.NAMED_TYPE &&
      !isDefiningInputValueInArgs &&
      state.needsAdvance) ||
    // foo:
    (kind === RuleKinds.FIELD_DEF &&
      !isDefiningInputValueInArgs &&
      !state.needsAdvance &&
      step === 3) ||
    // foo: []
    (kind === RuleKinds.LIST_TYPE &&
      !isDefiningInputValueInArgs &&
      step === 1 &&
      !state.needsAdvance) ||
    // step is used to ignore when is defining the field but not the returned type.
    (kind === 'OperationTypeDef' && step > 1 && !state.needsAdvance)
  ) {
    const typeMap = schema.getTypeMap()
    const graphqlTypes = objectValues(typeMap)
      .filter(isNotIntrospectionType)
      .filter(isNotInputType)

    return hintList(
      token,
      graphqlTypes.map((field) => ({
        label: field.name,
        type: field.type,
        documentation: field.description ?? undefined,
        isDeprecated: field.isDeprecated,
        deprecationReason: field.deprecationReason,
      }))
    )
  }

  if (
    isDefiningInputValueInArgs &&
    (!state.needsAdvance || kind === RuleKinds.NAMED_TYPE)
  ) {
    return getSuggestionsForInputValues(token, state, schema)
  }

  // Directives.
  if (kind === RuleKinds.DIRECTIVE) {
    return getSuggestionsForDirective(token, state, schema)
  }

  if (
    (kind === RuleKinds.DIRECTIVE_DEF && !state.needsAdvance && step === 5) ||
    (kind === 'DirectiveLocation' && state.needsAdvance)
  ) {
    return getSuggestionsForDirectiveLocations(token)
  }

  if (
    kind === RuleKinds.ARGUMENTS &&
    state.prevState.kind === RuleKinds.DIRECTIVE
  ) {
    return getSuggestionsForDirectiveArgs(token, typeInfo)
  }

  // console.log({ kind, step })
  // if (kind === RuleKinds.DIRECTIVE_DEF && step === 5) {
  //   console.log('LIST DIRECTIVES')
  // }

  if (kind === RuleKinds.OBJECT_TYPE_DEF && state.needsAdvance === false) {
    return hintList(token, [{ label: 'implements' }])
  }

  return []
}

function getSuggestionsForDirective(token, state, schema) {
  if (!state.prevState && !state.prevState.kind) {
    return []
  }

  const directives = schema
    .getDirectives()
    .filter((directive) => canUseDirective(state.prevState, directive))

  return hintList(
    token,
    directives.map((directive) => ({
      label: directive.name,
      documentation: directive.description || '',
    }))
  )
}

function getSuggestionsForInputValues(token, state, schema) {
  if (!state.prevState && !state.prevState.kind) {
    return []
  }

  const typeMap = schema.getTypeMap()
  const graphqlTypes = objectValues(typeMap)
    .filter(isInputType)
    .filter(isNotIntrospectionType)

  return hintList(
    token,
    graphqlTypes.map((item) => ({
      label: item.name,
      documentation: item.description || '',
    }))
  )
}

function getSuggestionsForDirectiveLocations(token) {
  const locations = [
    DirectiveLocation.SCHEMA,
    DirectiveLocation.SCALAR,
    DirectiveLocation.OBJECT,
    DirectiveLocation.FIELD_DEFINITION,
    DirectiveLocation.INTERFACE,
    DirectiveLocation.UNION,
    DirectiveLocation.ENUM,
    DirectiveLocation.ENUM_VALUE,
    DirectiveLocation.INPUT_OBJECT,
    DirectiveLocation.ARGUMENT_DEFINITION,
    DirectiveLocation.INPUT_FIELD_DEFINITION,
  ]
  return hintList(
    token,
    locations.map((item) => ({
      label: item,
      // documentation: item.description || '',
    }))
  )
}

function getSuggestionsForDirectiveArgs(token, typeInfo) {
  return hintList(
    token,
    typeInfo.argDefs.map((item) => ({
      label: item.name,
      documentation: item.description || '',
    }))
  )
}
