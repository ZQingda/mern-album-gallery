import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import Upload from './upload'
import Lightbox from './lightbox'


class AlbumView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            currentImage: '',
            currentIndex: 0,
            lightbox: false,
            delete: false,
            selected: [],
            backToList: false
        };
        this.toggleDeletion = this.toggleDeletion.bind(this);
        this.handleDeletion = this.handleDeletion.bind(this);
        this.select = this.select.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    toggleDeletion(e) {
        console.log('Deletion toggled');
        e.preventDefault();
        this.setState({
            delete: true
        }, function () { console.log(this.state) });
    }

    handleDeletion(e) {
        console.log('Handling Deletion');
        console.log(this.state);
        e.preventDefault();

        var albumid = this.props.location.state.albumid;
        var selected = this.state.selected;

        var deletionPackage = {
            deletionIds: selected
        }
        if (albumid != 'all') {
            deletionPackage.albumid = albumid;
        }

        request.post('http://192.168.50.117:3001/image/delete')
            .send(deletionPackage)
            .end((err) => {
                if (err) { console.log('DELETE IMAGE ERROR: ' + err); }
            });

        this.setState({
            delete: false,
            selected: []
        });

        this.getImages();
    }

    select(e) {
        var newSelected = this.state.selected;
        newSelected.push(this.state.images[e.target.dataset.key]._id);
        this.setState({
            selected: newSelected
        })
    }

    deleteAlbum() {
        var albumid = this.props.location.state.albumid;
        console.log(albumid);
        request.post('http://192.168.50.117:3001/album/delete')
            .send({ albumid: albumid })
            .end((err) => {
                if (err) { console.log('DELETE ALBUM ERROR: ' + err); }
            });

        this.setState({ 
            backToList: true 
        });
    }

    componentDidMount() {
        this.getImages();
    }

    render() {

        if (this.state.backToList) {
            return <Redirect push to='/albums' />
        } else {
            return (
                <div className='album-edit'>
                    <Upload albumid={albumid} update={this.getImages} />
                    {this.props.location.state.albumid != 'all' &&
                        <button onClick={this.deleteAlbum}>Delete album</button>}
                    {this.state.delete ?
                        <button onClick={this.handleDeletion}>Delete</button>
                        :
                        <button onClick={this.toggleDeletion}>Select for deletion</button>
                    }
                    {this.state.delete ? 'DELETE IS ON' : 'DELETE IS OFF'}
                </div>
            );
        }
    }
}

export default AlbumView;