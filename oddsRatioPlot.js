// odds ratio plot for pgs scores (parse and convert betas to odds ratio)-------------------------------------------------
function pgsPlot(dt = (document.getElementById("PGS23calc")).PGS23data.pgs['dt'], cols = (document.getElementById("PGS23calc")).PGS23data.pgs['cols'], div = divPGSPlot) {

    // display pgs scores as beta or odds ratio with rsids or chr and position on the x axis
    let oddsRatio = {};
    const rs_idx = cols.indexOf('hm_rsID')

    if (dt[0][rs_idx] == '' || dt[0][rs_idx] == undefined) {
        dt.forEach((row) => {
            // effect size or odds ratio (exp)
           // oddsRatio["chr_" + row[8] + "_pos_" + row[9]] = math.exp(row[4]);
            oddsRatio["chr_" + row[8] + "_pos_" + row[9]] = row[4]

        })
    } else {
        dt.forEach((row) => {
            //oddsRatio[row[0]] = math.exp(row[4]);

            oddsRatio[row[0]] = row[4]
        })
    }
    //sort pgs variants by beta
    let oddsRatioSorted = Object.entries(oddsRatio)
        .sort(([, a], [, b]) => a - b)
        .reduce((r, [k, v]) => ({
            ...r,
            [k]: v
        }), {});

    // use plotly to make odds ratio chart----
    var trace1 = {
        type: 'scatter',
        y: Object.values(oddsRatioSorted), // odds ratios
        x: Object.keys(oddsRatioSorted), // rsids
        mode: 'markers',
        name: 'legend1',
        marker: {
            color: 'navy',
            line: {
                color: 'navy',
                width: 1,
            },
            symbol: 'circle',
            size: 4
        }
    };
    var data = [trace1];
    var layout = {
        title: `Effect Sizes or (betas) for PGS Variants`,
        xaxis: {
            title: `variant rsid/chromosome and position`,
            showline: true,
            tickangle: 45,           
            mirror: true,
            rangemode: "tozero",
        },
        yaxis: {
            title: `effect size`,
            showgrid: true,
            showline: true,
            mirror: true,
            //rangemode: "tozero",
            linecolor: 'rgb(102, 102, 102)',
            zeroline: false,
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
            l: 50,
          //  r: 10,
            b: 150,
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
            y0:0,
            x0: 0,
            y1: 0,
            x1: Object.values(oddsRatio).length,
            line: {
                color: 'grey',
                width: 1,
                dash: 'dot'
            }
        }],
        // width: 600,
        // height: 600,
        hovermode: 'closest', //plot_bgcolor: 'rgb(254, 247, 234)', 

        annotations: [
            {
              xref: 'paper',
              yref: 'paper',
              x: 0,
              y: 1.06,
              xanchor: 'left',
              yanchor: 'left',
              text: 'effect size > 0 ~ higher odds of the outcome',
              font:{
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              },
              showarrow: false
            },
            {
              xref: 'paper',
              yref: 'paper',
              x: 0,
              y: 1.03,
              xanchor: 'left',
              yanchor: 'left',
              text:  '                 = 0 ~ no association',
              font:{
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              },
              showarrow: false
            },
            {
              xref: 'paper',
              yref: 'paper',
              x: 0,
              y: 0.995,
              xanchor: 'left',
              yanchor: 'left',
              text: '                 < 0 ~ lower odds of the outcome',
              font:{
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              },
              showarrow: false
            }
          ]
    };
    Plotly.newPlot(div, data, layout)
}

// odds ratio plot for pgs scores (parse and convert betas to odds ratio)-------------------------------------------------
function pgsPlot2(dt = (document.getElementById("PGS23calc")).PGS23data.pgs['dt'], cols = (document.getElementById("PGS23calc")).PGS23data.pgs['cols'], div = pgsPlotDiv) {
    div.style.height = '400px'

    // display pgs scores as beta or odds ratio with rsids or chr and position on the x axis
    let oddsRatio = {};
    const rs_idx = cols.indexOf('hm_rsID')

    if (dt[0][rs_idx] == '' || dt[0][rs_idx] == undefined) {
        dt.forEach((row) => {
            // effect size or odds ratio (exp)
           // oddsRatio["chr_" + row[8] + "_pos_" + row[9]] = math.exp(row[4]);
            oddsRatio["chr_" + row[8] + "_pos_" + row[9]] = row[4]

        })
    } else {
        dt.forEach((row) => {
            //oddsRatio[row[0]] = math.exp(row[4]);

            oddsRatio[row[0]] = row[4]
        })
    }
    //sort pgs variants by beta
    let oddsRatioSorted = Object.entries(oddsRatio)
        .sort(([, a], [, b]) => a - b)
        .reduce((r, [k, v]) => ({
            ...r,
            [k]: v
        }), {});

    // use plotly to make odds ratio chart----
    var trace1 = {
        type: 'scatter',
        y: Object.values(oddsRatioSorted), // odds ratios
        x: Object.keys(oddsRatioSorted), // rsids
        mode: 'markers',
        name: 'legend1',
        marker: {
            color: 'navy',
            line: {
                color: 'navy',
                width: 1,
            },
            symbol: 'circle',
            size: 4
        }
    };
    var data = [trace1];
    var layout = {
        title: `Effect Sizes or (betas) for PGS Variants`,
        xaxis: {
            title: `variant rsid/chromosome and position`,
            showline: true,
            tickangle: 45,           
            mirror: true,
            rangemode: "tozero",
        },
        yaxis: {
            title: `effect size`,
            showgrid: true,
            showline: true,
            mirror: true,
            //rangemode: "tozero",
            linecolor: 'rgb(102, 102, 102)',
            zeroline: false,
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
        // margin: {
        //     l: 50,
        //   //  r: 10,
        //     b: 150,
        //     t: 50
        // },
        legend: {
            font: {
                size: 10,
            },
            yanchor: 'middle',
            xanchor: 'right'
        },
        shapes: [{
            type: 'line',
            y0:0,
            x0: 0,
            y1: 0,
            x1: Object.values(oddsRatio).length,
            line: {
                color: 'grey',
                width: 1,
                dash: 'dot'
            }
        }],
        // width: 600,
        // height: 600,
        hovermode: 'closest', //plot_bgcolor: 'rgb(254, 247, 234)', 

        annotations: [
            {
              xref: 'paper',
              yref: 'paper',
              x: 0,
              y: 1.06,
              xanchor: 'left',
              yanchor: 'left',
              text: 'effect size > 0 ~ higher odds of the outcome',
              font:{
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              },
              showarrow: false
            },
            {
              xref: 'paper',
              yref: 'paper',
              x: 0,
              y: 1.03,
              xanchor: 'left',
              yanchor: 'left',
              text:  '                 = 0 ~ no association',
              font:{
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              },
              showarrow: false
            },
            {
              xref: 'paper',
              yref: 'paper',
              x: 0,
              y: 0.995,
              xanchor: 'left',
              yanchor: 'left',
              text: '                 < 0 ~ lower odds of the outcome',
              font:{
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              },
              showarrow: false
            }
          ]
    };
    Plotly.newPlot(div, data, layout)
}