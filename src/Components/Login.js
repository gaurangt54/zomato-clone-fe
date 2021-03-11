import React from 'react';
import '../Styles/login.css';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
    Navigate = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div style={{ backgroundColor: '#ce0505', height: '50px' }}>
                <div className="header-logo" onClick={this.Navigate}>
                    <p>e!</p>
                </div>
                <div style={{ float: 'right', marginTop: '10px' }}>
                    <div style={{ display: 'inline-block' }} className="header-login">Login</div>
                    <div style={{ display: 'inline-block' }} className="header-account">Create an account</div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);











