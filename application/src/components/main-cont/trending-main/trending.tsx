import { useSelector } from 'react-redux';
import { selectUser } from '../../../hooks/auth/userSlice';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';
import { useTrendingIdeas } from '../../../hooks/useTrendingIdeas';
import IdeaCard from '../../idea-card/idea-card';
import IdeaCardSkeleton from '../../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../../noIdeas/noIdeas';
import LoadingSpinner from '../../noIdeas/spinners';
import NoMoreIdeas from '../../noIdeas/noMoreIdeas';
import { FaFireAlt } from "react-icons/fa";
import './trending.scss';

function TrendingIdeas() {
  const {
    ideas,
    loading,
    hasMore,
    period,
    setPeriod,
    category,
    setCategory,
    error,
  } = useTrendingIdeas();

  const user = useSelector(selectUser);
  const categories = useSelector(selectCategories);

  // Derived state to make JSX cleaner
  const showSkeletons = loading && ideas.length === 0;
  const showIdeas = ideas.length > 0;
  const showNoIdeas = !loading && ideas.length === 0 && !error;
  const showLoadingSpinner = loading && ideas.length > 0;
  const showNoMoreIdeas = !hasMore && ideas.length > 0;

  return (
    <div className='trend-cont'>
      <div className="filters sticky">
        <h2><FaFireAlt size={30} /> Trending Ideas</h2>
        <div className='filter-cont1'>
          <label>Time Period: </label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} disabled={loading}>
            <option value="">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
          </select>
        </div>
        <div className='filter-cont2'>
          <label>Category: </label>
          <select className='select-class' value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
            <option value="">All Categories</option>
            {(categories as string[]).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="ideas-container">
        {showSkeletons && Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />)}

        {showIdeas && ideas.map((idea) => (
          <IdeaCard
            key={idea._id}
            _id={idea._id}
            title={idea.title}
            description={idea.description}
            creator={idea.creator}
            upvotes={idea.upvotes}
            downvotes={idea.downvotes}
            category={idea.category}
            comments={idea.comments}
            commentsCount={idea.comments.length}
            viewer={user?.username || ''}
            tags={idea.tags}
          />
        ))}

        {showLoadingSpinner && <LoadingSpinner />}
        {showNoIdeas && <NoIdeasPlaceholder dataStat={ideas.length % 2 == 0 ? 'main' : ''} />}
        {showNoMoreIdeas && <NoMoreIdeas dataStat={ideas.length % 2 == 0 ? 'main' : ''} />}
      </div>
    </div>
  );
}

export default TrendingIdeas;
