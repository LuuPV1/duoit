import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { axios } from '../../App';

export class Editor extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      articleId: this.props.match.params.slug ? this.props.match.params.slug : '',
      user: null,
      token: '',
      userProps: this.props.userData,
      listArticle: {},
      article:{}
    }

    let history = this.props.history
    if(!localStorage.getItem('realWorldUser')){
      history.push('/login');
    }

  }

  
  componentDidMount() {
    this.getArticleBySlug(null);
  }

  getArticleBySlug = (values: any) => {
    if (this.props.match.params.slug){
      axios.get('/articles/' + this.props.match.params.slug)
      .then((response: any) => {
        this.setState({
          article: response.data.article
        })
      })
      .catch((error: any) => {
        console.log(error);
      });
    }
  }

  createArticle = (values: any) => {
    let history = this.props.history;
    let title = values.title;
    let description = values.description;
    let body = values.body;
    let tagList = [values.tagList];
    axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('realWorldUser')}`;
    if (!this.state.articleId) {
      axios.post(`/articles`, {
        "article": {
          "title": title,
          "description": description,
          "body": body,
          "tagList": tagList
        }
      }).then((response: any) => {
        history.push('/home');
      }).catch((error: any) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    } else {
      axios.put(`/articles/` + this.state.articleId, {
        "article": {
          "title": title,
          "description": description,
          "body": body,
          "tagList": tagList
        }
      }).then((response: any) => {
        history.push('/home');
      }).catch((error: any) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    }

  }

  validateArticle = (values: any) => {
    let error: any = {};
    for (let key in values) {
      if (values[key].length === 0) {
        error[key] = `${key} is required`;
      }
    }
    return error;
  }

  render() {
    // console.log('okk ' + this.state.article.title);
    let title = this.state.article.title;
    let description = this.state.article.description;
    let body = this.state.article.body;
    let tagList = this.state.article.tagList;
    // let user = this.state.user;
    // let token = this.state.token;
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <Formik
                initialValues={{
                  title: title || '',
                  description: description || '',
                  body: body || '',
                  tagList: tagList || ''
                }}
                onSubmit={this.createArticle}
                validate={this.validateArticle}
                enableReinitialize
              >
                {
                  values => (
                    <Form>
                      <div className="form-group">
                        <Field id="title" className="form-control form-control-lg" name="title" type="text" placeholder="Article Title" />
                        <ErrorMessage component='div' name="title" className="text-danger" />
                      </div>
                      <div className="form-group">
                        <Field id="description" className="form-control form-control-lg" name="description" type="text" placeholder="What's this article about?" />
                        <ErrorMessage component='div' name="description" className="text-danger" />
                      </div>
                      <div className="form-group">
                        <Field id="body" as="textarea" className="form-control form-control-lg" name="body" placeholder="Write your article (in markdown)" />
                        <ErrorMessage component='div' name="body" className="text-danger" />
                      </div>
                      <div className="form-group">
                        <Field id="tagList" className="form-control form-control-lg" name="tagList" type="text" placeholder="Enter tags (seperate by ,)" />
                        <ErrorMessage component='div' name="tagList" className="text-danger" />
                      </div>
                      <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
                        {this.props.match.params.slug ? 'Edit article':'Publish article'}
                      </button>
                    </Form>
                  )
                }
              </Formik>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Editor)