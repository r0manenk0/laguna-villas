document.addEventListener("DOMContentLoaded", function() {

    Barba.Pjax.init();
    Barba.Prefetch.init();

    var FadeTransition = Barba.BaseTransition.extend({
        start: function() {
            Promise
                .all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
        },

        fadeOut: function() {
            return $(this.oldContainer).animate({
                opacity: 0
            }).promise();
        },

        fadeIn: function() {
            var _this = this;
            var $el = $(this.newContainer);

            $(this.oldContainer).hide();

            $el.css({
                visibility: 'visible',
                opacity: 0
            });

            $el.animate({
                opacity: 1
            }, 400, function() {
                _this.done();
            });
        },

        newContainer: function() {
            var $newPageHead = $('<head />').html(
                $.parseHTML(
                    newPageRawHTML.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0], document, true
                )
            );
        },

        done: function() {
            var headTags = [
                "meta[name='keywords']",
                "meta[name='description']",
                "meta[property^='og']",
                "meta[name^='twitter']",
                "meta[itemprop]",
                "link[itemprop]",
                "link[rel='prev']",
                "link[rel='next']",
                "link[rel='canonical']"
            ].join(',');
            $('head').find(headTags).remove();
            $newPageHead.find(headTags).appendTo('head');
        }
    });

    Barba.Pjax.getTransition = function() {
        return FadeTransition;
    };
});
$(document).ready(function() {
    //hamburger
    var bars = $('.hamb-bar'),
        menu = $('.mobile-nav'),
        mmenu = $('.m-nav'),
        mnuButton = $('#hamburger'),
        open = false,
        tl = new TimelineMax({ paused: true }),
        listItems = $('.mobile-nav li'),
        tlLoader = new TimelineMax({ paused: true, onComplete: loadContent }),
        tlTr = new TimelineMax({ paused: true, delay: 0.5 }),
        tlnotify = new TimelineMax({ delay: 2, repeat: -1 }),
        tlNslider = new TimelineMax({ delay: 2 }),
        tlnotifyClose = new TimelineMax({ delay: 0.5 }),
        body = $('body'),
        loader = $('#loader'),
        loaderLogo = $('#loader-logo'),
        menuLink = $('.mainMenu li a'),
        notify = $(".notify"),
        notifyActive = $('.notify .active'),
        specOffers = $(".spec-txt"),
        closeBtn = $(".close-btn"),
        headerBg = $(".header-bg"),
        tlBgScale = new TimelineMax(),
        aCard = $(".card"),
        cardCaption = $(".card-caption"),
        viewPortHeight = $(window).height(),
        viewPortWidth = $(window).width();


    $(window).scroll(function() {
            $(this).scrollTop() > $(this).height() ? $(".top").addClass("active") : $(".top").removeClass("active")
        }),
        $(".top").click(function() {
            $("html, body").stop().animate({
                scrollTop: 0
            }, "slow", "swing")
        })


    $('.vpopup').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
    });

    $('#masr').slickLightbox({
        lazy: true
    });


    //map
    var mapSection = $('#map');

    if (mapSection.length) {

        google.maps.event.addDomListener(window, 'load', initMap);

        function initMap() {
            var locations = [
                ['Laguna Villas Yao Noi', 8.105701, 98.622195, "img/markers/marker.png"],
                ['Phuket Airport', 8.1076702, 98.3231109, "img/markers/airport.png"],
                ['Krabi Airport', 8.099206, 98.983141, "img/markers/airport.png"],
                ['Bang Rong pier', 8.049508, 98.415859, "img/markers/port.png"],
                ['Ao Thalen pier', 8.145484, 98.748180, "img/markers/port.png"],
                ['Nopparat-Thara pier', 8.047440, 98.798624, "img/markers/port.png"]
            ];
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11,
                center: { lat: 8.105691, lng: 98.622201 },
                styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }]
            });

            var infowindow = new google.maps.InfoWindow();
            var marker, i;

            for (i = 1; i < locations.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon: {
                        url: locations[i][3],
                        size: new google.maps.Size(33, 33)
                    }
                });
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(locations[i][0]);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[0][1], locations[0][2]),
                map: map,
                icon: {
                    url: locations[0][3],
                    size: new google.maps.Size(38, 52)
                }
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(locations[0][0]);
                    infowindow.open(map, marker);
                }
            })(marker, i));

        }
    }

    var galM = $('.masonry');

    if (galM.length) {
        //gallery page
        mixitup('#masr', {
            load: {
                filter: 'all'
            },
            animation: {
                effects: 'fade scale(0.5)',
                duration: 700,
                animateResizeContainer: false
            },
            classNames: {
                elementFilter: 'control-label'
            },
            selectors: {
                target: '.mix'
            }
        });
    }



    //target blank
    function externalLinks() {
        links = document.getElementsByTagName("a");
        for (i = 0; i < links.length; i++) {
            link = links[i];
            if (link.getAttribute("href") && link.getAttribute("rel") == "external")
                link.target = "_blank";
        }
    }
    window.onload = externalLinks;




    //cards animation
    aCard.hover(
        function() {
            TweenLite.to($(this).find(cardCaption), 0.2, { bottom: "-10px" });
        },
        function() {
            TweenLite.to($(this).find(cardCaption), 0.2, { bottom: "-70px" });
        }
    );

    //dropDown

    var subMenus = $(".subMenu");

    $.each($(".menu-item"), function(index, element) {
        var subMenu = $(element).children('ul'),
            tl;

        if (subMenu.length != 0) {
            tl = new TimelineLite({ paused: true });

            tl.from(subMenu, .2, { autoAlpha: 0 });

            element.subMenuAnimation = tl;

            $(element).hover(menuItemOver, menuItemOut);
        }
    });

    function menuItemOver(e) {
        this.subMenuAnimation.play();
    }

    function menuItemOut() {
        this.subMenuAnimation.reverse();
    }




    //header bg scale
  /*  var resWidth = $('.header-bg').width() / 100 * 110,
        resHeight = $('.header-bg').height() / 100 * 110,
        diffX = (resWidth - $('.header-bg').width()) / 2,
        diffY = (resHeight - $('.header-bg').height()) / 2;

    TweenMax.to($('.header-bg'), 50, {
        css: {
            scale: 1.1,
            x: -diffX,
            y: -diffY,
            z: 0.1,
            rotationZ: "0.01deg",
            transformOrigin: "0 0",
            force3D: true,
        },
        repeat: -1,
        yoyo: true,
        ease: Power1.Linear
    },1);*/
    //notify


    tlnotify.staggerFromTo(notify.slice(0,3), 0.8,
                {x: 50, autoAlpha: 0, ease: Strong.easeInOut},
                {x: 0, autoAlpha: 1, ease: Strong.easeInOut},
            0.2)
            .staggerTo(notify.slice(0,3), 0.6, {
                delay: 4, x: 50, autoAlpha: 0, display: "none", ease: Strong.easeInOut
            }, 0.1)
            .staggerFromTo(notify.slice(3,6), 0.8,
                {x: 50, autoAlpha: 0, ease: Strong.easeInOut},
                {x: 0, autoAlpha: 1, ease: Strong.easeInOut},
            0.2)
            .staggerTo(notify.slice(3,6), 0.6, {
                delay: 4, x: 50, autoAlpha: 0, display: "none", ease: Strong.easeInOut
            }, 0.1)

    $(".offers").hover(
        function() {
            tlnotify.pause();
        },
        function() {
            tlnotify.resume();
        });




    /*closeBtn.on('click', function() {
        tlnotifyClose.staggerTo(notify, 0.8, {
            x: 50,
            autoAlpha: 0,
            ease: Strong.easeInOut
        }, 0.2)
    });


    specOffers.on('click', function() {
        tlnotify.staggerTo(notify, 0.8, {
            right: '0px',
            autoAlpha: 1,
            ease: Strong.easeInOut
        }, 1)
    });






var tlSl = new TimelineLite({
            onComplete: function(){
                tlSl.restart();
            }
        });


TweenLite.defaultEase = Circ.easeInOut;

var time = 1.9;
var y = 100;


tlSl
    .add ( TweenMax.staggerFromTo (
        notify, time,
            {
                opacity: 0,
                y:y,
            },
            {
                opacity: 1,
                y: 0,
            },
        2 ))
    .add ( TweenMax.staggerTo (
        notify, time,
            {
                delay: time,
                opacity: 0,
                y: -y,
            },
        2 ), 1.3)

*/

    //hamburger
    tl.to(bars[0], 0.16, {
            top: '8px',
            rotation: 45,
            ease: Strong.easeInOut
        }, 0.1)
        .to(bars[1], 0.16, {
            opacity: 0,
            left: '-20px',
            ease: Strong.easeInOut

        }, 0.1)
        .to(bars[2], 0.16, {
            top: '-8px',
            rotation: -45,
            ease: Strong.easeInOut
        }, 0.1)


        .to(mmenu, 0.65, {
            width: "100%",
            left: "-100%",
            ease: Strong.easeInOut
        }, '+=0.1')
        .staggerTo(listItems, 0.1, {
            left: "30px",
            opacity: 1,
            ease: Strong.easeInOut
        }, 0.1);

