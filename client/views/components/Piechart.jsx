import React, { Component } from 'react';
import { Slice } from './LabeledArc.jsx';
import d3 from 'd3';

export default class Piechart extends Component {
  constructor(props) {
    super(props)
  }

  render()  {
    let pie = d3.layout.pie()
              .sort(null)
              .value((d) => d.value)(this.props.data),
        translate = `translate(${this.props.x}, ${this.props.y})`,
        colors = d3.scale.category10();
    return (
        <g transform={translate}>
            {pie.map((d, i) => (
                <Slice key={`arc-${i}`}
                            data={d}
                            innerRadius={this.props.innerRadius}
                            outerRadius={this.props.outerRadius}
                            color={colors(i)} />))
              
            }
        </g>
    );

  }
}

// Functional Component Version
// const Piechart = ({x, y, innerRadius, outerRadius, data}) => {
//   let pie = d3.layout.pie()
//               .sort(null)
//               .value((d) => d.value)(data),
//       translate = `translate(${x}, ${y})`,
//       colors = d3.scale.category10();
//   return (
//       <g transform={translate}>
//           {pie.map((d, i) => (
//               <Slice key={`arc-${i}`}
//                           data={d}
//                           innerRadius={innerRadius}
//                           outerRadius={outerRadius}
//                           color={colors(i)} />))
                          
//           }
//       </g>
//   );
// };

// export default Piechart;