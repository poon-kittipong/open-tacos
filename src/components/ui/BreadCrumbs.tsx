import React from 'react'
import Link from 'next/link'
import clx from 'classnames'

import { sanitizeName } from '../../js/utils'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { TypesenseAreaType } from '../../js/types'
/**
 * Turn each element of `pathTokens` to a gatsby-link.
 *
 * Example:
 * ```
 * pathTokens = ["USA", "Nevada", "Area 51", "Ladder1"]
 * isClimbPage = true
 *   => USA / Nevada / Area 51
 * isClimbPage = false
 *   => USA / Nevada / Area 51 / Ladder1
 * ```
 * @param {{pathTokens:string[], isClimbPage:boolean}} Props component props
 */
interface BreakCrumbsProps {
  pathTokens: string[]
  ancestors: string[]
  isClimbPage?: boolean
}

function BreadCrumbs ({ pathTokens, ancestors, isClimbPage = false }: BreakCrumbsProps): JSX.Element {
  return (
    <div aria-label='area-breadcrumbs' className='flex-wrap flex gap-2 text-sm items-center'>
      <MapPinIcon className='text-ob-primary w-5 h-5' />

      <Link href='/a'>
        <a className='hover:underline hover:text-base-content text-base-300'>Home</a>
      </Link>

      {pathTokens.map((place, index, array) => {
        const isLastElement = array.length - 1 === index
        const path = ancestors[index]
        const url = `/areas/${path}`
        const climbPageLastUrl = `/crag/${path}`

        return (
          <React.Fragment key={`bread-${index}`}>
            <span className='text-xs'>/</span>
            <span className='text-base-300'>
              {(isLastElement && !isClimbPage && <span className='text-ob-primary'>{sanitizeName(place)}</span>) ||
            (
              <Link href={isLastElement && isClimbPage ? climbPageLastUrl : url}>
                <a className='hover:underline hover:text-base-content whitespace-nowrap'>
                  {sanitizeName(place)}
                </a>
              </Link>
            )}
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}
export default BreadCrumbs

export interface MiniBreadCrumbsProps {
  pathTokens: string[]
  skipLast?: boolean
}

const SEPARATOR = ' / '

/**
 * Smaller breadcrumbs
 * Nov 11, 2022: This component used to shorten (remove)
 * some items in the middle of the list.  It's buggy when
 * there are fewer than 4 items.
 * @param MiniBreadCrumbsProps
 */
export const MiniCrumbs = ({ pathTokens, skipLast = false }: MiniBreadCrumbsProps): JSX.Element => {
  const subArrayCount = skipLast ? pathTokens.length - 1 : undefined
  return (
    <div
      aria-label='area-minicrumbs'
      className='text-xs text-base-300'
    >{pathTokens.slice(0, subArrayCount).map(sanitizeName).join(SEPARATOR)}
    </div>
  )
}

type TextOnlyCrumbsProps = Pick<TypesenseAreaType, 'pathTokens' | 'highlightIndices'>

/**
 * MiniCrumbs was buggy at the time so I created another one from
 * scratch.  We should combine the two.
 */
export const TextOnlyCrumbs = ({ pathTokens, highlightIndices }: TextOnlyCrumbsProps): JSX.Element => {
  const shouldHighlight = (index: number): boolean => highlightIndices.some(element => element === index) ?? false
  return (
    <div
      aria-label='area-minicrumbs'
      className='text-sm flex flex-wrap'
    >
      {pathTokens.map((path, index) => (
        <React.Fragment key={`${path}${index}`}>
          <Item highlight={shouldHighlight(index)} path={path} current={index} length={pathTokens.length} />
        </React.Fragment>
      ))}
    </div>
  )
}

interface ItemProps {
  path: string
  highlight: boolean
  current: number
  length: number
}
const Item = ({ path, highlight, current, length }: ItemProps): JSX.Element => (

  <span className={clx('flex items-center', highlight ? 'font-bold' : 'text-base-300')}>
    {sanitizeName(path)}
    {current < length - 1 ? <span className='text-base-300 px-1'>{SEPARATOR}</span> : null}
  </span>)
