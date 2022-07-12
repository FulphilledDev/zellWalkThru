/* eslint-env browser */

const { response } = require("express")

// main.js
const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vadar',
            quote: 'I find your lack of faith disturbing.'
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            window.location.reload(true)
        })
})

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vadar'
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            if (response === 'No quote to delete') {
                messageDiv.textContent = 'No Darth Vadar quote to delete'
            } else {
                window.location.reload(true)
            }
        })
        .catch(console.error)
})

// ASYNC 'delete'

// async function deleteQuote(){
//     const sName = this.parentNode.childNodes[1].innerText
//     const sQuote = this.parentNode.childNodes[2].innerText
//     try{
//         const response = await fetch ('deleteQuote', {
//             method: 'delete',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'name': sName,
//                 'quote': sQuote
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//
//     }catch(err){
//         console.log(err)
//     }
// }