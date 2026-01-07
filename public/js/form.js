
export async function handleSignup(event){

    event.preventDefault()

    const options = {
        method: 'POST',
        body: JSON.stringify({
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const res = await fetch('/form/signup', options)
    const data = await res.json()
    if(!res.ok){
        document.getElementById('form-msg').style.color = 'red'
        document.getElementById('form-msg').textContent = data.message
        throw new Error(`${data.name}: ${data.message}`)
    }

    console.log(data.message)
    window.location.href = '/'

    // RENDER name, cart, top banner, logout

    
}

