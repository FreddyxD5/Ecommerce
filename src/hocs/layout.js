import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { check_authenticated, load_user, refresh } from "../redux/actions/auth";
import { connect } from "react-redux";
import Navbar  from "../components/navigation/Navbar";
import Footer  from "../components/navigation/Footer";

const Layout = (props) =>{
    const {refresh, check_authenticated, load_user} = props
    useEffect(() => {        
        refresh()
        check_authenticated()
        load_user()  
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
    refresh,
    check_authenticated,
    load_user,    
})(Layout);