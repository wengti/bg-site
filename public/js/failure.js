import { handleMenuDisplay } from './utils.js'
import { renderTopRow, renderFailedCheckout } from './render.js'



// Functions to run upon loading
await renderTopRow()

// Then show the hint message to guide user home
renderFailedCheckout()

// Add Event Listener
document.getElementById('hamburger').addEventListener('click', handleMenuDisplay)
document.getElementById('collapse-btn').addEventListener('click', handleMenuDisplay)




