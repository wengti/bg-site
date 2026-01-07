
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
    
}


export async function handleLogin(event){
    event.preventDefault()
    
    const username = document.getElementById('username').value.trim()
    const password = document.getElementById('password').value

    const options = {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = await fetch('/form/login', options)
    const data = await res.json()
    if(!res.ok){
        document.getElementById('form-msg').style.color = 'red'
        document.getElementById('form-msg').textContent = data.message
        throw new Error(`${data.name}: ${data.message}`)
    }

    console.log(data.message)
    window.location.href='/'
}


export async function handleLogout(){

    const options = {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = await fetch('/form/logout', options)
    const data = await res.json()
    if(!res.ok){
        throw new Error(`${data.name}: ${data.message}`)
    }

    console.log(data.message)
    window.location.href = '/'

}

