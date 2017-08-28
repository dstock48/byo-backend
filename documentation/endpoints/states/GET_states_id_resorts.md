# User Resources

```
GET states/:id/resorts
```

## Description

Returns _**all**_ resorts of a single state in the database.

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

- **id** - A unique numeric state ID.

***

## Errors
All known errors cause the resource to return HTTP error code header together with a JSON array containing at least 'status' and 'error' keys describing the source of error.

- **403 Forbidden** — 'You must be authorized to hit this endpoint' - (JWT was not passed in the request)
- **403 Forbidden** — 'Invalid token' - (invalid JWT was passed in the request)
- **404 Not Found** — 'Could not find any resorts in this state.'

***

## Return format

An array of objects with the following keys and values:

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

***

## Example

**Request (Using JWT)**

```
https://winter-resort-api.herokuapp.com/api/v1/states/6/resorts
```

#### Return shortened for example purpose
```json
[
  {
    "id": 21,
    "resort_name": "Arapahoe Basin Ski Area",
    "state_name": "Colorado",
    "projected_open_date": "2017-10-20T06:00:00.000Z",
    "annual_snowfall": 350,
    "trail_total": 109,
    "days_open_last_year": 237,
    "summit_elevation": 13050,
    "base_elevation": 10779,
    "beginner_trail_percent": "0.100",
    "intermediate_trail_percent": "0.300",
    "advanced_trail_percent": "0.370",
    "expert_trail_percent": "0.230",
    "states_id": 6,
    "created_at": "2017-08-25T03:27:37.431Z",
    "updated_at": "2017-08-25T03:27:37.431Z"
  },
  {
    "id": 23,
    "resort_name": "Aspen / Snowmass",
    "state_name": "Colorado",
    "projected_open_date": "2017-11-23T07:00:00.000Z",
    "annual_snowfall": 300,
    "trail_total": 337,
    "days_open_last_year": 138,
    "summit_elevation": 12510,
    "base_elevation": 7879,
    "beginner_trail_percent": "0.100",
    "intermediate_trail_percent": "0.430",
    "advanced_trail_percent": "0.190",
    "expert_trail_percent": "0.280",
    "states_id": 6,
    "created_at": "2017-08-25T03:27:37.431Z",
    "updated_at": "2017-08-25T03:27:37.431Z"
  }
]
```
