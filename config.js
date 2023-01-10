import scrape from './eachPage.js'
import getJobs from './getPages.js';
import puppeteer from "puppeteer"


/*
create your own burner account for Linked in and enter the credentials
*/
const LOGIN = "kevincosta3763@gmail.com";
const PASSWORD = "20000819a";
/*
JOBNAME is the name of the job you want to scrape
NUMJOBS is now many jobs you need to scrape
*/
const JOBNAME="Software engineer";
const NUMJOBS=2;




const options = {
    args: ['--start-maximized', 'disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(){

  let link = "https://www.linkedin.com/jobs/search/?geoId=&keywords="
  let nameArr=JOBNAME.split(" ")
  for(let i=0; i<nameArr.length; i++){
    link=link+nameArr[i].toLowerCase()+"%20" 
  }
  link = link.replace(/...$/, ''); 
  link = link + "&location=&start=";


  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.goto(link+0);
  
  
  let sign = await page.evaluate('document.querySelector("a.nav__button-secondary.btn-md.btn-secondary-emphasis").getAttribute("href")');
  await page.goto(sign);
  await page.click("#username")
  await page.keyboard.type(LOGIN)
  await sleep(1000);
  await page.click("#password")
  await page.keyboard.type(PASSWORD)

  await page.click('[data-litms-control-urn="login-submit"]');
  await page.waitForNavigation();
  page.close()

  let num_pages = Math.floor(NUMJOBS/25);
  let last_page = NUMJOBS%25;
  for(let p=0;p<num_pages;p++){
      
      await getJobs(link+25*p, browser, 25)
  }
  await getJobs(link+25*num_pages, browser, last_page);
  console.log("done")
  }





  run();
  