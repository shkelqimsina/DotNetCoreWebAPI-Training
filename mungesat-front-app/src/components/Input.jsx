import styled from "styled-components";

const Input = styled.input`
  height: 60px;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  transition: all 400ms ease;

  &:focus {
    border: 0 !important;
    outline: none !important;
    box-shadow: none !important;
    background-color: var(--primary-bg);
    caret-color: var(--secondary-text);
  }

  &::placeholder {
    color: var(--primary-text) !important;
  }
`;

export default Input;
