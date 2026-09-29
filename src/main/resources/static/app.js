const API = "/api";


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showSection(sectionId) {

    document.getElementById("userSection")
        .classList.add("hidden");

    document.getElementById("staffSection")
        .classList.add("hidden");

    document.getElementById(sectionId)
        .classList.remove("hidden");

    if (sectionId === "staffSection") {
        loadHelpers();
        loadRequests();
    }
}


// =====================================================
// LOAD USERS
// =====================================================

async function loadUsers() {

    try {

        const response =
            await fetch(`${API}/users`);

        const users =
            await response.json();

        const userSelect =
            document.getElementById("userId");

        userSelect.innerHTML =
            '<option value="">Select User</option>';

        users.forEach(user => {

            const option =
                document.createElement("option");

            option.value = user.id;

            option.textContent =
                `${user.name} - ${user.email}`;

            userSelect.appendChild(option);

        });

    } catch (error) {

        console.error("Error loading users:", error);

    }
}


// =====================================================
// CREATE ASSISTANCE REQUEST
// =====================================================

document.getElementById("requestForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const userId =
            document.getElementById("userId").value;

        const pickupPoint =
            document.getElementById("pickupPoint").value;

        const startTime =
            document.getElementById("startTime").value;

        const endTime =
            document.getElementById("endTime").value;

        const assistanceType =
            document.getElementById("assistanceType").value;


        const requestData = {

            pickupPoint: pickupPoint,

            startTime: startTime,

            endTime: endTime,

            assistanceType: assistanceType

        };


        try {

            const response = await fetch(
                `${API}/requests/user/${userId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(requestData)
                }
            );


            if (!response.ok) {

                const error =
                    await response.text();

                throw new Error(error);
            }


            const result =
                await response.json();


            document.getElementById(
                "requestMessage"
            ).innerHTML =
                `<div style="background:#d1e7dd;color:#0f5132;">
                    Assistance request created successfully!
                    <br>
                    Request ID: ${result.id}
                    <br>
                    Status: ${result.status}
                </div>`;


            document.getElementById(
                "requestForm"
            ).reset();


        } catch (error) {

            document.getElementById(
                "requestMessage"
            ).innerHTML =
                `<div style="background:#f8d7da;color:#842029;">
                    Error: ${error.message}
                </div>`;

        }

    });


// =====================================================
// ADD HELPER
// =====================================================

document.getElementById("helperForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const helper = {

            name:
                document.getElementById(
                    "helperName"
                ).value,

            phone:
                document.getElementById(
                    "helperPhone"
                ).value,

            available:
                document.getElementById(
                    "helperAvailable"
                ).value === "true"

        };


        try {

            const response = await fetch(
                `${API}/staff/helpers`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(helper)
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Failed to add helper"
                );
            }


            alert("Helper added successfully!");

            document.getElementById(
                "helperForm"
            ).reset();


            loadHelpers();


        } catch (error) {

            alert(error.message);

        }

    });


// =====================================================
// LOAD HELPERS
// =====================================================

async function loadHelpers() {

    try {

        const response =
            await fetch(`${API}/staff/helpers`);

        const helpers =
            await response.json();

        const container =
            document.getElementById(
                "helpersContainer"
            );

        container.innerHTML = "";


        if (helpers.length === 0) {

            container.innerHTML =
                "<p>No helpers available.</p>";

            return;
        }


        helpers.forEach(helper => {

            const div =
                document.createElement("div");

            div.className =
                "helper-card";

            div.innerHTML = `

                <strong>${helper.name}</strong>

                <p>Phone: ${helper.phone}</p>

                <p>
                    Status:
                    ${
                        helper.available
                        ? "Available"
                        : "Not Available"
                    }
                </p>

            `;

            container.appendChild(div);

        });


    } catch (error) {

        console.error(
            "Error loading helpers:",
            error
        );

    }
}


// =====================================================
// LOAD REQUESTS
// =====================================================

async function loadRequests() {

    try {

        const response =
            await fetch(`${API}/requests`);

        const requests =
            await response.json();

        const container =
            document.getElementById(
                "requestsContainer"
            );

        container.innerHTML = "";


        if (requests.length === 0) {

            container.innerHTML =
                "<p>No requests found.</p>";

            return;
        }


        requests.forEach(request => {

            const div =
                document.createElement("div");

            div.className =
                "request-card";


            let helperOptions =
                '<option value="">Select Helper</option>';


            // We will load helpers separately
            // for assignment.


            div.innerHTML = `

                <h4>
                    Request #${request.id}
                </h4>

                <p>
                    <strong>Pickup:</strong>
                    ${request.pickupPoint}
                </p>

                <p>
                    <strong>Assistance:</strong>
                    ${request.assistanceType}
                </p>

                <p>
                    <strong>Start:</strong>
                    ${formatDate(request.startTime)}
                </p>

                <p>
                    <strong>End:</strong>
                    ${formatDate(request.endTime)}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="status ${request.status}">
                        ${request.status}
                    </span>
                </p>

                ${
                    request.helper
                    ?
                    `<p>
                        <strong>Helper:</strong>
                        ${request.helper.name}
                    </p>`
                    :
                    ""
                }

                ${
                    request.status === "REQUESTED"
                    ?
                    `
                    <div style="margin-top:15px">

                        <select
                            id="helper-${request.id}"
                        >
                            ${helperOptions}
                        </select>

                        <button
                            onclick="assignHelper(${request.id})"
                            class="primary-btn"
                        >
                            Assign Helper
                        </button>

                    </div>
                    `
                    :
                    ""
                }

                ${
                    request.status === "ASSIGNED"
                    ?
                    `
                    <button
                        onclick="completeRequest(${request.id})"
                        class="primary-btn"
                    >
                        Mark Completed
                    </button>
                    `
                    :
                    ""
                }

                ${
                    request.status === "REQUESTED" ||
                    request.status === "ASSIGNED"
                    ?
                    `
                    <button
                        onclick="cancelRequest(${request.id})"
                        style="
                            margin-top:10px;
                            padding:10px;
                            border:none;
                            border-radius:5px;
                            background:#dc3545;
                            color:white;
                        "
                    >
                        Cancel Request
                    </button>
                    `
                    :
                    ""
                }

            `;


            container.appendChild(div);


            // Load helpers into select

            if (request.status === "REQUESTED") {

                populateHelperSelect(
                    request.id
                );

            }

        });


    } catch (error) {

        console.error(
            "Error loading requests:",
            error
        );

    }
}


// =====================================================
// POPULATE HELPER DROPDOWN
// =====================================================

async function populateHelperSelect(requestId) {

    try {

        const response =
            await fetch(`${API}/staff/helpers`);

        const helpers =
            await response.json();


        const select =
            document.getElementById(
                `helper-${requestId}`
            );


        if (!select) return;


        helpers.forEach(helper => {

            if (!helper.available) return;


            const option =
                document.createElement("option");

            option.value =
                helper.id;

            option.textContent =
                `${helper.name} - ${helper.phone}`;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Error loading helpers:",
            error
        );

    }
}


// =====================================================
// ASSIGN HELPER
// =====================================================

async function assignHelper(requestId) {

    const select =
        document.getElementById(
            `helper-${requestId}`
        );


    const helperId =
        select.value;


    if (!helperId) {

        alert("Please select a helper.");

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/staff/requests/${requestId}/assign/${helperId}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        alert(
            "Helper assigned successfully!"
        );


        loadRequests();


    } catch (error) {

        alert(
            "Cannot assign helper: "
            + error.message
        );

    }
}


// =====================================================
// COMPLETE REQUEST
// =====================================================

async function completeRequest(requestId) {

    try {

        const response =
            await fetch(
                `${API}/staff/requests/${requestId}/complete`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        alert(
            "Request marked as completed!"
        );


        loadRequests();


    } catch (error) {

        alert(error.message);

    }
}


// =====================================================
// CANCEL REQUEST
// =====================================================

async function cancelRequest(requestId) {

    if (!confirm(
        "Are you sure you want to cancel this request?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/requests/${requestId}/cancel`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        alert(
            "Request cancelled!"
        );


        loadRequests();


    } catch (error) {

        alert(error.message);

    }
}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateString) {

    if (!dateString) return "";

    return new Date(dateString)
        .toLocaleString();

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadUsers();