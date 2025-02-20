const { isAuthorized } = require("./.cred");
const { executeQuery, getSelectClause, getWhereClause, getOffsetClause, executePost, deleteRecord } = require("./db");
const { shapeResponse } = require("./responseShaper");

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
        },
        post: async (req, res) => {
            const httpAuth = req.headers.authorization;
            if (!isAuthorized(httpAuth)) {
                res.status(403);
                res.json({Error: 'Unauthorized Acces.'});
                return
            };
            let response;
            try {
                response = await executePost(req.body, 'COLLEGES');
            } catch(e) {
                res.status(400);
                res.json({'Error': e.message});
                return;
            }
            res.status(201);
            response = shapeResponse(response);
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
    },
    {
        path: "/colleges/:collegeId",
        delete: async (req, res) => {
            const httpAuth = req.headers.authorization;
            if (!isAuthorized(httpAuth)) {
                res.status(403);
                res.json({Error: 'Unauthorized Acces.'});
                return
            };
            const { params } = req;
            const { collegeId } = params;
            if (collegeId == null || collegeId == '' || !/C-[0-9]+/.test(collegeId)) {
                res.status(400);
                res.json({ Error: 'Invalid College Id.' });
                return;
            }
            let response;
            try {
                response = await deleteRecord(collegeId, 'COLLEGES');
            } catch(e) {
                res.status(400);
                res.json({'Error': e.message});
                return;
            }
            res.status(response ? 204 : 404);
            res.json();
        }
    }
];

module.exports = { resources };