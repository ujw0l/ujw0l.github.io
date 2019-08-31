'use strict'
class mySite {

    constructor() {

        this.createOverlayAndSideBar();
        
    }

    createOverlayAndSideBar() {
        let colorCodes = ['rgba(40,116,166,1)', 'rgba(127, 63, 191,1)', 'rgba(102, 51, 153,1)', 'rgba(242, 126, 42, 1)', 'rgba(49, 42, 242, 1)', 'rgba(27, 167, 201, 1)', 'rgba(27, 201, 149, 1)', 'rgba(180, 23, 26, 1)', 'rgba(23, 141, 180, 1)', 'rgba(rgba(60, 178, 20,1)', 'rgba(60, 178, 20, 1)', 'rgba(20, 178, 138, 1)', 'rgba(20, 178, 138, 1)', 'rgba(240, 34, 220, 1)', 'rgba(218, 11, 52, 1)', 'rgba(11, 28, 218, 1)', 'rgba(27, 247, 189, 1)'];
        let sidebarOpts = Array();
        let overlayDiv = document.createElement("div");
        let bgColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];

        overlayDiv.id = "site-overlay";
        overlayDiv.classList.add(`site-overlay`);
        overlayDiv.style.backgroundColor = bgColor;
        document.body.appendChild(overlayDiv);


        let infoContainer = document.createElement('div');
        infoContainer.id = 'site-info-container';
        infoContainer.classList.add('site-info-container');
        overlayDiv.appendChild(infoContainer);


        let sidebarDiv = document.createElement('div');
        sidebarDiv.id = `site-sidebar`;
        sidebarDiv.classList.add(`site-sidebar`);
        sidebarDiv.style = `width:5%; height:${overlayDiv.offsetHeight}px;`;
        overlayDiv.appendChild(sidebarDiv);
        let divStyle = `height:${toolbar.offsetWidth - 6}px;`;


        let aboutMeDiv = document.createElement('div');
        aboutMeDiv.id = `about-me`;
        aboutMeDiv.classList.add(`about-me`);
        aboutMeDiv.setAttribute('data-title', `About Me`);
        aboutMeDiv.style = divStyle;
        aboutMeDiv.innerHTML = '&#581;';
        sidebarOpts.push(aboutMeDiv);

        let contactMeDiv = document.createElement('div');
        contactMeDiv.id = `contact-me`;
        contactMeDiv.classList.add(`contact-me`);
        contactMeDiv.setAttribute('data-title', `Contact Me`);
        contactMeDiv.style = divStyle;
        contactMeDiv.setAttribute('data-img-src', '');
        contactMeDiv.innerHTML = '&#9743;';
        sidebarOpts.push(contactMeDiv);

    
        let myWork = document.createElement('div');
        myWork.id = `my-work`;
        myWork.classList.add(`my-work`);
        myWork.setAttribute('data-title', `My Work`);
        myWork.style = divStyle;
        myWork.innerHTML = '&#9816;';
        sidebarOpts.push(myWork);

        let supportMeDiv = document.createElement('div');
        supportMeDiv.id = `support-me`;
        supportMeDiv.classList.add(`support-me`);
        supportMeDiv.setAttribute('data-title', `Support Me`);
        supportMeDiv.style = divStyle;
        supportMeDiv.innerHTML = '$';
        supportMeDiv.addEventListener('click', ()=>window.open('https://www.patreon.com/ujw0l', '_blank'));
        sidebarOpts.push(supportMeDiv);



        sidebarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (sidebarOpts.length * sidebarDiv.offsetWidth)) / 2) + 'px'

        sidebarOpts.map((x, i) => {
            setTimeout(() => {
                sidebarDiv.appendChild(x);
                x.style.backgroundColor = bgColor;
                x.style.height = x.offsetWidth - 5 + 'px';
                x.style.opacity = '1';
                x.style.boxShadow = `-1px -1px 1px ${bgColor}`;
                x.style.fontSize = (0.70 * x.offsetWidth) + 'px';
                x.addEventListener('mouseenter', event => this.animateTitle(event));
                x.addEventListener('mouseleave', () => document.querySelector('#site-sidebar').removeChild(document.querySelector('#info-para')));
            }, (150 * i))
        });

        this.requiredEventListener();
        window.addEventListener('resize',()=>this.resizePage());
        this.loadAboutMe();

    }


    resizePage(){

        let overlayDiv = document.querySelector('#site-overlay');
        let toolbarDiv = document.querySelector('#site-sidebar');
        let siteContent = document.querySelector('#site-info-container');
        let toolbarOpts = Array.from(toolbarDiv.querySelectorAll('div'));

        siteContent.style.width = (0.90*overlayDiv.offsetWidth)+'px';
        toolbarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (toolbarOpts.length * toolbarDiv.offsetWidth)) / 2) + 'px';
        toolbarDiv.style.width = (0.05*overlayDiv.offsetWidth)+'px';
        toolbarDiv.style.height = overlayDiv.offsetHeight+'px';
        toolbarOpts.map(x => {
            x.style.height = x.offsetWidth + 'px';
            x.style.fontSize = (0.70 * x.offsetWidth) + 'px';
        });
    }



    animateTitle(e) {

        let colorCodes = ['rgba(40,116,166,1)', 'rgba(127, 63, 191,1)', 'rgba(102, 51, 153,1)', 'rgba(242, 126, 42, 1)', 'rgba(49, 42, 242, 1)', 'rgba(27, 167, 201, 1)', 'rgba(27, 201, 149, 1)', 'rgba(180, 23, 26, 1)', 'rgba(23, 141, 180, 1)', 'rgba(rgba(60, 178, 20,1)', 'rgba(60, 178, 20, 1)', 'rgba(20, 178, 138, 1)', 'rgba(20, 178, 138, 1)', 'rgba(240, 34, 220, 1)', 'rgba(218, 11, 52, 1)', 'rgba(11, 28, 218, 1)', 'rgba(27, 247, 189, 1)'];
        let sidebarDiv = document.querySelector('#site-sidebar');
        let infoPara = document.createElement('p');
        infoPara.id = 'info-para';
        infoPara.classList.add('info-para');
        sidebarDiv.appendChild(infoPara);

        e.target.getAttribute('data-title').split('').map((x, i) => {
            setTimeout(() => {
                let letterB = document.createElement('b');
                let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                letterB.innerHTML = x;
                letterB.style.color = randColor;
                letterB.style.textShadow = `0px 1px 5px ${randColor}`;
                infoPara.appendChild(letterB);
            }, (30 * i))

        });

    }


    loadAboutMe() {
        let infoDiv = document.querySelector('#site-info-container');
        infoDiv.innerHTML = '';
        let colorCodes = ['rgba(40,116,166,1)', 'rgba(127, 63, 191,1)', 'rgba(102, 51, 153,1)', 'rgba(242, 126, 42, 1)', 'rgba(49, 42, 242, 1)', 'rgba(27, 167, 201, 1)', 'rgba(27, 201, 149, 1)', 'rgba(180, 23, 26, 1)', 'rgba(23, 141, 180, 1)', 'rgba(rgba(60, 178, 20,1)', 'rgba(60, 178, 20, 1)', 'rgba(20, 178, 138, 1)', 'rgba(20, 178, 138, 1)', 'rgba(240, 34, 220, 1)', 'rgba(218, 11, 52, 1)', 'rgba(11, 28, 218, 1)', 'rgba(27, 247, 189, 1)'];
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", 'site/assets/ajax-content/about-me.txt', true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.onload = function () {
            if (this.status >= 200 && this.status < 400) {

                let secHeader = document.createElement('h1');
                secHeader.id = `section-header`;
                secHeader.classList.add('section-header');
                infoDiv.appendChild(secHeader);

                let secInfo = document.createElement('div');
                secInfo.id = 'about-me-info';
                secInfo.classList.add('about-me-info');
                infoDiv.appendChild(secInfo);

                let contentArr = this.response.split('<break>');

                contentArr.map((content, i) => {
                    if (0 === i) {
                        content.split('').map((x, i) => {
                            setTimeout(() => {
                                let headerB = document.createElement('b');
                                let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                headerB.innerHTML = x;
                                headerB.style.color = randColor;
                                headerB.style.textShadow = `0px 2px 10px ${randColor}`;
                                secHeader.appendChild(headerB);
                            }, (100 * i));
                        });
                    } else {

                        secInfo.appendChild(document.createElement('br'));
                        secInfo.appendChild(document.createElement('br'));
                        secInfo.appendChild(document.createElement('br'));
                        content.split('').map((x, i) => {
                            setTimeout(() => {
                                let infoB = document.createElement('b')
                                let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                if (i == 704) {
                                    infoB.innerHTML = x + '<br/><br/>';
                                } else {
                                    infoB.innerHTML = x;
                                }
                                infoB.style.color = randColor;
                                infoB.style.textShadow = `0px 1px 5px ${randColor}`;
                                secInfo.appendChild(infoB);
                            }, (20 * i));
                        });
                    }

                });

            } else {
                alert(this.response);
            }
        };
        xhttp.onerror = function () {
            alert(takePicMessage.connection_error);
        };

        xhttp.send();

        setTimeout(() => {

            document.querySelector('#about-me').style.borderRadius = '10%';
            document.querySelector('#contact-me').style.borderRadius = '';
            document.querySelector('#my-work').style.borderRadius = '';

        }, 1100);

    }

    loadContactMe() {

        let infoDiv = document.querySelector('#site-info-container');
        infoDiv.innerHTML = '';

        let colorCodes = ['rgba(40,116,166,1)', 'rgba(127, 63, 191,1)', 'rgba(102, 51, 153,1)', 'rgba(242, 126, 42, 1)', 'rgba(49, 42, 242, 1)', 'rgba(27, 167, 201, 1)', 'rgba(27, 201, 149, 1)', 'rgba(180, 23, 26, 1)', 'rgba(23, 141, 180, 1)', 'rgba(rgba(60, 178, 20,1)', 'rgba(60, 178, 20, 1)', 'rgba(20, 178, 138, 1)', 'rgba(20, 178, 138, 1)', 'rgba(240, 34, 220, 1)', 'rgba(218, 11, 52, 1)', 'rgba(11, 28, 218, 1)', 'rgba(27, 247, 189, 1)'];
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", 'site/assets/ajax-content/contact-me.txt', true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.onload = function () {
            if (this.status >= 200 && this.status < 400) {

                let secHeader = document.createElement('h1');
                secHeader.id = `section-header`;
                secHeader.classList.add('section-header');
                infoDiv.appendChild(secHeader);

                let secInfo = document.createElement('div');
                secInfo.id = 'contact-me-info';
                secInfo.classList.add('contact-me-info');
                infoDiv.appendChild(secInfo);

                console.log(secInfo);

                let contentArr = this.response.split('<break>');

                contentArr.map((content, i) => {

                    if (0 === i) {

                        content.split('').map((x, i) => {
                            setTimeout(() => {
                                let headerB = document.createElement('b');
                                let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                headerB.innerHTML = x;
                                headerB.style.color = randColor;
                                headerB.style.textShadow = `0px 2px 10px ${randColor}`;
                                secHeader.appendChild(headerB);
                            }, (100 * i));
                        });

                    } else {
                        content.split('').map((x, i) => {
                            setTimeout(() => {
                                let infoB = document.createElement('b')
                                let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                if (i === 27 || i === 55 || i === 82 || i === 101) {
                                    infoB.innerHTML = x + '<br/><br/>';
                                } else {
                                    infoB.innerHTML = x;
                                }
                                infoB.style.color = randColor;
                                infoB.style.textShadow = `0px 1px 5px ${randColor}`;
                                secInfo.appendChild(infoB);
                            }, (100 * i));
                        });
                    }

                });

            } else {
                alert(this.response);
            }
        };
        xhttp.onerror = function () {
            alert(takePicMessage.connection_error);
        };

        xhttp.send();

        setTimeout(() => {
            document.querySelector('#contact-me').style.borderRadius = '10%';
            document.querySelector('#about-me').style.borderRadius = '';
            document.querySelector('#my-work').style.borderRadius = '';

        }, 1100);

    }

    loadMyWork(){

        let infoDiv = document.querySelector('#site-info-container');
        infoDiv.innerHTML = '';

        let colorCodes = ['rgba(40,116,166,1)', 'rgba(127, 63, 191,1)', 'rgba(102, 51, 153,1)', 'rgba(242, 126, 42, 1)', 'rgba(49, 42, 242, 1)', 'rgba(27, 167, 201, 1)', 'rgba(27, 201, 149, 1)', 'rgba(180, 23, 26, 1)', 'rgba(23, 141, 180, 1)', 'rgba(rgba(60, 178, 20,1)', 'rgba(60, 178, 20, 1)', 'rgba(20, 178, 138, 1)', 'rgba(20, 178, 138, 1)', 'rgba(240, 34, 220, 1)', 'rgba(218, 11, 52, 1)', 'rgba(11, 28, 218, 1)', 'rgba(27, 247, 189, 1)'];
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", 'site/assets/ajax-content/my-work.txt', true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.onload = function () {
            if (this.status >= 200 && this.status < 400) {

                let secHeader = document.createElement('h1');
                secHeader.id = `section-header`;
                secHeader.classList.add('section-header');
                infoDiv.appendChild(secHeader);

                let secInfo = document.createElement('div');
                secInfo.id = 'my-work-info';
                secInfo.classList.add('my-work-info');
                infoDiv.appendChild(secInfo);

                let contentArr = this.response.split('<break>');

                contentArr.map((content, i) => {

                    if (0 === i) {

                        content.split('').map((x, i) => {
                            setTimeout(() => {
                                let headerB = document.createElement('b');
                                let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                headerB.style.color = randColor;
                                headerB.style.textShadow = `0px 2px 10px ${randColor}`;
                                headerB.innerHTML = x;
                                secHeader.appendChild(headerB);
                            }, (100 * i));
                        });
                    } else {
                        content.split('<brk>').map((links, index) => {

                         setTimeout(()=>{  
                            let clickText = Array(' : ', 'C','L','I','C','K', ' ', 'H','E','R','E');
                             let linkTxt = links.split('->');
                             let profDiv =  document.createElement('div');
                                    profDiv.id = 'prof-div'+index;
                                    profDiv.classList.add('prof-div');
                                let profName = document.createElement('span');
                                let profLink = document.createElement('a');
                                    profLink.target = '_blank';
                                    profLink.href = linkTxt[1];
            
                                 profDiv.appendChild(profName);
                                 profDiv.appendChild(profLink);
                                secInfo.appendChild(profDiv);

                            linkTxt[0].split('').map((x,indx)=>{

                                setTimeout(()=>{
                                    let profTxtB = document.createElement('b');
                                    let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                    profTxtB.style.color = randColor;
                                    profTxtB.style.textShadow = `0px 1px 5px ${randColor}`;
                                    profTxtB.innerHTML = x;
                                    profName.appendChild(profTxtB);
                                }, (50*indx));

                            });

                            clickText.map((a,indx)=>{
                                setTimeout(()=>{
                                    let lnkTxtB = document.createElement('b');
                                    let randColor = colorCodes[Math.floor(Math.random() * (colorCodes.length + 1))];
                                    lnkTxtB.style.color = randColor;
                                    lnkTxtB.style.textShadow = `0px 1px 5px ${randColor}`;
                                    lnkTxtB.innerHTML = a;
                                    profLink.appendChild(lnkTxtB);
                                }, (50*indx));
                            });
                        },(1000*(index+1)));
                    });
                    }

                });

            } else {
                alert(this.response);
            }
        };
        xhttp.onerror = function () {
            alert(takePicMessage.connection_error);
        };

        xhttp.send();

        setTimeout(() => {
            document.querySelector('#contact-me').style.borderRadius = '';
            document.querySelector('#about-me').style.borderRadius = '';
            document.querySelector('#my-work').style.borderRadius = '10%';

        }, 1100);


    }

    requiredEventListener() {

        setTimeout(() => {
            document.querySelector('#about-me').addEventListener('click', () => this.loadAboutMe());
            document.querySelector('#contact-me').addEventListener('click', () => this.loadContactMe());
            document.querySelector('#my-work').addEventListener('click', () => this.loadMyWork());
        }, 1100);


    }



}