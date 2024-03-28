// URL de base pour l'api
const baseUrl = "http://localhost:5678/api/"

let token = window.localStorage.getItem("userToken");
const formulaireLogin = document.querySelector(".formulaire-login");
const errorMessageElement = document.getElementById("error-message");

// Quand le formulaire est submit
formulaireLogin.addEventListener("submit", async function (event){
    event.preventDefault();

    // Récupérer les informations via le formulaire
    const user = {
        email: event.target.querySelector("[name=email").value,
        password: event.target.querySelector("[name=password").value,
    };

    const chargeUtile = JSON.stringify(user);

    // Envoie à l'api des données du fomulaire
    try {
        const response = await fetch(`${baseUrl}users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data;

        // Réception des réponses, 200 = connecté
        if (response.status === 200) {
            data = await response.json();
            console.log("Connected", data);

            localStorage.setItem("userToken", data.token);

            window.location.href = "index.html";
        } else if (response.status === 401) {
            showError("Non autorisé");
        } else if (response.status === 404) {
            showError("Non trouvé");
        } else {
            showError(`Code de statut non traité : ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur lors de la requête fetch:', error);
        showError("Identifiants invalides.");
    }
});

// Montrer les erreurs
function showError(message) 
{
    errorMessageElement.innerText = message;
    errorMessageElement.style.color = "red";
}

//Changement du bouton login 

if (token !== null) 
{

    // Changer le bouton log in en log out, et effacer le token si log out
    const loginBtn = document.querySelector('.login-button');
    loginBtn.innerHTML = "logout"

    loginBtn.addEventListener("click", function() {
        localStorage.removeItem('userToken');
    });

    //Changer le formulaire
    const sectionLogin = document.querySelector('.login');
    sectionLogin.innerHTML = "<p>Vous êtes déjà connecté</p>"
}
