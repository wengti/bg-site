import { renderItems, renderGenre, handleSearch, renderTopRow } from './render.js'

// Functions to run upon loading

// Also include adding event listener to add to cart here
await renderItems() 

// Also include adding event listener to elements that are in the top row
// IMPORTANT! 
// renderTopRow() involves enabling or disabling addToCartBtn
// So it must be executed after renderItems()
await renderTopRow() 

await renderGenre()


// Add Event Listener
document.getElementById('genre-select').addEventListener('change', handleSearch)
document.getElementById('search-box').addEventListener('input', handleSearch)





