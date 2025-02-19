const { TABLE_SEARCH_COLUMNS, DB_COLUMNS, executeQuery } = require("./db");
const { shapeResponse } = require("./responseShaper");

const getSelectClause = function (fields, table) {
    if (fields != null) {
        const fieldArray = fields.split(',');
        const selectedFields = fieldArray.map(field => {
            const columnName = DB_COLUMNS[table][field];
            if (!columnName) throw new Error(`Unexpected field name: ${field}`);
            return columnName;
        }).join(', ');
        return `SELECT ${selectedFields}`;
    }
    return 'SELECT *';
}

const getWhereClause = function (searchTerm, table) {
    if (searchTerm == null || searchTerm == '') return '';
    if (TABLE_SEARCH_COLUMNS[table] == null || TABLE_SEARCH_COLUMNS[table].length === 0) return '';
    return `WHERE ${TABLE_SEARCH_COLUMNS[table].map(column => `LOWER(${column}) LIKE '%${searchTerm.toLowerCase()}%'`).join(' OR ')} `;
}

const getOffsetClause = function (offset) {
    if (offset == null || offset == '') return '';
    if (/\D/.test(offset)) throw new Error(`Integer value expected. Found: ${offset}`);
    return ` OFFSET ${offset} ROWS`
}

const resources = [
    {
        path: "/colleges",
        get: async (req, res) => {
            const { query } = req;
            const { fields, searchTerm, offset } = query;
            let selectClause;
            let whereClause;
            let offsetClause;
            try {
                selectClause = getSelectClause(fields, 'COLLEGES');
                whereClause = getWhereClause(searchTerm, 'COLLEGES');
                offsetClause = getOffsetClause(offset);
            } catch (e) {
                res.status(400);
                res.json({'Error': e.message});
                return;
            }
            const sqlQuery = `${selectClause} FROM COLLEGES ${whereClause}ORDER BY COLLEGE_NAME${offsetClause}`;
            let response;
            try {
                response = await executeQuery(sqlQuery);
            } catch(e) {
                res.status(400);
                res.json({'Error': e.message});
                return;
            }
            response = shapeResponse(response, offset);
            res.json(response);
        }
    },
    {
        path: "/gradeScales/:collegeId",
        get: async (req, res) => {
            const { query, params } = req;
            const { fields, offset } = query;
            const { collegeId } = params;
            if (collegeId == null || collegeId == '' || !/C-[0-9]+/.test(collegeId)) {
                const e = new Error('Pass a valid College Id to retrieve the grade scale.');
                res.status(400);
                res.json({ Error: e.message });
                return;
            }
            let selectClause;
            let offsetClause;
            try {
                selectClause = getSelectClause(fields, 'GRADE_SCALES');
                offsetClause = getOffsetClause(offset);
            } catch (e) {
                res.status(400);
                res.json({'Error': e.message});
                return;
            }
            const sqlQuery = `${selectClause} FROM GRADE_SCALES WHERE COLLEGE_ID = '${collegeId}' ORDER BY US_GRADE_POINT DESC, GRADE_ID ASC${offsetClause}`;
            let response;
            try {
                response = await executeQuery(sqlQuery);
            } catch(e) {
                res.status(400);
                res.json({'Error': e.message});
                return;
            }
            response = shapeResponse(response, offset);
            res.json(response);
        }
    }
];

module.exports = { resources };