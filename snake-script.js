document.addEventListener("DOMContentLoaded", function() {
    const segments = []; 

    // Create the main circle in the center of the page
    const mainCircle = document.createElement("div");
    mainCircle.classList.add("mainCircleAnimation");
    mainCircle.style.top = "50%";
    mainCircle.style.left = "50%";
    mainCircle.style.width = '10px';
    mainCircle.style.height = '10px';
    document.body.appendChild(mainCircle);

    let points = 0;
    let previousPoints = 0;

    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;

    let dx = 0;  
    let dy = 0;  

    // Function to create a new segment for the main circle
    function createSegment(x, y) {
        const segment = document.createElement("div");
        segment.classList.add("mainCircleSegment");
        segment.style.top = `${y}px`;
        segment.style.left = `${x}px`;
        document.body.appendChild(segment);
        segments.push(segment);
    }

    function updateCirclePosition() {
        posX += dx;
        posY += dy;
    
        // Get the radius of the main circle
        const circleRadius = parseFloat(mainCircle.style.width) / 2;
    
        // Check if the main circle hits the screen boundaries
if (posX - circleRadius < 5 || posX + circleRadius > window.innerWidth - 5 || posY - circleRadius < 5 || posY + circleRadius > window.innerHeight - 5) {
    // Reset the circle position and other necessary parameters
    posX = window.innerWidth / 2;
    posY = window.innerHeight / 2;
    dx = 0;
    dy = 0;
            previousPoints = points;
            document.getElementById('previousPoints').innerText = previousPoints;
            points = 0;
            document.getElementById('points').innerText = points;
            segments.forEach(segment => segment.remove());
            segments.length = 0;
        }
    
        // Update the position of the main circle
        mainCircle.style.top = `${posY}px`;
        mainCircle.style.left = `${posX}px`;
    
        // Add a new segment to the mainCircle's tail
        createSegment(posX, posY);
    
        // Remove the oldest segment if the mainCircle gets too long
        if (segments.length > 5) {
            const oldestSegment = segments.shift();
            oldestSegment.remove();
        }
    
        requestAnimationFrame(updateCirclePosition);
    }    

    // Start updating the circle position
    updateCirclePosition();

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
            dx = -5;
            dy = 0;
        } else if (touchX > rect.left + window.innerWidth * 0.8) {
            dx = 5;
            dy = 0;
        } else if (touchY < rect.top + window.innerHeight * 0.2) {
            dx = 0;
            dy = -5;
        } else if (touchY > rect.top + window.innerHeight * 0.8) {
            dx = 0;
            dy = 5;
        } else {
            return; // Return if touched elsewhere
        }
    }

    // Add event listener for touch events on the sides and top/bottom of the screen
    document.body.addEventListener("touchstart", moveCircleOnTouch);

     // Initial call to create a flashing circle
     createFlashingCircle();

     // Function to create flashing circles at random positions
     function createFlashingCircle() {
         const flashingCircle = document.createElement("div");
         flashingCircle.classList.add("circleAnimation", "flashAnimation");
 
         const randomX = Math.random() * window.innerWidth * 0.95;
         const randomY = Math.random() * window.innerHeight * 0.95;
 
         flashingCircle.style.top = `${randomY}px`;
         flashingCircle.style.left = `${randomX}px`;
 
         document.body.appendChild(flashingCircle);
     }
 
     // Function to check collision between main circle and flashing circles
function checkCollisionWithFlashingCircles() {
    const mainCircleRect = mainCircle.getBoundingClientRect();
    
    document.querySelectorAll('.circleAnimation.flashAnimation').forEach(flashingCircle => {
        const flashingCircleRect = flashingCircle.getBoundingClientRect();
        
        const mainCircleCenterX = mainCircleRect.left + mainCircleRect.width / 2;
        const mainCircleCenterY = mainCircleRect.top + mainCircleRect.height / 2;
        const flashingCircleCenterX = flashingCircleRect.left + flashingCircleRect.width / 2;
        const flashingCircleCenterY = flashingCircleRect.top + flashingCircleRect.height / 2;
        
        const distance = Math.sqrt(Math.pow(flashingCircleCenterX - mainCircleCenterX, 2) + Math.pow(flashingCircleCenterY - mainCircleCenterY, 2));
        
        const collisionThreshold = mainCircleRect.width / 2 + flashingCircleRect.width / 2;
        
        if (distance < collisionThreshold) {
            points++;
            document.getElementById('points').innerText = points;
            
            // Remove the flashing circle
            flashingCircle.remove();
            
            // Add a segment to the mainCircle's tail
            createSegment(mainCircleCenterX, mainCircleCenterY);
            
            // Create a new flashing circle
            createFlashingCircle();
        }
    });
}

 
     // Call the function to check for collisions every animation frame
     function checkCollisions() {
         checkCollisionWithFlashingCircles();
         requestAnimationFrame(checkCollisions);
     }
 
     // Start checking for collisions
     checkCollisions();
 });