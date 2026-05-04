const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const filesToObfuscate = [
    { src: 'public/main.js', dest: 'public/main.min.js' },
    { src: 'public/form.js', dest: 'public/form.min.js' },
    { src: 'public/remove.js', dest: 'public/remove.min.js' }
];

console.log('Starting obfuscation process...');

filesToObfuscate.forEach(file => {
    const srcPath = path.join(__dirname, file.src);
    const destPath = path.join(__dirname, file.dest);
    
    if (fs.existsSync(srcPath)) {
        const sourceCode = fs.readFileSync(srcPath, 'utf8');
        
        const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayCallsTransformThreshold: 0.5,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: 'variable',
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
        });
        
        fs.writeFileSync(destPath, obfuscationResult.getObfuscatedCode());
        console.log(`Successfully obfuscated ${file.src} -> ${file.dest}`);
    } else {
        console.error(`Source file not found: ${srcPath}`);
    }
});

console.log('Build completed!');
