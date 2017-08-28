# Resorts Endpoint

```
GET resorts/:id
```

## Description
Returns details for a specific resort in the database.

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
An array containing a single object matching the specified ID with the following keys and values:

- **id** — Auto-incrementing ID number for the record in the database.
- **resort_name** — Name of resort.
- **state_name** — Name of state in which the resort is located.
- **projected_open_date** — Projected opening date for the resort.
- **annual_snowfall** — Average snowfall amount for the resort.
- **days_open_last_year** — Total number of days the resort was open the previous year.
- **summit_elevation** — Elevation in _ft_ at the summit of the mountain.
- **base_elevation** — Elevation in _ft_ at the base of the mountain.
- **beginner_trail_percent** — Percentage of beginner trails available at the resort.
- **intermediate_trail_percent** — Percentage of intermediate trails available at the resort.
- **advanced_trail_percent** — Percentage of advanced trails available at the resort.
- **expert_trail_percent** — Percentage of expert trails available at the resort.
- **states_id** — Foreign ID related to the resort's corresponding state in the states table.
- **created_at** — Date the record was created in the database.
- **updated_at** — Date the record was updated in the database.

## Example

#### Request
```
https://winter-resort-api.herokuapp.com/api/v1/resorts/28
```

#### Return shortened for example purpose
```json
[
  {
      "id": 28,
      "resort_name": "Big Sky Resort",
      "state_name": "montana",
      "projected_open_date": "2017-11-23T00:00:00.000Z",
      "annual_snowfall": 400,
      "trail_total": 306,
      "days_open_last_year": 144,
      "summit_elevation": 11166,
      "base_elevation": 6800,
      "beginner_trail_percent": "0.150",
      "intermediate_trail_percent": "0.250",
      "advanced_trail_percent": "0.420",
      "expert_trail_percent": "0.180",
      "states_id": 26,
      "created_at": "2017-08-25T23:34:10.056Z",
      "updated_at": "2017-08-25T23:34:10.056Z"
  }
]
```
