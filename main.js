"use strict";

let websiteText = document.querySelector(".newBookmark > :nth-child(2)");
let websiteURL = document.querySelector(".newBookmark > :nth-child(3)");
let websiteCategory = document.querySelector(".newBookmark > :nth-child(5)");
let chosenCategory = document.querySelector(".chooseBookmarks > .list");
let showAll = document.querySelector(".showBookmarks > .title");
let filterList = document.querySelector(".filterBookmarks > .list");
let bookmarksList = document.querySelector(".bookmarks > .list");

fromLocal();

function addBookmark() {
  // ------------
  if (websiteText.value && websiteURL.value && websiteCategory.value) {
    chosenCategory.innerHTML = "";
    filterList.innerHTML = "";
    let bookmarkObj = {
      text: websiteText.value.trim(),
      url: "https://" + websiteURL.value.trim(),
      category: websiteCategory.value.trim(),
    };
    let data = JSON.parse(localStorage.getItem("bookmark")) || [];
    data.push(bookmarkObj);
    localStorage.setItem("bookmark", JSON.stringify(data));
    addToPage(data);
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
    websiteText.focus();
  } else {
    alert("Please Fill All The Fields");
  }
}

showAll.addEventListener("click", showAllBookmarks);

function showAllBookmarks() {
  fromLocal();
}

function addToPage(data) {
  let categories = [];
  data.forEach((category) => {
    categories.push(category.category);
  });

  let uniqueCategories = new Set(categories);

  // category for choosing
  uniqueCategories.forEach((category) => {
    let categoryItem = document.createElement("p");
    categoryItem.innerHTML = category;
    chosenCategory.appendChild(categoryItem);
    categoryItem.addEventListener("click", (e) => {
      websiteCategory.value = categoryItem.innerHTML;
    });
  });

  // category for filtering
  uniqueCategories.forEach((category) => {
    let categoryItem = document.createElement("p");
    categoryItem.innerHTML = category;
    categoryItem.setAttribute("data-name", category);
    filterList.appendChild(categoryItem);
    let dataIn = JSON.parse(localStorage.getItem("bookmark"));
    categoryItem.addEventListener("click", function () {
      let filterListArray = Array.from(filterList.children);
      filterListArray.forEach((ele) => {
        ele.classList.remove("active");
        this.classList.add("active");
      });
      bookmarksList.innerHTML = "";
      let targetedCategory = this.getAttribute("data-name");
      let filtered = [];
      dataIn.forEach((bookmark) => {
        if (bookmark.category == targetedCategory) {
          filtered.push(bookmark);
        }
      });

      filtered.forEach((ele, index) => {
        bookmarksList.innerHTML += `
            <div class="bookmark" id=bm-${index}>
              <div class="info">
              <p>${++index}</p>
              <a href="${ele.url}">${ele.text}</a>
              </div>
              <button id=bm-${index} onclick="deleteParent(${index})">Delete</button>
            </div>
          `;
      });
    });
  });

  // saved bookmarks
  bookmarksList.innerHTML = "";
  data.forEach((category, index) => {
    bookmarksList.innerHTML += `
      <div class="bookmark" id=bm-${index}>
        <div data-name=${category.category} class="info">
        <p>${category.category}</p>
        <a href="${category.url}" target="_blank">${category.text}</a>
        </div>
        <button id=bm-${index} onclick="deleteParent(${index})">Delete</button>
      </div>
    `;
  });
}

function fromLocal() {
  let data = JSON.parse(localStorage.getItem("bookmark"));
  chosenCategory.innerHTML = "";
  filterList.innerHTML = "";
  if (data) addToPage(data);
}

function deleteParent(parentIndex) {
  let myParent = document.querySelector(`#bm-${parentIndex}`);
  let data = JSON.parse(localStorage.getItem("bookmark"));
  data.splice(parentIndex, 1);
  localStorage.setItem("bookmark", JSON.stringify(data));
  myParent.remove();
  fromLocal();
}
