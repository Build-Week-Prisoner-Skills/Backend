# Backend

## Prisoner Skills API Guide 
# 

# 
## Administrator List
## GET api/admin
Returns a list of Administrators

No input required
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/admin/ | 

    
    Output:

[

  {
    "id": 1,
    "name": "Warden Norton",
    "username": "snorton",
    "prison_name": "Shawshank State Prison"
  },
  {
    "id": 2,
    "name": "the Captain",
    "username": "smartin",
    "prison_name": "Road Prison 36"
  },
  {
    "id": 3,
    "name": "Hal Moores",
    "username": "hmoores",
    "prison_name": "Cold Mountain Penitentiary"
  }

]

### Authentication Routes 
# 
## Administrator Registeration
## POST api/admin/register
Creates a new account for an administrator
# 
# IF CREATING ACCOUNT NO FACILITY WILL BE LINKED
| Method | Endpoint      |
| - | - |
| POST   | /api/admin/register | 

    Input:

    name : "Warden Norton", (string required, unique) 
	  username: "snorton", (string required, unique)
	  password: "password" (string required) 

    Output:

    id: 1,
    username: "snorton",
    password: hashed password,
    name: "Warden Norton",
    prison_id: null

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

    id: 1,
    username": "snorton",
    token: "{token}",
    message: "Login successful, Warden Norton."


# USERNAMES && PASSWORDS FOR TESTING

{
      id: 1, 
      name: 'Warden Norton',
      username: `snorton`,
      password: `password`,
      prison_id: 1
    },
    {
      id: 2, 
      name: 'the Captain',
      username: `smartin`,
      password: `password`,
      prison_id: 2
    },
    {
      id: 3, 
      name: 'Hal Moores',
      username: `hmoores`,
      password: `password`,
      prison_id: 3
    }



# 
## Updates Profile
## PUT api/admin
User can update profile infomation. 

Must be logged in to update profile

# 
| Method | Endpoint      |
| - | - |
| PUT   | /api/admin | 

    Input: 

	  username: "user",
	  password: "user"
    
    Output: 

    username: "updated username",
	  password: "updated password"


# 
## Add facility
## POST api/admin/facilities
Administrator can add facility infomation. 

Must be logged in to add profile
# UPON CREATION ADMIN WILL RECEIVE AN UPDATED TOKEN
# IF FACILITY IS ALREADY LINKED TO ACCOUNT ADMIN WILL NOT BE ABLE TO ADD
| Method | Endpoint      |
| - | - |
| POST   | /api/admin/facilities | 

    Input: 

    name: "Parnall Correctional Facility", (string, Required)
    address: "1780 East Parnall Road", (string, Required)
    city: "Jackson", (string, Required)
    state: "MI", (string, Required, 2 character Max)
    postal_code: "49201" (string, Required 5 character Max)
        
    Output: 

  {
    prison: {

    id: 4,
    name: "Parnall Correctional Facility"
    address: "1780 East Parnall Road",
    city: "Jackson",
    state: "MI",
    postal_code: "49201"

    },

    token: "{token}",

    message: "Facility added successfully, {admin.name}."
  }


      
 # 
## Gets all inmates at administrators facilities
## GET api/admin/facilities
Administrator can view all inmates at their facility

Must be logged in
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities |

    Logged In As:

	  username: "snorton",
	  password: "password"

    Output:

    id: 1,
    name: "Shawshank State Prison",
    address: "100 Reformatory Road",
    city: "Mansfield",
    state: "ME",
    postal_code: 2305

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
    availability: "On Site" (string, Required)
        
    Output:

    id: 7
    name: "Cody Russell",
    work_exp: "Prototyping",
    skills: "Art, Dev",
    availability: "On Site",
    prison_id: (admin.prison_id)
      

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

	  username: "snorton",
	  password: "password"

    
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
## Gets inmate by ID
## GET api/admin/inmates/:id
Administrator can view specific inmate at their facility,
not authorized to view other facilities' inmates on admin page 

Must be logged in
# 

| Method | Endpoint      |
| - | - |
| GET   | /api/facilities/inmates/1 |

    Logged In As:

    username: "snorton",
    password: "password"

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

  	username: "snorton",
	  password: "password"
    
    Output:

    message: "Not authorized."


# 
## Updates inmate by ID
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

    id: 1,
    name: "Andy Dufresne",
    work_exp: "Accounting, Geology",
    skills: "Math, Planning, Digging",
    availability: "Day pass",
    facility: "Shawshank State Prison",
    prison_id: 1


# 
## Removes inmate at administrators facility by ID
## DELETE api/admin/inmates/:id
Administrator can remove specific inmate at their facility,
not authorized to remove other facilities' inmates 

Must be logged in
# 

| Method | Endpoint      |
| - | - |
| DELETE  | /api/facilities/inmates/1 |


    Logged In As:

	  username: "snorton",
	  password: "password"
    
    Output:
   
    message: "Inmate information deleted."


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

{
    "id": 1,
    "name": "Shawshank State Prison",
    "address": "100 Reformatory Road",
    "city": "Mansfield",
    "state": "ME",
    "postal_code": 4401,
    "prisoners": [
      {
        "name": "Andy Dufresne",
        "experience": "Accounting",
        "skills": "Math, Planning",
        "availability": "Day pass"
      },
      {
        "name": "Ellis Boyd Redding",
        "experience": "Sales",
        "skills": "Ordering, Networking",
        "availability": "Day pass"
      }
    ]
  },
  {
    "id": 2,
    "name": "Road Prison 36",
    "address": "W Main Street",
    "city": "Tavares",
    "state": "FL",
    "postal_code": 32778,
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
  },
  {
    "id": 3,
    "name": "Cold Mountain Penitentiary",
    "address": "Cockrill Bend Boulevard",
    "city": "Cold Mountain",
    "state": "LA",
    "postal_code": 70712,
    "prisoners": [
      {
        "name": "John Coffey",
        "experience": "Healthcare",
        "skills": "Healing, Compassion",
        "availability": "Work Release"
      },
      {
        "name": "Eduard Delacroix",
        "experience": "Animal Trainer",
        "skills": "Bilingual, Animal ",
        "availability": "On Site"
      }
    ]
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
  
    id: 3,
    name: "Cold Mountain Penitentiary",
    address: "Cockrill Bend Boulevard",
    city: "Cold Mountain",
    state: "LA",
    postal_code: "70712"


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
    id: 2,
    name: "Road Prison 36",
    address: "W Main Street",
    city: "Tavares",
    state: "FL",
    postal_code: "32778,
    prisoners: [
      {
        name: "Lucas Jackson",
        experience: "Veteran",
        skills: "Tenacity, Good under pressure",
        availability: "On Site"
      },
      {
        name: "Dragline",
        experience: "Manual Labor",
        skills: "Leadership, Strength",
        availability: "On Site"
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
      id: 1,
      name: "Andy Dufresne",
      work_exp: "Accounting",
      skills: "Math, Scheming",
      availability: "Day pass",
      facility: "Shawshank State Prison",
      postal_code: "04401"

    },
    {
      id: 2,
      name: "Lucas Jackson",
      work_exp: "Veteran",
      skills: "Tenacity, Good under pressure",
      availability: "On Site",
      facility: "Road Prison 36",
      postal_code: "32778"

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

    id: 4,
    name: "Ellis Boyd Redding",
    work_exp: "Sales",
    skills: "Ordering, Networking",
    availability: "Day pass",
    prison_id: 1,
    facility: "Shawshank State Prison",
    postal_code: "04401"
