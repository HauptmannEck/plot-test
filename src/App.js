import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import budgetSummary from './budgetSummary';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcarts3D from 'highcharts/highcharts-3d';

Highcarts3D( Highcharts );

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

const pieChartHigh = () => {
    const data = [];
    const directExpenses = budgetSummary.expenses.filter( ( expense ) => expense.type === 'DIRECT' );

    directExpenses.forEach( ( expense ) => {
        data.push( {
            y: expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount,
            name: expense.name,
        } )
    } );

    return {
        credits: {
            enabled: false,
        },
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: 'Direct Expenses'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    connectorShape: 'crookedLine',
                    alignTo: 'plotEdges',
                    crookDistance: '80%',
                    format: '<b>{point.name}</b><br/><span style="color: grey">{point.percentage:.1f}%</span>'
                },
                label: {
                    enabled: true,
                },
                events: {
                    click: function ( e ) {
                        alert( `CLICKED ${e.point.name}` )
                    }
                }
            }
        },
        series: [ {
            type: 'pie',
            data: data
        } ]
    };
};
const directCompareHigh = () => {
    const dataBudget = [];
    const dataActual = [];
    const directExpenses = budgetSummary.expenses.filter( ( expense ) => expense.type === 'DIRECT' );

    directExpenses.forEach( ( expense ) => {
        dataBudget.push( {
            name: expense.name,
            y: expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount,
        } );
        dataActual.push( {
            name: expense.name,
            y: expense.totals.find( ( item ) => item.year === 2017 && item.type === 'ACTUAL' ).amount,
        } );
    } );

    return {
        credits: {
            enabled: false,
        },
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 0,
                beta: 45
            }
        },
        title: {
            text: 'Budget vs Actual 2017'
        },
        xAxis: {
            type: 'category'
        },
        plotOptions: {},
        series: [ {
            name: 'Budget',
            data: dataBudget
        }, {
            name: 'Actual',
            data: dataActual
        } ]
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

class App extends Component {
    render() {
        return (
            <div>
                <Plot
                    data={[ pieChart() ]}
                    layout={{
                        width: 600,
                        height: 500,
                        title: 'Direct Expenses'
                    }}
                />
                <Plot
                    data={directCompare()}
                    layout={{
                        width: 600,
                        height: 500,
                        barmode: 'group',
                        title: 'Budget vs Actual 2017'
                    }}
                />
                <div className="row">
                    <div className="col-4">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={pieChartHigh()}
                        />
                    </div>
                    <div className="col-4">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={directCompareHigh()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
