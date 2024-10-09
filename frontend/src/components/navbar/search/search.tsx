import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from './modal'; // Import your modal component
import { Search } from 'lucide-react';
import './../navbar.scss';

interface Idea {
  _id: string;
  title: string;
  description: string;
}

interface User {
  _id: string;
  username: string;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMoreIdeas, setHasMoreIdeas] = useState<boolean>(true);
  const [hasMoreUsers, setHasMoreUsers] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const limit = 10;

  // Search logic encapsulated in a function
  const handleSearch = useCallback(async (isNewSearch = false) => {
    try {
      setLoading(true);

      const response = await axios.get('http://localhost:5000/idea/explore/search', {
        params: { query, page, limit },
      });

      const newIdeas: Idea[] = response.data.ideas;
      const newUsers: User[] = response.data.users;
      console.log(response.data);

      if (isNewSearch) {
        setIdeas(newIdeas);
        setUsers(newUsers);
        setHasMoreIdeas(newIdeas.length > 0);
        setHasMoreUsers(newUsers.length > 0);
      } else {
        setIdeas((prev) => [...prev, ...newIdeas]);
        setUsers((prev) => [...prev, ...newUsers]);
        setHasMoreIdeas(newIdeas.length > 0);
        setHasMoreUsers(newUsers.length > 0);
      }

      setLoading(false);
      setIsModalOpen(true); // Open modal when search results are fetched
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
    }
  }, [query, page]);

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle key down for searching
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPage(1); // Reset to the first page for a new search
      handleSearch(true); // Trigger a new search on Enter key
    }
  };
  useEffect(() => {
    setPage(1); // Always reset to page 1 when the query changes
  }, [query]);

  // Handle infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 2 && !loading && (hasMoreIdeas || hasMoreUsers)) {
      setPage((prevPage) => prevPage + 1); // Load next page when scrolled to bottom
    }
  };

  // Fetch more results when page changes
  useEffect(() => {
    if (page > 1) {
      handleSearch(); // Trigger search on page change
    }
  }, [page, handleSearch]);

  return (
    <div>
      <div className="search-cont">
        <input
          type="search"
          placeholder="Search ideas..."
          className="searchBar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Search onClick={() => handleSearch(true)} className="mag-glass" />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div onScroll={handleScroll} style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div>
            <h3>Ideas</h3>
            {ideas.length > 0 ? (
              ideas.map((idea) => (
                <div key={idea._id}>
                  <h4>{idea.title}</h4>
                  <p>{idea.description}</p>
                </div>
              ))
            ) : (
              <p>No ideas found</p>
            )}
          </div>

          <div>
            <h3>Creators</h3>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user._id}>
                  <h4>{user.username}</h4>
                </div>
              ))
            ) : (
              <p>No creators found</p>
            )}
          </div>

          {loading && <p>Loading more results...</p>}
          {!hasMoreIdeas && !hasMoreUsers && <p>No more results to display.</p>}
        </div>
      </Modal>
    </div>
  );
};

export default SearchComponent;
