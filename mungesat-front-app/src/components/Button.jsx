import styled from "styled-components";

const AddButton = styled.button`
  position: relative;
  bottom: 0;
  width: 180px;
  height: 55px;
  border: none;
  border-radius: 5px;
  background-color: var(--primary-bg);
  color: white;

  transition: background-color 250ms, bottom 150ms;

  &:hover {
    background-color: var(--primary-text);
    cursor: pointer;
  }

  &:active {
    bottom: 3px;
  }
`;

const SignButton = styled.button`
  height: 60px;
  background-color: var(--primary-bg);
  color: var(--white);
  box-shadow: 0px 0px 50px -10px var(--primary-bg);
`;

export default AddButton;
export { SignButton };
