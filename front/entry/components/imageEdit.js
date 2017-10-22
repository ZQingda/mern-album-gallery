import React, {Component} from 'react';
import request from 'superagent';

class ImageEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            name : '',
            description: ''
        }

        this.edit = this.edit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    edit() {
        this.setState({
            edit: true,
        })
    }

    handleEditSubmit(e) {
        e.preventDefault();
        request.post('http://192.168.50.117:3001/image/update')
            .send({
                imageId : this.props.imageId,
                name : this.state.name,
                description : this.state.description
            })
            .end((err, res) => {
                if (err) {
                    console.log('handleEditSubmit error : ' + err);
                }
            })
        
        this.setState({ edit : false });
    }

    handleNameChange(e) {
        this.setState({ name : e.target.value });
    }

    handleDescChange(e) {
        this.setState({ description : e.target.value });
    }

    render() {
        return (
            <div className='imageEdit'>
                {!this.state.edit && <button onClick={this.edit}>Edit</button>}
                {this.state.edit && 
                    <form onSubmit={this.handleEditSubmit} id='imageFields'>
                        <label htmlFor='imageName'>Title</label>
                        <input type='text' name='imageName' id='imageName' onChange={this.handleNameChange} />
                        <label htmlFor='imageDesc'>Caption</label>
                        <input type='text' name='imageDesc' id='imageDesc' onChange={this.handleDescChange} />
                        <input type="submit" value="Submit" />
                    </form>
                }
            </div>
        )
    }
}

export default ImageEdit;