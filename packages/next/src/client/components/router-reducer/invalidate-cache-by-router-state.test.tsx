import React from 'react'
import { invalidateCacheByRouterState } from './invalidate-cache-by-router-state'
import type { CacheNode } from '../../../shared/lib/app-router-context.shared-runtime'
import type { FlightRouterState } from '../../../server/app-render/types'

describe('invalidateCacheByRouterState', () => {
  it('should invalidate the cache by router state', () => {
    const cache: CacheNode = {
      lazyData: null,
      rsc: null,
      parallelRoutes: new Map(),
    }
    const existingCache: CacheNode = {
      lazyData: null,
      rsc: <>Root layout</>,
      parallelRoutes: new Map([
        [
          'children',
          new Map([
            [
              'linking',
              {
                lazyData: null,
                rsc: <>Linking</>,
                parallelRoutes: new Map([
                  [
                    'children',
                    new Map([
                      [
                        '',
                        {
                          lazyData: null,
                          rsc: <>Page</>,
                          parallelRoutes: new Map(),
                        },
                      ],
                    ]),
                  ],
                ]),
              },
            ],
          ]),
        ],
      ]),
    }

    const routerState: FlightRouterState = [
      '',
      {
        children: [
          'linking',
          {
            children: [
              'about',
              {
                children: ['', {}],
              },
            ],
          },
        ],
      },
      null,
      null,
      true,
    ]

    invalidateCacheByRouterState(cache, existingCache, routerState)

    const expectedCache: CacheNode = {
      lazyData: null,
      rsc: null,
      parallelRoutes: new Map([['children', new Map()]]),
    }

    expect(cache).toMatchObject(expectedCache)
  })
})
