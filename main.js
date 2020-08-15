const playwright = require('playwright')
const play = require('./playFunctions.js')
const fs = require('fs')

async function main(user, pw) {
    let { browser, context, page } = await login(user, pw)
    await loadCookies(context)
    await console.log(page.innterHTML('body'))
    // const classes = await getClasses(page)
    await sleep(100)
    await browser.close()
}

async function getClasses(page) {
    // 2202 - Summer 2020
    // await play.xpathClick(page,'//div[text()="2202 - Summer 2020"]')
    let count = 0
    while (true) {
        if (page.url().indexOf('home') < 0) await clickHome(page)
        await page.waitForSelector('.homepage-col-8 #d2l_1_6_542')
        await page.click('.homepage-col-8 #d2l_1_6_542')
        await play.tab(2 + count * 2)
        await page.keyboard.press('Enter')
        if (await isClass(page))
    }

    // await sleep(5)
    // const frames = await page.frames()
    // console.log(frames.length)
    // // d2l-card-container d2l-visible-on-ancestor-target d2l-card-footer-hidden
    // let bin = await page.$$('xpath=//div[@class="homepage-col-8"]')
    // console.log(bin)
    // const classes = bin[0].$$('//a[@class="d2l-focusable"]')
    // console.log(classes.length)
    // for (let i = 0; i < classes.length; i++) {
    //     console.log(classes[i].getAttribute('href'))
    // }
}

async function isClass(page){
}

async function clickHome(page) {
    await page.waitForSelector('d2l-navigation-main-header > .d2l-navigation-header-left > .d2l-navigation-s-header-logo-area > .d2l-navigation-s-button-highlight > d2l-icon')
    await page.click('d2l-navigation-main-header > .d2l-navigation-header-left > .d2l-navigation-s-header-logo-area > .d2l-navigation-s-button-highlight > d2l-icon')
}

async function login(user, pw) {
    console.log('Logging in')
    // makes the headless browser
    let { browser, context, page } = await play.getBrowser(false) // should be true
    // loads the cookies in
    await loadCookies(context)
    // if logged in to d2l, then it returns browser info
    if (await checkLogin(page)) return { browser: browser, context: context, page: page }
    // if not, it opens a headfule browser and logs in
    await browser.close()
    await headfulLogin(user, pw)
    // returns headless browser
    console.log('Logged in')
    return play.getBrowser(false) // should be true
}

async function headfulLogin(user, pw) {
    // headful login
    console.log('Headful login')
    let { browser, context, page } = await play.getBrowser(false)
    await page.goto('https://d2l.arizona.edu')
    await play.xpathClick(page, '//a[@id="ualoginbutton"]')
    await page.type('#username', user)
    await page.type('#password', pw)
    await page.keyboard.press('Enter')
    while (page.url().indexOf('home') < 0) await sleep(1)
    await saveCookies(context)
    await browser.close()
}

async function checkLogin(page) {
    await page.goto('https://d2l.arizona.edu')
    const url = page.url()
    if (url.indexOf('login') > 0) return false
    console.log('Already logged in')
    return true
}

async function saveCookies(context) {
    await sleep(5)
    const cookies = await context.cookies()
    console.log(cookies)
    fs.writeFileSync('cookies.json', JSON.stringify(cookies))
}

async function loadCookies(context) {
    if (fs.existsSync('cookies.json')) {
        const cookies = fs.readFileSync('cookies.json', 'utf-8')
        await context.addCookies(JSON.parse(cookies))
    }
}

const sleep = seconds => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

;(async () => {
    await main('amd10', 'ButterflyEffece')
})()
