import React, { useState } from 'react';

import Autosuggest from 'react-autosuggest';

import styles from './TypeAhead.module.scss';


export interface TypeAheadProps {
  options: Array<any>;
  placeholder?: string;
  label?: string;
  isSearchable?: boolean;
  register: any;
  fieldName: string;
  setValue: any;
  watch: any;
}

const TypeAhead = ({ options, watch, register, fieldName, placeholder="Search", label="", isSearchable, setValue }: TypeAheadProps) => {
  const [suggestions, setSuggestions] = useState(options);

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

    return (
      <div>
        <span dangerouslySetInnerHTML={{__html: part}}>
        </span>
      </div>
    )
  };

  const onChange = (_event, { newValue }) => {
    console.log()
    setValue(fieldName, newValue);
  };
  
  const shouldRenderSuggestions = () => {
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
  const name = watch(fieldName);
  const renderSuggestionsContainer = ({ containerProps, children, query }) => {
    if (children?.props.items.length > 0) {
      return (
        <div {...containerProps} className={styles.customSuggestionsContainer}>
            {children}
          </div>
        )
      } else if (children === null && query.length > 0 && name === null) {
        return (
          <div {...containerProps} className={styles.noResultsContainer}>
            <span className={styles.noResults} >No Results found.</span>
          </div>
        )
      }
    };
    
    const onSuggestionSelected = (_event, { suggestionValue }) => {
      setValue(fieldName, suggestionValue);
  }

  const inputProps = {
    placeholder,
    value: name,
    name: label,
    onChange: onChange,
    ...register(fieldName)
  };

  return (
    <>
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
