// to inspect all data in the console
// dataObj=document.getElementById("PGS23calc").PGS23data

// This library was created before transitioning fully to ES6 modules
// Specifically the pgs library is a dependency satisfied by script tag loading
if (typeof (pgs) == 'undefined') {
    let s = document.createElement('script')
    s.src = 'https://episphere.github.io/pgs/pgs.js'
    document.head.appendChild(s)
}
if (typeof (JSZip) == 'undefined') {
    let s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    document.head.appendChild(s)
}
if (typeof (Plotly) == 'undefined') {
    let s = document.createElement('script')
    s.src = 'https://cdn.plot.ly/plotly-2.18.2.min.js'
    document.head.appendChild(s)
}

// pgs is now in the global scope, if it was not there already
// import * as zip from "https://deno.land/x/zipjs/index.js"

let PGS23 = {
    // a global variable that is not shared by export
    data: {}
}
// in case someone wants to see it in the console

PGS23.loadPGS = async (i = 1) => {
    // startng with a default pgs
    let div = PGS23.divPGS
    div.innerHTML = `<b style="color:maroon">A)</b> PGS # <input id="pgsID" value=${i} size=5>
    <button id='btLoadPgs' class="btn btn-primary btn__first" data-toggle="collapse1" data-target=".collapse.first">load</button>
    <span id="showLargeFile" hidden=true><input id="checkLargeFile"type="checkbox">large file (under development)</span>
    
    <span id="summarySpan" hidden=true>[<a id="urlPGS" href='' target="_blank">FTP</a>][<a id="catalogEntry" href="https://www.pgscatalog.org/score/${"PGS000000".slice(0, -JSON.stringify(i).length) + JSON.stringify(i)}" target="_blank">catalog</a>]<span id="largeFile"></span><br><span id="trait_mapped">...</span>, <span id="dataRows">...</span> variants, [<a id="pubDOI" target="_blank">Reference</a>], [<a href="#" id="objJSON">JSON</a>].</span>
    <p><textarea id="pgsTextArea" style="background-color:black;color:lime" cols=60 rows=5>...</textarea></p>`;
    div.querySelector('#pgsID').onkeyup = (evt => {
        if (evt.keyCode == 13) {
            // on key up reload pgs data
            div.querySelector('#btLoadPgs').click()

        }
    })
 

    PGS23.pgsTextArea = div.querySelector('#pgsTextArea')
    div.querySelector('#btLoadPgs').onclick = async (evt) => {
        document.querySelector('#summarySpan').hidden = true
        PGS23.pgsTextArea.value = '... loading'
        i = parseInt(div.querySelector('#pgsID').value)
        let PGSstr = i.toString()
        PGSstr = "PGS000000".slice(0, -PGSstr.length) + PGSstr
        div.querySelector('#urlPGS').href = `https://ftp.ebi.ac.uk/pub/databases/spot/pgs/scores/${PGSstr}/ScoringFiles/Harmonized/`
        //check pgs file size
        let fsize = (await fetch(`https://ftp.ebi.ac.uk/pub/databases/spot/pgs/scores/${PGSstr}/ScoringFiles/Harmonized/${PGSstr}_hmPOS_GRCh37.txt.gz`, {
            method: 'HEAD'
        })).headers.get('Content-Length');
        if ((fsize > 1000000) & (!div.querySelector('#checkLargeFile').checked)) {
            console.log('largeFile processing ...')
            //div.querySelector('#summarySpan').hidden = true
            let data = document.getElementById("PGS23calc").PGS23data
            if (data.pgs) {
                delete data.pgs
            }
            PGS23.pgsTextArea.value += ` ... whoa! ... this is a large PGS entry, over ${Math.floor(fsize / 1000000)}Mb. If you still want to process it please check "large file" above and press load again. Don't do this if you are not ready to wait ...`
            div.querySelector('#summarySpan').hidden = true
            div.querySelector('#showLargeFile').style.backgroundColor = 'yellow'
            div.querySelector('#showLargeFile').style.color = 'red'
            div.querySelector('#showLargeFile').hidden = false
            div.querySelector('#checkLargeFile').checked = false
            setTimeout(_ => {
                div.querySelector('#showLargeFile').style.backgroundColor = ''
                div.querySelector('#showLargeFile').style.color = ''
                //div.querySelector('#summarySpan').hidden = true
            }, 2000)
            //debugger
        } else {
            if (div.querySelector('#checkLargeFile').checked) {
                PGS23.pgsTextArea.value = `... processing large file (this may not work, feature under development). If the wait gets too long, remember you can always reset by reloading the page.`
            }
            div.querySelector('#checkLargeFile').checked = false
            div.querySelector('#showLargeFile').hidden = true
            PGS23.pgsObj = await parsePGS(i)
            div.querySelector('#pubDOI').href = 'https://doi.org/' + PGS23.pgsObj.meta.citation.match(/doi\:.*$/)[0]
            div.querySelector('#trait_mapped').innerHTML = `<span style="color:maroon">${PGS23.pgsObj.meta.trait_mapped}</span>`
            div.querySelector('#dataRows').innerHTML = PGS23.pgsObj.dt.length
            if (PGS23.pgsObj.txt.length < 100000) {
                PGS23.pgsTextArea.value = PGS23.pgsObj.txt
            } else {
                PGS23.pgsTextArea.value = PGS23.pgsObj.txt.slice(0, 100000) + `...\n... (${PGS23.pgsObj.dt.length} variants) ...`
            }
            //PGS23.data.pgs=pgsObj
            const cleanObj = structuredClone(PGS23.pgsObj)
            cleanObj.info = cleanObj.txt.match(/^[^\n]*/)[0]
            delete cleanObj.txt
            PGS23.data.pgs = cleanObj
            div.querySelector('#summarySpan').hidden = false
        }
    };
    div.querySelector("#objJSON").onclick = evt => {
        //console.log(Date())
        let cleanObj = structuredClone(PGS23.pgsObj)
        cleanObj.info = cleanObj.txt.match(/^[^\n]*/)[0]
        delete cleanObj.txt
        saveFile(JSON.stringify(cleanObj), cleanObj.meta.pgs_id + '.json')
    }
}
//------------------------------------------------
PGS23.load23 = async () => {
    let div = PGS23.div23
    div.innerHTML =
        `<hr><b style="color:maroon">B)</b> Download <a href= "genome_Dorothy_Wolf_v4_Full_20170525101345.txt" download="genome_Dorothy_Wolf_v4_Full_20170525101345.txt">female </a> or <a href= "genome_Chad_Wrye_v5_Full_20220921063742.txt" download="genome_Chad_Wrye_v5_Full_20220921063742.txt">male </a> 
        public 23andme file from the <a id="PGP" href="https://my.pgp-hms.org/public_genetic_data?data_type=23andMe" target="_blank">Personal Genome Project (PGP)</a> and <input type="file" id="file23andMeInput">

    <br><span hidden=true id="my23hidden" style="font-size:small">
		 <span style="color:maroon" id="my23Info"></span> (<span id="my23variants"></span> variants) [<a href='#' id="json23">JSON</a>].
	</span>
	<p><textarea id="my23TextArea" style="background-color:black;color:lime" cols=60 rows=5>...</textarea></p>`
    div.querySelector('#file23andMeInput').onchange = evt => {
        function UI23(my23) {
            // user interface
            div.querySelector("#my23hidden").hidden = false
            div.querySelector("#my23Info").innerText = my23.info
            div.querySelector("#my23variants").innerText = my23.dt.length
            div.querySelector("#json23").onclick = _ => {
                saveFile(JSON.stringify(my23), my23.info.replace(/\.[^\.]+$/, '') + '.json')
            }
            PGS23.data.my23 = my23
        }
        div.querySelector("#my23TextArea").value = '... loading'
        let readTxt = new FileReader()
        let readZip = new FileReader()
        readTxt.onload = ev => {
            let txt = ev.target.result;
            div.querySelector("#my23TextArea").value = txt.slice(0, 10000).replace(/[^\r\n]+$/, '') + '\n\n .................. \n\n' + txt.slice(-300).replace(/^[^\r\n]+/, '')
            //let my23 = parse23(txt,evt.target.files[0].name)
            UI23(parse23(txt, evt.target.files[0].name))
        }
        // readZip.readAsArrayBuffer=async ev=>{
        readZip.onload = ev => {
            let zip = new JSZip()
            zip.loadAsync(ev.target.result).then(zip => {
                //txtFname=Object.keys(zip.files)[0]
                //console.log(zip.files,Date())
                //console.log(Object.getOwnPropertyNames(zip.files)[0])
                let fnametxt = Object.getOwnPropertyNames(zip.files)[0]
                zip.file(fnametxt).async('string').then(txt => {
                    div.querySelector("#my23TextArea").value = txt.slice(0, 10000).replace(/[^\r\n]+$/, '') + '\n\n .................. \n\n' + txt.slice(-300).replace(/^[^\r\n]+/, '')
                    UI23(parse23(txt, evt.target.files[0].name))
                })
                //debugger
            })
            //debugger
            //await ev.arrayBuffer(x=>{
            //	debugger
            //})
            //let txt=await pako.inflate(ev.arrayBuffer(), { to: 'string' })
            //debugger
        }

        if (evt.target.files[0].name.match(/\.txt$/)) {
            readTxt.readAsText(evt.target.files[0])
        } else if (evt.target.files[0].name.match(/\.zip$/)) {
            readZip.readAsArrayBuffer(evt.target.files[0])
            //debugger
        } else {
            console.error(`wrong file type, neither .txt nor .zip: "${evt.target.files[0].name}"`)
        }
    }
}

