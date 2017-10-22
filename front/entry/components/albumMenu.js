import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import Upload from './upload'

class AlbumMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var tags = this.props.tags ? this.props.tags.map((tag, index) => {
            return (
                <div className='tagWrap' key={index}>
                    {tag.name}
                    <button onClick={this.props.removeTag} data-tag={index}>Delete tag</button>
                </div>
            )
        }) : null;

        return (
            <div className='AlbumMenu'>
                <Upload albumid={this.props.albumid} update={this.props.getAlbum} />
                {this.props.albumid != 'all' &&
                    <button onClick={this.props.deleteAlbum}>Delete album</button>}
                {this.props.delete ?
                    <button onClick={this.props.handleDeletion}>Delete</button>
                    :
                    <button onClick={this.props.toggleDeletion}>Select for deletion</button>
                }
                {this.props.delete ? 'DELETE IS ON' : 'DELETE IS OFF'}

                <form onSubmit={this.props.addTags} id='newTags'>
                    <label htmlFor='albumNewTags'>New Tag(s)</label>
                    <input type='text' name='albumNewTags' id='albumNewTags' onChange={this.props.handleNewTagsChange} />
                    <input type="submit" value="Submit" />
                </form>

                {tags}
            </div>
        )
    }
}

export default AlbumMenu;


