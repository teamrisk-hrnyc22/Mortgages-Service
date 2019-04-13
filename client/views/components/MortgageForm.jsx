import React from 'react';
// import Chart from './Chart.jsx';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import CountUp from 'react-countup';
import Piechart from './Piechart.jsx';



const axios = require('axios');

const strToNum = str => {

    //Find 1-3 digits followed by exactly 3 digits & a comma or end of string
    let regx = /(\d{1,3})(\d{3}(?:,|$))/;
    let currStr;
 
    do {
        currStr = (currStr || str.split(`.`)[0])
            .replace( regx, `$1,$2`)
    } while (currStr.match(regx)) //Stop when there's no match & null's returned
 
    return ( str.split(`.`)[1] ) ?
            currStr.concat(`.`, str.split(`.`)[1]) :
            currStr;
 
 };

export default class MortgageForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            path: window.location.pathname,
            mortgageFields : {
                homePrice: 100000,
                downPayment: 20000,
                downPaymentPerc: 20,
                loanProgram: 30,
                interestRate: 4,
                propertyTax: 800,
                propertyTaxPerc: 1,
                homeInsurance: 12600,
                hoaDues: 296
            }
        }
        // (mortgageFields.homePrice * downPaymentPerc)
        // (mortgageFields.homePrice * propertyTaxPerc)
        this.handleHomePriceSubmit = this.handleHomePriceSubmit.bind(this);
        this.handleDownPaymentPercChange = this.handleDownPaymentPercChange.bind(this);
        this.handleDownPaymentChange = this.handleDownPaymentChange.bind(this);
        this.handlePropertyTaxPercChange = this.handlePropertyTaxPercChange.bind(this);
        this.handleLoanProgramChange = this.handleLoanProgramChange.bind(this);
        this.handleInterestRateChange = this.handleInterestRateChange.bind(this);
        this.handlePropertyTaxChange = this.handlePropertyTaxChange.bind(this);
        this.calculateFieldsHomePrice = this.calculateFieldsHomePrice.bind(this);
        this.calculateFieldsDownPaymentPerc = this.calculateFieldsDownPaymentPerc.bind(this);
        this.calculateFieldsPropertyTaxPerc = this.calculateFieldsPropertyTaxPerc.bind(this);
        this.calculateFieldsLoanProgram = this.calculateFieldsLoanProgram.bind(this);
        this.returnState = this.returnState.bind(this);
    }

    componentDidMount() {
        var that = this;
        var url;
        var endpoint = this.state.path === '/' ? 1 : this.state.path; 

        //for development
        if ( endpoint === 1 ) {
            url = 'http://localhost:3008/api/price'
        } else {
            url = `http://localhost:3008/api/price${this.state.path}`;
            
        }
        // for deployment
        // if ( endpoint === 1 ) {
        //     url = 'http://18.188.36.91:3008/api/price'
        // } else {
        //     url = `http://18.188.36.91:3008/api/price${this.state.path}`;
        // }

        axios.get(url).then(function(response) {
            console.log('response from server at /price ', response);
            console.log('this is the response.data.price ', response.data.price);

            var hpfields = that.calculateFieldsHomePrice(response.data.price);
            var ptfields = that.calculateFieldsPropertyTaxPerc(that.state.mortgageFields.homePrice)
        
            that.setState({
                mortgageFields : {
                    homePrice: response.data.price,
                    downPayment: hpfields.downPayment,
                    downPaymentPerc: that.state.mortgageFields.downPaymentPerc,
                    loanProgram: that.state.mortgageFields.loanProgram,
                    interestRate: that.state.mortgageFields.interestRate,
                    propertyTax: hpfields.propertyTax,
                    propertyTaxPerc: that.state.mortgageFields.propertyTaxPerc,
                    homeInsurance: that.state.mortgageFields.homeInsurance,
                    hoaDues: that.state.mortgageFields.hoaDues
                }
            })
        }).catch((err)=>console.error('componentDidMount',err));
    }

    returnState() {

        var updatedState = {
            homePrice: this.state.mortgageFields.homePrice,
            downPayment: this.state.mortgageFields.downPayment,
            downPaymentPerc: this.state.mortgageFields.downPaymentPerc,
            loanProgram: this.state.mortgageFields.loanProgram,
            interestRate: this.state.mortgageFields.interestRate,
            propertyTax: this.state.mortgageFields.propertyTax,
            propertyTaxPerc: this.state.mortgageFields.propertyTaxPerc,
            homeInsurance: this.state.mortgageFields.homeInsurance,
            hoaDues: this.state.mortgageFields.hoaDues
        }

        return updatedState;
    }

    calculateFieldsHomePrice(homePrice) {
        var rpt = this.state.mortgageFields.propertyTaxPerc/100
        var rdp = this.state.mortgageFields.downPaymentPerc/100
        let obj = {};
        obj.downPayment = rdp * homePrice;
        obj.propertyTax = ( homePrice * rpt);
        
        return obj;
    }

    calculateFieldsDownPaymentPerc(downPaymentPerc) {
        let obj = {};
        obj.downPayment = (downPaymentPerc/100) * this.state.mortgageFields.homePrice;

        return obj;
    }
    calculateFieldsPropertyTaxPerc(propertyTaxPerc) {
        var result = typeof propertyTaxPerc;
        console.log('result: ', result);
        let obj = {};
        obj.propertyTax = (this.state.mortgageFields.homePrice - this.state.mortgageFields.downPayment) * (propertyTaxPerc/100);

        return obj;
    }

    calculateFieldsLoanProgram(program) {
        let obj = {};

        if ( program === '30-year fixed' ) {
            obj.interestRate = 4.00;
        } else if ( program === '15-year fixed' ) {
            obj.interestRate = 4.50;
        } else if ( program === '5/1 ARM' ) {
            obj.interestRate = 4.0;
        }

        return obj;
    }

    handleDownPaymentChange(e){
        e.preventDefault();
        // onChange update: montDP, DPPerc, PT, and IR
        console.log('changing down payment with', e.target.value)
        var num = parseInt(e.target.value);
        var updatedState = this.returnState();
        // bug output if you take the dp down to 0 and add 1 again. The DPPerc will stay 0
        if (!isNaN(num)) {
            updatedState.downPayment = num;
            if (this.state.mortgageFields.downPayment !== 0 ) {
                // javascript math is funky so we have to do this to get the correct output
                if ( num === this.state.mortgageFields.homePrice ) {
                    updatedState.downPaymentPerc = 100;
                } else {
                    updatedState.downPaymentPerc = ((num / this.state.mortgageFields.homePrice ) * 100);
                    console.log('updatedState.downPaymentPerc: ', updatedState.downPaymentPerc);
                }
                
            }
            this.setState({ mortgageFields: updatedState });
        } else {
            updatedState.downPayment = 0;
            updatedState.downPaymentPerc = 0;
            this.setState({ mortgageFields: updatedState });
        }
    }

    handleDownPaymentPercChange(e) {
        e.preventDefault();
        // onChange update:  DP, IR
        console.log('changing down payment percentage with', e.target.value)
        var num = parseFloat(e.target.value);
        var updatedState = this.returnState();

        if (!isNaN(num)) {
            var dpfields = this.calculateFieldsDownPaymentPerc(num);
            updatedState.downPayment = dpfields.downPayment;
            updatedState.downPaymentPerc = num;
            this.setState({ mortgageFields: updatedState });
        } else {
            updatedState.downPaymentPerc = 0;
            updatedState.downPayment = 0;
            this.setState({ mortgageFields: updatedState });
        }
    }

    handleHomePriceSubmit(e) {
        e.preventDefault();
        // onChange update: DP, PT, and IR
        console.log('changing home price with', e.target.value)
        var num = parseInt(e.target.value);
        var updatedState = this.returnState();

        if (!isNaN(num)) {
            var hpfields = this.calculateFieldsHomePrice(num);
            console.log('hpfields: ', hpfields);
            updatedState.homePrice = parseInt(num);
            updatedState.downPayment = hpfields.downPayment;

            this.setState({ mortgageFields: updatedState });
        } else {
            updatedState.homePrice = '';
            this.setState({ mortgageFields: updatedState });
        }
    }

    handlePropertyTaxChange(e) {
        e.preventDefault();
        // onChange update: montDP, DPPerc, PT, and IR
        console.log('changing property tax  with', e.target.value)
        var num = parseInt(e.target.value);
        var updatedState = this.returnState();
        // bug output if you take the dp down to 0 and add 1 again. The DPPerc will stay 0
        if (!isNaN(num)) {
            updatedState.propertyTax = num;
            if (this.state.mortgageFields.propertyTax !== 0 ) {
                // javascript math is funky so we have to do this to get the correct output
                if ( num === this.state.mortgageFields.homePrice ) {
                    updatedState.propertyTaxPerc = 100;
                } else {
                    updatedState.propertyTaxPerc = ((num / this.state.mortgageFields.homePrice ) * 100);
                    console.log('updatedState.propertyTaxPer: ', updatedState.propertyTaxPerc);
                }
                
            }
            this.setState({ mortgageFields: updatedState });
        } else {
            updatedState.propertyTax = 0;
            updatedState.propertyTaxPerc = 0;
            this.setState({ mortgageFields: updatedState });
        }
    }

    handlePropertyTaxPercChange(e) {
        e.preventDefault();
        // onChange update: PT
        console.log('changing property tax percentage with', e.target.value)
        var num = parseFloat(e.target.value);
        var updatedState = this.returnState();

        if (!isNaN(num)) {
            var ptfields = this.calculateFieldsPropertyTaxPerc(num);
            updatedState.propertyTaxPerc = num;
            updatedState.propertyTax = ptfields.propertyTax;
            this.setState({ mortgageFields: updatedState});
        } else {
            updatedState.propertyTaxPerc = 0;
            updatedState.propertyTax = 0;
            this.setState({ mortgageFields: updatedState })
        }
    }

    handleInterestRateChange(e) {
        e.preventDefault();

        console.log('changing interestRate with', e.target.value)
        var num = parseInt(e.target.value);
        console.log('this is the num', num)

        var updatedState = this.returnState();

        if (!isNaN(num)) {
            updatedState.interestRate = num;

            this.setState(updatedState);
        } else {
            updatedState.interestRate = 1;

            this.setState({ mortgageFields: updatedState});
        }
    }
    

    handleLoanProgramChange(e) {
        e.preventDefault();
        // onchange update: IRq
        console.log('changing home price with', e.target.value)
        var updatedState = this.returnState();
        
        if (e.target.value === '30-year fixed') {
            updatedState.loanProgram = 30;
            this.setState({ mortgageFields: updatedState });

        } else if (e.target.value === '15-year fixed') {
            updatedState.loanProgram = 15;
            this.setState({ mortgageFields: updatedState });
        } else {
            updatedState.loanProgram = 5;
            this.setState({ mortgageFields: updatedState });
        }
    }

    render() {
        var homePrice = this.state.mortgageFields.homePrice;
        console.log('homePrice: ', homePrice);
        var term = 360
        
        if (!isNaN(this.state.mortgageFields.interestRate)) {
            var apr = this.state.mortgageFields.interestRate / 1200;
        } else {
            var apr = 0;
        }
        console.log('apr: ', apr);
        var amt = this.state.mortgageFields.homePrice - this.state.mortgageFields.downPayment;
        console.log('amt: ', amt);

        var loanProgram = this.state.mortgageFields.loanProgram;
        console.log('loanProgram: ', loanProgram);
        console.log('type of loanProgram'+ (typeof loanProgram));
        const LOANPROGRAM = loanProgram * 12;

        var monthlyPI = (amt*(apr * Math.pow((1 + apr), LOANPROGRAM))/(Math.pow((1 + apr), LOANPROGRAM) - 1)).toFixed(0);
        const MONTHLYPI = parseInt(monthlyPI);
        console.log('MONTHLYPI: ', MONTHLYPI);
        console.log('type of MONTHLYPI'+ (typeof MONTHLYPI));
    
        var propertyTax = (this.state.mortgageFields.propertyTax/12).toFixed(0)
        const PROPERTYTAX = parseInt(propertyTax);
        var homeInsurance = (this.state.mortgageFields.homeInsurance/12).toFixed(0)
        const HOMEINSURANCE =parseInt(homeInsurance);

        var totalPayment = MONTHLYPI + (this.state.mortgageFields.propertyTax/12) + (this.state.mortgageFields.homeInsurance/12);

        var width = 400,
            height = 400,
            radius = Math.min(width, height) / 2;
            
        return (
            <div className="layoutBrett">
                <h1>Mortgage Calculator</h1>
                <br></br>
                <p>Use our home loan calculator to estimate your mortgage payment, with taxes and insurance. Simply enter the price of the home, your down payment, and details about the home loan to calculate your mortgage payment breakdown, schedule, and more.</p>
                <br></br><br></br>
                

                <form className="col-25 formBrett">
                    <div className="form-field-Brett">
                        <label className="fieldLabel">Home price</label>
                        <div className="input-overlay_left inputs-homePrice">
                            <div className="zsg-input-overlay-text_left">$</div>
                            <input name="handleHomePrice" autoComplete="off" className="inputBrett" onChange={this.handleHomePriceSubmit} type="tel" value={this.state.mortgageFields.homePrice}/>
                        </div>

                        {/* <p class="zsg-form-error-text">Invalid home price</p> */}
                    </div>
                    <div>
                        <br></br>
                        <label className="fieldLabel">Down payment</label>                        
                    </div>
                        <input autoComplete="off" className="inputBrett" type="tel" onChange={this.handleDownPaymentChange} value={this.state.mortgageFields.downPayment}/>
                        <input name="handleDownPaymentPerChange" autoComplete="off" className="inputBrett" onChange={this.handleDownPaymentPercChange} type="tel" value={this.state.mortgageFields.downPaymentPerc} />
                        
                    <div>
                        <br></br>
                        <label className="fieldLabel">Loan Program</label>
                    </div>
                        
                        <select name="handleLoanProgramChange" onChange={this.handleLoanProgramChange} >
                            <option className="inputBrett" >30-year fixed</option>
                            <option className="inputBrett" >15-year fixed</option>
                            <option className="inputBrett" >5/1 ARM</option>
                        </select>

                    <div>
                        <br></br><br></br>
                        {/* <a href="https://www.zillow.com/mortgage-rates/?value=1522429&amp;down=304486&amp;auto=true&amp;source=Z_Mortgage_Calc_rates" target="_blank" rel="nofollow">See current rates</a> */}
                        <label className="fieldLabel">Interest rate</label>
                    </div>
                        <input name="handleInterestRateChange" autoComplete="off" className="inputBrett" type="tel" value={this.state.mortgageFields.interestRate} onChange={this.handleInterestRateChange}/>
                    <div>
                    <br></br><br></br>
                        <label className="fieldLabel">Property tax</label>
                    </div>
                        <input autoComplete="off" className="inputBrett" type="tel" value={this.state.mortgageFields.propertyTax} onChange={this.handlePropertyTaxChange} />
                        <input name="handlePropertyTaxPercChange" autoComplete="off" className="inputBrett" onChange={this.handlePropertyTaxPercChange} type="tel" value={this.state.mortgageFields.propertyTaxPerc} />
                    <div>
                        <br></br>
                        <label className="fieldLabel">Home Insurance</label>
                    </div>
                        <input autoComplete="off" className="inputBrett" type="tel" defaultValue={this.state.mortgageFields.homeInsurance} />
                    <div>
                        <br></br>
                        <label className="fieldLabel">HOA dues</label>
                    </div>
                        <input autoComplete="off" className="inputBrett" type="tel" defaultValue={this.state.mortgageFields.hoaDues} />
                </form>
                <div className="col-75" id="donut">
                <p className="countLabelBrett">Your payment</p>
                        <CountUp
                            start={0}
                            end={totalPayment}
                            duration={1}
                            separator=","
                            decimal=","
                            prefix="$"
                            className="countUpBrett"
                        >
                            {/* {({ countUpRef, start }) => (
                                <div>
                                <span ref={countUpRef} />
                                <button onClick={start}>Start</button>
                                </div>
                            )} */}
                        </CountUp>
                    {/* <Chart /> */}
                    {/* <PieChart
                        data={[
                            { title: 'One', value: 10, color: '#E38627' },
                            { title: 'Two', value: 15, color: '#C13C37' },
                            { title: 'Three', value: 20, color: '#6A2135' },
                        ]}
                    /> */}
                    {/* <ReactMinimalPieChart
                      data={[
                        {
                        title: 'One',
                        value: 10,
                        color: '#E38627'
                        },
                        {
                        title: 'Two',
                        value: 15,
                        color: '#C13C37'
                        },
                        {
                        title: 'Three',
                        value: 20,
                        color: '#6A2135'
                        }
                    ]}
                      lineWidth={15}
                    /> */}
                    <ReactMinimalPieChart
                        data={[
                            {
                            title: 'P & I',
                            value: MONTHLYPI,
                            color: '#1274e4'
                            },
                            {
                            title: 'taxes',
                            value: PROPERTYTAX,
                            color: '#62aef7'
                            },
                            {
                            title: 'insurance',
                            value: HOMEINSURANCE,
                            color: '#3390e9'
                            }
                        ]}
                        style= {{height: '400px'}}
                        animate 
                        lineWidth={15} 
                        label 
                        labelStyle={{
                            fontSize: '5px', 
                            fontFamily: 'sans-serif'
                        }} 
                        radius={35} 
                        labelPosition={112}
                    />
                    
                    
                </div>
                <svg viewBox="0 225 600 450">
                    <Piechart x={width} y={height} outerRadius={radius * 0.5} innerRadius={radius * 0.4}
                        data={[
                            {label: 'P & I', value: MONTHLYPI},
                            {label: 'Taxes', value: PROPERTYTAX},
                            {label: 'Insurance', value: HOMEINSURANCE}
                        ]} />

                </svg>
            </div>
        );
    }

}
 // onEnd={() => console.log('Ended! 👏')}
                    // onStart={() => console.log('Started! 💨')}

