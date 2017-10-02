import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

class Upload extends Component {

    constructor(props) {
        super(props);
        //this.onImageDrop = this.onImageDrop.bind(this);
        this._handleImageUpload = this._handleImageUpload.bind(this);
    }

    oldHandleImageUpload(file) {
        //console.log(this.props.albumid);
        var idused = this.props.albumid ? this.props.albumid : '59c893f8890bfa34e4f639ad';
        var photo = new FormData();
        photo.append('photo', file[0]);
        photo.append('albumid', idused);

        request.post('image/upload')
            .send(photo)
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }

                if (typeof this.props.update === 'function') {
                    this.props.update();
                }

                return res;
            });
    }

    /*onImageDrop(files) {
        this.handleImageUpload(files);
    }*/

    _handleImageUpload(e) {
        e.preventDefault();

        var idused = (this.props.albumid != 'all') ? this.props.albumid : null;
        var formData = new FormData(document.getElementById('TestForm'));
        if (idused) {
            formData.append('albumid', idused);
        } else {
            formData.append('albumid', 'noid');
        }
        /*console.log('=== Form created ===');
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        console.log('=== Form created ===');*/

        request.post('http://192.168.50.117:3001/image/upload')
            .send(formData)
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }

                if (typeof this.props.update === 'function') {
                    this.props.update();
                }

                return res;
            });
    }

    render() {
        /*var dropZone = (
            <Dropzone
                multiple={false}
                accept="image/*"
                onDrop={this.onImageDrop.bind(this)}>
                <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
        );*/
        return (
            <div className="App">

                <form onSubmit={this._handleImageUpload} name='image' enctype="multipart/form-data" id='TestForm'>
                    Select image to upload:
                    <input type="file" name="photo" id="imageFile" accept='image/*' />
                    <input type="submit" value="Upload Image" name="submit" />
                </form>

            </div>
        );
    }
}

export default Upload;