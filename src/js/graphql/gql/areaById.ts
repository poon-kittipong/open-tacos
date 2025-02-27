import { gql } from '@apollo/client'

import { FRAGMENT_CHANGE_HISTORY } from './contribs'

export const QUERY_AREA_BY_ID = gql`
  ${FRAGMENT_CHANGE_HISTORY}
  query ($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      shortCode
      ancestors
      pathTokens
      metadata {
        lat
        lng 
        leaf
        bbox
        areaId
      } 
      content {
        description 
      } 
      aggregate {
          byGradeBand {
            intermediate
            expert
            beginner
            advanced
          }
          byDiscipline {
            sport {
              total
            }
            trad {
              total
            }
            boulder {
              total
            }
            aid {
              total
            }
          }
      }

      totalClimbs

      children {
        id
        uuid
        areaName
        aggregate {
          byGradeBand {
            intermediate
            expert
            beginner
            advanced
          }
          byDiscipline {
            sport {
              total
            }
            trad {
              total
            }
            boulder {
              total
            }
          }
        }
        totalClimbs
        content {
          description 
        } 
        metadata {
          areaId
          leaf
          lat
          lng
        }
      }

      media {
        mediaUrl
        mediaUuid
        destination
        destType
      }
    }
    getAreaHistory(filter: {areaId: $uuid}) {
       ...ChangeHistoryFields
    }
  }
  `
