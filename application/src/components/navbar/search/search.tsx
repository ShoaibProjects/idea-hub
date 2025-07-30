import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from './modal'; // Import your modal component
import { Search, UserCircle } from 'lucide-react';
import '../navbar.scss';
import IdeaCard from '../../idea-card/idea-card';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../hooks/auth/userSlice';
import { Link } from 'react-router-dom';
import './searchModal.scss';
import NoIdeasPlaceholder from '../../noIdeas/noIdeas';
import LoadingSpinner from '../../noIdeas/spinners';
import IdeaCardSkeleton from '../../cardSkeleton/cardSkeleton';
import Skeleton from 'react-loading-skeleton';
import { useDispatch} from 'react-redux';
import { closeModal, openModal } from '../../../Redux-slices/searchSlice/searchSlice';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: string[]; escription: string;
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
  //  
  const limit = 10;
  const ourUser = useSelector(selectUser);

  const isModalOpen = useSelector((state: any) => state.search.isOpen);
  const dispatch = useDispatch();

  // Search logic encapsulated in a function
  const handleSearch = useCallback(async (isNewSearch = false) => {
    try {
      setLoading(true);

      const response = await axios.get('https://idea-hub-app.vercel.app/idea/explore/search', {
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
      dispatch(openModal());  // Open modal when search results are fetched
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
    }
  }, [query, page]);

  // Close modal handler
  const handleCloseModal = () => {
    dispatch(closeModal());
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div onScroll={handleScroll} style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <h2 className='search-heading'>Search Results</h2>
          <div className='search-modal'>
            <div>
              <h3>Ideas</h3>
              {loading ? (
                // Show skeletons while loading
                Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />)
              ) : ideas.length > 0 ? (
                ideas.map((idea) => (
                  <div key={idea._id} className="idea-items">
                    <IdeaCard
                      id={idea._id}
                      title={idea.title}
                      content={idea.description}
                      creator={idea.creator}
                      upvotes={idea.upvotes}
                      downvotes={idea.downvotes}
                      category={idea.category.join(', ')}
                      comments={idea.comments.length}
                      viewer={ourUser.username ? ourUser.username : ''}
                    />
                  </div>
                ))
              ) : (
                <NoIdeasPlaceholder dataStat='' />
              )}
            </div>

            <div>
              <h3 className={users.length==0 || loading ?'creator-h3':''}>Creators</h3>
              {loading ? (
                // Show skeletons while loading
                Array.from({ length: 5 }).map((_, index) => <div key={index} className="creator-link-search" data-status="loading">
                  <Skeleton circle width={35} height={35} />
                  <h4><Skeleton width={60} height={20} /></h4>
                </div>)
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id}>

                    <Link to={`/userinfo/profile/${user.username}`} className="creator-link-search">
                      <UserCircle></UserCircle>
                      <h4>{user.username}</h4>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="no-creators">
                  <UserCircle className="no-creators-icon" size={50} />
                  <p className="no-creators-message">No creators found</p>
                  <p className="no-creators-suggestion">Try a different search term or adjust your filters.</p>
                </div>
              )}
            </div>
          </div>

          {loading && <LoadingSpinner />}
          {!hasMoreIdeas && !hasMoreUsers && <div className="end-of-results">
            <hr className="end-divider" />
            <UserCircle className="end-icon" size={40} />
            <p className="end-message">No more results to display</p>
          </div>
          }
        </div>
      </Modal>
    </div>
  );
};

export default SearchComponent;
