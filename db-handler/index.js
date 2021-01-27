/**
 * Database handler api module
 */

/**
 * database type
 */
const TypeOfDb = Object.freeze({
    mysql: 0,
    mongodb: 1
})

let connection;
let dbType;
exports.TypeOfDb = TypeOfDb;

/**
 * db creation
 * @param {*} dbType 
 */
exports.dbCreation = (dbTypeValue, dbConfig) => {
    dbType = dbTypeValue;
    if (!dbTypeValue) {
        connection = require('./db-mysql-creation')(dbConfig);
    } else {
        connection = require('./db-mongo-creation');
    }
    return { connection, dbType }
}

/**
 * DbInstanciator class
 * @param {*} dbType 
 * @param {*} connection 
 */

class Dbinterface {
    insertInTable(tableName, data) {
        throw new Error('you have to implement the method doSomething')
    };
    getAllDataFromTable(tableName) {
        throw new Error('you have to implement the method doSomething')
    };
    getDataFromTableWhere(tableName, data) {
        throw new Error('you have to implement the method doSomething')
    };
    deleteData(tableName, data) {
        throw new Error('you have to implement the method doSomething')
    };
}

class MongoInterface extends Dbinterface {
    insertInTable(tableName, data) {};
    getAllDataFromTable(tableName) {};
    getDataFromTableWhere(tableName, data) {};
    deleteData(tableName, data) {};
}
class MysqlInterface extends Dbinterface {
    insertInTable(tableName, data) {
        return new Promise((resolve, reject) => {
            connection.query(`insert into ${tableName} set?`, data, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        });
    };

    getAllDataFromTable(tableName) {
        return new Promise((resolve, reject) => {
            connection.query(`select * from ${tableName}`, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        });
    };

    getDataFromTableWhere(tableName, data) {
        let array = Object.entries(data);
        let firstElement = array.shift();
        let sql = `select * from ${tableName} where ${firstElement[0]} = ?`;
        let valueArray = [firstElement[1]];
        if (array.length > 0) {
            for (const [key, value] of array) {
                sql = `${sql} and ${key} = ?`;
                valueArray.push(value);
            }
        }
        console.log(sql);
        console.log(valueArray)
        return new Promise((resolve, reject) => {
            connection.query(sql, valueArray, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        });
    };

    deleteData(tableName, data) {
        return new Promise((resolve, reject) => {
            connection.query(`delete from ${tableName} where ${Object.keys(data)[0]} = "${value[Object.keys(data)[0]]}"`, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        });
    };
}

class DbInstanciator {

    constructor() {
        if (!dbType) {
            this.dbInterface = new MysqlInterface();
            console.log(this.dbInterface);
        } else {
            this.dbIinterface = new MongoInterface();
            console.log(this.dbInterface);
        }
    }
}


exports.DbInstanciator = DbInstanciator;