import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: transparent;
  color: var(--secondary-text);
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px;

  &:hover {
    color: #aaa;
  }
`;

const Arrow = styled.span`
  font-size: 14px;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  list-style: none;
  padding: 5px;
  margin: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  display: ${({isOpen}) => (isOpen ? "block" : "none")};
`;

const DropdownItem = styled.li`
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray);

  &:hover {
    background: #f1f1f1;
  }
`;

const Dropdown = ({main, option1, option2, option3}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {main} <Arrow>▼</Arrow>
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>
        <DropdownItem>{option1}</DropdownItem>
        <DropdownItem>{option2}</DropdownItem>
        <DropdownItem>{option3}</DropdownItem>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default Dropdown;
