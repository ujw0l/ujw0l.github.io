/*
 * Js Crop 
 * javascript library that enables image cropping 
 * https://ujwolbastakoti.wordpress.com/
 * MIT license
 *  
 */

'use strict'
class jsCrop {

    constructor(sel) {
        let elList = Array.from(document.querySelectorAll(sel));
        elList.forEach((el) => {
            el.addEventListener('click', event => this.createOverlay(event));
        });

        window.addEventListener('resize', () => this.adjustApp());
    }

    createOverlay(e) {

        let orgImage = new Image();
        orgImage.src = e.target.src;
        let imgActHeight = orgImage.height;
        let imgActWidth = orgImage.width;

        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';


        let overlayDivEl = document.createElement("div");
        overlayDivEl.id = "js-crop-overlay";
        overlayDivEl.style = `position:fixed;height:100%;width:100%;transition: 0.8s ease-in-out;top:0%;left:0%;right:0%;bottom:0%;background-color:rgba(0,0,0,1);z-index:100500;`;
        document.body.insertBefore(overlayDivEl, document.body.firstChild);

        let jsCropCloseBtn = document.createElement('span');
        jsCropCloseBtn.id = "js-crop-close-btn";
        jsCropCloseBtn.title = "Close";
        jsCropCloseBtn.innerHTML = "&#10539;";
        jsCropCloseBtn.style = `cursor:pointer;position:absolute;left:3px;font-size:20px;height:20px;width:20px;color:rgba(255,255,255,1);`;

        let overlayDiv = document.querySelector('#js-crop-overlay');
        let opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, imgActWidth, imgActHeight);
        let imgStyle = `box-shadow:0px 0px 5px rgba(255,255,255,1);display:inline-block;margin:${((overlayDiv.offsetHeight - opImgDim.height) / 2)}px ${(((0.94 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px;vertical-align:top;`;


        orgImage.id = "js-crop-image";
        orgImage.style = imgStyle;
        orgImage.height = opImgDim.height;
        orgImage.width = opImgDim.width;
        orgImage.setAttribute('draggable', 'false');
        orgImage.setAttribute('data-dim-ratio', `${imgActWidth / opImgDim.width},${imgActHeight / opImgDim.height}`);
        overlayDiv.appendChild(jsCropCloseBtn);
        overlayDiv.appendChild(orgImage);

