import React from 'react';
import './DataSearchEngine.scss';
import SearchEngineTable from "../SearchEngineTable/SearchEngineTable";
import axios from 'axios';



class DataSearchEngine extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            dataToSearch: {
                parserID: 0,
                logDateTime: "",
                logMessage: ""
            },
            errorMessage: "",
            count: 0
        };

    }


    handleChange = (event) =>{
        const  {name, value} = event.target;
        //setting the state
        this.setState({dataToSearch: { ...this.state.dataToSearch, [name]: value }});
        //console.log("Input change detected");

        this.setState({errorMessage:""});
    }


    handleFormSubmission = (event) =>{
        event.preventDefault();  //so the page doesn't send a request to the server when the form is submitted

    }


    totalNoOfResults = async () =>{
        let results = await axios.get("http://ec2-18-117-130-40.us-east-2.compute.amazonaws.com/parser/count")
        this.setState({count: results.data});
    }

    fetchResults = async () =>{
        let mydataToSearch = this.state.dataToSearch.logDateTime; //= this.state.dataToSearch;

        try {
            let results = await axios.post("http://ec2-18-117-130-40.us-east-2.compute.amazonaws.com/parser/search", {logDateTime:mydataToSearch});

            this.setState({dataToSearch:results.data[0]});
            console.log(this.state.dataToSearch);

        }catch(error){
            this.setState({errorMessage: `${error}`});
        }

    }


    render(){
        return(
            <div className="data_search_engine_container">
                <h1 className="search_engine_heading">Search Engine</h1>
                <input type="text" placeholder="Search..." className="search_box" name="logDateTime" value={this.state.dataToSearch.logDateTime} onChange={this.handleChange}  />
                <button type="submit" className="search_btn" onClick={() => {
                    this.fetchResults();
                    this.totalNoOfResults();
                }}>Search</button>
                <SearchEngineTable dataToBePassed={this.state.dataToSearch} count={this.state.count} />
            </div>
        );
    }

}

export default DataSearchEngine;
