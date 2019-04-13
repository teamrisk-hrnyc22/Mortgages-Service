
// should separate this out into separate controllers themselves
module.exports = {

  handleInputChange: function handleInputChange(e, context) {
    console.log('handle input change e target name: ', e.target.name)
  
    // onChange update: DP, PT, and IR
    if ( e.target.name === 'handleHomePrice' ) {
  
        console.log('changing home price with', e.target.value)
        var num = parseInt(e.target.value);
        var updatedState = context.returnState();
  
        if (!isNaN(num)) {
            var hpfields = this.calculateFieldsHomePrice(num, context);
            console.log('hpfields: ', hpfields);
            updatedState.homePrice = parseInt(num);
            updatedState.downPayment = hpfields.downPayment;
  
            context.setState({ mortgageFields: updatedState });
        } else {
            updatedState.homePrice = '';
            context.setState({ mortgageFields: updatedState });
        }
    } else if ( e.target.name === 'handleDownPaymentPerChange' ) {
        // onChange update:  DP, IR
        console.log('changing down payment percentage with', e.target.value)
        var num = parseFloat(e.target.value);
        var updatedState = context.returnState();
  
        if (!isNaN(num)) {
            var dpfields = this.calculateFieldsDownPaymentPerc(num, context);
            updatedState.downPayment = dpfields.downPayment;
            updatedState.downPaymentPerc = num;
            context.setState({ mortgageFields: updatedState });
        } else {
            updatedState.downPaymentPerc = 0;
            updatedState.downPayment = 0;
            context.setState({ mortgageFields: updatedState });
        }
    } else if ( e.target.name === 'handleDownPaymentChange' ) {
        // onChange update: montDP, DPPerc, PT, and IR
        console.log('changing down payment with', e.target.value)
        var num = parseInt(e.target.value);
        var updatedState = context.returnState();
        // bug output if you take the dp down to 0 and add 1 again. The DPPerc will stay 0
        if (!isNaN(num)) {
            updatedState.downPayment = num;
            if (context.state.mortgageFields.downPayment !== 0 ) {
                // javascript math is funky so we have to do context to get the correct output
                if ( num === context.state.mortgageFields.homePrice ) {
                    updatedState.downPaymentPerc = 100;
                } else {
                    updatedState.downPaymentPerc = ((num / context.state.mortgageFields.homePrice ) * 100);
                    console.log('updatedState.downPaymentPerc: ', updatedState.downPaymentPerc);
                }
                
            }
            context.setState({ mortgageFields: updatedState });
        } else {
            updatedState.downPayment = 0;
            updatedState.downPaymentPerc = 0;
            context.setState({ mortgageFields: updatedState });
        }
    } else if ( e.target.name === 'handleLoanProgramChange' ) {
        // onchange update: IR
        console.log('changing home price with', e.target.value)
        var updatedState = context.returnState();
        
        if (e.target.value === '30-year fixed') {
            updatedState.loanProgram = 30;
            context.setState({ mortgageFields: updatedState });
  
        } else if (e.target.value === '15-year fixed') {
            updatedState.loanProgram = 15;
            context.setState({ mortgageFields: updatedState });
        } else {
            updatedState.loanProgram = 5;
            context.setState({ mortgageFields: updatedState });
        }
        
    } else if ( e.target.name === 'handlePropertyTaxPercChange' ) {
        // onChange update: PT
        console.log('changing property tax percentage with', e.target.value)
        var num = parseFloat(e.target.value);
        var updatedState = context.returnState();
  
        if (!isNaN(num)) {
            var ptfields = this.calculateFieldsPropertyTaxPerc(num, context);
            updatedState.propertyTaxPerc = num;
            updatedState.propertyTax = ptfields.propertyTax;
            context.setState({ mortgageFields: updatedState});
        } else {
            updatedState.propertyTaxPerc = 0;
            updatedState.propertyTax = 0;
            context.setState({ mortgageFields: updatedState })
        }
    } else if ( e.target.name === 'handleInterestRateChange' ) {
        console.log('changing interestRate with', e.target.value)
        var num = parseInt(e.target.value);
        console.log('this is the num', num)
  
        var updatedState = context.returnState();
  
        if (!isNaN(num)) {
            updatedState.interestRate = num;
  
            context.setState({ mortgageFields: updatedState});
            this.calculateMonthlyPayment(context);
        } else {
            updatedState.interestRate = 1;
  
            context.setState({ mortgageFields: updatedState});
        }
    } else if ( e.target.name === 'handlePropertyTaxChange' ) {
        // onChange update: montDP, DPPerc, PT, and IR
        console.log('changing property tax  with', e.target.value)
        var num = parseInt(e.target.value);
        var updatedState = context.returnState();
        // bug output if you take the dp down to 0 and add 1 again. The DPPerc will stay 0
        if (!isNaN(num)) {
            updatedState.propertyTax = num;
            if (context.state.mortgageFields.propertyTax !== 0 ) {
                // javascript math is funky so we have to do context to get the correct output
                if ( num === context.state.mortgageFields.homePrice ) {
                    updatedState.propertyTaxPerc = 100;
                } else {
                    updatedState.propertyTaxPerc = ((num / context.state.mortgageFields.homePrice ) * 100);
                    console.log('updatedState.propertyTaxPer: ', updatedState.propertyTaxPerc);
                }
                
            }
            context.setState({ mortgageFields: updatedState });
        } else {
            updatedState.propertyTax = 0;
            updatedState.propertyTaxPerc = 0;
            context.setState({ mortgageFields: updatedState });
        }
    }
  },
  calculateFieldsDownPaymentPerc: function calculateFieldsDownPaymentPerc (downPaymentPerc, context) {
    let obj = {};
    obj.downPayment = (downPaymentPerc/100) * context.state.mortgageFields.homePrice;

    return obj;
},
  calculateFieldsHomePrice: function calculateFieldsHomePrice (homePrice, context) {
    var rpt = context.state.mortgageFields.propertyTaxPerc/100
    var rdp = context.state.mortgageFields.downPaymentPerc/100
    let obj = {};
    obj.downPayment = rdp * homePrice;
    obj.propertyTax = ( homePrice * rpt);
    
    return obj;
  },
  calculateFieldsPropertyTaxPerc: function calculateFieldsPropertyTaxPerc (propertyTaxPerc, context) {
    var result = typeof propertyTaxPerc;
    console.log('result: ', result);
    let obj = {};
    obj.propertyTax = (context.state.mortgageFields.homePrice - context.state.mortgageFields.downPayment) * (propertyTaxPerc/100);

    return obj;
  },
  calculateMonthlyPayment: function calculateMonthlyPayment ( context ) {

    if (!isNaN(context.state.mortgageFields.interestRate)) {
      var apr = context.state.mortgageFields.interestRate / 1200;
    } else {
      var apr = 0;
    }
  
    var amt = context.state.mortgageFields.homePrice - context.state.mortgageFields.downPayment;
    var loanProgram = context.state.mortgageFields.loanProgram;
    const LOANPROGRAM = loanProgram * 12;
  
    var monthlyPI = (amt*(apr * Math.pow((1 + apr), LOANPROGRAM))/(Math.pow((1 + apr), LOANPROGRAM) - 1)).toFixed(0);
    const MONTHLYPI = parseInt(monthlyPI);
  
    var propertyTax = (context.state.mortgageFields.propertyTax/12).toFixed(0)
    const PROPERTYTAX = parseInt(propertyTax);
  
    var homeInsurance = (context.state.mortgageFields.homeInsurance/12).toFixed(0)
    const HOMEINSURANCE =parseInt(homeInsurance);
  
    var TOTALPAYMENT = MONTHLYPI + (context.state.mortgageFields.propertyTax/12) + (context.state.mortgageFields.homeInsurance/12);
  
    return {
      MONTHLYPI: MONTHLYPI,
      PROPERTYTAX: PROPERTYTAX,
      HOMEINSURANCE: HOMEINSURANCE,
      TOTALPAYMENT: TOTALPAYMENT
    }
  }
}

 // onEnd={() => console.log('Ended! 👏')}
 // onStart={() => console.log('Started! 💨')}


// saving to add thousands comma to number feature
// const strToNum = str => {

//     //Find 1-3 digits followed by exactly 3 digits & a comma or end of string
//     let regx = /(\d{1,3})(\d{3}(?:,|$))/;
//     let currStr;
 
//     do {
//         currStr = (currStr || str.split(`.`)[0])
//             .replace( regx, `$1,$2`)
//     } while (currStr.match(regx)) //Stop when there's no match & null's returned
 
//     return ( str.split(`.`)[1] ) ?
//             currStr.concat(`.`, str.split(`.`)[1]) :
//             currStr;
 
//  };