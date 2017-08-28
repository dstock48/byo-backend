# User Resources

```
GET trails/:id
```

## Description

Returns _**all**_ information of a single trail in the database.

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

- **id** — Database ID number of the desired trail.

***

## Errors
All known errors cause the resource to return HTTP error code header together with a JSON array containing at least 'status' and 'error' keys describing the source of error.

- **403 Forbidden** — 'You must be authorized to hit this endpoint' - (JWT was not passed in the request)
- **403 Forbidden** — 'Invalid token' - (invalid JWT was passed in the request)
- **404 Not Found** — 'Could not find a trail with the id of `id`.'

***

## Return format

An array of objects with the following keys and values:

- **id** - Auto-incrementing ID number for the record in the database.
- **trail_name** - Name of trail.
- **trail_difficulty** - Difficulty level of trail.
- **trail_length** - Length of trail.
- **open** - Availability status of the trail.
- **resort_id** - Unique ID of the resort where the trail is located.
- **resort_name** - Name of the resort where the trail is located.
- **created_at** — Date the record was created in the database.
- **updated_at** — Date the record was updated in the database.

***

## Example

**Request (Using JWT)**

```
https://winter-resort-api.herokuapp.com/api/v1/trails/4
```

**Return**

`status: 200`

```json
[
  {
    "id": 4,
    "trail_name": "Don't Look Down",
    "trail_difficulty": "Expert",
    "trail_length": "2",
    "open": true,
    "resort_id": 125,
    "resort_name": "Mammoth Resort",
    "created_at": "2017-08-27T20:59:36.503Z",
    "updated_at": "2017-08-27T20:59:36.503Z"
  }
]
```
