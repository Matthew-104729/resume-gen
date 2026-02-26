import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Fix the built HTML to work with file:// protocol
const distPath = join(process.cwd(), 'dist')
const htmlPath = join(distPath, 'index.html')

try {
  let html = readFileSync(htmlPath, 'utf-8')
  
  // Find the actual JS and CSS files
  const assetsDir = join(distPath, 'assets')
  const files = readdirSync(assetsDir)
  const jsFile = files.find(f => f.endsWith('.js'))
  const cssFile = files.find(f => f.endsWith('.css'))
  
  if (!jsFile) {
    throw new Error('No JS file found in assets directory')
  }
  
  // Replace the script tag - remove type="module" and use relative path
  // For IIFE format, we don't need type="module" and should load at end of body
  html = html.replace(
    /<script[^>]*src="[^"]*"[^>]*><\/script>/,
    ''
  )
  
  // Ensure no module type is present anywhere
  html = html.replace(/type=["']module["']/gi, '')
  
  // Add script at the end of body (before closing body tag) for IIFE
  html = html.replace(
    /<\/body>/,
    `    <script src="./assets/${jsFile}"></script>\n  </body>`
  )
  
  // Replace the CSS link - use relative path
  if (cssFile) {
    html = html.replace(
      /<link[^>]*rel="stylesheet"[^>]*>/,
      `<link rel="stylesheet" href="./assets/${cssFile}">`
    )
  }
  
  // Remove any remaining module/crossorigin attributes
  html = html.replace(/type="module"/g, '')
  html = html.replace(/crossorigin="[^"]*"/g, '')
  html = html.replace(/crossorigin/g, '')
  
  // Fix any remaining absolute paths
  html = html.replace(/src="\/assets\//g, 'src="./assets/')
  html = html.replace(/href="\/assets\//g, 'href="./assets/')
  html = html.replace(/href="\/vite\.svg/g, 'href="./vite.svg')
  
  // Write the fixed HTML
  writeFileSync(htmlPath, html, 'utf-8')
  console.log('✅ Fixed index.html for file:// protocol')
  console.log(`   - JS: ./assets/${jsFile}`)
  if (cssFile) console.log(`   - CSS: ./assets/${cssFile}`)
} catch (error) {
  console.error('❌ Error fixing HTML:', error.message)
  console.error('   Make sure you run "npm run build" first')
  process.exit(1)
}

