    //utils
    
    // wait ms 
    function delay(miliseconds) {

        return new Promise(resolve => setTimeout(resolve, miliseconds));
    };

    // wait to load a selector
    const waitingForSelector = async function(selector, times=200) {
        for (var i=0; i<times; i++){
            if (document.querySelector(selector)) return document.querySelector(selector)   
            await delay(20)
        }
        return null
    }

    // scrooll until end of selector
    const autoscrollToElement = async function(cssSelector){
    
        let exists = document.querySelector(cssSelector);
    
        while(exists){
            //
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY    
    
            if(maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                break;
    
            await delay(20)
    
            let newScrollTop = Math.min(currentScrollTop + 50, maxScrollTop);
            window.scrollTo(0,newScrollTop)
        }    
        console.log('finish autoscroll to element %s', cssSelector);
        return new Promise(function(resolve){resolve();});
    };

    // click on a selector
    const clickOnSelector = async function(cssSelector, cssSelectorTarget=null){
        const element = document.querySelector(cssSelector)?.click()
        if (cssSelector) await waitingForSelector(cssSelectorTarget)
        // await delay(500)
    }

    // crear popup
    const createPopup = ()=>{
        const styleDiv = "position: fixed;z-index: 2000;width:100%; top: 0px;left: 0px;overflow: visible;display: flex;align-items: flex-end;background-color: lightgray;font-size: 10px;padding: 10px;";
        const stylePre = "position: relative;max-height: 400px;overflow: scroll;width: 100%;"
        const div = document.createElement('div')
        div.id = "krowdy-message"
        div.style = styleDiv

        const pre = document.createElement('pre')
        pre.id = "krowdy-pre"
        pre.style = stylePre

        const button = document.createElement('button')
        
        button.id = "krowdy-button"
        button.style = "background: gray;border: 2px solid;padding: 8px;"
        button.innerText ="Aceptar"

        const bodyElement = document.querySelector('div.body')
        
        bodyElement.appendChild(div)

        pre.innerText = "Estamos extrayendo la información!!!!"
        div.appendChild(pre)
        div.appendChild(button)
        return {div,pre,button}
    }

    console.log('se cargo el utils')




