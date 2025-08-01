import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, UserCircle } from 'lucide-react';
import { useSearch } from '../../../hooks/useSearch';
import { selectUser } from '../../../hooks/auth/userSlice';
import Modal from './modal';
import IdeaCard from '../../idea-card/idea-card';
import IdeaCardSkeleton from '../../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../../noIdeas/noIdeas';
import LoadingSpinner from '../../noIdeas/spinners';
import Skeleton from 'react-loading-skeleton';
import '../navbar.scss';
import './searchModal.scss';

const SearchComponent: React.FC = () => {
  const { query, setQuery, results, loading, hasMore, loadMore, handleClose } = useSearch();
  const currentUser = useSelector(selectUser);
  const isModalOpen = useSelector((state: any) => state.search.isOpen);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      loadMore();
    }
  };

  return (
    <div>
      <div className="search-cont">
        <input
          type="search"
          placeholder="Search ideas and creators..."
          className="searchBar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="mag-glass" />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div onScroll={handleScroll} className="search-modal-content">
          <h2 className='search-heading'>Search Results for "{query}"</h2>
          <div className='search-results-grid'>
            <section>
              <h3>Ideas</h3>
              {results.ideas.length > 0 && results.ideas.map((idea) => (
                <IdeaCard key={idea._id} {...idea} commentsCount={idea.comments.length} viewer={currentUser?.username || ''} />
              ))}
              {loading && Array.from({ length: 3 }).map((_, i) => <IdeaCardSkeleton key={i} />)}
              {!loading && results.ideas.length === 0 && <NoIdeasPlaceholder dataStat='' />}
            </section>
            <section>
              <h3>Creators</h3>
              {results.users.length > 0 && results.users.map((user) => (
                <Link key={user._id} to={`/userinfo/profile/${user.username}`} className="creator-link-search">
                  <UserCircle />
                  <h4>{user.username}</h4>
                </Link>
              ))}
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="creator-link-search" data-status="loading">
                  <Skeleton circle width={35} height={35} />
                  <h4><Skeleton width={80} /></h4>
                </div>
              ))}
              {!loading && results.users.length === 0 && <p>No creators found.</p>}
            </section>
          </div>
          {loading && <LoadingSpinner />}
          {!hasMore && <p className="end-of-results">No more results</p>}
        </div>
      </Modal>
    </div>
  );
};

export default SearchComponent;
