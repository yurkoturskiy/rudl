module.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t){e.exports=require("react")},function(e,t,n){e.exports=n(2)()},function(e,t,n){"use strict";var r=n(3);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,i,c){if(c!==r){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),i=n(1),c=n.n(i);var u,a,s,l=function(e){var t=e.ghostTransitionDuration,n=e.ghostTransitionTimingFunction;return o.a.createElement("div",{style:{position:"fixed",visibility:"visible",left:e.x,top:e.y,pointerEvents:"none",transition:e.drag?"none":"left ".concat(t,"ms ").concat(n,", top ").concat(t,"ms ").concat(n)},onTransitionEnd:function(){return e.onGhostEndTransition()}},e.children)},f=function(e){return function(t){t.preventDefault(),t.stopPropagation(),e({x:t.clientX,y:t.clientY})}},d=function(e){return function(t){return function(n){n.preventDefault(),n.stopPropagation(),e({isActive:!0,numOfFingers:n.touches.length,initialPos:{x:n.touches[0].clientX,y:n.touches[0].clientY},itemIndex:t})}}},p=function(e){return function(t){t.preventDefault(),t.stopPropagation(),e({x:t.touches[0].clientX,y:t.touches[0].clientY})}};function m(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function y(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var c,u=e[Symbol.iterator]();!(r=(c=u.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){g(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e){var t=e.transitionTimingFunction,n=e.transitionDuration,i=e.ghostTransitionDuration,c=e.ghostTransitionTimingFunction,b=function(){return o.a.Children.map(e.children,(function(e,t){return e.props.separator?{index:t,id:e.key,order:e.props.order,separator:e.props.separator,element:e}:{index:t,id:e.key,order:e.props.order,separator:e.props.separator,width:e.props.width,height:e.props.height,element:o.a.cloneElement(e,h({},e.props,{draggableItem:{onMouseDown:function(e){return Ce(e,t)},onMouseEnter:function(e){return Me(e,t)},onDragEnd:function(e){return De(e,t)},onTouchStart:d(B)(t),onTouchMove:p(A),onTouchEnd:function(e){return Se()},onClick:function(e){return ft()}}}))}}))},g=y(Object(r.useState)((function(){return b()})),2),v=g[0],O=g[1];Object(r.useEffect)((function(){O((function(){return b()}))}),[e.children]);var j=y(Object(r.useState)(),2),E=j[0],x=j[1],w=y(Object(r.useState)(),2),T=w[0],S=w[1],P=y(Object(r.useState)(),2),C=P[0],M=P[1],D=y(Object(r.useState)(!1),2),L=D[0],I=D[1],R=y(Object(r.useState)(!1),2),_=R[0],B=R[1],F=y(Object(r.useState)(),2),W=F[0],A=F[1],k=y(Object(r.useState)(""),2),H=(k[0],k[1]),Y=y(Object(r.useState)(),2),N=Y[0],X=Y[1],z=y(Object(r.useState)(!1),2),q=z[0],G=z[1],U=y(Object(r.useState)(),2),V=U[0],J=U[1],K=y(Object(r.useState)(!1),2),Q=K[0],Z=K[1],$=y(Object(r.useState)(),2),ee=$[0],te=$[1],ne=y(Object(r.useState)(),2),re=ne[0],oe=ne[1],ie=y(Object(r.useState)(),2),ce=ie[0],ue=ie[1],ae=y(Object(r.useState)(),2),se=ae[0],le=ae[1],fe=y(Object(r.useState)(),2),de=fe[0],pe=fe[1],me=y(Object(r.useState)(),2),ye=me[0],be=me[1],he=y(Object(r.useState)(),2),ge=he[0],ve=he[1],Oe=y(Object(r.useState)(),2),je=Oe[0],Ee=Oe[1],xe=Object(r.useMemo)((function(){return f(X)}),[X]);Object(r.useEffect)((function(){return ee&&document.addEventListener("mousemove",xe),function(){ee&&document.removeEventListener("mousemove",xe)}}),[ee,xe]),Object(r.useEffect)((function(){var e=function(e,t){var n=t.order;return v[ee].order<v[E].order?t.order>v[ee].order&&t.order<=v[E].order?n=t.order-1:t.order===v[ee].order&&(n=v[E].order):v[ee].order>v[E].order&&(t.order<v[ee].order&&t.order>=v[E].order?n=t.order+1:t.order===v[ee].order&&(n=v[E].order)),e.concat(n)};O((function(t){if("number"==typeof ee&&"number"==typeof E&&E!==ee&&!L){M(t[E].order);var n=t.reduce(e,[]),r=t.map((function(e,t){return e.order=n[t],e}));return I(!0),setTimeout((function(){I(!1)}),500),r}return t}))}),[E,ee,v,L]);var we=function(){G(!1),X(null),B(!1),A(null),Z(!1),ue(null),te(null),x(null),H("cleanup")};Object(r.useEffect)((function(){_||se||(document.body.style.overflow=ge,document.body.style.overscrollBehaviorY=je)}),[_,se]);var Te=Object(r.useMemo)((function(){return W&&Q&&document.elementFromPoint(W.x,W.y).id}),[W,Q]);Object(r.useEffect)((function(){if(Q&&Te){var e=v.find((function(e){return e.id===Te}));x(e&&e.index)}else W&&clearTimeout(u),W&&clearTimeout(a)}),[Q,v,Te,W]);var Se=function(e){H("touch end"),clearTimeout(a),clearTimeout(u),we(),B(!1)};Object(r.useEffect)((function(){ve(document.body.style.overflow),Ee(document.body.style.overscrollBehaviorY)}),[]),Object(r.useEffect)((function(){return document.addEventListener("mouseup",Pe),function(){document.removeEventListener("mouseup",Pe)}}),[]),Object(r.useEffect)((function(){"number"!=typeof T||"number"!=typeof C||C===T||Q||(e.onRearrange&&e.onRearrange(v[ee],C,v),S(null),M(null))}),[C,ee,v,T,e,Q]);var Pe=function(e){we()},Ce=function(e,t){var n;B((function(e){return n=e.isActive,e})),n&&e.preventDefault(),X({x:e.clientX,y:e.clientY}),G(!0),J({x:e.clientX,y:e.clientY}),te(t)},Me=function(e,t){return x(t)},De=function(){we()},Le=function(e){re&&e.stopPropagation()};Object(r.useEffect)((function(){q&&!Q&&(Math.abs(N.x-V.x)>=3||Math.abs(N.y-V.y)>=3)&&(Z(!0),oe(!0),S(v[ee].order)),_&&!Q&&(a=setTimeout((function(){document.body.style.overflow="hidden",document.body.style.overscrollBehaviorY="contain"}),300),u=1===_.numOfFingers&&setTimeout((function(){A(h({},_.initialPos)),te(_.itemIndex),Z(!0)}),500))}),[_,q,Q,V,N]),Object(r.useEffect)((function(){if(Q&&!se&&!ce)try{var e=document.getElementById("".concat(v[ee].id,"-wrapper")).getBoundingClientRect();ue({x:(_?_.initialPos.x:V.x)-e.left,y:(_?_.initialPos.y:V.y)-e.top})}catch(e){console.error(e)}}),[Q,ee,V,_,v,se]),Object(r.useEffect)((function(){if(Q&&ce&&(W||N)){if(!se){var e=v[ee].id,t="".concat(e,"-ghost"),n=document.getElementById(e),r=n.classList;n.classList.add("ghost",_&&"touch");var c="ghost ".concat(_&&"touch"),u="".concat(r," ").concat(c),a=o.a.cloneElement(v[ee].element,{draggableItem:{id:t,className:u}});le(a)}!ye&&be(v[ee].id),pe({x:(_?W.x:N.x)-ce.x,y:(_?W.y:N.y)-ce.y})}else if(!Q&&se){try{var l=document.getElementById("".concat(ye,"-wrapper")).getBoundingClientRect(),f=l.left,d=l.top;pe({x:f,y:d})}catch(e){console.error(e)}s=setTimeout((function(){Ie()}),i+100)}}),[N,W,_,Q,ce,ee,se,v]);var Ie=function(){clearTimeout(s),le(null),pe(null),oe(!1)};Object(r.useEffect)((function(){!se&&ye&&(document.getElementById(ye).classList.remove("ghost","touch"),be(null))}),[se]);var Re=y(Object(r.useState)(!1),2),_e=Re[0],Be=Re[1],Fe=y(Object(r.useState)(0),2),We=Fe[0],Ae=Fe[1],ke=y(Object(r.useState)(!1),2),He=ke[0],Ye=ke[1],Ne=y(Object(r.useState)({elements:[],width:0,height:0,endline:{start:{x:null,y:null},end:{x:null,y:null},byColumns:[],enterEvent:{elementsNum:0,eventHandler:e.onEndlineEnter&&e.onEndlineEnter}}}),2),Xe=Ne[0],ze=Ne[1],qe=y(Object(r.useState)(0),2),Ge=qe[0],Ue=qe[1],Ve=y(Object(r.useState)(0),2),Je=Ve[0],Ke=Ve[1],Qe=Object(r.useRef)(),Ze=Object(r.useRef)(),$e=Object(r.useRef)(),et=y(Object(r.useState)(window.innerWidth),2),tt=et[0],nt=et[1],rt=y(Object(r.useState)(!1),2),ot=rt[0],it=rt[1],ct=function(e){return it(!0)};Object(r.useEffect)((function(){return window.addEventListener("resize",ct),window.addEventListener("scroll",ut),function(){window.removeEventListener("resize",ct),window.removeEventListener("scroll",ut)}}),[]),Object(r.useEffect)((function(){window.innerWidth!==tt&&(e.onWidthResize(),nt(window.innerWidth));var t=Qe.current.offsetWidth,n=v.find((function(e){return!e.separator})),r=v[0].width||document.getElementById("".concat(n.id,"-wrapper")).offsetWidth;Ae(Math.floor(t/r)),Ye(ot),it(!1)}),[ot,v]);var ut=function(e){at()},at=function(){ze((function(e){return Ze.current&&Ze.current.getBoundingClientRect().top-window.innerHeight<=0&&e.endline.enterEvent.elementsNum!==e.elements.length&&(e.endline.enterEvent.elementsNum=e.elements.length,e.endline.enterEvent.eventHandler&&e.endline.enterEvent.eventHandler()),e}))};Object(r.useEffect)((function(){Qe.current.offsetHeight>0&&(Be(!0),at()),_e&&Ye(!0)})),Object(r.useEffect)((function(){Ye((function(){return!(v.length>Xe.elements.length)&&(v.length===Xe.elements.length||(v.length<Xe.elements.length||void 0))}))}),[v,Xe.elements.length]),Object(r.useEffect)((function(){var e,t=[],n=Xe.endline;n.byColumns=Array(We).fill(0),v.concat().sort((function(e,t){return e.order-t.order})).forEach((function(r,o){var i=document.getElementById("".concat(r.id,"-wrapper")),c=r.height||i.offsetHeight;e=r.width||i.offsetWidth;var u,a,s=document.getElementById(r.id),l=r.width||s.offsetWidth,f=r.height||s.offsetHeight,d=s.offsetLeft,p=s.offsetTop,y=Math.min.apply(Math,m(n.byColumns)),b=n.byColumns.indexOf(y),h=Math.max.apply(Math,m(n.byColumns)),g=n.byColumns.indexOf(h);if(r.separator){u=0,a=n.byColumns[g];var v=n.byColumns[g]+c;n.byColumns.fill(v)}else u=b*e,a=n.byColumns[b],n.byColumns[b]+=c;t[r.index]={x:u,y:a,cardWidth:l,cardHeight:f,cardOffsetLeft:d,cardOffsetTop:p}})),n.start.x=e*n.byColumns.indexOf(Math.min.apply(Math,m(n.byColumns))),n.start.y=Math.min.apply(Math,m(n.byColumns)),n.end.x=e*n.byColumns.indexOf(Math.max.apply(Math,m(n.byColumns))),n.end.y=Math.max.apply(Math,m(n.byColumns)),ze({elements:t,width:e*We,height:n.end.y,endline:n})}),[We,Je,Ge,v,Xe.endline]);var st=function(e){Ue(Ge+1),console.log("can't load: ",e)},lt=function(e){return Ke(Je+1)},ft=function(e){},dt=v.map((function(e,r){return o.a.createElement("div",{className:"element-bounding",id:"".concat(e.id,"-wrapper"),key:"".concat(e.id,"-wrapper"),style:{position:"absolute",margin:0,padding:0,userSelect:"none",top:"".concat(Xe.elements[r]?Xe.elements[r].y:0,"px"),left:"".concat(Xe.elements[r]?Xe.elements[r].x:0,"px"),transition:"".concat(ye!==e.id&&He&&_e?"top ".concat(n,"ms ").concat(t,", left ").concat(n,"ms ").concat(t):"none"),visibility:Xe.elements[r]&&_e?"visible":"hidden",opacity:se&&ye===v[r].id?0:1},onLoad:lt,onError:st,onClickCapture:Le},v[r].element)}));return o.a.createElement("div",{className:"masonry",ref:Qe},e.header&&_e&&o.a.createElement("div",{style:{position:"relative",width:"".concat(Xe.width,"px"),margin:"0 auto 0 auto"}},e.header),o.a.createElement("div",{style:{position:"relative",width:"".concat(Xe.width,"px"),height:"".concat(Xe.height,"px"),margin:"0 auto 0 auto",transition:He&&_e?"width ".concat(n,"ms ").concat(t):"none"},className:"boundry-box"},dt,se&&o.a.createElement(l,{x:de.x,y:de.y,drag:Q,onGhostEndTransition:Ie,ghostTransitionDuration:i,ghostTransitionTimingFunction:c},se),"number"==typeof Xe.endline.start.y&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{id:"MasonryLayoutEndlineStart",ref:Ze,style:{position:"absolute",top:"".concat(Xe.endline.start.y,"px"),left:"".concat(Xe.endline.start.x,"px")}}),o.a.createElement("div",{id:"MasonryLayoutEndlineEnd",ref:$e,style:{position:"absolute",top:"".concat(Xe.endline.end.y,"px"),left:"".concat(Xe.endline.end.x,"px")}}))))}v.propTypes={reverse:c.a.bool,onEndlineEnter:c.a.func,onRearrange:c.a.func,onWidthResize:c.a.func,transitionDuration:c.a.number,transitionTimingFunction:c.a.string,ghostTransitionDuration:c.a.number,ghostTransitionTimingFunction:c.a.string},v.defaultProps={transitionDuration:600,transitionTimingFunction:"ease",ghostTransitionDuration:200,ghostTransitionTimingFunction:"ease"};t.default=v}]);