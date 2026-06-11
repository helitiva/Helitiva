import { createRoot } from 'react-dom/client'
import './landing.css'
import Labs from './labs/Labs'

// No StrictMode: the WebGL components (aurora mesh, particle halo) cannot
// survive the dev double-mount on a canvas that already has a context.
createRoot(document.getElementById('root')!).render(<Labs />)
