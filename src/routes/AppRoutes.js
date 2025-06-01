import { Switch, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Users from '../components/ManageUsers/Users';
import PrivateRoutes from './PrivateRoutes';
import Role from '../components/Role/Role'
import GroupRole from '../components/GroupRole/GroupRole';

const AppRoutes = (props) => {
    const Project = () => {
        return (
            <div>
                <h1>Project</h1>
            </div>
        )
    }
    return (
        <>
            <Switch>

                <Route path="/" exact>
                    <h1>Home</h1>
                </Route>

                <PrivateRoutes path="/user" component={Users} />
                <PrivateRoutes path="/role" component={Role} />
                <PrivateRoutes path="/group-role" component={GroupRole} />

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/register">
                    <Register />
                </Route>

                <Route path="*">
                    <h1>404 Not Found</h1>
                </Route>

            </Switch>
        </>
    )

}

export default AppRoutes;