const playwright = require('playwright')

async function getBrowser(headless) {
    let browser = await playwright['chromium'].launch({ headless: headless })
    let context = await browser.newContext()
    let page = await context.newPage()

    return { browser: browser, context: context, page: page }
}
exports.getBrowser = getBrowser

async function xpathClick(page, path, index = 0, timeout = 10000) {
    await page.waitForSelector(path, { timeout: timeout })
    const handles = await page.$$('xpath=' + path)
    await handles[index].click()
}
exports.xpathClick = xpathClick

async function xpathType(page,path,text,timeout=100000){
    await page.waitForSelector(path, { timeout: 100000 })
    await page.type(path,text)
    // const handles = await page.$$('xpath=' + path)
}
exports.xpathType = xpathType

async function boxType(page,text){
    for (let i = 0; i < text.length; i ++) {
        await page.keyboard.press(text.charAt(i))
    }
}
exports.boxType = boxType

const sleep = seconds => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function tab(page,amnt){
    for (let i = 0; i < amnt; i ++){
        await page.keyboard.press('Tab')
    }
}
