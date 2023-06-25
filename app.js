// import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_m9VQVqMNvUs4WI8VvTD6gMs40R6vHtH3B33rTlF007fNK5fttNg4qPNTnuctGd0V";

// Create an async function "initialLoad" that retrieves a list of breeds from the cat API using Axios.
// Create new <options> for each of these breeds and append them to breedSelect.
// Each option should have a value attribute equal to the id of the breed and display text equal to the name of the breed.
// This function should execute immediately.

async function initialLoad() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": API_KEY
      }
    });
    const breeds = response.data;
    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    // Call the function to create the initial carousel
    createInitialCarousel();
  } catch (error) {
    console.log(error);
  }
}

// Function to create the initial carousel
async function createInitialCarousel() {
  const breedId = breedSelect.value;
  const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
    headers: {
      "x-api-key": API_KEY
    }
  });
  const cats = response.data;
  Carousel.clearCarousel();
  cats.forEach(cat => {
    const carouselItem = Carousel.createCarouselItem(cat);
    Carousel.appendCarouselItem(carouselItem);
  });
  const info = Carousel.createInfo(cats[0]);
  infoDump.innerHTML = "";
  infoDump.appendChild(info);
  Carousel.startCarousel();
}

// Event listener for breedSelect
breedSelect.addEventListener("change", createInitialCarousel);

// Add Axios interceptors to log the time between request and response to the console.
axios.interceptors.request.use((config) => {
  console.log("Request started");
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";
  return config;
});

axios.interceptors.response.use((response) => {
  document.body.style.cursor = "default";
  return response;
}, (error) => {
  document.body.style.cursor = "default";
  return Promise.reject(error);
});

// Function to update the progress bar
function updateProgress(progressEvent) {
  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  progressBar.style.width = `${percentCompleted}%`;
}

// Configure the onDownloadProgress for axios requests
axios.defaults.onDownloadProgress = updateProgress;

// Function to handle favoriting an image
export async function favourite(imgId) {
  try {
    const response = await axios.post("https://api.thecatapi.com/v1/favourites", {
      image_id: imgId
    }, {
      headers: {
        "x-api-key": API_KEY
      }
    });
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

// Function to get all favorites
function getFavourites() {
  axios.get("https://api.thecatapi.com/v1/favourites", {
    headers: {
      "x-api-key": API_KEY
    }
  }).then(response => {
    const favorites = response.data;
    Carousel.clearCarousel();
    favorites.forEach(favorite => {
      const carouselItem = Carousel.createCarouselItem(favorite.image);
      Carousel.appendCarouselItem(carouselItem);
    });
    infoDump.innerHTML = "";
  }).catch(error => {
    console.log(error);
  });
}

// Event listener for getFavouritesBtn
getFavouritesBtn.addEventListener("click", getFavourites);

// Call the initialLoad function to start the initial setup
initialLoad();
