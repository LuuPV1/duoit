import React, { Component } from 'react';
import { axios } from '../../App';
import { Link } from 'react-router-dom';
import { formatDate } from '../../shared/helper/helper';
import { CommentList } from './Comment/CommentList';
import { ArticeModel } from '../../core/models/Article.model';
import  ButtonFavoriteWithText  from './ButtonFavoriteWithText';
import  FollowButton  from './FollowButton';

export class UserArticleDetail extends Component<any, any>{
  constructor(props: any) {
    super(props);

    this.state = {
      article: undefined,
      commentList: [],
      currentUser: undefined
    }
  }

  componentDidMount() {
    if (localStorage.getItem('realWorldUser')){
      this.getCurrentUser();
    }
    this.getArticleDetail();
  }

  getArticleDetail = async () => {
    let id = (this.props.match?.params as any).id;
    axios.defaults.headers.common['Authorization'] = '';
    axios.get(`/articles/${id}`)
      .then((response: any) => {
        this.setState({ article: response.data.article });
      })
      .catch((error: any) => {
        console.log(error)
      });
  }

  handleDeleteArticle = (slug: string) => {
    let { history } = this.props;
    if (localStorage.getItem('realWorldUser')){
      let token = localStorage.getItem('realWorldUser');
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      axios.delete(`/articles/` + slug)
      .then((response: any) => {
        history.push('/home');
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      })
    }
  };

  getCurrentUser = () => {
    let token = localStorage.getItem('realWorldUser');
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    axios.get(`/user`)
      .then((response: any) => {
        this.setState({
          currentUser: response.data.user
        })
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  render() {
    let article: ArticeModel = this.state.article;
    let currentUser = this.state.currentUser;

    return (
      <div>

        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{article?.title}</h1>
              <div className="article-meta">
                <Link to={`/profile/${article?.author?.username}`}><img alt="authorImg" src={article?.author?.image} /></Link>
                <div className="info">
                  <Link to={`/profile/${article?.author?.username}`} className="author">{article?.author?.username}</Link>
                  <span className="date">{formatDate(article?.createdAt)}</span>
                </div>
                {
                  currentUser?.username === article?.author?.username ?
                    <>
                      <Link to={`/editor/${article?.slug}`} className="btn btn-sm btn-outline-secondary">
                        <i className="ion-plus-round"></i>
                          &nbsp;
                          Edit article
                        </Link>
                        &nbsp;&nbsp;
                        <button className="btn btn-sm btn-outline-danger" onClick={() => this.handleDeleteArticle(article?.slug)}>
                        <i className="ion-trash-a"></i>
                          &nbsp;
                          Delete article
                        </button>
                    </>
                    :
                    <>
                      <FollowButton article={article}/>
                      &nbsp;&nbsp;
                      <ButtonFavoriteWithText article={article}/>
                    </>
                }
              </div>
            </div>
          </div>
          <div className="container page">
            <div className="row article-content">
              <div className="col-md-12">
                <p>
                  {article?.body}
                </p>
              </div>
            </div>
            <hr />
            <div className="article-actions">
              <div className="article-meta">
                <Link to={`/profile/${article?.author?.username}`}><img alt="authorImg" src={article?.author?.image} /></Link>
                <div className="info">
                  <Link to={`/profile/${article?.author?.username}`} className="author">{article?.author?.username}</Link>
                  <span className="date">{formatDate(article?.createdAt.toString())}</span>
                </div>
                {
                  currentUser?.username === article?.author?.username ?
                    <>
                      <Link to={`/editor/${article?.slug}`} className="btn btn-sm btn-outline-secondary">
                        <i className="ion-plus-round">
                        </i>
                        &nbsp;
                        Edit article
                      </Link>
                      &nbsp;&nbsp;
                      <button className="btn btn-sm btn-outline-danger" onClick={() => this.handleDeleteArticle(article.slug)}>
                        <i className="ion-trash-a"></i>
                        &nbsp;
                        Delete article
                      </button>
                    </>
                    :
                    <>
                      <FollowButton article={article}/>
                      &nbsp;&nbsp;
                      <ButtonFavoriteWithText article={article}/>
                    </>
                }
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2">
                {
                  localStorage.getItem('realWorldUser') ? 
                  <CommentList slug={(this.props.match?.params as any).id} />
                  :
                  <p>
                    <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add comments on this article.
                  </p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
