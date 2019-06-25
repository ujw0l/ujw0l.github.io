'use strict'
class jsCrop {

    constructor(sel) {
        let elList = Array.from(document.querySelectorAll(sel));
        elList.forEach((el) => {
            el.addEventListener('click', event => this.createOverlay(event));
        });
    }

    createOverlay(e) {

        let overlayWidth = window.screen.width;
        let overlayHeight = window.screen.height;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let orgImage = new Image();
        orgImage.src = e.target.src;
        let imgActHeight = orgImage.height;
        let imgActWidth = orgImage.width;

        if (windowWidth > overlayWidth) {
            overlayWidth = windowWidth;
        }
        if (windowHeight > overlayHeight) {
            overlayHeight = windowHeight;
        }
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        let opImgDim = this.getOptimizedImageSize(overlayWidth, overlayHeight, imgActWidth, imgActHeight);

        let overlayDiv = document.createElement("div");
        overlayDiv.id = "jsCropOverlay";
        overlayDiv.className = "jsCropOverlay";
        overlayDiv.style = `top:0%;left:0%;right:0%;bottom:0%;height:100%;width:100%;background-color:rgba(0,0,0,1);z-index:100000;`;

        let jsCropCloseBtn = document.createElement('span');
        jsCropCloseBtn.id = "jsCropCloseBtn";
        jsCropCloseBtn.title = "Close";
        jsCropCloseBtn.innerHTML = "&#10539;";
        jsCropCloseBtn.style = `cursor:pointer;position:absolute;left:3px;font-size:20px;height:20px;width:20px;color:rgba(255,255,255,1);`;
        jsCropCloseBtn.setAttribute('mouseenter', "this.innerHTML = 'y'");


        let imgContMarVer = ((overlayHeight - opImgDim.height) / 2) - 38;
        let imgContMarHor = ((overlayWidth - opImgDim.width) / 2);
        let imgStyle = `cursor: crosshair;box-shadow:0px 0px 5px rgba(255,255,255,1);display:inline-block;margin-left:${imgContMarHor}px;margin-top:${imgContMarVer}px;margin-bottom:${imgContMarVer}px;width:${opImgDim[0]}px;height:${opImgDim[1]}px;vertical-align:top;`;


        orgImage.id = "jsCropImage";
        orgImage.style = imgStyle;
        orgImage.height = opImgDim.height;
        orgImage.width = opImgDim.width;
        orgImage.setAttribute('data-img-url', e.target.src);
        orgImage.setAttribute('draggable', 'false');
        orgImage.setAttribute('data-dim-ratio', `${imgActWidth/opImgDim.width},${imgActHeight/opImgDim.height}`);
        overlayDiv.appendChild(jsCropCloseBtn);
        overlayDiv.appendChild(orgImage);
        document.body.insertBefore(overlayDiv, document.body.firstChild);

        document.querySelector('#jsCropImage').addEventListener("mousedown", event => {
            event.target.setAttribute('data-start-co', `${event.offsetX},${event.offsetY}`);
            event.target.onmousemove = event => {
                this.createCropBox(event);
            };
            document.querySelector('#jsCropOverlay').onmouseup = () => {
                this.endCrop()
            };
        });
        document.querySelector('#jsCropCloseBtn').addEventListener('click', this.closeOverlay);
    }

    closeOverlay() {
        document.body.removeChild(document.querySelector('#jsCropOverlay'));
        document.body.style.overflow = '';
        document.body.style.margin = ''
    }



