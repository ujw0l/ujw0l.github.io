/*
 * 
 * 
 * 
 * Image carousel
 *  Images  carousel library written in vanilla js
 * https://ujwolbastakoti.wordpress.com/
 * MIT license
 * 
 * 
 * 
 */

class imageCarousel{
    constructor(sel,param1){
        Array.from(document.querySelectorAll(sel)).map((x,i)=>this.prepCarousel(x , i, param1))
    }

    /*
    * Prepare carousel 
    *
    *@param gal Image gallery object
    *@param galNum gallery number
    *@param param1 Additional settings for carousel
    *
    */
    prepCarousel(gal,galNum,param1){ 

      
        let maxWidth = gal.offsetWidth;
        let maxHeight = gal.offsetHeight;
        let carDivsObj = {};


        let imgs = Array.from(gal.querySelectorAll('img'));
        imgs.map((x,i)=>x.style.display ='none')
         
        let prevThreeDiv =  document.createElement('div');
             prevThreeDiv.style = `width:${(0.42)*maxWidth}px;height:${0.7*maxHeight}px;z-index:400;display:inline-block;position:absolute;margin-top:${0.15*maxHeight}px;margin-left:0px;background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:cover;box-shadow:0px 5px 10px 2px black;`;
             carDivsObj.prevThree = prevThreeDiv,
             gal.appendChild( prevThreeDiv);

        let prevTwoDiv =  document.createElement('div');
             prevTwoDiv.style = `width:${(0.49)*maxWidth}px;height:${0.8*maxHeight}px;z-index:500;display:inline-block;position:absolute;margin-top:${0.1*maxHeight}px;margin-left:${0.06*maxWidth}px;background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:cover;box-shadow:0px 10px 15px 2px black;`;
             carDivsObj.prevTwo = prevTwoDiv,
             gal.appendChild( prevTwoDiv);

        let prevOneDiv =  document.createElement('div');
             prevOneDiv.style = `width:${(0.63)*maxWidth}px;height:${0.9*maxHeight}px;z-index:700;display:inline-block;position:absolute;margin-top:${0.05*maxHeight}px;margin-left:${0.14*maxWidth}px;background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:cover;box-shadow:0px 15px 20px 2px black;`;
             carDivsObj.prevOne = prevOneDiv;  
             gal.appendChild( prevOneDiv);
         
        let mainDiv =  document.createElement('div');
             mainDiv.style = `width:${0.52*maxWidth}px;height:${maxHeight}px;z-index:1000;display:inline-block;position:absolute;margin-top:0px;margin-left:${0.24*maxWidth}px;background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:contain;box-shadow:0px 20px 25px 2px black;`;
             carDivsObj.mainDiv=mainDiv;
             gal.appendChild( mainDiv);

        let nextOneDiv =  document.createElement('div');
            nextOneDiv.style = `width:${(0.63)*maxWidth}px;height:${0.9*maxHeight}px;z-index:700;display:inline-block;position:absolute;margin-top:${0.05*maxHeight}px;margin-left:${0.24*maxWidth}px;background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:cover;box-shadow:0px 15px 20px 2px black;`;
            carDivsObj.nextOne = nextOneDiv;
            gal.appendChild( nextOneDiv);

        let nextTwoDiv =  document.createElement('div');
            nextTwoDiv.style = `width:${(0.49)*maxWidth}px;height:${0.8*maxHeight}px;z-index:500;display:inline-block;position:absolute;margin-top:${0.1*maxHeight}px;margin-left:${0.45*maxWidth}px;background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:cover;box-shadow:0px 10px 15px 2px black;`;
            carDivsObj.nextTwo=nextTwoDiv;
            gal.appendChild( nextTwoDiv);


        let nextThreeDiv =  document.createElement('div');
            nextThreeDiv.style = `width:${(0.42)*maxWidth}px;height:${0.7*maxHeight}px;z-index:400;display:inline-block;position:absolute;margin-top:${0.15*maxHeight}px;margin-left:${0.58*maxWidth};background :rgba(0, 0 , 0, 1) url("") no-repeat center; background-size:cover;box-shadow:0px 5px 10px 2px black;`;
            carDivsObj.nextThree = nextThreeDiv,
            gal.appendChild( nextThreeDiv);    


            this.createCarousel(0,imgs,carDivsObj,galNum,param1);

            for (let i in carDivsObj){
                if ('mainDiv' != i){
                    carDivsObj[i].addEventListener('click', event=>this.createCarousel(parseInt(event.target.getAttribute('data-num')), imgs, carDivsObj,galNum, param1 ));
                    carDivsObj[i].addEventListener('mouseenter', event=>event.target.style.border ='1px dotted rgba(0,0,0,0)')
                    carDivsObj[i].addEventListener('mouseleave', event=>event.target.style.border ='')
                }
            }

            if(undefined != param1  && 'function' == typeof(param1.callBack)){
           
                param1.callBack(gal);
    
        } 

            window.addEventListener('resize', ()=>this.adjustOnResize(gal, carDivsObj,galNum)) 
    }
    /*
    * Create carousel 
    *
    *@param i Image number
    *@param gal Image gallery object
    *@param carDivs Carousel divs object
    *@param galNum Gallery number
    *@param param1 Additional settings for carousel
    *
    */
    createCarousel(i,gal,carDivs, galNum, param1){

        let prevThreeNum ; 
            if(i == 0){prevThreeNum  =  gal.length-3}
            else if(i == 1){prevThreeNum  = gal.length-2}
            else if(i == 2){prevThreeNum  = gal.length-1}
            else{prevThreeNum  = i-3}


        let prevTwoNum ;
            if(i == 0){prevTwoNum =  gal.length-2}
            else if(i == 1){prevTwoNum = gal.length-1}
            else{prevTwoNum = i-2}


        let prevOneNum ;
            if(i == 0){prevOneNum =  gal.length-1}
            else{prevOneNum  = i-1} 

        let nextOneNum ;
            if(i == gal.length-1){nextOneNum = 0}
            else{nextOneNum = i+1} 


        let nextTwoNum;
            if(i == gal.length-1){nextTwoNum= 1}
            else if(i == gal.length-2){nextTwoNum= 0}
            else{nextTwoNum = i+2}

        let nextThreeNum;
            if(i == gal.length-1){nextThreeNum= 2}
            else if(i == gal.length-2){nextThreeNum= 1}
            else if(i == gal.length-3){nextThreeNum= 0}
            else{nextThreeNum = i+3}   
       

        carDivs.prevThree.style.backgroundImage = `url('${gal[prevThreeNum ].src}')`; 
        carDivs.prevThree.title = undefined != gal[prevThreeNum].title ? gal[prevThreeNum].title:'';
        carDivs.prevThree.setAttribute('data-num',prevThreeNum)    

        carDivs.prevTwo.style.backgroundImage = `url('${gal[prevTwoNum ].src}')`; 
        carDivs.prevTwo.title = undefined != gal[prevTwoNum].title ? gal[prevTwoNum].title:'';
        carDivs.prevTwo.setAttribute('data-num',prevTwoNum)

        carDivs.prevOne.style.backgroundImage = `url('${gal[prevOneNum].src}')`; 
        carDivs.prevOne.title = undefined != gal[prevOneNum].title ? gal[prevOneNum].title:'';
        carDivs.prevOne.setAttribute('data-num',prevOneNum)  

        let mainImg = new Image();
            mainImg.src  = gal[i].src;
            mainImg.title =  undefined != gal[i].title ? gal[i].title:''; 

            carDivs.mainDiv.style.backgroundImage = `url('')`;

        let loadingDivCir=   carDivs.mainDiv.querySelector('#img-loading-'+galNum); 

         if(null == loadingDivCir){
                    
                loadingDivCir =  document.createElement('div');
                loadingDivCir.id = `img-loading-${galNum}`;
                loadingDivCir.style = `margin-left:${(carDivs.mainDiv.offsetWidth-40)/2}px;margin-top:${(carDivs.mainDiv.offsetHeight-40)/2}px;height:40px;width:40px;border-radius:50%;border-color:rgba(255,255,255,1);border-style: solid; border-width: 3px;z-index:1100; `;
                loadingDivCir.setAttribute('data-wait','left');
                carDivs.mainDiv.appendChild(loadingDivCir);

            var loadingInt = setInterval(()=>{
                switch( loadingDivCir.getAttribute('data-wait')){
                    case 'left': 
                        loadingDivCir.setAttribute('data-wait','top');
                        loadingDivCir.style.borderColor = 'rgba(255,255,255,0.5)';
                        loadingDivCir.style.borderTop = '3px solid  rgba(255,255,255,0.8)';
                    break;
                    case 'top':
                            loadingDivCir.setAttribute('data-wait','right');
                            loadingDivCir.style.borderColor = 'rgba(255,255,255,0.5)';
                            loadingDivCir.style.borderRight = '3px solid  rgba(255,255,255,0.8)';
                    break;
                    case 'right':
                            loadingDivCir.setAttribute('data-wait','bottom');
                            loadingDivCir.style.borderColor = 'rgba(255,255,255,0.5)';
                            loadingDivCir.style.borderBottom = '3px solid  rgba(255,255,255,0.8)';

                    break;
                    case 'bottom':
                            loadingDivCir.setAttribute('data-wait','left');
                            loadingDivCir.style.borderColor = 'rgba(255,255,255,0.5)';
                            loadingDivCir.style.borderLeft = '3px solid  rgba(255,255,255,0.8)';
                    break;
                }
                
            }, 400);
        }

        
        mainImg.addEventListener('load',(event)=>{
            clearInterval(loadingInt);
            carDivs.mainDiv.removeChild(loadingDivCir)
            carDivs.mainDiv.style.backgroundImage = `url('${event.target.src}')`;
            carDivs.mainDiv.title = undefined != event.target.title ? event.target.title:'';
         })   
       


        carDivs.nextOne.style.backgroundImage = `url('${gal[nextOneNum].src}')`; 
        carDivs.nextOne.title = undefined != gal[nextOneNum].title ? gal[nextOneNum].title:'';
        carDivs.nextOne.setAttribute('data-num',nextOneNum);

        carDivs.nextTwo.style.backgroundImage = `url('${gal[nextTwoNum].src}')`; 
        carDivs.nextTwo.title =  undefined != gal[nextTwoNum].title ? gal[nextTwoNum].title:'';
        carDivs.nextTwo.setAttribute('data-num',nextTwoNum); 

        carDivs.nextThree.style.backgroundImage = `url('${gal[nextThreeNum].src}')`; 
        carDivs.nextThree.title =  undefined != gal[nextThreeNum].title ? gal[nextThreeNum].title:'';
        carDivs.nextThree.setAttribute('data-num',nextThreeNum);



        
       
        
    }


