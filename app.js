const elements = {
    speedUp: document.querySelector("#speedUp"),
    speedDown: document.querySelector("#speedDown"),
    volumeUp: document.querySelector("#volumeUp"),
    volumeDown: document.querySelector("#volumeDown"),
    videoOpen: document.querySelector("#videoOpen"),
    videoBtn: document.querySelector("#video-btn"),
    VideoPlayer: document.querySelector("#main"),
    videoName: document.querySelector(".video-name"),
    toastName: document.querySelector(".toast-name"),
    fullScreen: document.querySelector("#fullscreen"),
    play: document.querySelector("#play"),
    pause: document.querySelector("#pause"),
    videoTime: document.querySelector(".video-time"),
    currentTime: document.querySelector(".current-time"),
    backward: document.querySelector(".backward"),
    forward: document.querySelector(".forward"),
    seekBar: document.querySelector("#seekbar"),
    toast: document.querySelector('.Main-Toast'),
    toast2: document.querySelector('.Main-Toast-2'),
    closeBtn: document.querySelector('.close'),
    aboutSection: document.querySelector('.about'),
    menuShortcut: document.querySelector('#menu-shortcut'),
    menuAbout: document.querySelector('#menu-about'),
    muteButton:document.getElementById('mute'),
    videoContainer : document.querySelector("#main"),
    volumeSlider : document.getElementById("volumeSlider"),

};



// Create the custom context menu
const customContextMenu = document.createElement('div');
customContextMenu.style.position = 'absolute';
customContextMenu.style.backgroundColor = '#fff';
customContextMenu.style.border = '1px solid #ccc';
customContextMenu.style.display = 'none';  // Initially hidden
customContextMenu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';  // Optional: Add a shadow for better visibility
customContextMenu.style.zIndex = '1000'; // Ensure the menu is on top

// Inner content for the context menu (list of options)
customContextMenu.innerHTML = `
    <ul style="list-style-type: none; margin: 0; padding: 0; font-size: 14px;">
        <li id="playOption" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #eee;">Play</li>
        <li id="pauseOption" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #eee;">Pause</li>
        <li id="fullscreenOption" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #eee;">Fullscreen</li>
        <li id="muteOption" style="padding: 8px; cursor: pointer;">Mute</li>
    </ul>`;

document.body.appendChild(customContextMenu);

function openToast() {
    elements.toast.style.display = 'block';
}

function openToast2() {
    elements.toast2.style.display = 'block';
}

// Function to hide the toast
function closeToast() {
    elements.toast.style.display = 'none';
}

function hideText(element) {
    setTimeout(() => {
        element.style.display = "none";
        element.innerHTML = "";
    }, 2000);
}

function updateTimeDisplay(videoElement) {
    const currentMinutes = (videoElement.currentTime / 60).toFixed(2);
    const durationMinutes = (videoElement.duration / 60).toFixed(2);
    elements.currentTime.innerHTML = currentMinutes;
    elements.videoTime.innerHTML = durationMinutes;
}

function getVideoElement() {
    return document.querySelector("#main .video");
}

function playVideo() {
    const videoElement = getVideoElement();
    if (videoElement && videoElement.paused) {
        videoElement.play();
        elements.play.style.display = "none";
        elements.pause.style.display = "block";
    }
}

function pauseVideo() {
    const videoElement = getVideoElement();
    if (videoElement && !videoElement.paused) {
        videoElement.pause();
        elements.play.style.display = "block";
        elements.pause.style.display = "none";
    }
}

function setupVideoEvents() {
    const videoElement = getVideoElement();
    if (videoElement) {
        // Event listener for volume adjustment using mouse wheel
        elements.VideoPlayer.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                adjustVolume(-0.1);
            } else if (e.deltaY < 0) {
                adjustVolume(0.1);
            }
        });

        elements.volumeSlider.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent the page from scrolling when using the wheel on the slider.
        
            let change = 0; // The amount to adjust the volume by
        
            // Determine whether the user is scrolling up or down
            if (e.deltaY > 0) {
                change = -0.1; // Scroll down, decrease volume
            } else if (e.deltaY < 0) {
                change = 0.1; // Scroll up, increase volume
            }
        
            // Call your adjustVolume function to adjust the volume by the calculated change
            adjustVolume(change);
        });


        // Event listener for seek adjustment using mouse wheel
        elements.seekBar.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                seekBy(-5);
            } else if (e.deltaY < 0) {
                seekBy(5);
            }
        });
    }
}

