const formulaireLogin = document.querySelector(".formulaire-login");
const errorMessageElement = document.getElementById("error-message");

formulaireLogin.addEventListener("submit", async function (event){
    event.preventDefault();

    const user = {
        email: event.target.querySelector("[name=email").value,
        password: event.target.querySelector("[name=password").value,
    };

    const chargeUtile = JSON.stringify(user);

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data;

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

function showError(message) {
    errorMessageElement.innerText = message;
    errorMessageElement.style.color = "red";
}
