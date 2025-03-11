
const btnEncurtar = document.getElementById('btn-encurtar');

btnEncurtar.addEventListener('click', (e) => {
     function getUrl() {
        const inputUrl = document.getElementById('input-url').value;
        const inputName = document.getElementById('input-name').value;

         fetch('http://localhost:3000/encurtar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputName, inputUrl })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.erro) {
                alert(data.erro);
            }else {
                document.getElementById("resultado").innerHTML =
                `link encurtado: <a href="${data.linkCurto}" target="_blank">${data.linkCurto}</a>`;
            }
        })
        .catch(error => console.error("Error", error))
    }

    getUrl()
})