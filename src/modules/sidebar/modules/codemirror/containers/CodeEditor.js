import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { buildSchema } from 'graphql'

import onHasCompletion from '../lib/onHasCompletion'
import { updateCodeEditorValue } from '../store'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/dracula.css'
import { serializeSchemaToEditor } from '../lib/serializer'

require('codemirror/addon/hint/show-hint')
require('codemirror/addon/comment/comment')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/edit/closebrackets')
require('codemirror/addon/fold/foldgutter')
require('codemirror/addon/fold/brace-fold')
require('codemirror/addon/search/search')
require('codemirror/addon/search/searchcursor')
require('codemirror/addon/search/jump-to-line')
require('codemirror/addon/dialog/dialog')
require('codemirror/addon/lint/lint')
require('codemirror/keymap/sublime')
// require('codemirror-graphql/hint')
// require('codemirror-graphql/lint')
// require('codemirror-graphql/info')
// require('codemirror-graphql/jump')
require('../lib/hint')
require('codemirror-graphql/mode')

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/

const onKeyUp = (editor, event) => {
  if (AUTO_COMPLETE_AFTER_KEY.test(event.key) && editor) {
    editor.execCommand('autocomplete')
    // const service = new LanguageService({ rawSchema: myGraphQLSchema })
    // debugger
  }
}

// @TODO Unsetup removing listeners
const setupEditor = (cmRef) => (editor) => {
  cmRef.current = editor
  editor.on('hasCompletion', onHasCompletion)
}

function CodeEditor() {
  let cmRef = React.useRef(null)

  const savedSchemaDsl = useSelector((state) => state.sidebarCodeEditor.value)
  const dispatch = useDispatch()
  const setSavedSchemaDsl = useCallback(
    (value) => dispatch(updateCodeEditorValue(value)),
    [dispatch]
  )

  const compiledSchema = useMemo(() => {
    try {
      const schema = buildSchema(savedSchemaDsl)
      console.log(serializeSchemaToEditor(schema))
      return schema
    } catch (error) {}
  }, [savedSchemaDsl])

  const [editorValue, setEditorValue] = useState(savedSchemaDsl)

  const handleBeforeChange = useCallback(
    (editor, data, value) => {
      try {
        // Test if schema is buildable.
        buildSchema(value)

        // Save the valid DSL schema.
        setSavedSchemaDsl(value)

        // @TODO would it be good to give feedback on why is the schema wrong
        // try {
        //   getDiagnostics(value, buildedSchema)
        // } catch (error) {
        //   console.error(error)
        // }

        console.log('-> SCHEMA SAVED!')
      } catch (error) {
        console.error(error)
      }

      setEditorValue(value)
    },
    [setSavedSchemaDsl]
  )

  useEffect(() => {
    cmRef.current.options.hintOptions.schema = compiledSchema
    cmRef.current.options.lint.schema = compiledSchema
    // codemirror.signal(cmRef.current, 'change', cmRef.current)
  }, [compiledSchema, cmRef])

  useEffect(() => {
    cmRef.current.setCursor(0)
  }, [cmRef])

  return (
    <CodeMirror
      editorDidMount={setupEditor(cmRef)}
      value={editorValue}
      onChange={handleBeforeChange}
      onKeyUp={onKeyUp}
      detach={true}
      options={{
        autofocus: false,
        lineNumbers: true,
        tabSize: 2,
        mode: 'graphql',
        theme: 'dracula',
        keyMap: 'sublime',
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        foldGutter: {
          minFoldSize: 4,
        },
        lint: {
          schema: compiledSchema,
        },
        hintOptions: {
          schema: compiledSchema,
          closeOnUnfocus: false,
          completeSingle: false,
        },
        extraKeys: {
          'Ctrl-Space': (editor) => editor.showHint({ completeSingle: true }),
        },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      }}
    />
  )
}

export default CodeEditor
