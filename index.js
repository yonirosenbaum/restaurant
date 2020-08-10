//const navbar = document.getElementsByClassName("container")[0];
const navbar = document.querySelector(".nav-container");
const activeNavItem = document.getElementsByTagName("nav")[0];
const break_points = document.querySelectorAll(".breakpoints");
const scroll_height = [];
const menuItems = Array.from(document.getElementsByClassName("nav_link"));
const open_menu_button = document.getElementById("openNav");
const close_menu_button = document.getElementById("closeNav");
const about_us_button = document.querySelector('.about-us-button')
const about_us_expander = document.querySelector('.about-us-expander');
const recipes_button = document.querySelector('.recipes-button');

//havent reordered this yet
function springyAnimation(func, delay = 40) {
  let timer;
  return function () {
    let context = this;
    let arg = arguments;
    let delayedFunction = function () {
      func.apply(context, arg);
    };
    clearTimeout(timer);
    timer = setTimeout(delayedFunction, delay);
  };
}

//redo this
function toggleMenuFixed() {
  let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  if (navbar){
  if (scrollPosition > navbar.scrollHeight) {
    if (!navbar.classList.contains("fixed_menu")) {
      navbar.classList.add("fixed_menu");
    }
  } else {
    navbar.classList.remove("fixed_menu");
  }}
}

function getElementYPosition(element) {
  let location = 0;
  //loop to get element position
  if (element.offsetParent) {
    do {
      location += element.offsetTop;
      element = element.offsetParent;
    } while (element);
  }
  return location;
}

  //set new breakpoints when window is resized
function breakpoints() {
  scroll_height.length = 0;

  break_points.forEach((element) => {
    let newId = element.id;
    let yPosition = getElementYPosition(element);
    let obj = {};
    obj.id = newId;
    obj.position = yPosition;
    scroll_height.push(obj);
  });
}

breakpoints();

//remove active class from navitems
function removeActiveTagFromMenuItems() {
  menuItems.forEach((element) => {
    if (element.classList.contains("active")) {
      element.classList.remove("active");
    }
  });
}

function navbarAnimation() {
  let scrollY = window.pageYOffset;
  let scrollX = scrollY + window.innerHeight;
  let totalHeight = document.body.offsetHeight;
  let navbarHeight = document.querySelector("header .nav-container").offsetHeight;
  let section = document.getElementsByTagName("section")[0];
  let sectionCSS = section.currentStyle || window.getComputedStyle(section);
  let margin = parseInt(sectionCSS.marginTop.replace(/[^0-9]/g, ""), 10);

  removeActiveTagFromMenuItems();

  if (
    scrollY < scroll_height[0].position - navbarHeight - margin ||
    scrollY === 0
  ) {
    //Activate Welcome when scrolled to the top/ clicked on Welcome menu item
    menuItems[0].classList.add("active");
    return;
  } else if (scrollX >= totalHeight) {
    //Activate Reservations in menu when scrolled to the bottom of page (because we do not have a contact page section yet)
    // This might seem useless at first, but there are cases in which, for certain sizes of the screen, the breakpoint of the Reservations section is never scrolled passed, so the tab needs to be activated forcefully.
    menuItems[menuItems.length - 3].classList.add("active");
    return;
  }

  scroll_height.forEach((element) => {
    if (scrollY >= element.position - (navbarHeight + margin)) {
      removeActiveTagFromMenuItems();

      let currentNavLink = "#" + element.id;
      let currentNavElement = menuItems.find(
        (x) => x.getAttribute("href") === currentNavLink
      );
      currentNavElement.classList.add("active");
    }
  });
}

function distanceToTop(element) {
  return Math.floor(element.getBoundingClientRect().top);
}

function smoothScrolling(evt) {
  evt.preventDefault();
  let targetElement = this.getAttribute("href");
  let targetSection = document.querySelector(targetElement);
  if (!targetSection) return;

  let toTop = distanceToTop(targetSection);
  window.scrollBy({ top: toTop, left: 0, behavior: "smooth" });

  let checkIfDone = setInterval(function () {
    let pageBottom =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (distanceToTop(targetSection) === 0 || pageBottom) {
      targetSection.tabIndex = "-1";
      targetSection.focus();
      window.history.pushState("", "", targetElement);
      clearInterval(checkIfDone);
    }
  }, 100);
}


function menuToggle() {
  this.classList.remove("show");

  if (this === open_menu_button) {
    // activates when open menu icon is clicked
    close_menu_button.classList.add("show");
    document.querySelector('.nav-container').classList.add("show_menu");
    activeNavItem.classList.add("show_menu");
  } else {
    // activates when close menu icon is clicked
    open_menu_button.classList.add("show");
    document.querySelector('.nav-container').classList.remove("show_menu");
    activeNavItem.classList.remove("show_menu");
}
}
$(function(){
  $('.about-us-expander').css('display', 'none')
})
$(function(){
  $('.about-us-button').click(function(){
$('.about-us-expander').slideToggle()
})})



window.addEventListener("scroll", springyAnimation(toggleMenuFixed));
window.addEventListener("resize", springyAnimation(breakpoints, 500));
window.addEventListener("scroll", springyAnimation(navbarAnimation));

menuItems.forEach((menuItem) =>
  menuItem.addEventListener("click", smoothScrolling)
);
open_menu_button.addEventListener("click", menuToggle);
close_menu_button.addEventListener("click", menuToggle);
