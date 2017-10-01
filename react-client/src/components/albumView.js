import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link } from 'react-router-dom';

import Upload from './upload'
import Lightbox from './lightbox'


class AlbumView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            currentImage: '',
            currentIndex: 0,
            lightbox: false
        };

        this.getImages = this.getImages.bind(this);
        this.showImage = this.showImage.bind(this);
        this.hideImage = this.hideImage.bind(this);
        this.prevImage = this.prevImage.bind(this);
        this.nextImage = this.nextImage.bind(this);
    }

    getImages() {
        request.get('http://192.168.50.117:3001/album/get')
        .query({ albumid : this.props.match.params.albumid })
        .end((err, res) => {
            if (err) { console.log('HANDLE ERROR: ' + err); }
            this.setState({ images: res.body });
        });
    }

    showImage(e) {
        this.setState({
            currentImage : e.target.src,
            currentIndex : parseInt(e.target.dataset.key),
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
            currentIndex : newIndex,
            currentImage: this.state.images[newIndex].path.substr(6)
        })
    }
    prevImage() {
        var index = this.state.currentIndex;
        var newIndex = index == 0 ? index : index -= 1;
        this.setState({
            currentIndex : newIndex,
            currentImage: this.state.images[newIndex].path.substr(6)
        })
    }

    componentDidMount() {
        this.getImages();
    }

    render() {
        var albumid = this.props.match.params.albumid;
        var images = this.state.images.map((image, index) => {
            var link = image.path.substr(6);
            return (
                <div>
                    <img src={link} alt='cannot find' onClick={this.showImage} data-key={index}></img>
                </div>
            )
        });

        return (
            <div className='ABCD'>
                TEST IMAGE DISPLAY {albumid} <br />
                <Upload albumid={albumid} update={this.getImages}/>
                {images}
                <Lightbox
                    imageCount = {this.state.images.length}
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

export default AlbumView;