    //function to get optimized image size
    getOptimizedImageSize(screenWidth, screenHeight, imageActualWidth, imageActualHeight) {

        var imageScreenHeightRatio = 0;
        var imageScreenWidthRatio = 0;
        var optimizedImageHeight = 0;
        var optimizedImageWidth = 0;

        if ((imageActualWidth >= screenWidth) && (imageActualHeight >= screenHeight)) {
            if (imageActualWidth >= imageActualHeight) {
                if (imageActualWidth > imageActualHeight) {

                    imageScreenWidthRatio = imageActualWidth / screenWidth;
                    optimizedImageWidth = (imageActualWidth / imageScreenWidthRatio) - (0.09 * screenWidth);
                    optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
                    if (optimizedImageHeight >= (0.91 * screenHeight)) {
                        imageScreenHeightRatio = screenHeight / imageActualHeight;
                        optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (0.09 * screenHeight);
                        optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
                    }
                } else {

                    if (screenWidth > screenHeight) {
                        optimizedImageHeight = (0.91 * screenHeight);
                        optimizedImageWidth = optimizedImageHeight;

                    } else if (screenHeight > screenWidth) {
                        optimizedImageWidth = (0.91 * screenWidth);
                        optimizedImageHeight = optimizedImageWidth;

                    } else {
                        imageScreenHeightRatio = screenHeight / imageActualHeight;
                        optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (0.09 * screenHeight);
                        optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
                    }
                }

            } else {
                imageScreenHeightRatio = imageActualHeight / screenHeight;
                optimizedImageHeight = (imageActualHeight / imageScreenHeightRatio) - (0.09 * screenHeight);
                optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            }

        } else if (imageActualWidth >= screenWidth && imageActualHeight < screenHeight) {
            imageScreenWidthRatio = screenWidth / imageActualWidth;
            optimizedImageWidth = imageActualWidth * imageScreenWidthRatio - (0.09 * screenWidth);
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        } else if (imageActualHeight >= screenHeight && imageActualWidth < screenWidth) {
            imageScreenHeightRatio = screenHeight / imageActualHeight;
            optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (0.09 * screenHeight);
            optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        } else {
            var avilableImageWidth = 0.92 * screenWidth;
            var avilableImageHeight = 0.92 * screenHeight;
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
        if (optimizedImageWidth > (0.91 * screenWidth)) {
            optimizedImageWidth = 0.91 * screenWidth;
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

    endCrop() {

        let cropRect = document.querySelector('#cropRect');
        if (undefined != cropRect) {
            let startCo = cropRect.getAttribute('data-start-xy').split(',');
            let cropImg = document.querySelector('#jsCropImage');
            let origImgRatio = cropImg.getAttribute('data-dim-ratio').split(',');
            let overlayDiv = document.querySelector('#jsCropOverlay');

            let tempCanv = document.createElement('canvas');
            let tempCtx = tempCanv.getContext('2d');
            let imgHtRatio = parseFloat(origImgRatio[1]);
            let imgWdRatio = parseFloat(origImgRatio[0]);
            let cropImgWd = cropRect.offsetWidth * imgWdRatio;
            let cropImgHt = cropRect.offsetHeight * imgHtRatio;
            cropImg.style.margin = `${((overlayDiv.offsetHeight - cropRect.offsetHeight) / 2)}px ${((overlayDiv.offsetWidth - cropRect.offsetWidth) / 2)}px`;

            tempCanv.height = cropRect.offsetHeight;
            tempCanv.width = cropRect.offsetWidth;
            cropImg.setAttribute('data-dim-ratio', '1,1');
            cropImg.height = cropRect.offsetHeight;
            cropImg.width = cropRect.offsetWidth;
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            tempCtx.drawImage(cropImg, (parseInt(startCo[0]) * imgWdRatio), ((parseInt(startCo[1])) * imgHtRatio), cropImgWd, cropImgHt, 0, 0, cropRect.offsetWidth, cropRect.offsetHeight);
            cropImg.src = tempCanv.toDataURL();
            cropImg.removeAttribute('data-start-co');
            overlayDiv.removeChild(cropRect);
        }

    }


    createCropBox(e) {
        if (undefined != e.target.getAttribute('data-start-co')) {
            let par = this.setCanvasCo(e);
            if (undefined != par) {
                let cropRect = document.querySelector('#cropRect');
                var imgEl = e.target;
                if (undefined == cropRect) {
                    cropRect = document.createElement('canvas');
                    cropRect.id = 'cropRect';
                    cropRect.style = `position:absolute;border:1px solid rgba(255,255,255,1);box-shadow:0px 0px 10px rgba(0,0,0,1);left:${parseFloat(imgEl.style.marginLeft) + par.startX}px;top:${parseFloat(imgEl.style.marginTop) + par.startY}px;width:${par.width}px;height:${par.height}px;`;
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

}