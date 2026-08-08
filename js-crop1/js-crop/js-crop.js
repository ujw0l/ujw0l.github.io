/*
 * Js Crop
 * JavaScript library that enables image cropping
 * https://ujwolbastakoti.wordpress.com/
 * MIT License
 */

'use strict';

class jsCrop {

    constructor(sel, param2, param3) {

        let elList = Array.from(
            document.querySelectorAll(sel)
        );

        elList.forEach((el) => {

            if (
                undefined != el.type &&
                'file' == el.type
            ) {

                el.addEventListener(
                    'change',
                    event => {

                        let img =
                            event.target.files[0];

                        if (
                            undefined != img &&
                            typeof FileReader !== 'undefined'
                        ) {

                            const reader =
                                new FileReader();

                            reader.addEventListener(
                                'load',
                                event => {

                                    let uploadImg =
                                        new Image();

                                    uploadImg.src =
                                        event.target.result;

                                    uploadImg.addEventListener(
                                        'load',
                                        event =>
                                            this.createOverlay(
                                                event.target,
                                                param2,
                                                param3
                                            )
                                    );

                                }
                            );

                            reader.readAsDataURL(
                                img
                            );

                        }

                    }
                );

            } else {

                el.addEventListener(
                    'click',
                    event => {

                        let target =
                            event.currentTarget;

                        if (
                            target.tagName === 'IMG'
                        ) {

                            if (
                                target.complete &&
                                target.naturalWidth > 0
                            ) {

                                this.createOverlay(
                                    target,
                                    param2,
                                    param3
                                );

                            } else {

                                target.addEventListener(
                                    'load',
                                    event =>
                                        this.createOverlay(
                                            event.currentTarget,
                                            param2,
                                            param3
                                        ),
                                    {
                                        once: true
                                    }
                                );

                            }

                        } else if (
                            target.src
                        ) {

                            this.createOverlay(
                                target,
                                param2,
                                param3
                            );

                        }

                    }
                );

            }

        });


        window.addEventListener(
            'resize',
            event =>
                this.adjustApp(event)
        );


        window.addEventListener(
            'orientationchange',
            event => {

                setTimeout(
                    () =>
                        this.adjustApp(
                            event
                        ),
                    50
                );

            }
        );


        if (
            window.visualViewport
        ) {

            window.visualViewport.addEventListener(
                'resize',
                event =>
                    this.adjustApp(
                        event
                    )
            );

        }


        window.addEventListener(
            'keydown',
            event =>
                this.onKeyStroke(
                    event
                )
        );

    }


    /*
     * =========================================================
     * SVG ICONS
     * =========================================================
     */