PGS23.loadCalc = async () => {

    let div = PGS23.divCalc
    div.innerHTML = `<hr>
	<b style="color:maroon">C)</b> Polygenic Risk Score (PRS)
	<p><button id="buttonCalculateRisk">Calculate Risk</button>
    <span id="hidenCalc" hidden=true>[<a href="#" id="matchesJSON">matches</a>][<a href="#" id="riskCalcScoreJSON">calculation</a>]</span> 
    <input id="progressCalc" type="range" value=0 hidden=false>
    </p>
	<textarea id="my23CalcTextArea" style="background-color:black;color:lime" cols=60 rows=5>...</textarea>

	<div id="plotRiskDiv" style="height:300px;">

    <hr><div>If you want to see the current state of the two data objects try <code>data = document.getElementById("PGS23calc").PGS23data</code> in the browser console</div><hr>
    <div id="errorDiv"></div>

    <div id="tabulateAllMatchByEffectDiv"></div>
    <div style="height:250px;" id="pieChartDiv">...</div>
    <div style="height:300px;" id="plotAllMatchByEffectDiv">...</div>
    </div>
	`
    div.querySelector('#matchesJSON').onclick = evt => {

        let data = document.getElementById("PGS23calc").PGS23data
        saveFile(JSON.stringify(data.pgsMatchMy23), data.my23.info.slice(0, -4) + '_match_PGS_calcRiskScore' + data.pgs.id + '.json')

    }
    div.querySelector('#riskCalcScoreJSON').onclick = evt => {
        let data = document.getElementById("PGS23calc").PGS23data
        saveFile(JSON.stringify(data.calcRiskScore), data.my23.info.slice(0, -4) + '_individual_RiskScores' + data.pgs.id + '.json')

    }
    div.querySelector('#buttonCalculateRisk').onclick = evt => {
        let hidenCalc = div.querySelector('#hidenCalc')
        let my23TextArea = div.querySelector('#my23CalcTextArea')
        my23CalcTextArea.value = '...'
        hidenCalc.hidden = true
        let data = document.getElementById("PGS23calc").PGS23data

        if (!data.pgs) {
            my23CalcTextArea.value += '\n... no PGS entry selected, please do that in A.'
        }
        if (!data.my23) {
            my23CalcTextArea.value += '\n... no 23andme report provided, please do that in B.'
        }
        if ((!!data.my23) & (!!data.pgs)) {
            my23CalcTextArea.value = `... looking for matches between ${data.my23.dt.length} genomic positions 
            and ${data.pgs.dt.length} ${data.pgs.meta.trait_mapped} variants (PGS#${data.pgs.id}). \n...`
            document.querySelector('#buttonCalculateRisk').disabled = true
            document.querySelector('#buttonCalculateRisk').style.color = 'silver'
            data.pgsMatchMy23 = []
            PGS23.Match2(data)
        }
    }

}

