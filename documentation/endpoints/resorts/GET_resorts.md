# Resorts Endpoint

```
GET resorts
```

## Description
Returns a list of _**all**_ resorts in the database.

---

## Requires Authentication
- A valid [JSON Web Token](https://winter-resort-api.herokuapp.com/) is required in order to access this endpoint.
  - Token can be sent in the following formats: **HTTP Request Header**, **HTTP Request Body**, **HTTP URL Query String**
- Any registration email is valid to access this endpoint.

## Parameters
There are no parameters necessary for this endpoint.

## Return Format
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

## Example

#### Request
```
https://winter-resort-api.herokuapp.com/api/v1/resorts/
```

#### Return shortened for example purpose
```json
[
  {
      "id": 1,
      "resort_name": "49 Degrees North",
      "state_name": "washington",
      "projected_open_date": "2017-12-01T00:00:00.000Z",
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
      "created_at": "2017-08-25T23:34:10.056Z",
      "updated_at": "2017-08-25T23:34:10.056Z"
  },
  {
      "id": 2,
      "resort_name": "Afton Alps",
      "state_name": "minnesota",
      "projected_open_date": "2017-11-25T00:00:00.000Z",
      "annual_snowfall": 60,
      "trail_total": 48,
      "days_open_last_year": 135,
      "summit_elevation": 1530,
      "base_elevation": 1180,
      "beginner_trail_percent": "0.420",
      "intermediate_trail_percent": "0.420",
      "advanced_trail_percent": "0.170",
      "expert_trail_percent": "0.000",
      "states_id": 23,
      "created_at": "2017-08-25T23:34:10.056Z",
      "updated_at": "2017-08-25T23:34:10.056Z"
  }
]
```
