document.addEventListener("DOMContentLoaded", function() {
    // Create the main circle in the center of the page
    const mainCircle = document.createElement("div");
    mainCircle.classList.add("mainCircleAnimation");
    mainCircle.style.top = "50%";
    mainCircle.style.left = "50%";
    mainCircle.style.width = '5px';
    mainCircle.style.height = '5px';
    document.body.appendChild(mainCircle);

    let points = 0;
    let previousPoints = 0;

    // Position variables
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;

    // Direction variables
    let dx = 0;  // horizontal movement
    let dy = 0;  // vertical movement

    // Initialize a counter for flashing circles
    let flashingCircleCount = 0;

    // Function to calculate distance between two points
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Function to check for collision and remove flashing circles
    function checkCollisionAndRemove() {
        const mainCircleX = posX;
        const mainCircleY = posY;
        const mainCircleRadius = 25;
    
        const flashingCircles = document.querySelectorAll('.flashAnimation');
        flashingCircles.forEach(flashingCircle => {
            const flashingCircleX = parseFloat(flashingCircle.style.left) + flashingCircle.offsetWidth / 2;
            const flashingCircleY = parseFloat(flashingCircle.style.top) + flashingCircle.offsetHeight / 2;
            const flashingCircleRadius = 25;

            const distance = calculateDistance(mainCircleX, mainCircleY, flashingCircleX, flashingCircleY);

            if (distance < mainCircleRadius + flashingCircleRadius) {
                flashingCircle.remove();
                flashingCircleCount--;
                points++;

                // Update the points displayed on the screen
                document.getElementById('points').innerText = points;

                // Increase the width and height of mainCircle by 1 pixel
                mainCircle.style.width = `${parseFloat(mainCircle.style.width) + 2}px`;
                mainCircle.style.height = `${parseFloat(mainCircle.style.height) + 2}px`;
            }
        });
    }

    // Function to move the circle based on arrow key presses
    function moveCircle(event) {
        switch (event.key) {
            case "ArrowUp":
                dy = -10;
                dx = 0;
                break;
            case "ArrowDown":
                dy = 10;
                dx = 0;
                break;
            case "ArrowLeft":
                dx = -10;
                dy = 0;
                break;
            case "ArrowRight":
                dx = 10;
                dy = 0;
                break;
            default:
                return;
        }
    }

    // Add event listener for arrow key presses
    document.addEventListener("keydown", moveCircle);

    // Function to move the circle based on touch positions
    function moveCircleOnTouch(event) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;

        const rect = document.body.getBoundingClientRect();

        if (touchX < rect.left + window.innerWidth * 0.2) {
            dx = -10;
            dy = 0;
        } else if (touchX > rect.left + window.innerWidth * 0.8) {
            dx = 10;
            dy = 0;
        } else if (touchY < rect.top + window.innerHeight * 0.2) {
            dx = 0;
            dy = -10;
        } else if (touchY > rect.top + window.innerHeight * 0.8) {
            dx = 0;
            dy = 10;
        } else {
            return; // Return if touched elsewhere
        }
    }

    // Add event listener for touch events on the sides and top/bottom of the screen
    document.body.addEventListener("touchstart", moveCircleOnTouch);

    // Function to update the position of the main circle
    function updateCirclePosition() {
        posX += dx;
        posY += dy;

        // Check boundaries and reset position if the main circle hits the border
        if (posX < 0 || posX > window.innerWidth || posY < 0 || posY > window.innerHeight) {
            posX = window.innerWidth / 2;
            posY = window.innerHeight / 2;
            dx = 0;
            dy = 0;
            previousPoints = points;
            document.getElementById('previousPoints').innerText = previousPoints;
            points = 0;
            document.getElementById('points').innerText = points;
            mainCircle.style.width = '5px';
            mainCircle.style.height = '5px';
        }

        mainCircle.style.top = `${posY}px`;
        mainCircle.style.left = `${posX}px`;

        checkCollisionAndRemove();

        requestAnimationFrame(updateCirclePosition);
    }

    // Start updating the circle position
    updateCirclePosition();

    // Function to create flashing circles at random positions
    function createFlashingCircle() {
        if (flashingCircleCount < 5) {
            const flashingCircle = document.createElement("div");
            flashingCircle.classList.add("circleAnimation", "flashAnimation");

            const randomX = Math.random() * window.innerWidth * 0.95;
            const randomY = Math.random() * window.innerHeight * 0.95;

            flashingCircle.style.top = `${randomY}px`;
            flashingCircle.style.left = `${randomX}px`;

            document.body.appendChild(flashingCircle);

            flashingCircleCount++;
        }
    }

    // Call the function to create a flashing circle every 3 seconds
    setInterval(createFlashingCircle, 100);
});
