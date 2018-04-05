import React from 'react'
import styled from 'styled-components'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'

import { toggleSidebar } from '../store'

const Toggler = styled.button`
  position: absolute;
  width: 50px;
  height: 50px;
  display: block;
  background: white;
  top: 35px;
  left: -50px;
  color: #333;
  border-radius: 6px 0 0 6px;
  border: 4px solid rgba(38, 25, 58, 0.97);
  border-right: 0;
  font-weight: 700;
  font-size: 1em;
  cursor: pointer;
  opacity: 0.6;
  box-shadow: 0px 9px 10px 0px rgba(0, 0, 0, 0.42);
  &:focus {
    outline: 0;
  }
  &:hover {
    opacity: 1;

    ${({ isOpen }) => !isOpen && `
      color: #ec63c5;
      border-color: #ec63c5;
      width: 55px;
      left: -55px;
      transition: opacity 0.2s, width 0.2s ease-in, left 0.2s ease-in;
    `};
  }
  ${({ isOpen }) => isOpen && `
    opacity: 0.6;
  `};
`;

const TogglerContainer = props => (
  <Toggler { ...props }>{ props.isOpen ? 'X' : '{ }' }</Toggler>
)

const mapStateToProps = ({ sidebar: { isOpen } }) => ({
  isOpen
})

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onClick: ({ dispatch }) => () => {
      dispatch(toggleSidebar())
    }
  })
)(TogglerContainer)