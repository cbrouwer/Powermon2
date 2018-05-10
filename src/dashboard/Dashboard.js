import React, { Component } from 'react';
import { Alert,Table } from 'reactstrap';
import axios from 'axios';
import Moment from 'moment';
import '../App.css';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {text: 'Button', monthData: [], current: '', currentTs: Moment()};
    this.processData = this.processData.bind(this);

    this.getCurrentData();
    var context = this;
    this.requestLoop = setInterval(function(){
      context.getCurrentData();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.requestLoop);
  }

  componentDidMount() {
    var context = this;
    axios.get('/api/months')
      .then(function (response) {
        context.processData(response.data.docs);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

 getCurrentData() {
    var context = this;

    axios.get('/api/current')
      .then(function (response) {
        context.setState({
            current: response.data.consumption,
            currentTs: Moment(response.data.date)});

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
    this.setState({monthData: result})
  }

  getDateKey(date) {
    return date.format('YMM');
  }


  formatKwhNumber(number,precision=0) {
    if (!number) return '-'
    return number.toFixed(precision)  + ' kWh';
  }
  formatDiffKwhNumber(number) {
    if (!number) return <div>-</div>
    const className = number > -1 ? 'Consumption-pos' : 'Consumption-neg';
    return <div className={className}> {this.formatKwhNumber(number)} </div>
  }

  getTableData() {
    var context = this;
    return Object.keys(this.state.monthData).sort().reverse().map(function(key, index) {
      const elem = context.state.monthData[key];
      var elemDate = Moment(elem.date);
      const lastMonthKey = context.getDateKey(elemDate.subtract(1, 'months'));
      const lastMonthElem = context.state.monthData[lastMonthKey];
      const lastMonthDiff = lastMonthElem ? ( elem.d_total - lastMonthElem.d_total ) : NaN;

      var elemDate = Moment(elem.date);
      const lastYearKey = context.getDateKey(elemDate.subtract(1, 'years'));
      const lastYearElem = context.state.monthData[lastYearKey];
      const lastYearDiff = lastYearElem ? (elem.d_total - lastYearElem.d_total ) : NaN;


      return (<tr key={key}>
        <th scope="row">{elem.date.format('MMMM Y')}</th>
        <td>{context.formatKwhNumber(elem.d_total)}</td>
        <td>{context.formatDiffKwhNumber(lastMonthDiff)}</td>
        <td>{context.formatDiffKwhNumber(lastYearDiff)}</td>
      </tr>);
    })
  }

  render() {
    var context = this;

    return (
      <div>
      <Alert color="primary">
        {this.formatKwhNumber(this.state.current, 3)} @ {this.state.currentTs.format('HH:mm:ss')}
      </Alert>

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
