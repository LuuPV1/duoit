import React, {Component} from 'react';
import { axios } from '../../App';
import { ArticeModel } from '../../core/models/Article.model';
import { formatDate } from '../../shared/helper/helper';
import { Link } from 'react-router-dom';
import { Endpoint } from '../../core/constant/endpoint';
import PaginationComponent from '../../shared/components/PaginationComponent';
import ButtonFavorite from './ButtonFavorite';

export class ArticlByTagComponent extends Component<any, any> {
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
        this.getArticleByTag();
    }

    componentDidUpdate(prevprops: any){
        if (this.props.match.params.tag !== prevprops.match.params.tag){
            this.getArticleByTag();
        }
    }

    getArticleByTag = () => {
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
        axios.get(`${Endpoint.get_articles}?limit=${Offset.limit}&offset=${Offset.offset}${this.props.match.params.tag ? '&tag='+this.props.match.params.tag : '' }`)
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

    render(){
        let { curentArticles, page } = this.state;
        return (
            <div> {
                !curentArticles.length && <p>Loading global feed ... </p>
            }
                {
                    curentArticles.map((article:ArticeModel, index:number) => {
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