# User Resources

```
GET states
```

## Description

Returns all of the states in the database.

--------------------------------------------------------------------------------

## Requires authentication

**A valid [Json Web Token](https://winter-resort-api.herokuapp.com/) must be passed in through one of the following:**

- HTTP Request Header
- HTTP Request Body
- HTTP URL Query String

--------------------------------------------------------------------------------

## Parameters

There are no parameters necessary for this endpoint.

--------------------------------------------------------------------------------

## Return format

Current states in database in full format.

## Example

**Request (Using JWT)**

```
https://winter-resort-api.herokuapp.com/api/v1/states
```

**Return**

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
  }, ...
]
```
