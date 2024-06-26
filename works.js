'use strict';
// URL de base pour l'api
const baseUrl = "http://localhost:5678/api/"

// Récupération données local storage
let token = window.localStorage.getItem("userToken");
let categories = window.localStorage.getItem("categories");

// Récupération dans le DOM
const modalEdit = document.querySelector("#modal-edit");
const divWorksModal = document.querySelector(".gallery-modal");
const formAddProjectDiv = document.querySelector(".form-add-project");
const initialState = formAddProjectDiv.innerHTML;
const addButon = document.querySelector(".add-work");
const divButtonsFilter = document.querySelector(".button-filter");
const divWorks = document.querySelector(".gallery");

// Génération des images pour la modal
function generateWorksModal(works) {
    divWorksModal.innerHTML = "";
    divWorksModal.style.display = "flex";
    addButon.style.display = "block";

    const iconClose = document.createElement("i");
    iconClose.classList.add("fas", "fa-xmark", "close-modal");
    iconClose.addEventListener("click", function() {
        modalEdit.style.visibility = "hidden";
        document.body.classList.remove('modal-open');
    });

    const titleGallery = document.createElement("h3");
    titleGallery.innerText = "Gallerie Photo";

    divWorksModal.appendChild(titleGallery);
    divWorksModal.appendChild(iconClose);

    const worksContainerModal = document.createElement("div");
    worksContainerModal.classList.add("works-container");

    divWorksModal.appendChild(worksContainerModal);

    for (let i = 0; i < works.length; i++) {
        const figureModal = works[i];

        const workElementModal = document.createElement("div");
        workElementModal.dataset.id = works[i].id;

        const imageElementModal = document.createElement("img");
        imageElementModal.src = figureModal.imageUrl;

        const deleteIcon = document.createElement("button");
        deleteIcon.type = "button";
        deleteIcon.classList.add("fas", "fa-trash-can", "delete-icon");
        deleteIcon.addEventListener("click", function(event) {
            event.preventDefault();
            deleteWork(works[i].id);
        });

        worksContainerModal.appendChild(workElementModal);
        workElementModal.appendChild(imageElementModal);
        workElementModal.appendChild(deleteIcon);
    }
}


// Génération des images pour la page normale du site web
function generateWorks(works)
{

    for (let i = 0; i < works.length; i++)
    {
        const figure = works[i];

        // Balise pour chaque travail
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const captionElement = document.createElement("figcaption");
        captionElement.innerText = figure.title

        divWorks.appendChild(workElement); // DivWorks DOM ligne 15
        workElement.appendChild(imageElement);
        workElement.appendChild(captionElement)
    }
}

function generateButtonCategories(categories) 
{

    const buttonFilterAll = document.createElement("button");
    buttonFilterAll.classList.add("filter-all");
    buttonFilterAll.innerText = "Tous";

    divButtonsFilter.appendChild(buttonFilterAll);

    for(let i = 0; i < categories.length; i++) 
    {
        const name = categories[i].name.split(' ')[0]; //Ne garder que le premier mots

        const button = document.createElement("button");
        button.dataset.id = categories[i].id;
        button.classList.add(`filter-${name}`)
        button.innerText = categories[i].name;

        divButtonsFilter.appendChild(button);
    }
}

function checkFormData(title, category) 
{
    if (!title)
    {
        return "Le champ 'Titre' est manquant.";
    } 
    else if (!category)
    {
        return "Le champ 'Catégorie' est manquant.";
    }
    else
    {
        return true;
    }
}

function showError(error) // Function pour envoyer les erreurs si le formulaire n'est pas complet
{
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.innerText = error;
    errorMessageElement.style.color = "red";
}

// Envoie du formulaire à l'API
function submitForm() 
{
    const file = document.querySelector('#picture').files[0];
    const title = document.querySelector('#title').value;
    const category = document.querySelector('#category').value;
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.innerHTML = "";

    checkFormData(title, category) // Test si les champs ne sont pas vides

    const formDataIsValid = checkFormData(title, category);  // Si FALSE, pas d'appel API de fait.
    if (formDataIsValid === true) { // true = champs remplies, le formulaire envoyé
        let formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("category", category);


        fetch(`${baseUrl}works`, {
            method: "POST",
            headers: {'Authorization': `Bearer ${token}`},
            body : formData
        }).then(response => {
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 400){
                throw new Error ("400 - Requête incorrecte");
            } else if (response.status === 401){
                throw new Error ("401 - Non authorisé");
            } else {
                throw new Error ("Erreur innatendu");
            }
        }).then(data => {
            console.log(data);
            document.body.classList.remove('modal-open');
            modalEdit.style.visibility = "hidden";
            divWorks.innerHTML = "";
            updateGallery();
        });
        } else {
            showError(formDataIsValid);
        }
}

