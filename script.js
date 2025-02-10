// Admin login logic
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Sending login data to the server to verify
    const response = await fetch("https://fsm-nx79.onrender.com/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || "Login failed!");
      return;
    }

    const data = await response.json();

    // Saving the admin token in localStorage
    localStorage.setItem("adminToken", data.token);

    // Redirecting to the Admin Dashboard
    window.location.href = "admin_dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again.");
  }
});

// Fetch client data (from API or local storage for demo purposes)
async function fetchClientData() {
  const token = localStorage.getItem("adminToken"); // Ensure an admin token is used
  if (!token) {
    alert("You must be logged in as an admin.");
    window.location.href = "login.html"; // Redirect to login page if no token
    return;
  }

  try {
    const response = await fetch("https://fsm-nx79.onrender.com/api/clients", {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch client data");
    }

    const clients = await response.json();
    populateClientTable(clients);
  } catch (error) {
    console.error("Error fetching client data:", error);
    alert("Error fetching client data. Please try again.");
  }
}

// Populate the table with client data
function populateClientTable(clients) {
  const tableBody = document
    .getElementById("clientActivityTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Clear any existing rows

  clients.forEach((client) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${client.clientId}</td>
      <td>${client.clientName}</td>
      <td>${client.checkInTime || "N/A"}</td>
      <td>${client.checkOutTime || "N/A"}</td>
      <td>${client.currentLocation || "N/A"}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Admin Dashboard protection (Check for token before accessing the page)
function checkAdminLogin() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("You must be logged in as an admin.");
    window.location.href = "login.html"; // Redirect to login if no token
  }
}

// Call checkAdminLogin on page load to ensure the admin is logged in
window.onload = function () {
  checkAdminLogin(); // Ensure that the admin is logged in before accessing
  fetchClientData(); // Fetch client data for the admin dashboard
};

// Fetch jobs data (for admin dashboard)
async function fetchJobsData() {
  const token = localStorage.getItem("adminToken"); // Ensure token is valid
  if (!token) {
    alert("You must be logged in as an admin.");
    window.location.href = "login.html"; // Redirect to login page if no token
    return;
  }

  try {
    const response = await fetch("https://fsm-nx79.onrender.com/api/jobs", {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs data");
    }

    const jobs = await response.json();
    populateJobTable(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    alert("Error fetching jobs. Please try again.");
  }
}

// Populate the table with jobs data
function populateJobTable(jobs) {
  const tableBody = document.getElementById("jobsTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Clear any existing rows

  jobs.forEach((job) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${job.jobId}</td>
      <td>${job.jobTitle}</td>
      <td>${job.jobStatus || "N/A"}</td>
      <td>${job.assignedTechnician || "N/A"}</td>
      <td>${job.createdAt || "N/A"}</td>
      <td><button class="btn btn-warning" onclick="editJob(${
        job.jobId
      })">Edit</button></td>
      <td><button class="btn btn-danger" onclick="deleteJob(${
        job.jobId
      })">Delete</button></td>
    `;

    tableBody.appendChild(row);
  });
}

// Edit job function (to be implemented as needed)
function editJob(jobId) {
  console.log(`Editing job with ID: ${jobId}`);
  // Add the logic to edit the job
}

// Delete job function (to be implemented as needed)
async function deleteJob(jobId) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("You must be logged in as an admin.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`https://fsm-nx79.onrender.com/api/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error("Failed to delete job");
    }

    alert("Job deleted successfully");
    fetchJobsData(); // Refresh job list after deletion
  } catch (error) {
    console.error("Error deleting job:", error);
    alert("Error deleting job. Please try again.");
  }
}

// Logout functionality
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html"; // Redirect to login page after logout
}
