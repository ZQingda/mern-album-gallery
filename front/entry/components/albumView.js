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
            album: {},
            currentImage: '',
            currentIndex: 0,
            lightbox: false,
            delete: false,
            selected: [],
            backToList: false,
            newTags: []
        };

        this.getAlbum = this.getAlbum.bind(this);
        this.showImage = this.showImage.bind(this);
        this.hideImage = this.hideImage.bind(this);
        this.prevImage = this.prevImage.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.toggleDeletion = this.toggleDeletion.bind(this);
        this.handleDeletion = this.handleDeletion.bind(this);
        this.select = this.select.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
        this.addTags = this.addTags.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.handleNewTagsChange = this.handleNewTagsChange.bind(this);
    }

    getAlbum() {
        if (this.props.location.state.albumid) {
            var albumQuery = (this.props.location.state.albumid == 'all') ? {} : { albumid: this.props.location.state.albumid };
            console.log(albumQuery);
            request.get('http://192.168.50.117:3001/album/get')
                .query(albumQuery)
                .end((err, res) => {
                    if (err) { console.log('HANDLE ERROR: ' + err); }
                    this.setState({
                        images: res.body.album.images ? res.body.album.images : res.body.images,
                        album: res.body.album ? res.body.album : null
                    });
                    console.log('Tried getting');
                });
        }
        else if (this.props.location.state.tagid) {
            var tagQuery = this.props.location.state.tagid;
            request.get('http://192.168.50.117:3001/tag/getall')
                .query(tagQuery)
                .end((err, res) => {
                    if (err) { console.log('HANDLE TAG ALL ERR : ' + err); }
                    this.setState({
                        images: res.body
                    })
                });
        }
    }

    showImage(e) {
        //console.log(e.target.childNodes);
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
        //console.log('Deletion toggled');
        e.preventDefault();
        this.setState({
            delete: true
        }, function () { console.log(this.state) });
    }

    handleDeletion(e) {
        //console.log('Handling Deletion');
        //console.log(this.state);
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

        this.getAlbum();
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

    handleNewTagsChange(e) {
        this.setState({ newTags: e.target.value });
    }

    addTags(e) {
        e.preventDefault();

        var albumid = this.props.location.state.albumid;
        var newTags = this.state.newTags;

        request.post('http://192.168.50.117:3001/album/addtags')
            .send({
                albumid: albumid,
                newTags: newTags
            })
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                this.getAlbum();
            });
    }

    removeTag(e) {
        e.preventDefault();

        var albumid = this.props.location.state.albumid;

        //console.log(e.target.dataset.tag);
        request.post('http://192.168.50.117:3001/album/removetag')
            .send({
                albumid: albumid,
                tagid: this.state.album.tags[e.target.dataset.tag]._id
            })
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                this.getAlbum();
                return res;
            });
    }
    componentDidMount() {
        this.getAlbum();
    }

    render() {
        console.log(this.state.album);
        console.log(this.state.images);
        var albumid = this.props.location.state.albumid;
        var images = this.state.album.images ? this.state.album.images : this.state.images ;
        
        var imagePresentation = images.map((image, index) => {
            var link = image.path.substr(6);
            return (
                <div className='imgWrap' onClick={this.deleteSelect} key={index}>
                    <img src={link} alt='cannot find' onClick={this.state.delete ? this.select : this.showImage} data-key={index}></img>
                </div>
            )
        });

        var tags = this.state.album.tags ? this.state.album.tags.map((tag, index) => {
            return (
                <div className='tagWrap' key={index}>
                    {tag.name}
                    <button onClick={this.removeTag} data-tag={index}>Delete tag</button>
                </div>
            )
        }) : null;

        if (this.state.backToList) {
            return <Redirect push to='/albums' />
        } else {
            return (
                <div className='ABCD'>
                    <Upload albumid={albumid} update={this.getAlbum} />
                    {this.props.location.state.albumid != 'all' &&
                        <button onClick={this.deleteAlbum}>Delete album</button>}
                    {this.state.delete ?
                        <button onClick={this.handleDeletion}>Delete</button>
                        :
                        <button onClick={this.toggleDeletion}>Select for deletion</button>
                    }
                    {this.state.delete ? 'DELETE IS ON' : 'DELETE IS OFF'}
                    {tags}
                    {imagePresentation}
                    <form onSubmit={this.addTags} id='newTags'>
                        <label htmlFor='albumNewTags'>New Tag(s)</label>
                        <input type='text' name='albumNewTags' id='albumNewTags' onChange={this.handleNewTagsChange} />
                        <input type="submit" value="Submit" />
                    </form>

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