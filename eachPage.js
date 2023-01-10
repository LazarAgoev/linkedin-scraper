import fs from "fs"
import cheerio from "cheerio"
import puppeteer from "puppeteer"

const options = {
    args: ['--start-maximized', 'disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrape(fullLink, browser, job_id){
    const page = await browser.newPage()
    
    await page.goto(fullLink, {
        waitUntil: "domcontentloaded",
      });
    
    await sleep(2*1000)
    await page.keyboard.press('End')
    await sleep(2*1000)
    await page.keyboard.press('End')
    await sleep(2*1000)

    const content = await page.content()
    /*
    let data_old = {
        link : fullLink,
        title : null,
        job_id : null,
        company:{ name : null, 
                  location : null, 
                  site : null, 
                  about : null, 
                  size : null},
        jobDescription : { bold : [], italic : [], underline : [], text : null }, 
        posted: null,
        benefits : [],
        seniorityLevel : null,
        employmentType : null,
        industries : null,
        numAplicants : null,

    }
    */
    let data = {
        jobID: job_id,
        posted: null,
        jobTitle: null, 
        companyName: null,
        link: fullLink,
        jobLocation: [], //usualy remote oprion is second
        educationRequirenment: null, //seniorityvLevel
        jobType: [],
        //no visaSponsorship
        //salary: [], not provided by linkedin
        benefits: [],
        //requirements:[], part of job description
        jobDescription: null
    }

    const $ = cheerio.load(content.toString())

    //title
    let title = $(".jobs-unified-top-card__job-title")
    data.jobTitle = title.text().trim()


    //company name
    let company =$(".jobs-unified-top-card__company-name" )
    data.companyName = company.text().trim()

    //company website, not used
    //data.company.site ="https://www.linkedin.com/" + $('a',company).attr("href")

    //company location
    let companyLoc = $("span.jobs-unified-top-card__bullet",".jobs-unified-top-card__subtitle-primary-grouping")
    data.jobLocation.push(companyLoc.text().trim()) //the remote option is in parentasis, ex.: "Elizabeth, NJ (Remote)""


    


    //about company, not needed  
    //data.company.about = $(".jobs-company__box").html()


    //posted
    data.posted = $("span.jobs-unified-top-card__posted-date").text().trim()


    //job Description
    let descr =  $("#job-details")
    /* not used

    let bold1 = $('b',descr)
    bold1.each((_,element)=>{
        data.jobDescription.bold.push($(element).text())
    });
    let bold2 = $('strong',descr)
    bold2.each((_,element)=>{
        data.jobDescription.bold.push($(element).text())
    });

    let italic = $('i',descr)
    italic.each((_,element)=>{
        data.jobDescription.italic.push($(element).text())
    });

    let underline = $('u',descr)
    underline.each((_,element)=>{
        data.jobDescription.underline.push($(element).text())
    });
    */
    let descrText = descr.html();
    data.jobDescription= descrText;

    //benefits
    let benefits = $(".featured-benefits__benefit")
    benefits.each((index, benefit) => {  
        data.benefits.push($(benefit).text().trim())
    });



    //job criteria
    let criteria = $("li.jobs-unified-top-card__job-insight")
    criteria.each((index, detail) => {

        if(index === 0){
            let text1 = $("span", detail).text()
            let arr1 = text1.split("·")
            data.jobType = arr1[0].trim()
            if(arr1.length > 1)
                data.educationRequirenment = arr1[1].trim()
        }
        /* not used anymore
        else if(index === 1){
            let text2 = $("span", detail).text()
            let arr2 = text2.split("·")
            data.company.size = arr2[0].trim()
            if(arr2.length > 1)
                data.industries = arr2[1].trim()
        }
        */
    });

    //num of aplicants, not used 
    //data.numAplicants = $(".jobs-unified-top-card__applicant-count").text().trim()
    
    /*
    fs.writeFile('json\\linkedin_'+data.job_id+'.json', JSON.stringify(data), (err) => {
        if (err) throw err;
    });
    */
    
    //page.close()
    console.log(data)
}


export default scrape