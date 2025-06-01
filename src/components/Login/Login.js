import './Login.scss';
import { useHistory, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/userService';
import { UserContext } from '../../context/UserContext';

const Login = (props) => {
    const { user, loginContext } = useContext(UserContext);
    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");

    const defaultValidInput = {
        isValidValueLogin: true,
        isValidPassword: true
    }
    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const handleCreateNewAccount = () => {
        history.push('/register');
    }

    const handleLogin = async () => {
        setObjValidInput(defaultValidInput);
        if (!valueLogin) {
            setObjValidInput({ ...defaultValidInput, isValidValueLogin: false });
            toast.error("Please enter your email or phone number");
            return;
        }
        if (!password) {
            setObjValidInput({ ...defaultValidInput, isValidPassword: false });
            toast.error("Please enter your password");
            return;
        }

        let response = await loginUser(valueLogin, password);
        if (response && +response.EC === 0) {
            // sucess
            let groupWithRoles = response.DT.groupWithRoles;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username }
            }

            localStorage.setItem('jwt', token);
            loginContext(data);
            history.push('/user');
        }

        if (response && +response.EC !== 0) {
            // error
            toast.error(response.EM);
        }
        console.log('response', response);
    }

    const handlePressKey = (event) => {
        if (event.charCode === 13 && event.code === "Enter") {
            handleLogin();
        }
    }

    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, [])

    return (
        <div className="login-container" >
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            <Link to='/'><span title='Return to HomePage'>Phuong Thy</span></Link>
                        </div>
                        <div className='detail'>
                            Welcome to my personal project
                        </div>
                    </div>
                    <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className='brand d-sm-none'>
                            Phuong Thy
                        </div>
                        <input type="text"
                            className={objValidInput.isValidValueLogin ? "form-control" : "form-control is-invalid"}
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={(event) => { setValueLogin(event.target.value) }}
                        />
                        <input type="password"
                            className={objValidInput.isValidPassword ? "form-control" : "form-control is-invalid"}
                            placeholder='Password'
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                            onKeyPress={(event) => handlePressKey(event)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => handleLogin()}
                        >
                            Login</button>
                        <span className="text-center">
                            <a className="forgot-password">Forgotten password?</a>
                        </span>
                        <hr />
                        <div className="text-center">
                            <button className='btn btn-success' onClick={() => handleCreateNewAccount()}>
                                Create new account
                            </button>
                            <div className='mt-3 return'>
                                <Link to='/'>
                                    <i className='fa fa-arrow-circle-left'></i>
                                    <span title='Return to HomePage'>Return to HomePage</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login;