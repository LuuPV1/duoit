import React, { Component } from 'react';
import { ArticeModel, CommentModel } from '../../../core/models/Article.model';
import { axios } from '../../../App';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../shared/helper/helper';

interface UserArticleState {
    articles: ArticeModel[];
    comments: CommentModel[];
    commentContent: string;
    currentUser: any;
}

interface CommentInterface {
    author: {
        bio: string
        following: boolean
        image: string
        username: string
    }
    body: string
    createdAt: string
    id: number
    updatedAt: string
}

export class CommentList extends Component<any, UserArticleState>{
    constructor(props: any) {
        super(props);
        this.state = {
            articles: [],
            comments: [],
            commentContent: '',
            currentUser: undefined
        }
    }

    getCommentList = () => {
        let slug = this.props.slug;
        axios.get(`/articles/${slug}/comments`)
            .then((response: any) => {
                this.setState({ comments: response.data.comments });
            })
            .catch((error: any) => {
                console.log(error)
            });
    }

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

    postComment = (values: any) => {
        let token = localStorage.getItem('realWorldUser');
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        let slug = this.props.slug;
        let comment = values.comment;
        axios.post(`/articles/${slug}/comments`, {
            "comment": {
                "body": comment
            }
        })
            .then((response: any) => {
                this.getCommentList();
            })
            .catch((error: any) => {
                console.log(error)
            })
    }

    deleteThisComment = (id: number) => {
        let slug = this.props.slug;
        let token = localStorage.getItem('realWorldUser');
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        axios.delete(`/articles/${slug}/comments/${id}`)
            .then((response: any) => {
                this.getCommentList();
            })
            .catch((error: any) => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.getCurrentUser();
        this.getCommentList()
    }

    render() {
        let currentUser = this.state.currentUser;

        return (
            <>
                <Formik
                    initialValues={{
                        comment: ''
                    }}
                    onSubmit={this.postComment}
                    enableReinitialize
                >
                    {
                        values => (
                            <Form className="card comment-form">
                                <div className="card-block">
                                    <Field id="comment" name="comment" className="form-control" as="textarea" placeholder="Write a comment..." />
                                    <ErrorMessage component='div' name="comment" className="text-danger" />
                                    <br />
                                </div>
                                <div className="card-footer">
                                    <img alt="userImg" src={currentUser?.image} className="comment-author-img" />
                                    <button className="btn btn-sm btn-primary" type="submit">Post Comment</button>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
                {
                    this.state.comments.map((comment: CommentInterface, index: number) => {
                        return (
                            <div key={comment.id} className="card">
                                <div className="card-block">
                                    <p className="card-text">{comment.body}</p>
                                </div>
                                <div className="card-footer">
                                    <Link to={`/profile/${comment.author.username}`} className="comment-author">
                                        <img alt="authorImg" src={comment.author.image} className="comment-author-img" />
                                    </Link>
                                    &nbsp;
                                    <Link to={`/profile/${comment.author.username}`} className="comment-author">{comment.author.username}</Link>
                                    <span className="date-posted">{formatDate(comment.updatedAt)}</span>
                                    {   
                                        currentUser?.username === comment.author.username && 
                                        <span className="mod-options">
                                            <i className="ion-trash-a" onClick={() => this.deleteThisComment(comment.id)}></i>
                                        </span>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </>
        );
    }
}