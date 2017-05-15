import React, { Component } from 'react';

class LoginTemplate extends Component {

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default LoginTemplate;
