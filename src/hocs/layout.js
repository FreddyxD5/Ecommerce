import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { check_authenticated, load_user, refresh } from "../redux/actions/auth";
import {     
    get_items,
    get_total,
    get_item_total
} from "../redux/actions/cart";
import {get_user_profile} from "../redux/actions/profile"
import { connect } from "react-redux";
import Navbar  from "../components/navigation/Navbar";
import Footer  from "../components/navigation/Footer";

const Layout = (props) =>{
    const {
        refresh,
        check_authenticated,
        get_user_profile,
        load_user,
        get_items,
        get_total,
        get_item_total } = props
    useEffect(() => {                        
        check_authenticated()        
        load_user()         
        get_items()
        get_total()
        get_item_total()
        get_user_profile()
    }, []);
    
    return(
        <div>
            <Navbar/>
            <ToastContainer autoClose={5000}/>
            {props.children}
            <Footer />
        </div>
    )
}

export default connect(null, {    
    check_authenticated,
    load_user,
    refresh,    
    get_items,
    get_total,
    get_item_total,
    get_user_profile,
})(Layout);