// MATCH 23andme chromosome and position TO PGS chromosome and position *******
//var regexPattern = new RegExp([r[2],r[3]].join('|'))

PGS23.Match2 = function (data, progressReport) {
    // extract harmonized data from PGS entry first
    const indChr = data.pgs.cols.indexOf('hm_chr')
    const indPos = data.pgs.cols.indexOf('hm_pos')
    const indOther_allele = data.pgs.cols.indexOf('other_allele')
    const indEffect_allele = data.pgs.cols.indexOf('effect_allele')
    const indGenotype = data.my23.cols.indexOf('genotype')

    // match
    let dtMatch = []

    const n = data.pgs.dt.length
    let progressCalc = document.getElementById('progressCalc')
    progressCalc.hidden = false
    let i = 0
    let j = 0 //index of last match, the nex can match will have to be beyond this point since both pgs and 23and me are sorted by chr/position
    //let matchFloor=0 // to advance the earliest match as it advances
    function funMatch(i = 0, matchFloor = 0) {
        if (i < n) {
            let r = data.pgs.dt[i]

            //also filter 23 and me variants if they don't match pgs alt or effect allele 
            let regexPattern = new RegExp([r[indEffect_allele], r[indOther_allele]].join('|'))

            if (dtMatch.length > 0) {
                matchFloor = dtMatch.at(-1)[0][4]
                //console.log(matchFloor)
            }
            let dtMatch_i = data.my23.dt.filter(myr => (myr[2] == r[indPos]))
                .filter(myr => (myr[1] == r[indChr]))
                .filter(myr => regexPattern.test(myr[indGenotype])) 
            //let dtMatch_i = data.my23.dt.slice(matchFloor).filter(myr=>(myr[2] == r[indPos])).filter(myr=>(myr[1] == r[indChr]))


            if (dtMatch_i.length > 0) {
                dtMatch.push(dtMatch_i.concat([r]))
            }
            progressCalc.value = 100 * i / n
            setTimeout(() => {
                funMatch(i + 1)
            }, 0)
        } else {

            data.pgsMatchMy23 = dtMatch
            let calcRiskScore = []
            let alleles = []
            // calculate Risk
            let logR = 0
            // log(0)=1
            let ind_effect_weight = data.pgs.cols.indexOf('effect_weight')
            dtMatch.forEach((m, i) => {
                calcRiskScore[i] = 0
                // default no risk
                alleles[i] = 0
                // default no alele
                let mi = m[0][3].match(/^[ACGT]{2}$/)
                // we'll only consider duplets in the 23adme report
                if (mi) {
                    //'effect_allele', 'other_allele', 'effect_weight'
                    mi = mi[0]
                    // 23andme match
                    let pi = m.at(-1)
                    //pgs match
                    let alele = pi[indEffect_allele]
                    let L = mi.match(RegExp(alele, 'g'))
                    // how many, 0,1, or 2
                    if (L) {
                        L = L.length
                        calcRiskScore[i] = L * pi[ind_effect_weight]
                        alleles[i] = L
                    }
                    //debugger
                }
            })
            data.alleles = alleles
            data.calcRiskScore = calcRiskScore
            //console.log("calcRiskScore.reduce((a, b) => Math.min(a, b))",calcRiskScore.reduce((a, b) => Math.min(a, b)))
            //console.log("calcRiskScore.reduce((a, b) => Math.min(a, b)) == 0: ",calcRiskScore.reduce((a, b) => Math.min(a, b)) == 0)
            
            // warning: no matches found!
            if (calcRiskScore.length == 0) { 
                console.log('there are no matches :-(')
                document.getElementById('my23CalcTextArea').value += ` Found ${data.pgsMatchMy23.length} PGS matches to the 23andme report.`
                //document.getElementById('my23CalcTextArea').value += ` However, these don't look like betas. I am going to assume they are hazard ratios ... You could also look for another entry for the same trait where betas were calculated, maybe give it a try at https://www.pgscatalog.org/search/?q=${data.pgs.meta.trait_mapped.replace(' ','+')}.`
                //document.getElementById('my23CalcTextArea').value += ` However, these don't look right, QAQC FAILED ! ... You could look for another entry for the same trait where betas pass QAQC, maybe give it a try at https://www.pgscatalog.org/search/?q=${data.pgs.meta.trait_mapped.replace(' ','+')}.`
                document.getElementById('plotRiskDiv').hidden = true
                document.getElementById('hidenCalc').hidden = false
                plotAllMatchByEffect4()
                pieChart()
            // zero betas
            } else if (calcRiskScore.reduce((a, b) => Math.min(a, b)) == 0) { //&&(calcRiskScore.reduce((a,b)=>Math.max(a,b))<=1)){ // hazard ratios?
                console.log('these are not betas :-(')
                document.getElementById('my23CalcTextArea').value += ` Found ${data.pgsMatchMy23.length} PGS matches to the 23andme report.`
                //document.getElementById('my23CalcTextArea').value += ` However, these don't look like betas. I am going to assume they are hazard ratios ... You could also look for another entry for the same trait where betas were calculated, maybe give it a try at https://www.pgscatalog.org/search/?q=${data.pgs.meta.trait_mapped.replace(' ','+')}.`
                document.getElementById('my23CalcTextArea').value += ` However, these don't look right (betas=0), QAQC FAILED ! ... You could look for another entry for the same trait where betas pass QAQC, maybe give it a try at https://www.pgscatalog.org/search/?q=${data.pgs.meta.trait_mapped.replace(' ','+')}.`
                document.getElementById('plotRiskDiv').hidden = true
                document.getElementById('hidenCalc').hidden = false
                plotAllMatchByEffect4()
                pieChart()
            // large betas over 1
            }else if (calcRiskScore.reduce((a, b) => Math.max(a, b)) > 1) { //&&(calcRiskScore.reduce((a,b)=>Math.max(a,b))<=1)){ // hazard ratios?
                console.log('these are large betas :-(')
                document.getElementById('my23CalcTextArea').value += ` Found ${data.pgsMatchMy23.length} PGS matches to the 23andme report.`
                //document.getElementById('my23CalcTextArea').value += ` However, these don't look like betas. I am going to assume they are hazard ratios ... You could also look for another entry for the same trait where betas were calculated, maybe give it a try at https://www.pgscatalog.org/search/?q=${data.pgs.meta.trait_mapped.replace(' ','+')}.`
                document.getElementById('my23CalcTextArea').value += ` However, these don't look right (betas>1), QAQC FAILED ! ... You could look for another entry for the same trait where betas pass QAQC, maybe give it a try at https://www.pgscatalog.org/search/?q=${data.pgs.meta.trait_mapped.replace(' ','+')}.`
                document.getElementById('plotRiskDiv').hidden = true
                document.getElementById('hidenCalc').hidden = false
                data.PRS = Math.exp(calcRiskScore.reduce((a, b) => a + b))
                plotAllMatchByEffect4()
                pieChart()
            } else {
                data.PRS = Math.exp(calcRiskScore.reduce((a, b) => a + b))
                document.getElementById('my23CalcTextArea').value += ` Polygenic Risk Score, PRS=${Math.round(data.PRS * 1000) / 1000}, calculated from ${data.pgsMatchMy23.length} PGS matches to the 23andme report.`
                //my23CalcTextArea.value+=` ${data.pgsMatchMy23.length} PGS matches to the 23andme report.`
                document.getElementById('plotRiskDiv').hidden = false
                document.getElementById('hidenCalc').hidden = false
                //ploting
                plotAllMatchByEffect4()
                pieChart()
            }
            document.querySelector('#buttonCalculateRisk').disabled = false
            document.querySelector('#buttonCalculateRisk').style.color = 'blue'
        }

    }
    funMatch()

    /*
    data.pgs.dt.forEach((r,i)=>{
        let dtMatch_i=data.my23.dt.filter(myr=>(myr[2]==r[indPos])).filter(myr=>(myr[1]==r[indChr]))
        if(dtMatch_i.length>0){
            dtMatch.push(dtMatch_i.concat([r]))
        }
        //console.log(i/n)
    })
     */

}


