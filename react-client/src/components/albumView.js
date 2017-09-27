import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link } from 'react-router-dom';

import Upload from './upload'


class AlbumView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            currentImage: '',
            lightbox: false
        };

        this.getImages = this.getImages.bind(this);
        this.showImage = this.showImage.bind(this);
        this.hideImage = this.hideImage.bind(this);
    }

    getImages() {
        request.get('http://192.168.50.117:3001/album/get')
        .query({ albumid : this.props.match.params.albumid })
        .end((err, res) => {
            if (err) { console.log('HANDLE ERROR: ' + err); }
            this.setState({ images: res.body });
            console.log(this.state.images);
        });
    }

    showImage(e) {
        this.setState({
            currentImage : e.target.src,
            lightbox: true
        });
    }

    hideImage(e) {
        this.setState({
            lightbox: false
        });
    }

    componentDidMount() {
        this.getImages();
    }

    render() {
        var albumid = this.props.match.params.albumid;
        var images = this.state.images.map((image) => {
            var link = image.path.substr(6);
            return (
                <div>
                    <img src={link} alt='cannot find' onClick={this.showImage}></img>
                </div>
            )
        });

        return (
            <div className='ABCD'>
                TEST IMAGE DISPLAY {albumid} <br />
                <Upload albumid={albumid} update={this.getImages}/>
                {images}
                <div className={this.state.lightbox ? 'lightbox show' : 'lightbox'}>
                    <button onClick={this.hideImage}>Close</button>
                    <img src={this.state.currentImage} alt=''></img>
                </div>
            </div>
        );
    }
}

export default AlbumView;