(($) => {
    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $('<' + newType + '/>', attrs).append($(this).contents());
        });
    };

    window.theme = {
        ...window.theme,

        settings: {
            lastScrollPosition: 0,
            storeId: 0,
        },
        /* Beginning General Functions */
        openApplyOverlayClose: function () {
            $('[data-toggle="closed"]').on('click', function () {
                let target = $($(this).data('target'));
                target.addClass('u-show').attr('data-toggle', 'open');

                $('[data-overlay="shadow"]').addClass('u-show');
                $('body').addClass('overflowed');
            });

            $('[data-overlay="shadow"]').on('click', function () {
                $('[data-toggle="open"]').removeClass('u-show').removeAttr('data-toggle');
                $('[data-overlay="shadow"]').removeClass('u-show');
                $('body').removeClass('overflowed');
            });

            $('[data-toggle="close"]').on('click', function () {
                $('[data-overlay="shadow"]').trigger('click');
            });
        },

        scrollHidesMenu: function () {
            const header = $('[data-header="scroll"]');
            let headerHeight = $('[data-header="scroll"]').outerHeight() + 20;
            let position = $(window).scrollTop() - 20;

            if (position > this.settings.lastScrollPosition && position > headerHeight) {
                header.addClass('u-effectHeader');
            } else if (position > headerHeight && position < this.settings.lastScrollPosition) {
                header.removeClass('u-effectHeader');
            }

            this.settings.lastScrollPosition = position;
        },

        getScroll: function () {
            let internal = this;

            $(window).on('scroll', function () {
                internal.scrollHidesMenu();
            });
        },

        mainMenuMobile: function () {
            $('[data-toggle="account"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });
        },
        /* --- End General Functions --- */

        bannerSlides: function () {
            const targetElement = '[data-slides="banner"]';
            if ($(targetElement).length) {
                const slideshow = $(targetElement);
                let size = $('.swiper-slide', slideshow).length;
                let settings = slideshow.data('settings');

                if (size > 0) {
                    new Swiper(`${targetElement} .swiper`, {
                        preloadImages: false,
                        loop: true,
                        autoHeight: true,
                        effect: 'slide',
                        autoplay: {
                            delay: settings.timer,
                            disableOnInteraction: false,
                        },
                        lazy: {
                            loadPrevNext: true,
                        },
                        pagination: {
                            el: `${targetElement} .swiper-pagination`,
                            bulletClass: 'icon-circle',
                            bulletActiveClass: 'icon-circle-empty',
                            clickable: !settings.isMobile,
                        },

                        navigation: {
                            prevEl: '.icon-arrow-left',
                            nextEl: '.icon-arrow-right',
                        },
                    });

                    if (settings.stopOnHover) {
                        $(`${targetElement} .swiper`).on('mouseenter', function () {
                            this.swiper.autoplay.stop();
                        });

                        $(`${targetElement} .swiper`).on('mouseleave', function () {
                            this.swiper.autoplay.start();
                        });
                    }
                }
            }
        },

        brandsSlides: function () {
            const targetElement = '[data-slides="brands"]';
            if (!$(targetElement).length) {
                $(`${targetElement} .brands-content`).remove();
            } else {
                new Swiper(`${targetElement} .swiper`, {
                    slidesPerView: 5,
                    lazy: {
                        loadPrevNext: true,
                    },
                    loop: false,
                    breakpoints: {
                        0: {
                            slidesPerView: 2,
                        },
                        600: {
                            slidesPerView: 4,
                        },
                        1000: {
                            slidesPerView: 5,
                        },
                    },
                    pagination: {
                        el: `${targetElement} .swiper-pagination`,
                        bulletClass: 'icon-circle',
                        bulletActiveClass: 'icon-circle-empty',
                        clickable: true,
                    },
                    on: {
                        init: function () {
                            $(targetElement).addClass('show');
                        },
                    },
                });
            }
        },

        depositionsSlidesOnHome: function () {
            const targetElement = '[data-slides="depositions"]';

            if (!$(targetElement).length) {
                $(`${targetElement} .dep_lista`).remove();
            } else {
                $('.dep_lista').changeElementType('div');
                $('.dep_item').changeElementType('div');

                $('.dep_item').addClass('swiper-slide');
                $(`${targetElement} .dep_lista`).addClass('swiper-wrapper').wrap('<div class="swiper"></div>');
                $(`${targetElement} .swiper`).append(`           
                    <div class="swiper-pagination"></div>
                `);

                let swiper = new Swiper(`${targetElement} .swiper`, {
                    slidesPerView: 3,
                    lazy: {
                        loadPrevNext: true,
                    },
                    loop: false,
                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                        },
                        600: {
                            slidesPerView: 2,
                        },
                        1000: {
                            slidesPerView: 3,
                        },
                    },
                    pagination: {
                        el: `${targetElement} .swiper-pagination`,
                        bulletClass: 'icon-circle',
                        bulletActiveClass: 'icon-circle-empty',
                        clickable: false,
                    },
                    on: {
                        init: function () {
                            $(targetElement).addClass('show');
                        },
                    },
                });

                $(`${targetElement} .dep_dados`).wrap('<a href="/depoimentos-de-clientes" title="Ver depoimento"></a>');
                $(`${targetElement} .dep_lista li:hidden`).remove();
            }
        },

        loadNewsPageOnHome: function () {
            if ($('.news').length) {
                let dataFiles = $('html').data('files');

                $.ajax({
                    url: `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method: 'get',
                    success: function (response) {
                        let target;
                        let pageNews;

                        if (!$(response).find('.noticias').length) {
                            $('.section.news').remove();
                            return;
                        }

                        target = $('.section.news .news-content');
                        pageNews = $($(response).find('.noticias'));

                        pageNews.find('li:nth-child(n+4)').remove();
                        pageNews.find('li').wrapInner('<div class="news-item"></div>');
                        pageNews = pageNews.contents();

                        pageNews.each(function (index, pageNews) {
                            const removeImage = $(pageNews).find('img').closest('div').remove();
                        });

                        target.append(pageNews);
                    },
                });
            }
        },

        /* Beginning Pages Tray Organization */
        toggleShowReviewsForm: function () {
            $('[data-toggle="reviews"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });
        },

        organizeNewsletterRegistrationPage: function () {
            if ($('.page-newsletter .formulario-newsletter').length) {
                $(
                    '.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input'
                )
                    .attr('placeholder', 'Digite o c&oacute;digo ao lado')
                    .trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('button2');
            } else {
                $('.page-newsletter .default-content').addClass('success-message-newsletter');
                $('.page-newsletter .default-content.success-message-newsletter .board p:first-child a')
                    .addClass('button2')
                    .html('Voltar para p&aacute;gina inicial');
            }

            setTimeout(function () {
                $('.page-newsletter .default-content').addClass('u-show');
            }, 200);
        },

        organizePagesTray: function () {
            const login = $('.caixa-cadastro #email_cadastro');
            const buttonReviewPage = $('.page-depoimentos .container .btn_submit');
            const titleReviewPage = $('.page-depoimentos .container #comentario_cliente');
            const buttonAdvancedSearch = $('.page-search #Vitrine input[type="image"]');

            $(login).attr('placeholder', 'Digite seu e-mail*');
            $(buttonReviewPage).html('Enviar Depoimento').addClass('button2 review-button');
            $(titleReviewPage).prepend(
                '<button class="review-form" data-toggle="reviews">Deixei seu depoimento sobre nós <span class="icon-arrow-simple" aria-hidden="true"></span></button>'
            );
            $(buttonAdvancedSearch).after('<button type="submit" class="button2">BUSCAR</button>');
            $(buttonAdvancedSearch).remove();
        },

        /* --- End Pages Tray Organization --- */
    };

    // execução das funçoes
    $(() => {
        theme.organizePagesTray();
        theme.getScroll();

        setTimeout(() => {
            theme.openApplyOverlayClose();
            theme.scrollHidesMenu();
            theme.mainMenuMobile();
            theme.toggleShowReviewsForm();
        }, 20);

        if ($('html').hasClass('page-home')) {
            setTimeout(function () {
                theme.bannerSlides();
                theme.loadNewsPageOnHome();
            }, 40);
            theme.depositionsSlidesOnHome();
            theme.brandsSlides();
        } else if ($('html').hasClass('page-newsletter')) {
            theme.organizeNewsletterRegistrationPage();
        }
    });
})(jQuery);
