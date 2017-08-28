# User Resources

```
POST states
```

## Description

Creates one new state in the database.  This action is limited to admin access.

***

## Requires authentication

- A valid [JSON Web Token](https://jwt.io/) with admin privileges is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- Only an administrative email is able to retrieve a JWT for access to this endpoint.
***

## Parameters

To create a new state, there are two required parameters that must be passed in the request body.
  - **state_name** - The unique name of the new state as a `string`
  - **state_abbreviation** - A unique two letter abbreviation of the new state as a `string`

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **422 Unprocessable Entity** — 'Missing required parameter: `requiredParameter`'

***

## Return format

An array of one object (the new state) with the following keys and values:

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

**Return**

`status: 201`

```json
[
  {
    "id": 51,
    "state_name": "Puerto Rico",
    "state_abbreviation": "PR",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  }
]
```
