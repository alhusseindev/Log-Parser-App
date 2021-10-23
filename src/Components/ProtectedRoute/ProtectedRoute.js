import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const ProtectedRoute = ({authenticated, component: Component, ...rest}) =>{
    return(
        <Route {...rest} render={(props) =>{
            if(authenticated){
                return(<Component {...rest} {...props} />);
            }

            if(!authenticated){
                return(<Redirect to={{path: "/", state: {from: props.location}}} />);
            }
        }} />
    );
}


export default ProtectedRoute;
