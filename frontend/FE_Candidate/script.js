const selectBtn = document.querySelector(".select-btn"),
  items = document.querySelectorAll(".item");
console.log(selectBtn);
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

const selectBtn1 = document.querySelector(".select-btn-1"),
  items1 = document.querySelectorAll(".item_1");
console.log(selectBtn1);
selectBtn1.addEventListener("click", () => {
  selectBtn1.classList.toggle("open");
});

items1.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    let checked = document.querySelectorAll(".checked"),
      btnText = document.querySelector(".btn-text-1");
    const texts = document.querySelectorAll(".checked .item-text-1");
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
