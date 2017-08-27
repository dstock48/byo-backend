# Winter Resort API [![CircleCI](https://circleci.com/gh/dstock48/byo-backend.svg?style=svg)](https://circleci.com/gh/dstock48/byo-backend)
---
The Winter Resort API provides multiple endpoints to access data related to all major winter resorts in the United States. This API follows [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) API guidelines and is secured using [JSON Web Tokens](https://jwt.io/) for user Authentication and Authorization.

Version 1 of the API returns all data in JSON format and includes access to `Resorts` and `Trails` data containing the following information:

| States               | Resorts                      | Trails           |
| :------------------: | :--------------------------: | :--------------: |
| State Name           | Resort Name                  | Trail Name       |
| State Abbreviation   | State Name                   | Resort Name      |
|                      | Projected Opening Date       | Trail Difficulty |
|                      | Annual Snowfall              | Trail Length     |
|                      | Trail Total                  | Open Status      |
|                      | Days Open Last year          |                  |
|                      | Summit & Base Elevation      |                  |
|                      | Trail Difficulty Percentages |                  |

## Registration
Visit our [registration page](https://winter-resort-api.herokuapp.com/) to generate a new access token for the Winter Resort API. All access tokens will expire 1 year after the token has been generated, after which another token must be generated.
