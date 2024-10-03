let currentColor = '#4a90e2';
let isRainbowMode = false;
let isEraser = false;

const funFacts = [
    "Did you know? The first digital drawing tablet was invented in 1957!",
    "Fun fact: Pixel art was popular in early video games due to limited graphics capabilities.",
    "Wow! The smallest pixel art can be just 1x1 pixel, called a 'pixel'!",
    "Amazing! Some artists create huge pixel art murals on buildings using Post-it notes!",
    "Cool! Pixel art is used in many modern indie games for a retro look."
];

function createGrid( size = 16 ) {
    const gridlinesToggle = document.getElementById( 'gridlines-toggle' );
    const grid = document.querySelector( '.grid' );
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for ( let i = 0; i < size * size; i++ ) {
        let box = document.createElement( 'div' );
        box.classList.add( 'box' );
        box.id = `box-${i}`;
        if ( gridlinesToggle.checked ) {
            box.style.border = '1px solid #D3D3D3';
        }
        grid.appendChild( box );
    }
    setupDrawing();
}

function clearGrid() {
    document.querySelectorAll( '.box' ).forEach( box => {
        box.style.backgroundColor = 'white';
    } );
}

function setupDrawing() {
    let isDrawing = false;

    function startDrawing() {
        isDrawing = true;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function drawBox( box ) {
        if ( isDrawing ) {
            if ( isEraser ) {
                box.style.backgroundColor = 'white';
            } else if ( isRainbowMode ) {
                box.style.backgroundColor = getRandomColor();
            } else {
                box.style.backgroundColor = currentColor;
            }
            playSound();
        }
    }

    document.querySelectorAll( '.box' ).forEach( box => {
        box.addEventListener( 'mousedown', () => {
            startDrawing();
            drawBox( box );
        } );
        box.addEventListener( 'mouseover', () => {
            drawBox( box );
        } );
        box.addEventListener( 'touchstart', ( e ) => {
            e.preventDefault();
            startDrawing();
            drawBox( box );
        } );
        box.addEventListener( 'touchmove', ( e ) => {
            e.preventDefault();
            const touch = e.touches[ 0 ];
            const box = document.elementFromPoint( touch.clientX, touch.clientY );
            if ( box && box.classList.contains( 'box' ) ) {
                drawBox( box );
            }
        } );
    } );

    document.addEventListener( 'mouseup', stopDrawing );
    document.addEventListener( 'touchend', stopDrawing );
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function playSound() {
    const audio = new Audio( 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3' );
    audio.play();
}

function setupControls() {
    const boxSlider = document.getElementById( 'box-slider' );
    const boxCountDisplay = document.querySelectorAll( '.box-count' );
    const eraseButton = document.querySelector( '.eraser' );
    const clearButton = document.querySelector( '.clear' );
    const rainbowButton = document.querySelector( '.rainbow' );
    const colorPicker = document.querySelector( '#color-picker' );
    const gridlinesToggle = document.getElementById( 'gridlines-toggle' );

    boxSlider.addEventListener( 'input', () => {
        boxCountDisplay.forEach( boxCount => boxCount.textContent = boxSlider.value );
        createGrid( parseInt( boxSlider.value ) );
    } );

    clearButton.onclick = () => {
        clearGrid();
        showConfetti();
    };

    eraseButton.addEventListener( 'click', () => {
        setActiveButton( eraseButton );
        isEraser = true;
        isRainbowMode = false;
    } );

    rainbowButton.addEventListener( 'click', () => {
        setActiveButton( rainbowButton );
        isRainbowMode = true;
        isEraser = false;
    } );

    colorPicker.addEventListener( 'input', ( event ) => {
        currentColor = event.target.value;
        setActiveButton( null );
        isRainbowMode = false;
        isEraser = false;
    } );

    gridlinesToggle.addEventListener( 'change', () => {
        document.querySelectorAll( '.box' ).forEach( box => {
            box.style.border = gridlinesToggle.checked ? '1px solid #D3D3D3' : 'none';
        } );
    } );
}

function setActiveButton( activeButton ) {
    document.querySelectorAll( '.rainbow, .eraser' ).forEach( button => {
        button.classList.remove( 'active' );
    } );
    if ( activeButton ) {
        activeButton.classList.add( 'active' );
    }
}

function showConfetti() {
    const confettiSettings = { target: 'confetti-canvas', max: 80, size: 2, animate: true };
    const confetti = new ConfettiGenerator( confettiSettings );
    confetti.render();
    setTimeout( () => {
        confetti.clear();
    }, 3000 );
}

function updateFunFact() {
    const funFactElement = document.getElementById( 'fun-fact-text' );
    const randomFact = funFacts[ Math.floor( Math.random() * funFacts.length ) ];
    funFactElement.textContent = randomFact;
}

window.addEventListener( 'load', () => {
    createGrid();
    setupControls();
    updateFunFact();
    setInterval( updateFunFact, 5000 ); // Update fun fact every 30 seconds
} );

function setupComments() {
    const commentForm = document.getElementById( 'comment-form' );
    const commentsContainer = document.getElementById( 'comments-container' );

    commentForm.addEventListener( 'submit', async ( e ) => {
        e.preventDefault();
        const name = document.getElementById( 'name' ).value;
        const comment = document.getElementById( 'comment' ).value;

        try {
            const response = await fetch( '/submit-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( { name, comment } ),
            } );

            if ( response.ok ) {
                const newComment = await response.json();
                addCommentToDOM( newComment );
                commentForm.reset();
            } else {
                console.error( 'Failed to submit comment' );
            }
        } catch ( error ) {
            console.error( 'Error:', error );
        }
    } );

    async function loadComments() {
        try {
            const response = await fetch( '/get-comments' );
            if ( response.ok ) {
                const comments = await response.json();
                comments.forEach( addCommentToDOM );
            } else {
                console.error( 'Failed to load comments' );
            }
        } catch ( error ) {
            console.error( 'Error:', error );
        }
    }

    function addCommentToDOM( comment ) {
        const commentElement = document.createElement( 'div' );
        commentElement.classList.add( 'comment' );
        commentElement.innerHTML = `
            <div class="comment-header">
                <span>${comment.name}</span>
                <span>${comment.date}</span>
            </div>
            <div class="comment-body">${comment.comment}</div>
        `;
        commentsContainer.prepend( commentElement );
    }

    loadComments();
}

window.addEventListener( 'load', () => {
    createGrid();
    setupControls();
    updateFunFact();
    setInterval( updateFunFact, 5000 );
    setupComments();
} );