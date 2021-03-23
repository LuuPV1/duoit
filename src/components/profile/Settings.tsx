import React, { Component } from 'react';
import { axios } from '../../App';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { User } from '../../Header';

interface SettingState {
    currentUser: User | undefined;
    errorState: string[];
}

export class Settings extends Component<any, SettingState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentUser: undefined,
            errorState: new Array<string>()
        }
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    updateUserData = (values: any) => {
        let history = this.props.history;
        let currentUser = this.state.currentUser;
        let email = values.email;
        let bio = values.bio;
        let image = values.image;
        axios.defaults.headers.common['Authorization'] = 'Token ' + currentUser?.token;
        axios.put(`/user`, {
            "user": {
                "email": email,
                "bio": bio,
                "image": image
            }
        })
            .then((response: any) => {
                localStorage.setItem('realWorldUser', response.data.user.token);
                this.props.passUserData(response.data.user);
                history.push(`/profile/${currentUser?.username}`);
            })
            .catch((error: any) => {
                let errorState = this.state.errorState;
                if (error.response) {
                    console.log(error.response);

                    // Get error returned from API and assign to state to show to user
                    let errorMessage = error.response.data.errors;
                    for (let key in errorMessage) {
                        let message = `${key} ${errorMessage[key][0]}`;
                        if (!errorState.includes(message)) {
                            errorState.push(message);
                        }
                    }
                    this.setState({ errorState: errorState });
                    console.log(errorState);

                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            })
    }

    validateSetting = (values: any) => {
        let error: any = {};
        for (let key in values) {
            if (values[key].length === 0) {
                if (key !== 'password') {
                    error[key] = `${key} is required`;
                }
            }
        }
        return error;
    }

    getCurrentUser = () => {
        let token = localStorage.getItem('realWorldUser');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            axios.get('/user')
                .then((response: any) => {
                    this.setState({
                        currentUser: response.data.user
                    })
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
        else {
            let history = this.props.history;
            history.push('/home');
        }
    }

    logout = () => {
        let history = this.props.history;
        localStorage.removeItem('realWorldUser');
        axios.defaults.headers.common['Authorization'] = '';
        this.props.passUserData(null);
        history.push('/home')
    }

    render() {
        let currentUser = this.state.currentUser;
        let errors = this.state.errorState;

        return (
            <div className="settings-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">Your Settings</h1>
                            <ul className="error-messages">
                                {
                                    errors.map((error: string, index: number) => {
                                        return <li key={error + index}>{error}</li>
                                    })
                                }
                            </ul>
                            <Formik
                                initialValues={{
                                    image: currentUser?.image || '',
                                    name: currentUser?.username || '',
                                    bio: currentUser?.bio || '',
                                    email: currentUser?.email || '',
                                    password: '',
                                }}
                                onSubmit={this.updateUserData}
                                validate={this.validateSetting}
                                enableReinitialize
                            >
                                {
                                    values => (
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="image">Image</label>
                                                <Field id="image" name="image" className="form-control form-control-lg" type="text" placeholder="Image URL" />
                                                <ErrorMessage component='div' name="image" className="text-danger" />
                                                <br />
                                                {values.values.image && <img alt="profileImg" width="100" height="100" src={values.values.image} />}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Name</label>
                                                <Field id="name" name="name" className="form-control form-control-lg" type="text" placeholder="Your Name" />
                                                <ErrorMessage component='div' name="name" className="text-danger" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="bio">Bio</label>
                                                <Field id="bio" name="bio" className="form-control form-control-lg" type="text" placeholder="Short bio about you" />
                                                <ErrorMessage component='div' name="bio" className="text-danger" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <Field id="email" name="email" className="form-control form-control-lg" type="email" placeholder="Email" />
                                                <ErrorMessage component='div' name="email" className="text-danger" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Password</label>
                                                <Field id="password" name="password" className="form-control form-control-lg" type="password" placeholder="New password" />
                                                <ErrorMessage component='div' name="password" className="text-danger" />
                                            </div>
                                            <div className="form-group" style={{textAlign: 'end'}}>
                                                <button className="btn btn-lg btn-primary" type="submit">Update</button>
                                            </div>
                                        </Form>
                                    )
                                }
                            </Formik>
                            <hr/>
                            <button className="btn btn-outline-danger" type="button" onClick={this.logout}>Logout</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}