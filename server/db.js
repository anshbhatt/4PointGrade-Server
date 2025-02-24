const oracledb = require("oracledb");
const { USER, PASS } = require("./.env");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const _getConnection = async function () {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: USER,
            password: PASS,
            port: 1522,
            connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-mumbai-1.oraclecloud.com))(connect_data=(service_name=gfea26298904789_database4pg_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
        });
    } catch (e) {
        if (connection != null) connection.close();
        throw e;
    }
    return connection;
}

const _sanitizeInput = function (str) {
    return str ? str.replaceAll("'", "''") : str;
}

const _DB_COLUMNS = {
    COLLEGES: {
        CollegeId: "COLLEGE_ID",
        CollegeName: "COLLEGE_NAME",
        CollegeCode: "COLLEGE_CODE",
        City: "CITY",
        State: "STATE"
    },
    GRADE_SCALES: {
        CollegeId: "COLLEGE_ID",
        GradeId: "GRADE_ID",
        GradePoint: "GRADE_POINT",
        Description: "GRADE_DESCRIPTION",
        GradeValue: "GRADE_VALUE",
        USGrade: "US_GRADE_POINT"
    }
};

const _TABLE_SEARCH_COLUMNS = {
    COLLEGES: ["COLLEGE_NAME", "CITY", "STATE"],
    GRADE_SCALES: []
};

const _insertRowToColleges = async function (payload) {
    const { CollegeName, CollegeCode, City, State } = payload;
    const table = 'COLLEGES';

    const insertColumns = ['CollegeName', 'CollegeCode', 'City', 'State'].filter(col => payload[col] != null).map(col => _DB_COLUMNS[table][col]);
    const insertValues = [CollegeName, CollegeCode, City, State].filter(col => col != null).map(col => `'${_sanitizeInput(col)}'`).join(', ');
    const sqlQuery_post = `INSERT INTO ${table} (COLLEGE_ID, ${insertColumns}) VALUES (CONCAT('C-', COLLEGE_ID_SEQUENCE.nextval), ${insertValues}) RETURN COLLEGE_ID INTO :collegeId`;
    let connection;
    let response;
    try {
        connection = await _getConnection();
        response = await connection.execute(sqlQuery_post, { collegeId: { type: oracledb.STRING, dir: oracledb.BIND_OUT } }, { autoCommit: true });
        const collegeId = response.outBinds.collegeId[0];
        const sqlQuery_get = `SELECT * FROM ${table} WHERE COLLEGE_ID = '${collegeId}'`;
        response = await executeQuery(sqlQuery_get);
    } catch (e) {
        if (connection != null) connection.close();
        throw e;
    }
    if (connection != null) connection.close();
    return response;
}

const _insertRowsToGradeScales = async function (payload, collegeId) {
    let payloadArray = [];
    if (!Array.isArray(payload)) payloadArray.push(payload);
    else payloadArray = [ ...payload ];

    let connection;
    try {
        connection = await _getConnection();
    } catch(e) {
        if (connection != null) connection.close();
        throw e;
    }

    const table = 'GRADE_SCALES';

    for (item of payloadArray) {
        const { GradeValue, GradePoint, Description, USGrade } = item;
        const insertColumns = ['GradeValue', 'GradePoint', 'Description', 'USGrade'].filter(col => item[col] != null).map(col => _DB_COLUMNS[table][col]);
        const insertValues = [GradeValue, GradePoint, Description, USGrade].filter(col => col != null).map(col => typeof col === 'string' ? `'${_sanitizeInput(col)}'` : col).join(', ');
        const sqlQuery_post = `INSERT INTO ${table} (GRADE_ID, COLLEGE_ID, ${insertColumns}) VALUES (CONCAT('G-', GRADE_ID_SEQUENCE.nextval), '${collegeId}', ${insertValues})`;
        try {
            await connection.execute(sqlQuery_post, {}, { autoCommit: true });
        } catch (e) {
            if (connection != null) connection.close();
            throw e;
        }
    }
    let response;
    const sqlQuery_get = `SELECT * FROM ${table} WHERE COLLEGE_ID = '${collegeId}' ORDER BY GRADE_ID DESC`;
    try {
        response = await executeQuery(sqlQuery_get, payloadArray.length);
    } catch (e) {
        if (connection != null) connection.close();
        throw e;
    }
    if (connection != null) connection.close();
    return response;
}

const getSelectClause = function (fields, table) {
    if (fields != null) {
        const fieldArray = fields.split(',');
        const selectedFields = fieldArray.map(field => {
            const columnName = _DB_COLUMNS[table][field];
            if (!columnName) throw new Error(`Unexpected field name: ${field}`);
            return columnName;
        }).join(', ');
        return `SELECT ${selectedFields}`;
    }
    return 'SELECT *';
}

const getWhereClause = function (searchTerm, table) {
    if (searchTerm == null || searchTerm == '') return '';
    if (_TABLE_SEARCH_COLUMNS[table] == null || _TABLE_SEARCH_COLUMNS[table].length === 0) return '';
    return `WHERE ${_TABLE_SEARCH_COLUMNS[table].map(column => `LOWER(${column}) LIKE '%${searchTerm.toLowerCase()}%'`).join(' OR ')} `;
}

const getOffsetClause = function (offset) {
    if (offset == null || offset == '') return '';
    if (/\D/.test(offset)) throw new Error(`Integer value expected. Found: ${offset}`);
    return ` OFFSET ${offset} ROWS`
}

const executeQuery = async function (sqlQuery, limit = 25) {
    let response;
    let connection;
    try {
        connection = await _getConnection();
        response = await connection.execute(sqlQuery, [], { maxRows: limit });
    }
    catch (e) {
        if (connection != null) connection.close();
        throw e;
    }
    if (connection != null) connection.close();
    return response.rows;
}

const executePost = async function (payload, options) {
    const { table, collegeId } = options;
    try {
        if (table === 'COLLEGES') {
            return await _insertRowToColleges(payload);
        }
        return await _insertRowsToGradeScales(payload, collegeId);
    } catch (e) {
        throw e;
    }
}

const deleteRecord = async function (id, table) {
    const sqlQuery = `DELETE FROM ${table} WHERE ${table === 'COLLEGES' ? 'COLLEGE_ID' : 'GRADE_ID'} = '${id}'`;
    let connection;
    let response;
    try {
        connection = await _getConnection();
        response = await connection.execute(sqlQuery, [], { autoCommit: true });

    } catch (e) {
        if (connection != null) connection.close();
        throw e;
    }
    if (connection != null) connection.close();
    const { rowsAffected } = response;
    if (rowsAffected > 0) return true;
    return false;
}

module.exports = { executeQuery, getSelectClause, getWhereClause, getOffsetClause, executePost, deleteRecord };