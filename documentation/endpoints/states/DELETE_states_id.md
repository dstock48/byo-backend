# States Endpoint

```
DELETE states/:id
```

## Description
Deletes the specified state from the database.

***

## Requires Authentication
- A valid [JSON Web Token](https://jwt.io/) is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- A registration email ending in **@turing.io** is required to access this endpoint.

***

## Parameters
- **id** — Database ID number of the desired state.

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **404 Not Found** — 'The state with ID# `id` was not found and could not be deleted

***

## Return Format
An object matching the specified ID with the following keys and values:

- **success** — Message indicating that the state with the specified ID was successfully deleted from the database.
- **deletedStateInfo** — An object containing all of the data regarding the deleted database record.

***

## Example

#### Request
```
https://winter-resort-api.herokuapp.com/api/v1/states/1
```

#### Return
```json
{
  "success": "The state with ID# 1 has been successfully deleted!",
  "deletedStateInfo": {
      "id": 1,
      "state_name": "Alabama",
      "state_abbreviation": "AL",
      "created_at": "2017-08-28T00:37:18.890Z",
      "updated_at": "2017-08-28T00:37:18.890Z"
  }
}
```
