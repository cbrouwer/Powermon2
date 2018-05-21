import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Col} from 'reactstrap';

class MeterOverview extends Component {
  constructor(props) {
    super(props);
    this.meterName = "";
    this.state = {
      meters: []
    }

    this.addMeter = this.addMeter.bind(this);

    this.getMeters();
  }

  getMeters() {
    var context = this;
    axios.get('/api/meters')
      .then(function (response) {
        context.setState({'meters': response.data})
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addMeter() {
    var context = this;
    var meterObj = {'meter': this.meterName};
    axios.post('/api/meter', meterObj)
      .then(function (response) {
        context.getMeters();
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  setMeterName(meterName) {
    this.meterName = meterName;
  }
  render() {
    return (
      <div>
        <div>
          {this.state.meters.map( (m) => {return (<div> {m.meter}</div>);})}
        </div>


        <hr/>
        <Form>
           <FormGroup row>
             <Label sm={3} for="meterId">Meter</Label>
             <Col sm={3}>
                <Input
                  type="text"
                  name="meter"
                  id="meterId"
                  onChange={evt => this.setMeterName(evt.target.value)}
                  placeholder="Naam van meter" />
              </Col>
           </FormGroup>

           <Button onClick={this.addMeter}> Toevoegen </Button>
         </Form>

     </div>
    );
  }
}

export default MeterOverview;
