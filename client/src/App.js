import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AuthState from './context/AuthState';

import ProtectedRoutes from './components/routing/ProtectedRoutes';
import Navbar from './components/layout/Navbar/Navbar';
import AuthForm from './components/auth/AuthForm';
import Wallets from './components/wallets/Wallets';
import WalletForm from './components/wallets/WalletForm';
import Operations from './components/WalletHistory/Operations';
import OperationForm from './components/WalletHistory/OperationForm';

const containerStyle = {
  margin: 'auto',
  maxWidth: '1000px',
};

const App = () => {
  return (
    <Router>
      <AuthState>
        <Navbar />
        <div style={containerStyle}>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/login" />
            </Route>
            <Route path="/register" exact>
              <AuthForm mode="register" />
            </Route>
            <Route path="/login" exact>
              <AuthForm mode="login" />
            </Route>
            <ProtectedRoutes>
              <Route path="/wallets" exact>
                <Wallets />
              </Route>
              <Route path="/wallets/new" exact>
                <WalletForm mode="add" />
              </Route>
              <Route path="/wallets/edit/:id" exact>
                <WalletForm mode="edit" />
              </Route>
              <Route path="/:walletId/operations" exact>
                <Operations />
              </Route>
              <Route path="/:walletId/operations/new" exact>
                <OperationForm mode="add" />
              </Route>
              <Route path="/:walletId/operations/edit/:operationId" exact>
                <OperationForm mode="edit" />
              </Route>
            </ProtectedRoutes>
          </Switch>
        </div>
      </AuthState>
    </Router>
  );
};

export default App;
