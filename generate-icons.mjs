import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const publicDir = './public'

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
}

// Generate PNG from SVG for 192x192
console.log('Generating pwa-192x192.png...')
sharp('public/pwa-icon-192.svg')
    .png()
    .resize(192, 192)
    .toFile('public/pwa-192x192.png')
    .then(() => console.log('✓ pwa-192x192.png created'))
    .catch(err => console.error('Error creating pwa-192x192.png:', err))

// Generate PNG from SVG for 512x512
console.log('Generating pwa-512x512.png...')
sharp('public/pwa-icon-512.svg')
    .png()
    .resize(512, 512)
    .toFile('public/pwa-512x512.png')
    .then(() => console.log('✓ pwa-512x512.png created'))
    .catch(err => console.error('Error creating pwa-512x512.png:', err))

console.log('PWA icons generated successfully!')
