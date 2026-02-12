const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function packageApp() {
    console.log('--- PACKAGING KHATAPLUS ADMIN PANEL ---');

    try {
        // 1. Build the app
        console.log('Building standalone application (this may take a minute)...');
        execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

        const standaloneDir = path.join(__dirname, '../.next/standalone');
        const outputDir = path.join(__dirname, '../dist-package');

        // 2. Prepare output directory
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
        fs.mkdirSync(outputDir);

        // 3. Copy standalone files
        console.log('Organizing package files...');
        fs.cpSync(standaloneDir, outputDir, { recursive: true });

        // 4. Copy static assets (required by Next.js standalone)
        const staticSrc = path.join(__dirname, '../.next/static');
        const staticDest = path.join(outputDir, '.next/static');
        fs.mkdirSync(staticDest, { recursive: true });
        fs.cpSync(staticSrc, staticDest, { recursive: true });

        // 5. Copy public folder
        const publicSrc = path.join(__dirname, '../public');
        const publicDest = path.join(outputDir, 'public');
        fs.cpSync(publicSrc, publicDest, { recursive: true });

        // 6. Copy .env.local for credentials
        const envSrc = path.join(__dirname, '../.env.local');
        const envDest = path.join(outputDir, '.env.local');
        if (fs.existsSync(envSrc)) {
            fs.copyFileSync(envSrc, envDest);
        }

        // 7. Create Start Script
        const startScript = `@echo off
echo Starting KhataPlus Admin Panel...
set PORT=3000
start "" "http://localhost:3000"
node server.js
pause
`;
        fs.writeFileSync(path.join(outputDir, 'start-admin.bat'), startScript);

        console.log('\n--- PACKAGE READY ---');
        console.log(`Location: ${outputDir}`);
        console.log('How to run on the other PC:');
        console.log('1. Copy the "dist-package" folder to the other Windows 11 PC.');
        console.log('2. Ensure Node.js is installed on that PC.');
        console.log('3. Double-click "start-admin.bat".');

    } catch (error) {
        console.error('Packaging failed:', error);
    }
}

packageApp();