function toggleMute() {
    const videoElement = getVideoElement(); // Get the active video element
    if (videoElement) {
        if (isMuted) {
            // Unmute
            videoElement.muted = false;
            elements.muteButton.classList.remove('fa-volume-xmark');
            elements. muteButton.classList.add('fa-volume-high');
        } else {
            // Mute
            videoElement.muted = true;
            elements. muteButton.classList.remove('fa-volume-high');
            elements.muteButton.classList.add('fa-volume-xmark');
        }
        isMuted = !isMuted; // Toggle the mute state
    } else {
        console.error("Video element not found!");
    }
}

// Fetch the shortcuts data
fetch('./shortcuts.json')
    .then(response => response.json())
    .then(shortcuts => {
        const leftSideContainer = document.querySelector('.shortcuts-body .leftside');
        const rightSideContainer = document.querySelector('.shortcuts-body .rightside');

        // Iterate over the shortcuts and populate the HTML structure
        Object.entries(shortcuts).forEach(([key, description]) => {
            // Add shortcut name to the leftside
            const nameElement = document.createElement('p');
            nameElement.textContent = key;
            nameElement.classList.add('shortcut-key');
            leftSideContainer.appendChild(nameElement);

            // Add description to the rightside
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = description;
            descriptionElement.classList.add('shortcut-description');
            rightSideContainer.appendChild(descriptionElement);

            // Add click event to toggle description visibility
            nameElement.addEventListener('click', () => {
                // Toggle the 'active' class on the clicked shortcut key
                nameElement.classList.toggle('active');

                // Hide other descriptions and remove 'active' class from other keys
                document.querySelectorAll('.shortcut-key').forEach(el => {
                    if (el !== nameElement) {
                        el.classList.remove('active');
                    }
                });

                // Toggle the visibility of the corresponding description
                const allDescriptions = document.querySelectorAll('.shortcut-description');
                allDescriptions.forEach(desc => {
                    desc.style.display = 'none';
                });

                if (nameElement.classList.contains('active')) {
                    descriptionElement.style.display = 'block';
                } else {
                    descriptionElement.style.display = 'none';
                }
            });
        });
    })
    .catch(err => console.error('Failed to load shortcuts:', err));


let isMuted = false;


const acceptInput = (file) => {
    if (!file) {
        alert("No file selected.");
        return;
    }

    // Validate the file type - Check if it's a video
    if (!file.type.startsWith("video")) {
        // alert("Please select a valid video file.");
        return;
    }

    // Remove any existing video if there is one
    const existingVideo = getVideoElement();
    if (existingVideo) {
        existingVideo.remove(); // Remove the current video from the DOM
    }

    // Create a new video element
    const videoElement = document.createElement("video");
    const videoURL = URL.createObjectURL(file);
    videoElement.src = videoURL;
    videoElement.classList.add("video");
    elements.VideoPlayer.appendChild(videoElement); // Append the new video
    videoElement.controls = false;
    videoElement.volume = 0.9;

    // Show play/pause buttons, and video name
    elements.play.style.display = "none";
    elements.pause.style.display = "block";
    elements.videoName.style.display = "flex";
    elements.videoName.innerHTML = file.name;
    hideText(elements.videoName);

    // Play the video
    videoElement.play();

    // Set up video events once the video is loaded
    videoElement.addEventListener("loadedmetadata", () => {
        updateTimeDisplay(videoElement);
        setInterval(() => updateTimeDisplay(videoElement), 1000);
    });

    // Sync seekbar with video time
    videoElement.addEventListener("timeupdate", () => {
        elements.seekBar.value = videoElement.currentTime;
        elements.seekBar.max = videoElement.duration;
    });

    // Seekbar input event
    elements.seekBar.addEventListener("input", () => {
        videoElement.currentTime = elements.seekBar.value;
    });

    // Now that video is added, set up wheel event listeners
    setupVideoEvents();
};

const adjustSpeed = (amount) => {
    const videoElement = getVideoElement();
    if (videoElement) {
        let newSpeed = videoElement.playbackRate + amount;
        if (newSpeed < 0.25) {
            elements.toastName.innerHTML = `Speed: Lowest`;
        } else {
            videoElement.playbackRate = newSpeed;
            elements.toastName.innerHTML = `Speed: ${newSpeed.toFixed(2)}x`;
        }
        elements.toastName.style.display = "flex";
        hideText(elements.toastName);
    } else {
        alert("Select a video to perform the action");
    }
};

const adjustVolume = (amount) => {
    const videoElement = getVideoElement();
    if (videoElement) {
        let newVolume = Math.min(1, Math.max(0, videoElement.volume + amount)); // Clamp volume
        videoElement.volume = newVolume;
        const percentage = `${Math.round(newVolume * 100)}%`;
        elements.toastName.innerHTML = `Volume: ${percentage}`;
        elements.toastName.style.display = "flex";
        hideText(elements.toastName);
    } else {
        alert("Select a video to perform the action");
    }
};

