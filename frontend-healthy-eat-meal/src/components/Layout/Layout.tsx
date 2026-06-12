import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import styles from './Layout.module.scss'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={`${styles.mainContent} container`}>{children}</main>
      <Footer />
    </div>
  )
}
