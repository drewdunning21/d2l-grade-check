import playwright
from playwright import sync_playwright
from time import sleep

with sync_playwright() as p:
    for browser_type in [p.chromium]:
        browser = browser_type.launch(headless=False)
        page = browser.newPage()
        page.goto('http://footlocker.com')
        page.screenshot(path=f'example-{browser_type.name}.png')
        browser.close()

# def test_playwright_is_visible_on_google(page):
#     page.goto("https://www.google.com")
#     page.type("input[name=q]", "Playwright GitHub")
#     page.click("input[type=submit]")
#     page.waitForSelector("text=microsoft/Playwright")
