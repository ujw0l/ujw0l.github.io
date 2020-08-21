/*
 * 
 * 
 * 
 * ctcOverlay jQuery plugin
 * jQuery plugin to display images in overlay
 * https://ujwolbastakoti.wordpress.com/
 * MIT license
 * 
 * 
 * 
 */
(function ($) {
	$.fn.ctcOverlay = function () {

		//load overlay conatiner on window load
		$(document).ready(function () {
			if ($('.ctcOverlay').length < 1) {
				var overlayContainer = '';

				overlayContainer += '<div  id="ctcOverlay" class="ctcOverlay">';
				overlayContainer += '<span id="ctcOverlayClosebtn" title="close" class="ctcOverlayClosebtn overlayContentloading" ></span>';
				overlayContainer += '<div id="ctcOverlayImageContainer" class="ctcOverlayImageContainer ">';
				overlayContainer += '<span id="ctcGalleryLeftNav" class="ctcGalleryLeftNav"></span>';
				overlayContainer += '<span id="ctcGalleryRightNav" class="ctcGalleryRightNav"></span>';
				overlayContainer += '<div id="ctcOverlayCountAndCurrentImage" class="ctcOverlayCountAndCurrentImage">';
				overlayContainer += '<span id="ctcOverlayCurrentImageNumber" class="ctcOverlayCurrentImageNumber"></span>';
				overlayContainer += '<span id="ctcOverlayTotalImageCount" class="ctcOverlayTotalImageCount"></span>';
				overlayContainer += ' </div>';
				overlayContainer += ' <div id="ctcLoadedImgAltTitle" class="ctcLoadedImgAltTitle"></div>';
				overlayContainer += ' </div>';
				overlayContainer += ' </div>';
				$('body').prepend(overlayContainer);
			}

		});



		/*
		 * 
		 * supplementary functions to the core function
		 * 
		 * 
		 * 
		 */

		//function to resize font based on screen size

		function ctcResizeFontOnResize(screenWidth) {
			var optimizedFontSize = (screenWidth / 1280) * 120;

			if (optimizedFontSize < 23) {

				optimizedFontSize = 23;
			} else if (optimizedFontSize > 120) {
				optimizedFontSize = 120;
			}

			if ($('#ctc-font-style').length >= 1) {

				$('#ctc-font-style').remove();
				$('head').append('<style id=ctc-font-style> #ctcGalleryLeftNav::before,#ctcGalleryRightNav::before{font-size:' + Math.ceil(optimizedFontSize) + 'px !important;} #ctcOverlayClosebtn::before {font-size:' + Math.ceil(optimizedFontSize / 2) + 'px !important;}</style>');
				$('#ctcLoadedImgAltTitle,#ctcOverlayCountAndCurrentImage').css({
					'font-size': (optimizedFontSize / 6) + 'px'
				});

			} else {
				$('head').append('<style id=ctc-font-style> #ctcGalleryLeftNav::before,#ctcGalleryRightNav::before{font-size:' + optimizedFontSize + 'px !important;} #ctcOverlayClosebtn::before{font-size:' + Math.ceil(optimizedFontSize / 2) + 'px !important;}</style>');
				$('#ctcLoadedImgAltTitle,#ctcOverlayCountAndCurrentImage').css({
					'font-size': (optimizedFontSize / 6) + 'px'
				});
			}


			return optimizedFontSize;


		}



		//function to return title and alt for image
		function returnImgTitleAlt(imgAttr) {

			if (imgAttr !== (undefined || null || '' || 'undefined')) {
				return imgAttr;
			} else {

				return '';
			}
		}




		/***
		 * 
		 * core plugin functionalities
		 * 
		 * 
		 */

		$(window).resize(function () {


			if ($("#ctcOverlay").height() != 0) {

				loadOverlayImages($('#ctcOverlayImageContainer').attr('data-overlay-img'));

			}
			return false;
		});

		/* Close when someone clicks on the "x" symbol inside the overlay */
		$(document).on("click", '#ctcOverlayClosebtn', function () {
			$("#ctcOverlay").animate({
				height: 0,
				opacity: 0,
			},
				100,
				function () {

					$('body').css('overflow', 'auto');
				});
		});


		$(document).on("click", "#ctcGalleryLeftNav,#ctcGalleryRightNav", function () {
			loadOverlayImages($(this).attr("data-img-number"));
		});



		document.addEventListener('keydown', function (event) {

			if ($("#ctcOverlay").height() !== 0) {

				if (event.code === 'ArrowLeft') {
					var imgNumber = $("#ctcGalleryLeftNav").attr("data-img-number");
					if (imgNumber.length > 0) {
						loadOverlayImages(imgNumber)
					};
				} else if (event.code == 'ArrowRight') {
					var imgNumber = $("#ctcGalleryRightNav").attr("data-img-number");
					if (imgNumber.length > 0) {
						loadOverlayImages(imgNumber)
					};

				} else if (event.code == 'Escape') {
					$('#ctcOverlayClosebtn').click();
				}
			}

		});

		$(this).on('mouseover', function (event) {
			if ($(this).attr('data-ctc-active-gallery') != 'active') {
				let overlayImageGallery = '';
				let i = 0;


				$("*[data-ctc-active-gallery = 'active']").removeAttr('data-ctc-active-gallery');
				$("img[data-img-number]").removeClass('ctcOverlayLoadedImage').removeAttr('data-img-number');

				$('img', this).each(function () {
					$(this).addClass('ctcOverlayLoadedImage').attr('data-img-number', i);
					i++;
				});

				$(this).attr('data-ctc-active-gallery', 'active');
			}

		});


		//on click of each image  trigger overlay
		$('img', this).on('click', function (event) {

			loadOverlayImages($(this).attr('data-img-number'));
			event.preventDefault();
		});



		function loadOverlayImages(currentImageNumber) {

			var imageRatio = 0;
			var imageWidth = 0;
			var imageHeight = 0;
			var imageActualHeight = 0;
			var imageActualWidth = 0;
			var imgHeightRatio = 0;
			var imgMarginTop = '';
			var prevImage = 0;
			var nextImage = 0;
			var screenWidth = window.screen.width;
			var screenHeight = window.screen.height;
			var image = new Image();
			var imageToLoad = image.src = $('.ctcOverlayLoadedImage[data-img-number = "' + currentImageNumber + '"]').attr('src'); //$("*[data-img-number ='"+currentImageNumber+"']").attr('src');

			$('#ctcOverlayClosebtn').addClass('overlayContentloading');

			image.addEventListener('load', function () {

				$('body').css('overflow', 'hidden');

				imageActualHeight = image.height;
				imageActualWidth = image.width;


				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;


				//special case when window is not in full screen

				//while window is resized little bit

				if (windowWidth !== screenWidth || screenHeight !== windowHeight) {
					screenWidth = windowWidth;
					screenHeight = windowHeight;
				}



				//call function to style font based on screen size
				var optimizedFontSize = ctcResizeFontOnResize(screenWidth);




				var totalImageCount = $('.ctcOverlayLoadedImage').length;




				if (totalImageCount > 1) {


					var imageNumberToLoad = parseInt(currentImageNumber);
					var prevImage = imageNumberToLoad - 1;
					var nextImage = imageNumberToLoad + 1;

					$('#ctcOverlayCountAndCurrentImage').css('visibility', 'visible');


					if (prevImage >= 0 && nextImage < totalImageCount) {


						$('#ctcGalleryLeftNav').attr('data-img-number', prevImage);
						$('#ctcGalleryRightNav').attr('data-img-number', nextImage);
						$('#ctcOverlayCurrentImageNumber').empty().prepend('Image ' + (imageNumberToLoad + 1));
						$('#ctcOverlayTotalImageCount').empty().prepend(' of ' + totalImageCount);
						$('#ctcGalleryLeftNav,.ctcGalleryRightNav').animate({
							opacity: 1
						}, 100, function () {
							$(this).css({
								'cursor': 'pointer',
								'visibility': 'visible'
							});
						});

					} else if (prevImage < 0 && nextImage < totalImageCount) {

						$('#ctcGalleryLeftNav').attr('data-img-number', '').animate({
							opacity: 0
						}, 300, function () {
							$(this).css('cursor', 'initial');
						});
						$('#ctcGalleryRightNav').attr('data-img-number', nextImage);
						$('#ctcOverlayCurrentImageNumber').empty().prepend('Image ' + (imageNumberToLoad + 1));
						$('#ctcOverlayTotalImageCount').empty().prepend(' of ' + totalImageCount);
						$('#ctcGalleryRightNav').animate({
							opacity: 1
						}, 100, function () {
							$(this).css({
								'cursor': 'pointer',
								'visibility': 'visible'
							});
						});


					} else if (prevImage >= 0 && nextImage >= totalImageCount) {

						$('#ctcGalleryRightNav').attr('data-img-number', '').animate({
							opacity: 0
						}, 300, function () {
							$(this).css('cursor', 'initial');
						});
						$('#ctcGalleryLeftNav').attr('data-img-number', prevImage);
						$('#ctcOverlayCurrentImageNumber').empty().prepend('Image ' + (imageNumberToLoad + 1));
						$('#ctcOverlayTotalImageCount').empty().prepend(' of ' + totalImageCount);
						$('#ctcGalleryLeftNav').animate({
							opacity: 1
						}, 100, function () {
							$(this).css({
								'cursor': 'pointer',
								'visibility': 'visible'
							});
						});

					}

				} else {

					imageNumberToLoad = currentImageNumber;
					$('#ctcGalleryRightNav,#ctcGalleryLeftNav,#ctcOverlayCountAndCurrentImage').css('visibility', 'hidden');



				}


				var imageScreenHeightRatio = 0;
				var imageScreenWidthRatio = 0;
				var optimizedImageHeight = 0;
				var optimizedImageWidth = 0;

				if ((imageActualWidth >= screenWidth) && (imageActualHeight >= screenHeight)) {
					if (imageActualWidth >= imageActualHeight) {
						if (imageActualWidth > imageActualHeight) {

							imageScreenWidthRatio = imageActualWidth / screenWidth;

							optimizedImageWidth = (imageActualWidth / imageScreenWidthRatio) - (0.10 * screenWidth);

							optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);

							if (optimizedImageHeight >= (0.90 * screenHeight)) {
								imageScreenHeightRatio = screenHeight / imageActualHeight;
								optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (0.10 * screenHeight);
								optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);

							}

						} else {

							if (screenWidth > screenHeight) {
								optimizedImageHeight = (0.90 * screenHeight);
								optimizedImageWidth = optimizedImageHeight;

							} else if (screenHeight > screenWidth) {

								optimizedImageWidth = (0.90 * screenWidth);
								optimizedImageHeight = optimizedImageWidth;

							} else {

								imageScreenHeightRatio = screenHeight / imageActualHeight;
								optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (0.10 * screenHeight);
								optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
							}
						}

					} else {
						imageScreenHeightRatio = imageActualHeight / screenHeight;
						optimizedImageHeight = (imageActualHeight / imageScreenHeightRatio) - (0.10 * screenHeight);
						optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
					}

				} else if (imageActualWidth >= screenWidth && imageActualHeight < screenHeight) {
					imageScreenWidthRatio = screenWidth / imageActualWidth;
					optimizedImageWidth = imageActualWidth * imageScreenWidthRatio - (0.10 * screenWidth);
					optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
				} else if (imageActualHeight >= screenHeight && imageActualWidth < screenWidth) {
					imageScreenHeightRatio = screenHeight / imageActualHeight;
					optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (0.10 * screenHeight);
					optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
					optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
				} else {
					var avilableImageWidth = 0.90 * screenWidth;
					var avilableImageHeight = 0.90 * screenHeight;
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
						imageAvilableHeightRatio = avilableImageHeight / imageActualHeight;
						optimizedImageHeight = imageActualHeight * imageAvilableHeightRatio;
						optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
					} else {
						optimizedImageWidth = imageActualWidth;
						optimizedImageHeight = imageActualHeight;
					}
					optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
				}


				//at last check it optimized width is still large			
				if (optimizedImageWidth > (0.90 * screenWidth)) {
					optimizedImageWidth = 0.90 * screenWidth;
					optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);

				}


				$("#ctcOverlay").animate({
					width: screenWidth,
					height: screenHeight,
					opacity: 1
				}, 200, function () {
					var containerMarginTop = (screenHeight - optimizedImageHeight) / 2;
					var containerMarginLeft = (screenWidth - optimizedImageWidth) / 2;
					var navIconMargin = ((optimizedImageHeight - (2 * optimizedFontSize)) / 2) + 'px';
					var closeButton = $('#ctcOverlayClosebtn');
					//var ctcExtraInfoTop = screenHeight-50;



					$('#ctcGalleryLeftNav,#ctcGalleryRightNav').css({
						'height': optimizedFontSize,
						'margin-top': navIconMargin
					});
					if ($('img.ctcOverlayLoadedImage').length >= 2) {
						$('#ctcOverlayImageContainer').css({
							'background-image': 'url(' + imageToLoad + ')',
							'opacity': 0,
							'margin-left': containerMarginLeft + 'px',
							'margin-top': containerMarginTop + 'px',
							'width': optimizedImageWidth + 'px',
							'height': optimizedImageHeight + 'px',
						})
							.animate({
								opacity: 1,
							}, 300, function () {

								//first load image title or alt first
								let imgTitle = $('.ctcOverlayLoadedImage[data-img-number = "' + currentImageNumber + '"]').attr('title');
								let imgAlt = $('.ctcOverlayLoadedImage[data-img-number = "' + currentImageNumber + '"]').attr('alt');
								//first load alt image
								if (returnImgTitleAlt(imgTitle)) {

									$('#ctcLoadedImgAltTitle').show().empty().prepend(imgTitle);
								} else if (returnImgTitleAlt(imgAlt)) {

									$('#ctcLoadedImgAltTitle').show().empty().prepend(imgAlt);
								} else {

									$('#ctcLoadedImgAltTitle').hide().empty();
								}




								closeButton.animate({
									'margin-right': (screenWidth - optimizedImageWidth - containerMarginLeft - (closeButton.width() / 1.2) - 3) + 'px'
								}, 300, function () {
									$(this).animate({
										'margin-top': (containerMarginTop - ($(this).height() / 1.5) - 3) + 'px'
									}, 250, function () {

										$('#ctcOverlayClosebtn').removeClass('overlayContentloading');
									});
								});

							}).attr('data-overlay-img', currentImageNumber);
					} else {

						let imgTitle = $('.ctcOverlayLoadedImage[data-img-number = "' + currentImageNumber + '"]').attr('title');
						let imgAlt = $('.ctcOverlayLoadedImage[data-img-number = "' + currentImageNumber + '"]').attr('alt');
						//first load alt image
						if (returnImgTitleAlt(imgTitle)) {

							$('#ctcLoadedImgAltTitle').show().empty().prepend(imgTitle);
						} else if (returnImgTitleAlt(imgAlt)) {

							$('#ctcLoadedImgAltTitle').show().empty().prepend(imgAlt);
						} else {

							$('#ctcLoadedImgAltTitle').hide().empty();

						}

						$('#ctcOverlayImageContainer').css({
							'background-image': 'url(' + imageToLoad + ')',
							'opacity': 0,
							'margin-left': containerMarginLeft + 'px',
							'margin-top': containerMarginTop + 'px',
							'width': optimizedImageWidth + 'px',
							'height': optimizedImageHeight + 'px',
						})
							.animate({
								opacity: 1,

							}, 300, function () {

								closeButton.animate({
									'margin-right': (screenWidth - optimizedImageWidth - containerMarginLeft - (closeButton.width() / 1.2)) + 'px'
								}, 300, function () {
									$(this).animate({
										'margin-top': (containerMarginTop - ($(this).height() / 1.5)) + 'px'
									}, 250, function () {

										$('#ctcOverlayClosebtn').removeClass('overlayContentloading');

									});

								});




							}).attr('data-overlay-img', currentImageNumber);

					}

				});


			});


		}

		return this;

	};

}(jQuery));


