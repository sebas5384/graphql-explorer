import React from 'react'
import Sidebar from '../components/Sidebar'
import CodeContainer from './CodeContainer'
import TogglerContainer from './TogglerContainer'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'

const Wrapper = styled.section`
  overflow: auto;
  padding: 0.9em 1.3em;
  height: 100%;
  box-sizing: border-box;
  transition: opacity 0.3s, padding-right 0.3s, padding-left 0.3s cubic-bezier(0.86, 0, 0.07, 1);
  ${({ isOpen }) => !isOpen && `
    width: 0;
    padding-right: 0;
    padding-left: 0;
    opacity: 0;
  `};
`;

const SidebarContainer = ({ isOpen }) => (
  <Sidebar isOpen={ isOpen }>
    <TogglerContainer />
    <Wrapper isOpen={ isOpen }>
      <CodeContainer />
    </Wrapper>
  </Sidebar>
)

const mapStateToProps = ({ sidebar: { isOpen } }) => ({
  isOpen
})

export default compose(
  connect(mapStateToProps),
)(SidebarContainer)