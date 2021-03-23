import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { axios } from '../../App';
import ProfileComponent from './ProfileComponent';
import { MyArticlesComponent } from './MyArticlesComponent';

export interface User {
    bio: any;
    createdAt: string;
    email: string;
    id: number
    image: string;
    token: string;
    updatedAt: string;
    username: string;
}

export class Profile extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            username: '',
            token: '',
            userProps: this.props.userData,
            profile: {},
            listArticle: [],
            user: '',
            follow: undefined
        }
    }

    getCurrentUser = () => {
        setTimeout(() => {
            axios.get(`/profiles/${this.props.match.params.username}`)
                .then((response: any) => {
                    this.setState({
                        profile: response.data.profile,
                        follow: response.data.profile?.following
                    })
                    return response.data.profile;
                }).catch((error: any) => {
                    console.log(error);
                });
        }, 0);
    }

    getUser = () => {
        if (localStorage.getItem('realWorldUser')){
            axios.get('user')
            .then((response: any) => {
                this.setState({
                    username: response.data.user.username
                })
                return response.data.user;
            })
            .catch((error: any) => {
                console.log(error);
                return null;
            });
        }
    }

    getListArticle = (values: any) => {
        axios.get(`/articles?author=${this.props.match.params.username}`)
            .then((response: any) => {
                this.setState({
                    listArticle: response.data.articles
                })
                return response.data.user;
            })
            .catch((error: any) => {
                console.log(error);
                return null;
            });
    }

    addFollowByUserName = (values: any) => {
        let token = localStorage.getItem('realWorldUser');
        if (token){
            axios.post(`/profiles/${values}/follow`, {})
            .then((response: any) => {
                this.setState({
                    follow: true
                })
            }).catch((error: any) => {
                console.log(`Following ${values} failed`);
            })
        }
        else {
            let history = this.props.history;
            history.push('/login');
        }
    }

    unFollowByUserName = (values: any) => {
        let token = localStorage.getItem('realWorldUser');
        if (token){
            axios.delete(`/profiles/${values}/follow`, {})
            .then((response: any) => {
            this.setState({
                follow: false
            })
            }).catch((error: any) => {
                console.log(`Unfollowing ${values} failed`);
            })
        }
        else {
            let history = this.props.history;
            history.push('/login');
        }
    }

    getListArticleFavorite = (values: any) => {
        axios.get(`/articles/?favorited=${this.props.match.params.username}`)
            .then((response: any) => {
                this.setState({
                    listArticle: response.data.articles,
                });
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    componentDidMount() {
        this.getCurrentUser();
        //this.getListArticle(null);
        this.getListArticleFavorite(null);
        this.getUser();
        // this.getUserProfileByUserName();
    }

    componentWillReceiveProps() {
        this.getCurrentUser();
    }

    render() {
        let user = this.state.profile;
        return (
            <div>
                <div className="profile-page">
                    <div className="user-info">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-md-10 offset-md-1">
                                    <img alt="userImg" src={user?.image} className="user-img" />
                                    <h4>{user?.username}</h4>
                                    <p>{user?.bio}</p>
                                    {
                                        user?.username === this.state.username ?
                                            <NavLink className="btn btn-sm btn-outline-secondary action-btn" to="/settings"><i className="ion-gear-a"> Edit Profile Settings</i></NavLink>
                                            :
                                            <button className="btn btn-sm btn-outline-secondary action-btn" id='follow' 
                                                onClick={this.state.follow ? () =>  this.unFollowByUserName(user?.username) : () => this.addFollowByUserName(user?.username)}
                                            >
                                            {this.state.follow ?  <i className="ion-minus-round"> Unfollow {user?.username}</i> : <i className="ion-plus-round"> Follow {user?.username}</i>}
                                            </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-md-10 offset-md-1">
                                <div className="articles-toggle">
                                    <ul className="nav nav-pills outline-active">
                                        <li className="nav-item">
                                            <NavLink activeClassName='active' exact={true} className="nav-link" to={`/profile/${this.props.match.params.username}`}>My Articles</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink activeClassName='active' className="nav-link" to={`/profile/${this.props.match.params.username}/favorites`}>Favorited Articles</NavLink>
                                        </li>
                                    </ul>
                                    <Switch>
                                        <Route exact path={`/profile/:username`} component={MyArticlesComponent} />
                                        <Route path={`/profile/:username/favorites`} component={ProfileComponent} />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}