import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { axios } from '../../App';

interface SignUptate { 
    errorState: string[]; // list of error returned by API when signing up  
}

export class SignUp extends Component<any, SignUptate> {
    constructor(props: any) {
        super(props);

        this.state = {
            errorState: new Array<string>()
        }
    }

    // {name: "shxsjxsxbsbxhsbxsxs", email: "email@sbhbhxbhsx.xsxsxsxsx", password: "11111111"}
    signUp = (values: any) => {
        let history = this.props.history;
        let name = values.name;
        let email = values.email;
        let password = values.password;
        axios.post(`/users`, {
            user: {
                username: name,
                email: email,
                password: password
            }
        })
        .then((response: any) => {
            history.push('/home')
        })
        .catch((error: any) => {
            let errorState = this.state.errorState;
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                // Get error returned from API and assign to state to show to user
                let errorMessage = error.response.data.errors;
                for(let key in errorMessage){
                    let message = `${key} ${errorMessage[key][0]}`;
                    if (!errorState.includes(message)){
                        errorState.push(message);
                    }
                }
                this.setState({errorState: errorState});

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

    validateSignUp = (values: any) => {
        let error: any = {};
        for (let key in values) {
            if (values[key].length === 0) {
                error[key] = `${key} is required`;
            }
        }
        return error;
    }

    render() {
        let errorState = this.state.errorState;
        return (
            <div>
                <div className="auth-page">
                    <div className="container page">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">
                                    Sign Up
                                </h1>
                                <p className="text-xs-center">
                                    <Link to='/login'>Have an account?</Link>
                                </p>

                                <ul className="error-messages">
                                    {
                                        errorState.map((error: string, index: number) => {
                                            return <li key={error+index}>{error}</li>
                                        })
                                    }
                                </ul>
                                <Formik
                                    initialValues={{
                                        name: '',
                                        email: '',
                                        password: ''
                                    }}
                                    onSubmit={this.signUp}
                                    validate={this.validateSignUp}
                                    enableReinitialize
                                >
                                    {
                                        values => (
                                            <Form>
                                                <div className="form-group">
                                                    <label htmlFor="name">Name</label>
                                                    <Field id="name" className="form-control form-control-lg" name="name" type="name" placeholder="Your username" />
                                                    <ErrorMessage component='div' name="name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <Field id="email" className="form-control form-control-lg" name="email" type="email" placeholder="Email" />
                                                    <ErrorMessage component='div' name="email" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Password</label>
                                                    <Field id="password" className="form-control form-control-lg" name="password" type="password" placeholder="Password" />
                                                    <ErrorMessage component='div' name="password" />
                                                </div>
                                                <button className="btn btn-info mr-1" type="button">Cancel</button>
                                                <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
                                                    Sign Up
                                                </button>
                                            </Form>
                                        )
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}