/*
 * 
 * Section to deal with adding element to the overlay
 * 
 * 
 * 
 */

(function ($) {
	$.ctcOverlayEl = function (param, jqAjax) {

		$('body').css('overflow', 'hidden');

		let elHeight = '200px';
		let elWidth = '350px';
		var elHtml;
		var ajaxMethod = 'GET';
		var ajaxData = '';
		var hideExitBtn = 'NO';

		if (param.hideCloseBtn != undefined && param.hideCloseBtn.toUpperCase() == 'YES') {
			hideExitBtn = 'YES';
		}

		if (param.elemHeight != undefined) {
			elHeight = param.elemHeight;
		}

		if (param.elemWidth != undefined) {
			elWidth = param.elemWidth;
		}

		//script to lod content on overlay based on user actions		
		if (jqAjax !== undefined) {
			//make ajax call
			$.ajax(jqAjax).done(function (response) {
				ctcLoadOverlayEl(response);
			}).fail(function () {
				alert("Action could not be completed at this time.");
				$('body').css('overflow', 'auto');
			});

		} else if (param.ajaxUrl !== undefined) {

			//check of ajax method is set
			if (param.ajaxMethod !== undefined) {
				ajaxMethod = param.ajaxMethod;
			}

			//check if ajaxData is set
			if (param.ajaxData !== undefined) {
				ajaxData = param.ajaxData;
			}

			//make ajax call 
			$.ajax({
				method: ajaxMethod,
				url: param.ajaxUrl,
				data: ajaxData
			})
				.done(function (response) {
					ctcLoadOverlayEl(response);
				}).fail(function () {
					alert("Action could not be completed at this time.");
					$('body').css('overflow', 'auto');
				});

		} else if (param.modalMessage != undefined) {
			hideExitBtn = 'YES';
			ctcLoadOverlayEl('<div style="font-size:18px;float:left;" id="ctcOverlayModal">' + param.modalMessage + '<div style="margin-left:auto;margin-right:auto;display:block;"><button style="font-size:22px;" id="ctcOverlayModaButton"> OK </button></div></div>');
		} else if (param.iframeUrl !== undefined) {

			ctcLoadOverlayEl('<iframe height="' + elHeight + '" width="' + elWidth + '" src="' + param.iframeUrl + '" allowfullscreen>></iframe>');
		} else if (param.elemSelector !== undefined) {
			ctcLoadOverlayEl($(param.elemSelector).html());
		}

		$(document).on('click', '#ctcOverlayModal', function () {

			$('#overlayElContainer').animate({
				opacity: 0
			}, 10, function () {

				$("#ctcOverlayEl").animate({
					height: 0,
					opacity: 0
				}, 10, function () {
					$(this).remove();
					$('body').css('overflow', 'auto');
				});
			});

		});

		//script to run when clode butto is pressed	 
		document.addEventListener('keydown', function (event) {

			if ($("#ctcOverlayEl").height() !== 0) {
				if (event.code == 'Escape') {
					$('#ctcOverlayElClosebtn').click();
				}
			}

		});

		$(document).on('click', '#ctcOverlayElClosebtn', function () {
			$('#overlayElContainer').animate({
				opacity: 0
			}, 10, function () {

				$("#ctcOverlayEl").animate({
					height: 0,
					opacity: 0
				}, 10, function () {
					$(this).remove();
					$('body').css('overflow', 'auto');
				});
			});


		});


		//script to run on window resize 
		$(window).resize(function () {

			let reziseHtml = $('#overlayElContainer').html();


			if ($('#ctcOverlayEl').length > 0) {
				ctcLoadOverlayEl(reziseHtml);
			}
			return false;
		});


		//function to load content to overlay
		function ctcLoadOverlayEl(elHtml) {

			//script to deal with loading content to the overlay
			var screenWidth = window.screen.width > window.innerWidth ? window.innerWidth : window.screen.width;
			var screenHeight = window.screen.height > window.innerHeight ? window.innerHeight : window.screen.height;




			let overlayContainerEl = '';
			overlayContainerEl += '<div  id="ctcOverlayEl" class="ctcOverlayEl" style="font-size:14px;">';
			if (hideExitBtn == 'NO') {
				overlayContainerEl += '<span id="ctcOverlayElClosebtn" title="close" class="ctcOverlayElClosebtn" ></span>';
			}
			overlayContainerEl += '<div id="overlayElContainer" class="overlayElContainer" style="margin-left:auto;margin-right:auto;dsiaply:block;height:' + elHeight + ';width:' + elWidth + '">' + elHtml + ' </div>';
			overlayContainerEl += '</div>';
			$("#ctcOverlayEl").remove();
			$('body').prepend(overlayContainerEl);


			var marginHor = (screenWidth - $('#overlayElContainer').width()) / 2;
			var marginVer = (screenHeight - $('#overlayElContainer').height()) / 2;



			$('#overlayElContainer').css({
				'margin-left': marginHor + 'px',
				'margin-top': marginVer + 'px'
			});

			$('#ctcOverlayElClosebtn').css({
				'margin-right': (marginHor - $('#ctcOverlayElClosebtn').width()) + 'px',
				'margin-top': (marginVer - $('#ctcOverlayElClosebtn').height()) + 'px',
			});

			$("#ctcOverlayEl").animate({
				width: screenWidth,
				height: screenHeight,
				opacity: 1
			}, 10, function () {
				$('#overlayElContainer').animate({
					opacity: 1
				}, 10, function () { });
			});




		}
		return this;
	}

}(jQuery));