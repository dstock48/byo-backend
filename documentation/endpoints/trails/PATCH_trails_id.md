# Trails Endpoint

```
PATCH trails/:id
```

## Description

Updates one trail in the database.  This action is limited to admin access.

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

To update trail you must pass in the id of the trail to patch.
  - **id** — Database ID number of the desired trail.

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **404 Not Found** — 'The trail with ID# `id` was not found and could not be updated
- **422 Unprocessable Entity** — 'You cannot change the ID.' - (if `id` is passed in the request body)

***

## Return format

An array of one object (the updated trail) with the following keys and values:

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
https://winter-resort-api.herokuapp.com/api/v1/trails/3
```

**Return**

`status: 200`

```json
[
  {
    "id": 3,
    "trail_name": "Bunnies Eat Carrots",
    "trail_difficulty": "Beginner",
    "trail_length": "0.75",
    "open": true,
    "resort_id": 12,
    "resort_name": "Vail",
    "created_at": "2017-08-27T20:59:36.503Z",
    "updated_at": "2017-08-27T20:59:36.503Z"
  }
]
```
