// https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;

    if (prevScrollpos > currentScrollPos) {
        // Scrolling UP - show navbar
        document.querySelector('.navbar').style.transform = "translateY(0)";
    } else {
        // Scrolling DOWN - hide navbar
        document.querySelector('.navbar').style.transform = "translateY(-100%)";
    }

    prevScrollpos = currentScrollPos;
}