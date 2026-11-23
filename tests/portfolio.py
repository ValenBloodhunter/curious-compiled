"""Smoke checks against the Vite site running on http://localhost:5173."""
import os
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH"))
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    stage = page.locator(".stage")
    artifact = page.get_by_role("button", name="Explore Black Sun")
    expect(artifact).to_be_visible()
    artifact.hover()
    page.mouse.down()
    expect(stage).to_have_attribute("data-open", "true")
    page.mouse.up()
    expect(stage).to_have_attribute("data-open", "false")
    artifact.focus()
    page.keyboard.press("Enter")
    expect(stage).to_have_attribute("data-open", "true")
    page.keyboard.press("Escape")
    expect(stage).to_have_attribute("data-open", "false")
    page.get_by_role("button", name="Next scene").click()
    expect(page.get_by_role("button", name="Explore Neural Ronin")).to_be_visible()
    page.get_by_role("button", name="Index").click()
    page.get_by_role("dialog").get_by_role("link", name="Selected work").click()
    expect(page).to_have_url("http://localhost:5173/#work")
    expect(page.locator(".project-link")).to_have_count(4)
    for width in (320, 375, 768, 1440):
        page.set_viewport_size({"width": width, "height": 800})
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    mobile = browser.new_page(viewport={"width": 375, "height": 740}, has_touch=True, reduced_motion="reduce")
    mobile.goto("http://localhost:5173")
    mobile.wait_for_load_state("networkidle")
    pixels = mobile.locator(".prism").evaluate("c => c.toDataURL()")
    mobile.wait_for_timeout(150)
    assert pixels == mobile.locator(".prism").evaluate("c => c.toDataURL()")
    mobile.get_by_role("button", name="Explore Black Sun").tap()
    expect(mobile.locator(".stage")).to_have_attribute("data-open", "true")
    assert not errors, errors
    browser.close()
    print("Passed desktop hold/release, keyboard toggle, scene selection, index, responsive layout and reduced-motion touch interaction.")
