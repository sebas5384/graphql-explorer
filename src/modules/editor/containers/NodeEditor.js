import React from 'react'
import { compose, branch, renderNothing } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'

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
  color: #ec63c5;
  padding: 0.9em 1.3em;
  overflow: auto;

  p {
    line-height: 1.8em;
    margin: 0;
    font-size: 1em;
    font-family: 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace;

    strong {
      color: #ddd;
    }
  }
`

const NodeEdit = ({ node }) => (
  <Wrapper>
    <Card>
      <Header><span>type:</span> { node.name }</Header>
    </Card>
    <Card transparent>
      <EditorContainer>
        <p><strong>id:</strong> ID!</p>
        <p><strong>name:</strong> String!</p>
        <p><strong>cdaLot:</strong> CdaLot</p>
        <p><strong>vaccine:</strong> Vaccine</p>
        <p><strong>company:</strong> Company</p>
        <p><strong>applicationPlace:</strong> ApplicationPlace</p>
        <p><strong>shotOrder:</strong> ShotOrder</p>
        <p><strong>unities:</strong> [Unity]!</p>
      </EditorContainer>
    </Card>
  </Wrapper>
)

const mapStateToProps = ({ nodes }) => ({
  node: getSelectedNode(nodes)
})

export default compose(
  connect(mapStateToProps),
  branch(({ node }) => (typeof node === 'undefined'), renderNothing)
)(NodeEdit)
