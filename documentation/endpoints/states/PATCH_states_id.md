# User Resources

```
PATCH states/:id
```

## Description

Updates one state in the database.  This action is limited to admin access.

***

## Requires authentication

- A valid [JSON Web Token](https://jwt.io/) with admin privileges is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- A registration email ending in **@turing.io** is required to access this endpoint.

***

## Parameters

To update state you must pass in the id of the state to patch.
  - **id** — Database ID number of the desired state.

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **404 Not Found** — 'The state with ID# `id` was not found and could not be updated
- **422 Unprocessable Entity** — 'You cannot change the ID.' - (if `id` is passed in the request body)

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

`status: 200`

```json
[
  {
    "id": 6,
    "state_name": "Coloradoo",
    "state_abbreviation": "CO",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  }
]
```
