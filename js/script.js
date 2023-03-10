window.onload = function () {
    const headerElement = document.querySelector('.header__top');
    if (window.scrollY > 0) {
        headerElement.classList.add('scroll');
    } else{
        headerElement.classList.remove('scroll');
    }
    const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(","), [0];
    });
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            let params = item.dataset.spollers;
            const breakpoint = {};
            params = String(params); //!добавил
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        let mediaQuerles = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + 'px),' + item.value + ',' + item.type;
        });
        mediaQuerles = mediaQuerles.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });

        mediaQuerles.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });

            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        });
    }

    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);
            } else {
                spollersBlock.classList.remove("init");
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e){
        const el =e.target;
        if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollerBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollerBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollerBlock.querySelectorAll('slide').length) {
                if(oneSpoller && !spollerTitle.classList.contains('active')){
                    hideSpollerBody(spollerBlock);
                }
                spollerTitle.classList.toggle('active');
                slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }
    function hideSpollerBody(spollerBlock) {
        const spollerActiveTitle = spollerBlock.querySelector('[data-spoller].active');
        if(spollerActiveTitle) {
            spollerActiveTitle.classList.remove('active');
            slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}

let slideUp = (target, duration = 500) => {
    if (!target.classList.contains('slide')) {
        target.classList.add('slide');
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = target.offsetHeight + "px";
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('slide');
        }, duration);
    }
}

let slideDown = (target, duration = 500) => {
    if (!target.classList.contains('slide')) {
        target.classList.add('slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('slide');
        }, duration);
    }
}

let slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return slideDown(target, duration);
    } else{
        return slideUp(target, duration);
    }
};
    const animItems = document.querySelectorAll('.anim-item');

if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);
    function animOnScroll(){
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)){
                animItem.classList.add('active');
            } else{
                if(!animItem.classList.contains('anim-no-hide')){
                    animItem.classList.remove('active');
                }

            }
        }
    }
    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.scrollX || document.documentElement.scrollLeft,
            scrollTop = window.scrollY || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
    }
    setTimeout(() =>{
        animOnScroll();
    }, 300);
}
;
    document.addEventListener("click", documentActions);
    function documentActions(e){
        const targetElement = e.target;

        if (targetElement.classList.contains('menu__icon')) {
            targetElement.classList.toggle('active');
            document.querySelector('.menu__body').classList.toggle('active');
        }
        if (targetElement.classList.contains('menu__link')){
            document.querySelector('.menu__body').classList.remove('active');
        }
    }

    window.addEventListener("scroll", function() {
        if (window.scrollY > 0) {
            headerElement.classList.add('scroll');
        } else{
            headerElement.classList.remove('scroll');
        }
    })

    const video = document.querySelector('.video');
    const playVideo = document.querySelector('.about__play');
    document.querySelector(".about__video").addEventListener("click", function() {
        if(video.paused) {
            video.play();
            playVideo.classList.add("play");
        } else{
            video.pause();
            playVideo.classList.remove("play");
        }
    });
}
