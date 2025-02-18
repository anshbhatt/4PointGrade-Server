const oracledb = require("oracledb");
const { USER, PASS } = require("./.cred");

const DB_COLUMNS = {
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

const TABLE_SEARCH_COLUMNS = {
    COLLEGES: ["COLLEGE_NAME", "CITY", "STATE"],
    GRADE_SCALES: []
};

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const executeQuery = async function (sqlQuery) {
    let connection;
    let response;
    try {
        connection = await oracledb.getConnection({
            user: USER,
            password: PASS,
            port: 1522,
            connectString: "database4pg_high",
            configDir: "server/.Wallet_Database4PG"
        });
        response = await connection.execute(sqlQuery, [], { maxRows: 25 });
    } catch (e) {
        if (connection != null) connection.close();
        throw e;
    }
    if (connection != null) connection.close();
    return response.rows;
}

module.exports = { DB_COLUMNS, TABLE_SEARCH_COLUMNS, executeQuery };