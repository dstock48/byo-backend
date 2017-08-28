# User Resources

```
GET states/:state_abbreviation
```

## Description

Returns _**all**_ information of a single state in the database.

***

## Requires authentication

- A valid [JSON Web Token](https://winter-resort-api.herokuapp.com/) is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- Any registration email is valid to access this endpoint.

***

## Parameters

- **[state_abbreviation][]** - A two letter abbreviation of the desired state is needed to retrieve the state information.  The abbreviation is _**not**_ case sensitive.

***

## Return format

An array of with one object with the following keys and values:

- **id** - Auto-incrementing ID number for the record in the database.
- **state_name** - Name of state.
- **state_abbreviation** - 2 letter abbreviation of the state.
- **created_at** — Date the record was created in the database.
- **updated_at** — Date the record was updated in the database.

***

## Errors
All known errors cause the resource to return HTTP error code header together with a JSON array containing at least 'status' and 'error' keys describing the source of error.

- **403 Forbidden** — 'You must be authorized to hit this endpoint' - (JWT was not passed in the request)
- **403 Forbidden** — 'Invalid token' - (invalid JWT was passed in the request)
- **404 Not Found** — 'Could not find a state with a state abbreviation of `state_abbreviation`.'

***

## Example

**Request (Using JWT)**

```
https://winter-resort-api.herokuapp.com/api/v1/states/6
```

**Return**

```json
[
  {
    "id": 6,
    "state_name": "Colorado",
    "state_abbreviation": "CO",
    "created_at": "2017-08-25T23:34:09.962Z",
    "updated_at": "2017-08-25T23:34:09.962Z"
  }
]
```

[state_abbreviation] : https://github.com/dstock48/byo-backend/blob/documentation/documentation/basics/state_abbreviations.md