const handleFullScreen = () => {
    elements.VideoPlayer.requestFullscreen();
};

const togglePlayPause = () => {
    const videoElement = getVideoElement();
    if (videoElement) {
        if (videoElement.paused) {
            videoElement.play();
            elements.play.style.display = "none";
            elements.pause.style.display = "block";
        } else {
            videoElement.pause();
            elements.play.style.display = "block";
            elements.pause.style.display = "none";
        }
    } else {
        alert("Select a video to perform the action");
    }
};

const seekBy = (seconds) => {
    const videoElement = getVideoElement();
    if (videoElement) {
        let newTime = videoElement.currentTime + seconds;
        videoElement.currentTime = Math.min(
            Math.max(newTime, 0),
            videoElement.duration
        ); // Clamp time
    }
};

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const parentToast = closeBtn.closest('.Main-Toast, .Main-Toast-2');
        parentToast.style.display = 'none';
    });
});

// Event Listeners

// Show the custom context menu on right-click
elements.VideoPlayer.addEventListener('contextmenu', (e) => {
    e.preventDefault();  // Prevent the default right-click menu

    // Position the custom menu where the right-click occurred
    customContextMenu.style.left = `${e.pageX}px`;
    customContextMenu.style.top = `${e.pageY}px`;
    customContextMenu.style.display = 'block';  // Show the custom menu
});

// Hide the custom menu when clicking anywhere else
document.addEventListener('click', (e) => {
    if (!customContextMenu.contains(e.target) && !elements.VideoPlayer.contains(e.target)) {
        customContextMenu.style.display = 'none';
    }
});

document.getElementById("playOption").addEventListener('click', () => {
    playVideo();
    customContextMenu.style.display = 'none'; // Hide the context menu after action
});

document.getElementById("pauseOption").addEventListener('click', () => {
    pauseVideo();
    customContextMenu.style.display = 'none'; // Hide the context menu after action
});

document.getElementById("fullscreenOption").addEventListener('click', () => {
    handleFullScreen();
    customContextMenu.style.display = 'none'; // Hide the context menu after action
});

document.getElementById("muteOption").addEventListener('click', () => {
    toggleMute();
    customContextMenu.style.display = 'none'; // Hide the context menu after action
});

elements.videoContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.videoContainer.classList.add('drag-over');  // Optionally highlight drop area
});

elements.videoContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.videoContainer.classList.remove('drag-over');  // Optionally remove highlight

    const droppedFile = e.dataTransfer.files[0];  // Get the first file dropped
    if (droppedFile) {
        acceptInput(droppedFile);  // Call the function to handle the dropped file
    }
});

elements.videoOpen.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0]; // Get the first file selected by the user
    acceptInput(selectedFile);  // Call the function to handle the file input
});

elements.volumeSlider.addEventListener("input", (e) => {
    const videoElement = getVideoElement();
    if (videoElement) {
        videoElement.volume = e.target.value;
        elements.toastName.innerHTML = `Volume: ${Math.round(videoElement.volume * 100)}%`;
        elements.toastName.style.display = "flex";
        hideText(elements.toastName);
    }
});

// Prevent the default right-click context menu on the video player
elements.VideoPlayer.addEventListener('contextmenu', (e) => {
    e.preventDefault();  // Prevents the browser's default context menu
});

// Keyboard Shortcuts
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            adjustVolume(0.1);
            break;
        case "ArrowDown":
            adjustVolume(-0.1);
            break;
        case "ArrowLeft":
            seekBy(-5);
            break;
        case "ArrowRight":
            seekBy(5);
            break;
        case "o":
            elements.videoOpen.click();
            break;
        case " ":
            event.preventDefault();
            togglePlayPause();
            break;
        case "f":
            handleFullScreen();
            break;
        case "m":
            muteButton.click();
    }
});

elements.speedUp.addEventListener("click", () => adjustSpeed(0.25));
elements.speedDown.addEventListener("click", () => adjustSpeed(-0.25));
elements.volumeUp.addEventListener("click", () => adjustVolume(0.1));
elements.volumeDown.addEventListener("click", () => adjustVolume(-0.1));
elements.videoBtn.addEventListener("click", () => elements.videoOpen.click());
elements.fullScreen.addEventListener("click", handleFullScreen);
elements.play.addEventListener("click", togglePlayPause);
elements.pause.addEventListener("click", togglePlayPause);
elements.backward.addEventListener("click", () => seekBy(-5));
elements.forward.addEventListener("click", () => seekBy(5));
elements.videoOpen.addEventListener("change", acceptInput);
elements.closeBtn.addEventListener('click', closeToast);
elements.menuAbout.addEventListener('click', openToast2);
elements.menuShortcut.addEventListener('click', openToast);
elements.muteButton.addEventListener('click', toggleMute);
