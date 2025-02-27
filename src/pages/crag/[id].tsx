import { GetStaticProps, NextPage } from 'next'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, MediaBaseTag, ChangesetType } from '../../js/types'
import CragLayout from '../../components/crag/cragLayout'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import AreaMap from '../../components/area/areaMap'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { PageMeta } from '../areas/[id]'

interface CragProps {
  area: AreaType
  history: ChangesetType[]
  mediaListWithUsernames: MediaBaseTag[]
}

const CragPage: NextPage<CragProps> = (props) => {
  const router = useRouter()
  return (
    <>
      {!router.isFallback && <PageMeta {...props} />}
      <Layout contentContainerClass='content-default' showFilterBar={false}>
        {router.isFallback
          ? (
            <div className='px-4 max-w-screen-md'>
              <div>Loading...</div>
            </div>
            )
          : <Body {...props} />}
      </Layout>
    </>
  )
}
export default CragPage

const Body = ({ area, mediaListWithUsernames }: CragProps): JSX.Element => {
  const { areaName, aggregate, climbs, metadata, content, ancestors, pathTokens } = area

  return (
    <>
      <div className='p-6 flex-1'>
        <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
        <div className='mt-6' />
        <CragLayout
          title={areaName}
          description={content.description}
          latitude={metadata.lng}
          longitude={metadata.lat}
          climbs={climbs}
          areaMeta={metadata}
          ancestors={ancestors}
          pathTokens={pathTokens}
          aggregate={aggregate.byGrade}
          media={mediaListWithUsernames}
        />
      </div>

      <div id='#map' className='w-full mt-16' style={{ height: '30rem' }}>
        <AreaMap
          focused={null}
          selected={area.id}
          subAreas={[{ ...area }]}
          area={area}
        />
      </div>
    </>
  )
}

export async function getStaticPaths (): Promise<any> {
  // Temporarily disable pre-rendering
  // https://github.com/OpenBeta/openbeta-graphql/issues/26
  // const rs = await graphqlClient.query<AreaResponseType>({
  //   query: gql`query EdgeAreasQuery($filter: Filter) {
  //   areas(filter: $filter) {
  //     area_name
  //     metadata {
  //       area_id
  //     }
  //   }
  // }`,
  //   variables: {
  //     filter: { leaf_status: { isLeaf: true } }
  //   }
  // })

  // const paths = rs.data.areas.map((area: AreaType) => ({
  //   params: { id: area.metadata.area_id }
  // }))

  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CragProps, {id: string}> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }
  const query = gql`query AreaByID($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      media {
        mediaUrl
        mediaUuid
        destination
        destType
      }
      totalClimbs
      aggregate {
        byGrade {
          count
          label
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
      metadata {
        areaId
        lat
        lng 
        left_right_index
      }
      pathTokens  
      ancestors
      climbs {
        id
        name
        fa
        yds
        safety
        type {
          trad
          tr
          sport
          mixed
          bouldering
          alpine
          aid
        }
        metadata {
          climbId
        }
        content {
          description
        }
      }
      content {
        description 
      } 
    }
  }`

  const rs = await graphqlClient.query<{area: AreaType}>({
    query,
    variables: {
      uuid: params.id
    }
  })

  if (rs.data === null) {
    return {
      notFound: true
    }
  }

  let mediaListWithUsernames = rs.data.area.media
  try {
    mediaListWithUsernames = await enhanceMediaListWithUsernames(rs.data.area.media)
  } catch (e) {
    console.log('Error when trying to add username to image data', e)
  }

  // Pass post data to the page via props
  return {
    props: {
      area: rs.data.area,
      history: [],
      mediaListWithUsernames
    }
  }
}
