import { gql } from '@apollo/client'
import { TagTargetType } from '../../types'

// Reusable fragments
export const FRAGMENT_CLIMB_TAG = gql`
 fragment ClimbTagFields on ClimbTag {
    id
    mediaUuid
    mediaUrl
    destType
    climb {
      id
      name
    }
  }`

export const FRAGMENT_AREA_TAG = gql`
 fragment AreaTagFields on AreaTag {
    id
    mediaUuid
    mediaUrl
    destType
    area {
        uuid
        areaName
        metadata {
            areaId
            leaf
        }
    }
  }`

export interface SetTagType {
  mediaUuid: string
  mediaUrl: string
  destinationId: string
  destType: TagTargetType
}
/**
 * Create a media <--> climb (or area) association
 */
export const MUTATION_ADD_CLIMB_TAG_TO_MEDIA = gql`
  ${FRAGMENT_CLIMB_TAG}
  ${FRAGMENT_AREA_TAG}
  mutation tagPhotoWithClimb($mediaUuid: ID!, $mediaUrl: String!, $destinationId: ID!, $destType: Int!) {
    setTag(
      input: {
        mediaUuid: $mediaUuid,
        mediaUrl: $mediaUrl,
        mediaType: 0,
        destinationId: $destinationId,
        destType: $destType
      }
    ) {
        ... ClimbTagFields
        ... AreaTagFields
    }
  }`

export const MUTATION_REMOVE_MEDIA_TAG = gql`
  mutation removeTag($tagId: ID!) {
    removeTag(tagId: $tagId) {
      id
      mediaUuid
      destinationId
      destType
    }
  }`

export const QUERY_TAGS_BY_MEDIA_ID = gql`
  ${FRAGMENT_CLIMB_TAG}
  ${FRAGMENT_AREA_TAG}
  query getTagsByMediaIdList($uuidList: [ID!]) {
    getTagsByMediaIdList(uuidList: $uuidList) {
      ... ClimbTagFields
      ... AreaTagFields
    }
  }
`

export const QUERY_RECENT_MEDIA = gql`
  query ($userLimit: Int) {
    getRecentTags(userLimit: $userLimit) {
      authorUuid
      tagList {
        destType
        mediaUrl
        mediaType
        destination
      }
    }
  }
`
