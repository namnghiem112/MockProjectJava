document.addEventListener("DOMContentLoaded", function () {
  // Get modal element
  var modal = document.getElementById("banModal");

  // Get open modal button
  var btn = document.querySelector(".ban-button");

  // Get close button
  var closeBtn = document.querySelector(".close");

  // Get cancel button
  var cancelBtn = document.querySelector(".cancel-ban");

  // Get confirm button
  var confirmBtn = document.querySelector(".confirm-ban");

  // Listen for open click
  btn.addEventListener("click", openModal);

  // Listen for close click
  closeBtn.addEventListener("click", closeModal);

  // Listen for cancel click
  cancelBtn.addEventListener("click", closeModal);

  // Listen for outside click
  window.addEventListener("click", outsideClick);

  // Function to open modal
  function openModal() {
    modal.style.display = "block";
  }

  // Function to close modal
  function closeModal() {
    modal.style.display = "none";
  }

  // Function to close modal if outside click
  function outsideClick(e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  }

  // Function to confirm ban
  confirmBtn.addEventListener("click", function () {
    alert("Offer has been banned.");
    modal.style.display = "none";
  });
});
$(document).ready(function () {
  var multipleCancelButton = new Choices("#skills", {
    removeItemButton: true,
    maxItemCount: 5,
    searchResultLimit: 5,
    renderChoiceLimit: 5,
  });
});