    /*
    * Adjust carousel on resize
    *
    *@param gal Image gallery object
    *@param carDivs Carousel divs object
    *@param param1 Additional settings for carousel
    *
    */

    adjustOnResize(gal, carDivObj,galNum){

        let maxWidth = gal.offsetWidth;
        let maxHeight = gal.offsetHeight;



        let prevThreeDiv =  carDivObj.prevThree;
        prevThreeDiv.style.width = `${(0.42)*maxWidth}px`;
        prevThreeDiv.style.height = `${0.7*maxHeight}px` ;
        prevThreeDiv.style.marginTop =  `${0.15*maxHeight}px`;
        prevThreeDiv.style.marginLeft =  `0px`;

            let prevTwoDiv =  carDivObj.prevTwo;
                prevTwoDiv.style.width = `${(0.49)*maxWidth}px`;
                prevTwoDiv.style.height = `${0.8*maxHeight}px` ;
                prevTwoDiv.style.marginTop =  `${0.1*maxHeight}px`;
                prevTwoDiv.style.marginLeft =  `${0.06*maxWidth}px`;
            
            let prevOneDiv =   carDivObj.prevOne;
                prevOneDiv.style.width = `${(0.63)*maxWidth}px`;
                prevOneDiv.style.height = `${0.9*maxHeight}px` ;
                prevOneDiv.style.marginTop =  `${0.05*maxHeight}px`;
                prevOneDiv.style.marginLeft =  `${0.14*maxWidth}px`;
            
            
            let mainDiv =   carDivObj.mainDiv;
                mainDiv.style.width = `${0.52*maxWidth}px`;
                mainDiv.style.height = `${maxHeight}px`; 
                mainDiv.style.marginTop =  `0px`;
                mainDiv.style.marginLeft =  `${0.24*maxWidth}px`;

            let loadingDiv =   mainDiv.querySelector('#img-loading-'+galNum); 
                if(undefined != loadingDiv){
                    loadingDiv.style.marginLeft = `${(mainDiv.offsetWidth-40)/2}px`;
                    loadingDiv.style.marginTop = `${(mainDiv.offsetHeight-40)/2}px`;
                }  

        
            let nextOneDiv =   carDivObj.nextOne;
                nextOneDiv.style.width = `${(0.63)*maxWidth}px`;
                nextOneDiv.style.height = `${0.9*maxHeight}px`; 
                nextOneDiv.style.marginTop =  `${0.05*maxHeight}px`;
                nextOneDiv.style.marginLeft =  `${0.24*maxWidth}px`;
            
            let nextTwoDiv =  carDivObj.nextTwo;
                nextTwoDiv.style.width = `${(0.49)*maxWidth}px`;
                nextTwoDiv.style.height = `${0.8*maxHeight}px`; 
                nextTwoDiv.style.marginTop =  `${0.1*maxHeight}px`;
                nextTwoDiv.style.marginLeft =  `${0.45*maxWidth}px`;

            let nextThreeDiv =  carDivObj.nextThree;
                nextThreeDiv.style.width = `${(0.42)*maxWidth}px`;
                nextThreeDiv.style.height = `${0.7*maxHeight}px`; 
                nextThreeDiv.style.marginTop =  `${0.15*maxHeight}px`;
                nextThreeDiv.style.marginLeft =  `${0.58*maxWidth}px`;     
            


    }

}

