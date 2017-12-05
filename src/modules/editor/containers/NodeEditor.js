import React from 'react'
import { compose, branch, renderNothing, withState, withHandlers, lifecycle } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import isHotKey from 'is-hotkey'

import { getSelectedNode, updateNodeFields } from '../store'
import { deserializeFields, serializeFields } from '../lib/serializers'
import { fieldIsInvalid } from '../lib/helpers';

const Wrapper = styled.section``

const Card = styled.section`
  background: ${ ({ transparent }) => !transparent && '#FAFAFA' };
  box-shadow: 0px 8px 14px 0px rgba(0,0,0,0.42);
  border-radius: 4px;
  min-width: 22em;
  max-width: 32em;
  display: flex;
  margin-bottom: 0.7em;
  flex-direction: column;
  overflow: hidden;
`

const Header = styled.h1`
  font-size: 2em;
  font-family: Arial;
  margin: 0;
  color: #871AE8;
  line-height: 1.3em;
  padding: 0.3em 0.6em 0.4em;

  span {
    font-weight: normal;
    font-style: italic;
  }
`

const EditorContainer = styled.section`
  background: rgba(38, 25, 58, 0.97);
  max-height: 15em;
  padding: 0.9em 1.3em;
  overflow: auto;

  span[data-slate-zero-width='true'] {
    position: relative;
    top: 3px;
  }
`

const FieldName = styled.span`
  color: #ec63c5;
  font-weight: 600;
`

const FieldNode = styled.p`
  line-height: 1.8em;
  margin: 0;
  font-size: 1em;
  font-family: Fira Code, 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace;
  color: #ddd;
  font-weight: 100;
`

const renderNode = props => {
  switch (props.node.type) {
    case 'field': return <FieldNode { ...props } />
  }
}

const renderMark = props => {
  switch (props.mark.type) {
    case 'type': return <FieldName { ...props } />
  }
}

const NodeEdit = ({ node, value, handleOnChange, handleOnKeyDown }) => (
  <Wrapper>
    <Card>
      <Header><span>type:</span> { node.name }</Header>
    </Card>
    <Card transparent>
      <EditorContainer>
        <Editor
          placeholder='-- insert fields here --'
          value={ value }
          onChange={ handleOnChange}
          onKeyDown={ handleOnKeyDown }
          renderMark={ renderMark }
          renderNode={ renderNode }
          autoFocus={ true }
          spellCheck={ false }
          tabIndex={ 0 }
        />
      </EditorContainer>
    </Card>
  </Wrapper>
)

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'field',
        nodes: []
      }
    ]
  }
})


const mapStateToProps = ({ nodes, edges }) => {
  const node = getSelectedNode(nodes)
  if (!node) return {}
  return { node, edges }
}

const componentWillReceiveProps = function ({ node: nextNode, setValue, value, edges: nextEdges }) {
  const { node: prevNode, edges: prevEdges } = this.props

  if (nextNode.name === prevNode.name && nextEdges.length === prevEdges.length) {
    return
  }
  
  if (!nextNode.fields.length) return setValue(initialValue)
  
  // Serialize new value from node.fields[] only when a new node is selected.
  const nextValue = Value.fromJSON(deserializeFields(nextNode.fields))
  setValue(nextValue)
}

const componentWillMount = function () {
  const { node, setValue } = this.props
  
  if (!node.fields.length) return setValue(initialValue)

  const value = Value.fromJSON(deserializeFields(node.fields))
  setValue(value)
}

const handleOnChange = ({ node, dispatch, setValue }) => ({ value }) => {
  // Deserialize value to [ { name, type }, { name, type } ].
  const fields = serializeFields(value.toJS())
  
  // Avoid creating invalid types.
  if (fields.some(fieldIsInvalid)) return setValue(value)

  // Dispatch an action to save the unserialized value to node.fields[].
  // @TODO [ASAP] Find better perfomance, for ex. debaunce the dispatching.
  dispatch(updateNodeFields({ node, fields }))
  setValue(value)
}

const handleOnKeyDown = (props) => (event, change, editor) => {
  if (isHotKey('return')(event)) {
    event.preventDefault()
    change.removeMark('type')
  }
  
  // Fixes a bug in slate (maybe) with peer marks after deleting the first char.
  if (
    change.value.texts.get(0).toJS().leaves[0].text.length === 0
    && change.value.marks.toJS().length > 0
  ) {
    change.removeMark('type')
  }
  
  if (
    event.key === ':'
    && change.value.texts.get(0).toJS().leaves[0].text.split(':').length === 1
  ) {
    event.preventDefault()
    change
      .removeMark('type')
      .insertText(':')
      .splitInline()
  }

  if (change.value.texts.get(0).toJS().leaves[0].text.match(/^.*: $/)) {
    change.addMark('type')
  }
}

export default compose(
  connect(mapStateToProps),
  withState('value', 'setValue', initialValue),
  branch(({ node }) => (typeof node === 'undefined' || node.type !== 'model'), renderNothing),
  withHandlers({ handleOnChange, handleOnKeyDown }),
  lifecycle({ componentWillReceiveProps, componentWillMount })
)(NodeEdit)