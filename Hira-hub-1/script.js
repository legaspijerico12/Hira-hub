

const themeButton = document.getElementById("themeToggle");

if (themeButton) {

    themeButton.addEventListener("change", function() {

        document.body.classList.toggle("dark-mode", themeButton.checked);

    });

}

const searchForm = document.querySelector(".search-bar");
const searchInput = searchForm.querySelector("input");

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        alert("Please enter something to search.");
    } else {
        alert("You searched for: " + searchText);
    }

});

const assistantButton = document.querySelector(".assistant-button");
const assistantBox = document.querySelector(".assistant-box");
const assistantClose = document.querySelector(".assistant-header a");

assistantButton.addEventListener("click", function(event) {

    event.preventDefault();

    assistantBox.classList.toggle("assistant-open");

});

assistantClose.addEventListener("click", function(event) {

    event.preventDefault();

    assistantBox.classList.remove("assistant-open");

});

const suggestions = document.querySelectorAll(".suggestion-list span");

suggestions.forEach(function(suggestion) {

    suggestion.addEventListener("click", function() {

        const message = suggestion.textContent;

        alert("You selected: " + message);

    });

});

const assistantInput = document.querySelector(".assistant-input input");
const assistantSend = document.querySelector(".assistant-input button");

assistantSend.addEventListener("click", function() {

    const message = assistantInput.value.trim();

    if (message === "") {
        alert("Please type a message first.");
    } else {
        alert("Your message: " + message);
        assistantInput.value = "";
    }

});

assistantInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        assistantSend.click();
    }

});

const navigationLinks = document.querySelectorAll('a[href^="#"]');

navigationLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });

});

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const category = card.textContent.trim();

        console.log("Selected category: " + category);

    });

});