function ui(targetDiv = document.body) {
    // target div for the user interface
    //console.log(`prsCalc module imported at ${Date()}`)
    if (typeof (targetDiv) == 'string') {
        targetDiv = getElementById('targetDiv')
    }
    //console.log(pgs)
    let div = document.createElement('div')
    targetDiv.appendChild(div)
    div.id = 'prsCalcUI'
    div.innerHTML = `
    <p>
	Below you can select, and inspect, <b style="color:maroon">A)</b> the <a href='https://www.pgscatalog.org' target="_blank">PGS Catalog</a> entries with risk scores for a list of genomic variations; and <b style="color:maroon">B)</b> <a href="https://you.23andme.com/tools/data/download" target="_blank">Your 23andMe data download</a>. Once you have both (A) and (B), you can proceed to <b style="color:maroon">C)</b> to calculate your raw polygenic risk score for the trait targeted by the PGS entry based on <br>PRS  =  exp( ∑ ( 𝛽 * z )). Where β is the effect size (or beta) of one variant and z is the number of copies of the effect allele in that 23andme individual.
    </p>
    <hr>
    `
    // recall that PGS23 is only global to the module, it is not exported
    PGS23.divPGS = document.createElement('div');
    div.appendChild(PGS23.divPGS)
    PGS23.divPGS.id = "divPGS"

    PGS23.divPGSPlot = document.createElement('div');
    div.appendChild(PGS23.divPGSPlot)
    PGS23.divPGSPlot.id = "divPGSPlot"

    PGS23.div23 = document.createElement('div');
    div.appendChild(PGS23.div23)
    PGS23.divCalc = document.createElement('div');
    div.appendChild(PGS23.divCalc)
    PGS23.divCalc.id = "PGS23calc"
    PGS23.divCalc.PGS23data = PGS23.data

    div.PGS23 = PGS23
    // mapping the module global variable to the UI ... discuss
    PGS23.div = div
    // for convenience, mapping the in multiple ways
    PGS23.loadPGS()
    PGS23.load23()
    PGS23.loadCalc()
}

async function parsePGS(i = 4) {
    let obj = {
        id: i
    }
    obj.txt = await pgs.loadScore(i)
    let rows = obj.txt.split(/[\r\n]/g)
    let metaL = rows.filter(r => (r[0] == '#')).length
    obj.meta = {
        txt: rows.slice(0, metaL)
    }
    obj.cols = rows[metaL].split(/\t/g)
    obj.dt = rows.slice(metaL + 1).map(r => r.split(/\t/g))
    if (obj.dt.slice(-1).length == 1) {
        obj.dt.pop(-1)
    }
    // parse numerical types
    //const indInt=obj.cols.map((c,i)=>c.match(/_pos/g)?i:null).filter(x=>x)
    const indInt = [obj.cols.indexOf('chr_position'), obj.cols.indexOf('hm_pos')]
    const indFloat = [obj.cols.indexOf('effect_weight'), obj.cols.indexOf('allelefrequency_effect')]
    const indBol = [obj.cols.indexOf('hm_match_chr'), obj.cols.indexOf('hm_match_pos')]

    // /* this is the efficient way to do it, but for large files it has memory issues
    obj.dt = obj.dt.map(r => {
        // for each data row
        indFloat.forEach(ind => {
            r[ind] = parseFloat(r[ind])
        })
        indInt.forEach(ind => {
            r[ind] = parseInt(r[ind])
        })
        indBol.forEach(ind => {
            r[ind] = (r[11] == 'True') ? true : false
        })
        return r
    })

    // */
    // parse metadata
    obj.meta.txt.filter(r => (r[1] != '#')).forEach(aa => {
        aa = aa.slice(1).split('=')
        obj.meta[aa[0]] = aa[1]
        //debugger
    })
    return obj
}

