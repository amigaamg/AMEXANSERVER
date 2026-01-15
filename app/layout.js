import './globals.css'

export const metadata = {
  title: 'Amexan Healthcare',
  description: 'Complete Healthcare Ecosystem',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}