import React from 'react';
import './App.css';
import { Header, User } from './Header';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Footer } from './Footer';
import { Home } from './components/home/Home';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { Settings } from './components/profile/Settings';
import { UserArticleDetail } from './components/Article/UserArticleDetail';
import { Profile } from './components/profile/Profile';
import { Editor } from './components/Article/Editor';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './shared/service/reducerAction';

export const store = createStore(rootReducer);

// Global API variable
// import const axios to file to call API 
export const axios = require('axios');
axios.defaults.baseURL = 'https://conduit.productionready.io/api';

interface AppState {
  loggedIn: false;
  user?: User;
}

export class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loggedIn: false
    }
  }

  rerenderChild = (data: User) => {
    this.setState({
      user: data
    });
  }

  render() {
    return (
    <Provider store={store}>
      <div>
        <Router>
          <Header userData={this.state.user} />

          <Switch>
            <Route exact path="/"><Redirect to="/home" /></Route>
            <Route path="/home" component={Home} />
            <Route exact path="/editor" component={Editor} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/login" render={(props: any) => <SignIn {...props} passUserData={this.rerenderChild} />} />
            <Route path="/articles/:id" component={UserArticleDetail} />
            <Route path="/register" component={SignUp} />
            <Route path="/profile/:username" component={Profile} />
            <Route path="/settings" render={(props: any) => <Settings {...props} passUserData={this.rerenderChild} />} />
          </Switch>

          <Footer />
        </Router>
      </div>
    </Provider>
    );
  }
}

export default App;
