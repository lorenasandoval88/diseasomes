(async()=>{
    pgs23 = await import('https://episphere.github.io/prs/export.js')
    //pgs23 = await import('http://127.0.0.1:5501/export.js')
    if(typeof(define)!='undefined'){
        define(pgs23)
    }
})()