        this.createToolbar(overlayDiv, orgImage.src, {
            height: opImgDim.height,
            width: opImgDim.width,
            dimRatio: `${imgActWidth / opImgDim.width},${imgActHeight / opImgDim.height}`
        });
        document.querySelector('#js-crop-close-btn').addEventListener('click', () => this.closeOverlay());
    }

    adjustApp() {

        let overlayDiv = document.querySelector('#js-crop-overlay');
        let loadedImg = document.querySelector('#js-crop-image');
        let toolbarDiv = document.querySelector('#js-crop-toolbar');
        let bufferImg = new Image();
        bufferImg.src = loadedImg.src;
        let imgActHeight = bufferImg.height;
        let imgActWidth = bufferImg.width;

        var opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, imgActWidth, imgActHeight);

        loadedImg.height = opImgDim.height
        loadedImg.width = opImgDim.width;
        loadedImg.style.margin = `${(((overlayDiv.offsetHeight - opImgDim.height) / 2))}px ${(((0.94 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px`;

        let toolbarOpts = Array.from(toolbarDiv.querySelectorAll('div'));

        toolbarDiv.style.height = overlayDiv.offsetHeight + 'px';
        toolbarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (toolbarOpts.length * toolbarDiv.offsetWidth)) / 2) + 'px';

        toolbarOpts.map(x => {
            x.style.height = x.offsetWidth - 5 + 'px';
            x.style.fontSize = (0.69 * x.offsetWidth) + 'px';
        });

    }

    createToolbar(overlayDiv, imgSrc, imgDim) {

        let toolbar = document.createElement('div');
        toolbar.id = `js-crop-toolbar`;
        toolbar.style = `padding:2px;color:rgba(255,255,255,1);display:inline-block;width:5%;height:${overlayDiv.offsetHeight}px;position:absolute;float:right;right:0;background-color:rgba(255,255,255,1);`;
        overlayDiv.appendChild(toolbar);

        let spanStyle = `opacity:0;transition: 0.8s ease-in-out;font-size:300%;cursor:pointer;border-radius:0%;margin-bottom:3px;background-color:rgba(0,0,0,1);box-shadow:-1px -1px 10px rgba(0,0,0,1);text-align:center;width:98%;height:${toolbar.offsetWidth - 6}px;border:1px solid rgba(0,0,0,1);`;
        let spanMouseenter = `this.style.boxShadow ='-2px -2px 10px rgba(0,0,0,1)'; this.style.borderRadius='20%'`;
        let spanMouseleave = `this.style.boxShadow ='-1px -1px 1px rgba(0,0,0,1)';this.style.borderRadius='25%'`;

        let cropIconDiv = document.createElement('div');
        cropIconDiv.id = `crop-image`;
        cropIconDiv.title = `Start cropping`;
        cropIconDiv.style = spanStyle;
        cropIconDiv.setAttribute('onmouseenter', spanMouseenter);
        cropIconDiv.setAttribute('onmouseleave', spanMouseleave);
        cropIconDiv.innerHTML = '&#9986;';
        cropIconDiv.addEventListener('click', () => this.addCropEventListener());
        toolbar.appendChild(cropIconDiv);

        let revertDiv = document.createElement('div');
        revertDiv.id = `revert-to-original`;
        revertDiv.title = `Revert to original Image`;
        revertDiv.setAttribute('data-img-src', imgSrc);
        revertDiv.setAttribute('data-img-dimension', imgDim.height + ',' + imgDim.width);
        revertDiv.setAttribute('data-dim-ratio', imgDim.dimRatio);
        revertDiv.setAttribute('onmouseenter', spanMouseenter);
        revertDiv.setAttribute('onmouseleave', spanMouseleave);
        revertDiv.style = spanStyle;
        revertDiv.innerHTML = '&#10226;';
        revertDiv.addEventListener('click', event => this.revertToOriginal(event));
        toolbar.appendChild(revertDiv);

        let prevStepDiv = document.createElement('div');
        prevStepDiv.id = `previous-step`;
        prevStepDiv.title = `Revert to previous crop`;
        prevStepDiv.style = spanStyle;
        prevStepDiv.setAttribute('data-img-src', '');
        prevStepDiv.setAttribute('onmouseenter', spanMouseenter);
        prevStepDiv.setAttribute('onmouseleave', spanMouseleave);
        prevStepDiv.innerHTML = '&#10550;';
        prevStepDiv.addEventListener('click', event => this.restorePreviousCrop(event));
        toolbar.appendChild(prevStepDiv);

        let nextStepDiv = document.createElement('div');
        nextStepDiv.id = `next-step`;
        nextStepDiv.title = `Restore last crop`;
        nextStepDiv.style = spanStyle;
        nextStepDiv.setAttribute('onmouseenter', spanMouseenter);
        nextStepDiv.setAttribute('onmouseleave', spanMouseleave);
        nextStepDiv.innerHTML = '&#10551;';
        nextStepDiv.addEventListener('click', event => this.restoreNextCrop(event));
        toolbar.appendChild(nextStepDiv);

        let saveImgDiv = document.createElement('div');
        saveImgDiv.id = `save-image`;
        saveImgDiv.title = `Save Image`;
        saveImgDiv.style = spanStyle;
        saveImgDiv.setAttribute('onmouseenter', spanMouseenter);
        saveImgDiv.setAttribute('onmouseleave', spanMouseleave);
        saveImgDiv.innerHTML = '&#10515;';
        saveImgDiv.addEventListener('click', event => this.downloadCurrentImg());
        toolbar.appendChild(saveImgDiv);

        let toolbarDiv = document.querySelector('#js-crop-toolbar');
        let toolbarOpts = Array.from(toolbarDiv.querySelectorAll('div'));;

        toolbarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (toolbarOpts.length * toolbarDiv.offsetWidth)) / 2) + 'px'

        toolbarOpts.map((x, i) => {
            x.style.height = x.offsetWidth - 5 + 'px';
            setTimeout(() => {

                x.style.opacity = '1';
                x.style.boxShadow = '-1px -1px 1px rgba(0,0,0,1)';
                x.style.fontSize = (0.69 * x.offsetWidth) + 'px';
                x.style.borderRadius = '25%';
            }, (150 * i))
        });
    }

    addCropEventListener() {
        document.querySelector('#js-crop-image').style.cursor = 'crosshair';
        document.querySelector('#js-crop-image').addEventListener("mousedown", event => {
            event.target.setAttribute('data-start-co', `${event.offsetX},${event.offsetY}`);
            event.target.addEventListener('mousemove', event => this.createCropBox(event));
            document.querySelector('#js-crop-overlay').addEventListener('mouseup', () => this.endCrop());
        });
    }

    revertToOriginal(e) {

        let overlayDiv = document.querySelector('#js-crop-overlay');
        let imgEl = document.querySelector('#js-crop-image');
        let bufferImg = new Image();
        bufferImg.src = e.target.getAttribute('data-img-src');

        let imgActHeight = bufferImg.height;
        let imgActWidth = bufferImg.width

        var opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, imgActWidth, imgActHeight);


        if (e.target.getAttribute('data-img-src') != imgEl.src) {
            document.querySelector('#previous-step').setAttribute('data-img-src', '')
            let nextStep = document.querySelector('#next-step');
            nextStep.setAttribute('data-img-src', imgEl.src);
            nextStep.setAttribute('data-img-dimension', imgEl.height + ',' + imgEl.width);
            nextStep.setAttribute('data-dim-ratio', '1,1');
        }

        imgEl.style.margin = `${((overlayDiv.offsetHeight - opImgDim.height) / 2)}px ${(((0.94 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px`;
        imgEl.height = opImgDim.height;
        imgEl.width = opImgDim.width;
        imgEl.setAttribute('data-dim-ratio', e.target.getAttribute('data-dim-ratio'));
        imgEl.src = e.target.getAttribute('data-img-src');


    }

    restorePreviousCrop(e) {
        if (0 !== e.target.getAttribute('data-img-src').length) {
            let revertToOrig = document.querySelector('#revert-to-original');
            if (revertToOrig.getAttribute('data-img-src') != e.target.getAttribute('data-img-src')) {

                let overlayDiv = document.querySelector('#js-crop-overlay');
                let nextStep = document.querySelector('#next-step');
                let imgEl = document.querySelector('#js-crop-image');
                let currentImgSrc = imgEl.src;
                nextStep.setAttribute('data-img-src', currentImgSrc);
                nextStep.setAttribute('data-img-dimension', imgEl.height + ',' + imgEl.width);
                nextStep.setAttribute('data-dim-ratio', '1,1');

                let imgDimension = e.target.getAttribute('data-img-dimension').split(',');
                let imgHeight = parseFloat(imgDimension[0]);
                let imgWidth = parseFloat(imgDimension[1]);

                setTimeout(() => {
                    imgEl.style.margin = `${(((overlayDiv.offsetHeight - imgHeight) / 2) - 38)}px ${(((0.94 * overlayDiv.offsetWidth) - imgWidth) / 2)}px`;
                    imgEl.height = imgHeight;
                    imgEl.width = imgWidth;
                    imgEl.src = e.target.getAttribute('data-img-src');
                }, 100);
            }
        }

    }


    restoreNextCrop(e) {
        if (null != e.target.getAttribute('data-img-src') && 0 !== e.target.getAttribute('data-img-src').length) {
            let overlayDiv = document.querySelector('#js-crop-overlay');
            let imgEl = document.querySelector('#js-crop-image');
            let imgDimension = e.target.getAttribute('data-img-dimension').split(',');
            let imgHeight = parseFloat(imgDimension[0]);
            let imgWidth = parseFloat(imgDimension[1]);
            imgEl.style.margin = `${(((overlayDiv.offsetHeight - imgHeight) / 2) - 38)}px ${(((0.94 * overlayDiv.offsetWidth) - imgWidth) / 2)}px`;
            imgEl.height = imgHeight;
            imgEl.width = imgWidth;
            imgEl.src = e.target.getAttribute('data-img-src');
        }
    }

    downloadCurrentImg() {
        let loadedImg = document.querySelector('#js-crop-image');
        let origImgRatio = loadedImg.getAttribute('data-dim-ratio').split(',');
        let tempCanv = document.createElement('canvas');
        let downloadLink = document.createElement('a');
        let tempCtx = tempCanv.getContext('2d');
        let imgHtRatio = parseFloat(origImgRatio[1]);
        let imgWdRatio = parseFloat(origImgRatio[0]);
        tempCanv.height = loadedImg.height;
        tempCanv.width = loadedImg.width;
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(loadedImg, 0, 0, loadedImg.offsetWidth * imgWdRatio, loadedImg.offsetHeight * imgHtRatio, 0, 0, loadedImg.offsetWidth, loadedImg.offsetHeight);
        downloadLink.href = tempCanv.toDataURL();
        downloadLink.setAttribute('download', 'image.png');
        downloadLink.click();
    }

    closeOverlay() {
        document.body.removeChild(document.querySelector('#js-crop-overlay'));
        document.body.style.overflow = '';
        document.body.style.margin = ''
    }

    endCrop() {

        let cropRect = document.querySelector('#cropRect');
        if (undefined != cropRect) {
            let startCo = cropRect.getAttribute('data-start-xy').split(',');
            let cropImg = document.querySelector('#js-crop-image');
            let origImgRatio = cropImg.getAttribute('data-dim-ratio').split(',');
            let overlayDiv = document.querySelector('#js-crop-overlay');
            let prevCrop = document.querySelector('#previous-step');
            prevCrop.setAttribute('data-img-src', cropImg.src);
            prevCrop.setAttribute('data-img-dimension', cropImg.height + ',' + cropImg.width);
            prevCrop.addEventListener('click', event => this.restorePreviousCrop(event));

            let tempCanv = document.createElement('canvas');
            let tempCtx = tempCanv.getContext('2d');
            let imgHtRatio = parseFloat(origImgRatio[1]);
            let imgWdRatio = parseFloat(origImgRatio[0]);
            let cropImgWd = cropRect.offsetWidth * imgWdRatio;
            let cropImgHt = cropRect.offsetHeight * imgHtRatio;
            cropImg.style.margin = `${(((overlayDiv.offsetHeight - cropRect.offsetHeight) / 2) - 38)}px ${(((0.94 * overlayDiv.offsetWidth) - cropRect.offsetWidth) / 2)}px`;

            tempCanv.height = cropRect.offsetHeight;
            tempCanv.width = cropRect.offsetWidth;
            cropImg.setAttribute('data-dim-ratio', '1,1');
            cropImg.height = cropRect.offsetHeight;
            cropImg.width = cropRect.offsetWidth;
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            tempCtx.drawImage(cropImg, (parseInt(startCo[0]) * imgWdRatio), ((parseInt(startCo[1])) * imgHtRatio), cropImgWd, cropImgHt, 0, 0, cropRect.offsetWidth, cropRect.offsetHeight);
            let imgBlob = tempCanv.toDataURL();
            cropImg.src = imgBlob;
            cropImg.removeAttribute('data-start-co');
            overlayDiv.removeChild(cropRect);
        }

    }


    createCropBox(e) {
        var imgEl = document.querySelector("#js-crop-image");

        if (undefined != imgEl.getAttribute('data-start-co')) {
            let par = this.setCanvasCo(e);
            if (undefined != par) {
                let cropRect = document.querySelector('#cropRect');
                if (undefined == cropRect) {
                    cropRect = document.createElement('canvas');
                    cropRect.id = 'cropRect';
                    cropRect.style = `position:absolute;border:0.5px solid rgba(255,255,255,1);box-shadow:0px 0px 10px rgba(0,0,0,1);left:${parseFloat(imgEl.style.marginLeft) + par.startX}px;top:${parseFloat(imgEl.style.marginTop) + par.startY}px;width:${par.width}px;height:${par.height}px;`;
                    cropRect.setAttribute('data-start-xy', par.startX + ',' + par.startY);
                    imgEl.parentNode.insertBefore(cropRect, imgEl);
                } else {
                    cropRect.style.left = (parseFloat(imgEl.style.marginLeft) + par.startX) + 'px';
                    cropRect.style.top = (parseFloat(imgEl.style.marginTop) + par.startY) + 'px';
                    cropRect.style.height = par.height + 'px';
                    cropRect.style.width = par.width + 'px';
                    cropRect.setAttribute('data-start-xy', par.startX + ',' + par.startY);
                }

            }

        }
    }



    getOptimizedImageSize(screenWidth, screenHeight, imageActualWidth, imageActualHeight) {

        var imageScreenHeightRatio = 0,
            imageScreenWidthRatio = 0,
            optimizedImageHeight = 0,
            optimizedImageWidth = 0;
        var imgPercent = 0.90,
            marginPercent = 0.1;

        if ((imageActualWidth >= screenWidth) && (imageActualHeight >= screenHeight)) {
            if (imageActualWidth >= imageActualHeight) {
                if (imageActualWidth > imageActualHeight) {

                    imageScreenWidthRatio = imageActualWidth / screenWidth;
                    optimizedImageWidth = (imageActualWidth / imageScreenWidthRatio) - (marginPercent * screenWidth);
                    optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
                    if (optimizedImageHeight >= (imgPercent * screenHeight)) {
                        imageScreenHeightRatio = screenHeight / imageActualHeight;
                        optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (marginPercent * screenHeight);
                        optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
                    }
                } else {

                    if (screenWidth > screenHeight) {
                        optimizedImageHeight = (imgPercent * screenHeight);
                        optimizedImageWidth = optimizedImageHeight;

                    } else if (screenHeight > screenWidth) {
                        optimizedImageWidth = (imgPercent * screenWidth);
                        optimizedImageHeight = optimizedImageWidth;

                    } else {
                        imageScreenHeightRatio = screenHeight / imageActualHeight;
                        optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (marginPercent * screenHeight);
                        optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
                    }
                }

            } else {
                imageScreenHeightRatio = imageActualHeight / screenHeight;
                optimizedImageHeight = (imageActualHeight / imageScreenHeightRatio) - (marginPercent * screenHeight);
                optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            }

        } else if (imageActualWidth >= screenWidth && imageActualHeight < screenHeight) {
            imageScreenWidthRatio = screenWidth / imageActualWidth;
            optimizedImageWidth = imageActualWidth * imageScreenWidthRatio - (marginPercent * screenWidth);
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        } else if (imageActualHeight >= screenHeight && imageActualWidth < screenWidth) {
            imageScreenHeightRatio = screenHeight / imageActualHeight;
            optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (marginPercent * screenHeight);
            optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        } else {
            var avilableImageWidth = imgPercent * screenWidth;
            var avilableImageHeight = imgPercent * screenHeight;
            if (imageActualWidth >= avilableImageWidth && imageActualHeight >= avilableImageHeight) {
                var imageAvilableWidthRatio = avilableWidth / imageActualWidth;
                imageAvilableHeightRatio = avilableHeight / imageActualHeight;
                optimizedImageWidth = avilableWidth * imageAvilableWidthRatio;
                optimizedImageHeight = screenHeight * imageScreenHeightRatio;
            } else if (imageActualWidth >= avilableImageWidth && imageActualHeight < avilableImageHeight) {
                var imageAvilableWidthRatio = avilableImageWidth / imageActualWidth;
                optimizedImageWidth = imageActualWidth * imageAvilableWidthRatio;
                optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
            } else if (imageActualHeight >= avilableImageHeight && imageActualWidth < avilableImageWidth) {
                var imageAvilableHeightRatio = avilableImageHeight / imageActualHeight;
                optimizedImageHeight = imageActualHeight * imageAvilableHeightRatio;
                optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            } else {
                optimizedImageWidth = imageActualWidth;
                optimizedImageHeight = imageActualHeight;
            }
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        }


        //at last check it optimized width is still large			
        if (optimizedImageWidth > (imgPercent * screenWidth)) {
            optimizedImageWidth = imgPercent * screenWidth;
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        }

        return {
            width: optimizedImageWidth,
            height: optimizedImageHeight
        };
    }


    setCanvasCo(e) {

        if (undefined != e.target.getAttribute('data-start-co')) {
            let startCoArr = e.target.getAttribute('data-start-co').split(',');
            e.target.setAttribute('data-end-co', `${e.offsetX},${e.offsetY}`);
            let startX = parseInt(startCoArr[0]);
            let startY = parseInt(startCoArr[1]);
            let endX = e.offsetX < 0 ? 0 : e.offsetX;
            let endY = e.offsetY < 0 ? 0 : e.offsetY;
            let cropHeight = endY >= startY ? endY - startY : startY - endY;
            let cropWidth = endX >= startX ? endX - startX : startX - endX;

            if (0 !== cropWidth && 0 !== cropHeight) {

                if (endX < startX && endY < startY) {
                    return {
                        el: e.target,
                        startX: endX,
                        startY: (startY - cropHeight),
                        height: cropHeight,
                        width: cropWidth
                    }
                } else if (endX > startX && endY < startY) {
                    return {
                        el: e.target,
                        startX: startX,
                        startY: (startY - cropHeight),
                        height: cropHeight,
                        width: cropWidth
                    }
                } else if (endX < startX && endY > startY) {
                    return {
                        el: e.target,
                        startX: endX,
                        startY: (endY - cropHeight),
                        height: cropHeight,
                        width: cropWidth
                    }
                } else {
                    return {
                        el: e.target,
                        startX: startX,
                        startY: startY,
                        height: cropHeight,
                        width: cropWidth
                    }

                }

            } else {
                return;
            }

        }

    }

}