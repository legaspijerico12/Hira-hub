/* ==============================
   DARK MODE
================================= */

const themeButton = document.getElementById("themeToggle");

if (themeButton) {
    themeButton.addEventListener("change", function() {
        document.body.classList.toggle("dark-mode", themeButton.checked);
    });
}


/* ==============================
   SEARCH BAR (WITH LIVE SERVICES FILTER)
================================= */

const searchForm = document.querySelector(".search-bar");

if (searchForm) {
    const searchInput = searchForm.querySelector("input");

    /* Live filter if on Services page */
    searchInput.addEventListener("input", function() {
        const query = searchInput.value.toLowerCase().trim();
        const servicePosts = document.querySelectorAll(".service-post");

        servicePosts.forEach(function(post) {
            const text = post.textContent.toLowerCase();
            post.style.display = text.includes(query) ? "" : "none";
        });
    });

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const searchText = searchInput.value.trim();
        const servicePosts = document.querySelectorAll(".service-post");

        if (servicePosts.length > 0) {
            return;
        }

        if (searchText === "") {
            alert("Please enter something to search.");
        } else {
            alert("You searched for: " + searchText);
        }
    });
}


/* ==============================
   SMOOTH NAVIGATION
================================= */

const navigationLinks = document.querySelectorAll('a[href^="#"]');

navigationLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        const targetId = link.getAttribute("href");

        if (targetId === "#" || targetId === "#share-popup" || targetId === "#request-popup") {
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


/* ==============================
   POST & REQUEST POPUPS (BROWSE)
================================= */

const postBtn = document.querySelector(".post-material-btn");
const requestBtn = document.querySelector(".request-material-btn");
const sharePopup = document.getElementById("share-popup");
const requestPopup = document.getElementById("request-popup");
const closeShareBtn = document.getElementById("closeShareBtn");
const closeRequestBtn = document.getElementById("closeRequestBtn");

if (postBtn && sharePopup) {
    postBtn.addEventListener("click", function(event) {
        event.preventDefault();
        sharePopup.classList.add("popup-open");
    });
}

if (requestBtn && requestPopup) {
    requestBtn.addEventListener("click", function(event) {
        event.preventDefault();
        requestPopup.classList.add("popup-open");
    });
}

if (closeShareBtn) {
    closeShareBtn.addEventListener("click", function() {
        sharePopup.classList.remove("popup-open");
    });
}

if (closeRequestBtn) {
    closeRequestBtn.addEventListener("click", function() {
        requestPopup.classList.remove("popup-open");
    });
}


/* ==============================
   CREATE & DISPLAY POSTED CARDS (BROWSE)
================================= */

const shareForm = document.getElementById("shareForm");
const requestForm = document.getElementById("requestForm");
const materialsGrid = document.getElementById("materialsGrid");
const requestsGrid = document.getElementById("requestsGrid");
const emptyMaterialsMsg = document.getElementById("emptyMaterialsMsg");
const emptyRequestsMsg = document.getElementById("emptyRequestsMsg");
const materialCategoryOptions = Array.from(
    document.querySelectorAll("#materialCategory option")
).map(function(option) {
    return option.value;
});
let selectedCategory = null;

const requestedCategory = new URLSearchParams(window.location.search).get("category");
if (requestedCategory) {
    selectedCategory = materialCategoryOptions.find(function(category) {
        return category.toLowerCase() === requestedCategory.trim().toLowerCase();
    }) || null;
}

if (selectedCategory) {
    document.getElementById("materialCategory").value = selectedCategory;
    document.getElementById("requestCategory").value = selectedCategory;
}

function applyBrowseCategoryFilter() {
    [
        {
            grid: materialsGrid,
            emptyMessage: emptyMaterialsMsg,
            emptyText: "No materials posted yet. Click + Post above to share a school item!",
            itemText: "materials"
        },
        {
            grid: requestsGrid,
            emptyMessage: emptyRequestsMsg,
            emptyText: "No requests yet. Click + Request above if you need a school item!",
            itemText: "requests"
        }
    ].forEach(function(list) {
        if (!list.grid) {
            return;
        }

        const cards = Array.from(list.grid.querySelectorAll(".material-card"));
        let visibleCount = 0;

        cards.forEach(function(card) {
            const matches = !selectedCategory
                || card.dataset.category === selectedCategory;
            card.style.display = matches ? "" : "none";
            if (matches) {
                visibleCount += 1;
            }
        });

        if (list.emptyMessage) {
            if (selectedCategory && visibleCount === 0) {
                list.emptyMessage.textContent = `No ${list.itemText} in ${selectedCategory} yet.`;
                list.emptyMessage.style.display = "";
            } else if (visibleCount > 0) {
                list.emptyMessage.style.display = "none";
            } else {
                list.emptyMessage.textContent = list.emptyText;
                list.emptyMessage.style.display = "";
            }
        }
    });

    const browseHeading = document.querySelector("#browse > .section-heading h2");
    if (browseHeading) {
        let resetLink = document.getElementById("clearCategoryFilter");
        if (selectedCategory && !resetLink) {
            resetLink = document.createElement("a");
            resetLink.id = "clearCategoryFilter";
            resetLink.href = "browse.html";
            resetLink.className = "show-all-btn";
            resetLink.textContent = "× Show All";
            resetLink.addEventListener("click", function(event) {
                event.preventDefault();
                setBrowseCategory(null);
            });
        }

        if (selectedCategory) {
            const headingText = document.createElement("span");
            headingText.textContent = `Browse Materials: ${selectedCategory}`;
            browseHeading.classList.add("filtered-heading");
            browseHeading.replaceChildren(headingText, resetLink);
        } else {
            browseHeading.classList.remove("filtered-heading");
            browseHeading.textContent = "Browse Materials";
        }
    }
}

function setBrowseCategory(category) {
    selectedCategory = category;

    const url = new URL(window.location.href);
    if (category) {
        url.searchParams.set("category", category);
    } else {
        url.searchParams.delete("category");
    }
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);

    applyBrowseCategoryFilter();
}

