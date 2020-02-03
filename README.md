# Backend

## Prisoner Skills API Guide 
# 
### Authentication Routes 
## Administrator Registeration
## POST api/admin/register
Creates a new account for an administrator
# 

| Method | Endpoint      |
| - | - |
| POST   | /api/admin/register | 
    Input:
    name : "Warden Norton", (string required, unique) 
	username: "snorton", (string required, unique)
	password: "password" (string required) 

    Output:
    id: 1,
    name: "Warden Norton",
    username: "snoton",
    password: "hashed password"
# 
## Administrator Login
## POST api/admin/login
Signs user in and returns a JSON web token
# 

| Method | Endpoint      |
| - | - |
| POST   | /api/admin/login | 
    Input: 
	username: "snorton", (string required, unique)
	password: "password" (string required) 
    
    Output:
    id: "id of admin",
    username: "username of user",
    token: "JSON webtoken returned"
    message: "Welcome to Spotify Song Suggester {username of user}!"
# 
## Updates Profile
## PUT api/auth/:id
User can update profile infomation. 

Must be logged in to update profile and 

# 
| Method | Endpoint      |
| - | - |
| PUT   | /api/auth/:id | 
    Input: 
	username: "user",
	password: "user"
    
    Output: 
    username: "updated username",
	password: "updated password"
    

# 
## Add inmate
## POST api/admin/inmates
Administrator can add inmate infomation. 

Must be logged in to add profile and 

# 
| Method | Endpoint      |
| - | - |
| PUT   | /api/admin/inmates | 
    Input: 
    name: "Cody Russell", (string, Required)
    work_exp: "Prototyping", (string, Required)
    skills: "Art, Dev", (string, Required)
    availability: "On Site", (string, Required)
        
    Output: 
    id: 7
    name: "Cody Russell",
    work_exp: "Prototyping",
    skills: "Art, Dev",
    availability: "On Site",
    facility: "Shawshank State Prison" || (admin.prison_id)
      
# 
## Add inmate
## POST api/admin/inmates
Administrator can add inmate infomation. 

Must be logged in to add profile and 

# 
| Method | Endpoint      |
| - | - |
| PUT   | /api/admin/inmates | 
    Input: 
    name: "Cody Russell", (string, Required)
    work_exp: "Prototyping", (string, Required)
    skills: "Art, Dev", (string, Required)
    availability: "On Site", (string, Required)
        
    Output:
    { 
    id: 7,
    name: "Cody Russell",
    work_exp: "Prototyping",
    skills: "Art, Dev",
    availability: "On Site",
    facility: "Shawshank State Prison",
    prison_id: 1 || (admin.prison_id)
    }

# 
## Gets all inmates at administrators facilities
## GET api/admin/inmates
Administrator can view all inmates at their facility

Must be logged in
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities |


    Logged In As:
{
	username: "snorton",
	password: "password"
}
    
    Output:
[
  {
    id: 1,
    name: "Andy Dufresne",
    work_exp: "Accounting",
    skills: "Math, Planning",
    availability: "Day pass",
    prison_id: 1
  },
  {
    id: 4,
    name: "Ellis Boyd Redding",
    work_exp: "Sales",
    skills: "Ordering, Networking",
    availability: "Day pass",
    prison_id: 1
  }
]

# 
## Gets inmate at administrators facility by ID
## GET api/admin/inmates/:id
Administrator can view specific inmate at their facility,
not authorized to view other facilities' inmates on admin page 

Must be logged in
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities/inmates/1 |


    Logged In As:
{
	username: "snorton",
	password: "password"
}
    
    Output:
[
  {
    id: 1,
    name: "Andy Dufresne",
    work_exp: "Accounting",
    skills: "Math, Planning",
    availability: "Day pass",
    facility: "Shawshank State Prison",
    prison_id: 1
  }
]

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities/inmates/2 |

    Logged In As:
{
	username: "snorton",
	password: "password"
}
    
    Output:

{
    message: "Not authorized."
}

