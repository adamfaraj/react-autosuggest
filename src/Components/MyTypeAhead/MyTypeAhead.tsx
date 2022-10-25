import React, {  useCallback, useEffect, useState } from 'react'
import caret from '../../assets/images/icons/caret-down.svg'
import close from '../../assets/images/icons/close.svg';

import styles from './MyTypeAhead.module.scss';

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

const MatchComponent = ({ label, match }) => {
  let beginWord = '';
  let endWord = '';
  let index = label.indexOf(match);

  if (index !== 0) {
    beginWord = label.split(match, 1)
    endWord = label.slice(index + match.length);
  }
  if (index === 0) {
    endWord = label.slice(index + match.length);
  }

  return (
    <>
      {beginWord}<span style={{fontWeight: 700,}}>{match}</span>{endWord}
    </>
  )
}

const MyTypeAhead = ({ options, watch, register, fieldName, placeholder="Search", label="", setValue }: TypeAheadProps) => {
  const [suggestions, setSuggestions] = useState(options);
  const [hidden, setHidden] = useState(true);
  const [currentHighlighted, setCurrentHighlighted] = useState(0)
  const [isBackspace, setIsBackspace] = useState(false);
  const name = watch(fieldName);
  const hasValue = name !== '';
  const src = hasValue ? close : caret;

  useEffect(() => {
    // When a user clicks outside of the input
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('click', (e) => {
      const target = e.target as Element;
      if (target.classList.contains('suggestion') || target.classList.contains('input') || target.tagName === 'svg') {
        return;
      } else {
        setHidden(true);
      }
    });
  }, [])

  const onSelect = useCallback(value => {
    setValue(fieldName, value)
    setHidden(true);
  }, [fieldName, setValue])

  const onFocus = () => {
    setHidden(false)
  }

  const onKeyDown = (event) => {
    const { keyCode } = event;

    switch(keyCode) {
      case 40: // ArrowDown
        if (currentHighlighted < suggestions.length - 1 ) {
          setCurrentHighlighted(currentHighlighted + 1)
        }
        setIsBackspace(false);
        break;
      case 38: // ArrowUp
        if (currentHighlighted >= 1) {
          setCurrentHighlighted(currentHighlighted - 1)
        }
        setIsBackspace(false);
        break;
      case 13: // Enter
        onSelect(suggestions[currentHighlighted].value);
        setIsBackspace(false);
        break;
      case 8: // Backspace
        if (event.target.value === '') {
          setSuggestions(options);
        }
        setCurrentHighlighted(0)
        setHidden(false);
        setIsBackspace(true);
        break;
      default:
        setIsBackspace(false);
    }
  }

  const onInput = (event) => {
    const query = event.target.value;
    if (query !== '') {
      const sug = findMatch(query);
      setSuggestions(sug);
    }
    if (query === '') {
      setSuggestions(options);
    }
  }

  const onClose = () => {
    setHidden(false)
    if (hasValue) {
      setValue(fieldName, '')
      setSuggestions(options);
    }
  }

  const findMatch = (query) => {
    const matches = (label) => {
      const index = label.toLowerCase().indexOf(query.toLowerCase());
      if (index === -1) return;
      const match = label.slice(index, index + query.length)
      return match;
    }

    let elements = [];
    if (isBackspace) {
      options.forEach(suggestion => {
        const match = matches(suggestion.value);
          if (match) {
            const { label, value } = suggestion;
            elements = [...elements, {
              value,
              label,
              match
            }]
          }
      })
    } else {
        suggestions.forEach(suggestion => {
          const match = matches(suggestion.value);
            if (match) {
              const { label, value } = suggestion;
              elements = [...elements, {
                value,
                label,
                match
              }]
            }
        })
    }

    return elements;
  }

  return (
    <div className={styles.suggestionsWrapper}>
      <label htmlFor={fieldName}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          id={fieldName}
          autoComplete='off'
          className={`input`}
          name={label}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          value={name}
          {...register(fieldName)}
          onInput={onInput}
        />
        <img src={src} alt="icon" onClick={onClose}/>
      </div>
      <ul className={styles.suggestionsContainer} hidden={hidden}>
        {suggestions.length > 0 ?
          suggestions.map((suggestion, i) => {
            const { label, match, value } = suggestion;
            return (
              <li
                key={value}
                value={value}
                onClick={() => onSelect(value)}
                className={`suggestion ${currentHighlighted === i ? styles.highlighted : ''} `}
              >
                {match ? <MatchComponent match={match} label={value} /> : label }
              </li>)}) :
            <li className={styles.noResults}>No Results Found</li>
          }
      </ul>
    </div>
  )
}

export default MyTypeAhead;