///////// Click Menu button
    mnuButton.on('click', function() {
        $(this).toggleClass('active');
        if (open) {
            tl.reverse();
            open = false;
        } else {
            tl.play();
            open = true;
            tl.set(body, { className: '+=fixedpos' });
        }
    });
    menu.find('a').on('click', function() {
        tl.reverse();
    });

    //page transition
    tlLoader.to(loaderLogo, 0.4, { autoAlpha: 0, ease: Strong.easeInOut }, 0.5);

    function loadContent() {
        var tlLoaderOut = new TimelineMax();
        tlLoaderOut.to(loader, 0.4, { autoAlpha: 0, ease: Strong.easeInOut }, 0);
        tlLoaderOut.to(body, 0.6, { autoAlpha: 1, ease: Strong.easeInOut }, 0);
    }
    $(window).load(function() {
        tlLoader.play();
    });


    menuLink.click(function(e) {
        e.preventDefault(); // prevent default anchor behavior
        var goTo = this.getAttribute("href"); // store anchor href
        var tlrev = new TimelineMax();
        tlrev
            .to(loaderLogo, 0.4, { autoAlpha: 1, ease: Strong.easeInOut }, 0.5)
            .to(loader, 0.4, { autoAlpha: 1, ease: Strong.easeInOut }, 0)
        setTimeout(function() {
            window.location = goTo;
        }, 1000);
    });



    /*ScrollMagic*/
    var controller = new ScrollMagic.Controller();
    if (window.matchMedia('(min-width: 769px)').matches) {

        // image parallax animations
        var images = $("[class*='imgp-']");
        for (var i = 0; i < images.length; i++) {
            var yInc = (i + 1) * 400;
            var plScene1 = new ScrollMagic.Scene({
                    triggerHook: 0.6,
                    triggerElement: '.image-wrapper',
                    duration: "300%"
                })
                .setTween(images[i], { y: "-=" + yInc + "px", ease: Linear.easeNone })
                .addTo(controller);
        };


        // image parallax animations
        var overw = $(".overview");
        for (var i = 0; i < overw.length; i++) {
            var yInc = (i + 1) * 600;
            var plScene1 = new ScrollMagic.Scene({
                    triggerHook: 0.8,
                    triggerElement: '.img-slider',
                    duration: "300%"
                })
                .setTween(overw, { y: "-=" + yInc + "px", ease: Linear.easeNone })
                .addTo(controller);
        };










        //loop

        $('.title-center').each(function() {
            var ourScene = new ScrollMagic.Scene({
                    triggerElement: this.children[0],
                    duration: 0.1,
                    triggerHook: 0.9
                })
                .setTween(this, 0.1, { y: '-10px', autoAlpha: 1 }, 0.2)
                .addTo(controller);
        });
    }


    /*slider img*/

    $('.img-slider').slick({
        autoplay: true,
        autoplaySpeed: 5000,
        draggable: false,
        fade: true,
        speed: 1000,
        responsive: [{
                breakpoint: 769,
                settings: {
                    arrows: true,
                    fade: false,
                    darggable: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    fade: false,
                    darggable: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    /*slider testimonial*/

    $('.testimonial-slider').slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        autoHeight: true
    });

    /*img-gallery*/
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav',
        autoplay: true,
        responsive: [{
                breakpoint: 769,
                settings: {
                    arrows: true,
                    fade: false,
                    darggable: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    fade: false,
                    darggable: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.slider-nav').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        arrows: true,
        prevArrow: '<i class="flaticon-left-arrow img-gallery-nav img-gallery-nav-prev"></i>',
        nextArrow: '<i class="flaticon-right-arrow img-gallery-nav img-gallery-nav-next"></i>',

    });


    $('.ex-slider').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        prevArrow: '<i class="flaticon-left-arrow ex-slider-nav ex-slider-nav-prev"></i>',
        nextArrow: '<i class="flaticon-right-arrow ex-slider-nav ex-slider-nav-next"></i>',
        responsive: [
          {
            breakpoint: 1080,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            }
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
});

    //time
    var update = function() {
        currentTime = moment(new Date());
        easternTime = moment.tz("Asia/Bangkok");
        $('.local-time').html(easternTime.format('hh:mm a'));
    };

    $(function() {
        update();
        setInterval(update, 2000);
    });



});



//form input
$('.js-input').keyup(function() {
    if ($(this).val()) {
        $(this).addClass('not-empty');
    } else {
        $(this).removeClass('not-empty');
    }
});





//grid items animation

$(".masonry a").hover(
    function() {
        TweenLite.to($(this).find('img'), 0.2, { scale: 1.2, force3D: false });
    },
    function() {
        TweenLite.to($(this).find('img'), 0.2, { scale: 1 });
    }
);





// hoverv title

window.addEventListener('load', function(event) {
    var hovervParents = document.querySelectorAll('.hoverv-parent');

    function sizehoverv(hoverv, hovervWidth, hovervHeight, hovervOffsetTop, hovervOffsetLeft) {
        hoverv.style.height = hovervHeight + 'px';
        hoverv.style.width = hovervWidth+ 'px';
        hoverv.style.top = '-' + hovervOffsetTop + 'px';
        hoverv.style.left = '-' + hovervOffsetLeft + 'px';
    }

    function hoverv() {
        for (var i = 0; i < hovervParents.length; i++) {

            // Grab our elements

            var hovervParent = hovervParents[i];
            var existinghoverv = hovervParent.querySelector('.hoverv');
            var hovervImage = hovervParent.querySelector('.hoverv-image');
            var hovervImageSrc = hovervImage.currentSrc;
            var hovervContainer = hovervParents[i].querySelector('.hoverv-container');
            var hovervWidth = hovervParent.getBoundingClientRect().width;
            var hovervHeight = hovervParent.getBoundingClientRect().height;
            var hovervOffsetTop = (hovervContainer.getBoundingClientRect().top - hovervParent.getBoundingClientRect().top);
            var hovervOffsetLeft = (hovervContainer.getBoundingClientRect().left - hovervParent.getBoundingClientRect().left);

            // If IE can't find currentSRC fallback to src

            if (hovervImageSrc == null) {
                hovervImageSrc = hovervImage.src;
            }

            // If we didn't find a hoverv element, create a new one, otherwise just resize it.

            if (existinghoverv) {
                existinghoverv.style.backgroundImage = 'url(' + hovervImageSrc + ')';
                hovervParent.style.backgroundImage = 'url(' + hovervImageSrc + ')';
                sizehoverv(existinghoverv, hovervWidth, hovervHeight, hovervOffsetTop, hovervOffsetLeft);
            } else {
                hovervParent.style.backgroundImage = 'url(' + hovervImageSrc + ')';
                var newhoverv = document.createElement('div');
                newhoverv.classList.add('hoverv');
                newhoverv.style.backgroundImage = 'url(' + hovervImageSrc + ')';
                sizehoverv(newhoverv, hovervWidth, hovervHeight, hovervOffsetTop, hovervOffsetLeft);
                hovervContainer.appendChild(newhoverv);
            }

        }
    }

    hoverv();

    window.addEventListener('resize', function(event) {
        hoverv();
    });




});








// hero title

window.addEventListener('load', function(event) {
    var heroParents = document.querySelectorAll('.hero-parent');

    function sizehero(hero, heroWidth, heroHeight, heroOffsetTop, heroOffsetLeft) {
        hero.style.height = heroHeight + 'px';
        hero.style.width = heroWidth+ 'px';
        hero.style.top = '-' + heroOffsetTop + 'px';
        hero.style.left = '-' + heroOffsetLeft + 'px';
    }

    function hero() {
        for (var i = 0; i < heroParents.length; i++) {

            // Grab our elements

            var heroParent = heroParents[i];
            var existinghero = heroParent.querySelector('.hero');
            var heroImage = heroParent.querySelector('.hero-image');
            var heroImageSrc = heroImage.currentSrc;
            var heroContainer = heroParents[i].querySelector('.hero-container');
            var heroWidth = heroParent.getBoundingClientRect().width;
            var heroHeight = heroParent.getBoundingClientRect().height;
            var heroOffsetTop = (heroContainer.getBoundingClientRect().top - heroParent.getBoundingClientRect().top);
            var heroOffsetLeft = (heroContainer.getBoundingClientRect().left - heroParent.getBoundingClientRect().left);

            // If IE can't find currentSRC fallback to src

            if (heroImageSrc == null) {
                heroImageSrc = heroImage.src;
            }

            // If we didn't find a hero element, create a new one, otherwise just resize it.

            if (existinghero) {
                existinghero.style.backgroundImage = 'url(' + heroImageSrc + ')';
                heroParent.style.backgroundImage = 'url(' + heroImageSrc + ')';
                sizehero(existinghero, heroWidth, heroHeight, heroOffsetTop, heroOffsetLeft);
            } else {
                heroParent.style.backgroundImage = 'url(' + heroImageSrc + ')';
                var newhero = document.createElement('div');
                newhero.classList.add('hero');
                newhero.style.backgroundImage = 'url(' + heroImageSrc + ')';
                sizehero(newhero, heroWidth, heroHeight, heroOffsetTop, heroOffsetLeft);
                heroContainer.appendChild(newhero);
            }

        }
    }

    hero();

    window.addEventListener('resize', function(event) {
        hero();
    });

});