document.querySelectorAll("#browse .category-grid .category-card[data-category]").forEach(function(card) {
    card.addEventListener("click", function(event) {
        event.preventDefault();
        setBrowseCategory(card.dataset.category);
        materialsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

/* POST MATERIAL SUBMIT */
if (shareForm && materialsGrid) {
    shareForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("materialTitle").value;
        const category = document.getElementById("materialCategory").value;
        const student = document.getElementById("studentName").value;
        const pickup = document.getElementById("pickupPlace").value;
        const contact = document.getElementById("contactLink").value;
        const imageInput = document.getElementById("materialImage");

        /* Check if user uploaded a photo */
        let imageHTML = "📦";
        if (imageInput.files.length > 0) {
            const imageURL = URL.createObjectURL(imageInput.files[0]);
            imageHTML = `<img src="${imageURL}" alt="${title}">`;
        }

        /* Create new card */
        const newCard = document.createElement("article");
        newCard.className = "material-card";
        newCard.dataset.category = category;
        newCard.innerHTML = `
            <div class="product-image">${imageHTML}</div>
            <div class="material-info">
                <h3>${title}</h3>
                <p>Category: ${category}</p>
                <p>By: ${student}</p>
                <p>Pickup: ${pickup}</p>
                <div class="card-actions">
                    <span class="availability">✓ Available</span>
                    <a href="${contact}" target="_blank" class="borrow-btn">Borrow →</a>
                </div>
            </div>
        `;

        materialsGrid.prepend(newCard);
        setBrowseCategory(category);

        shareForm.reset();
        document.getElementById("materialCategory").value = selectedCategory || materialCategoryOptions[0];
        sharePopup.classList.remove("popup-open");
    });
}

/* REQUEST MATERIAL SUBMIT */
if (requestForm && requestsGrid) {
    requestForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("requestTitle").value;
        const category = document.getElementById("requestCategory").value;
        const student = document.getElementById("requesterName").value;
        const pickup = document.getElementById("requestPickupPlace").value;
        const contact = document.getElementById("requestContactLink").value;
        const imageInput = document.getElementById("requestImage");

        /* Check if user uploaded a reference photo */
        let imageHTML = "🙋";
        if (imageInput.files.length > 0) {
            const imageURL = URL.createObjectURL(imageInput.files[0]);
            imageHTML = `<img src="${imageURL}" alt="${title}">`;
        }

        /* Create new request card */
        const newRequest = document.createElement("article");
        newRequest.className = "material-card";
        newRequest.dataset.category = category;
        newRequest.innerHTML = `
            <div class="product-image">${imageHTML}</div>
            <div class="material-info">
                <h3>${title}</h3>
                <p>Category: ${category}</p>
                <p>Requested by: ${student}</p>
                <p>Meetup: ${pickup}</p>
                <div class="card-actions">
                    <span class="availability">Looking for item</span>
                    <a href="${contact}" target="_blank" class="borrow-btn">Offer →</a>
                </div>
            </div>
        `;

        requestsGrid.prepend(newRequest);
        setBrowseCategory(category);

        requestForm.reset();
        document.getElementById("requestCategory").value = selectedCategory || materialCategoryOptions[0];
        requestPopup.classList.remove("popup-open");
    });
}


