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
  display: ${(props) => (props.isOpen ? "block" : "none")};
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

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        Add filter <Arrow>▼</Arrow>
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>
        <DropdownItem>Option 1</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
        <DropdownItem>Option 3</DropdownItem>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default Dropdown;
