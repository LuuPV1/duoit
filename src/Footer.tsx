import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="container">
                    <Link to="/" className="logo-font">conduit</Link>
                    <span className="attribution">
                        An interactive learning project from <Link to="https://thinkster.io">Thinkster</Link>. Code &amp; design licensed under MIT.
                   </span>
                </div>
            </footer>
        );
    }
}  