import React, { useState } from 'react';

import Select from 'react-select';
import Autosuggest from 'react-autosuggest';

import styles from './TypeAhead.module.scss';

export interface TypeAheadProps {
  // options: Object[];
  options: Array<any>;
  placeholder?: string;
  label?: string;
  isSearchable?: boolean;
}

const TypeAhead = ({ options, placeholder="Search", label="", isSearchable }: TypeAheadProps) => {
  const [suggestions, setSuggestions] = useState(options);
  const [value, setValue] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const selectStyles = {
    indicatorSeparator: () => ({ ...styles, display: 'none'})
  }


  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? options : options.filter(item =>
      item.label.toLowerCase().includes(inputValue)
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions(options);
  };

  const getSuggestionValue = suggestion => suggestion.label;

  const renderSuggestion = (suggestion, {query}) => {
    const index = suggestion.label.toLowerCase().indexOf(query.toLowerCase());
    const match = suggestion.label.slice(index, index + query.length)
    const part = suggestion.label.replace(match, `<span style="font-weight: bold;">${match}</span>`);
    // console.log({ suggestion, query})

    return (
      <div>
        <span dangerouslySetInnerHTML={{__html: part}}>
        </span>
      </div>
    )
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const shouldRenderSuggestions = (value, reason) => {
    return true;
  }

  const renderInputComponent = (inputProps) => {
    const { value } = inputProps;
    const hasValue = value !== '' ? styles.close : styles.caret;

    return(
      <div className={styles.customInput}>
        <label htmlFor={label}>{label}</label>
        <div className={styles.customInputWrapper}>
          <input {...inputProps} id={label} className={hasValue} type="search" />
        </div>
      </div>
    )
  }

  const renderSuggestionsContainer = ({ containerProps, children, query }) => {
      // console.log({ containerProps, children, query});
      // console.log(query.length)
      // console.log({selectedSuggestion});
      // console.log(children?.props)
      // console.log(children ? children.length : 'empty')
      if (query.length === 0) setSelectedSuggestion(null);
      if (children?.props.items.length > 0) {
        return (
          <div {...containerProps} className={styles.customSuggestionsContainer}>
            {children}
          </div>
        )
      } else if (children === null && query.length > 0 && selectedSuggestion === null) {
        return (
          <div {...containerProps} className={styles.noResultsContainer}>
            <span className={styles.noResults} >No Results found.</span>
          </div>
        )
      }
  };

  const onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    // console.log({ suggestion, suggestionValue})
    setSelectedSuggestion(suggestion)
    // console.log({selectedSuggestion})
  }

  const inputProps = {
    placeholder,
    value,
    name: label,
    onChange: onChange
  };

  return (
    <>
      <h2>react-select</h2>
      <Select
        className={styles.reactSelectContainer}
        options={options}
        isSearchable={isSearchable}
        placeholder={placeholder}
        styles={selectStyles}
      />
      <h2>react-autosuggest</h2>
      {/* <label>{label}</label> */}
      <Autosuggest
        className={styles.reactSelectContainer}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        highlightFirstSuggestion={true}
        renderInputComponent={renderInputComponent}
        onSuggestionSelected={onSuggestionSelected}
        // alwaysRenderSuggestions={true}
        theme={styles}
      />
    </>
  );
};

export default TypeAhead;
