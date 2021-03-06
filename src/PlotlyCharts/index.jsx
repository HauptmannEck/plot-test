import React from 'react';
import Plot from 'react-plotly.js';
import budgetSummary from "../budgetSummary";
import cashFlow from "../cashFlow";

const pieChart = () => {
    const values = [];
    const labels = [];
    const directExpenses = budgetSummary.expenses.filter( ( expense ) => expense.type === 'DIRECT' );

    directExpenses.forEach( ( expense ) => {
        values.push( expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount );
        labels.push( expense.name );
    } );

    return {
        values,
        labels,
        type: 'pie'
    };
};
const directCompare = () => {
    const x = [];
    const yBudget = [];
    const yActual = [];
    const directExpenses = budgetSummary.expenses.filter( ( expense ) => expense.type === 'DIRECT' );

    directExpenses.forEach( ( expense ) => {
        x.push( expense.name );
        yBudget.push( expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount );
        yActual.push( expense.totals.find( ( item ) => item.year === 2017 && item.type === 'ACTUAL' ).amount );
    } );

    return [ {
        x,
        y: yBudget,
        type: 'bar',
        name: 'Budget'
    }, {
        x,
        y: yActual,
        type: 'bar',
        name: 'Actual'
    } ];
};
const cashFlowPoly = () => {
    const x = [];
    const yCashIn = [];
    const yCashOut = [];
    const yCashNet = [];

    cashFlow.forEach( ( expense ) => {
        x.push( expense.month );
        yCashIn.push( expense.cashIn );
        yCashOut.push( expense.cashOut );
        yCashNet.push( expense.cashIn - expense.cashOut );
    } );

    return [ {
        x,
        y: yCashIn,
        type: 'scatter',
        name: 'Cash In'
    }, {
        x,
        y: yCashOut,
        type: 'scatter',
        name: 'Cash Out'
    }, {
        x,
        y: yCashNet,
        type: 'scatter',
        name: 'Net Cash Flow'
    } ];
};

export const PlotlyCharts = () => (
    <div className="row">
        <div className="col-12">
            <h2>Plotly</h2>
            <p>
                A free wrapper of D3 with some access to the underlying d3 code.
                Not able to do some styles choices such as 3d Pie Charts, but starts with many useful features.
                Easy to work with api, but limited examples and documentation.
                Stock and Map style charts are included.
                Python options are available so one report config can work in multiple systems.
                Allows Exporting to PNG and cloud editor.
                Has a cloud editor for non-technical users.
                Does not have Drilldown functionality.
            </p>
        </div>
        <div className="col-4">
            <Plot
                data={[ pieChart() ]}
                layout={{
                    width: 600,
                    height: 500,
                    title: 'Direct Expenses'
                }}
            />
        </div>
        <div className="col-4">
            <Plot
                data={directCompare()}
                layout={{
                    width: 600,
                    height: 500,
                    barmode: 'group',
                    title: 'Budget vs Actual 2017'
                }}
            />
        </div>
        <div className="col-4">
            <Plot
                data={cashFlowPoly()}
                layout={{
                    width: 600,
                    height: 500,
                    title: 'Cash Flow 2017',
                    yaxis: {
                        zeroline: true,
                        zerolinecolor: '#969696',
                        zerolinewidth: 4,
                    },
                    xaxis: {
                        tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        ticktext:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',  'Sep', 'Oct', 'Nov', 'Dec'],
                    },
                    legend: {
                        orientation: "h",
                        xanchor: 'left',
                        yanchor: 'top'
                    }
                }}
            />
        </div>
    </div>
);
