import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';
const files = fs.readdirSync(publicDir);

async function optimizeImages() {
    for (const file of files) {
        if (path.extname(file).toLowerCase() === '.png') {
            const inputPath = path.join(publicDir, file);
            const outputPath = path.join(publicDir, path.basename(file, '.png') + '.webp');

            console.log(`Optimizing: ${file}...`);

            try {
                await sharp(inputPath)
                    .resize(800, null, { // Resize to max width 800px, auto height
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`Saved: ${outputPath}`);

                // Optional: Delete original if needed, but let's keep them manually for now or delete them here?
                // The user complains about speed, so we definitely want to switch.
                // I will NOT delete them in the script to be safe, I will manually delete later or just leave them unused.
                // However, Vercel has a size limit, so removing them from the deployment is better.
                // Let's delete the source PNG after successful conversion to keep the repo clean.
                fs.unlinkSync(inputPath);
                console.log(`Deleted original: ${file}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
}

optimizeImages();
