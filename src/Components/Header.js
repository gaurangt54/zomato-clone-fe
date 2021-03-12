import React from 'react';
import '../Styles/header.css';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px',
        backgroundColor: 'rgba(150, 150, 150, 0.7)',
        border: 'solid 2px black'
    }
};



class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            registerModalIsOpen: false,
            isUserLoggedIn: false,
            userName: undefined,
            firstname: undefined,
            lastname: undefined,
            email: undefined,
            password: undefined,
            message: undefined
        }
    }

    Navigate = () => {
        this.props.history.push("/");
    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }

    handleRegister = () => {
        this.setState({ registerModalIsOpen: true });
    }

    login = () => {
        const { email, password } = this.state;
        axios({
            url: `http://localhost:2021/login`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data:{
                email: email,
                password: password
            }
        })
        .then((res)=> {
            console.log(res);
            if(res.data.IsLoggedIn){
                this.setState({
                    isUserLoggedIn: res.data.IsLoggedIn,
                    message: undefined,
                    loginModalIsOpen:false,
                    userName: `${res.data.user[0].firstname} ${res.data.user[0].lastname}`
    
                })
                sessionStorage.setItem('email',res.data.user[0].email)
            }
            else{
                this.setState({
                    isUserLoggedIn: res.data.IsLoggedIn,
                    message: res.data.message,
                })
            }
            
        })
        .catch((err) => console.log(err));

    }

    register = () => {
        const { firstname,lastname ,email, password } = this.state;
        axios({
            url: `http://localhost:2021/signup`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data:{
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            }
        })
        .then((res)=> {
            console.log(res);

                this.setState({
                    registerModalIsOpen: false,
                    message: res.data.message,
                    loginModalIsOpen:true,
                    firstname: undefined,
                    lastname: undefined,
                    email: undefined,
                    password: undefined
                })
            
            
        })
        .catch((err) => console.log(err));

    }

    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }

    responseGoogle = (response) => {
        console.log(response)
        
        if (response && response.profileObj && response.profileObj.name) {
            this.setState({ loginModalIsOpen: false, isUserLoggedIn: true, userName: response.profileObj.name });
        } else {
            this.setState({ loginModalIsOpen: false });
        }
        
    }

    responseFacebook = (response) => {
        if (response && response.name) {
            this.setState({ loginModalIsOpen: false, isUserLoggedIn: true, userName: response.name });
        }
        else {
            this.setState({ loginModalIsOpen: false });
        }
    }

    handleLogout = () => {
        this.setState({ isUserLoggedIn: false, userName: undefined })
        sessionStorage.setItem('email',undefined)
    }

    handleModalClose = (state) => {
        this.setState({[state]:false})
    }

    render() {
        const { loginModalIsOpen, registerModalIsOpen ,isUserLoggedIn, userName, firstname, lastname, email, password, message } = this.state;
        return (
            <div style={{ backgroundColor: '#ce0505', height: '50px' }}>
                <div className="header-logo" onClick={this.Navigate}>
                    <p>e!</p>
                </div>
                {isUserLoggedIn ? <div style={{ float: 'right', marginTop: '10px' }}>
                    <div style={{ display: 'inline-block' }} className="header-login" >{userName}</div>
                    <div style={{ display: 'inline-block' }} className="header-account" onClick={this.handleLogout}>Logout</div>
                </div> :
                    <div style={{ float: 'right', marginTop: '10px' }}>
                        <div style={{ display: 'inline-block' }} className="header-login" onClick={this.handleLogin}>Login</div>
                        <div style={{ display: 'inline-block' }} className="header-account" onClick={this.handleRegister}>Create an account</div>
                    </div>}
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div>
                        <GoogleLogin
                            clientId="474761018504-mndnhtthfg2b78v4mdab00dg4j4ci2uv.apps.googleusercontent.com"
                            buttonText="Continue with Gmail"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            className="btnGoogle"
                        />
                        <br/>
                        <FacebookLogin
                        style={{display: 'flex',flexWrap: 'wrap' }}
                        cssClass="btnFacebook"
                            appId="1071729673335855"
                            textButton=" &nbsp;&nbsp; Continue with Facebook"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            icon="fa-facebook-square"
                        />
                        <br/>
                        <hr style={{width:'100%', borderWidth:2, backgroundColor:'brown' }} />

                        <div>
                        <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleModalClose('loginModalIsOpen')}>x</div>

                            <h3 className="py-3">Login </h3>
                            <table>
                                <tr>
                                    <td>Email Id:</td>
                                    <td><input type="text" value={email} onChange={(event) => this.handleInputChange(event, 'email')} /></td>
                                </tr>
                                <tr>
                                    <td>Password</td>
                                    <td><input type="password" value={password} onChange={(event) => this.handleInputChange(event, 'password')} /></td>
                                </tr>
                            </table>
                            <button type="submit" onClick={this.login} className="btn btn-block btn-danger mt-2">Login</button>
                    </div>
                        <h6>{message}</h6>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={registerModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div>
                        <div className="glyphicon glyphicon-remove close" style={{ float: 'right' }} onClick={() => this.handleModalClose('registerModalIsOpen')}>x</div>

                            <h3 className="py-3">Sign Up </h3>
                            <table>
                                <tr>
                                    <td>First Name:</td>
                                    <td><input type="text" value={firstname} onChange={(event) => this.handleInputChange(event, 'firstname')} /></td>
                                </tr>
                                <tr>
                                    <td>Last Name:</td>
                                    <td><input type="text" value={lastname} onChange={(event) => this.handleInputChange(event, 'lastname')} /></td>
                                </tr>
                                <tr>
                                    <td>Email Id:</td>
                                    <td><input type="text" value={email} onChange={(event) => this.handleInputChange(event, 'email')} /></td>
                                </tr>
                                <tr>
                                    <td>Password</td>
                                    <td><input type="password" value={password} onChange={(event) => this.handleInputChange(event, 'password')} /></td>
                                </tr>
                            </table>
                            <button type="submit" onClick={this.register} className="btn btn-block btn-danger mt-2">Sign Up</button>
                    </div>
                        
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);

/*



*/









