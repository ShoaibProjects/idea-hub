export interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: string[];
  commentsCount?: number;
  viewer? : string;
}

export interface TrendingIdeasParams {
  page: number;
  limit?: number;
  period?: string;
  category?: string;
}

export interface SearchUser {
  _id:string;
  username: string;
}

export interface SearchResults {
  ideas: Idea[];
  users: SearchUser[];
}

export interface SearchParams {
  query: string;
  page: number;
  limit?: number;
}