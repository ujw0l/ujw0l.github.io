'use strict'
class galViewerSite {

    constructor() {
        this.createOverlayAndSideBar();
    }

    createOverlayAndSideBar() {

        let sidebarOpts = Array();
        let overlayDiv = document.createElement("div");

        let bgColor = `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 256)},${(Math.floor(Math.random() * 3) + 5) / 10})`;
        overlayDiv.id = "site-overlay";
        overlayDiv.classList.add(`site-overlay`);
        overlayDiv.style.backgroundColor = bgColor;
        document.body.appendChild(overlayDiv);


        let infoContainer = document.createElement('div');
        infoContainer.id = 'site-info-container';
        infoContainer.classList.add('site-info-container');
        infoContainer.style = `box-shadow:0px 0px 5px rgba(255,255,255,1);display:inline-block;margin:${(0.1 * overlayDiv.offsetHeight) / 2}px ${(0.05 * overlayDiv.offsetWidth / 2)}px;vertical-align:top;`;
        overlayDiv.appendChild(infoContainer);


        let sidebarDiv = document.createElement('div');
        sidebarDiv.id = `site-sidebar`;
        sidebarDiv.classList.add(`site-sidebar`);
        sidebarDiv.style = `width:5%; height:${overlayDiv.offsetHeight}px;`;
        overlayDiv.appendChild(sidebarDiv);
        let divStyle = `height:${toolbar.offsetWidth}px;`;


        let cropDemo = document.createElement('div');
        cropDemo.id = `crop-demo`;
        cropDemo.classList.add(`crop-demo`);
        cropDemo.setAttribute('title', `CTC Gallery Viewer`);
        cropDemo.style = divStyle;
        cropDemo.innerHTML = '&#68;';
        sidebarOpts.push(cropDemo);

        let docDiv = document.createElement('div');
        docDiv.id = `crop-doc`;
        docDiv.classList.add(`crop-doc`);
        docDiv.setAttribute('title', `Documentation`);
        docDiv.style = divStyle;
        docDiv.innerHTML = '&#9776;';
        sidebarOpts.push(docDiv);


        let supportProj = document.createElement('div');
        supportProj.id = `support-project`;
        supportProj.classList.add(`support-project`);
        supportProj.setAttribute('title', `Support my project`);
        supportProj.style = divStyle + `background-image:url(https://cdn2.hubspot.net/hubfs/4008838/website/logos/Tidelift-shorthand.svg);background-position:center;background-size:100% 100%;background-repeat:no-repeat;`;
        supportProj.addEventListener('click', () => window.open('https://tidelift.com/subscription/pkg/npm-ctc-gallery-viewer?utm_source=npm-ctc-gallery-viewer&utm_medium=referral&utm_campaign=readme', '_blank'));
        sidebarOpts.push(supportProj);


        sidebarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (sidebarOpts.length * sidebarDiv.offsetWidth)) / 2) + 'px'

        sidebarOpts.map((x, i) => {
            setTimeout(() => {
                sidebarDiv.appendChild(x);
                x.style.backgroundColor = bgColor;
                x.style.height = x.offsetWidth + 'px';
                x.style.boxShadow = `-1px -1px 1px ${bgColor}`;
                x.style.fontSize = (0.75 * x.offsetWidth) + 'px';
            }, (10 * i))
        });

        this.requiredEventListener();
        window.addEventListener('resize', () => this.resizePage());
        this.loadDemo();

    }


    resizePage() {

        let overlayDiv = document.querySelector('#site-overlay');
        let toolbarDiv = document.querySelector('#site-sidebar');
        let siteContent = document.querySelector('#site-info-container');
        let toolbarOpts = Array.from(document.getElementById('site-sidebar').querySelectorAll('div'));


        toolbarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (toolbarOpts.length * toolbarDiv.offsetWidth)) / 2) + 'px';
        toolbarDiv.style.width = (0.05 * overlayDiv.offsetWidth) + 'px';
        toolbarDiv.style.height = overlayDiv.offsetHeight + 'px';
        toolbarOpts.map(x => {
            x.style.height = x.offsetWidth + 'px';
            x.style.fontSize = (0.75 * x.offsetWidth) + 'px';
        });

        siteContent.style = `margin:${(0.1 * overlayDiv.offsetHeight) / 2}px ${(0.05 * overlayDiv.offsetWidth / 2)}px;`;
    }




    loadDemo() {

        let infoDiv = document.querySelector('#site-info-container');
        infoDiv.innerHTML = '';
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", 'public/ajax/demo.html', true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.onload = function () {
            if (this.status >= 200 && this.status < 400) {

                document.querySelector('#site-info-container').innerHTML = this.response;

                var overlay = new jsOverlay({ containerHt: 700, containerWd: 900, imgGallery: '.image_gallery_1,.image_gallery_2,.image_gallery_3 ', ajaxUrl: 'text.html', ajaxData: 'some data', ajaxMethod: 'post' });
                const masnry = new jsMasonry('.image_gallery_2,.image_gallery_1', { elSelector: 'img', elWidth: 225 })

                document.querySelector('#load-content').addEventListener('click', e => overlay.createOverlay({ elContent: document.querySelector("#load-content-lorem").innerHTML, containerHt: 270, containerWd: 300, }))
                document.querySelector('#iframe-content').addEventListener('click', e => overlay.createOverlay({ iframeUrl: 'https://ujw0l.github.io/', containerHt: 600, containerWd: 900, }))
                document.querySelector('#ajax-content').addEventListener('click', e => overlay.createOverlay({ ajaxUrl: './public/ajax/ajax.html', ajaxData: 'some data', ajaxMethod: 'post', containerHt: 300, containerWd: 350, }))

            } else {
                alert(this.response);
            }
        };
        xhttp.onerror = function () {
            alert(takePicMessage.connection_error);
        };

        xhttp.send();

        setTimeout(() => {
            document.querySelector('#crop-demo').style.borderRadius = '10%';
            document.querySelector('#crop-doc').style.borderRadius = '';
        }, 1100);

    }

    loadDoc() {

        let infoDiv = document.querySelector('#site-info-container');
        infoDiv.innerHTML = '';

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", 'public/ajax/doc.html', true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.onload = function () {
            if (this.status >= 200 && this.status < 400) {

                document.querySelector('#site-info-container').innerHTML = this.response;

            } else {
                alert(this.response);
            }
        };
        xhttp.onerror = function () {
            alert(takePicMessage.connection_error);
        };

        xhttp.send();

        setTimeout(() => {
            document.querySelector('#crop-doc').style.borderRadius = '10%';
            document.querySelector('#crop-demo').style.borderRadius = '';
        }, 1100);

    }



    requiredEventListener() {
        setTimeout(() => {
            document.querySelector('#crop-demo').addEventListener('click', () => this.loadDemo());
            document.querySelector('#crop-doc').addEventListener('click', () => this.loadDoc());
        }, 1100);


    }



}