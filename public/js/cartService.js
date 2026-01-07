export async function handleAddToCart(event){

    const options = {
        method: 'POST',
        body: JSON.stringify({
            itemId: event.target.dataset.itemId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // 
    const res = await fetch('/cart/add', options)
    const data = await res.json()
    if(!res.ok){
        throw new Error(`${data.name}: ${data.message}`)
    }

    const {message, curQuantity} = data
    console.log(message)

    // Update stock count 
    const quantityEl = document.getElementById(event.target.id).parentElement.nextElementSibling.nextElementSibling
    quantityEl.textContent = `Stock: ${curQuantity}`

    // Update cart count
    document.getElementById('cart-count').textContent = await getCartCount()

}


export async function getCartCount(){

    const res = await fetch('/cart/count')
    const data = await res.json()
    if(!res.ok){
        throw new Error(`${data.name}: ${data.message}`)
    }

    return data.totalOrder

}