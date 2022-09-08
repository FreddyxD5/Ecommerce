import { combineReducers } from "redux";
import Auth from './auth'
import Alert from "./alert";
import Categories from "./categories";
import Cart from "./cart";
import Products from "./products";
import Shipping from "./shipping";
import Payment from "./payment";
import Orders from "./orders"
import Coupons from "./coupons";


export default combineReducers({
    Auth,
    Alert,
    Categories,
    Products,
    Cart,
    Shipping,
    Payment,
    Orders,
    Coupons
});