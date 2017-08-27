# User Resources

```
GET trails
```

## Description

Returns _**all**_ of the trails in the database.

--------------------------------------------------------------------------------

## Requires authentication

- A valid [JSON Web Token](https://jwt.io/) is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- Any registration email is valid to access this endpoint.

--------------------------------------------------------------------------------

## Parameters

There are no parameters necessary for this endpoint.

--------------------------------------------------------------------------------

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

## Example

**Request (Using JWT)**

```
https://winter-resort-api.herokuapp.com/api/v1/trails
```

**Return shortened for example purpose**

```json
[
  {
    "id": 1,
    "trail_name": "Happy Trails to You",
    "trail_difficulty": "Expert",
    "trail_length": "3.25",
    "open": true,
    "resort_id": 327,
    "resort_name": "Big Sky Resort",
    "created_at": "2017-08-27T20:59:36.503Z",
    "updated_at": "2017-08-27T20:59:36.503Z"
  },
  {
    "id": 2,
    "trail_name": "Sidewinder",
    "trail_difficulty": "Advanced",
    "trail_length": "1.25",
    "open": true,
    "resort_id": 12,
    "resort_name": "Vail",
    "created_at": "2017-08-27T20:59:36.503Z",
    "updated_at": "2017-08-27T20:59:36.503Z"
  },
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
  },
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
  },
  {
    "id": 5,
    "trail_name": "Whispering Banshee",
    "trail_difficulty": "Intermediate",
    "trail_length": "2.20",
    "open": false,
    "resort_id": 327,
    "resort_name": "Big Sky Resort",
    "created_at": "2017-08-27T20:59:36.503Z",
    "updated_at": "2017-08-27T20:59:36.503Z"
  }, …
]
```
