document.addEventListener("DOMContentLoaded", async function () {
  const apiUrl = "https://sessionize.com/api/v2/mgdyv9ad/view/All";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.speakers || !data.sessions) {
      console.error("Invalid API response structure.");
      return;
    }

    const speakers = data.speakers;
    const sessions = data.sessions;
    const speakerContainer = document.querySelector(".swiper-wrapper");

    speakerContainer.innerHTML = ""; // Clear existing speakers

    speakers.forEach((speaker) => {
      // Find the sessions for this speaker
      const speakerSessions = sessions
        .filter((session) => session.speakers.includes(speaker.id))
        .map((session) => session.title)
        .join(", ");

      // Create the speaker card dynamically
      const speakerSlide = document.createElement("div");
      speakerSlide.classList.add("swiper-slide");

      speakerSlide.innerHTML = `
        <div class="speaker" data-aos="fade-up">
          <img src="${speaker.profilePicture || "assets/img/speakers/tbd.png"}" 
               alt="${speaker.fullName}" class="img-fluid" />
          <div class="details">
            <h3><a href="#">${speaker.fullName}</a></h3>
            <p>${speakerSessions || "Session Info Not Available"}</p>
            <div class="social">
              ${speaker.links
                .map(
                  (link) =>
                    `<a href="${
                      link.url
                    }" target="_blank"><i class="bi bi-${getSocialIcon(
                      link.linkType
                    )}"></i></a>`
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

      speakerContainer.appendChild(speakerSlide);
    });

    // Reinitialize Swiper
    new Swiper(".gallery-slider", {
      speed: 400,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: "auto",
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 20 },
        575: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        992: { slidesPerView: 5, spaceBetween: 20 },
      },
    });
  } catch (error) {
    console.error("Error fetching speaker data:", error);
  }
});

// Function to map social media types to Bootstrap icons
function getSocialIcon(type) {
  const icons = {
    Twitter: "twitter",
    LinkedIn: "linkedin",
    YouTube: "youtube",
    Instagram: "instagram",
    Website: "globe",
  };
  return icons[type] || "link";
}
