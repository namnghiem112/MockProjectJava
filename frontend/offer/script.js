const selectBtnLevels = document.querySelector(".select-btn-levels"),
  levels = document.querySelectorAll(".item_levels");

// selectBtnLevels.addEventListener("click", () => {
//   selectBtnLevels.classList.toggle("open");
// });

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
