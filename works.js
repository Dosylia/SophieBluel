let works = window.localStorage.getItem("works");
if (works === null) {
    const reponse = await fetch('http://localhost:5678/api/works');
    const works = await reponse.json();

    // Transformation des pièces en JSON
    const valeurWorks = JSON.stringify(works);
    
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", valeurWorks);
} else {
    works = JSON.parse(works);
}

function genererWorks(works)
{

    works.sort((a, b) => a.category.id - b.category.id);

    for (let i = 0; i < works.length; i++)
    {
        const figure = works[i];

        // Récupération de l'élément du DOM qui accueillera les travaux de l'architecte
        const divWorks = document.querySelector(".gallery");
        // Balise pour chaque travail
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const captionElement = document.createElement("figcaption");
        captionElement.innerText = figure.title

        divWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(captionElement)
    }
}

genererWorks(works);

