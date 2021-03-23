import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { axios } from '../../App';
import { ArticeModel } from '../../core/models/Article.model';
import { formatDate } from '../../shared/helper/helper';
import { Endpoint } from '../../core/constant/endpoint';
import PaginationComponent from '../../shared/components/PaginationComponent';
import { Pagination } from '../../core/models/Pagination.model';
import ButtonFavorite from './ButtonFavorite';

export interface ArticleState {
    articles: ArticeModel[];
    curentArticles: ArticeModel[];
    articlesCount: number;
    page: Pagination;
}

export default class ArticleComponent extends Component<any, ArticleState> {

    constructor(props: any) {
        super(props);

        this.state = {
            articles: [],
            curentArticles: [],
            articlesCount: 0,
            page: { totalItems: 0, currentPage: 1, pageSize: 10 },
        };
    }

    componentDidMount() {
        this.getArticle();
    }

    getArticle = () => {
        axios.get(Endpoint.get_articles+`${this.props.match.params.tag ? '?tag='+this.props.match.params.tag : '' }`)
            .then((response: any) => {
                if (!response.data || response.data.lenght === 0) return;
                this.setState({
                    articles: response.data.articles,
                    articlesCount: response.data.articles.articlesCount,
                    page: { totalItems: response.data.articlesCount, currentPage: 1, pageSize: 10 },
                });
                this.fetchDataEachPage({ limit: 10, offset: 0 });
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    fetchDataEachPage = (Offset?: any) => {
        if (!Offset) {
            return;
        }
        axios.get(`${Endpoint.get_articles}?limit=${Offset.limit}&offset=${Offset.offset}`)
            .then((response: any) => {
                if (!response.data || response.data.lenght === 0) return;
                this.setState({
                    curentArticles: response.data.articles
                });
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    handlePageChange = (currentPage: number) => {
        this.setState({
            page: { ...this.state.page, currentPage: currentPage, pageSize: 10 },
        });
        this.fetchDataEachPage({ limit: 10, offset: (currentPage - 1) * 10 });
    };

    getPageNumber = (totalItems: number, itemPerPages: number) => {
        let pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemPerPages); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    render() {
        let { curentArticles, page } = this.state;
        return (
            <div> {
                !curentArticles.length && <p>Loading global feed ... </p>
            }
                {
                    curentArticles.map((article: ArticeModel, index) => {
                        return (
                            <div className="article-preview" key={index}>
                                <div className="article-meta">
                                    <Link to={`/profile/${article.author.username}`}><img alt="img" src={article.author.image} /></Link>
                                    <div className="info">
                                        <Link to={`/profile/${article.author.username}`} className="author">{article.author.username}</Link>
                                        <span className="date">
                                            {formatDate(article.createdAt.toString())}
                                        </span>
                                    </div>
                                    <ButtonFavorite article={article}/>
                                </div>
                                <Link to={`/articles/${article.slug}`} className="preview-link">
                                    <h1>{article.title}</h1>
                                    <p>{article.description}</p>
                                    <span>Read more...</span>
                                </Link>
                            </div>
                        );
                    })
                }
                <PaginationComponent
                    page={page}
                    pageNumbers={this.getPageNumber(page.totalItems, page.pageSize)}
                    onPageChange={this.handlePageChange}
                />
            </div>
        )
    }
}
