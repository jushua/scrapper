let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: scrapingProfile,
    })
})



function scrapingProfile (){

    //utils
    function delay(miliseconds) {
        return new Promise(resolve => setTimeout(resolve, miliseconds));
    };
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
    const cssSelectorProfile = {
            profile:{
                name: 'div.ph5 > div.mt2 > div > ul >li',
                resume: 'div.ph5 > div.mt2 > div.mr5 >h2',
                country: 'div.ph5 > div.mt2 > div.mr5 > ul.mt1 > li',
                buttonSeeMore: '[data-control-name="contact_see_more"]',
                buttonCloseSeeMore: 'button.artdeco-modal__dismiss'
            },
            contactInfo:{
                phone: 'div > section > ul > li > span',
                email: 'div > section.pv-contact-info__contact-type.ci-email > div > a'
            }
        }

    const getContactProfile = async () =>{

        const {profile:{
            name: nameCSS,
            resume:resumeCSS, 
            country:countryCSS,
            buttonSeeMore:buttonSeeMoreCSS,
            buttonCloseSeeMore:buttonCloseSeeMoreCSS
        },
        contactInfo:{
            phone: phoneCSS,
            email: emailCSS
        }} = cssSelectorProfile;

        const name = document.querySelector(nameCSS)?.innerText
        const resume = document.querySelector(resumeCSS)?.innerText
        const country = document.querySelector(countryCSS)?.innerText
        
        const buttonSeeMore = document.querySelector(buttonSeeMoreCSS)
        buttonSeeMore.click()
        await delay(500)
        const phone = document.querySelector(phoneCSS)?.innerText
        const email = document.querySelector(emailCSS)?.innerText
        const buttonCloseSeeMore = document.querySelector(buttonCloseSeeMoreCSS)
        buttonCloseSeeMore.click()

        await autoscrollToElement('body')

        return {name, resume, country, phone, email}
    };

    const getProfile = async () => {        
        const profile = await getContactProfile();
        console.log('Profile:')
        console.log(profile)
    }

    getProfile();

}
    
