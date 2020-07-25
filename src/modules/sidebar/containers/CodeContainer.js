import React, { Fragment } from 'react'
import Card from '../components/Card'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { sort, ascend, prop } from 'ramda'

import CodeEditor from '../modules/codemirror/containers/CodeEditor'

const Code = styled(Card)`
  padding: 1em 1em 20em;
  /* cursor: text; */
`

const FieldNode = styled.span`
  line-height: 1.8em;
  margin: 0;
  font-size: 1em;
  font-family: Fira Code, 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco',
    monospace;
  color: #ddd;
  font-weight: 100;
`

const FieldName = styled.span`
  color: #ec63c5;
  font-weight: 500;
`

const TypeName = styled.span`
  font-style: italic;
`

const CodeContainer = ({ nodes }) => (
  <Code>
    <CodeEditor />
  </Code>
)

const mapStateToProps = ({ nodes, sidebar }) => {
  const modelNodes = nodes.filter(({ type }) => type === 'model')
  const sortedNodes = sort(ascend(prop('name')), modelNodes)
  return { nodes: sortedNodes, sidebar }
}

export default compose(connect(mapStateToProps))(CodeContainer)
