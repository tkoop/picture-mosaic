console.log("Picture Mosaic.")

const fs = require('fs');
const yaml = require('js-yaml');

try {
    let fileContents = fs.readFileSync('./config.yaml', 'utf8');
    let data = yaml.safeLoad(fileContents);

    console.log("The config.yaml data is:")
    console.log(data);
} catch (e) {
    console.log("There was a problem reading config.yaml:")
    console.log(e);
}

