"""Smoke checks against a running Vite app at http://localhost:5173."""
import os
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ.get("CHROMIUM_PATH"))
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    for width in [375, 768, 1024, 1440]:
        page.set_viewport_size({"width": width, "height": 1000})
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Overflow at {width}"
    assert page.locator(".neural-portrait").evaluate("e => e.complete && e.naturalWidth > 0")
    assert page.locator(".project-link").count() == 4
    page.wait_for_selector('.neural-scene[data-ready="true"]')
    page.evaluate("window.scrollTo(0, document.querySelector('.hero-scroll').offsetTop)")
    page.wait_for_timeout(100)
    before = page.locator("canvas").evaluate("e => e.toDataURL()")
    page.wait_for_timeout(200)
    assert before != page.locator("canvas").evaluate("e => e.toDataURL()"), "Missing particle motion"
    page.evaluate("window.scrollTo(0, document.querySelector('.hero-scroll').offsetTop + 850)")
    page.wait_for_timeout(150)
    assert float(page.locator('.hero').evaluate("e => getComputedStyle(e).getPropertyValue('--story-progress')")) > 0.4
    assert float(page.locator('.hero').evaluate("e => getComputedStyle(e).getPropertyValue('--chapter-opacity')")) > 0.5
    page.evaluate("window.scrollTo(0, document.querySelector('.hero-scroll').offsetTop + document.querySelector('.hero-scroll').offsetHeight - innerHeight)")
    page.wait_for_timeout(100)
    assert float(page.locator('.hero').evaluate("e => getComputedStyle(e).getPropertyValue('--chapter-opacity')")) == 1
    page.evaluate("window.scrollTo(0, document.querySelector('.hero-scroll').offsetTop)")
    page.wait_for_timeout(150)
    assert float(page.locator('.hero').evaluate("e => getComputedStyle(e).getPropertyValue('--story-progress')")) == 0
    page.get_by_role("link", name="Enter the work").click()
    assert page.evaluate("location.hash") == "#work"
    page.evaluate("window.scrollBy(0, 200)")
    page.wait_for_timeout(150)
    before = page.locator("canvas").evaluate("e => e.toDataURL()")
    page.wait_for_timeout(150)
    assert before == page.locator("canvas").evaluate("e => e.toDataURL()"), "Motion continues offscreen"
    page.evaluate("window.scrollTo(0, document.querySelector('.hero-scroll').offsetTop + 850)")
    page.wait_for_timeout(100)
    page.evaluate("document.querySelector('canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext()")
    page.wait_for_timeout(100)
    assert page.locator('.hero-scroll').get_attribute('data-visual') == 'static'
    assert page.locator('.neural-portrait').evaluate('e => getComputedStyle(e).opacity') == '1'
    assert page.locator('#hero-heading').evaluate('e => getComputedStyle(e).opacity') == '1'
    page.emulate_media(reduced_motion="reduce")
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    before = page.locator("canvas").evaluate("e => e.toDataURL()")
    page.wait_for_timeout(200)
    assert before == page.locator("canvas").evaluate("e => e.toDataURL()"), "Reduced motion is ignored"
    assert page.locator('.hero-scroll').evaluate('e => e.offsetHeight') <= 1000
    fallback = browser.new_page(viewport={"width": 1440, "height": 1000})
    fallback.on("pageerror", lambda error: errors.append(str(error)))
    fallback.add_init_script("""const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        return type === 'webgl' ? null : original.call(this, type, ...args);
      };""")
    fallback.goto("http://localhost:5173")
    fallback.wait_for_load_state("networkidle")
    assert fallback.locator('.hero-scroll').get_attribute('data-visual') == 'static'
    assert fallback.locator('.hero-scroll').evaluate('e => e.offsetHeight') <= 1000
    assert fallback.locator('.neural-portrait').evaluate('e => getComputedStyle(e).opacity') == '1'
    assert not errors, errors
    browser.close()
    print("PASS: responsive layout, portrait, projects, navigation, normal/offscreen/reduced motion.")
