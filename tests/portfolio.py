"""Smoke checks for the portfolio. Run against Vite or a production preview."""
import os
from playwright.sync_api import expect, sync_playwright

base = os.environ.get("PORTFOLIO_URL", "http://localhost:5173").rstrip("/")
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=os.environ.get("CHROMIUM_PATH"),
        args=["--enable-unsafe-swiftshader"],
    )
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base)
    scene = page.locator(".scene canvas")
    expect(scene).to_have_attribute("data-ready", "true")
    thermal = page.get_by_role("button", name="Thermal")
    thermal.focus()
    page.keyboard.press("Enter")
    expect(thermal).to_have_attribute("aria-pressed", "true")
    page.get_by_role("button", name="Optical").click()
    expect(thermal).to_have_attribute("aria-pressed", "false")
    page.get_by_role("link", name="Explore my work").click()
    expect(page).to_have_url(f"{base}/#work")
    projects = page.locator(".project-row")
    expect(projects).to_have_count(4)
    for project in projects.all():
        if not project.evaluate("el => el.open"):
            project.locator("summary").focus()
            page.keyboard.press("Enter")
        expect(project.get_by_role("link")).to_be_visible()
        expect(page.locator(".project-row[open]")).to_have_count(1)
    for width in (320, 375, 640, 768, 1024, 1440):
        page.set_viewport_size({"width": width, "height": 800})
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.emulate_media(reduced_motion="reduce")
    expect(scene).to_be_hidden()
    expect(scene).not_to_have_attribute("data-ready", "true")
    page.emulate_media(reduced_motion="no-preference")
    page.locator("#top").evaluate("el => el.scrollIntoView({behavior: 'instant'})")
    expect(scene).to_have_attribute("data-ready", "true")

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, has_touch=True, reduced_motion="reduce")
    mobile.on("pageerror", lambda error: errors.append(str(error)))
    mobile.goto(base)
    mobile.get_by_role("button", name="Thermal").tap()
    expect(mobile.locator(".scene canvas")).to_be_hidden()
    expect(mobile.locator(".scene-poster")).to_have_css("filter", 'url("#thermal-map")')
    menu = mobile.get_by_role("button", name="Menu")
    menu.tap()
    dialog = mobile.get_by_role("dialog")
    expect(dialog).to_be_visible()
    mobile.keyboard.press("Escape")
    expect(dialog).not_to_be_visible()
    menu.tap()
    dialog.get_by_role("link", name="About").tap()
    expect(mobile).to_have_url(f"{base}/#about")
    expect(dialog).not_to_be_visible()
    mobile.locator(".valley img").evaluate("img => img.decode()")
    assert mobile.locator(".valley img").evaluate("img => img.naturalWidth > 0")

    fallback = browser.new_page()
    fallback.add_init_script("""
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args) {
            return type === 'webgl2' ? null : original.call(this, type, ...args);
        };
    """)
    fallback.goto(base)
    fallback.get_by_role("button", name="Thermal").click()
    expect(fallback.locator(".scene-poster")).to_be_visible()
    expect(fallback.locator(".scene-poster")).to_have_css("filter", 'url("#thermal-map")')
    expect(fallback.locator(".scene canvas")).not_to_have_attribute("data-ready", "true")
    expect(fallback.get_by_role("link", name="Explore my work")).to_be_visible()
    assert not errors, errors
    browser.close()
    print("Passed scene, lenses, project links, keyboard, touch, responsive, reduced-motion and WebGL fallback checks.")
