import React, { Component } from 'react';
import { deletePostFromFavorite, addPostToFavorite } from '../../shared/helper/helper';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

export const RemoveFavoriteBtn = styled.button`
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
`;

export class ButtonFavorite extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            isSubmiting: false,
            article: this.props.article
        }
    }

    render() {
        let article = this.state.article
        let favorited = this.state.article.favorited;
        return (
            <div>
                {
                    favorited &&
                    <RemoveFavoriteBtn className={`btn btn-outline-primary btn-sm pull-xs-right ${this.state.isSubmiting && 'disabled'}`}
                        onClick={
                            () => {
                                let token = localStorage.getItem('realWorldUser');
                                if (token){
                                    this.setState({isSubmiting: true})
                                    deletePostFromFavorite(article.slug)
                                    .then((response) => {
                                        let article = response.data.article;
                                        this.setState({
                                            article: article
                                        })
                                        this.setState({isSubmiting: false})
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        this.setState({isSubmiting: false})
                                    })
                                }
                            }
                        }>
                        <i className="ion-heart"></i>{article.favoritesCount}
                    </RemoveFavoriteBtn>
                }
                {
                    !favorited &&
                    <button className={`btn btn-outline-primary btn-sm pull-xs-right ${this.state.isSubmiting && 'disabled'}`}
                        onClick={
                            () => {
                                let token = localStorage.getItem('realWorldUser');
                                if (token){
                                    this.setState({isSubmiting: true})
                                    addPostToFavorite(article.slug).then((response) => {
                                        let article = response.data.article;
                                        this.setState({
                                            article: article
                                        })
                                        this.setState({isSubmiting: false})
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        this.setState({isSubmiting: false})
                                    })
                                }
                                else {
                                    let history = this.props.history;
                                    history.push('/login')
                                }
                            }}>
                        <i className="ion-heart"></i>{article.favoritesCount}
                    </button>
                }
            </div>
        )
    }
}

export default withRouter(ButtonFavorite);