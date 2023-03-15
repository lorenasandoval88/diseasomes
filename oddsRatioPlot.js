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
    let indOther_allele = data.pgs.cols.indexOf('other_allele')
    if (indOther_allele == -1) {
        indOther_allele = data.pgs.cols.indexOf('hm_inferOtherAllele')
    }
    const indEffect_allele = data.pgs.cols.indexOf('effect_allele')
    // sort by effect
    let jj = [...Array(data.pgs.dt.length)].map((_, i) => i) // match indexes
    jj = jj.sort((a, b) => (data.pgs.dt[a][4] -data.pgs.dt[b][4]))
    console.log("jj",jj)
    //const x = data.pgsMatchMy23.map(xi=>{
    const x = jj.map(j => {
        let xi = data.pgs.dt[j]
        return `Chr${xi.at(-1)[indChr]}.${xi.at(-1)[indPos]}:${xi.at(-1)[indOther_allele]}>${xi.at(-1)[indEffect_allele]}
		<br> <a href="#" target="_blank">${xi[0][0]}</a>`
        })
    const x2 = jj.map(j => {
        let xi = data.pgs.dt[j]
        return `Chr${xi[indChr]}.${xi[indPos]}`       
    })
    console.log("x2",x2)

    const y = data.pgs.dt
    const z = data.aleles
    let ii = [...Array(y.length)].map((_,i)=>i)//.filter(i=>y[jj[i]]!=0)
	//ii = ii.filter(i=>y[jj[i]]) // removing indexes with null betas
    //const ii = [...Array(y.length)].map((_, i) => i)
    console.log("ii",ii)

    let trace0 = {
        x: x2,
		y: y.map((yi,i)=>y[jj[ii[i]]][4]),
		mode: 'markers',
        name: 'Matched',
		type: 'scatter',
		text: x2,
		marker: { 
			size: 6,
			color:'navy',
			line:{
				color:'navy',
				width:1
			}
		},
		line:{
			color:'navy'
		}
    }
    var trace1 = {
        x: [...Array(ii.length)].map((_,i)=>i+1),
        y: [0.15, 0.16],
		mode: 'markers',
        name: 'Unmatched',
        type: 'scatter',
		text: x,
        marker: {
          size: 6,
          color: 'rgba(156, 165, 196, 0.95)',
          line: {
            color: 'rgba(156, 165, 196, 1.0)',
            width: 1,
          },
        }
      };
      var tr = [trace0]//,trace1]
    div.innerHTML = ''
    Plotly.newPlot(div, tr, {
        //title:`${data.pgs.meta.trait_mapped}, PRS ${Math.round(data.PRS*1000)/1000}`
        //<br><a href="${'https://doi.org/' + PGS23.pgsObj.meta.citation.match(/doi\:.*$/)[0]}" target="_blank"style="font-size:x-small">${data.pgs.meta.citation}</a>
        title: `<i style="color:navy">Effect Sizes for ${data.aleles.length} Matched Variants (PGS#${data.pgs.meta.pgs_id.replace(/^.*0+/,'')}), PRS ${Math.round(data.PRS*1000)/1000}</i>`,
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