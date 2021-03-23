import React, { Component } from 'react';
import { RemoveFavoriteBtn } from '../home/ButtonFavorite';
import { deletePostFromFavorite, addPostToFavorite } from '../../shared/helper/helper';
import { favorite, unfavorite } from '../../shared/service/action';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../shared/service/reducerAction';
import { Redirect } from 'react-router-dom';

class ButtonFavoriteWithText extends Component<any & PropsFromRedux, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            article: this.props.article,
            isSubmiting: false,
            redirect: false
        }
    }

    render() {
        let article = this.state.article;
        let favorited = this.props.favoriteState.favorite ? this.props.favoriteState.favorite : this.state.article?.favorited;

        return (
            <>
            {this.state.redirect && <Redirect to='/login' />}
            {
                favorited ? 
                <RemoveFavoriteBtn className="btn btn-sm btn-bg-primary" 
                    onClick={
                        () => {
                            let token = localStorage.getItem('realWorldUser');
                            if (token){
                                this.setState({isSubmiting: true})
                                deletePostFromFavorite(article?.slug)
                                .then((response) => {
                                    let article = response.data.article;
                                    this.setState({
                                        article: article,
                                    })
                                    this.props.unfavorite(this.state.article?.favoritesCount)
                                    this.setState({isSubmiting: false})
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.setState({isSubmiting: false})
                                })
                            }
                        }
                    }
                >
                    <i className="ion-heart"></i>
                    &nbsp;
                    Unfavorite article { this.props.favoriteState.count ? this.props.favoriteState.count : article?.favoritesCount}
                </RemoveFavoriteBtn>
                :
                <button className="btn btn-sm btn-outline-primary"
                onClick={
                    () => {
                        let token = localStorage.getItem('realWorldUser');
                        if (token){
                            this.setState({isSubmiting: true})
                            addPostToFavorite(article?.slug).then((response) => {
                                let article = response.data.article;
                                this.setState({
                                    article: article,
                                })
                                this.setState({isSubmiting: false})
                                this.props.favorite(this.state.article?.favoritesCount)
                            })
                            .catch(error => {
                                console.log(error);
                                this.setState({isSubmiting: false})
                            })
                        }
                        else {
                            this.setState({redirect: true}); 
                        }
                    }}
                >
                    <i className="ion-heart"></i>
                    &nbsp;
                    Favorite article { this.props.favoriteState.count ? this.props.favoriteState.count : article?.favoritesCount}
                </button>
            }
            </>
        )
    }
}

export const mapStatetoProps = (rootState: RootState) => {
    return { 
        favoriteState: rootState.reducerFavorite,
    }
}

const mapDispatchToProps = {
    favorite: favorite,
    unfavorite: unfavorite
};

const connector = connect(mapStatetoProps,mapDispatchToProps);
// store type of connector to type PropsFromRedux which is a variable
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(ButtonFavoriteWithText);
