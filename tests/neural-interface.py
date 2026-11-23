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
    before = page.locator("canvas").evaluate("e => e.toDataURL()")
    page.wait_for_timeout(200)
    assert before != page.locator("canvas").evaluate("e => e.toDataURL()"), "Missing particle motion"
    page.get_by_role("link", name="Enter the work").click()
    assert page.evaluate("location.hash") == "#work"
    page.evaluate("window.scrollBy(0, 200)")
    page.wait_for_timeout(150)
    before = page.locator("canvas").evaluate("e => e.toDataURL()")
    page.wait_for_timeout(150)
    assert before == page.locator("canvas").evaluate("e => e.toDataURL()"), "Motion continues offscreen"
    page.emulate_media(reduced_motion="reduce")
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    before = page.locator("canvas").evaluate("e => e.toDataURL()")
    page.wait_for_timeout(200)
    assert before == page.locator("canvas").evaluate("e => e.toDataURL()"), "Reduced motion is ignored"
    assert not errors, errors
    browser.close()
    print("PASS: responsive layout, portrait, projects, navigation, normal/offscreen/reduced motion.")