    getToolbarIcon(name) {

        const icons = {

            select: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                    <path d="M16 3h3a2 2 0 0 1 2 2v3"/>
                    <path d="M8 21H5a2 2 0 0 1-2-2v-3"/>
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>

                </svg>
            `,

            crop: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                    <path d="M18 22V8a2 2 0 0 0-2-2H2"/>

                </svg>
            `,

            check: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="m5 12 4 4L19 6"/>

                </svg>
            `,

            reset: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="M3 12a9 9 0 1 0 3-6.7"/>
                    <path d="M3 4v6h6"/>

                </svg>
            `,

            undo: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="M9 14 4 9l5-5"/>
                    <path d="M4 9h10a6 6 0 0 1 6 6v1"/>

                </svg>
            `,

            redo: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="m15 14 5-5-5-5"/>
                    <path d="M20 9H10a6 6 0 0 0-6 6v1"/>

                </svg>
            `,

            download: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="M12 3v12"/>
                    <path d="m7 10 5 5 5-5"/>
                    <path d="M5 21h14a2 2 0 0 0 2-2v-3"/>
                    <path d="M3 16v3a2 2 0 0 0 2 2"/>

                </svg>
            `,

            close: `
                <svg
                    viewBox="0 0 24 24"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">

                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>

                </svg>
            `

        };

        return icons[name] || '';

    }


    /*
     * =========================================================
     * RESPONSIVE HELPERS
     * =========================================================
     */

    getViewportSize() {

        let width =
            window.innerWidth;

        let height =
            window.innerHeight;


        if (
            window.visualViewport
        ) {

            width =
                window.visualViewport.width ||
                width;

            height =
                window.visualViewport.height ||
                height;

        }


        return {

            width:
                Math.round(width),

            height:
                Math.round(height)

        };

    }


    isTouchDevice() {

        return (
            window.matchMedia &&
            window.matchMedia(
                '(pointer: coarse)'
            ).matches
        );

    }


    getResponsiveLayout() {

        let viewport =
            this.getViewportSize();


        let touch =
            this.isTouchDevice();


        let portrait =
            viewport.height >=
            viewport.width;


        let bottomToolbar =
            portrait &&
            viewport.width <= 900;


        let buttonSize =
            touch
                ? 48
                : 44;


        if (
            !bottomToolbar &&
            viewport.height < 420
        ) {

            buttonSize =
                touch
                    ? 44
                    : 40;

        }


        return {

            viewport:
                viewport,

            touch:
                touch,

            portrait:
                portrait,

            bottomToolbar:
                bottomToolbar,

            buttonSize:
                buttonSize,

            toolbarWidth:
                touch
                    ? 60
                    : 56,

            toolbarHeight:
                touch
                    ? 64
                    : 58,

            handleSize:
                touch
                    ? 18
                    : 12,

            closeSize:
                touch
                    ? 44
                    : 40

        };

    }


    getEditorMetrics() {

        let layout =
            this.getResponsiveLayout();


        let imageAreaWidth =
            layout.viewport.width;


        let imageAreaHeight =
            layout.viewport.height;


        if (
            layout.bottomToolbar
        ) {

            imageAreaHeight -=
                layout.toolbarHeight;

        } else {

            imageAreaWidth -=
                layout.toolbarWidth;

        }


        return {

            layout:
                layout,

            imageAreaWidth:
                Math.max(
                    100,
                    imageAreaWidth
                ),

            imageAreaHeight:
                Math.max(
                    100,
                    imageAreaHeight
                )

        };

    }


    /*
     * =========================================================
     * RESPONSIVE TOOLBAR
     * =========================================================
     */

    applyToolbarLayout(toolbar) {

        if (!toolbar) {
            return;
        }


        let layout =
            this.getResponsiveLayout();


        toolbar.style.position =
            'absolute';

        toolbar.style.display =
            'flex';

        toolbar.style.alignItems =
            'center';

        toolbar.style.gap =
            '6px';

        toolbar.style.boxSizing =
            'border-box';

        toolbar.style.zIndex =
            '1001500';


        if (
            layout.bottomToolbar
        ) {

            /*
             * Portrait mobile / tablet
             */

            toolbar.style.left =
                '0';

            toolbar.style.right =
                '0';

            toolbar.style.bottom =
                '0';

            toolbar.style.top =
                'auto';


            toolbar.style.width =
                '100%';

            toolbar.style.height =
                layout.toolbarHeight +
                'px';


            toolbar.style.flexDirection =
                'row';


            /*
             * Center toolbar in portrait.
             */
            toolbar.style.justifyContent =
                'center';


            toolbar.style.padding =
                '8px 10px';


            toolbar.style.overflowX =
                'auto';

            toolbar.style.overflowY =
                'hidden';


            toolbar.style.borderLeft =
                'none';


            toolbar.style.borderTop =
                '1px solid rgba(255,255,255,0.10)';


            toolbar.style.boxShadow =
                '0 -4px 18px rgba(0,0,0,0.22)';

        } else {

            /*
             * Desktop / landscape.
             */

            toolbar.style.right =
                '0';

            toolbar.style.left =
                'auto';

            toolbar.style.top =
                '0';

            toolbar.style.bottom =
                '0';


            toolbar.style.width =
                layout.toolbarWidth +
                'px';

            toolbar.style.height =
                '100%';


            toolbar.style.flexDirection =
                'column';


            toolbar.style.justifyContent =
                'center';


            toolbar.style.padding =
                '8px 6px';


            toolbar.style.overflowY =
                'auto';

            toolbar.style.overflowX =
                'hidden';


            toolbar.style.borderTop =
                'none';


            toolbar.style.borderLeft =
                '1px solid rgba(255,255,255,0.10)';


            toolbar.style.boxShadow =
                '-4px 0 18px rgba(0,0,0,0.22)';

        }


        Array.from(
            toolbar.children
        ).forEach(
            button => {

                button.style.width =
                    layout.buttonSize +
                    'px';

                button.style.height =
                    layout.buttonSize +
                    'px';

            }
        );

    }


    /*
     * =========================================================
     * IMAGE FITTING
     * =========================================================
     */

    fitImageToEditor(
        imgEl,
        actualWidth,
        actualHeight,
        updateRatio = true
    ) {

        let metrics =
            this.getEditorMetrics();


        let dimensions =
            this.getOptimizedImageSize(

                metrics.imageAreaWidth,

                metrics.imageAreaHeight,

                actualWidth,

                actualHeight

            );


        let width =
            Math.max(
                1,
                Math.round(
                    dimensions.width
                )
            );


        let height =
            Math.max(
                1,
                Math.round(
                    dimensions.height
                )
            );


        imgEl.width =
            width;

        imgEl.height =
            height;


        imgEl.style.marginLeft =
            (
                (
                    metrics.imageAreaWidth -
                    width
                ) / 2
            ) + 'px';


        imgEl.style.marginTop =
            (
                (
                    metrics.imageAreaHeight -
                    height
                ) / 2
            ) + 'px';


        if (
            updateRatio &&
            width > 0 &&
            height > 0
        ) {

            imgEl.setAttribute(
                'data-dim-ratio',

                `${
                    actualWidth /
                    width
                },${
                    actualHeight /
                    height
                }`
            );

        }


        return {

            width:
                width,

            height:
                height

        };

    }


    /*
     * =========================================================
     * BUTTON UX
     * =========================================================
     */

    addToolbarButtonUX(
        button,
        btnBgColor,
        title
    ) {

        button.title =
            title;


        button.setAttribute(
            'aria-label',
            title
        );


        button.setAttribute(
            'role',
            'button'
        );


        button.setAttribute(
            'tabindex',
            '0'
        );


        button.setAttribute(
            'draggable',
            false
        );


        button.setAttribute(
            'data-default-bg',
            btnBgColor
        );


        button.addEventListener(
            'mouseenter',
            event => {

                let target =
                    event.currentTarget;


                target.style.transform =
                    'translateY(-2px) scale(1.03)';


                target.style.filter =
                    'brightness(1.20)';


                target.style.borderColor =
                    'rgba(255,255,255,0.42)';


                target.style.boxShadow =
                    '0 6px 16px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.15)';

            }
        );


        button.addEventListener(
            'mouseleave',
            event => {

                let target =
                    event.currentTarget;


                target.style.transform =
                    'translateY(0) scale(1)';


                target.style.filter =
                    'brightness(1)';


                target.style.borderColor =
                    'rgba(255,255,255,0.18)';


                target.style.boxShadow =
                    '0 2px 7px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)';

            }
        );


        button.addEventListener(
            'pointerdown',
            event => {

                event.currentTarget
                    .style.transform =
                    'translateY(1px) scale(0.93)';

            }
        );


        button.addEventListener(
            'pointerup',
            event => {

                event.currentTarget
                    .style.transform =
                    'translateY(0) scale(1)';

            }
        );


        button.addEventListener(
            'pointercancel',
            event => {

                event.currentTarget
                    .style.transform =
                    'translateY(0) scale(1)';

            }
        );


        button.addEventListener(
            'focus',
            event => {

                event.currentTarget
                    .style.outline =
                    '2px solid rgba(255,255,255,0.95)';


                event.currentTarget
                    .style.outlineOffset =
                    '2px';

            }
        );


        button.addEventListener(
            'blur',
            event => {

                event.currentTarget
                    .style.outline =
                    'none';

            }
        );


        button.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    event.currentTarget.click();

                }

            }
        );

    }


    resetCropButtonUI() {

        let button =
            document.querySelector(
                '#start-crop'
            );


        if (!button) {
            return;
        }


        button.innerHTML =
            this.getToolbarIcon(
                'select'
            );


        button.title =
            'Select crop area';


        button.setAttribute(
            'aria-label',
            'Select crop area'
        );


        button.removeAttribute(
            'data-active'
        );


        button.style.background =
            button.getAttribute(
                'data-default-bg'
            ) || '';

    }


    /*
     * =========================================================
     * CREATE OVERLAY
     * =========================================================
     */

    createOverlay(
        img,
        param2,
        param3
    ) {

        if (
            document.querySelector(
                '#js-crop-overlay'
            )
        ) {

            this.closeOverlay();

        }


        this._previousBodyOverflow =
            document.body.style.overflow;


        this._previousBodyMargin =
            document.body.style.margin;


        let imgType =
            undefined != param2 &&
            undefined !=
                param2.imageType &&
            'jpeg' ==
                param2.imageType

                ? param2.imageType
                : 'png';


        let imgQuality =
            undefined != param2 &&
            undefined !=
                param2.imageQuality

                ? param2.imageQuality
                : '1';


        let scrollCss =
            document.createElement(
                'style'
            );


        scrollCss.id =
            'ctc-scroll-css';


        scrollCss.innerHTML = `
            body {
                overflow:hidden !important;
                margin:0 !important;
            }

            #js-crop-overlay,
            #js-crop-overlay * {
                box-sizing:border-box;
            }

            #js-crop-toolbar {
                scrollbar-width:none;
                overscroll-behavior:contain;
            }

