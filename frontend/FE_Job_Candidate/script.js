const selectBtn = document.querySelector(".select-btn"),
  items = document.querySelectorAll(".item");

selectBtn.addEventListener("click", () => {
  selectBtn.classList.toggle("open");
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    let checked = document.querySelectorAll(".checked"),
      btnText = document.querySelector(".btn-text");
    const texts = document.querySelectorAll(".checked .item-text");
    btnText.innerText = "";
    if (checked && checked.length > 0) {
      texts.forEach((item) => {
        btnText.innerText = item.innerText + ", " + btnText.innerText;
      });
    } else {
      btnText.innerText = "";
    }
  });
});
//benefits
const selectBtnBenefits = document.querySelector(".select-btn-benefits"),
  benefits = document.querySelectorAll(".item_benefits");

selectBtnBenefits.addEventListener("click", () => {
  selectBtnBenefits.classList.toggle("open");
});

benefits.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    let checked = document.querySelectorAll(".checked"),
      btnText = document.querySelector(".btn-text-benefits");
    const texts = document.querySelectorAll(".checked .item-text-benefits");
    btnText.innerText = "";
    if (checked && checked.length > 0) {
      texts.forEach((item) => {
        btnText.innerText = item.innerText + ", " + btnText.innerText;
      });
    } else {
      btnText.innerText = "";
    }
  });
});
//skills
const selectBtnLevels = document.querySelector(".select-btn-levels"),
  levels = document.querySelectorAll(".item_levels");

selectBtnLevels.addEventListener("click", () => {
  selectBtnLevels.classList.toggle("open");
});

levels.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    let checked = document.querySelectorAll(".checked"),
      btnText = document.querySelector(".btn-text-levels");
    const texts = document.querySelectorAll(".checked .item-text-levels");
    btnText.innerText = "";
    if (checked && checked.length > 0) {
      texts.forEach((item) => {
        btnText.innerText = item.innerText + ", " + btnText.innerText;
      });
    } else {
      btnText.innerText = "";
    }
  });
});
