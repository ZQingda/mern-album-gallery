import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link } from 'react-router-dom';


class AlbumView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: []
        };

    }

    componentDidMount() {
        request.get('http://192.168.50.117:3001/album/get')
            .query({ albumid : this.props.match.params.albumid })
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                this.setState({ images: res.body });
                console.log(this.state.images);
            });
    }

    render() {
        return (
            <div className='ABCD'>
                TEST IMAGE DISPLAY {this.props.match.params.albumid} <br />
                <img src='../../public/uploads/b40ac39bc37809c05bd963ca94561f41' alt='CANT FIND IT' />
            </div>
        );
    }
}

export default AlbumView;