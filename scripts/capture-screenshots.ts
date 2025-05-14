import puppeteer from 'puppeteer';
import { mockTools } from '../lib/data';
import path from 'path';
import fs from 'fs';

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const screenshotDir = path.join(process.cwd(), 'public', 'tool-screenshots');
  
  // Ensure the directory exists
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  for (const tool of mockTools) {
    try {
      console.log(`Capturing screenshot for ${tool.name}...`);
      
      const page = await browser.newPage();
      
      // Set viewport to a reasonable size
      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      // Navigate to the URL
      await page.goto(tool.url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Extract the filename from the tool's image path
      const filename = path.basename(tool.image);
      const screenshotPath = path.join(screenshotDir, filename);

      // Take the screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`✓ Screenshot saved for ${tool.name}`);
      
      await page.close();
    } catch (error) {
      console.error(`Error capturing screenshot for ${tool.name}:`, error);
    }
  }

  await browser.close();
  console.log('Screenshot capture completed!');
}

captureScreenshots().catch(console.error); 