import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Upload from './components/upload';
import AlbumCreate from './components/albumCreate';
import AlbumList from './components/albumList';
import AlbumView from './components/albumView';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Link to={`/image/upload`}>Image Upload</Link><br/>
        <Link to={`/album/create`}>Album Create</Link><br/>
        <Link to={`/albums`}>Album List</Link>
        <Switch>
          <Route path='/image/upload' component={Upload} albumid='59c8b50636f9774444462a45'/>
          <Route path='/album/create' component={AlbumCreate} />
          <Route exact path='/albums' component={AlbumList} />
          <Route path='/albums/:albumid' component={AlbumView} />
        </Switch>
      </div>
    );
  }
}

export default App;
