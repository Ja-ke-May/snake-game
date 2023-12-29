document.addEventListener("DOMContentLoaded", function() {
    // Direction flags
    let currentDirection = { dx: 0, dy: 0 };
    let mainCirclePositions = []; // Array to store previous positions of main circle

    
    function createMainCircle() {
        const circle = document.createElement("div");
        circle.id = 'main-circle';
        circle.classList.add("circleAnimation");
        circle.style.position = 'absolute';
        circle.style.width = '1.5vw';
        circle.style.height = '2vh'; 
        circle.style.borderRadius = '50%';
        circle.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), transparent 40%), radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.9), transparent 40%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 60%)';
        document.body.appendChild(circle);
    }

    createMainCircle(); // Create the main circle dynamicall

    // Array to store divs
    const divs = [];
    const collidedQueue = []; // Queue to maintain the order of collided divs

    function createCircles() {
        const totalDivs = 20;
        let divCount = 0;

        function createDivWithDelay() {
            if (divCount < totalDivs) {
                const div = document.createElement("div");
                div.classList.add("circleAnimation", "flashAnimation");
                div.dataset.index = divCount;
                div.style.top = `${Math.random() * 90}vh`;
                div.style.left = `${Math.random() * 90}vw`;
                document.body.appendChild(div);
                divs.push({ element: div, isFollowing: false });

                // Add the first three divs to the collidedQueue
            if (divCount < 3) {
                collidedQueue.push(divCount);
                divs[divCount].isFollowing = true; // Set the flag to follow the main circle
            }

                divCount++;
                setTimeout(createDivWithDelay, 500);
            }
        }
        createDivWithDelay();
    }

    createCircles();

    function moveCircle() {
        const circle = document.getElementById('main-circle');
        const rect = circle.getBoundingClientRect();

        // Store previous position of main circle
        mainCirclePositions.push({ top: rect.top, left: rect.left });
        if (mainCirclePositions.length > 20) { // Adjust this number based on how many positions you want to remember
            mainCirclePositions.shift(); // Remove the oldest position
        }

        let newTop = rect.top + currentDirection.dy;
        let newLeft = rect.left + currentDirection.dx;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (newTop < 0) newTop = screenHeight;
        else if (newTop > screenHeight) newTop = 0;

        if (newLeft < 0) newLeft = screenWidth;
        else if (newLeft > screenWidth) newLeft = 0;

        circle.style.top = `${newTop}px`;
        circle.style.left = `${newLeft}px`;

        collidedQueue.forEach((index, position) => {
            if (mainCirclePositions.length > position) {
                const { top, left } = mainCirclePositions[mainCirclePositions.length - 1 - position];
                const data = divs[index];
                const div = data.element;
                const delay = position * 200; // Delay based on position in the queue
                setTimeout(() => {
                    div.style.top = `${top}px`;
                    div.style.left = `${left}px`;
                }, delay);
            }
        });

        requestAnimationFrame(moveCircle);
    }

    function checkCollision(div) {
        const circle = document.getElementById('main-circle');
        const circleRect = circle.getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        return (
            circleRect.left < divRect.right &&
            circleRect.right > divRect.left &&
            circleRect.top < divRect.bottom &&
            circleRect.bottom > divRect.top
        );
    }

    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'ArrowUp':
                currentDirection = { dx: 0, dy: -1 };
                break;
            case 'ArrowDown':
                currentDirection = { dx: 0, dy: 1 };
                break;
            case 'ArrowLeft':
                currentDirection = { dx: -1, dy: 0 };
                break;
            case 'ArrowRight':
                currentDirection = { dx: 1, dy: 0 };
                break;
        }
    });

    // Function to handle screen click events
function handleScreenClick(event) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const clickX = event.clientX;
    const clickY = event.clientY;

    if (clickX < screenWidth * 0.25) {  // Left quarter of the screen
        currentDirection = { dx: -1, dy: 0 };
    } else if (clickX > screenWidth * 0.75) {  // Right quarter of the screen
        currentDirection = { dx: 1, dy: 0 };
    } else if (clickY < screenHeight * 0.25) {  // Top quarter of the screen
        currentDirection = { dx: 0, dy: -1 };
    } else if (clickY > screenHeight * 0.75) {  // Bottom quarter of the screen
        currentDirection = { dx: 0, dy: 1 };
    }
}

// Add click event listener to the entire window
document.addEventListener('click', handleScreenClick);

    moveCircle(); // Start moving the main circle

    setInterval(() => {
        divs.forEach((data, index) => {
            const div = data.element;
            if (checkCollision(div)) {
                if (!collidedQueue.includes(index)) {
                    collidedQueue.push(index); // Add to the queue if not already present
                    data.isFollowing = true; // Set the flag to follow the main circle
                }
            }
        });
    }, 100); // Check for collision every 100ms
});