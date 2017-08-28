# Resorts Endpoint

```
GET resorts/:id/trails
```

## Description
Returns _all_ trails for a specific resort in the database.

---

## Requires Authentication
- A valid [JSON Web Token](https://jwt.io/) is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- Any registration email is valid to access this endpoint.

## Parameters
- **id** — Database ID number of the desired resort.

## Errors
- **403 Forbidden** — The JSON Web Token was either missing from the request or was invalid.
- **404 Not Found** — The resort with the specified ID does not exist.

## Return Format
An array of trail objects matching the specified resort ID with the following keys and values:

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

#### Request
```
https://winter-resort-api.herokuapp.com/api/v1/resorts/28/trails
```

#### Return shortened for example purpose
```json
[
  {
      "id": 2,
      "trail_name": "Example Trail Name 1",
      "trail_difficulty": "Intermediate",
      "trail_length": "0.75",
      "open": true,
      "resort_id": 28,
      "created_at": "2017-08-27T16:00:20.272Z",
      "updated_at": "2017-08-27T16:00:20.272Z",
      "resort_name": "Big Sky Resort"
  },
  {
      "id": 5,
      "trail_name": "Example Trail Name 2",
      "trail_difficulty": "Expert",
      "trail_length": "3.85",
      "open": false,
      "resort_id": 28,
      "created_at": "2017-08-27T16:00:20.272Z",
      "updated_at": "2017-08-27T16:00:20.272Z",
      "resort_name": "Big Sky Resort"
  }
]
```
