import React from 'react';
import * as d3 from "d3";
import budgetSummary from "../budgetSummary";
import './styles.css';

const pieChart = () => {
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
        drilldown: group,
    } ) );

    return totals;
};
const directCompare = () => {
    const directExpenses = budgetSummary.expenses.filter( ( expense ) => expense.type === 'DIRECT' );

    return directExpenses.map( ( expense ) => {
        return {
            name: expense.name,
            Budget: expense.totals.find( ( item ) => item.year === 2017 && item.type === 'BUDGET' ).amount,
            Actual: expense.totals.find( ( item ) => item.year === 2017 && item.type === 'ACTUAL' ).amount,
        };
    } );
};

export class D3Charts extends React.Component {
    componentDidMount() {
        this.drawPieChart();
        this.drawBarChart();
    }

    drawPieChart() {
        const w = 400;
        const h = 400;
        const r = Math.min( w, h ) / 2;
        const data = pieChart();
        const svg = d3.select( "#d3-pie" )
            .append( "svg" )
            .attr( "width", w )
            .attr( "height", h )
            .append( "g" )
            .attr( "transform", "translate(" + r + "," + r + ")" );

        const color = d3.scaleOrdinal( d3.schemeCategory10 );

        const pie = d3.pie()
            .value( d => d.y )
            .padAngle( .1 )
            .sort( null );

        const arc = d3.arc()
            .innerRadius( r / 12 )
            .outerRadius( r * .6 );

        function startTween( d ) {
            const interpolate = d3.interpolate( { startAngle: 0, endAngle: 0 }, d );
            return ( t ) => arc( interpolate( t ) );
        }

        function endTween( d ) {
            const interpolate = d3.interpolate( d, { startAngle: 0, endAngle: 0 } );
            return ( t ) => arc( interpolate( t ) );
        }

        const update = ( newData ) => {
            const paths = svg.selectAll( "path" )
                .data( pie( newData ), ( d ) => d.data.name );

            paths.exit().transition()
                .duration( 1000 )
                .attrTween( "d", endTween ).remove();

            const path = paths.enter()
                .append( "path" )
                .attr( "fill", ( d, i ) => color( i ) )
                .attr( "d", arc );

            path.transition()
                .duration( 1000 )
                .attrTween( "d", startTween )
                .on( "end", function () {
                    this._listenToEvents = true;
                } );

            const restOfTheData = () => {
                const text = svg.selectAll( 'text' )
                    .data( pie( newData ), ( d ) => d.data.name );
                text.exit().remove();

                text.enter()
                    .append( "text" )
                    .transition()
                    .duration( 200 )
                    .attr( "transform", function ( d ) {
                        return "translate(" + arc.centroid( d ) + ")";
                    } )
                    .attr( "dy", ".4em" )
                    .attr( "text-anchor", "middle" )
                    .text( function ( d ) {
                        return d.data.y;
                    } )
                    .attr( {
                        fill: '#fff',
                        'font-size': '10px'
                    } );

                text.enter().append( "text" )
                    .attr( "text-anchor", "middle" )
                    .attr( "x", function ( d ) {
                        const a = d.startAngle + ( d.endAngle - d.startAngle ) / 2 - Math.PI / 2;
                        d.cx = Math.cos( a ) * ( r * .6 );
                        return d.x = Math.cos( a ) * ( r - 20 );
                    } )
                    .attr( "y", function ( d ) {
                        const a = d.startAngle + ( d.endAngle - d.startAngle ) / 2 - Math.PI / 2;
                        d.cy = Math.sin( a ) * ( r * .6 );
                        return d.y = Math.sin( a ) * ( r - 20 );
                    } )
                    .text( function ( d ) {
                        return d.data.name;
                    } )
                    .each( function ( d ) {
                        const bbox = this.getBBox();
                        d.sx = d.x - bbox.width / 2 - 2;
                        d.ox = d.x + bbox.width / 2 + 2;
                        d.sy = d.oy = d.y + 5;
                    } );

                text.enter()
                    .append( "path" )
                    .attr( "class", "pointer" )
                    .style( "fill", "none" )
                    .style( "stroke", "black" )
                    .attr( "d", function ( d ) {
                        if ( d.cx > d.ox ) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        } else {
                            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                        }
                    } );

                path.on( "click", function ( d ) {
                    if ( this._listenToEvents && d.data.drilldown ) {
                        d3.select( this ).attr( "transform", "translate(0,0)" );
                        path.each( () => {
                            this._listenToEvents = false;
                        } );
                        update( d.data.drilldown.data );
                    }
                } ).on( "mouseover", function ( d ) {
                    if ( this._listenToEvents && d.data.drilldown ) {
                        let ang = d.startAngle + ( d.endAngle - d.startAngle ) / 2;
                        ang = ( ang - ( Math.PI / 2 ) ) * -1;

                        const x = Math.cos( ang ) * r * 0.1;
                        const y = Math.sin( ang ) * r * -0.1;

                        d3.select( this ).transition()
                            .duration( 250 ).attr( "transform", "translate(" + x + "," + y + ")" );
                    }
                } ).on( "mouseout", function ( d ) {
                    if ( this._listenToEvents && d.data.drilldown ) {
                        d3.select( this ).transition()
                            .duration( 150 ).attr( "transform", "translate(0,0)" );
                    }
                } );
            };

            setTimeout( restOfTheData, 1000 );
        };

