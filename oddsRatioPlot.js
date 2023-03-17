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
            title: `βi, effect size`,
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
    // display pgs scores as beta with rsids or chr and position on the x axis
    let oddsRatio = {};
    dt.forEach((row) => {
            //oddsRatio[row[0]] = math.exp(row[4]);
        oddsRatio["Chr" + row[9] + "." + row[10]] = row[4]
     })

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
        title: `Effect Sizes (betas) for all PGS Variants`,
        titlefont: {
        color: "navy",
        },
        xaxis: {
            title: `variant rsid/chromosome and position`,
            showline: true,
            tickangle: 45,           
            mirror: true,
            rangemode: "tozero",
        },
        yaxis: {
            title: `βi, effect size`,
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


function pgsPlot3(data = document.getElementById("PGS23calc").PGS23data , div = document.getElementById('pgsPlotDiv')) {
    div.style.height = '500px'
    const indChr = data.pgs.cols.indexOf('hm_chr')
    const indPos = data.pgs.cols.indexOf('hm_pos')
    // separate pgs.dt into 2 (matches and non matches) arrays
    const match23 = data.pgsMatchMy23.map(function(v) { return v[1]; });
    const nonMatches = data.pgs.dt.filter(element => !match23.includes(element));
    const matches = data.pgs.dt.filter(element => match23.includes(element));

    // sort by effect
    let jj = [...Array(matches.length)].map((_, i) => i) // match indexes
    jj = jj.sort((a, b) => (matches[a][4] -matches[b][4]))
 
    // sort by effect
    let jj2 = [...Array(nonMatches.length)].map((_, i) => i) // match indexes
    jj2 = jj2.sort((a, b) => (nonMatches[a][4] -nonMatches[b][4]))

    // matches data
    const xmatches = jj.map(j => {
        let xi = matches[j]
        return `Chr${xi[indChr]}.${xi[indPos]}`       
    })
    const ymatches = matches

    // non matches data
    console.log(nonMatches)
     const x_nonmatches = jj2.map(j => {
         let xi = nonMatches[j]
         return `Chr${xi[indChr]}.${xi[indPos]}`       
     })
    const y_nonmatches = nonMatches
    
    const z = data.aleles
    let ii = [...Array(ymatches.length)].map((_,i)=>i)
    let ii2 = [...Array(y_nonmatches.length)].map((_,i)=>i)


Match3 = function (data) {
    let dtMatch = []
    const n = data.pgs.dt.length
    const indChr = data.pgs.cols.indexOf('hm_chr')
    const indPos = data.pgs.cols.indexOf('hm_pos')


    i = 0
    function unMatch(i=0) {
        if (i < n) {
        let r = data.pgsMatchMy23[i][1] //  PGS data to be matched
        console.log(r)
        // MATCH 23andme chromosome and position TO PGS chromosome and position *******

        let dtMatch_i = data.pgs.dt[i].filter(myr => (myr[indPos] == r[indPos])).
                        filter(myr => (myr[indChr] == r[indChr]))

        if (dtMatch_i.length > 0) {
            dtMatch.push(dtMatch_i.concat([r]))
        }
        console.log("dtMatch_i",dtMatch_i)
    }
    setTimeout(() => {
        unMatch(i + 1)
    }, 0)
}
unMatch()
}

var title1 = `${xmatches.length}`+" matched"
var title2 = `${x_nonmatches.length}`+" not matched"

    let trace0 = {
        x: xmatches,
		y: ymatches.map((yi,i)=>ymatches[jj[ii[i]]][4]),
		mode: 'markers',
        name: title1,
		type: 'scatter',
        transforms: [{
            type:"sort",
            target: "y",
            order:"ascending"
        }],
		text: xmatches,
		marker: { 
			size: 6,
			color:'navy',
		},
    }
    var trace1 = {
        x: x_nonmatches,
		y: y_nonmatches.map((yi,i)=>y_nonmatches[jj2[ii2[i]]][4]),
		mode: 'markers',
        name: title2,
        type: 'scatter',
        transforms: [{
            type:"aggregate",
            target: "y",
            order:"ascending"
        }],
		text: x_nonmatches,
        marker: {
          size: 6,
          color: 'rgb(140, 140, 140)',
        }
      };
      var tr = [trace0,trace1]
    div.innerHTML = ''
    Plotly.newPlot(div, tr, {
        //title:`${data.pgs.meta.trait_mapped}, PRS ${Math.round(data.PRS*1000)/1000}`
        //<br><a href="${'https://doi.org/' + PGS23.pgsObj.meta.citation.match(/doi\:.*$/)[0]}" target="_blank"style="font-size:x-small">${data.pgs.meta.citation}</a>
        title: `<i style="color:navy">Effect Sizes for All PGS#${data.pgs.meta.pgs_id.replace(/^.*0+/,'')} Variants</i>`,
        xaxis: {
            title: '<span style="font-size:medium">variant, sorted by effect</span>',
            linewidth: 1,
            mirror: true,
            rangemode: "tozero",
            tickangle: 45,           
            font: {
                size: 15
              },
        },
        yaxis: {
            title: '<span style="font-size:large">βi</span><span style="font-size:medium">, effect size</span>',
            linewidth: 1,
            mirror: true
        }
    })
    // add table
    //tabulateAllMatchByEffect()
    // add 3 pie charts
    //plotSummarySnps()
     //debugger
}