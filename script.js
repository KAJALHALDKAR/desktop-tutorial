/* =========================================================
   JANHAL - Landing Page JavaScript
   Frontend Prototype
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   Global State
--------------------------------------------------------- */
const state = {
    city: localStorage.getItem("janhalCity") || "Jabalpur",
    mode: "scheduled"
};

/* ---------------------------------------------------------
   Helper Functions
--------------------------------------------------------- */
const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
};

const $$ = (selector, parent = document) => {
    return [...parent.querySelectorAll(selector)];
};

function showToast(message) {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* ---------------------------------------------------------
   CITY MANAGEMENT
--------------------------------------------------------- */

const cityElements = {
    nav: $("#locationLabel"),
    hero: $("#heroCity"),
    service: $("#serviceCity")
};

function updateCityUI() {
    Object.values(cityElements).forEach((element) => {
        if (element) {
            element.textContent = state.city;
        }
    });
}

let selectedCity = state.city;

function openLocationModal() {
    const modal = $("#locationModal");

    if (!modal) return;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    selectedCity = state.city;

    $$(".city-option").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.city === selectedCity
        );
    });
}

function closeLocationModal() {
    const modal = $("#locationModal");

    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

$("#locationButton")?.addEventListener("click", openLocationModal);

$$("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeLocationModal);
});

$$(".city-option").forEach((button) => {
    button.addEventListener("click", () => {
        selectedCity = button.dataset.city;

        $$(".city-option").forEach((option) => {
            option.classList.remove("active");
        });

        button.classList.add("active");
    });
});

$("#confirmCity")?.addEventListener("click", () => {
    state.city = selectedCity;

    localStorage.setItem("janhalCity", state.city);

    updateCityUI();
    closeLocationModal();

    showToast(`${state.city} selected.`);
});

/* ---------------------------------------------------------
   SCHEDULED / INSTANT MODE
--------------------------------------------------------- */

function setMode(mode) {
    state.mode = mode;

    $$(".mode-tab").forEach((tab) => {
        const isActive = tab.dataset.mode === mode;

        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    const availabilityTitle = $("#availabilityTitle");
    const availabilityText = $("#availabilityText");

    if (mode === "instant") {

        if (availabilityTitle) {
            availabilityTitle.textContent = "Instant availability";
        }

        if (availabilityText) {
            availabilityText.textContent = "Help in about 12 minutes";
        }

        showToast(
            "Instant mode selected. Live availability will come from the hub system."
        );

    } else {

        if (availabilityTitle) {
            availabilityTitle.textContent = "Fastest slot";
        }

        if (availabilityText) {
            availabilityText.textContent = "Today • 5:30–6:00 PM";
        }

        showToast(
            "Scheduled mode selected. Only serviceable slots appear in production."
        );
    }
}

$$(".mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        setMode(tab.dataset.mode);
    });
});

/* ---------------------------------------------------------
   MOBILE NAVIGATION
--------------------------------------------------------- */

const menuToggle = $("#menuToggle");
const mobileNav = $("#mobileNav");

menuToggle?.addEventListener("click", () => {

    const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

    if (mobileNav) {
        mobileNav.style.display = isOpen ? "none" : "flex";
    }
});

$$(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {

        menuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        if (mobileNav) {
            mobileNav.style.display = "none";
        }
    });
});

/* ---------------------------------------------------------
   SERVICE SEARCH
--------------------------------------------------------- */

const searchInput = $("#serviceSearch");
const searchButton = $("#searchButton");
const noResults = $("#noResults");

function searchServices() {

    const query = searchInput?.value.trim().toLowerCase() || "";

    const cards = $$(".searchable-card");

    let visibleCards = 0;

    cards.forEach((card) => {

        const searchableText =
            card.dataset.search?.toLowerCase() || "";

        const matches =
            query === "" ||
            searchableText.includes(query);

        card.hidden = !matches;

        if (matches) {
            visibleCards++;
        }
    });

    if (noResults) {
        noResults.hidden = visibleCards !== 0;
    }

    const servicesSection = $("#services");

    if (servicesSection) {
        servicesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    if (query && visibleCards > 0) {

        showToast(
            `${visibleCards} matching service${visibleCards > 1 ? "s" : ""} found.`
        );

    } else if (query) {

        showToast(
            "No matching service found. Try AC, cleaning, beauty or electrician."
        );
    }
}

searchButton?.addEventListener("click", searchServices);

searchInput?.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchServices();
    }
});

/* ---------------------------------------------------------
   SERVICE BOOKING BUTTONS
--------------------------------------------------------- */

$$(".service-book").forEach((button) => {

    button.addEventListener("click", () => {

        const serviceRow =
            button.closest(".service-row");

        const serviceName =
            $("h3", serviceRow)?.textContent || "Service";

        showToast(
            `${serviceName} selected. Connect this button to the booking API.`
        );
    });
});

/* ---------------------------------------------------------
   LIVE BOOKING PREVIEW
--------------------------------------------------------- */

$("#demoBooking")?.addEventListener("click", () => {

    showToast(
        "Live booking preview. Production will use realtime booking data."
    );
});

/* ---------------------------------------------------------
   PARTNER CTA
--------------------------------------------------------- */

$("#partnerButton")?.addEventListener("click", () => {

    showToast(
        "Partner onboarding will open the KYC and certification flow."
    );
});

/* ---------------------------------------------------------
   SAFETY SECTION
--------------------------------------------------------- */

$("#safetyLink")?.addEventListener("click", () => {

    const trustSection = $("#trust");

    trustSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

/* ---------------------------------------------------------
   ESC KEY - CLOSE MODAL
--------------------------------------------------------- */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeLocationModal();
    }
});

/* ---------------------------------------------------------
   INITIALIZE PAGE
--------------------------------------------------------- */

function initializeJanhal() {

    updateCityUI();

    setMode("scheduled");

    console.log(
        "Janhal landing page initialized successfully."
    );
}

document.addEventListener(
    "DOMContentLoaded",
    initializeJanhal
);