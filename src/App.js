import React, { Component } from 'react';

import { PlotlyCharts } from './PlotlyCharts';
import { HighCharts } from "./HighCharts";
import { C3Charts } from "./C3Charts";


class App extends Component {
    render() {
        return (
            <div className="mx-5 my-3">
                <PlotlyCharts/>
                <HighCharts/>
                <C3Charts/>
            </div>
        );
    }
}

export default App;