/* ==============================
   SERVICES POST & REQUEST MODAL
================================= */

const openPostBtn = document.getElementById("openPostModal");
const closePostBtn = document.getElementById("closePostModal");
const postModal = document.getElementById("postModal");
const servicePostForm = document.getElementById("servicePostForm");
const serviceFeed = document.querySelector(".service-feed");

if (openPostBtn && postModal) {
    openPostBtn.addEventListener("click", function() {
        postModal.classList.add("show");
    });

    if (closePostBtn) {
        closePostBtn.addEventListener("click", function() {
            postModal.classList.remove("show");
        });
    }

    postModal.addEventListener("click", function(event) {
        if (event.target === postModal) {
            postModal.classList.remove("show");
        }
    });
}

if (servicePostForm && serviceFeed) {
    servicePostForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const type = document.getElementById("postType").value;
        const title = document.getElementById("postTitle").value.trim();
        const details = document.getElementById("postDetails").value.trim();
        const meta = document.getElementById("postMeta").value.trim();
        const contact = document.getElementById("postContact").value.trim();

        const escapeHtml = (value) => value
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

        const isOffer = type === "offer";
        const badgeClass = isOffer ? "badge-offer" : "badge-request";
        const badgeText = isOffer ? "Offering Service" : "Looking For Help";
        const availability = isOffer ? "Available" : "Open";
        const buttonClass = isOffer ? "button-outline" : "button-primary";
        const buttonText = isOffer ? "Avail Service" : "Offer Help";

        const newPost = document.createElement("article");
        newPost.className = "service-post";
        newPost.innerHTML = `
            <div class="service-post-header">
                <div class="post-title-group">
                    <span class="post-type-badge ${badgeClass}">${badgeText}</span>
                    <h3>${escapeHtml(title)}</h3>
                </div>
                <span class="availability">${availability}</span>
            </div>
            <p>${escapeHtml(details)}</p>
            <div class="service-post-footer">
                <span class="post-meta">Posted by <strong>${escapeHtml(meta)}</strong></span>
                <a href="${escapeHtml(contact)}" target="_blank" rel="noopener noreferrer" class="button ${buttonClass}">${buttonText} &rarr;</a>
            </div>
        `;

        serviceFeed.prepend(newPost);
        servicePostForm.reset();
        postModal.classList.remove("show");
    });
}

/* ==============================
   AUTO-FILTER BROWSE BY CATEGORY
================================= */

if (materialsGrid) {
    applyBrowseCategoryFilter();
}

