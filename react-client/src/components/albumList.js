import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link } from 'react-router-dom';


class AlbumList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            albums: []
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.setState = this.setState.bind(this);

    }

    componentDidMount() {
        request.get('http://192.168.50.117:3001/album/list')
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                //console.log(res.body[0]);
                this.setState({ albums: res.body });
                //console.log(this.state.albums);
                return res;
            });


    }

    render() {
        var albumNav = this.state.albums.map((album) =>
            <li key={album._id}><Link to={`/albums/${album._id}`}>{album.name}</Link></li>
        );
        return (
            <div className='ABCD'>
                <ul>
                    <li><Link to={`/albums/all`}>All images</Link></li>
                    {albumNav}
                </ul>
            </div>
        );
    }
}

export default AlbumList;