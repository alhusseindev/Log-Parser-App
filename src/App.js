import React from 'react';
import LoginComponent from "./Components/Login/LoginComponent";
import SearchEngineTable from "./Components/SearchEngineTable/SearchEngineTable";
import {BrowserRouter as Router, BrowserRouter, Route, Switch} from 'react-router-dom';
import DataSearchEngine from "./Components/DataSearchEngine/DataSearchEngine";
import ParseNStore from "./Components/ParseNStore/ParseNStore";
import NavHeader from "./Components/NavHeader/NavHeader";
import './App.scss';

class App extends React.Component {
    constructor(props){
        super(props);
    }



    render() {
        return (
            <div className="app">
                <Router>
                    <NavHeader/>
                    <Switch>
                        <Route path="/data/search" render={() => <SearchEngineTable/>}/>
                        {/*** <ProtectedRoute exact path="/data/retrieval/list" component={ShippingRequest} storedToken={storedAccessToken} token={this.state.token} userEmail={this.state.passAccount.email} />
                         */}
                        <Route path="/" render={() => <ParseNStore/>}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
