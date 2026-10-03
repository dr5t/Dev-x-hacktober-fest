import os
import time
import glob
from playwright.sync_api import sync_playwright
import imageio_ffmpeg

output_dir = "video_temp"
if os.path.exists(output_dir):
    for f in glob.glob(os.path.join(output_dir, "*")):
        try:
            os.remove(f)
        except Exception:
            pass
os.makedirs(output_dir, exist_ok=True)

final_mp4_path = os.path.abspath("StudyBuddy_Local_Demo.mp4")
if os.path.exists(final_mp4_path):
    try:
        os.remove(final_mp4_path)
    except Exception:
        pass

chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

print("Starting visible Google Chrome browser demo recording...")
with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path,
        headless=False,
        args=["--window-size=1920,1080", "--start-maximized"]
    )
    
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=output_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    
    page = context.new_page()
    
    # SCENE 1 & 2: Intro & Local AI Status (6s)
    print("[1/9] SCENE 1 & 2: Opening StudyBuddy Local at http://localhost:3000...")
    page.goto("http://localhost:3000")
    page.wait_for_selector("h1", timeout=15000)
    time.sleep(5)
    
    # SCENE 3: Paste Study Material (6s)
    print("[2/9] SCENE 3: Inputting sample study material...")
    sample_text = (
        "Photosynthesis is a biological process used by plants, algae, and certain bacteria to convert light energy into chemical energy.\n"
        "The process occurs in two main stages:\n"
        "1. Light-Dependent Reactions: Take place in the thylakoid membranes of chloroplasts. Chlorophyll absorbs solar energy and splits water molecules into oxygen, protons, and electrons.\n"
        "2. Light-Independent Reactions (Calvin Cycle): Take place in the stroma of chloroplasts. ATP and NADPH produced in the light stage are used to fix carbon dioxide into glucose (C6H12O6).\n\n"
        "Key Equation:\n"
        "6 CO2 + 6 H2O + Light Energy -> C6H12O6 + 6 O2"
    )
    page.fill("textarea", sample_text)
    time.sleep(4)
    
    # SCENE 4: Summarize
    print("[3/9] SCENE 4: Generating Summary...")
    page.wait_for_selector("button:has-text('Summarize'):not([disabled])", timeout=60000)
    page.click("button:has-text('Summarize')")
    time.sleep(12)
    
    # SCENE 5: Explain Concept
    print("[4/9] SCENE 5: Explaining Concept...")
    page.wait_for_selector("button:has-text('Explain'):not([disabled])", timeout=60000)
    page.click("button:has-text('Explain')")
    time.sleep(2)
    page.wait_for_selector("input[placeholder*='Photosynthesis']", timeout=10000)
    page.fill("input[placeholder*='Photosynthesis']", "Explain the Calvin Cycle in simple terms")
    time.sleep(2)
    page.click("form button[type='submit']")
    time.sleep(12)
    
    # SCENE 6: Make Revision Notes
    print("[5/9] SCENE 6: Generating Revision Notes...")
    page.wait_for_selector("button:has-text('Make Revision Notes'):not([disabled])", timeout=60000)
    page.click("button:has-text('Make Revision Notes')")
    time.sleep(12)
    
    # SCENE 7: Generate Quiz & Practice
    print("[6/9] SCENE 7: Generating Quiz & Practice...")
    page.wait_for_selector("button:has-text('Generate Quiz'):not([disabled])", timeout=60000)
    page.click("button:has-text('Generate Quiz')")
    time.sleep(10)
    
    options = page.query_selector_all("button:has-text('A.')")
    for opt in options:
        try:
            opt.click()
            time.sleep(1)
        except Exception:
            pass
            
    submit_btn = page.query_selector("button:has-text('Submit Answers')")
    if submit_btn:
        submit_btn.click()
        time.sleep(5)
        
    # SCENE 8: Ask Material Q&A
    print("[7/9] SCENE 8: Grounded Q&A...")
    page.click("button:has-text('Ask Material Q&A')")
    time.sleep(2)
    ask_input = page.query_selector("input[placeholder*='question']")
    if ask_input:
        ask_input.fill("What are the main points I should remember for the exam?")
        time.sleep(2)
        page.click("button:has-text('Ask')")
        time.sleep(10)
        
    # SCENE 9: Diagnostics View
    print("[8/9] SCENE 9: Checking Local AI Diagnostics...")
    page.click("button:has-text('Local AI Setup & Diagnostics')")
    time.sleep(5)
    
    # SCENE 10: Final Frame
    print("[9/9] SCENE 10: Returning to main workspace for final frame...")
    page.click("button:has-text('Study Material & Actions')")
    time.sleep(5)
    
    video_path = page.video.path()
    context.close()
    browser.close()
    
print("Playwright recording completed! Raw video file:", video_path)

# Convert recorded webm video to H.264 MP4 using imageio_ffmpeg
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

print("Converting recording to H.264 MP4 at:", final_mp4_path)
cmd = f'"{ffmpeg_exe}" -y -i "{video_path}" -c:v libx264 -pix_fmt yuv420p "{final_mp4_path}"'
os.system(cmd)

if os.path.exists(final_mp4_path):
    size_mb = os.path.getsize(final_mp4_path) / (1024 * 1024)
    print(f"SUCCESS: Created final demo video at {final_mp4_path} ({size_mb:.2f} MB)")
else:
    print("ERROR: Failed to convert video to MP4")
