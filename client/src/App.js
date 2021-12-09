import "./App.css";
import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ProfileList from "./components/ProfileList/ProfileList";
import CreateProfile from "./components/Profile/CreateProfile";
import Profile from "./components/Profile/Profile";

class App extends React.Component {
  state = {
    profiles: [],
    profile: null,
    token: null,
    user: null,
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000")
      .then((response) => {
        this.setState({
          data: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    this.authenticateUser();
  }

  render() {
    let { user, profiles, profile, token } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser,
    };
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>GoodThings</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                {user ? (
                  <Link to="/new-profile">New prrofile</Link>
                ) : (
                  <Link to="/register">Register</Link>
                )}
              </li>
              <li>
                {user ? (
                  <Link to="" onClick={this.logOut}>
                    log out
                  </Link>
                ) : (
                  <Link to="/login"> Log in</Link>
                )}
              </li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route exact path="/">
                {user ? (
                  <React.Fragment>
                    <div> Hello {user}!</div>

                    <ProfileList
                      profiles={profiles}
                      clickProfile={this.viewProfile}
                      deleteProfile={this.deleteProfile}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    Pleaser either Register or Login
                  </React.Fragment>
                )}
              </Route>
              <Route path="/profiles/:profileId">
                <Profile profile={profile} />
              </Route>

              <Route path="new-post">
                <CreateProfile
                  token={token}
                  onProfileCreated={this.onProfileCreated}
                />
              </Route>

              <Route
                exact
                path="/register"
                render={() => <Register {...authProps} />}
              />
              <Route
                exact
                path="/login"
                render={() => <Login {...authProps} />}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }

  // called methods bellow
  authenticateUser = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("user");
      this.setState({ user: null });
    }

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      axios
        .get("http://localhost:5000/api/auth", config)
        .then((response) => {
          localStorage.setItem("user", response.data.name);
          this.setState({ user: response.data.name, token: token }, () => {
            this.loadData();
          });
        })
        .catch((error) => {
          localStorage.removeItem("user");
          this.setState({ user: null });
          console.error(`Error loging in : ${error}`);
        });
    }
  };

  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({ user: null, token: null });
  };

  loadData = () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      axios
        .get("http://localhost:5000/api/profiles", config)
        .then((response) => {
          this.setState({
            profiles: response.data,
          });
        })
        .catch((error) => {
          console.error(`error fetching data : ${error}`);
        });
    }
  };

  viewProfile = (profile) => {
    console.log(`view ${profile.characterName}`);
    this.setState({
      profile: profile,
    });
  };

  deleteProfile = (profile) => {
    const { token } = this.state;
    if (token) {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      axios
        .delete(`http://localhost:5000/api/profiles/${profile._id}`, config)
        .then((response) => {
          const newProfiles = this.state.profiles.filter(
            (p) => p._id !== profile._id
          );
          this.setState({
            profiles: [...newProfiles],
          });
        })
        .catch((error) => {
          console.error(`error delete post : ${error}`);
        });
    }
  };

  onProfileCreated = (profile) => {
    const newProfiles = [this.state.profiles, profile];
    this.setState({
      profiles: newProfiles,
    });
  };
}

export default App;
