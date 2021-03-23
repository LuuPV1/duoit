import React, { Component } from 'react';
import { axios } from '../../App';
import { ArticeModel } from '../../core/models/Article.model';
import { Link } from 'react-router-dom';
import  ButtonFavorite from '../home/ButtonFavorite';

interface ArticleState {
  listArticles: ArticeModel[];
}

export class MyArticlesComponent extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      listArticles: []
    };
  }

  componentDidMount() {
    this.getMyAritcles();
  }

  componentWillReceiveProps(){
    this.getMyAritcles();
  }

  getMyAritcles = () => {
    axios.get(`/articles/?author=${this.props.match.params.username}`)
      .then((response: any) => {
        this.setState({
          listArticles: response.data.articles
        });
      })
      .catch((error: any) => {
        console.log(error);
      })
  }

  render() {
    let listArticles = this.state.listArticles;
    return (
      <div>
        {
          listArticles.map((article: any, index: any) => {
            return (
              <div className="article-preview" key={index}>
                <div className="article-meta">
                  <Link to={`/profile/${article.author.username}`}><img alt="img" src={article.author.image} /></Link>
                  <div className="info">
                    <Link to={`/profile/${article.author.username}`} className="author">{article.author.username}</Link>
                    <span className="date">
                      {article.createdAt.toString()}
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
      </div>
    )
  }
}