document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const submitButton = document.getElementById("submit-button");
  const spinner = document.querySelector(".spinner");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show the spinner and change the button text color
    spinner.style.display = 'inline-block';
    submitButton.classList.add("button-text-hidden");

    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    // Log the server's response text
    const responseText = await response.text();
    console.log("Server response text:", responseText);

    // Parse the response as JSON
    const result = JSON.parse(responseText);

    if (result.success) {
      alert("Your message has been successfully encrypted and submitted.");
      form.reset();
    } else {
      alert("An error occurred. Please try again.");
    }

    // Hide the spinner and restore the button text color
    spinner.style.display = 'none';
    submitButton.classList.remove("button-text-hidden");
  });

  const pgpInfoBtn = document.getElementById("pgp-info-btn");
  const pgpOwnerInfo = document.getElementById("pgp-owner-info");

  // Fetch the PGP info when the page loads
  const fetchPGPInfo = async () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/pgp_owner_info");
    xhr.onload = function () {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const pgpOwner = document.getElementById("pgp-owner");
        const pgpKeyId = document.getElementById("pgp-key-id");
        const pgpExpires = document.getElementById("pgp-expires");

        pgpOwner.textContent = result.owner_info;
        pgpKeyId.textContent = result.key_id;
        pgpExpires.textContent = result.expires;

        // Show the pgpInfoBtn once the data is fetched
        pgpInfoBtn.classList.remove("hidden");
      } else {
        console.error(xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error(xhr.statusText);
    };
    xhr.send();
  };

  fetchPGPInfo();

  pgpInfoBtn.addEventListener("click", function () {
    if (pgpOwnerInfo.style.display === "block") {
      pgpOwnerInfo.style.display = "none";
    } else {
      pgpOwnerInfo.style.display = "block";
      pgpOwnerInfo.style.maxHeight = pgpOwnerInfo.scrollHeight + "px";
    }
  });
});
