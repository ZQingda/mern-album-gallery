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

        this.getImages = this.getImages.bind(this);
        this.showImage = this.showImage.bind(this);
        this.hideImage = this.hideImage.bind(this);
        this.prevImage = this.prevImage.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.toggleDeletion = this.toggleDeletion.bind(this);
        this.handleDeletion = this.handleDeletion.bind(this);
        this.select = this.select.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    getImages() {
        var albumQuery = (this.props.location.state.albumid == 'all') ? {} : { albumid: this.props.location.state.albumid };
        //console.log(albumQuery);
        request.get('http://192.168.50.117:3001/album/get')
            .query(albumQuery)
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                this.setState({ images: res.body });
            });
    }

    showImage(e) {
        console.log(e.target.childNodes);
        this.setState({
            currentImage: e.target.src,
            currentIndex: parseInt(e.target.dataset.key),
            lightbox: true
        }, /*function() {
            console.log('Passed state: ');
            console.log(this.state)
        }*/);

    }
    hideImage(e) {
        this.setState({
            lightbox: false
        });
    }
    nextImage() {
        var index = this.state.currentIndex;
        var imageCount = this.state.images.length;
        var newIndex = (index == imageCount - 1) ? index : index += 1;
        this.setState({
            currentIndex: newIndex,
            currentImage: this.state.images[newIndex].path.substr(6)
        })
    }
    prevImage() {
        var index = this.state.currentIndex;
        var newIndex = index == 0 ? index : index -= 1;
        this.setState({
            currentIndex: newIndex,
            currentImage: this.state.images[newIndex].path.substr(6)
        })
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
        var albumid = this.props.location.state.albumid;
        var images = this.state.images.map((image, index) => {
            var link = image.path.substr(6);
            return (
                <div className='imgWrap' onClick={this.deleteSelect}>
                    <img src={link} alt='cannot find' onClick={this.state.delete ? this.select : this.showImage} data-key={index}></img>
                </div>
            )
        });

        if (this.state.backToList) {
            return <Redirect push to='/albums' />
        } else {
            return (
                <div className='ABCD'>
                    TEST IMAGE DISPLAY {albumid} <br />
                    <Upload albumid={albumid} update={this.getImages} />
                    {this.props.location.state.albumid != 'all' &&
                        <button onClick={this.deleteAlbum}>Delete album</button>}
                    {this.state.delete ?
                        <button onClick={this.handleDeletion}>Delete</button>
                        :
                        <button onClick={this.toggleDeletion}>Select for deletion</button>
                    }
                    {this.state.delete ? 'DELETE IS ON' : 'DELETE IS OFF'}


                    {images}
                    <Lightbox
                        imageCount={this.state.images.length}
                        currentIndex={this.state.currentIndex}
                        path={this.state.currentImage}
                        hideImage={this.hideImage}
                        show={this.state.lightbox}
                        nextImage={this.nextImage}
                        prevImage={this.prevImage}
                    />
                </div>
            );
        }
    }
}

export default AlbumView;