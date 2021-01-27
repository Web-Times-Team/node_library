/**
 * database creation
 */
const bash = require('child_process');
const mysql = require('mysql');
bash.exec('chmod u+x ./db/creMySQLdb');

const creMySQLdb = bash.exec('./db/creMySQLdb');
module.exports = (dbConfig) => {

    creMySQLdb.stdout.on('data', (data) => {
        console.log(data);
    });

    creMySQLdb.stderr.on('data', (data) => {
        console.log(data);
    });

    const connection = mysql.createConnection({
        host: dbConfig.config.mysql.host,
        user: dbConfig.config.mysql.user,
        password: dbConfig.config.mysql.password,
        database: dbConfig.config.mysql.database
    });

    const createTables = () => {
        // create tables
        // it has enougth restrictions on table transaction, actually, one transaction can't have studentID, sponsorsID, donorID
        dbConfig.dbTables.forEach((table) => {
            let describe = "";
            table.describe.forEach((val, index) => {
                describe = `${describe} ${val.field} ${val.type} ${val.null}${val.extra}${index===(table.describe.length-1)?"":","}`
            });
            connection.query(`create table if not exists ${table.name}(
                    ${describe}
            )`, (err, result) => {
                if (err) throw err;
                console.log(`${table.name} table is created`);
            });
        });

    }

    const dropTables = async() => {

            dbConfig.dbTables.reverse();
            for (const table of dbConfig.dbTables) {
                const result = await new Promise((resolve, reject) => {
                    connection.query(`drop table ${table.name}`, (err, result) => {
                        if (err) {
                            if (err.code === 'ER_BAD_TABLE_ERROR') {
                                resolve(err.code)
                            } else {
                                reject(err)
                            }

                        } else {
                            resolve('is dropped');
                        }
                    });
                });
                console.log(result);
            }
            dbConfig.dbTables.reverse();
        } // use only for developpement mode 

    settingUp = async() => {
        await dropTables();
        createTables();
    }

    connection.connect((err) => {
        if (err) throw err;
        console.log("Connected! to sql");
        settingUp();
    })
    return connection;
}