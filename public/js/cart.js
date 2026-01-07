import { handleMenuDisplay } from './utils.js'
import { renderTopRow, renderCart } from './render.js'

// Get element control


// Functions to run upon loading

await renderTopRow()
await renderCart()

// Add Event Listener
document.getElementById('hamburger').addEventListener('click', handleMenuDisplay)
document.getElementById('collapse-btn').addEventListener('click', handleMenuDisplay)

// Functions