# 
## Updates inmate at administrators facility by ID
## PUT api/admin/inmates/:id
Administrator can edit specific inmate at their facility,
not authorized to edit other facilities' inmates

Must be logged in, input changes
# 

| Method | Endpoint      |
| - | - |
| PUT   | /api/facilities/inmates/1 |


    Logged In As:

	username: "snorton",
	password: "password"

  Input: 
    name: "Andy Dufresne",
    work_exp: "Accounting, Geology",
    skills: "Math, Planning, Digging",
    availability: "Day pass" 


    
    Output:
{
    id: 1,
    name: "Andy Dufresne",
    work_exp: "Accounting, Geology",
    skills: "Math, Planning, Digging",
    availability: "Day pass",
    facility: "Shawshank State Prison",
    prison_id: 1
}

# 
## Removes inmate at administrators facility by ID
## DELETE api/admin/inmates/:id
Administrator can remove specific inmate at their facility,
not authorized to remove other facilities' inmates 

Must be logged in
# 

| Method | Endpoint      |
| - | - |
| PUT   | /api/facilities/inmates/1 |


    Logged In As:

	username: "snorton",
	password: "password"
    
    Output:
{
   
    message: "Inmate information deleted."

}

### Public Routes   

# 
## Gets all facilities
## GET api/facilities
Any user can view all facilities

No input needed.
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities |
    
    Output:
  [
  {
    "id": 1,
    "name": "Shawshank State Prison",
    "address": "100 Reformatory Road",
    "city": "Mansfield",
    "state": "ME",
    "postal_code": "04401"
  },
  {
    "id": 2,
    "name": "Road Prison 36",
    "address": "W Main Street",
    "city": "Tavares",
    "state": "FL",
    "postal_code": "32778"
  },
  {
    "id": 3,
    "name": "Cold Mountain Penitentiary",
    "address": "Cockrill Bend Boulevard",
    "city": "Cold Mountain",
    "state": "LA",
    "postal_code": "70712"
  }
]

# 
## Gets facility by id
## GET api/facilities/:id
Any user can view by facility

No input needed.
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities/3 |
    
    Output:
    {
  "id": 3,
  "name": "Cold Mountain Penitentiary",
  "address": "Cockrill Bend Boulevard",
  "city": "Cold Mountain",
  "state": "LA",
  "postal_code": "70712"
}

# 
## Gets all inmates by facility
## GET api/facilities/:id/inmates
Any user can view all inmates by facility

No input needed.
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities/2/inmates |
    
    Output:
    {
  "name": "Road Prison 36",
  "zip": "32778",
  "prisoners": [
    {
      "name": "Lucas Jackson",
      "experience": "Veteran",
      "skills": "Tenacity, Good under pressure",
      "availability": "On Site"
    },
    {
      "name": "Dragline",
      "experience": "Manual Labor",
      "skills": "Leadership, Strength",
      "availability": "On Site"
    }
  ]
}

# 
## Gets all inmates
## GET api/inmates
Any user can view all inmates

No input needed.
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/inmates |
    
    Output:
  [
  {
    "id": 1,
    "name": "Andy Dufresne",
    "work_exp": "Accounting",
    "skills": "Math, Scheming",
    "availability": "Day pass",
    "facility": "Shawshank State Prison",
    "postal_code": "04401"

  },
  {
    "id": 2,
    "name": "Lucas Jackson",
    "work_exp": "Veteran",
    "skills": "Tenacity, Good under pressure",
    "availability": "On Site",
    "facility": "Road Prison 36",
    "postal_code": "32778"

  },
  ...
]
 #   
## Gets inmate by id
## GET api/inmates/:id
Any user can get an inmate by id

No input needed.
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/inmates/:id |
    
    Output:
{
  "id": 4,
  "name": "Ellis Boyd Redding",
  "work_exp": "Sales",
  "skills": "Ordering, Networking",
  "availability": "Day pass",
  "prison_id": 1,
  "facility": "Shawshank State Prison",
  "postal_code": "04401"
}