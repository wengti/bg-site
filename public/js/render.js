import { handleLogout } from './form.js'
import { handleAddToCart, getCartCount } from './cartService.js'
import { handleMenuDisplay, directToLogin } from './utils.js'


export async function renderItems(data = []) {


    let htmlStr = ''

    // If provided data is '', indicating no search result is relevant
    // Otherwise proceed to show the result
    if (data === '') {
        document.querySelector('.item-row').style.gap = 0
        htmlStr += `
            <div class='na-card'>
                <div class='mag-glass-container'><i class="fa-solid fa-magnifying-glass"></i></div>
                <p>No relevant result...<p>
            </div>
        `
    } else {
        document.querySelector('.item-row').style.gap = '1em'

        // If data.length === 0, it means this is for initial loading
        if (data.length === 0) {
            const res = await fetch('/api')
            data = await res.json()
            if (!res.ok) {
                throw new Error(`${data.name}: ${data.message}`)
            }
        }

        // Render the results
        for (let { id, title, designer, price, genre, quantity, img } of data) {
            htmlStr += `
                <div class='item-card'>
                    <div class='item-img-container'><img src='${img}'/></div>
                    <div class='item-detail-container'>
                        <p class='title'>${title}</p>
                        <p class='designer'>${designer}</p>
                        <p class='price'>RM ${price.toFixed(2)}</p>
                        <button class='cart-btn' id='btn-${id}' data-item-id = '${id}'>Add to Cart</button>
                    </div>
                    <p class='genre'>${genre}</p>
                    <p class='quantity'>Stock: ${quantity}</p>
                </div>
            `
        }

    }

    //Render the items
    document.querySelector('.item-row').innerHTML = htmlStr

    // Direct the user to login page
    document.querySelectorAll('.cart-btn').forEach(elem => {
        elem.addEventListener('click', directToLogin)
    })
}

export async function renderGenre() {
    let htmlStr = `<option value='Show All'>Show All</option>`

    const res = await fetch('/api/genre')
    const data = await res.json()
    if (!res.ok) {
        throw new Error(`${data.name}: ${data.message}`)
    }

    data.forEach(({ genre }) => {
        htmlStr += `<option value='${genre}'>${genre}</option>`
    })

    document.getElementById('genre-select').innerHTML = htmlStr

}


export async function handleSearch() {
    let data = []
    // Get results from db based on search text
    // If the search text are deleted, default to showing everything from database
    const searchValue = document.getElementById('search-box').value
    if (searchValue !== '') {
        const res = await fetch(`/api?search=${searchValue}`)
        data = await res.json()
        if (!res.ok) {
            throw new Error(`${data.name}: ${data.message}`)
        }
    } else if (searchValue === '') {
        const res = await fetch(`/api`)
        data = await res.json()
        if (!res.ok) {
            throw new Error(`${data.name}: ${data.message}`)
        }
    }

    // Further narrow the result based on the genre filter
    const curGenre = document.getElementById('genre-select').value
    if (curGenre !== 'Show All') {
        data = data.filter(({ genre }) => {
            return genre === curGenre
        })
    }

    // If this leads to a null result, set to '', so renderItems will render a no result hint
    if (data.length === 0) {
        data = ''
    }

    await renderItems(data)
}

export async function renderTopRow() {

    const res = await fetch('/user/me')
    const data = await res.json()
    if (!res.ok) {
        throw new Error(`${data.name}: ${data.message}`)
    }

    // Only do something if the return data indicates that it has been logged in
    const { isLoggedIn, name } = data
    if (isLoggedIn) {
        // Top row - hide and unhide elements
        document.getElementById('user').textContent = name
        document.getElementById('cart-container').style.display = 'block'
        document.getElementById('login-container').style.display = 'none'
        document.getElementById('signup-container').style.display = 'none'
        document.getElementById('logout-btn-container').style.display = 'block'

        //Enable the add to cart actions if the user is logged in
        document.querySelectorAll('.cart-btn').forEach(elem => {
            elem.removeEventListener('click', directToLogin)
            elem.addEventListener('click', handleAddToCart)
        })

        // Update cart count
        document.getElementById('cart-count').textContent = await getCartCount()
    }

    document.getElementById('logout-btn').addEventListener('click', handleLogout)
    document.getElementById('hamburger').addEventListener('click', handleMenuDisplay)
    document.getElementById('collapse-btn').addEventListener('click', handleMenuDisplay)
}