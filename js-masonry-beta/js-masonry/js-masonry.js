/*
 * Js Masonry
 * javascript library to create masnory layout of elements 
 * https://ujw0l.github.io/
 * MIT license
 *  
 */

'use strict'
class jsMasonry{
   constructor(elems,opt){
     this.prepMas(elems,opt);  
   }
   /**
    * 
    * @param {*} elems Elements to apply masonry
    * @param {*} opt Masonry options
    */ 
   prepMas(elems,opt){
       let masArr =  Array.from(document.querySelectorAll(elems));
       let massApplied = 0;
       masArr.map(el=>{
                       let elFirstChild    = undefined != opt && undefined != opt.elSelector ? el.querySelector(opt.elSelector)  :  el.children[0];
                       if(undefined  != elFirstChild){
                         let brkPer = undefined != opt && undefined == opt.elWidth  && true === opt.percentWidth ? elFirstChild.offsetWidth/el.offsetWidth: null;    
                         this.layBrks(el,opt,brkPer);
                         massApplied++
                         window.addEventListener('resize',()=>this.layBrks(el,opt,brkPer,event));  
                       }  
       });
       if(1 <  massApplied){
           //window.dispatchEvent(new Event('resize'));
       } 
   }
   /**
    * 
    * @param {*} el  Element to apply masonry
    * @param {*} opt Masonry options
    * @param {*} brkPer Percent Width
    * @param {*} resizeEvnt Resize event
    */
 layBrks(el,opt,brkPer,resizeEvnt){
           let allBrks    = undefined != opt && undefined != opt.elSelector ? Array.from(el.querySelectorAll(opt.elSelector+', .mason-img-loading'))  :  Array.from(el.children); 
           let contWidth    = el.offsetWidth;
           let brkWidth    = undefined != opt && undefined != opt.elWidth ? opt.elWidth :  undefined != brkPer || null != brkPer ?contWidth*brkPer :allBrks[0].offsetWidth ; 
           let rawBrkMargin = undefined != opt && undefined != opt.elMargin ?  opt.elMargin : 0;
           let rawBrkPerRow = (contWidth-rawBrkMargin )/(brkWidth+rawBrkMargin );
           let brkPerRow = Math.floor(rawBrkPerRow); 
           let brkMargin = (((rawBrkPerRow - brkPerRow)*brkWidth) + ((rawBrkPerRow+1)*(rawBrkMargin)))/(brkPerRow+1);
           let availSpots =  Array();
           let availTop =  Array();
           for(let z = 0; z<=brkPerRow-1; z++ ){
               availTop.push(el.offsetTop+rawBrkMargin);
               availSpots.push([el.offsetTop+rawBrkMargin, el.offsetLeft+(z*brkWidth)+((z+1)*brkMargin)]);     
           } 
           allBrks.map((x,i)=>{
               let placeCount =  1;
                   availSpots.map((n,l) =>{
                       if( availTop[0] === n[0] && 1 === placeCount){
                           x.style.width = `${brkWidth}px`;
                           x.style.position = 'absolute'; 
                           x.style.left = `${n[1]}px`;
                           x.style.top = `${n[0]}px`;
                           placeCount++;
                           if('img' === x.nodeName.toLowerCase()){
                            x.style.height = ``;
                               let  brkHt = brkWidth/ x.offsetWidth * x.offsetHeight;

                              if(undefined == x.getAttribute('data-loaded')){
                                    x.style.opacity= '0'
                                    let loadImg =  new Image();
                                    loadImg.src =  x.src;
                                    let loadingDiv =  document.createElement('div');
                                        loadingDiv.id = `mas-loadin-${i}`; 
                                    loadingDiv.classList.add('mason-img-loading');
                                    let loadingDivCir =  document.createElement('div');
                                    loadingDivCir.style = `margin-left:${brkWidth/2}px;height:10px;width:10px;border-radius:50%;border-color:rgba(0,0,0,0.5);border-style: solid; border-width: 3px; `;
                                    loadingDivCir.setAttribute('data-wait','left');
                                    loadingDiv.appendChild(loadingDivCir);
                                        loadingDiv.style = `padding-top:${brkHt/2-10}px;width:${brkWidth}px;height:${brkHt}px;position:absolute;left:${n[1]}px;top:${n[0]}px;`;
                                        el.appendChild(loadingDiv);

                                        let loadingInt = setInterval(()=>{
                                            switch( loadingDivCir.getAttribute('data-wait')){
                                                case 'left': 
                                                    loadingDivCir.setAttribute('data-wait','top');
                                                    loadingDivCir.style.borderColor = 'rgba(0,0,0,0.5)';
                                                    loadingDivCir.style.borderTop = '3px solid  rgba(0,0,0,1)';
                                                break;
                                                case 'top':
                                                        loadingDivCir.setAttribute('data-wait','right');
                                                        loadingDivCir.style.borderColor = 'rgba(0,0,0,0.5)';
                                                        loadingDivCir.style.borderRight = '3px solid  rgba(0,0,0,1)';
                                                break;
                                                case 'right':
                                                        loadingDivCir.setAttribute('data-wait','bottom');
                                                        loadingDivCir.style.borderColor = 'rgba(0,0,0,0.5)';
                                                        loadingDivCir.style.borderBottom = '3px solid  rgba(0,0,0,1)';
                
                                                break;
                                                case 'bottom':
                                                        loadingDivCir.setAttribute('data-wait','left');
                                                        loadingDivCir.style.borderColor = 'rgba(0,0,0,0.5)';
                                                        loadingDivCir.style.borderLeft = '3px solid  rgba(0,0,0,1)';
                                                break;
                                            }
                                            
                                        }, 200);
                                  
                                    loadImg.addEventListener('load',(event)=>{
                                        clearInterval(loadingInt);
                                        el.removeChild(loadingDiv);
                                        x.style.height = `${brkHt}px`;
                                        x.style.opacity = ''
                                        x.setAttribute('data-loaded','loaded');
                                    });
                                    
                              } else{  
                                x.style.height = `${brkHt}px`;
                              }
                               
                               availTop[0] =  n[0]+brkHt+brkMargin;
                               availSpots[l] = [n[0]+brkHt+brkMargin, n[1]]
                               availTop.sort((a, b)=> a-b);
                           }else{
                               availTop[0] =  n[0]+x.offsetHeight+brkMargin;
                               availSpots[l] = [n[0]+x.offsetHeight+brkMargin, n[1]]
                               availTop.sort((a, b)=> a-b);
                           }
                       }
                   });
                   if(i === allBrks.length-1){
                       availTop.sort((a, b)=> b-a);
                       el.style.height =  (availTop[0] - el.offsetTop + rawBrkMargin)+'px';
                       if(undefined == resizeEvnt){
                           if(undefined != opt ) {
                               if('function' == typeof(opt.callback) ){
                                   opt.callback(el); 
                               }  
                           }else{
                                   window.dispatchEvent(new Event('resize'));
                           }
                       }    
                   }
               }); 
   }

}
