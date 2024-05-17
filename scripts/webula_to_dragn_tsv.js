const fs = require('fs');
const path = require('path');

if (process.argv.length !== 3) {
    console.error('Usage: node process_tsv.js <filename>');
    process.exit(1);
}

const filename = process.argv[2];

fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
    }

    const lines = data.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        console.error('The file is empty.');
        process.exit(1);
    }

    const headers = lines[0].split('\t');
    const imageFileIndex = headers.indexOf('ImageFile');
    const nameIndex = headers.indexOf('Name');
    const typeIndex = headers.indexOf('Type');

    if (imageFileIndex === -1 || nameIndex === -1 || typeIndex === -1) {
        console.error('Missing required columns in the TSV file.');
        process.exit(1);
    }

    const outputLines = [
        'databaseId\tname\timageUrl\tcardBack\ttype\t' + lines[0]
    ];

    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split('\t');
        const databaseId = columns[imageFileIndex].replace(/"/g, '');
        const name = columns[nameIndex];
        const imageUrl = `https://www.trekcc.org/2e/cardimages/${databaseId}.jpg`;
        const quoteLessImageUrl = imageUrl.replace(/"/g, '');
        const cardBack = 'red_card_back';
        const type = columns[typeIndex].replace(/"/g, '');

        const newLine = `${databaseId}\t${name}\t${quoteLessImageUrl}\t${cardBack}\t${type}\t${lines[i]}`;
        outputLines.push(newLine);
    }

    const outputFilename = path.basename(filename, path.extname(filename)) + '_dragn.tsv';
    fs.writeFile(outputFilename, outputLines.join('\n'), 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file: ${err.message}`);
            process.exit(1);
        }

        console.log(`File processed successfully. Output written to ${outputFilename}`);
    });
});
