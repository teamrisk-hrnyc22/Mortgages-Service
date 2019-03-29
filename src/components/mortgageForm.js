import React from 'react';
const axios = require('axios');


export default class MortgageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homeValue : {}
        }
    }

    componentDidMount() {
        var that = this;
        axios.get('http://localhost:3008/price').then(function(response) {
            console.log('response from server at /price ', response);
            console.log('this is the response.data.price ', response.data.price);
            that.setState({
                homeValue: response.data
            })
        }).catch((err)=>console.error('componentDidMount',err));
    }

    render() {
        return (
            <div>
                <h1>Mortgage</h1>
                <form >
                <label className="fieldLabel">Home price</label>
                <span>$<input type="text" placeholder="$" value={this.state.homeValue.price}/></span>
                <button>Create</button>
                </form>
            </div>
        );
    }

}
