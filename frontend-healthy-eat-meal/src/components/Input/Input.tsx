import React from 'react'
import styles from './Input.module.scss'

// Описываем пропсы, расширяя стандартные атрибуты тега input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className={styles.input} {...props} />
    </div>
  )
}
