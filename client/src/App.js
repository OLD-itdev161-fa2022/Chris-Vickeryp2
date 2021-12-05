import "./App.css";
import React from "react";
import axios from "axios";

class App extends React.Component {
  state = {
    data: null,
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000")
      .then((responce) => {
        this.setState({
          data: responce.data,
        });
      })
      .catch((error) => {
        console.error(`error fecching data: ${error}`);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">hihi</header>
      </div>
    );
  }
}

export default App;
