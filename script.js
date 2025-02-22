document.addEventListener("DOMContentLoaded", () => {
    fetch("data/bills.json")
        .then(response => response.json())
        .then(data => displayBills(data));

    fetch("data/members.json")
        .then(response => response.json())
        .then(data => displayMembers(data));

    document.getElementById("search-bar").addEventListener("input", filterResults);
});

function displayBills(bills) {
    const billsList = document.getElementById("bills-list");
    billsList.innerHTML = bills.map(bill => `
        <div class="card">
            <h3><a href="bills/${bill.id}.html">${bill.title}</a></h3>
            <p>${bill.summary}</p>
        </div>
    `).join("");
}

function displayMembers(members) {
    const membersList = document.getElementById("members-list");
    membersList.innerHTML = members.map(member => `
        <div class="card">
            <h3><a href="members/${member.id}.html">${member.name}</a></h3>
            <p>${member.state} - ${member.party}</p>
        </div>
    `).join("");
}

function filterResults() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? "block" : "none";
    });
}
