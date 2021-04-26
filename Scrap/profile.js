
async function scrapingProfile (searchtext){

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

    // Search input
    const getSearch = async (searchText)=>{
        const inputSearch = document.querySelector('.search-global-typeahead__input')
        inputSearch.value = searchText
        const keycode = new KeyboardEvent('keydown', {'keyCode':13, 'which':13}); 
        inputSearch.dispatchEvent(keycode);  
        const listCSS = '#main > div > div > div:nth-child(1) > ul> li'
        await waitingForSelector(listCSS);
        return    window.location.href
    }

    
    // selectors
    const cssSelectorProfile = {
            topInformation:{
                name: 'div.ph5 > div.mt2 > div > ul >li',
                title: 'div.ph5 > div.mt2 > div.mr5 >h2',
                country: 'div.ph5 > div.mt2 > div.mr5 > ul.mt1 > li',
            },
            contactInfo:{
                buttonContactInfo: '[data-control-name="contact_see_more"]',
                buttonCloseContactInfo:'button.artdeco-modal__dismiss',
                phone: 'div > section > ul > li > span',
                email: 'div > section.pv-contact-info__contact-type.ci-email > div > a'
            },
            about:{
                buttonSeeMoreAbout:'#line-clamp-show-more-button',
                resume:'section.pv-about-section > p'
            },
            experienceInformation:{
                buttonShowMoroExperience:'#experience-section> div > button',
                list : '#experience-section > ul > li',
                groupByCompany:{
                    identify:'.pv-entity__position-group',
                    company: 'div.pv-entity__company-summary-info > h3 > span:nth-child(2)',
                    list: 'section > ul > li',
                    title: 'div > div > div > div > div > div > h3 > span:nth-child(2)',
                    date:'div > div > div > div > div > div > div > h4 > span:nth-child(2)',
                    description: '.pv-entity__description'
                },
                default:{
                    title: 'section > div > div > a > div.pv-entity__summary-info > h3',
                    company:'section > div > div > a > div.pv-entity__summary-info > p.pv-entity__secondary-title',
                    date: 'section > div > div > a > div.pv-entity__summary-info > div > h4.pv-entity__date-range > span:nth-child(2)',
                    description: 'section > div > div > div > p'
                }
            },
            educationInformation:{
                buttonShowMoroEdu:'#education-section > div > button',
                list: '#education-section > ul > li',
                institution :'div > div > a > div.pv-entity__summary-info > div > h3',
                career : 'div > div > a > div.pv-entity__summary-info > div > p > span:nth-child(2)',
                date : 'div > div > a > div.pv-entity__summary-info > p > span:nth-child(2)'
            }
        }



    // scrap by sections        
    const getTopInformation = async() => {
        const {topInformation: selector} = cssSelectorProfile
        const name = document.querySelector(selector.name)?.innerText
        const title = document.querySelector(selector.title)?.innerText
        const country = document.querySelector(selector.country)?.innerText
        return {name, title, country}
    }
    const getContactInfo = async() => {
        console.log('run getContactInfo ...')
        const {contactInfo: selector} = cssSelectorProfile
        await clickOnSelector(selector.buttonContactInfo)
        const phone = document.querySelector(selector.phone)?.innerText
        const email = document.querySelector(selector.email)?.innerText
        await clickOnSelector(selector.buttonCloseContactInfo,selector.buttonContactInfo )
        return {phone, email}
    }
    const getAbout = async() => {
        const {about: selector} = cssSelectorProfile
        await clickOnSelector(selector.buttonSeeMoreAbout)
        const resume = document.querySelector(selector.resume)?.innerText
        return {resume}
    }
    const getExperienceInformation = async ()=>{
        const {experienceInformation:selector} = cssSelectorProfile
        await clickOnSelector(selector.buttonShowMoroExperience)
        //get information
        let experiencesRawList = document.querySelectorAll(selector.list)
        let experiencesRawArray = Array.from(experiencesRawList)

        const groupCompaniesList = experiencesRawArray.filter(el=>{
            let groupCompanyExperience = el.querySelectorAll(selector.groupByCompany.identify)  
            return groupCompanyExperience.length >0
        })

        const uniqueExperienceList = experiencesRawArray.filter(el=>{
            let groupCompanyExperience = el.querySelectorAll(selector.groupByCompany.identify)  
            return groupCompanyExperience.length ==0
        })
        
        const experiences = uniqueExperienceList.map(el=>{
            const title = el.querySelector(selector.default.title)?.innerText
            const date = el.querySelector(selector.default.date)?.innerText
            const company = el.querySelector(selector.default.company)?.innerText
            const description = el.querySelector(selector.default.description)?.innerText
            
            return {title,date,company,description}
        })

        for(let i = 0; i< groupCompaniesList.length;i++){
            const item = groupCompaniesList[i]
            const company = item.querySelector(selector.groupByCompany.company)?.innerText
            const itemsCompanyGroupList = item.querySelectorAll(selector.groupByCompany.list)
            const itemsCompanyGroupArray = Array.from(itemsCompanyGroupList)

            const experiencesData = itemsCompanyGroupArray.map(el=>{
                const title = el.querySelector(selector.groupByCompany.title)?.innerText
                const date = el.querySelector(selector.groupByCompany.date)?.innerText
                const description = el.querySelector(selector.groupByCompany.description)?.innerText
                
                return {title,date,company,description}
            })

            experiences.push(...experiencesData)
        }

        return experiences
    }
    const getEducationInformation = async ()=>{
        const {educationInformation:selector} = cssSelectorProfile
        await clickOnSelector(selector.buttonShowMoroEdu)

        const educationItems = document.querySelectorAll(selector.list)
        const educationArray = Array.from(educationItems)
        const educations = educationArray.map(el=>{
            const institution = el.querySelector(selector.institution)?.innerText
            const career = el.querySelector(selector.career)?.innerText
            const date = el.querySelector(selector.date)?.innerText
            return {institution,career,date}
        })
        return educations
    }


    const scrapingProfile = async (i,lista)=>{
        console.log('cargando perfil...', i, 'de', lista.length)
        await waitingForSelector('[data-control-name="contact_see_more"]')

        const {div,pre,button} = createPopup();
        pre.innerText = 'start scrapping...'

        await autoscrollToElement('body')
        const topInformation =  await getTopInformation()
        const contactInfo = await getContactInfo()
        const about = await getAbout()
        const experiences = await getExperienceInformation()
        const educations = await getEducationInformation()

        //setting object to show
        const profile = {...topInformation, 
            contactInfo:contactInfo, 
            about:about,
            experiences:experiences,
            educations:educations
          }
        
        // console.log(JSON.stringify(profile,null,2))
        pre.innerText = JSON.stringify(profile,null,2)
        await delay(500)
        div.remove()
        // history.go(-1);
        button.addEventListener('click',()=>{
            div.remove()
            // history.go(-1);
        })

        return profile;
    }



    // general flow
    const letsScrape = async(searchtext) => {
        inicio  = await  getSearch(searchtext);
        await delay(2000)
        
        // list of people
        const listCSS =  '#main > div > div > div:nth-child(1) > ul>li'
        const elementLinkCSS = '.app-aware-link'
        await waitingForSelector(listCSS);
        delay (500)
        const lista = document.querySelectorAll(listCSS)
        links = []
        for(i =0 ; i < lista.length; i++){
            links[i] = lista[i].querySelector(elementLinkCSS).getAttribute('href')
        }

        const profiles = [];
        for(i =0 ; i < lista.length; i++){
            
            // window.location.href =  links[i]
            await lista[i].querySelector(elementLinkCSS).click()
            await delay(50)
            const profile  = await scrapingProfile(i,lista)
            profiles.push(profile)
            window.location.href =  inicio
            await waitingForSelector(listCSS);
        }
        return profiles;
    }
 
    await letsScrape(searchtext)
    // await clickOnSelector(cssSelectorProfile.topInformation.buttonSeeMoreAbout)
    
}
    



//Comunication
(function(){
    // alert("start")
    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(msg) {
          const {acction} = msg
          const {searchtext} = msg
     
          switch(acction){
              case "search": scrapingProfile(searchtext)
              break;
          }
        });
})})();