// Suppression d'une image
function deleteWork(idWork) {
    fetch(`${baseUrl}works/${idWork}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        console.log('Élément supprimé avec succès.');

        return fetch(`${baseUrl}works`);
    })
    .then(response => response.json())
    .then(updatedWorks => {
        window.localStorage.setItem("works", JSON.stringify(updatedWorks));
        divWorks.innerHTML = "";
        updateGalleryModal();
        updateGallery();
    })
    .catch(error => {
        console.error('Erreur lors de la suppression de l\'élément:', error);
    });
}

// Mise à jour des images
async function updateGallery() {

    const reponse = await fetch(`${baseUrl}works`);
    const works = await reponse.json();

    generateWorks(works);
}

// Mise à jour des images
async function updateGalleryModal() {

    const reponse = await fetch(`${baseUrl}works`);
    const works = await reponse.json();

    generateWorksModal(works)
}

function openModal(event) {
    event.preventDefault();
    formAddProjectDiv.style.display = "none";
    modalEdit.style.visibility = "visible";
    document.body.classList.add('modal-open');

    fetch(`${baseUrl}works`)
    .then(response => response.json())
    .then(worksData => {
        window.localStorage.setItem("works", JSON.stringify(worksData));
        generateWorksModal(worksData);
    })
    .catch(error => {
        console.error('Error fetching works data:', error);
    });
}




document.addEventListener("DOMContentLoaded", async function() {

    //Récupération des données de l'API
    const reponse = await fetch(`${baseUrl}works`);
    const works = await reponse.json();

    generateWorks(works);

    if (categories === null) {
        const responseCategory = await fetch(`${baseUrl}categories`);
        categories = await responseCategory.json();
    
        // Transformation des pièces en JSON
        const valeurCategories = JSON.stringify(categories);
        
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("categories", valeurCategories);
    } else {
        categories = JSON.parse(categories);
    }

    generateButtonCategories(categories);

    // Options pour filter de la galerie
    const filterAll = document.querySelector(".filter-all")
    const filterObjects = document.querySelector(".filter-Objets")
    const filterAppartements = document.querySelector(".filter-Appartements")
    const filterHotels = document.querySelector(".filter-Hotels")

    filterAll.addEventListener("click", function () {
        divWorks.innerHTML = ""; 
        generateWorks(works);   

    });

    filterObjects.addEventListener("click", function () {
        const objectsOnly = works.filter(function (works) {
            return works.category.id === 1; // Categorie = Objets
        });
        divWorks.innerHTML = "";  
        generateWorks(objectsOnly);   
    });

    filterAppartements.addEventListener("click", function () {
        const appartementsOnly = works.filter(function (works) {
            return works.category.id === 2; // Categorie = Appartements
        });
        divWorks.innerHTML = "";   
        generateWorks(appartementsOnly);   
    });

    filterHotels.addEventListener("click", function () {
        const hotelOnly = works.filter(function (works) {
            return works.category.id === 3; // Categorie = Hôtels
        });
        divWorks.innerHTML = "";   
        generateWorks(hotelOnly);   
    });


    // Si le token n'est pas null dans le local storage, changer log in en log out
    if (token !== null) {

        // Changer le bouton log in en log out, et effacer le token si log out
        const loginBtn = document.querySelector('.login-button');
        loginBtn.innerHTML = "logout"

        loginBtn.addEventListener("click", function() {
            localStorage.removeItem('userToken');
        });

        divButtonsFilter.style.display = "none";

    
        const buttonModifier = document.querySelector('.modifier');
        buttonModifier.style.display = "block"; //On montrer le bouton modifier si token
        buttonModifier.addEventListener("click", openModal);

        const bannerEdit = document.querySelector('#edit-banner');
        bannerEdit.style.display = "block"; //On montrer le bouton modifier si token        
        bannerEdit.addEventListener("click", openModal);


        // Event bouton pour ajouter des projets
        addButon.addEventListener("click", function() {
            formAddProjectDiv.innerHTML = initialState;
            divWorksModal.style.display= "none";
            addButon.style.display = "none";

            // Icon pour le retour en arrière
            const iconBack = document.createElement("i");
            iconBack.classList.add("fas", "fa-arrow-left", "modal-back");
            iconBack.addEventListener("click", function() {
                formAddProjectDiv.style.display = "none";
                divWorksModal.style.display = "flex";
                addButon.style.display = "block";
                iconBack.style.display = "none";

            });

            // Icon pour quitter le modal
            const iconClose = document.createElement("i");
                iconClose.classList.add("fas", "fa-xmark", "close-modal")
                iconClose.addEventListener("click", function() {
                    modalEdit.style.visibility = "hidden";
                    document.body.classList.remove('modal-open');
                    divWorksModal.visibility = "hidden";
                    formAddProjectDiv.style.display = "none";
                });


            modalEdit.appendChild(iconClose);
            modalEdit.appendChild(iconBack);

            formAddProjectDiv.style.display = "flex";

            //Ajouter les catégories dynamiquement
            const selectCategory = document.querySelector("#category");
            if (selectCategory !== null) {
                selectCategory.innerHTML += generateCategoryOptions(categories);
            }
            

            const buttonForm = document.querySelector("#Submit");
            const btnAddPicture = document.querySelector(".add-photo");
            const file = document.querySelector('#picture');
            const picturePreview = document.getElementById('picturePreview');

            // Bloquer utilisation du bouton Submit tant que l'image n'est pas ajoutée
            buttonForm.disabled = true;

            btnAddPicture.addEventListener("click", function() {
                file.click();
            });

            file.addEventListener('change', function() {
                // Vérifiez si un fichier a été sélectionné
                if (file.files.length > 0) {
                    const reader = new FileReader();
            
                    // Mettez à jour la source de l'icône avec la prévisualisation de l'image
                    reader.onload = function(e) {
                        picturePreview.style.backgroundImage = `url('${e.target.result}')`;
                        picturePreview.classList.remove('fa-image'); // Supprimez la classe de l'icône fa-image
            
                        // Cacher le bouton "Ajouter une photo" et le texte "jpg, png : 4 mo max"
                        btnAddPicture.style.display = 'none';
                        document.querySelector('.file-info').style.display = 'none';
                    };
            
                    // Lisez le fichier en tant que Data URL
                    reader.readAsDataURL(file.files[0]);

                    // Réactiver le bouton et le mettre en vert
                    buttonForm.disabled = false;
                    buttonForm.style.backgroundColor = "#1D6154";
                }
            });

            buttonForm.addEventListener("click", submitForm);

            //Création des catégories dynamiquement
            function generateCategoryOptions(categories) 
            {
            return categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
            }

        
        });
    }
});

