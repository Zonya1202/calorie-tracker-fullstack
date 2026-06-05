import React from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    // Делаем flex-контейнер на весь экран, чтобы футер всегда прижимался к низу
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 16px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
