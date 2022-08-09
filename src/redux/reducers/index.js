import { combineReducers } from "redux";
import Auth from './auth'
import Alert from "./alert";
import Categories from "./categories";
import Cart from "./cart";
import Products from "./products";
import Shipping from "./shipping";
export default combineReducers({
    Auth,
    Alert,
    Categories,
    Products,
    Cart,
    Shipping
});