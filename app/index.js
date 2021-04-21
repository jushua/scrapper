let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab != null) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            // function: scrapingProfile,
            files:['./Scrap/profile.js']
        })
    }
    else {
        const pAlert = document.getelementById('alert')
        pAlert.innerText = 'No se tiene permiso para los tabs'
    } 
})


