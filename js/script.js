document.addEventListener("DOMContentLoaded", () => {
    // Load and display data dynamically
    fetch("data/bills.json")
        .then(response => response.json())
        .then(data => displayBills(data));

    fetch("data/members.json")
        .then(response => response.json())
        .then(data => displayMembers(data));

    // Enable global search
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", filterResults);
    }

    // Load specific bill or member details if on that page
    loadPageData();
});

function displayBills(bills) {
    const billsList = document.getElementById("bills-list");
    if (!billsList) return;

    billsList.innerHTML = bills.map(bill => `
        <div class="card">
            <h3><a href="bill.html?id=${bill.id}">${bill.title}</a></h3>
            <p>${bill.summary}</p>
        </div>
    `).join("");
}

function displayMembers(members) {
    const membersList = document.getElementById("members-list");
    if (!membersList) return;

    membersList.innerHTML = members.map(member => `
        <div class="card">
            <h3><a href="member.html?id=${member.id}">${member.name}</a></h3>
            <p>${member.state} - ${member.party}</p>
        </div>
    `).join("");
}

// Search function for filtering both bills & members
function filterResults() {
    const searchText = document.getElementById("search-bar").value.toLowerCase();

    document.querySelectorAll("#bills-list .card, #members-list .card").forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(searchText) ? "block" : "none";
    });
}

// Load bill or member data based on URL parameter
function loadPageData() {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get("id");
    const memberId = params.get("member"); // Use "member" instead of "id" for clarity

    if (billId && document.getElementById("bill-title")) {
        fetch("data/bills.json")
            .then(response => response.json())
            .then(bills => {
                const bill = bills.find(b => b.id === billId);
                if (bill) {
                    document.getElementById("bill-title").innerText = bill.title;
                    document.getElementById("bill-summary").innerText = bill.summary;

                    // Ensure votes object exists and handle missing fields
                    let senateVoteDisplay = bill.votes.Senate ? `<li>Senate: ${bill.votes.Senate}</li>` : "<li>Senate: N/A</li>";
                    let houseVotes = bill.votes.House ? 
                        `<li>House: ${bill.votes.House.yes} Yes, ${bill.votes.House.no} No</li>` : 
                        "<li>House: N/A</li>";

                    document.getElementById("bill-votes").innerHTML = `${senateVoteDisplay} ${houseVotes}`;
                } else {
                    console.warn("Bill not found:", billId);
                }
            })
            .catch(error => console.error("Error loading bill data:", error));
    }

    if (memberId && document.getElementById("member-name")) {
        fetch("data/members.json")
            .then(response => response.json())
            .then(members => {
                const member = members.find(m => m.id === memberId);
                if (member) {
                    document.getElementById("member-name").innerText = member.name;
                    document.getElementById("member-info").innerText = `${member.state} - ${member.party}`;

                    if (member.votes && Object.keys(member.votes).length > 0) {
                        document.getElementById("member-votes").innerHTML = Object.keys(member.votes).map(
                            billId => `<li><a href="bill.html?id=${billId}">${billId}</a>: ${member.votes[billId]}</li>`
                        ).join("");
                    } else {
                        document.getElementById("member-votes").innerHTML = "<li>No votes recorded.</li>";
                    }
                } else {
                    console.warn("Member not found:", memberId);
                }
            })
            .catch(error => console.error("Error loading member data:", error));
    }
}
