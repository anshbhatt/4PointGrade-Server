const _restColumnMap = {
    CITY: "City",
    COLLEGE_CODE: "CollegeCode",
    COLLEGE_ID: "CollegeId",
    COLLEGE_NAME: "CollegeName",
    GRADE_DESCRIPTION: "Description",
    GRADE_ID: "GradeId",
    GRADE_POINT: "GradePoint",
    GRADE_VALUE: "GradeValue", 
    STATE: "State",
    US_GRADE_POINT: "USGrade"
};

const shapeResponse = function (rows, offset) {
    const items = rows.map(row => {
        const shapedRow = {};
        Object.keys(row).forEach(key => {
            shapedRow[_restColumnMap[key]] = row[key];
        });
        return shapedRow;
    });
    const count = rows.length;
    const limit = 25;
    const hasMore = rows.length == 25;
    return {
        items,
        count,
        limit,
        offset: Number(offset) || 0,
        hasMore
    };
}

module.exports = { shapeResponse };