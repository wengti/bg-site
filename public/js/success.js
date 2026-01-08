import { handleMenuDisplay } from './utils.js'
import { renderTopRow, renderCheckout } from './render.js'
import { delCartAll } from './cartService.js'



// When this page is loaded, it indicates that the order has been successful, 
// so delete all items for this user from the db
await delCartAll() 

// Functions to run upon loading
await renderTopRow()

// Then show the hint message to guide user home
renderCheckout()

// Add Event Listener
document.getElementById('hamburger').addEventListener('click', handleMenuDisplay)
document.getElementById('collapse-btn').addEventListener('click', handleMenuDisplay)




