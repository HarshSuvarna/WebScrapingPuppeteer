const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const convertJsonToExcel = require('./excelWrite')

async function start() {
    //creating browser instance and tab
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto("https://www.lacbffa.org/directory?current_page=1&sort_type=featured&search_for=company&asset_type=company_user&display_type=default")

    //array to store all scaraped data in object form
    let allProfile = []

    //loop along the pages
    for (let i=0; i<2; i++){
        console.log('in outerloop');
        //getting all the links in the page
        const hrefs = await page.evaluate(() => {
            let links = [];
            let elements2 = document.querySelectorAll('.btn-block');
            for (let element2 of elements2)
                if(element2){
                    links.push(element2.href);
                }
            return links;
            });
        //removing null values in listx
        allHrefs = [...new Set(hrefs)].filter(el=>el!==null);
        
        //loop on the cards in the page
        for (const link of allHrefs){
            
            //console.log(allHrefs);

            //go to this page
            await page.goto(link)

            //await page.waitForNavigation();
            await page.waitForSelector("#content > div.company-body > div > div > div.col-md-4 > div.subcontainer_style3.company-contact", {
                timeout:10000,
                visible: true,
            });
            //scraping contact info
            let info = await page.$eval("#content > div.company-body > div > div > div.col-md-4 > div.subcontainer_style3.company-contact > div > table > tbody", (el)=>el.innerText)
            let objs = {}
            infos = info.split("\n").map((x)=> {objs[x.split(":")[0]] = x.split(": ")[1]})
            allProfile.push(objs)
            
            await page.goBack();
            }
    //wait for the selector to show up in the newly nagivated page
    
    await page.waitForSelector("#main_content > div.pagination_app_div > div.row > div.col-sm-8 > div > div > div:nth-child(1) > div.btn-group.btn-group-sm.next-button > a", {
        timeout:10000,
        visible: true,
    });
    console.log(i)
    //click on next button to nagivate to next page
    if(i!==20){
    await page.click("#main_content > div.pagination_app_div > div.row > div.col-sm-8 > div > div > div:nth-child(1) > div.btn-group.btn-group-sm.next-button > a")
    }
    }
    console.log(allProfile);
    console.log("xxxxxxxEXECUTION ENDEDxxxxxxxxxxxx");

    //export xlsx
    convertJsonToExcel(allProfile)
    browser.close()
}
start()