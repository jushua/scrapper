let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab != null) {
        var port = chrome.tabs.connect(tab.id);
        var searchtext = document.getElementById('searchText').value;
        // alert(searchText)
        if(searchtext){
            // alert(searchText)
            port.postMessage({acction: 'search', searchtext:searchtext});
            // chrome.scripting.executeScript({            
            //     target: {tabId: tab.id},
            //     // function: scrapingProfile,
            //     files:['./Scrap/profile.js']
            // })

        }


    }
    else {
        const pAlert = document.getelementById('alert')
        pAlert.innerText = 'No se tiene permiso para los tabs'
    } 
})


