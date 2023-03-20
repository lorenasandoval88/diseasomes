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