function parse23(txt, info) {
    // normally info is the file name
    let obj = {}
    let rows = txt.split(/[\r\n]+/g)
    let n = rows.filter(r => (r[0] == '#')).length
    obj.meta = rows.slice(0, n - 1).join('\r\n')
    obj.cols = rows[n - 1].slice(2).split(/\t/)
    obj.dt = rows.slice(n)
    obj.dt = obj.dt.map((r, i) => {
        r = r.split('\t')
        r[2] = parseInt(r[2])
        // position in the chr
        r[4] = i
        return r
    })
    obj.info = info
    return obj
}

function saveFile(x, fileName) {
    // x is the content of the file
    // var bb = new Blob([x], {type: 'application/octet-binary'});
    // see also https://github.com/eligrey/FileSaver.js
    var bb = new Blob([x]);
    var url = URL.createObjectURL(bb);
    var a = document.createElement('a');
    a.href = url;
    if (fileName) {
        if (typeof (fileName) == "string") {
            // otherwise this is just a boolean toggle or something of the sort
            a.download = fileName;
        }
        a.click()
        // then download it automatically 
    }
    return a
}

// ploting

function plotAllMatchByEffect4(data = PGS23.data, dv2 = document.getElementById('errorDiv'),dv = document.getElementById('plotAllMatchByEffectDiv')) {
    //https://community.plotly.com/t/fill-shade-a-chart-above-a-specific-y-value-in-plotlyjs/5133

    const all_pgs_variants = {}
    const indChr = data.pgs.cols.indexOf('hm_chr')
    const indPos = data.pgs.cols.indexOf('hm_pos')
    const indBeta = data.pgs.cols.indexOf('effect_weight')

    // MATCHED ---------------------------
    // separate pgs.dt into 2 (matches and non matches) arrays and then sort by effect  
    if (!dv2) {
        dv2 = document.createElement('div')
        document.body.appendChild(dv2)
    }
    dv2.innerHTML = ''
    let duplicate = ''
    
    const matched = data.pgsMatchMy23.map(function (v) {
        if(v.length==2){
            return v[1]

        } else if(v.length==3){
            console.log("two 23andme SNPS mapped to one pgs variant",v)
            duplicate += `<span style="font-size:small; color: red">Warning : two 23andMe variants mapped to pgs variant : chr.position ${v[2][indChr]+"."+v[2][indPos]}<br>Only the first 23andMe variant is used: ${v[0]}</span><br>`
            dv2.innerHTML = duplicate
            return v[2]
        }else if(v.length>3){
            duplicate += `<span style="font-size:small; color: red">Warning : more than two 23andMe variants mapped to a pgs variant<br>please check 23andMe file for duplicate chromosome.position</span><br>`
            dv2.innerHTML = duplicate
            console.log("more than 2 23andme SNPS mapped to one pgs variant",v)
            return v[2]
    }
    }) // " matched" data

    const matched_risk = matched.map((j) => {
        return j[indBeta]
    })

    const matched_chrPos = matched.map(j => {
        return `Chr${j[indChr]}.${j[indPos]}`
    })
    all_pgs_variants['matched'] = {}
    all_pgs_variants.matched.chrPos = matched_chrPos
    all_pgs_variants.matched.dt = matched
    all_pgs_variants.matched.alleles = data.alleles
    all_pgs_variants.matched.risk = matched_risk
    all_pgs_variants.matched.category = Array(matched.length).fill("matched")

    //     // NON-MATCHED --------------------------------------------------------------------------------------------
    const notMatchData = data.pgs.dt.filter(element => !matched.includes(element)); // "not matched" data

    // sort by effect
    let not_matched_idx = [...Array(notMatchData.length)]
        .map((_, i) => i).sort((a, b) => (notMatchData[a][4] - notMatchData[b][4])) //match indexes
    const not_matched = not_matched_idx.map(j => {
        let xi = notMatchData[j]
        return xi
    })
    const not_matched_chrPos = not_matched.map(j => {
        return `Chr${j[indChr]}.${j[indPos]}`
    })

    const not_matched_risk = not_matched.map((yi, i) => yi[indBeta])

    all_pgs_variants['not_matched'] = {}
    all_pgs_variants.not_matched.chrPos = not_matched_chrPos
    all_pgs_variants.not_matched.dt = not_matched
    all_pgs_variants.not_matched.risk = not_matched_risk
    const fill_no_match = `${not_matched.length} not matched`
    all_pgs_variants.not_matched.category = Array(not_matched.length).fill(fill_no_match)
    all_pgs_variants.not_matched.size = Array(not_matched.length).fill("9")
    all_pgs_variants.not_matched.color = Array(not_matched.length).fill("rgb(140, 140, 140)")
    all_pgs_variants.not_matched.opacity = Array(not_matched.length).fill("0.5")
    all_pgs_variants.not_matched.symbol = Array(not_matched.length).fill("x")
    all_pgs_variants.not_matched.hoverinfo = Array(not_matched.length).fill("all")
    //     // ALL VARIANTS -------------------------------------------------------------------------------------
    //const allData = matchData2.concat(notMatchData)
    const allData = data.pgs.dt
    //const allData = data.pgs.dt

    let allData_idx = [...Array(allData.length)].map((_, i) => i).sort((a, b) => (allData[a][4] - allData[b][4])) //match indexes
    const allData_sorted = allData_idx.map(j => {
        let xi = allData[j]
        return xi
    })
    const allData_chrPos = allData.map(j => {
        return `Chr${j[indChr]}.${j[indPos]}`
    })

    const allData_risk = allData.map((yi, i) => yi[indBeta])

    all_pgs_variants['all'] = {}
    all_pgs_variants.all.chrPos = allData_chrPos
    all_pgs_variants.all.dt = allData_sorted
    all_pgs_variants.all.risk = allData_risk
    all_pgs_variants.all.category = Array(allData_sorted.length).fill(" ")
    all_pgs_variants.all.size = Array(allData_sorted.length).fill("10")
    all_pgs_variants.all.color = Array(allData_sorted.length).fill("green")
    all_pgs_variants.all.opacity = Array(allData_sorted.length).fill("0")
    all_pgs_variants.all.symbol = Array(allData_sorted.length).fill("square")
    all_pgs_variants.all.hoverinfo = Array(allData_sorted.length).fill("none")
    // MATCHED BY alleles---------------------------
    // separate data.pgsMatchMy23 into 3 (dosage #) arrays

    // 43 matched variants (betas from pgs for now)
    //https://stackoverflow.com/questions/40415231/how-to-get-an-array-of-values-based-on-an-array-of-indexes
    const zero_allele = matched.filter((ele, idx) => data.alleles[idx] == 0);
    const zero_allele_idx = data.alleles.map((elm, idx) => elm == 0 ? idx : '')
        .filter(String);
    //zero_alleles.forEach(function(arr){arr.push("matched, no effect allele")});  // add trace name here   
    const one_allele = matched.filter((ele, idx) => data.alleles[idx] == 1);
    const one_allele_idx = data.alleles.map((elm, idx) => elm == 1 ? idx : '')
        .filter(String);
    const two_allele = matched.filter((ele, idx) => data.alleles[idx] == 2);
    const two_allele_idx = data.alleles.map((elm, idx) => elm == 2 ? idx : '')
        .filter(String);


    //const zero_alleles_risk = (dt.matches).map(function(v) { return v[1]}).filter((ele, idx) => dt.alleles[idx] == 0).map(function(v) { return v[4]})

    // x (chr pos)  y (betas or betas*dosage) data
    const zero_allele_chrpos = zero_allele_idx.map(i => `Chr${matched[i][indChr]}.${matched[i][indPos]}`)
    const one_allele_chrpos = one_allele_idx.map(i => `Chr${matched[i][indChr]}.${matched[i][indPos]}`)
    const two_allele_chrpos = two_allele_idx.map(i => `Chr${matched[i][indChr]}.${matched[i][indPos]}`)

    all_pgs_variants['matched_by_alleles'] = {}
    all_pgs_variants.matched_by_alleles.zero_allele = {}
    all_pgs_variants.matched_by_alleles.one_allele = {}
    all_pgs_variants.matched_by_alleles.two_allele = {}

    all_pgs_variants.matched_by_alleles.zero_allele.chrPos = zero_allele_chrpos
    all_pgs_variants.matched_by_alleles.one_allele.chrPos = one_allele_chrpos
    all_pgs_variants.matched_by_alleles.two_allele.chrPos = two_allele_chrpos
    all_pgs_variants.matched_by_alleles.zero_allele.dt = zero_allele
    all_pgs_variants.matched_by_alleles.one_allele.dt = one_allele
    all_pgs_variants.matched_by_alleles.two_allele.dt = two_allele
    all_pgs_variants.matched_by_alleles.zero_allele.risk = zero_allele_idx.map(i => matched[i][indBeta]);
    all_pgs_variants.matched_by_alleles.one_allele.risk = one_allele_idx.map(i => matched[i][indBeta]);
    all_pgs_variants.matched_by_alleles.two_allele.risk = two_allele_idx.map(i => matched[i][indBeta]);
    all_pgs_variants.matched_by_alleles.zero_allele.category = Array(zero_allele.length).fill(`${zero_allele.length } matched, zero alleles`)
    all_pgs_variants.matched_by_alleles.one_allele.category = Array(one_allele.length).fill(`${one_allele.length } matched, one allele`)
    all_pgs_variants.matched_by_alleles.two_allele.category = Array(two_allele.length).fill(`${two_allele.length } matched, two alleles`)
    all_pgs_variants.matched_by_alleles.zero_allele.size = Array(zero_allele.length).fill("8")
    all_pgs_variants.matched_by_alleles.one_allele.size = Array(one_allele.length).fill("8")
    all_pgs_variants.matched_by_alleles.two_allele.size = Array(two_allele.length).fill("10")
    all_pgs_variants.matched_by_alleles.zero_allele.color = Array(zero_allele.length).fill("#17becf")
    all_pgs_variants.matched_by_alleles.one_allele.color = Array(one_allele.length).fill("navy")
    all_pgs_variants.matched_by_alleles.two_allele.color = Array(two_allele.length).fill("#d62728")
    all_pgs_variants.matched_by_alleles.zero_allele.opacity = Array(zero_allele.length).fill("1")
    all_pgs_variants.matched_by_alleles.one_allele.opacity = Array(one_allele.length).fill("1")
    all_pgs_variants.matched_by_alleles.two_allele.opacity = Array(two_allele.length).fill("1")
    all_pgs_variants.matched_by_alleles.zero_allele.symbol = Array(zero_allele.length).fill("0")
    all_pgs_variants.matched_by_alleles.one_allele.symbol = Array(one_allele.length).fill("diamond")
    all_pgs_variants.matched_by_alleles.two_allele.symbol = Array(two_allele.length).fill("square")
    all_pgs_variants.matched_by_alleles.zero_allele.symbol = Array(zero_allele.length).fill("0")
    all_pgs_variants.matched_by_alleles.one_allele.symbol = Array(one_allele.length).fill("diamond")
    all_pgs_variants.matched_by_alleles.two_allele.symbol = Array(two_allele.length).fill("square")
    all_pgs_variants.matched_by_alleles.zero_allele.hoverinfo = Array(zero_allele.length).fill("all")
    all_pgs_variants.matched_by_alleles.one_allele.hoverinfo = Array(one_allele.length).fill("all")
    all_pgs_variants.matched_by_alleles.two_allele.hoverinfo = Array(two_allele.length).fill("all")


    // add matched,all, zero, one and two allele into new array
    //https://stackoverflow.com/questions/64055094/push-multiple-arrays-with-keys-into-single-array
    function Push(data, subdata) {
        return subdata.map((_, i) => {
            return Object.entries(data).reduce((a, [k, arr]) => (a[k] = arr[i], a), {})
        })
    }
    const items = Push(all_pgs_variants.all, all_pgs_variants.all.risk).concat(
        Push(all_pgs_variants.not_matched, all_pgs_variants.not_matched.risk)).concat(
        Push(all_pgs_variants.matched_by_alleles.zero_allele, all_pgs_variants.matched_by_alleles.zero_allele.risk)).concat(
        Push(all_pgs_variants.matched_by_alleles.one_allele, all_pgs_variants.matched_by_alleles.one_allele.risk)).concat(
        Push(all_pgs_variants.matched_by_alleles.two_allele, all_pgs_variants.matched_by_alleles.two_allele.risk))

    plotRiskDiv.style.height = 20 + data.pgs.dt.length * 1.1 + 'em'
    plotAllMatchByEffectDiv.style.height = 20 + data.pgs.dt.length * 1.1 + 'em'

    // make new objects with id, all mapped to one condition sorted by value
    //https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
    // subset data depending on the plot
    //https://stackoverflow.com/questions/4894142/making-a-subset-of-an-array-of-javascript-objects-based-on-one-of-their-properti

    const cache = []
    const chooseData = [" ", `${zero_allele.length } matched, zero alleles`, `${one_allele.length } matched, one allele`, `${two_allele.length } matched, two alleles`, `${not_matched.length} not matched`]

    const plotData = items
        .filter(function (item) {
            if (chooseData.indexOf(item.category) === -1) {
                cache.push(item);
                return false;
            } else {
                return true;
            }
        })
        .sort((a, b) => parseFloat(a.risk) - parseFloat(b.risk))

    // TODO------------------------------------------
    // re-order plot legend manually, order conditions list by regex 
    const conditions_arr = Array.from(new Set(plotData.map(a => a.category)))

    //const conditions_arr = [' ',  'not matched', 'matched, zero alleles', 'matched, one allele', 'matched, two alleles']
    var rx_not = new RegExp(/\bnot?(?!S)/);
    var rx_zero = new RegExp(/\bzero?(?!S)/);
    var rx_one = new RegExp(/\bone?(?!S)/);
    var rx_two = new RegExp(/\btwo?(?!S)/);
    function getSortingKey(value) {
        if (rx_not.test(value)) {
            return 2}
        if (rx_zero.test(value)) {
            return 3}
        if (rx_one.test(value)) {
            return 4}
        if (rx_two.test(value)) {
            return 5}
        return 1;
    }
    const conditions = conditions_arr.sort(function(x,y){
        return getSortingKey(x) - getSortingKey(y);
    });
    const traces = [];
    conditions.forEach(function (category) {
        var newArray = plotData.filter(function (el) {
            return el.category == category;
        });
        traces.push({
            y: newArray.map(a => a.chrPos),
            x: newArray.map(a => a.risk),
            name: category,
            hoverinfo: newArray[0].hoverinfo,
            mode: 'markers',
            type: 'scatter',
            opacity: newArray[0].opacity,
            marker: {
                color: newArray[0].color,
                symbol: newArray[0].symbol,
                size: newArray[0].size,
            }
        })
    })
      

    var layout = {
        title: {
            text: `<span >PGS#${data.pgs.meta.pgs_id.replace(/^.*0+/,'')}: β's for ${data.pgs.dt.length} ${data.pgs.meta.trait_mapped} variants, PRS ${Math.round(data.PRS*1000)/1000}</span>`,
            font: {
                //family: 'Lato',
                size: 19
            }
        },
        margin: {
            l: 140,
          },
       // width:'20em',
 
        showlegend: true,
        legend: {
            orientation: 'v',
            font: {
                size: 16
            }
        },
        yaxis: {
            // remove white space at top and bottom of y axis caused by using "markers"
            range: [-1, data.pgs.dt.length],
            showgrid: true,
            showline: true,
            mirror: 'ticks',
            gridcolor: '#bdbdbd',
            gridwidth: 1,
            linecolor: '#636363',
            //mirror: true,
             title: {
                text: '<span style="font-size:large">Chromosome and Position</span>',
                font: {
                    size: 24
                  },
                standoff: 10
             },
            tickfont: {
                size: 10.5
            },
        },
        xaxis: {
            font: {
                size: 18
            },
            tickfont: {
                size: 16
            },
            title: '<span style="font-size:large">β</span>',
            linewidth: 1,
            mirror: true,
        }
    }

    dv.innerHTML = ''
    // auto resize plot height, width is responsive, but not height
    // FIX Plot https://github.com/plotly/angular-plotly.js/issues/48

    var config = {
        responsive: true
    }
    data.plot = all_pgs_variants
    data.plot.traces = traces

    Plotly.newPlot(dv, traces, layout, config)
    tabulateAllMatchByEffect()
}
/* Plot percent of matched and not matched betas */


