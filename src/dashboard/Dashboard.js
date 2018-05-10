import React, { Component } from 'react';
import { Button,Table } from 'reactstrap';
import axios from 'axios';
import Moment from 'moment';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '', data: []};
    this.processData = this.processData.bind(this);
  }



  componentDidMount() {
    var context = this;
    axios.get('/api/months')
      .then(function (response) {
        context.setState({text: response.data.express})
        context.processData(response.data.docs);
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  processData(data) {
    const result = {};
    for (var i=0;i < data.length; i++) {
      const elem = data[i];
      const date = Moment(elem.ts);

      elem.date = date.subtract(1, 'months');
      result[this.getDateKey(date)] = elem
    }
    this.setState({data: result})
  }

  getDateKey(date) {
    return date.format('YMM');
  }
  formatKwhNumber(number) {
    if (!number) return '-'
    return number.toFixed(0) + ' kWh'
  }

  getTableData() {
    var context = this;
    return Object.keys(this.state.data).sort().reverse().map(function(key, index) {
      const elem = context.state.data[key];
      var elemDate = Moment(elem.date);
      const lastMonthKey = context.getDateKey(elemDate.subtract(1, 'months'));
      const lastMonthElem = context.state.data[lastMonthKey];
      const lastMonthDiff = lastMonthElem ? ( elem.d_total - lastMonthElem.d_total ) : NaN;

      var elemDate = Moment(elem.date);
      const lastYearKey = context.getDateKey(elemDate.subtract(1, 'years'));
      const lastYearElem = context.state.data[lastYearKey];
      const lastYearDiff = lastYearElem ? (elem.d_total - lastYearElem.d_total ) : NaN;


      return (<tr key={key}>
        <th scope="row">{elem.date.format('MMMM Y')}</th>
        <td>{context.formatKwhNumber(elem.d_total)}</td>
        <td>{context.formatKwhNumber(lastMonthDiff)}</td>
        <td>{context.formatKwhNumber(lastYearDiff)}</td>
      </tr>);
    })
  }

  render() {
    var context = this;

    return (
      <div>
      <Button color="danger">{this.state.text}</Button>

      <Table>
       <thead>
         <tr>
           <th>Month</th>
           <th>Usage</th>
           <th>Diff previous month</th>
           <th>Diff last year</th>
         </tr>
       </thead>
       <tbody>
       {this.getTableData()}
       </tbody>
     </Table>
     </div>
    );
  }
}

export default Dashboard;
