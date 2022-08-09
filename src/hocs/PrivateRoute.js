import { Component } from "react";
import { Route, Navigate } from "react-router-dom";
import { connect } from "react-redux";
const PrivateRoute =({
    element:Element,
    auth :{isAuthenticated, loading},
    ...rest
})=>(
    <Route
        {...rest}
        render={props=> !isAuthenticated && !loading ? (
            <Navigate to="/login"></Navigate>
        ):(
            <>
            <Element {...props}/>
            </>
        )}
    />
)

const mapStateToProps = state =>({
    auth:state.Auth.isAuthenticateds
})
export default connect(mapStateToProps,{

})(PrivateRoute);