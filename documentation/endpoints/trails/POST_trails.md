# Trails Endpoint

```
POST trails
```

## Description

Creates one new trail in the database.  This action is limited to admin access.

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

To create a new trail, there are three required parameters that must be passed in the request body.
  - **trail_name** - The name of the new trail as a `string`
  - **trail_difficulty** - the difficulty of the trail as a  `string`
  - **resort_id** - A numeric value corresponding to an existing resorts ID

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **422 Unprocessable Entity** — 'Missing required parameter: `requiredParameter`'

***

## Return format

An array of one object (the new trail) with the following keys and values:

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
https://winter-resort-api.herokuapp.com/api/v1/trails
```

**Return**

`status: 201`

```json
[
  {
    "id": 6,
    "trail_name": "Screaming Mute",
    "trail_difficulty": "Advanced",
    "trail_length": "3.20",
    "open": true,
    "resort_id": 327,
    "resort_name": "Big Sky Resort",
    "created_at": "2017-08-27T20:59:36.503Z",
    "updated_at": "2017-08-27T20:59:36.503Z"
  }
]
```
