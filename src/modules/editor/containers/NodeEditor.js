import React from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getSelectedNode } from '../store'

const Wrapper = styled.section``

const Card = styled.section`
  background: #FAFAFA;
  box-shadow: 0px 8px 14px 0px rgba(0,0,0,0.42);
  border-radius: 4px;
  padding: 0.6em 1.5em 0.7em;
  width: 22em;
  display: flex;
  margin-bottom: 0.7em;
`

const Header = styled.h1`
  font-size: 2em;
  font-family: Arial;
  margin: 0;
  color: #871AE8;
  line-height: 1.3em;
  span {
    font-weight: normal;
    font-style: italic;
  }
`

const SubHeader = styled.h2`
  font-size: 1.7em;
  font-family: Arial;
  margin: 0;
  color: #444;
`

const NodeEdit = ({ node }) => (
  <Wrapper>
    <Card>
      <Header><span>type:</span> { node.name }</Header>
    </Card>
    <Card>
      <SubHeader>Fields</SubHeader>
    </Card>
  </Wrapper>
)

const mapStateToProps = ({ nodes }) => ({
  node: getSelectedNode(nodes)
})

export default compose(
  connect(mapStateToProps)
)(NodeEdit)
