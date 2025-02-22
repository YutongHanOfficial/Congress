document.addEventListener("DOMContentLoaded", () => {
    fetch("data/bills.json")
        .then(response => response.json())
        .then(data => displayBills(data));

    fetch("data/members.json")
        .then(response => response.json())
        .then(data => displayMembers(data));

    document.getElementById("search-bar").addEventListener("input", filterResults);

    loadPageData();
});

function displayBills(bills) {
    const billsList = document.getElementById("bills-list");
    if (!billsList) return; // Prevent error on other pages

    billsList.innerHTML = bills.map(bill => `
        <div class="card">
            <h3><a href="bill.html?id=${bill.id}">${bill.title}</a></h3>
            <p>${bill.summary}</p>
        </div>
    `).join("");
}

function displayMembers(members) {
    const membersList = document.getElementById("members-list");
    if (!membersList) return; // Prevent error on other pages

    membersList.innerHTML = members.map(member => `
        <div class="card">
            <h3><a href="member.html?id=${member.id}">${member.name}</a></h3>
            <p>${member.state} - ${member.party}</p>
        </div>
    `).join("");
}

function loadPageData() {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get("id");
    const memberId = params.get("id");

    if (billId) {
        fetch("data/bills.json")
            .then(response => response.json())
            .then(bills => {
                const bill = bills.find(b => b.id === billId);
                if (bill) {
                    document.getElementById("bill-title").innerText = bill.title;
                    document.getElementById("bill-summary").innerText = bill.summary;
                    document.getElementById("bill-votes").innerHTML = `
                        <li>Senate: ${bill.votes.Senate.yes} Yes, ${bill.votes.Senate.no} No</li>
                        <li>House: ${bill.votes.House.yes} Yes, ${bill.votes.House.no} No</li>
                    `;
                }
            });
    }

    if (memberId) {
        fetch("data/members.json")
            .then(response => response.json())
            .then(members => {
                const member = members.find(m => m.id === memberId);
                if (member) {
                    document.getElementById("member-name").innerText = member.name;
                    document.getElementById("member-info").innerText = `${member.state} - ${member.party}`;
                    document.getElementById("member-votes").innerHTML = Object.keys(member.votes).map(
                        billId => `<li><a href="bill.html?id=${billId}">${billId}</a>: ${member.votes[billId]}</li>`
                    ).join("");
                }
            });
    }
}
