import React, { useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { useStateValue } from '../src/context/contextProvider';
import axios from 'axios';
import Home from './components/Home/Home';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProductDetails from './components/ProductSheet/ProductDetails';
import Kezako from './components/Kezako/Kezako';
import Login from './components/Login/Login';
import Shop from './components/Shop/Shop';
import AdminPage from './components/Admin/AdminPage';
import Cart from './components/cart/Cart';
import Construction from './components/Construction/Construction';

import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [{ prodId, role }, dispatch] = useStateValue();

  const refreshToken = () => {
    axios({
      method: 'POST',
      url: `${API_BASE_URL}/api/users/refresh_token`,
      withCredentials: true,
    })
      .then(({ data }) => {
        const { id, role, token } = data;

        // setTimeout pour renouvler avant expiration l'access_token
        setTimeout(() => {
          refreshToken();
        }, 15 * 60 * 1000 - 10000);
        dispatch({ type: 'SET_USER', user: id });
        dispatch({ type: 'SET_JWT', jwt: token });
        dispatch({ type: 'SET_ROLE', role: role });
      })
      .catch(() => {
        // console.log('error refresh: ', err.response.data);
        dispatch({ type: 'RESET_USER' });
        dispatch({ type: 'RESET_JWT' });
      });
  };

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    let id = prodId;
    fetch(`${API_BASE_URL}/api/products/${id}/productsheet`)
      .then((resp) => resp.json())
      .then((data) => {
        let objProd = JSON.stringify(data);
        localStorage.setItem('tempProd', objProd);
      });
  }, [prodId]);

  return (
    <main className="rsw-container">
      <nav className="navLogo">
        <Link to="/" className="encadreHome">
          <img className="logoHome" alt="imageHome" src="/src/img/KITAC_logo-07.png" />
        </Link>
      </nav>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path={['/shop/:id/:name', '/shop/:id']}>
          <Shop />
        </Route>
        {role === 2 && (
          <Route path="/Admin">
            <AdminPage />
          </Route>
        )}
        <Route path="/ProductSheet">
          <ProductDetails />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/Kezako">
          <Kezako />
        </Route>
        <Route path="/Construction">
          <Construction />
        </Route>
        <Route path="/Cart">
          <Cart />
        </Route>
      </Switch>
      <Footer />
    </main>
  );
}

export default App;
