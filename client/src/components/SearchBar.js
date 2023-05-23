import React, { useState } from "react";
import AdvancedSearchBar from "./AdvancedSearchBar";
import BasicSearchBar from "./BasicSearchBar";

const SearchBar = () => {
  const [advancedSearch, setAdvancedSearch] = useState(false);

  const onChangeSearchBarType = () => {
    setAdvancedSearch((prev) => !prev);
  };

  return advancedSearch ? (
    <AdvancedSearchBar
      onChangeSearchBar={onChangeSearchBarType}
      disableBasic={false}
    />
  ) : (
    <BasicSearchBar onChangeSearchBar={onChangeSearchBarType} />
  );
};

export default SearchBar;
