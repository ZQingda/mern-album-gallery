import React, { Component } from 'react';
import request from 'superagent';
import { Switch, Route, Link } from 'react-router-dom';


class TagView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: {}
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.setState = this.setState.bind(this);

    }

    componentDidMount() {
        console.log(this.props.location.state);
        var tagQuery = {tagId : this.props.location.state.tagId};
        request.get('http://192.168.50.117:3001/tag/get')
            .query(tagQuery)
            .end((err, res) => {
                if (err) { console.log('HANDLE ERROR: ' + err); }
                //console.log(res.body[0]);
                console.log('TAG INFO: ')
                console.log(res.body);
                this.setState({ tag: res.body });
                //console.log(this.state.albums);
                return res;
            });


    }

    render() {
        var albumNav = this.state.tag.albums ? this.state.tag.albums.map((album) =>
            <li key={album._id}><Link to={{
                pathname: `/albums/${album.name}`,
                state: {albumid: album._id}
            }}>{album.name}</Link></li>
        ): null;
        return (
            <div className='TagView'>
                <ul>
                    <li><Link to={{
                        pathname : `/tag/${this.state.tag.name}/all`, 
                        state : {tagId : this.state.tag._id
                        }}}>All images</Link></li>
                    {albumNav}
                </ul>
            </div>
        );
    }
}

export default TagView;