function tabulateAllMatchByEffect(data = PGS23.data, div = document.getElementById('tabulateAllMatchByEffectDiv')) {

    if (!div) {
        div = document.createElement('div')
        document.body.appendChild(div)
    }
    div.innerHTML = `<span style="font-size:x-large">PRS = exp( ∑ (𝛽*z)) = ${Math.round(data.PRS*1000)/1000}</span><br><hr><div>Table for ${data.plot.matched_by_alleles.one_allele.dt.length + data.plot.matched_by_alleles.two_allele.dt.length} matched PGS variants (dosage = 1 or 2)</div><hr>`
    // sort by absolute value
    let jj = [...Array(data.calcRiskScore.length)].map((_, i) => i) // match indexes
    // remove zero effect
    // jj = jj.filter(x=>abs[x]>0)
    jj = jj.filter(x => data.calcRiskScore[x] != 0)
    // let abs = data.calcRiskScore.map(x => Math.abs(x))
    // jj.sort((a, b) => (abs[b] - abs[a])) // indexes sorted by absolute value
    jj.sort((a, b) => (data.calcRiskScore[b] - data.calcRiskScore[a])) // indexes sorted by absolute value

    // tabulate
    let tb = document.createElement('table')
    div.appendChild(tb)
    let thead = document.createElement('thead')
    tb.appendChild(thead)
    thead.innerHTML = `<tr><th align="left">#</th><th>β</th><th align="left">z</th><th align="right"> β*z</th><th align="center">variant</th><th align="center">dbSNP</th><th align="left">SNPedia </th></tr>`
    let tbody = document.createElement('tbody')
    tb.appendChild(tbody)
    const indChr = data.pgs.cols.indexOf('hm_chr')
    const indPos = data.pgs.cols.indexOf('hm_pos')

    let indOther_allele = data.pgs.cols.indexOf('other_allele')
    if (indOther_allele == -1) {
        indOther_allele = data.pgs.cols.indexOf('hm_inferOtherAllele')
    }
    const indEffect_allele = data.pgs.cols.indexOf('effect_allele')
    const indEffect_weight = data.pgs.cols.indexOf('effect_weight')

    let n = jj.length
    
    jj.forEach((ind, i) => {
        //let jnd=n-ind
        
        let row = document.createElement('tr')
        tbody.appendChild(row)

        let xi = data.pgsMatchMy23[ind]
        let my_23idx = 1
         if(xi.length>2){my_23idx = 2} 
        row.innerHTML = `<tr><td align="left">${i+1})</td><td align="center">${Math.round(xi[my_23idx][indEffect_weight]*1000)/1000}</td><td align="center">${data.alleles[ind]}</td><td align="left">${Math.round(data.calcRiskScore[ind]*1000)/1000}</td><td align="left" style="font-size:small;color:darkgreen"><a href="https://myvariant.info/v1/variant/chr${xi.at(-1)[indChr]}:g.${xi.at(-1)[indPos]}${xi.at(-1)[indOther_allele]}>${xi.at(-1)[indEffect_allele]}" target="_blank">Chr${xi.at(-1)[indChr]}.${xi.at(-1)[indPos]}:g.${xi.at(-1)[indOther_allele]}>${xi.at(-1)[indEffect_allele]}</a></td><td align="left"><a href="https://www.ncbi.nlm.nih.gov/snp/${xi[0][0]}" target="_blank">${xi[0][0]}</a><td align="left"><a href="https://www.snpedia.com/index.php/${xi[0][0]}" target="_blank">  wiki   </a></td></tr>`
    })

    // <div id='plotSnpConsequence' style='display: inline-block;' ></div>
 
    //debugger
}

