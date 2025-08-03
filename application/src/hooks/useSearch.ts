import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../Redux-slices/searchSlice/searchSlice';
import { AppDispatch } from '../store';
import searchService from '../api/searchService';
import { SearchResults } from '../types/ideaTypes';
import React from 'react';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ ideas: [], users: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const dispatch: AppDispatch = useDispatch();

  const executeSearch = useCallback(async (currentQuery: string, currentPage: number) => {
    if (!currentQuery.trim()) return;

    setLoading(true);
    try {
      const data = await searchService.searchContent({ query: currentQuery, page: currentPage });
      console.log(data)

      setResults(prev => ({
        ideas: currentPage === 1 ? data.ideas : [...prev.ideas, ...data.ideas],
        users: currentPage === 1 ? data.users : [...prev.users, ...data.users],
      }));

      setHasMore(data.ideas.length > 0 || data.users.length > 0);
      dispatch(openModal());

    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (page > 1 && query) {
      executeSearch(query, page);
    }
  }, [page, query, executeSearch]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setPage(1);
    executeSearch(query, 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  return {
    query,
    setQuery,
    results,
    loading,
    hasMore,
    handleSearch,
    handleKeyDown,
    loadMore,
    handleClose
  };
};