# Winter Resort API [![CircleCI](https://circleci.com/gh/dstock48/byo-backend.svg?style=svg)](https://circleci.com/gh/dstock48/byo-backend)
---
The Winter Resort API provides multiple endpoints to access data related to all major winter resorts in the United States. This API follows [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) API guidelines and is secured using [JSON Web Tokens](https://jwt.io/) for user Authentication and Authorization.

Version 1 of the API returns all data in JSON format and includes access to `states`, `Resorts` and `Trails` data containing the following information:

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

![winter-resort-api-token-request](https://user-images.githubusercontent.com/20492875/30607377-f93f8a98-9d31-11e7-9d63-6443f17f7ed4.png)


## Endpoints

#### States Endpoints

- **[`GET` states](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/states/GET_states.md)**
- **[`GET` states/:state_abbreviation](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/states/GET_states_state_abbreviation.md)**
- **[`GET` states/:id/resorts](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/states/GET_states_id_resorts.md)**
- **[`POST` states](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/states/POST_states.md)**
- **[`PATCH` states/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/states/PATCH_states_id.md)**
- **[`DELETE` states/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/states/DELETE_states_id.md)**

#### Resorts Endpoints

- **[`GET` resorts](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/resorts/GET_resorts.md)**
- **[`GET` resorts/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/resorts/GET_resorts_id.md)**
- **[`GET` resorts/:id/trails](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/resorts/GET_resorts_id_trails.md)**
- **[`POST` resorts](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/resorts/POST_resorts.md)**
- **[`PATCH` resorts/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/resorts/PATCH_resorts_id.md)**
- **[`DELETE` resorts/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/resorts/DELETE_resorts_id.md)**

#### Trails Endpoints

- **[`GET` trails](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/trails/GET_trails.md)**
- **[`GET` trails/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/trails/GET_trails_id.md)**
- **[`POST` trails](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/trails/POST_trails.md)**
- **[`PATCH` trails/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/trails/PATCH_trails_id.md)**
- **[`DELETE` trails/:id](https://github.com/dstock48/byo-backend/blob/documentation/documentation/endpoints/trails/DELETE_trails_id.md)**
