// Action creator
export const favorite = (value: any) => {
    return {
        type: 'FAVORITE',
        payload: {
            favorite: true,
            text: 'Unfavorite',
            count: value
        }
    }
}

export const unfavorite = (value: any) => {
    return {
        type: 'UNFAVORITE',
        payload: {
            favorite: false,
            text: 'Favorite',
            count: value
        }
    }
}

export const follow = (value: any) => {
    return {
        type: 'FOLLOW'
    }
}

export const unfollow = (value: any) => {
    return {
        type: 'UNFOLLOW'
    }
}