function pieChart(data = PGS23.data) {
    pieChartDiv.style.height = 19 + 'em'

    /* Plot percent of matched and not matched betas */
    const risk_composition = {}
    const risk1 = data.plot.matched.risk.reduce((partialSum, a) => partialSum + a, 0);
    const risk2 = data.plot.not_matched.risk.reduce((partialSum, a) => partialSum + a, 0);
    risk_composition[`total β for ${data.plot.matched.risk.length} <br>matched variants`] = risk1
    risk_composition[`total β for ${data.plot.not_matched.risk.length} <br>unmatched variants`] = risk2
    var y = Object.values(risk_composition)
    var x = Object.keys(risk_composition)
    var piePlotData = [{
        values: y,
        labels: x,
        //showlegend: false,
        insidetextorientation: "horizontal",
        //automargin : "true",
        textinfo: "percent",
        textposition: "inside",
        type: 'pie',
        //automargin: true,
        marker: {
            colors: ["#2ca02c", "grey"],
            size: 19,
            line: {
                color: 'black'
            }
        },
        textfont: {
            //family: 'Lato',
            color: 'black',
            size: 19
        },
        //insidetextfont: {size:30},

        hoverlabel: {
            bgcolor: 'black',
            bordercolor: 'black',
            font: {
               // family: 'Lato',
                color: 'white',
                size: 18
            }
        }
    }]
    var layout = {
        //legend: { x: -1 },
        title: {
        text:` PGS#${data.pgs.meta.pgs_id.replace(/^.*0+/,'')}: total β contribution for ${data.pgsMatchMy23.length} matched <br>and ${data.pgs.dt.length-data.pgsMatchMy23.length} unmatched variants`,
        font: {
            //family: 'Lato',
            size: 19
        }
     },// x: 50, y: 60},
        // height: 410,
        // width: 750,
        width:'20em',
        legend: {
           xanchor:"right",
           // x:-0.02, y:0.7,  // play with it
            font: {
                //family: 'Lato',
                size: 16
            }
        },
       //margin: { r:4}//l: 50, t:40,b:100 }
    };
    var config = {
        responsive: true
    }

    Plotly.newPlot('pieChartDiv', piePlotData, layout, config);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getInfoSnps() {
    var data = document.getElementById("PGS23calc").PGS23data
    var rs = data.calcRiskScore
    var i = 0
    var ide = []
    rs.forEach(risk => {
        if (risk > 0 || risk < 0) {
            ide.push(data.pgsMatchMy23[i][0][0])
        }
        i += 1
    })

    i = 0
    var info = []
    while (i < ide.length) {
        var end = ((i + 15) <= ide.length) ? i + 15 : ide.length
        var temp = ide.slice(i, end)
        info = info.concat(await Promise.all(temp.map(async rsid => {
            var url = `https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json`
            var enrich = await (await fetch(url)).json()
            await sleep(300)
            return enrich
        })))

        i += 15
        if (i >= ide.length) {
            break
        }
    }

    return info
}


export {
    ui,
    PGS23,
    parsePGS,
    parse23,
    plotAllMatchByEffect4,
}
