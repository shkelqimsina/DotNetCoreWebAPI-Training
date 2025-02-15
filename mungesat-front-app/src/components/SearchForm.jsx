import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa"; // Import search icon

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--light-gray);
  padding: 10px;
  width: 100%;
  max-width: 600px; /* Adjust width */
`;

const SearchIcon = styled(FaSearch)`
  color: var(--secondary-text);
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 16px;
  color: #333;

  &::placeholder {
    color: var(--secondary-text);
  }
`;

const SearchBar = () => {
  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder="Search for a student by name or email"
      />
    </SearchContainer>
  );
};

export default SearchBar;
