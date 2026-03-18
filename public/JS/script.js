(() => {
  'use strict';

  // Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
  
})();

// function to toggle the filters
  document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".mySwiper", {
      slidesPerView: "auto",
      spaceBetween: 30,
      slidesPerGroup: 4,
      mousewheel: true,
      keyboard: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });

//toggle taxes
let taxSwitch = document.getElementById("switchCheckDefault");
  taxSwitch.addEventListener("change", function() {
    let taxInfo = document.querySelectorAll(".tax-info");
    if (this.checked) {
      taxInfo.forEach(function(info) {
        info.style.display = "inline";
      });
    } else {
      taxInfo.forEach(function(info) {
        info.style.display = "none";
      });
    }
  });

//for swiping multiple listing images 
  document.addEventListener("DOMContentLoaded", function () {
    var swiper1 = new Swiper(".property-images", {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
