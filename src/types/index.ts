export interface IPost {
  _id: string;
  text: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  likedByMe?: boolean;
  translatedText?: string;

  createdAt: string;
  isRepost: boolean;
  originalPost?: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}