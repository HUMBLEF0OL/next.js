'use client'

import type {
  FocusAndScrollRef,
  PrefetchKind,
} from '../../client/components/router-reducer/router-reducer-types'
import type { FetchServerResponseResult } from '../../client/components/router-reducer/fetch-server-response'
import type {
  FlightRouterState,
  FlightData,
} from '../../server/app-render/types'
import React from 'react'

export type ChildSegmentMap = Map<string, CacheNode>

/**
 * Cache node used in app-router / layout-router.
 */
export type CacheNode = ReadyCacheNode | LazyCacheNode

export type LazyCacheNode = {
  /**
   * When rsc is null, this is a lazily-initialized cache node.
   *
   * If the app attempts to render it, it triggers a lazy data fetch,
   * postpones the render, and schedules an update to a new tree.
   *
   * TODO: This mechanism should not be used when PPR is enabled, though it
   * currently is in some cases until we've implemented partial
   * segment fetching.
   */
  rsc: null

  // TODO: Add prefetchRsc field.
  // prefetchRsc: null

  /**
   * A pending response for the lazy data fetch. If this is not present
   * during render, it is lazily created.
   */
  lazyData: Promise<FetchServerResponseResult> | null

  head?: React.ReactNode
  /**
   * Child parallel routes.
   */
  parallelRoutes: Map<string, ChildSegmentMap>
}

export type ReadyCacheNode = {
  /**
   * When rsc is not null, it represents the RSC data for the
   * corresponding segment.
   *
   * `null` is a valid React Node but because segment data is always a
   * <LayoutRouter> component, we can use `null` to represent empty.
   *
   * TODO: For additional type safety, update this type to
   * Exclude<React.ReactNode, null>. Need to update createEmptyCacheNode to
   * accept rsc as an argument, or just inline the callers.
   */
  rsc: React.ReactNode

  // TODO: Add prefetchRsc field.
  // prefetchRsc: React.ReactNode

  /**
   * There should never be a lazy data request in this case.
   */
  lazyData: null
  head?: React.ReactNode
  parallelRoutes: Map<string, ChildSegmentMap>
}

export interface NavigateOptions {
  scroll?: boolean
}

export interface PrefetchOptions {
  kind: PrefetchKind
}

export interface AppRouterInstance {
  /**
   * Navigate to the previous history entry.
   */
  back(): void
  /**
   * Navigate to the next history entry.
   */
  forward(): void
  /**
   * Refresh the current page.
   */
  refresh(): void
  /**
   * Navigate to the provided href.
   * Pushes a new history entry.
   */
  push(href: string, options?: NavigateOptions): void
  /**
   * Navigate to the provided href.
   * Replaces the current history entry.
   */
  replace(href: string, options?: NavigateOptions): void
  /**
   * Prefetch the provided href.
   */
  prefetch(href: string, options?: PrefetchOptions): void
}

export const AppRouterContext = React.createContext<AppRouterInstance | null>(
  null
)
export const LayoutRouterContext = React.createContext<{
  childNodes: CacheNode['parallelRoutes']
  tree: FlightRouterState
  url: string
}>(null as any)
export const GlobalLayoutRouterContext = React.createContext<{
  buildId: string
  tree: FlightRouterState
  changeByServerResponse: (
    previousTree: FlightRouterState,
    flightData: FlightData,
    overrideCanonicalUrl: URL | undefined
  ) => void
  focusAndScrollRef: FocusAndScrollRef
  nextUrl: string | null
}>(null as any)

export const TemplateContext = React.createContext<React.ReactNode>(null as any)

if (process.env.NODE_ENV !== 'production') {
  AppRouterContext.displayName = 'AppRouterContext'
  LayoutRouterContext.displayName = 'LayoutRouterContext'
  GlobalLayoutRouterContext.displayName = 'GlobalLayoutRouterContext'
  TemplateContext.displayName = 'TemplateContext'
}
