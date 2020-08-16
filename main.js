const playwright = require('playwright')
const play = require('./playFunctions.js')
const fs = require('fs')

async function main(user, pw) {
    let { browser, context, page } = await login(user, pw)
    await loadCookies(context)
    let links = await getClassLinks(page)
    console.log(links)
    await checkClasses(page, links)
    await sleep(100)
    await browser.close()
}

async function checkClasses(page, links) {
    console.log('Checking grades')
    for (let i = 0; i < links.length; i++) {
        // await page.goto('https://d2l.arizona.edu/d2l/home/' + links[i])
        // await checkGrades(page)
        await checkGrades(page, links[i])
    }
    console.log('Done checking grades')
}

async function checkGrades(page, link) {
    const url = 'https://d2l.arizona.edu/d2l/lms/grades/my_grades/main.d2l?ou=' + link
    await page.goto(url)
    await page.waitForSelector(path, { timeout: timeout })
    const handles = await page.$$('xpath=' + path)
    // page.goto(url)
    // const resp = await page.waitForResponse(url)
    // const buf = (await resp.body())
    // console.log(buf.toString())

    // await play.xpathClick(page,'//a[text()="Grades"]')
    // const html = await page.innterHTML('body')
    // fs.writeFileSync('htmltest.html',html)
}

async function getClassLinks(page) {
    let classes = []
    page.on('request', async request => {
        let url = request.url()
        if (url.indexOf('4074172c-') > 0 && url.split('/').length == 4) {
            const finalResponse = await page.waitForResponse(url)
            const resp = await finalResponse.json()
            try {
                if (resp.properties.endDate.indexOf('08-27') > 0) {
                    console.log(resp.properties.name)
                    classes.push(url.split('/')[3])
                }
            } catch {}
        }
    })
    await sleep(2)
    return classes
}

async function isClass(page) {
    for (let i = 0; i < 5; i++) {
        const html = await page.innerHTML('body')
        if (html.indexOf('Course Home') > 0) return true
        await sleep(1)
    }
    return false
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
    // if not, it opens a headful browser and logs in
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
