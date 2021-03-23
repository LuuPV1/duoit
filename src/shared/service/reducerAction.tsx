import { combineReducers } from "redux";

interface favoriteInterface {
    type: 'FAVORITE' | 'UNFAVORITE';
    payload: {
        favorite: boolean,
        text: string,
        count: number
    }
}

interface followInterface {
    type: 'FOLLOW' | 'UNFOLLOW';
}

export const reducerFavorite = (state: any = {favorite: false}, action: favoriteInterface) => {
    switch(action.type){
        case 'FAVORITE':
            return { favorite: action.payload.favorite, text: action.payload.text, count: action.payload.count };
        case 'UNFAVORITE':
            return { favorite: action.payload.favorite, text: action.payload.text, count: action.payload.count };
        default:
            return state;
    }
}

export const reducerFollow = (state: any = {follow: false}, action: followInterface) => {
    switch(action.type){
        case 'FOLLOW':
            return { follow: true };
        case 'UNFOLLOW':
            return { follow: false };
        default:
            return state;
    }
}

export const rootReducer = combineReducers({reducerFollow, reducerFavorite});
export type RootState = ReturnType<typeof rootReducer>