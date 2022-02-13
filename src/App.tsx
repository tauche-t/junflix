import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';
import Movies from './Routes/Movies';

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Switch>
        <Route path="/tv">
          <Header />
          <Tv />
        </Route>
        <Route path="/search">
          <Header />
          <Search />
        </Route>
        <Route path={["/movies", "/movies/movieId"]}>
          <Header />
          <Movies />
        </Route>
        <Route path={"/"}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
