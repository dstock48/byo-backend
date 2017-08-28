# Resorts Endpoint

```
PATCH resorts/:id
```

## Description

Updates one resort in the database. This action is limited to admin access.

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

To update a resort you must pass in the ID of the resort to patch.
  - **id** — Database ID number of the desired resort.

***

## Errors

- **403 Forbidden** - The JSON Web Token was either missing from the request or was invalid.
- **404 Not Found** — 'The resort with ID# `id` was not found and could not be updated'
- **422 Unprocessable Entity** — 'You cannot change the ID.' - (if `id` is passed in the request body)

***

## Return format

An array of one object (the updated resort) with the following keys and values:

- **id** — ID number for the updated record in the database.
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
https://winter-resort-api.herokuapp.com/api/v1/resorts/129
```

**Return**

`status: 200`

```json
[
  {
    "id": 129,
    "resort_name": "Updated Resort Name",
    "state_name": "vermont",
    "projected_open_date": "2017-11-24T00:00:00.000Z",
    "annual_snowfall": 377,
    "trail_total": 78,
    "days_open_last_year": 155,
    "summit_elevation": 3968,
    "base_elevation": 1815,
    "beginner_trail_percent": "0.200",
    "intermediate_trail_percent": "0.400",
    "advanced_trail_percent": "0.400",
    "expert_trail_percent": "0.000",
    "states_id": 45,
    "created_at": "2017-08-25T23:34:10.056Z",
    "updated_at": "2017-08-25T23:34:10.056Z"
  }
]
```
