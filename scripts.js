// TODO: probably temp, will be removed later
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("Container");
    const line = document.createElement("li");
    line.textContent = `Date: ${date}, Product: ${product}, Price: ${price}`;
    container.appendChild(line);
});

// Ajout d'un produit TODO: ajouter erreurs à l'interface
async function AddProduct() {
    const name = document.getElementById("name").value;
    const url = document.getElementById("url").value;

    const product = {
        name: name,
        url: url,
    };

    const response = await fetch("/addProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (response.ok) {
        console.log("Product added successfully.");
    } else {
        console.error("Failed to add the product.");
    }
}
