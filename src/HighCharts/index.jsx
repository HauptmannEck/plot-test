import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcarts3D from 'highcharts/highcharts-3d';
import HighcartsExporting from 'highcharts/modules/exporting';
import HighcartsExportingOffline from 'highcharts/modules/offline-exporting';
import budgetSummary from "../budgetSummary";
Highcarts3D( Highcharts );
HighcartsExporting(Highcharts);
HighcartsExportingOffline(Highcharts);

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

export const HighCharts = () => (
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
        </div>
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
);
