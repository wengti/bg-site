import { renderItems, renderGenre, handleSearch, renderTopRow } from './render.js'

// -----------------------------
// Functions to run upon loading
// -----------------------------

await renderTopRow() 
await renderItems() 
await renderGenre()


// Add Event Listener
document.getElementById('genre-select').addEventListener('change', handleSearch)
document.getElementById('search-box').addEventListener('input', handleSearch)






