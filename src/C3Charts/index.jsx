import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import budgetSummary from "../budgetSummary";

const pieChartC3 = () => {
    const data = [];
    const directExpenses = budgetSummary.expenses.filter( ( expense ) => expense.type === 'DIRECT' );

    directExpenses.forEach( ( expense ) => {
        data.push( [
            expense.name,
            expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount
        ] );
    } );

    return {
        columns: data,
        type: 'pie',
    };
};

export const C3Charts = () => (
    <div className="row">
        <div className="col-12">
            <h2>C3</h2>
            <p>
                A free wrapper of D3 with open access d3 code.
                Very limited in options, require D3 for more less common choices.
                API is not well documented and missing many needed examples.
                No Stock and Map style charts.
            </p>
        </div>
        <div className="col-4">
            <C3Chart
                data={pieChartC3()}
                pie={{
                    label: {
                        format: function ( value, ratio, id ) {
                            return value;
                        }
                    }
                }}
            />
        </div>
    </div>
);
