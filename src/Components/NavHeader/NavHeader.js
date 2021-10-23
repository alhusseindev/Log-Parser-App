import React from 'react';
import './NavHeader.scss';
import { Link } from 'react-router-dom';
import NuspireLogo from '../../Media Assets/Nuspire_logo.png';


//logout function
//This logout function deletes the access token and app_state from the local storage.
let logout = () =>{
    localStorage.removeItem("app_state");
    localStorage.removeItem("accessToken");
    localStorage.clear();
}



function NavHeader() {
    return (
        <nav className="nav_container">
            <div className="nav_logo_container">
               <a href="https://www.nuspire.com/" className="logo_link"><img src={NuspireLogo} alt="Nuspire" className="logo_img" /></a>
            </div>

            {/** NavHeaderLinks() */}
            <div className="logged_in_links_container">
                <Link to="/data/search" className="logged_in_link">Search Engine</Link>
                <Link to="/" className="logged_in_link">Parser</Link>
                <a href="https://www.nuspire.com/" onClick={() => logout()} className="logged_in_link">Logout</a>
            </div>

        </nav>
    );

}


/** This function checks for the access token in local storage, if found the navbar links are visible
if not they do not. */

let NavHeaderLinks = () =>{
    let myToken = localStorage.getItem("accessToken");


    if(myToken) {
        return (
            <div className="logged_in_links_container">
                <Link to="/data/retrieval/list" className="logged_in_link">Search Engine</Link>
                <Link to="/data/parser">Parser</Link>
                <a href="https://www.nuspire.com/" onClick={() => logout()}>Logout</a>
            </div>
        );
    }
}





export default NavHeader;
