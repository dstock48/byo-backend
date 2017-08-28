# Resorts Endpoint

```
DELETE resorts/:id
```

## Description
Deletes the specified resort from the database.

---

## Requires Authentication
- A valid [JSON Web Token](https://jwt.io/) is required in order to access this endpoint.
  - Token can be sent in the following formats:
    - **HTTP Request Header**
    - **HTTP Request Body**
    - **HTTP URL Query String**
- A registration email ending in **@turing.io** is required to access this endpoint.

## Parameters
- **id** — Database ID number of the desired resort.

## Return Format
An object matching the specified ID with the following keys and values:

- **success** — Message indicating that the resort with the specified ID was successfully deleted from the database.
- **deletedResortInfo** — An object containing all of the data regarding the deleted database record.

## Example

#### Request
```
https://winter-resort-api.herokuapp.com/api/v1/resorts/333
```

#### Return
```json
{
  "success": "The resort with ID# 333 has been deleted from the database",
  "deletedResortInfo": {
      "id": 333,
      "resort_name": "Example Resort Name",
      "state_name": "washington",
      "projected_open_date": "2017-12-01T07:00:00.000Z",
      "annual_snowfall": 301,
      "trail_total": 82,
      "days_open_last_year": 101,
      "summit_elevation": 5774,
      "base_elevation": 3931,
      "beginner_trail_percent": "0.300",
      "intermediate_trail_percent": "0.400",
      "advanced_trail_percent": "0.250",
      "expert_trail_percent": "0.050",
      "states_id": 47,
      "created_at": "2017-08-28T00:37:18.890Z",
      "updated_at": "2017-08-28T00:37:18.890Z"
  }
}
```
