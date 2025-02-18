const restColumnMap = {
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

const shapeResponse = function (rows) {
    if (rows.length == 0) return rows;
    return rows.map(row => {
        const shapedRow = {};
        Object.keys(row).forEach(key => {
            shapedRow[restColumnMap[key]] = row[key];
        });
        return shapedRow;
    });
}

module.exports = { shapeResponse };