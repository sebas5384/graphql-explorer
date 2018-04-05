import styled from 'styled-components'

const SideBar = styled.section`
  display: block;
  width: auto;
  height: 83%;
  border-radius: 0 4px 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
  background: rgba(38, 25, 58, 0.97);
  ${({ isOpen }) => `box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.42);`};
`;

export default SideBar