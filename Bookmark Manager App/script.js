const getBookmarks = () => {
  const stored = localStorage.getItem("bookmarks");

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    const isValid = parsed.every(
      b =>
        b &&
        typeof b === "object" &&
        "name" in b &&
        "category" in b &&
        "url" in b
    );

    return isValid ? parsed : [];
  } catch {
    return [];
  }
};

const displayOrCloseForm = () => {
  document.querySelector("#main-section").classList.toggle("hidden");
  document.querySelector("#form-section").classList.toggle("hidden");
};
const displayOrHideCategory = () => {
  document.querySelector("#main-section").classList.toggle("hidden");
  document.querySelector("#bookmark-list-section").classList.toggle("hidden");
};
const categoryDropdown = document.querySelector("#category-dropdown");
const categoryNameEls = document.querySelectorAll(".category-name");
const nameInput = document.querySelector("#name");
const urlInput = document.querySelector("#url");
const categoryList = document.querySelector("#category-list");
document.querySelector("#add-bookmark-button").addEventListener("click", () => {
  categoryNameEls.forEach(el => {
    el.innerText = categoryDropdown.value;
  });
  displayOrCloseForm();
});
document.querySelector("#close-form-button").addEventListener("click", () => {
  displayOrCloseForm();
});
document.querySelector("#add-bookmark-button-form").addEventListener("click", () => {
  const bookmarks = getBookmarks();

  bookmarks.push({
    name: nameInput.value,
    category: categoryDropdown.value,
    url: urlInput.value
  });

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  nameInput.value = "";
  urlInput.value = "";

  displayOrCloseForm();
});
document.querySelector("#view-category-button").addEventListener("click", () => {
  const selectedCategory = categoryDropdown.value;
  const bookmarks = getBookmarks();

  categoryNameEls.forEach(el => {
    el.innerText = selectedCategory;
  });

  const filtered = bookmarks.filter(
    bookmark => bookmark.category === selectedCategory
  );

  categoryList.innerHTML = "";

  if (filtered.length === 0) {
    categoryList.innerHTML = `<p>No Bookmarks Found</p>`;
  } else {
    filtered.forEach(bookmark => {
  categoryList.innerHTML += `
    <div>
      <input
        type="radio"
        id="${bookmark.name}"
        name="bookmark"
        value="${bookmark.name}"
      />
      <label for="${bookmark.name}">
        <a href="${bookmark.url}" target="_blank">
          ${bookmark.name}
        </a>
      </label>
    </div>
  `;
});

  }

  displayOrHideCategory();
});
document.querySelector("#close-list-button").addEventListener("click", () => {
  displayOrHideCategory();
});
document.querySelector("#delete-bookmark-button").addEventListener("click", () => {
  const selectedRadio = document.querySelector(
    'input[name="bookmark"]:checked'
  );

  if (!selectedRadio) return;

  const selectedName = selectedRadio.value;
  const selectedCategory = document.querySelector(".category-name").innerText;

  let bookmarks = getBookmarks();

  bookmarks = bookmarks.filter(
    bookmark =>
      !(
        bookmark.name === selectedName &&
        bookmark.category === selectedCategory
      )
  );

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  document.querySelector("#view-category-button").click();
});
