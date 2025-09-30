'use client'

import { PropsWithChildren } from 'react'
import { Web3Provider } from './Web3'
import { DataProvider } from './Data'
import { NotificationProvider } from './Notifications'
import { NetworkGuard } from '@/components/NetworkGuard'

interface Props extends PropsWithChildren {
  cookies: string | null
}

export function Providers(props: Props) {
  return (
    <>
      <Web3Provider cookies={props.cookies}>
        <DataProvider>
          <NotificationProvider>
            <NetworkGuard>{props.children}</NetworkGuard>
          </NotificationProvider>
        </DataProvider>
      </Web3Provider>
    </>
  )
}
