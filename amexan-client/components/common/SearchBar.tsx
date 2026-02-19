import React, { useState, useEffect } from 'react';
import Input from './Input';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
  style?: React.CSSProperties;
}

export default function SearchBar({ onSearch, placeholder = 'Search...', debounceMs = 300, style }: SearchBarProps) {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(term);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [term, debounceMs, onSearch]);

  return <Input placeholder={placeholder} value={term} onChange={e => setTerm(e.target.value)} style={style} />;
}