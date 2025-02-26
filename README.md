# 4PointGrade API  

This repository provides RESTful API used in the 4PointGrade project. The API includes endpoints to retrieve a list of supported colleges and fetch the grading scale used by a specific college.

## Vision  
Many Indian students face difficulties converting their GPA to the widely used 4.0 scale, especially when applying to international universities. <a href="https://4pointgrade.in/" target="_blank">4PointGrade</a> aims to provide a simple, free, and accurate tool to help students across India convert their GPA based on official grading scales from different colleges.  

## Features  
- Retrieve a list of available colleges.
- Fetch the details of a specific college.
- Add a new college.
- Fetch the grade scale used by a selected college.
- Add grades for a college.
- Remove a college and its grade scale.

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
    "items": [
        {
            "CollegeId": "C-101",
            "CollegeName": "Indian Institute of Technology, Guwahati",
            "CollegeCode": "IITG",
            "City": "Guwahati",
            "State": "Assam"
        }
    ],
    "count": 1,
    "limit": 25,
    "offset": 0,
    "hasMore": false
}
```

### 2. Get Specific College
**Endpoint:**  
```
GET /colleges/{collegeId}
```
**Description:**  
Returns details of specified college.  

**Response Example:**  
```json
{
    "CollegeId": "C-101",
    "CollegeName": "Indian Institute of Technology, Guwahati",
    "CollegeCode": "IITG",
    "City": "Guwahati",
    "State": "Assam"
}
```

### 3. Add New College
**Endpoint:**  
```
POST /colleges
```
**Description:**  
Requires authorization. Posts the details of a college.

**Payload Example**
```json
{
    "CollegeName": "Test College Name",    // Non Null
    "CollegeCode": null,                   // Nullable
    "City": "Hyderabad",                   // Non Null
    "State": "Telangana"                   // Non Null
}
```

**Response Example:**  
```json
{
    "CollegeId": "C-102",
    "CollegeName": "Test College Name",
    "CollegeCode": null,
    "City": "Hyderabad",
    "State": "Telangana"
}
```

### 4. Get Grade Scale for a College  
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
    "items": [
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
    ],
    "count": 2,
    "limit": 25,
    "offset": 0,
    "hasMore": false
}
```

### 5. Add Grades for College
**Endpoint:**  
```
POST /gradeScales/{collegeId}
```
**Parameters:**  
- `collegeId` – The ID of the college. 

**Description:**  
Requires authorization. Posts the grades for a college.

**Payload Example**
```json
[
    {
        "GradePoint": "AB",                //Non Null
        "GradeValue": 9,                   //Non Null
        "Description": null,               //Nullable
        "USGrade": 4                       //Non Null
    },
    {
        "GradePoint": "BB",
        "GradeValue": 8,
        "Description": "Okay",
        "USGrade": 3.5
    }
]
```

**Response Example:**  
```json
[
    {
        "GradeId": "G-103",
        "CollegeId": "C-101",
        "GradePoint": "AB",
        "GradeValue": 9,
        "Description": null,
        "USGrade": 4
    },
    {
        "GradeId": "G-104",
        "CollegeId": "C-101",
        "GradePoint": "BB",
        "GradeValue": 8,
        "Description": "Okay",
        "USGrade": 3.5
    }
]
```

### 6. Remove Existing College
**Endpoint:**  
```
DELETE /colleges/{collegeId}
```
**Parameters:**  
- `collegeId` – The ID of the college.  

**Description:**  
Requires authorization. Deletes specified college, its details and its grade scale. Returns status 204 if successful.

## Setup  
### Requirements  
- Node.js  
- Express.js (for backend API)
- OracleDB

### Installation  
1. Clone the repository:  
   ```sh
   git clone https://github.com/anshbhatt/4PointGrade-Server.git
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
