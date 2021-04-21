
async function scrapingProfile (){


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

    // general flow
    const letsScrape = async() => {
        // list of people
        const listCSS = '#main > div > div > div:nth-child(1) > ul> li'
        const elementListCSS = 'div > div > div > div > div > div > span > div > span> span > a'
        const lista = document.querySelectorAll(listCSS)
        for(i =0 ; i < lista.length; i++){
            await lista[i].querySelector(elementListCSS).click()
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
            
            button.addEventListener('click',()=>{
                div.remove()
            })
            
            // history.go(-2);
            // await delay(2000);
        }

    }

 
    letsScrape()
    // await clickOnSelector(cssSelectorProfile.topInformation.buttonSeeMoreAbout)
    
}
    
scrapingProfile()