import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'A NEW OBJECT'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0b0b0b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 배경 컬러 블록 그리드 */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          <div style={{ flex: 1, backgroundColor: '#d4cfc9', opacity: 0.15 }} />
          <div style={{ flex: 1, backgroundColor: '#c5ccbb', opacity: 0.15 }} />
          <div style={{ flex: 1, backgroundColor: '#cbbfb5', opacity: 0.15 }} />
          <div style={{ flex: 1, backgroundColor: '#bbc6c6', opacity: 0.15 }} />
        </div>

        {/* 중앙 콘텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <p
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.1em',
              margin: 0,
              lineHeight: 1,
            }}
          >
            A NEW OBJECT
          </p>
          <p
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.2em',
              margin: 0,
              fontWeight: 400,
            }}
          >
            새로운 시각으로 바라본 식물과 화분
          </p>
        </div>

        {/* 하단 URL */}
        <p
          style={{
            position: 'absolute',
            bottom: 48,
            fontSize: 16,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.15em',
            margin: 0,
          }}
        >
          www.anewyobject.com
        </p>
      </div>
    ),
    { ...size }
  )
}
