import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

class Upload extends Component {

    constructor(props) {
        super(props);
        this.onImageDrop = this.onImageDrop.bind(this);
    }

    handleImageUpload(file) {
        console.log(this.props.albumid);
        var idused = this.props.albumid ? this.props.albumid : '59c893f8890bfa34e4f639ad';
        var photo = new FormData();
        photo.append('photo', file[0]);
        photo.append('albumid', idused );

        request.post('http://192.168.50.117:3001/image/upload')
            .send(photo)
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                
                if (typeof this.props.update === 'function') {
                    this.props.update();
                }

                return res;
            });
    }

    onImageDrop(files) {
        this.handleImageUpload(files);
    }

    render() {
        return (
            <div className="App">
                <Dropzone
                    multiple={false}
                    accept="image/*"
                    onDrop={this.onImageDrop.bind(this)}>
                    <p>Drop an image or click to select a file to upload.</p>
                </Dropzone>
            </div>
        );
    }
}

export default Upload;