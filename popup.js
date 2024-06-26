document.addEventListener("DOMContentLoaded", () => {
  const bookmarkList = document.getElementById("bookmark-list");
  const addBookmarkButton = document.getElementById("add-bookmark");

  function updateBookmarkList() {
    chrome.storage.sync.get("bookmarks", (data) => {
      const bookmarks = data.bookmarks || [];
      bookmarkList.innerHTML = "";
      bookmarks.forEach((bookmark, index) => {
        const divItem = document.createElement("div");
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = bookmark.url;
        link.textContent = bookmark.title;
        link.target = "_blank";
        listItem.appendChild(link);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          bookmarks.splice(index, 1);
          chrome.storage.sync.set({ bookmarks }, updateBookmarkList);
        });

        listItem.appendChild(deleteButton);
        divItem.appendChild(listItem);
        bookmarkList.appendChild(divItem);
      });
    });
  }

  addBookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.storage.sync.get("bookmarks", (data) => {
        const bookmarks = data.bookmarks || [];
        bookmarks.push({ title: activeTab.title, url: activeTab.url });
        chrome.storage.sync.set({ bookmarks }, updateBookmarkList);
      });
    });
  });

  updateBookmarkList();
});
