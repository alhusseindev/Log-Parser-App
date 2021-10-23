import React from 'react';
import './ParseNStore.scss';
import axios from 'axios';
import data from "bootstrap/js/src/dom/data";

class ParseNStore extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            dataToParse: {
                logDateTime: "",
                logMessage: ""
            },
            errorMessage: ""
        };
    }



    handleChange = (event) =>{
        const  {name, value} = event.target;
        //setting the state
        this.setState({dataToParse: { ...this.state.dataToParse, [name]: value }});
        //console.log("Input change detected");

        this.setState({errorMessage:""});
    }


    handleFormSubmission = (event) =>{
        event.preventDefault();  //so the page doesn't send a request to the server when the form is submitted

    }

    parseData = async () =>{
        try{
        let dataToSend;
        let firstToken;
        let secondToken;

        dataToSend = String(this.state.dataToParse.logMessage);
        let spacedData = typeof dataToSend === "string" ? dataToSend.split(" ") : this.setState({errorMessage: "Data is not a string"});

        firstToken = spacedData[0];
        secondToken = spacedData[1];

        this.setState({logDateTime: firstToken});
        this.setState({logMessage: secondToken});




        let result = await axios.post("http://ec2-18-117-130-40.us-east-2.compute.amazonaws.com/parser/new", {logDateTime: firstToken, logMessage: secondToken});
        this.setState({errorMessage: "Data Parsed & Stored Successfully!"});
        console.log("Parsed", result);


        }catch(error){
            this.setState({errorMessage: `${error}`});
        }
    }

    render(){
        return(
            <div className="parse_n_store_parent_container">
                <div className="parse_n_store_child_container">
                    <h1>Parser</h1>
                    <input type="text" className="input_box" placeholder="Input to Parser..." name="logMessage" value={this.state.dataToParse.logMessage} onChange={this.handleChange} />
                    <button type="submit" className="submit_button" onClick={() => this.parseData()}>Parse</button>
                    {this.state.errorMessage}
                </div>
            </div>
        );
    }
}

export default ParseNStore;
