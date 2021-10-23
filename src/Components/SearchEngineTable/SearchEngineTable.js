import React from 'react';
import './SearchEngineTable.scss';
import { Table } from 'react-bootstrap';
import axios from "axios";




class SearchEngineTable extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            searchResults: [
                    {
                        parserID: 0,
                        logDateTime: "",
                        logMessage: "",
                    }
                ],

            dataToSearch: {
                parserID: 0,
                logDateTime: "",
                logMessage: ""
            },

            count: 0,
            errorMessage: ""

        };
    }


    handleDataToSearchChange = (event) =>{
        const  {name, value} = event.target;
        //setting the state
        this.setState({dataToSearch: { ...this.state.dataToSearch, [name]: value }});
        //console.log("Input change detected");

        this.setState({errorMessage:""});
    }



    totalNoOfResults = async () =>{
        let results = await axios.get("http://ec2-18-117-130-40.us-east-2.compute.amazonaws.com/parser/count")
        this.setState({count: results.data});
    }



    addRow = ({parserID, logDateTime, logMessage}) =>{

        return(
            <tr className="resultsFetched" key={parserID}>
                <td>{logDateTime}</td>
                <td>{logMessage}</td>
            </tr>
        );

    }



    fetchResults = async () =>{
        let mydataToSearch = this.state.dataToSearch.logDateTime; //= this.state.dataToSearch;

        try {
            let results = await axios.post("http://ec2-18-117-130-40.us-east-2.compute.amazonaws.com/parser/search", {logDateTime:mydataToSearch});

            //this.setState({dataToSearch:});
            if(results.data.length === 0){
                this.setState({errorMessage: "No Results Found!"});
            }else{
                this.state.searchResults.map((srItem, srIndex) => {

                    this.setState({searchResults: results.data});

                    //console.log("state: ",this.state.searchResults);
                });

            }





        }catch(error){
            this.setState({errorMessage: `${error}`});
        }


    }







    render(){
        return(
            <React.Fragment>
                <div className="data_search_engine_container">
                    <h1 className="search_engine_heading">Search Engine</h1>
                    <input type="text" placeholder="Search..." className="search_box" name="logDateTime" value={this.state.dataToSearch.logDateTime} onChange={this.handleDataToSearchChange}  />
                    <button type="submit" className="search_btn" onClick={() => {
                        this.fetchResults();
                        this.totalNoOfResults();
                    }}>Search</button>
                </div>
                <div className="search_engine_container">
                    <Table className="search_engine_table" striped bordered hover responsive style={{ width: '100%', height: '100%'}}>
                        <thead>
                        <tr>
                            <th>Time Stamp</th>
                            <th>Data</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.searchResults.map((searchResults, index) => this.addRow(searchResults))}
                        </tbody>
                        <tfoot>
                            Total Count In DB: {this.state.count}
                            <br/>
                            {this.state.errorMessage}
                        </tfoot>
                    </Table>
                </div>
            </React.Fragment>

        );
    }

}

export default SearchEngineTable;
