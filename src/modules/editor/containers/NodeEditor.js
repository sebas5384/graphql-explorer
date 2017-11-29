import React from 'react'
import { compose, branch, renderNothing, withState, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import isHotKey from 'is-hotkey'

import { getSelectedNode } from '../store'

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
          value={ value }
          onChange={ handleOnChange}
          onKeyDown={ handleOnKeyDown }
          renderMark={ renderMark }
          renderNode={ renderNode }
        />
      </EditorContainer>
    </Card>
  </Wrapper>
)

const mapStateToProps = ({ nodes }) => ({
  node: getSelectedNode(nodes)
})

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'field',
        nodes: [
          {
            kind: 'text',
            leaves: [
              {
                text: 'id',
              },
              {
                text: ': ',
              },
              {
                text: 'ID!',
                marks: [
                  {
                    type: "type"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
})

const handleOnChange = ({ setValue }) => ({ value }) => setValue(value)

const handleOnKeyDown = (props) => (event, change, editor) => {
  if (isHotKey('return')(event)) {
    event.preventDefault()
    change.removeMark('type')
  }
  
  // Fixes a bug in slate with peer marks after deleting the first char.
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
      .insertText(': ')
      .splitInline()
      .addMark('type')
  }

  if (change.value.texts.get(0).toJS().leaves[0].text.match(/^.*: $/)) {
    change.addMark('type')
  }

  // @TODO: HORROR !!!
  // if (
  //   event.key.match(/[A-Za-z]/) 
  //   && change.value.texts.get(0).toJS().leaves[0].text.match(/^.*\:$/)
  //   && change.value.texts.toJS().leaves.length === 1
  //   && change.value.activeMarks.toJS().length === 0
  // ) {
  //   change.removeMark('type').splitInline().addMark('type')
  // }
}

export default compose(
  connect(mapStateToProps),
  branch(({ node }) => (typeof node === 'undefined' || node.type !== 'model'), renderNothing),
  withState('value', 'setValue', initialValue),
  withHandlers({ handleOnChange, handleOnKeyDown })
)(NodeEdit)