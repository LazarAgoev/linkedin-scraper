import scrape from './eachPage.js'
import get_page from './eachPage.js'
import puppeteer from "puppeteer"

//const fs = require('fs')
//const cheerio = require('cheerio');
//const puppeteer = require('puppeteer');


const options = {
    args: ['--start-maximized', 'disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
async function scroll(page){
    for(let i =1; i<5; i++){
        await page.evaluate((i) => {
            let scroll_div = document.getElementsByClassName("jobs-search-results-list")[0];
            scroll_div.scroll(0, window.innerHeight*i)
        },i);
        await sleep(1000)
    }
}
export async function getJobs(str, browser, num_jobs){
    
    const page = await browser.newPage()
    await page.goto(str);
    await sleep(4*1000)
    
    //scroll down
    await scroll(page);
    




    //await page_down(page, 1); //num = 6 for 175 jobs not used in a sign in mode

 

    //await sleep(5*1000)
    let numLinks = await page.$$eval('div.job-card-container', a => a.length); 
 

    //reads information from each job
    const prefix = "https://www.linkedin.com/"

    for (let i = 0; i < numLinks && i<num_jobs; i++) { // i is how many jobs is to be read
        
        const element1 = await page.evaluateHandle((i) => document.getElementsByClassName("disabled ember-view job-card-container__link job-card-list__title")[i],i);
        const resultHandle1 = await page.evaluateHandle(elements => elements.getAttribute("href"), element1);
        let link = await resultHandle1.jsonValue();
  
        
        
        const element2 = await page.evaluateHandle((i) => document.getElementsByClassName("job-card-container relative")[i],i);
        const resultHandle2 = await page.evaluateHandle(elements => elements.getAttribute("data-job-id"), element2);
        let job_id = await resultHandle2.jsonValue();

        let wait = getRandomInt(3) + 2;
        await sleep(wait * 1000);   // keep this number hight,   //this is fixed
                                // they are not letting to read them otherwise
                                //preferably make it random

        const string_content = await scrape(prefix+link, browser, job_id)  /* have to put await
                                                                        pages have to be scrolled down separately */
        


    }
    
    //await page.close();
    //await browser.close();

}
async function page_down(page, num){

    for(let i=0; i<num; i++){ //need 5 presses for 175 jobs
        await sleep(3*1000)
        await page.keyboard.press('End')
    }
    
    await sleep(5 * 1000);

}

 //coments bellow is for  the "Show more" button, they don't work and not needed anymore

    //await page.click("button.cta-modal__dismiss-btn")

    //await page.click('[data-tracking-control-name="public_jobs_footer-about"]')
    //await sleep(3*1000)

    //await page.click('button[aria-label="Load more results"]')
    //await sleep(3*1000)
    
    //await page.hover("button.infinite-scroller__show-more-button.infinite-scroller__show-more-button--visible")
    //await page.click("button.infinite-scroller__show-more-button.infinite-scroller__show-more-button--visible")
   

export default getJobs