# Resorts Endpoint

```
POST resorts
```

## Description

Creates one new resort in the database. This action is limited to admin access.

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

To create a new resort, there are 13 required parameters that must be passed in the request body:
  - **resort_name** — The name of the new resort as a `string`.
  - **state_name** — The name of the state in which the resort is located as a `string`.
  - **projected_open_date** — The estimated opening date for the new resort as a `string` in MM/DD/YYYY format.
  - **annual_snowfall** — The average annual snowfall in inches as a `number`.
  - **trail_total** — The total amount of trails at the new resort as a `number`.
  - **days_open_last_year** — The total days open last year as a `number`.
  - **summit_elevation** — The summit elevation of the new resort mountain as a `number`.
  - **base_elevation** — The base elevation of the new resort mountain as a `number`.
  - **beginner_trail_percent** — The percentage of beginner trails at the new resort as a `decimal`.
  - **intermediate_trail_percent** — The percentage of intermediate trails at the new resort as a `decimal`.
  - **advanced_trail_percent** — The percentage of advanced trails at the new resort as a `decimal`.
  - **expert_trail_percent** — The percentage of expert trails at the new resort as a `decimal`.
  - **states_id** — A numeric value corresponding to an existing state ID.

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **422 Unprocessable Entity** — 'Missing required parameter: `requiredParameter`'

***

## Return format

An array of one object (the new resort) with the following keys and values:

- **id** — Auto-incrementing ID number for the new record in the database.
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
https://winter-resort-api.herokuapp.com/api/v1/resorts
```

**Return**

`status: 201`

```json
[
  {
    "id": 333,
    "resort_name": "New Resort Name",
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
]
```
