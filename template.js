// https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp

var prevScrollpos = window.pageYOffset;

window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;

    // Navbar hide/show functionality
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        if (prevScrollpos > currentScrollPos) {
            // Scrolling UP - show navbar
            navbar.style.transform = "translateY(0)";
        } else {
            // Scrolling DOWN - hide navbar
            navbar.style.transform = "translateY(-100%)";
        }
    }

    prevScrollpos = currentScrollPos;

    // Scroll to top button functionality
    scrollFunction();
};

// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
