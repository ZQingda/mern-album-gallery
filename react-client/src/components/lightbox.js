import React, { Component } from 'react';

class Lightbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.show ? 'lightbox show' : 'lightbox'}>
                <button onClick={this.props.hideImage}>Close</button>
                {this.props.currentIndex != 0 && <button onClick={this.props.prevImage}>Prev</button>}
                {this.props.currentIndex != this.props.imageCount - 1 && <button onClick={this.props.nextImage}>Next</button>}
                <img src={this.props.path} alt=''></img>
            </div>
        );
    }
}

export default Lightbox;