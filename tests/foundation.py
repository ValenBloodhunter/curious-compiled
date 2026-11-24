"""Check the foundation against Vite or a production preview."""
import os
from playwright.sync_api import expect, sync_playwright

base = os.environ.get("FOUNDATION_URL", "http://localhost:5173")
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=os.environ.get("CHROMIUM_PATH"),
        args=["--enable-unsafe-swiftshader"],
    )
    desktop = browser.new_page(
        viewport={"width": 480, "height": 400}, device_scale_factor=2, reduced_motion="reduce"
    )
    desktop.on("pageerror", lambda error: errors.append(str(error)))
    desktop.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    desktop.goto(base, wait_until="networkidle")
    canvas = desktop.locator("#webgl")
    expect(canvas).to_have_attribute("width", "960")
    expect(canvas).to_have_attribute("height", "800")
    assert canvas.evaluate("el => el.getContext('webgl2').getError()") == 0
    shadow, ring, lower_disk = canvas.evaluate("""canvas => new Promise(resolve => {
        requestAnimationFrame(() => {
            const gl = canvas.getContext('webgl2')
            const { width, height } = canvas
            const strip = new Uint8Array(height * 4)
            gl.readPixels(width >> 1, 0, 1, height, gl.RGBA, gl.UNSIGNED_BYTE, strip)
            const red = y => strip[Math.floor(height * y) * 4]
            const peak = (from, to) => {
                let value = 0
                for (let y = from; y < to; y += 1 / height) value = Math.max(value, red(y))
                return value
            }
            resolve([red(0.56), peak(0.64, 0.70), peak(0.20, 0.28)])
        })
    })""")
    assert shadow < 70 and ring > 170 and lower_disk > shadow + 10, (shadow, ring, lower_disk)
    expect(desktop.get_by_role("heading", name="Event Horizon")).to_have_count(1)

    tracks = desktop.locator("#scroll-container > section")
    expect(tracks).to_have_count(5)
    assert tracks.first.inner_html() == tracks.last.inner_html()
    seam = tracks.last.evaluate("el => el.offsetTop")
    assert seam == desktop.evaluate("document.documentElement.scrollHeight - innerHeight")
    desktop.evaluate("document.fonts.ready")
    top = desktop.screenshot(scale="css")
    desktop.evaluate("scrollTo(0, document.documentElement.scrollHeight)")
    desktop.wait_for_function("seam => scrollY === seam", arg=seam)
    assert desktop.screenshot(scale="css") == top
    desktop.evaluate("scrollTo(0, 0)")
    desktop.wait_for_function("scrollY === 0")

    desktop.mouse.move(200, 200)
    desktop.mouse.wheel(0, -120)
    desktop.wait_for_function("seam => scrollY > seam - 140 && scrollY < seam - 50", arg=seam)
    expect(desktop.locator("html.lenis-scrolling")).to_have_count(0)
    desktop.mouse.wheel(0, 240)
    desktop.wait_for_function("scrollY > 50 && scrollY < 140")

    desktop.set_viewport_size({"width": 400, "height": 360})
    expect(canvas).to_have_attribute("width", "800")
    assert tracks.last.evaluate(
        "el => el.offsetTop === document.documentElement.scrollHeight - innerHeight"
    )
    desktop.close()

    mobile = browser.new_page(viewport={"width": 390, "height": 660}, has_touch=True, is_mobile=True)
    mobile.on("pageerror", lambda error: errors.append(str(error)))
    mobile.goto(base, wait_until="networkidle")
    mobile_seam = mobile.locator("#scroll-container > section").last.evaluate("el => el.offsetTop")
    assert mobile_seam == mobile.evaluate("document.documentElement.scrollHeight - innerHeight")
    device = mobile.context.new_cdp_session(mobile)

    def swipe(start, end):
        device.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": 180, "y": start}]})
        for y in range(start, end, 20 if end > start else -20):
            device.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": 180, "y": y}]})

    swipe(300, 460)
    mobile.wait_for_function("seam => scrollY > seam - 180", arg=mobile_seam)
    device.send("Input.dispatchTouchEvent", {"type": "touchCancel", "touchPoints": []})
    mobile.evaluate("scrollTo(0, document.documentElement.scrollHeight - innerHeight - 70)")
    mobile.wait_for_function("seam => scrollY === seam - 70", arg=mobile_seam)
    swipe(460, 300)
    mobile.wait_for_function("scrollY > 0 && scrollY < 120")
    device.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    assert not errors, errors
    browser.close()
    print("Passed WebGL, pixel ratio, resize, hero seam, and bidirectional wheel and touch checks.")
