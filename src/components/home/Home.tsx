import React, { Component } from 'react';
import { NavLink, Switch, Redirect, Route, Link } from 'react-router-dom';
import ArticleComponent from './ArticleComponent';
import FeedsComponent from './FeedsComponent';
import { axios } from '../../App';
import { ArticlByTagComponent } from './ArticleByTagComponent';

export class Home extends Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = { 
            isAuthen: 'false',
            tags: new Array<string>(),
            selectedTag: ''
        }
    }

    componentWillReceiveProps(props: any) {
        const isAuthen = localStorage.getItem('isAuthen');
        this.setState({ isAuthen: isAuthen })
    }
    componentDidMount() {
        const isAuthen = localStorage.getItem('isAuthen');
        this.setState({ isAuthen: isAuthen });
        this.getTagList();
    }

    componentWillUnmount() {
    }

    getTagList = () => {
        axios.get(`tags`)
        .then((response: any) => {
            this.setState({
                tags: response.data.tags
            });
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

    selectTag = (tag: string) => {
        this.setState({
            selectedTag: tag
        })
    }

    render() {
        let tags = this.state.tags;
        let path = this.props.location.pathname;
        return (
            <div className="home-page">
                <div className="banner">
                    <div className="container">
                        <h1 className="logo-font">conduit</h1>
                        <p>A place to share your knowledge.</p>
                    </div>
                </div>
                <div className="container page">
                    <div className="row">

                        <div className="col-md-9">
                            <div className="feed-toggle">
                                <ul className="nav nav-pills outline-active">
                                    {
                                        localStorage.getItem('realWorldUser') && 
                                        <li className="nav-item">
                                            <NavLink activeClassName="active" className="nav-link" to="/home/your-feed">Your Feed</NavLink>
                                        </li>
                                    }
                                    <li className="nav-item">
                                        <NavLink activeClassName="active" className="nav-link" to="/home/global-feed">Global Feed</NavLink>
                                    </li>
                                    {
                                        path.includes('/home/article-by-tag/') && 
                                        <li className="nav-item">
                                            <NavLink activeClassName="active" className="nav-link" to={`/home/global-feed/${this.state.selectedTag}`}># {this.state.selectedTag}</NavLink>
                                        </li>
                                    }
                                </ul>
                            </div>

                            <Switch>
                                <Redirect exact from="/home" to="/home/global-feed" />
                                <Route path="/home/global-feed" render={(props) => <ArticleComponent {...props} />} />
                                <Route path="/home/your-feed" render={(props) => <FeedsComponent {...props} />} />
                                <Route path="/home/article-by-tag/:tag" render={(props) => <ArticlByTagComponent {...props} />} />
                            </Switch>

                        </div>

                        <div className="col-md-3">
                            <div className="sidebar">
                                <p>Popular Tags</p>

                                <div className="tag-list">
                                    {
                                        tags.map((tag:string, index: number) => {
                                            return <Link key={tag+index} to={`/home/article-by-tag/${tag}`} onClick={() => this.selectTag(tag)} className="tag-pill tag-default">{tag}</Link>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}