        update( data );
    }

    drawBarChart() {
        const data = directCompare();
        const svg = d3.select( "#d3-bar" )
            .append( "svg" )
            .attr( "height", 400 )
            .attr( "width", 500 );
        const x0 = d3.scaleBand()
            .paddingInner( 0.1 );
        const g = svg.append( "g" );

        const xAxis = g.append( "g" )
            .attr( "class", "axis" );

        let marginBottom = 0;
        x0.domain( data.map( function ( d ) {
            return d.name;
        } ) );
        xAxis.call( d3.axisBottom( x0 ) )
            .selectAll( "text" )
            .each( function () {
                if ( this.getBBox().width > marginBottom ) marginBottom = this.getBBox().width;
            } );

        const margin = { top: 30, right: 20, bottom: marginBottom, left: 40 };
        const width = +svg.attr( "width" ) - margin.left - margin.right;
        const height = +svg.attr( "height" ) - margin.top - margin.bottom;
        g.attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

        x0.rangeRound( [ 0, width ] );
        xAxis.call( d3.axisBottom( x0 ) )
            .selectAll( "text" )
            .attr( "transform", "rotate(-45)" )
            .style( "text-anchor", "end" );

        const x1 = d3.scaleBand()
            .padding( 0.2 );

        const y = d3.scaleLinear()
            .rangeRound( [ height, 0 ] );

        const z = d3.scaleOrdinal()
            .range( [ "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00" ] );

        const keys = [ 'Budget', 'Actual' ];
        x1.domain( keys ).rangeRound( [ 0, x0.bandwidth() ] );
        y.domain( [ 0, d3.max( data, function ( d ) {
            return d3.max( keys, function ( key ) {
                return d[ key ];
            } );
        } ) ] ).nice();


        g.append( "g" )
            .selectAll( "g" )
            .data( data )
            .enter().append( "g" )
            .attr( "transform", function ( d ) {
                return "translate(" + x0( d.name ) + ",0)";
            } )
            .selectAll( "rect" )
            .data( function ( d ) {
                return keys.map( function ( key ) {
                    return { key: key, value: d[ key ] };
                } );
            } )
            .enter().append( "rect" )
            .attr( "x", function ( d ) {
                return x1( d.key );
            } )
            .attr( "y", function ( d ) {
                return y( d.value );
            } )
            .attr( "width", x1.bandwidth() )
            .attr( "height", function ( d ) {
                return height - y( d.value );
            } )
            .attr( "fill", function ( d ) {
                return z( d.key );
            } );

        xAxis.attr( "transform", "translate(0," + height + ")" );

        g.append( "g" )
            .attr( "class", "axis" )
            .call( d3.axisLeft( y ).ticks( null, "s" ) )
            .append( "text" );

        const legend = svg.append( "g" )
            .attr( "font-family", "sans-serif" )
            .attr( "font-size", 10 )
            .attr( "text-anchor", "start" )
            .selectAll( "g" )
            .data( keys.slice().reverse() )
            .enter().append( "g" )
            .attr( "transform", function ( d, i ) {
                return "translate(" + i * 60 + ", 0)";
            } );

        legend.append( "rect" )
            .attr( "x", 15 )
            .attr( "width", 15 )
            .attr( "height", 15 )
            .attr( "fill", z );

        legend.append( "text" )
            .attr( "x", 35 )
            .attr( "y", 9.5 )
            .attr( "dy", "0.32em" )
            .text( function ( d ) {
                return d;
            } );
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h2>D3</h2>
                    <p>
                    </p>
                </div>
                <div id="d3-pie" className="col-4">
                </div>
                <div id="d3-bar" className="col-4">
                </div>
            </div>
        );
    }
}
