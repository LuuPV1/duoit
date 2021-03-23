import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { axios } from './App';

interface HeaderState {
    userProps?: User | null;
    token: string;
    user: User | undefined;
}

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

export class Header extends Component<any, HeaderState> {
    constructor(props: any) {
        super(props);

        this.state = {
            token: '',
            userProps: this.props.userData,
            user: undefined
        }

    }

    autoLogin = (): string => {
        let token = localStorage.getItem('realWorldUser');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            this.setState({
                token: token
            })
            return token;
        }
        else {
            axios.defaults.headers.common['Authorization'] = '';
            this.setState({
                token: ''
            })
            return '';
        }
    }

    componentDidMount() {
        if (localStorage.getItem('realWorldUser')) {
            this.getCurrentUser();
        }
    }

    componentWillReceiveProps() {
        this.forceUpdate(() => {
            this.autoLogin();
            this.getCurrentUser();
        });
    }

    getCurrentUser = () => {
        let token = this.autoLogin();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            axios.get('user')
                .then((response: any) => {
                    this.setState({
                        user: response.data.user
                    })
                })
                .catch((error: any) => {
                    console.log(error);
                    return null;
                });
        }
    }

    render() {
        let token = this.state.token;
        let image = this.state.user?.image;
        return (
            <nav className="navbar navbar-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">conduit</Link>
                    <ul className="nav navbar-nav pull-xs-right">
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="">Home</NavLink>
                        </li>
                        {
                            !token &&
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Sign In</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Sign Up</NavLink>
                                </li>
                            </>

                        }
                        {
                            token &&
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/editor">
                                        <i className="ion-compose"></i>&nbsp;New article
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/settings">&nbsp;Setting</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={`/profile/${this.state.user?.username}`}>
                                    <img alt="imgProfile" className="user-pic" src={image}/>
                                        {this.state.user?.username}
                                    </NavLink>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        );
    }
}