export interface ArticeRespond {
  articles: ArticeModel;
  articlesCount: number;
}

export interface ArticeModel {
    title: string;
    slug: string;
    body: string;
    createdAt: string;
    updateAt: string;
    tagList: string[];
    description: string;
    author: {
        username: string;
        bio: string;
        image: string;
        following: boolean;
    };
    favorited: boolean;
    favoritesCount: number;
}

export interface CommentModel {
    id: number,
    createdAt: string,
    updatedAt: string,
    body: string,
    author: {
        username: string,
        bio: string,
        image: string,
        following: boolean
    }
}

