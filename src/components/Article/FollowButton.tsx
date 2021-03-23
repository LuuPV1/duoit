import React, { Component } from 'react';
import { axios } from '../../App';
import { RootState } from '../../shared/service/reducerAction';
import { follow, unfollow } from '../../shared/service/action';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from 'react-router-dom';

export class FollowButton extends Component<any & PropsFromRedux,any> {
    constructor(props:any){
        super(props);

        this.state = {
            article: this.props.article,
            following : this.props.article?.author?.following,
            redirect: false
        }
    }

    addFollowByUserName = (values: any) => {
        let token = localStorage.getItem('realWorldUser');
        if (token){
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            axios.post(`/profiles/${values}/follow`, {})
            .then((response: any) => {
                this.setState({
                    following: true
                })
                this.props.follow();
            }).catch((error: any) => {
                console.log(`Following ${values} failed`);
            })
        }
        else {
            this.setState({
                redirect: true
            })
        }
    }

    unFollowByUserName = (values: any) => {
        let token = localStorage.getItem('realWorldUser');
        if (token){
            axios.delete(`/profiles/${values}/follow`, {})
            .then((response: any) => {
            this.setState({
                following: false
            })
            this.props.unfollow();
            }).catch((error: any) => {
                console.log(`Unfollowing ${values} failed`);
            })
        }
        else {
            this.setState({
                redirect: true
            })
        }
    }

    render(){
        let following = this.props.followState?.follow ? this.props.followState?.follow : this.state.following;
        let article = this.state.article;

        return (
            <>
            {
                this.state.redirect && <Redirect to="/login"/>
            }
            {
                following ? 
                <button className="btn btn-sm btn-secondary" onClick={() => this.unFollowByUserName(article?.author?.username)}>
                    <i className="ion-minus-round"></i>
                    &nbsp;
                    Unfollow {article?.author?.username}
                </button>
                :
                <button className="btn btn-sm action btn-outline-secondary" onClick={() => this.addFollowByUserName(article?.author?.username)}>
                    <i className="ion-plus-round"></i>
                    &nbsp;
                    Follow {article?.author?.username}
                </button>
            }
            </>
        );
    }
} 

export const mapStatetoProps = (rootState: RootState) => {
    return { 
        followState: rootState.reducerFollow,
    }
}

const mapDispatchToProps = {
    follow: follow,
    unfollow: unfollow
};

const connector = connect(mapStatetoProps,mapDispatchToProps);
// store type of connector to type PropsFromRedux which is a variable
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(FollowButton);