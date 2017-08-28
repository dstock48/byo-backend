# States Endpoint

```
GET states
```

## Description

Returns _**all**_ of the states in the database.

***

## Requires authentication

- A valid [JSON Web Token](https://jwt.io/) is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- Any registration email is valid to access this endpoint.
***

## Parameters

There are no parameters necessary for this endpoint.

***

## Errors

- **403 Forbidden** — The JSON Web Token was either missing from the request or was invalid.

***

## Return format

An array of objects with the following keys and values:

- **id** - Auto-incrementing ID number for the record in the database.
- **state_name** - Name of state.
- **state_abbreviation** - 2 letter abbreviation of the state.
- **created_at** — Date the record was created in the database.
- **updated_at** — Date the record was updated in the database.

***

## Example

**Request (Using JWT)**

```
https://winter-resort-api.herokuapp.com/api/v1/states
```

**Return shortened for example purpose**

```json
[
  {
    "id": 1,
    "state_name": "Alabama",
    "state_abbreviation": "AL",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  },
  {
    "id": 2,
    "state_name": "Alaska",
    "state_abbreviation": "AK",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  },
  {
    "id": 3,
    "state_name": "Arizona",
    "state_abbreviation": "AZ",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  },
  {
    "id": 4,
    "state_name": "Arkansas",
    "state_abbreviation": "AR",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  },
  {
    "id": 5,
    "state_name": "California",
    "state_abbreviation": "CA",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  },
]
```
