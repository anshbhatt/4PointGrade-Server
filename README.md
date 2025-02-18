# 4PointGrade API  

This repository provides RESTful API used in the 4PointGrade project. The API includes endpoints to retrieve a list of supported colleges and fetch the grading scale used by a specific college.

## Vision  
Many Indian students face difficulties converting their GPA to the widely used 4.0 scale, especially when applying to international universities. <a href="https://4pointgrade.in/" target="_blank">4PointGrade</a> aims to provide a simple, free, and accurate tool to help students across India convert their GPA based on official grading scales from different colleges.  

## Features  
- Retrieve a list of available colleges.  
- Fetch the corresponding grade scale used by a selected college.

## API Endpoints  

### 1. Get Available Colleges  
**Endpoint:**  
```
GET /colleges
```
**Description:**  
Returns a list of supported colleges.  

**Response Example:**  
```json
{
  "response": [
    {
        "CollegeId": "C-101",
        "CollegeName": "Indian Institute of Technology, Guwahati",
        "CollegeCode": "IITG",
        "City": "Guwahati",
        "State": "Assam"
    }
  ]
}
```

### 2. Get Grade Scale for a College  
**Endpoint:**  
```
GET /gradeScales/{collegeId}
```
**Parameters:**  
- `collegeId` – The ID of the college.  

**Description:**  
Returns the grade scale used by the specified college.  

**Response Example:**  
```json
{
  "response": [
    {
        "GradeId": "G-101",
        "CollegeId": "C-101",
        "GradePoint": "AS",
        "GradeValue": 10,
        "Description": "Outstanding",
        "USGrade": 4
    },
    {
        "GradeId": "G-102",
        "CollegeId": "C-101",
        "GradePoint": "AA",
        "GradeValue": 10,
        "Description": "Excellant",
        "USGrade": 4
    }
  ]
}
```

## Setup  
### Requirements  
- Node.js  
- Express.js (for backend API)
- OracleDB

### Installation  
1. Clone the repository:  
   ```sh
   git clone https://github.com/yourusername/gpa-converter-api.git
   cd 4PointGrade-Server
   ```
2. Install dependencies:  
   ```sh
   npm install
   ```
3. Start the server:  
   ```sh
   npm start
   ```

## License  
This project is licensed under the MIT License.  
