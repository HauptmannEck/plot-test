import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcarts3D from 'highcharts/highcharts-3d';
import HighcartsExporting from 'highcharts/modules/exporting';
import HighcartsExportingOffline from 'highcharts/modules/offline-exporting';
import HighcartsDrilldown from 'highcharts/modules/drilldown';
import budgetSummary from "../budgetSummary";
import cashFlow from "../cashFlow";

Highcarts3D( Highcharts );
HighcartsExporting( Highcharts );
HighcartsExportingOffline( Highcharts );
HighcartsDrilldown(Highcharts);

const pieChartHigh = () => {
    const drilldown = [];

    budgetSummary.expenses.forEach( ( expense ) => {
        const expenseGroup = drilldown.find( ( section ) => section.id === expense.type );

        const item = {
            y: expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount,
            name: expense.name,
        };

        if ( expenseGroup ) {
            expenseGroup.data.push( item );
        } else {
            drilldown.push( {
                id: expense.type,
                data: [ item ],
            } );
        }
    } );

    const totals = drilldown.map( ( group ) => ( {
        y: group.data.reduce( ( acc, expense ) => acc + expense.y, 0 ),
        name: group.id,
        drilldown: group.id,
    } ) );

    return {
        credits: {
            enabled: false,
        },
        export: {},
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: 'Expenses'
        },
        tooltip: {
            pointFormat: '<b>{point.y}</b>'
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
            }
        },
        series: [ {
            type: 'pie',
            name: 'Expenses',
            data: totals
        } ],
        drilldown: {
            series: drilldown,
            drillUpButton: {
                relativeTo: 'spacingBox'
            }
        }
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
                alpha: 5,
                beta: 5
            }
        },
        title: {
            text: 'Budget vs Actual 2017'
        },
        xAxis: {
            type: 'category'
        },
        tooltip: {
            shared: true,
            crosshairs: true
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
const cashFlowHigh = () => {
    const cashIn = [];
    const cashOut = [];
    const cashNet = [];

    cashFlow.forEach( ( monthsData ) => {
        cashIn.push( {
            x: monthsData.month,
            y: monthsData.cashIn,
        } );
        cashOut.push( {
            x: monthsData.month,
            y: monthsData.cashOut,
        } );
        cashNet.push( {
            x: monthsData.month,
            y: monthsData.cashIn - monthsData.cashOut,
        } );
    } );

    return {
        credits: {
            enabled: false,
        },
        title: {
            text: '2017 Cash Flow'
        },
        xAxis: {
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%b', new Date(2018, this.value - 1));
                }
            },
            startOnTick: true,
            tickAmount: 12
        },
        yAxis: {
            plotLines: [{
                color: '#C0C0C0',
                width: 5,
                value: 0
            }]
        },
        legend: {
            align: 'left',
            verticalAlign: 'top',
            borderWidth: 0
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                marker: {
                    lineWidth: 1
                }
            }
        },

        series: [{
            name: 'Cash In',
            color: '#42873c',
            data: cashIn,
        }, {
            name: 'Cash Out',
            color: '#872526',
            data: cashOut
        }, {
            name: 'Net Cash Flow',
            color: '#000000',
            lineWidth: 4,
            marker: {
                radius: 4
            },
            data: cashNet
        }]
    };
};

export class HighCharts extends React.Component {
    chart;

    constructor( props ) {
        super( props );

        this.grabChart = this.grabChart.bind( this );
        this.printChart = this.printChart.bind( this );
    }


    grabChart( chart ) {
        this.chart = chart;
    }

    printChart() {
        this.chart.exportChartLocal();
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h2>Highcharts</h2>
                    <p>
                        A non-D3 charting library, that is used with a paid license.
                        Many config options allowing much control over style and display.
                        Anything not in the config is not possible though.
                        Allows usage of HTML and SVG in formatting of labels.
                        Very visually appealing.
                        Stock and Map style charts are extra cost.
                        Plugins available.
                        Allows Exporting to PDF, Print, PNG, JPG, and SVG.
                        Has a cloud editor for non-technical users.
                    </p>
                    <button onClick={this.printChart}>Print</button>
                </div>
                <div className="col-4">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={pieChartHigh()}
                        callback={this.grabChart}
                    />
                </div>
                <div className="col-4">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={directCompareHigh()}
                    />
                </div>
                <div className="col-4">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={cashFlowHigh()}
                    />
                </div>
            </div>
        );
    }
}
