import './index.css'

import RotationDisplay from './rotation-display'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RotationDisplay />
  </StrictMode>,
)
