import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #B4632A 0%, #C49A3C 100%)',
          borderRadius: 32,
        }}
      >
        <span style={{ fontSize: 120 }}>🇳🇵</span>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
