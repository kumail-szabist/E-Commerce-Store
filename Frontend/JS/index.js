const API = "https://organic-spoon-4j65vvxw9j79c5gvx-3000.app.github.dev";

fetch(API)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch API");
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        // const tbody = document.getElementById('countryTable')?.getElementsByTagName('tbody')[0];

        // if (tbody) {
        //     data.forEach(c => {
        //         const row = document.createElement("tr");

        //         row.innerHTML = `
        //             <td>${c.country_id}</td>
        //             <td>${c.country_name}</td>
        //             <td>${c.region_id}</td>
        //         `;

        //         tbody.appendChild(row);
        //     });
        // } else {
        //     console.error("tbody element not found!");
        // }
    })
    .catch(err => {
        console.log(err.message);
    });