            #js-crop-toolbar::-webkit-scrollbar {
                display:none;
            }

            #js-crop-image {
                max-width:none !important;
                max-height:none !important;
                user-select:none;
                -webkit-user-drag:none;
            }
        `;


        document.head.appendChild(
            scrollCss
        );


        window.scrollTo(
            0,
            0
        );


        let viewport =
            this.getViewportSize();


        let overlayDiv =
            document.createElement(
                'div'
            );


        let overlayBgColor =
            undefined != param2 &&
            undefined !=
                param2.customColor &&
            undefined !=
                param2.customColor
                    .overlayBgColor

                ? param2.customColor
                    .overlayBgColor

                : 'rgba(10,10,12,0.98)';


        overlayDiv.id =
            'js-crop-overlay';


        overlayDiv.setAttribute(
            'draggable',
            false
        );


        overlayDiv.style = `
            position:fixed;
            left:0;
            top:0;

            width:${viewport.width}px;
            height:${viewport.height}px;

            overflow:hidden;

            user-select:none;

            background:${overlayBgColor};

            z-index:100000;

            touch-action:none;
        `;


        document.body.insertBefore(
            overlayDiv,
            document.body.firstChild
        );


        /*
         * Image
         */

        let orgImage =
            new Image();


        orgImage.src =
            img.src;


        let actualWidth =
            img.naturalWidth ||
            orgImage.naturalWidth ||
            img.width;


        let actualHeight =
            img.naturalHeight ||
            orgImage.naturalHeight ||
            img.height;


        orgImage.id =
            'js-crop-image';


        orgImage.style = `
            position:relative;
            display:block;
            border:0;

            box-shadow:
                0 8px 32px
                rgba(0,0,0,0.38);

            user-select:none;
            -webkit-user-drag:none;
        `;


        orgImage.setAttribute(
            'draggable',
            false
        );


        orgImage.setAttribute(
            'data-img-type',
            imgType
        );


        orgImage.setAttribute(
            'data-img-quality',
            imgQuality
        );


        orgImage.setAttribute(
            'data-crop-status',
            'in-active'
        );


        orgImage.setAttribute(
            'data-crop-step',
            '0'
        );


        /*
         * Always preserve original
         * uncropped image.
         */
        orgImage.setAttribute(
            'data-crop-0',
            orgImage.src
        );


        orgImage.setAttribute(
            'data-crop-count',
            '0'
        );


        overlayDiv.appendChild(
            orgImage
        );


        let initialDimensions =
            this.fitImageToEditor(

                orgImage,

                actualWidth,

                actualHeight,

                true

            );


        orgImage.setAttribute(
            'data-original-width',
            actualWidth
        );


        orgImage.setAttribute(
            'data-original-height',
            actualHeight
        );


        /*
         * Close button
         */

        let closeButton =
            document.createElement(
                'span'
            );


        closeButton.id =
            'js-crop-close-btn';


        closeButton.innerHTML =
            this.getToolbarIcon(
                'close'
            );


        closeButton.title =
            'Close';


        closeButton.setAttribute(
            'aria-label',
            'Close image editor'
        );


        closeButton.setAttribute(
            'role',
            'button'
        );


        closeButton.setAttribute(
            'tabindex',
            '0'
        );


        let layout =
            this.getResponsiveLayout();


        closeButton.style = `
            position:absolute;

            left:12px;
            top:12px;

            width:${layout.closeSize}px;
            height:${layout.closeSize}px;

            padding:10px;

            display:flex;
            align-items:center;
            justify-content:center;

            cursor:pointer;

            color:#fff;

            background:
                rgba(20,20,22,0.72);

            border:
                1px solid
                rgba(255,255,255,0.18);

            border-radius:50%;

            box-shadow:
                0 4px 14px
                rgba(0,0,0,0.34);

            backdrop-filter:blur(10px);
            -webkit-backdrop-filter:blur(10px);

            z-index:1002000;

            transition:
                transform .15s ease,
                background .15s ease,
                border-color .15s ease;
        `;


        closeButton.addEventListener(
            'mouseenter',
            event => {

                event.currentTarget.style.transform =
                    'scale(1.08)';


                event.currentTarget.style.background =
                    'rgba(42,42,46,0.95)';

            }
        );


        closeButton.addEventListener(
            'mouseleave',
            event => {

                event.currentTarget.style.transform =
                    'scale(1)';


                event.currentTarget.style.background =
                    'rgba(20,20,22,0.72)';

            }
        );


        closeButton.addEventListener(
            'click',
            () =>
                this.closeOverlay()
        );


        closeButton.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    this.closeOverlay();

                }

            }
        );


        overlayDiv.appendChild(
            closeButton
        );


        this.createToolbar(

            overlayDiv,

            orgImage.src,

            {

                height:
                    initialDimensions.height,

                width:
                    initialDimensions.width,

                dimRatio:
                    orgImage.getAttribute(
                        'data-dim-ratio'
                    )

            },

            param2,

            param3

        );

    }


    /*
     * =========================================================
     * RESIZE / ORIENTATION
     * =========================================================
     */

    adjustApp(e) {

        let overlay =
            document.querySelector(
                '#js-crop-overlay'
            );


        if (!overlay) {
            return;
        }


        let viewport =
            this.getViewportSize();


        overlay.style.width =
            viewport.width +
            'px';


        overlay.style.height =
            viewport.height +
            'px';


        let toolbar =
            document.querySelector(
                '#js-crop-toolbar'
            );


        this.applyToolbarLayout(
            toolbar
        );


        let closeButton =
            document.querySelector(
                '#js-crop-close-btn'
            );


        if (closeButton) {

            let layout =
                this.getResponsiveLayout();


            closeButton.style.width =
                layout.closeSize +
                'px';


            closeButton.style.height =
                layout.closeSize +
                'px';

        }


        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (!imgEl) {
            return;
        }


        let bufferImg =
            new Image();


        const resizeImage = () => {

            this.fitImageToEditor(

                imgEl,

                bufferImg.naturalWidth ||
                    bufferImg.width,

                bufferImg.naturalHeight ||
                    bufferImg.height,

                true

            );

        };


        bufferImg.onload =
            resizeImage;


        bufferImg.src =
            imgEl.src;


        if (
            bufferImg.complete &&
            bufferImg.naturalWidth
        ) {

            resizeImage();

        }


        let cropRect =
            document.querySelector(
                '#cropRect'
            );


        if (cropRect) {

            cropRect.remove();

        }


        this.resetCropButtonUI();


        imgEl.setAttribute(
            'data-crop-status',
            'in-active'
        );


        imgEl.style.cursor =
            '';


        imgEl.style.touchAction =
            '';


        imgEl.removeAttribute(
            'data-start-co'
        );

    }


    /*
     * =========================================================
     * TOOLBAR
     * =========================================================
     */

    createToolbar(
        overlayDiv,
        imgSrc,
        imgDim,
        param2,
        param3
    ) {

        let imgType =
            undefined != param2 &&
            undefined !=
                param2.imageType &&
            'jpeg' ==
                param2.imageType

                ? param2.imageType
                : 'png';


        let toolbar =
            document.createElement(
                'div'
            );


        toolbar.id =
            'js-crop-toolbar';


        let toolbarBgColor =
            undefined != param2 &&
            undefined !=
                param2.customColor &&
            undefined !=
                param2.customColor
                    .toolbarBgColor

                ? param2.customColor
                    .toolbarBgColor

                : 'rgba(18,18,20,0.84)';


        toolbar.style = `
            background:${toolbarBgColor};

            color:#fff;

            backdrop-filter:blur(14px);
            -webkit-backdrop-filter:blur(14px);

            user-select:none;

            -webkit-overflow-scrolling:touch;

            overscroll-behavior:contain;
        `;


        overlayDiv.appendChild(
            toolbar
        );


        this.applyToolbarLayout(
            toolbar
        );


        let btnFontColor =
            undefined != param2 &&
            undefined !=
                param2.customColor &&
            undefined !=
                param2.customColor
                    .buttonFontColor

                ? param2.customColor
                    .buttonFontColor

                : '#fff';


        let btnBgColor =
            undefined != param2 &&
            undefined !=
                param2.customColor &&
            undefined !=
                param2.customColor
                    .buttonBgColor

                ? param2.customColor
                    .buttonBgColor

                : 'rgba(255,255,255,0.10)';


        let layout =
            this.getResponsiveLayout();


        let iconPadding =
            Math.max(
                9,
                Math.round(
                    layout.buttonSize *
                    0.23
                )
            );


        let btnStyle = `
            flex:0 0 auto;

            width:${layout.buttonSize}px;
            height:${layout.buttonSize}px;

            padding:${iconPadding}px;

            display:flex;

            align-items:center;
            justify-content:center;

            color:${btnFontColor};

            background:${btnBgColor};

            border:
                1px solid
                rgba(255,255,255,0.18);

            border-radius:11px;

            opacity:0;

            cursor:pointer;

            user-select:none;

            touch-action:manipulation;

            -webkit-tap-highlight-color:transparent;

            box-shadow:
                0 2px 7px rgba(0,0,0,0.30),
                inset 0 1px 0 rgba(255,255,255,0.08);

            transition:
                transform .14s ease,
                box-shadow .14s ease,
                border-color .14s ease,
                filter .14s ease,
                opacity .20s ease,
                background .14s ease;
        `;


        /*
         * Select crop
         */

        let cropButton =
            document.createElement(
                'div'
            );


        cropButton.id =
            'start-crop';


        cropButton.style =
            btnStyle;


        cropButton.innerHTML =
            this.getToolbarIcon(
                'select'
            );


        this.addToolbarButtonUX(

            cropButton,

            btnBgColor,

            'Select crop area'

        );


        cropButton.addEventListener(
            'click',
            event =>
                this.addCropEventListener(
                    event
                )
        );


        toolbar.appendChild(
            cropButton
        );


        /*
         * Revert original
         */

        let resetButton =
            document.createElement(
                'div'
            );


        resetButton.id =
            'revert-to-original';


        resetButton.style =
            btnStyle;


        resetButton.innerHTML =
            this.getToolbarIcon(
                'reset'
            );


        resetButton.setAttribute(
            'data-img-dimension',
            imgDim.height +
            ',' +
            imgDim.width
        );


        resetButton.setAttribute(
            'data-dim-ratio',
            imgDim.dimRatio
        );


        this.addToolbarButtonUX(

            resetButton,

            btnBgColor,

            'Revert to original image'

        );


        resetButton.addEventListener(
            'click',
            event =>
                this.revertToOriginal(
                    event
                )
        );


        toolbar.appendChild(
            resetButton
        );


        /*
         * Undo
         */

        let undoButton =
            document.createElement(
                'div'
            );


        undoButton.id =
            'previous-step';


        undoButton.style =
            btnStyle;


        undoButton.innerHTML =
            this.getToolbarIcon(
                'undo'
            );


        this.addToolbarButtonUX(

            undoButton,

            btnBgColor,

            'Undo crop'

        );


        undoButton.addEventListener(
            'click',
            event =>
                this.restorePreviousCrop(
                    event
                )
        );


        toolbar.appendChild(
            undoButton
        );


        /*
         * Redo
         */

        let redoButton =
            document.createElement(
                'div'
            );


        redoButton.id =
            'next-step';


        redoButton.style =
            btnStyle;


        redoButton.innerHTML =
            this.getToolbarIcon(
                'redo'
            );


        this.addToolbarButtonUX(

            redoButton,

            btnBgColor,

            'Redo crop'

        );


        redoButton.addEventListener(
            'click',
            event =>
                this.restoreNextCrop(
                    event
                )
        );


        toolbar.appendChild(
            redoButton
        );


        /*
         * Save / download
         */

        const addSaveButton = () => {

            let saveButton =
                document.createElement(
                    'div'
                );


            saveButton.id =
                'save-image';


            saveButton.style =
                btnStyle;


            saveButton.innerHTML =
                this.getToolbarIcon(
                    'download'
                );


            this.addToolbarButtonUX(

                saveButton,

                btnBgColor,

                'Download image'

            );


            saveButton.addEventListener(
                'click',
                () => {

                    let link =
                        document.createElement(
                            'a'
                        );


                    link.href =
                        this.currentImgToBlob();


                    link.setAttribute(
                        'download',
                        'image.' +
                        imgType
                    );


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    link.remove();

                }
            );


            toolbar.appendChild(
                saveButton
            );

        };


        if (param2) {

            if (
                false !==
                param2.saveButton
            ) {

                addSaveButton();

            }


            if (
                param2.extButton &&
                'function' ===
                    typeof
                    param2.extButton
                        .callBack
            ) {

                let extButton =
                    document.createElement(
                        'div'
                    );


                extButton.id =
                    'ext-button';


                extButton.style =
                    undefined !=
                        param2.extButton
                            .buttonCSS

                        ? btnStyle +
                          param2.extButton
                            .buttonCSS

                        : btnStyle;


                extButton.innerHTML =
                    param2.extButton
                        .buttonText ||
                    'ext';


                this.addToolbarButtonUX(

                    extButton,

                    btnBgColor,

                    param2.extButton
                        .buttonTitle ||
                    'Extension'

                );


                extButton.addEventListener(
                    'click',
                    () =>
                        param2.extButton
                            .callBack(
                                this.currentImgToBlob()
                            )
                );


                toolbar.appendChild(
                    extButton
                );

            }

        } else {

            addSaveButton();

        }


        /*
         * Additional custom buttons
         */

        if (
            Array.isArray(param3)
        ) {

            param3.forEach(
                (x, i) => {

                    let buttonEvent =
                        x.buttonEvent ||
                        'click';


                    let addButton =
                        document.createElement(
                            'div'
                        );


                    addButton.id =
                        `ext-button-${i}`;


                    addButton.style =
                        undefined !=
                            x.buttonCSS

                            ? btnStyle +
                              x.buttonCSS

                            : btnStyle;


                    addButton.innerHTML =
                        x.buttonText ||
                        'ext';


                    this.addToolbarButtonUX(

                        addButton,

                        btnBgColor,

                        x.buttonTitle ||
                        `Button ${i + 1}`

                    );


                    if (
                        'function' ===
                        typeof x.callBack
                    ) {

                        addButton.addEventListener(

                            buttonEvent,

                            () =>
                                x.callBack(

                                    this.currentImgToBlob(),

                                    x.relParam

                                )

                        );

                    }


                    toolbar.appendChild(
                        addButton
                    );

                }
            );

        }


        this.applyToolbarLayout(
            toolbar
        );


        Array.from(
            toolbar.children
        ).forEach(
            (button, index) => {

                setTimeout(
                    () => {

                        button.style.opacity =
                            '1';

                    },

                    35 * index
                );


                button.addEventListener(
                    'click',
                    () => {

                        if (
                            button.id ===
                            'start-crop'
                        ) {

                            return;

                        }


                        let cropRect =
                            document.querySelector(
                                '#cropRect'
                            );


                        if (cropRect) {

                            cropRect.remove();

                        }


                        this.resetCropButtonUI();


                        let img =
                            document.querySelector(
                                '#js-crop-image'
                            );


                        if (img) {

                            img.setAttribute(
                                'data-crop-status',
                                'in-active'
                            );


                            img.style.cursor =
                                '';


                            img.style.touchAction =
                                '';


                            img.removeAttribute(
                                'data-start-co'
                            );

                        }

                    }
                );

            }
        );

    }


    /*
     * =========================================================
     * INPUT EVENTS
     * =========================================================
     */

    addInputEventListener(
        el,
        eventType,
        callBack
    ) {

        let pointerEvent = {

            start:
                'pointerdown',

            move:
                'pointermove',

            end:
                'pointerup',

            cancel:
                'pointercancel'

        };


        let mouseEvent = {

            start:
                'mousedown',

            move:
                'mousemove',

            end:
                'mouseup'

        };


        let touchEvent = {

            start:
                'touchstart',

            move:
                'touchmove',

            end:
                'touchend',

            cancel:
                'touchcancel'

        };


        if (
            window.PointerEvent
        ) {

            el.addEventListener(
                pointerEvent[eventType],
                callBack
            );

        } else {

            if (
                mouseEvent[eventType]
            ) {

                el.addEventListener(
                    mouseEvent[eventType],
                    callBack
                );

            }


            if (
                touchEvent[eventType]
            ) {

                el.addEventListener(
                    touchEvent[eventType],
                    callBack,
                    {
                        passive: false
                    }
                );

            }

        }

    }


    getInputCoordinates(
        e,
        el
    ) {

        let input =

            e.touches &&
            e.touches.length

                ? e.touches[0]

                :

            e.changedTouches &&
            e.changedTouches.length

                ? e.changedTouches[0]

                : e;


        let rect =
            el.getBoundingClientRect();


        return {

            clientX:
                input.clientX,

            clientY:
                input.clientY,

            offsetX:
                input.clientX -
                rect.left,

            offsetY:
                input.clientY -
                rect.top

        };

    }


    preventCropScroll(e) {

        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        let cropRect =
            document.querySelector(
                '#cropRect'
            );


        if (
            e.cancelable &&
            (
                (
                    imgEl &&
                    imgEl.getAttribute(
                        'data-mouse-status'
                    ) === 'down'
                ) ||
                (
                    cropRect &&
                    cropRect.getAttribute(
                        'data-resize'
                    )
                )
            )
        ) {

            e.preventDefault();

        }

    }


    /*
     * =========================================================
     * HANDLE INPUT
     * =========================================================
     */

    addResizeEventListeners(
        resizeBox,
        cropRect,
        imgEl
    ) {

        this.addInputEventListener(
            resizeBox,
            'start',
            event => {

                if (
                    undefined !=
                        event.button &&
                    event.button !== 0
                ) {

                    return;

                }


                cropRect.removeAttribute(
                    'data-prev-mousepos'
                );


                imgEl.setAttribute(
                    'data-mouse-status',
                    'up'
                );


                cropRect.setAttribute(
                    'data-resize',
                    resizeBox.id
                );


                this.preventCropScroll(
                    event
                );


                if (
                    event.pointerId != null &&
                    resizeBox.setPointerCapture
                ) {

                    resizeBox.setPointerCapture(
                        event.pointerId
                    );

                }

            }
        );


        let endResize =
            event => {

                this.preventCropScroll(
                    event
                );


                cropRect.removeAttribute(
                    'data-resize'
                );


                cropRect.removeAttribute(
                    'data-prev-mousepos'
                );

            };


        this.addInputEventListener(
            resizeBox,
            'end',
            endResize
        );


        this.addInputEventListener(
            resizeBox,
            'cancel',
            endResize
        );

    }


    /*
     * =========================================================
     * CROP MODE
     * =========================================================
     */

    addCropEventListener(e) {

        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        let button =
            e.currentTarget;


        if (!imgEl) {
            return;
        }


        imgEl.setAttribute(
            'data-mouse-status',
            'up'
        );


        if (
            imgEl.getAttribute(
                'data-crop-status'
            ) === 'in-active'
        ) {

            imgEl.style.cursor =
                'crosshair';


            imgEl.style.touchAction =
                'none';


            imgEl.setAttribute(
                'data-crop-status',
                'active'
            );


            button.innerHTML =
                this.getToolbarIcon(
                    'check'
                );


            button.title =
                'Apply crop';


            button.setAttribute(
                'aria-label',
                'Apply crop'
            );


            button.setAttribute(
                'data-active',
                'true'
            );


            button.style.background =
                'rgba(38,140,82,0.95)';


            if (
                !imgEl.hasAttribute(
                    'data-crop-input-listeners'
                )
            ) {

                this.addInputEventListener(
                    imgEl,
                    'start',
                    event => {

                        if (
                            undefined !=
                                event.button &&
                            event.button !== 0
                        ) {

                            return;

                        }


                        if (
                            imgEl.getAttribute(
                                'data-crop-status'
                            ) ===
                            'in-active'
                        ) {

                            return;

                        }


                        let oldRect =
                            document.querySelector(
                                '#cropRect'
                            );


                        if (oldRect) {

                            oldRect.remove();

                        }


                        let input =
                            this.getInputCoordinates(
                                event,
                                imgEl
                            );


                        imgEl.setAttribute(
                            'data-start-co',
                            `${
                                input.offsetX
                            },${
                                input.offsetY
                            }`
                        );


                        imgEl.setAttribute(
                            'data-mouse-status',
                            'down'
                        );


                        this.preventCropScroll(
                            event
                        );


                        if (
                            event.pointerId != null &&
                            imgEl.setPointerCapture
                        ) {

                            imgEl.setPointerCapture(
                                event.pointerId
                            );

                        }

                    }
                );


                this.addInputEventListener(
                    imgEl,
                    'move',
                    event => {

                        if (
                            imgEl.getAttribute(
                                'data-crop-status'
                            ) ===
                            'in-active'
                        ) {

                            return;

                        }


                        this.preventCropScroll(
                            event
                        );


                        this.createCropBox(
                            event
                        );

                    }
                );


                imgEl.setAttribute(
                    'data-crop-input-listeners',
                    'true'
                );

            }


            let overlay =
                document.querySelector(
                    '#js-crop-overlay'
                );


            if (
                overlay &&
                !overlay.hasAttribute(
                    'data-crop-end-listener'
                )
            ) {

                let endGesture =
                    () => {

                        if (
                            imgEl.getAttribute(
                                'data-crop-status'
                            ) ===
                            'in-active'
                        ) {

                            return;

                        }


                        if (
                            imgEl.getAttribute(
                                'data-mouse-status'
                            ) ===
                            'down'
                        ) {

                            imgEl.setAttribute(
                                'data-crop-status',
                                'crop-ready'
                            );


                            imgEl.setAttribute(
                                'data-mouse-status',
                                'up'
                            );

                        }

                    };


                this.addInputEventListener(
                    overlay,
                    'end',
                    endGesture
                );


                this.addInputEventListener(
                    overlay,
                    'cancel',
                    endGesture
                );


                overlay.setAttribute(
                    'data-crop-end-listener',
                    'true'
                );

            }

        } else if (
            imgEl.getAttribute(
                'data-crop-status'
            ) === 'crop-ready'
        ) {

            let cropRect =
                document.querySelector(
                    '#cropRect'
                );


            if (cropRect) {

                this.endCrop();

            }


            this.resetCropButtonUI();


            imgEl.setAttribute(
                'data-crop-status',
                'in-active'
            );


            imgEl.style.touchAction =
                '';


            imgEl.style.cursor =
                '';

        }

    }


    /*
     * =========================================================
     * REVERT ORIGINAL
     * =========================================================
     */

    revertToOriginal(e) {

        let overlayDiv =
            document.querySelector(
                '#js-crop-overlay'
            );


        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (
            !imgEl ||
            !overlayDiv
        ) {

            return;

        }


        let cropStepCount =
            parseInt(
                imgEl.getAttribute(
                    'data-crop-count'
                )
            ) || 0;


        /*
         * data-crop-0 is always
         * the original image.
         */
        let originalImage =
            imgEl.getAttribute(
                'data-crop-0'
            );


        if (!originalImage) {
            return;
        }


        let bufferImg =
            new Image();


        imgEl.setAttribute(
            'data-crop-count',
            '0'
        );


        imgEl.setAttribute(
            'data-crop-step',
            '0'
        );


        /*
         * Delete crop history only.
         * Never delete data-crop-0.
         */
        for (
            let i = 1;
            i <= cropStepCount;
            i++
        ) {

            imgEl.removeAttribute(
                'data-crop-' + i
            );

        }


        bufferImg.addEventListener(
            'load',
            () => {

                imgEl.src =
                    originalImage;


                this.fitImageToEditor(

                    imgEl,

                    bufferImg.naturalWidth ||
                        bufferImg.width,

                    bufferImg.naturalHeight ||
                        bufferImg.height,

                    true

                );


                imgEl.setAttribute(
                    'data-crop-status',
                    'in-active'
                );


                imgEl.style.touchAction =
                    '';


                imgEl.style.cursor =
                    '';


                imgEl.removeAttribute(
                    'data-mouse-status'
                );


                imgEl.removeAttribute(
                    'data-start-co'
                );


                let cropRect =
                    document.querySelector(
                        '#cropRect'
                    );


                if (cropRect) {

                    cropRect.remove();

                }


                this.resetCropButtonUI();

            }
        );


        bufferImg.src =
            originalImage;

    }


    /*
     * =========================================================
     * UNDO
     * =========================================================
     */

    restorePreviousCrop(e) {

        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (!imgEl) {
            return;
        }


        let current =
            parseInt(
                imgEl.getAttribute(
                    'data-crop-step'
                )
            ) || 0;


        if (
            current <= 0
        ) {

            return;

        }


        let previous =
            current - 1;


        let src =
            imgEl.getAttribute(
                'data-crop-' +
                previous
            );


        if (!src) {
            return;
        }


        let buffer =
            new Image();


        buffer.onload =
            () => {

                imgEl.src =
                    src;


                imgEl.setAttribute(
                    'data-crop-step',
                    previous
                );


                this.fitImageToEditor(

                    imgEl,

                    buffer.naturalWidth,

                    buffer.naturalHeight,

                    true

                );

            };


        buffer.src =
            src;

    }


    /*
     * =========================================================
     * REDO
     * =========================================================
     */

    restoreNextCrop(e) {

        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (!imgEl) {
            return;
        }


        let current =
            parseInt(
                imgEl.getAttribute(
                    'data-crop-step'
                )
            ) || 0;


        let total =
            parseInt(
                imgEl.getAttribute(
                    'data-crop-count'
                )
            ) || 0;


        let next =
            current + 1;


        if (
            next > total
        ) {

            return;

        }


        let src =
            imgEl.getAttribute(
                'data-crop-' +
                next
            );


        if (!src) {
            return;
        }


        let buffer =
            new Image();


        buffer.onload =
            () => {

                imgEl.src =
                    src;


                imgEl.setAttribute(
                    'data-crop-step',
                    next
                );


                this.fitImageToEditor(

                    imgEl,

                    buffer.naturalWidth,

                    buffer.naturalHeight,

                    true

                );

            };


        buffer.src =
            src;

    }


    /*
     * =========================================================
     * CURRENT IMAGE TO DATA URL
     * =========================================================
     */

    currentImgToBlob() {

        let loadedImg =
            document.querySelector(
                '#js-crop-image'
            );


        let ratio =
            loadedImg
                .getAttribute(
                    'data-dim-ratio'
                )
                .split(',');


        let imgType =
            `image/${
                loadedImg.getAttribute(
                    'data-img-type'
                )
            }`;


        let quality =
            parseFloat(
                loadedImg.getAttribute(
                    'data-img-quality'
                )
            );


        let widthRatio =
            parseFloat(
                ratio[0]
            );


        let heightRatio =
            parseFloat(
                ratio[1]
            );


        let canvas =
            document.createElement(
                'canvas'
            );


        let ctx =
            canvas.getContext(
                '2d'
            );


        canvas.width =
            loadedImg.offsetWidth;


        canvas.height =
            loadedImg.offsetHeight;


        ctx.imageSmoothingEnabled =
            true;


        ctx.imageSmoothingQuality =
            'high';


        ctx.drawImage(

            loadedImg,

            0,
            0,

            loadedImg.offsetWidth *
                widthRatio,

            loadedImg.offsetHeight *
                heightRatio,

            0,
            0,

            loadedImg.offsetWidth,

            loadedImg.offsetHeight

        );


        return canvas.toDataURL(
            imgType,
            quality
        );

    }


    /*
     * =========================================================
     * CLOSE
     * =========================================================
     */

    closeOverlay() {

        let overlay =
            document.querySelector(
                '#js-crop-overlay'
            );


        if (overlay) {

            overlay.remove();

        }


        let css =
            document.querySelector(
                '#ctc-scroll-css'
            );


        if (css) {

            css.remove();

        }


        document.body.style.overflow =
            this._previousBodyOverflow ||
            '';


        document.body.style.margin =
            this._previousBodyMargin ||
            '';

    }


    /*
     * =========================================================
     * APPLY CROP
     * =========================================================
     */

    endCrop() {

        let cropRect =
            document.querySelector(
                '#cropRect'
            );


        let cropImg =
            document.querySelector(
                '#js-crop-image'
            );


        if (
            !cropRect ||
            !cropImg
        ) {

            return;

        }


        let start =
            cropRect
                .getAttribute(
                    'data-start-xy'
                )
                .split(',');


        let currentStep =
            (
                parseInt(
                    cropImg.getAttribute(
                        'data-crop-step'
                    )
                ) || 0
            ) + 1;


        let previousCount =
            parseInt(
                cropImg.getAttribute(
                    'data-crop-count'
                )
            ) || 0;


        let ratio =
            cropImg
                .getAttribute(
                    'data-dim-ratio'
                )
                .split(',');


        let widthRatio =
            parseFloat(
                ratio[0]
            );


        let heightRatio =
            parseFloat(
                ratio[1]
            );


        let quality =
            parseFloat(
                cropImg.getAttribute(
                    'data-img-quality'
                )
            );


        let imgType =
            `image/${
                cropImg.getAttribute(
                    'data-img-type'
                )
            }`;


        let sourceX =
            parseFloat(
                start[0]
            ) *
            widthRatio;


        let sourceY =
            parseFloat(
                start[1]
            ) *
            heightRatio;


        let sourceWidth =
            cropRect.offsetWidth *
            widthRatio;


        let sourceHeight =
            cropRect.offsetHeight *
            heightRatio;


        let canvas =
            document.createElement(
                'canvas'
            );


        let ctx =
            canvas.getContext(
                '2d'
            );


        canvas.width =
            cropRect.offsetWidth;


        canvas.height =
            cropRect.offsetHeight;


        ctx.imageSmoothingEnabled =
            true;


        ctx.imageSmoothingQuality =
            'high';


        ctx.drawImage(

            cropImg,

            sourceX,

            sourceY,

            sourceWidth,

            sourceHeight,

            0,

            0,

            cropRect.offsetWidth,

            cropRect.offsetHeight

        );


        let result =
            canvas.toDataURL(
                imgType,
                quality
            );


        /*
         * Keep crop-0 intact.
         */
        cropImg.setAttribute(
            'data-crop-step',
            currentStep
        );


        cropImg.setAttribute(
            'data-crop-' +
                currentStep,
            result
        );


        cropImg.setAttribute(
            'data-crop-count',
            currentStep
        );


        /*
         * Remove redo history.
         */
        for (
            let i =
                currentStep + 1;

            i <= previousCount;

            i++
        ) {

            cropImg.removeAttribute(
                'data-crop-' +
                i
            );

        }


        cropRect.remove();


        let resultImage =
            new Image();


        resultImage.onload =
            () => {

                cropImg.src =
                    result;


                this.fitImageToEditor(

                    cropImg,

                    resultImage.naturalWidth,

                    resultImage.naturalHeight,

                    true

                );

            };


        resultImage.src =
            result;


        cropImg.removeAttribute(
            'data-start-co'
        );

    }


    /*
     * =========================================================
     * CREATE CROP BOX
     * =========================================================
     */

    createCropBox(e) {

        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (
            !imgEl ||
            imgEl.getAttribute(
                'data-crop-status'
            ) === 'in-active' ||
            imgEl.getAttribute(
                'data-mouse-status'
            ) !== 'down'
        ) {

            return;

        }


        let par =
            this.setCanvasCo(
                e
            );


        if (!par) {
            return;
        }


        let cropRect =
            document.querySelector(
                '#cropRect'
            );


        if (!cropRect) {

            cropRect =
                document.createElement(
                    'div'
                );


            cropRect.id =
                'cropRect';


            cropRect.setAttribute(
                'draggable',
                false
            );


            cropRect.style = `
                position:absolute;

                z-index:1001000;

                touch-action:none;

                cursor:crosshair;

                border:
                    2px solid
                    rgba(255,255,255,0.96);

                box-shadow:
                    0 0 0 1px rgba(0,0,0,0.45),
                    0 5px 20px rgba(0,0,0,0.40);

                left:${
                    parseFloat(
                        imgEl.style.marginLeft
                    ) +
                    par.startX
                }px;

                top:${
                    parseFloat(
                        imgEl.style.marginTop
                    ) +
                    par.startY
                }px;

                width:${par.width}px;

                height:${par.height}px;
            `;


            cropRect.setAttribute(
                'data-start-xy',
                `${
                    par.startX
                },${
                    par.startY
                }`
            );


            cropRect.addEventListener(
                'dragover',
                event =>
                    event.preventDefault()
            );


            imgEl.parentNode.insertBefore(
                cropRect,
                imgEl
            );


            this.addInputEventListener(
                cropRect,
                'start',
                event => {

                    imgEl.setAttribute(
                        'data-mouse-status',
                        'down'
                    );


                    this.preventCropScroll(
                        event
                    );

                }
            );


            this.addInputEventListener(
                cropRect,
                'end',
                () =>
                    imgEl.setAttribute(
                        'data-mouse-status',
                        'up'
                    )
            );


            this.addInputEventListener(
                cropRect,
                'cancel',
                () =>
                    imgEl.setAttribute(
                        'data-mouse-status',
                        'up'
                    )
            );


            this.addResizeBoxes(

                cropRect,

                {
                    width:
                        cropRect.offsetWidth,

                    height:
                        cropRect.offsetHeight
                },

                e,

                imgEl

            );


            this.addInputEventListener(
                cropRect,
                'move',
                event => {

                    if (
                        imgEl.getAttribute(
                            'data-mouse-status'
                        ) ===
                        'down'
                    ) {

                        this.preventCropScroll(
                            event
                        );


                        this.addResizeBoxes(

                            cropRect,

                            {
                                width:
                                    cropRect.offsetWidth,

                                height:
                                    cropRect.offsetHeight
                            },

                            event,

                            imgEl

                        );

                    }

                }
            );

        }


        else if (
            cropRect.getAttribute(
                'data-resize'
            ) === null
        ) {

            cropRect.style.left =
                (
                    parseFloat(
                        imgEl.style.marginLeft
                    ) +
                    par.startX
                ) + 'px';


            cropRect.style.top =
                (
                    parseFloat(
                        imgEl.style.marginTop
                    ) +
                    par.startY
                ) + 'px';


            cropRect.style.width =
                par.width +
                'px';


            cropRect.style.height =
                par.height +
                'px';


            cropRect.setAttribute(
                'data-start-xy',
                `${
                    par.startX
                },${
                    par.startY
                }`
            );


            this.positionResizeBoxes(
                cropRect
            );

        }

    }


    /*
     * =========================================================
     * RESIZE HANDLES
     * =========================================================
     */

    getResizeHandleStyle() {

        let layout =
            this.getResponsiveLayout();


        return `
            position:absolute;

            width:${layout.handleSize}px;

            height:${layout.handleSize}px;

            background:#fff;

            border:
                2px solid
                rgba(25,25,25,0.92);

            border-radius:${
                layout.touch
                    ? 50
                    : 3
            }%;

            box-shadow:
                0 2px 6px
                rgba(0,0,0,0.45);

            touch-action:none;

            z-index:5;
        `;

    }


    addResizeBoxes(
        cropRect,
        par,
        e,
        imgEl
    ) {

        let resizeBoxes =
            cropRect.querySelectorAll(
                '[data-js-crop-handle]'
            );


        if (
            resizeBoxes.length === 0
        ) {

            let handles = [

                [
                    'nwse-resize-one',
                    'nwse-resize'
                ],

                [
                    'ns-resize-one',
                    'ns-resize'
                ],

                [
                    'nesw-resize-one',
                    'nesw-resize'
                ],

                [
                    'ew-resize-one',
                    'ew-resize'
                ],

                [
                    'nwse-resize-two',
                    'nwse-resize'
                ],

                [
                    'ns-resize-two',
                    'ns-resize'
                ],

                [
                    'nesw-resize-two',
                    'nesw-resize'
                ],

                [
                    'ew-resize-two',
                    'ew-resize'
                ]

            ];


            handles.forEach(
                handle => {

                    let box =
                        document.createElement(
                            'span'
                        );


                    box.id =
                        handle[0];


                    box.setAttribute(
                        'data-js-crop-handle',
                        'true'
                    );


                    box.setAttribute(
                        'draggable',
                        false
                    );


                    box.style =
                        this.getResizeHandleStyle();


                    box.style.cursor =
                        handle[1];


                    this.addResizeEventListeners(

                        box,

                        cropRect,

                        imgEl

                    );


                    cropRect.appendChild(
                        box
                    );

                }
            );


            this.positionResizeBoxes(
                cropRect
            );


            return;

        }


        if (
            cropRect.getAttribute(
                'data-resize'
            ) === null
        ) {

            this.positionResizeBoxes(
                cropRect
            );

            return;

        }


        let input =
            this.getInputCoordinates(
                e,
                imgEl
            );


        let imgRect =
            imgEl.getBoundingClientRect();


        if (
            input.clientX <
                imgRect.left ||
            input.clientX >
                imgRect.right ||
            input.clientY <
                imgRect.top ||
            input.clientY >
                imgRect.bottom
        ) {

            return;

        }


        let previous =
            cropRect.getAttribute(
                'data-prev-mousepos'
            );


        if (!previous) {

            cropRect.setAttribute(
                'data-prev-mousepos',

                `${
                    input.clientX
                },${
                    input.clientY
                }`
            );


            return;

        }


        previous =
            previous.split(',');


        let previousX =
            parseFloat(
                previous[0]
            );


        let previousY =
            parseFloat(
                previous[1]
            );


        let dx =
            input.clientX -
            previousX;


        let dy =
            input.clientY -
            previousY;


        let left =
            parseFloat(
                cropRect.style.left
            );


        let top =
            parseFloat(
                cropRect.style.top
            );


        let width =
            cropRect.offsetWidth;


        let height =
            cropRect.offsetHeight;


        let minSize =
            this.isTouchDevice()
                ? 32
                : 20;


        let type =
            cropRect.getAttribute(
                'data-resize'
            );


        if (
            type ===
            'nwse-resize-one'
        ) {

            if (
                width - dx >=
                minSize
            ) {

                left += dx;
                width -= dx;

            }


            if (
                height - dy >=
                minSize
            ) {

                top += dy;
                height -= dy;

            }

        }


        else if (
            type ===
            'ns-resize-one'
        ) {

            if (
                height - dy >=
                minSize
            ) {

                top += dy;
                height -= dy;

            }

        }


        else if (
            type ===
            'nesw-resize-one'
        ) {

            if (
                width + dx >=
                minSize
            ) {

                width += dx;

            }


            if (
                height - dy >=
                minSize
            ) {

                top += dy;
                height -= dy;

            }

        }


        else if (
            type ===
            'ew-resize-one'
        ) {

            if (
                width + dx >=
                minSize
            ) {

                width += dx;

            }

        }


        else if (
            type ===
            'nwse-resize-two'
        ) {

            if (
                width + dx >=
                minSize
            ) {

                width += dx;

            }


            if (
                height + dy >=
                minSize
            ) {

                height += dy;

            }

        }


        else if (
            type ===
            'ns-resize-two'
        ) {

            if (
                height + dy >=
                minSize
            ) {

                height += dy;

            }

        }


        else if (
            type ===
            'nesw-resize-two'
        ) {

            if (
                width - dx >=
                minSize
            ) {

                left += dx;
                width -= dx;

            }


            if (
                height + dy >=
                minSize
            ) {

                height += dy;

            }

        }


        else if (
            type ===
            'ew-resize-two'
        ) {

            if (
                width - dx >=
                minSize
            ) {

                left += dx;
                width -= dx;

            }

        }


        let minLeft =
            imgRect.left;


        let minTop =
            imgRect.top;


        let maxRight =
            imgRect.right;


        let maxBottom =
            imgRect.bottom;


        if (
            left < minLeft
        ) {

            width -=
                minLeft -
                left;


            left =
                minLeft;

        }


        if (
            top < minTop
        ) {

            height -=
                minTop -
                top;


            top =
                minTop;

        }


        if (
            left + width >
            maxRight
        ) {

            width =
                maxRight -
                left;

        }


        if (
            top + height >
            maxBottom
        ) {

            height =
                maxBottom -
                top;

        }


        width =
            Math.max(
                minSize,
                width
            );


        height =
            Math.max(
                minSize,
                height
            );


        cropRect.style.left =
            left +
            'px';


        cropRect.style.top =
            top +
            'px';


        cropRect.style.width =
            width +
            'px';


        cropRect.style.height =
            height +
            'px';


        cropRect.setAttribute(

            'data-start-xy',

            `${
                left -
                imgRect.left
            },${
                top -
                imgRect.top
            }`

        );


        cropRect.setAttribute(
            'data-prev-mousepos',

            `${
                input.clientX
            },${
                input.clientY
            }`

        );


        this.positionResizeBoxes(
            cropRect
        );

    }


    /*
     * =========================================================
     * HANDLE POSITIONS
     * =========================================================
     */

    positionResizeBoxes(
        cropRect
    ) {

        let layout =
            this.getResponsiveLayout();


        let size =
            layout.handleSize;


        let half =
            size / 2;


        let style =
            this.getResizeHandleStyle();


        const setHandle = (
            id,
            left,
            top,
            cursor,
            transform = ''
        ) => {

            let handle =
                cropRect.querySelector(
                    '#' + id
                );


            if (!handle) {
                return;
            }


            handle.style =
                style;


            handle.style.cursor =
                cursor;


            handle.style.left =
                left;


            handle.style.top =
                top;


            if (transform) {

                handle.style.transform =
                    transform;

            }

        };


        setHandle(
            'nwse-resize-one',
            `-${half}px`,
            `-${half}px`,
            'nwse-resize'
        );


        setHandle(
            'ns-resize-one',
            '50%',
            `-${half}px`,
            'ns-resize',
            'translateX(-50%)'
        );


        setHandle(
            'nesw-resize-one',
            `calc(100% - ${half}px)`,
            `-${half}px`,
            'nesw-resize'
        );


        setHandle(
            'ew-resize-one',
            `calc(100% - ${half}px)`,
            '50%',
            'ew-resize',
            'translateY(-50%)'
        );


        setHandle(
            'nwse-resize-two',
            `calc(100% - ${half}px)`,
            `calc(100% - ${half}px)`,
            'nwse-resize'
        );


        setHandle(
            'ns-resize-two',
            '50%',
            `calc(100% - ${half}px)`,
            'ns-resize',
            'translateX(-50%)'
        );


        setHandle(
            'nesw-resize-two',
            `-${half}px`,
            `calc(100% - ${half}px)`,
            'nesw-resize'
        );


        setHandle(
            'ew-resize-two',
            `-${half}px`,
            '50%',
            'ew-resize',
            'translateY(-50%)'
        );

    }


    /*
     * =========================================================
     * OPTIMIZED IMAGE SIZE
     * =========================================================
     */

    getOptimizedImageSize(
        screenWidth,
        screenHeight,
        imageActualWidth,
        imageActualHeight
    ) {

        if (
            imageActualWidth <= 0 ||
            imageActualHeight <= 0
        ) {

            return {

                width:
                    0,

                height:
                    0

            };

        }


        let marginPercent =
            this.isTouchDevice()
                ? 0.94
                : 0.95;


        let maxWidth =
            screenWidth *
            marginPercent;


        let maxHeight =
            screenHeight *
            marginPercent;


        let scale =
            Math.min(

                maxWidth /
                    imageActualWidth,

                maxHeight /
                    imageActualHeight,

                1

            );


        return {

            width:
                imageActualWidth *
                scale,

            height:
                imageActualHeight *
                scale

        };

    }


    /*
     * =========================================================
     * CROP COORDINATES
     * =========================================================
     */

    setCanvasCo(e) {

        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (
            !imgEl ||
            !imgEl.hasAttribute(
                'data-start-co'
            )
        ) {

            return;

        }


        let input =
            this.getInputCoordinates(
                e,
                imgEl
            );


        let start =
            imgEl
                .getAttribute(
                    'data-start-co'
                )
                .split(',');


        let startX =
            parseFloat(
                start[0]
            );


        let startY =
            parseFloat(
                start[1]
            );


        let endX =
            Math.max(

                0,

                Math.min(
                    imgEl.offsetWidth,
                    input.offsetX
                )

            );


        let endY =
            Math.max(

                0,

                Math.min(
                    imgEl.offsetHeight,
                    input.offsetY
                )

            );


        let width =
            Math.abs(
                endX -
                startX
            );


        let height =
            Math.abs(
                endY -
                startY
            );


        if (
            width < 1 ||
            height < 1
        ) {

            return;

        }


        return {

            el:
                imgEl,

            startX:
                Math.min(
                    startX,
                    endX
                ),

            startY:
                Math.min(
                    startY,
                    endY
                ),

            width:
                width,

            height:
                height

        };

    }


    /*
     * =========================================================
     * KEYBOARD
     * =========================================================
     */

    onKeyStroke(event) {

        if (
            event.code ===
            'Escape' &&
            document.querySelector(
                '#js-crop-overlay'
            )
        ) {

            this.closeOverlay();

            return;

        }


        let cropRect =
            document.querySelector(
                '#cropRect'
            );


        if (!cropRect) {
            return;
        }


        let imgEl =
            document.querySelector(
                '#js-crop-image'
            );


        if (!imgEl) {
            return;
        }


        let start =
            cropRect
                .getAttribute(
                    'data-start-xy'
                )
                .split(',');


        let x =
            parseFloat(
                start[0]
            );


        let y =
            parseFloat(
                start[1]
            );


        let step =
            event.shiftKey
                ? 10
                : 1;


        let changed =
            false;


        switch (
            event.code
        ) {

            case 'ArrowUp':

                event.preventDefault();

                if (
                    y - step >= 0
                ) {

                    y -= step;
                    changed = true;

                }

                break;


            case 'ArrowDown':

                event.preventDefault();

                if (
                    y +
                    cropRect.offsetHeight +
                    step <=
                    imgEl.offsetHeight
                ) {

                    y += step;
                    changed = true;

                }

                break;


            case 'ArrowLeft':

                event.preventDefault();

                if (
                    x - step >= 0
                ) {

                    x -= step;
                    changed = true;

                }

                break;


            case 'ArrowRight':

                event.preventDefault();

                if (
                    x +
                    cropRect.offsetWidth +
                    step <=
                    imgEl.offsetWidth
                ) {

                    x += step;
                    changed = true;

                }

                break;

        }


        if (!changed) {
            return;
        }


        cropRect.setAttribute(
            'data-start-xy',
            `${x},${y}`
        );


        let imgRect =
            imgEl.getBoundingClientRect();


        cropRect.style.left =
            (
                imgRect.left +
                x
            ) + 'px';


        cropRect.style.top =
            (
                imgRect.top +
                y
            ) + 'px';

    }

}


/*
 * =============================================================
 * COMMONJS / NPM / WEBPACK
 * =============================================================
 */

if (
    typeof module !== 'undefined' &&
    module.exports
) {

    module.exports =
        jsCrop;


    module.exports.jsCrop =
        jsCrop;

}


/*
 * =============================================================
 * DIRECT BROWSER
 * =============================================================
 */

if (
    typeof window !== 'undefined'
) {

    window.jsCrop =
        jsCrop;

}