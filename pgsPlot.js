// OR PGS plot---------------------------------------------------------
const pgsPlot = async (cols, dt, div) => {

    // display pgs scores as beta or odds ratio with rsids or chr and position on the x axis
    oddsRatio = {};
    const rs_idx = cols.indexOf('hm_rsID')
    if (dt[0][rs_idx] == '' || dt[0][rs_idx] == undefined) {
        dt.forEach((row) => {
            oddsRatio["chr_" + row[8] + "_pos_" + row[9]] = row[4];
        })
    } else {
        dt.forEach((row) => {
            oddsRatio[row[0]] = row[4];
        })
    }
//sort pgs variants by beta
    oddsRatioSorted = Object.entries(oddsRatio)
        .sort(([, a], [, b]) => a - b)
        .reduce((r, [k, v]) => ({
            ...r,
            [k]: v
        }), {});

// PGS plotly
    var trace1 = {
        type: 'scatter',
        x: Object.values(oddsRatioSorted), // odds ratios
        y: Object.keys(oddsRatioSorted), // rsids
        mode: 'markers',
        name: 'legend1',
        marker: {
            color: 'rgba(156, 165, 196, 0.95)',
            line: {
                color: 'rgba(156, 165, 196, 1.0)',
                width: 1,
            },
            symbol: 'circle',
            size: 5
        }
    };

    var data = [trace1];
    var layout = {
        title: `Odds Ratios for PGS Variants`,

        xaxis: {
            showgrid: false,
            showline: true,
            linecolor: 'rgb(102, 102, 102)',
            titlefont: {
                font: {
                    size: 10,
                    color: 'rgb(204, 204, 204)'
                }
            },
            tickfont: {
                font: {
                    size: 10,
                    color: 'rgb(102, 102, 102)'
                }
            },
            autotick: true,
            dtick: 10,
            ticks: 'outside',
            tickcolor: 'rgb(102, 102, 102)'
        },
        margin: {
            l: 140,
            r: 40,
            b: 50,
            t: 50
        },
        legend: {
            font: {
                size: 10,
            },
            yanchor: 'middle',
            xanchor: 'right'
        },
        shapes: [{
            type: 'line',
            x0: 1,
            y0: 0,
            x1: 1,
            y1: Object.values(oddsRatio).length,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
            }
        }],
        width: 600,
        height: 600,
        //paper_bgcolor: 'rgb(99,99,100)',
        plot_bgcolor: 'rgb(254, 247, 234)',
        hovermode: 'closest'
    };

    Plotly.newPlot(div, data, layout)
}

