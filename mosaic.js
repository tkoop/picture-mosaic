console.log("Picture Mosaic.")

const fs = require('fs');
const yaml = require('js-yaml');
const mysql = require('mysql');

var db = null

main()


function main() {
    var config

    try {
        let fileContents = fs.readFileSync('./config.yaml', 'utf8')
        config = yaml.safeLoad(fileContents)

        console.log("The config.yaml data is:")
        console.log(config)
    } catch (e) {
        console.log("There was a problem reading config.yaml:")
        console.log(e)
        process.exit()
    }


    db = mysql.createConnection({
        host: config.database.host,
        user: config.database.username,
        password: config.database.password,
        database: config.database.database
    });


    db.connect(async function(err) {
        console.log("Back from connecting. ", err)

        if (err) throw err;
        console.log("Connected!")

        if (config.action == "init") {
            await initDB()
        }

        if (config.action == "processImages") {
            await processImages(config.imagePath)
        }

        db.end()

    })

}

async function processImages(path) {
    
}

async function initDB() {
    try {
        await runSQL("drop table if exists image")
        await runSQL("drop table if exists file")

        await runSQL(`CREATE TABLE file (
            file_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name varchar(1024) NOT NULL,
            last_mod_time timestamp NOT NULL,
            done_all tinyint NOT NULL DEFAULT '0'
        ) ENGINE='InnoDB' COLLATE 'utf8mb4_general_ci';`)


        await runSQL(`CREATE TABLE image (
        image_id int(11) NOT NULL AUTO_INCREMENT,
        file_id int(11) NOT NULL,
        rotation float NOT NULL,
        x int(11) NOT NULL,
        y int(11) NOT NULL,
        width int(11) NOT NULL,
        height int(11) NOT NULL,
        value_0_0_red smallint(6) NOT NULL,
        PRIMARY KEY (image_id),
        KEY file_id (file_id),
        CONSTRAINT image_ibfk_1 FOREIGN KEY (file_id) REFERENCES file (file_id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`)

    } catch(error) {
        console.log("Caught error: ", error)
    }

    console.log("Database has been initiaited.")
}


async function runSQL(sql) {
    return new Promise(function(resolve, reject) {
        db.query(sql, function (error, result) {
            if (error) {
                console.log("Error running sql ", sql)
                reject(error)
            }
            console.log("Result: " + result)
            resolve(result)
        });
    })
}