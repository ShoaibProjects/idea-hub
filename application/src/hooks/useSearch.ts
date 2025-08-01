import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../Redux-slices/searchSlice/searchSlice';
import { AppDispatch } from '../store';
import searchService from '../api/searchService';
import { SearchResults } from '../types/ideaTypes';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ ideas: [], users: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const dispatch: AppDispatch = useDispatch();

  const executeSearch = useCallback(async (currentQuery: string, currentPage: number) => {
    if (!currentQuery) return;

    setLoading(true);
    try {
      const data = await searchService.searchContent({ query: currentQuery, page: currentPage });
      
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
    const handler = setTimeout(() => {
      if (query) {
        setPage(1); 
        executeSearch(query, 1);
      } else {
        setResults({ ideas: [], users: [] });
        dispatch(closeModal());
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, executeSearch, dispatch]);

  useEffect(() => {
    if (page > 1) {
      executeSearch(query, page);
    }
  }, [page, query, executeSearch]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  const handleClose = () => {
    dispatch(closeModal());
  };

  return { query, setQuery, results, loading, hasMore, loadMore, handleClose };
};
