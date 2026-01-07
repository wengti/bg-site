import {handleMenuDisplay} from './utils.js'
import { renderItems, renderGenre, handleSearch} from './render.js'


// Functions to run upon loading
await renderItems()
await renderGenre()

// Add Event Listener
document.getElementById('hamburger').addEventListener('click', handleMenuDisplay)
document.getElementById('collapse-btn').addEventListener('click', handleMenuDisplay)
document.getElementById('genre-select').addEventListener('change', handleSearch)
document.getElementById('search-box').addEventListener('input', handleSearch)



