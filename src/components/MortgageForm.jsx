import React from 'react';
const axios = require('axios');

export default class MortgageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mortgageFields : {
                homePrice: 100000,
                downPayment: 20000,
                downPaymentPerc: .2,
                loanProgram: 30,
                interestRate: .04176,
                propertyTax: 1000,
                propertyTaxPerc: .1,
                homeInsurance: 3381,
                hoaDues: 296
            }
        }
        // (mortgageFields.homePrice * downPaymentPerc)
        // (mortgageFields.homePrice * propertyTaxPerc)
        this.handleHomePriceSubmit = this.handleHomePriceSubmit.bind(this);
        this.handleDownPaymentPercChange = this.handleDownPaymentPercChange.bind(this);
        this.handlePropertyTaxPercChange = this.handlePropertyTaxPercChange.bind(this);
        this.handleLoanProgramChange = this.handleLoanProgramChange.bind(this);
        this.calculateFieldsHomePrice = this.calculateFieldsHomePrice.bind(this);
        this.calculateFieldsDownPaymentPerc = this.calculateFieldsDownPaymentPerc.bind(this);
        this.calculateFieldsPropertyTaxPerc = this.calculateFieldsPropertyTaxPerc.bind(this);
        this.calculateFieldsLoanProgram = this.calculateFieldsLoanProgram.bind(this);
    }

    componentDidMount() {
        var that = this;
        axios.get('http://localhost:3008/price').then(function(response) {
            console.log('response from server at /price ', response);
            console.log('this is the response.data.price ', response.data.price);

            var hpfields = that.calculateFieldsHomePrice(response.data.price);
            
            that.setState({
                mortgageFields : {
                    homePrice: response.data.price,
                    downPayment: hpfields.downPayment,
                    downPaymentPerc: that.state.mortgageFields.downPaymentPerc,
                    loanProgram: that.state.mortgageFields.loanProgram,
                    interestRate: hpfields.interestRate,
                    propertyTax: hpfields.propertyTax,
                    propertyTaxPerc: that.state.mortgageFields.propertyTaxPerc,
                    homeInsurance: that.state.mortgageFields.homeInsurance,
                    hoaDues: that.state.mortgageFields.hoaDues
                }
            })
        }).catch((err)=>console.error('componentDidMount',err));
    }

    calculateFieldsHomePrice(homePrice) {
        let obj = {};
       
        obj.downPayment =this.state.mortgageFields.downPaymentPerc * homePrice;
        obj.propertyTax = this.state.mortgageFields.propertyTaxPerc * homePrice;
        obj.interestRate = Math.floor(Math.random() * 1.5) + 3; // random number btwn 3.5 & 4.5

        return obj;
    }

    calculateFieldsDownPaymentPerc(downPaymentPerc) {
        let obj = {};

        obj.downPayment = downPaymentPerc * this.state.mortgageFields.homePrice;
        obj.interestRate = Math.floor(Math.random() * 1.5) + 3; // random number btwn 3.5 & 4.5

        return obj;
    }
    calculateFieldsPropertyTaxPerc(propertyTaxPerc) {
        let obj = {};
        obj.propertyTax = this.state.mortgageFields.homePrice * propertyTaxPerc;

        return obj;
    }

    calculateFieldsLoanProgram(program) {
        let obj = {};

        if ( program === '30-year fixed' ) {
            obj.interestRate = 4.06;
        } else if ( program === '15-year fixed' ) {
            obj.interestRate = 4.50;
        } else if ( program === '5/1 ARM' ) {
            obj.interestRate = 4.0;
        }

        return obj;
    }

    handleHomePriceSubmit(e) {
        e.preventDefault();
        // onChange update: DP, PT, and IR
        console.log('changing home price with', e.target.value)
        var num = parseInt(e.target.value);
        console.log('this is the num', num)
        if (!isNaN(num)) {
            
            var hpfields = this.calculateFieldsHomePrice(num);
            console.log(hpfields);
            this.setState({
                mortgageFields : {
                    homePrice: parseInt(num),
                    downPayment: hpfields.downPayment,
                    downPaymentPerc: this.state.mortgageFields.downPaymentPerc,
                    loanProgram: this.state.mortgageFields.loanProgram,
                    interestRate: hpfields.interestRate,
                    propertyTax: hpfields.propertyTax,
                    propertyTaxPerc: this.state.mortgageFields.propertyTaxPerc,
                    homeInsurance: this.state.mortgageFields.homeInsurance,
                    hoaDues: this.state.mortgageFields.hoaDues
                }
            });
        }
    }

    handleDownPaymentPercChange(e) {
        e.preventDefault();
        // onChange update:  DP, IR
        
        console.log('changing down payment percentage with', e.target.value)
        var num = parseFloat(e.target.value);
        console.log('this is the num', num)
        if (!isNaN(num)) {
            var dpfields = this.calculateFieldsDownPaymentPerc(num);
            console.log(dpfields);
            this.setState({
                mortgageFields : {
                    homePrice: this.state.mortgageFields.homePrice,
                    downPayment: dpfields.downPayment,
                    downPaymentPerc: num,
                    loanProgram: this.state.mortgageFields.loanProgram,
                    interestRate: dpfields.interestRate,
                    propertyTax: this.state.mortgageFields.propertyTax,
                    propertyTaxPerc: this.state.mortgageFields.propertyTaxPerc,
                    homeInsurance: this.state.mortgageFields.homeInsurance,
                    hoaDues: this.state.mortgageFields.hoaDues
                }
            });
        }
    }

    handlePropertyTaxPercChange(e) {
        e.preventDefault();
        // onChange update: PT
        
        console.log('changing property tax percentage with', e.target.value)
        var num = parseFloat(e.target.value);
        console.log('this is the num', num)
        if (!isNaN(num)) {
            var ptfields = this.calculateFieldsPropertyTaxPerc(num);
            console.log(ptfields);
            this.setState({
                mortgageFields : {
                    homePrice: this.state.mortgageFields.homePrice,
                    downPayment: this.state.mortgageFields.downPayment,
                    downPaymentPerc: this.state.mortgageFields.downPaymentPerc,
                    loanProgram: this.state.mortgageFields.loanProgram,
                    interestRate: this.state.mortgageFields.interestRate,
                    propertyTax: ptfields.propertyTax,
                    propertyTaxPerc: num,
                    homeInsurance: this.state.mortgageFields.homeInsurance,
                    hoaDues: this.state.mortgageFields.hoaDues
                }
            });
        }
    }

    handleLoanProgramChange() {
        e.preventDefault();
        // onchange update: IR
        console.log('changing home price with', e.target.value)
    }


    render() {
        return (
            <div>
                <h1>Mortgage Brett</h1>
                <form >
                    <p>
                        <label className="fieldLabel">Home price</label>
                        <input onChange={this.handleHomePriceSubmit} type="text" placeholder={this.state.mortgageFields.homePrice}/>
                        <input onSubmit={this.handleHomePriceSubmit} type="submit" className="hiddenButton"/>
                    </p>
                    <p>
                        <label className="fieldLabel">Down payment</label>
                        <input type="text" placeholder={this.state.mortgageFields.downPayment} />
                        <input onChange={this.handleDownPaymentPercChange} type="text" placeholder={this.state.mortgageFields.downPaymentPerc} />
                    </p>
                    <p>
                        <label className="fieldLabel">Loan Program</label>
                        <input type="text" placeholder={this.state.mortgageFields.loanProgram} />
                    </p>
                    
                    <p>
                        <label className="fieldLabel">Interest rate</label>
                        <input type="text" placeholder={this.state.mortgageFields.interestRate}/>
                    </p>
                    <p>
                        <label className="fieldLabel">Property tax</label>
                        <input type="text" placeholder={this.state.mortgageFields.propertyTax} />
                        <input onChange={this.handlePropertyTaxPercChange} type="text" placeholder={this.state.mortgageFields.propertyTaxPerc} />
                    </p>
                    <p>
                        <label className="fieldLabel">Home Insurance</label>
                        <input type="text" placeholder={this.state.mortgageFields.homeInsurance} />
                    </p>
                    <p>
                        <label className="fieldLabel">HOA dues</label>
                        <input type="text" placeholder={this.state.mortgageFields.hoaDues} />
                    </p>
                </form>
            </div>
        );
    }

}
