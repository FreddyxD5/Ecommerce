import React from 'react';
import { Provider } from 'react-redux';
import store from "./store"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/App.css';
import Home from "./containers/Home"
import Error404 from "./containers/errors/Error404"
import Signup from './containers/auth/Signup';
import Login from './containers/auth/Login';
import Activate from './containers/auth/Activate';
import ResetPassword from './containers/auth/ResetPassword';
import PasswordConfirm from './containers/auth/ResetPasswordConfirm';
import Shop from './containers/Shop';
import ProductDetail from './containers/pages/productDetail';
import Search from './containers/pages/Search';
import Cart from './containers/pages/Cart';
import Checkout from './containers/pages/Checkout';
import PrivateRoute from './hocs/PrivateRoute';



function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          { /* Error display */}
          <Route path="*" element={<Error404/>} />
          <Route exact path="/" element={<Home/>} />          
          {/* Authentication routes */}
          <Route exact path="/signup" element={<Signup/>} />
          <Route exact path="/signin" element={<Login/>} />
          <Route exact path="/activate/:uid/:token" element={<Activate/>} />
          <Route exact path="/reset_password" element={<ResetPassword/>} />
          <Route exact path="/password/reset/confirm/:uid/:token" element={<PasswordConfirm/>} />
          {/* Shop */}
          <Route exact path="/shop" element={<Shop/>} />
          <Route exact path="/product/:productId" element={<ProductDetail/>}></Route>
          <Route exact path='/search' element={<Search />}></Route>
          <Route exact path='/cart' element={<Cart/> }></Route>
          <Route exact path='/checkout' element ={<Checkout />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
