'use client'

import React, { useEffect, useRef, memo } from 'react'

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: '30',
      locale: 'en',
      save_image: true,
      style: '1',
      symbol: 'CRYPTO:U2UUSD',
      theme: 'dark',
      timezone: 'Etc/UTC',
      backgroundColor: '#0F0F0F',
      gridColor: 'rgba(242, 242, 242, 0.06)',
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    })
    container.current.appendChild(script)
  }, [])

  return (
    <div
      className='tradingview-widget-container rounded-lg overflow-hidden'
      ref={container}
      style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <div
        className='tradingview-widget-container__widget'
        style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
      <div className='tradingview-widget-copyright text-xs text-white/30 p-2'>
        <a
          href='https://www.tradingview.com/symbols/U2UUSD/?exchange=CRYPTO'
          rel='noopener nofollow'
          target='_blank'
          className='text-blue-400 hover:text-blue-300'>
          U2UUSD chart
        </a>
        <span className='trademark'> by TradingView</span>
      </div>
    </div>
  )
}

export default memo(TradingViewWidget)
