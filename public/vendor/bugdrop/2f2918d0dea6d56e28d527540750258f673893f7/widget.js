"use strict";(()=>{function Bn(e,t){if(e.match(/^[a-z]+:\/\//i))return e;if(e.match(/^\/\//))return window.location.protocol+e;if(e.match(/^[a-z]+:/i))return e;let n=document.implementation.createHTMLDocument(),r=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(o),t&&(r.href=t),o.href=e,o.href}var Nn=(()=>{let e=0,t=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(e+=1,`u${t()}${e}`)})();function J(e){let t=[];for(let n=0,r=e.length;n<r;n++)t.push(e[n]);return t}var ke=null;function dt(e={}){return ke||(e.includeStyleProperties?(ke=e.includeStyleProperties,ke):(ke=J(window.getComputedStyle(document.documentElement)),ke))}function ct(e,t){let r=(e.ownerDocument.defaultView||window).getComputedStyle(e).getPropertyValue(t);return r?parseFloat(r.replace("px","")):0}function Wi(e){let t=ct(e,"border-left-width"),n=ct(e,"border-right-width");return e.clientWidth+t+n}function ji(e){let t=ct(e,"border-top-width"),n=ct(e,"border-bottom-width");return e.clientHeight+t+n}function Xt(e,t={}){let n=t.width||Wi(e),r=t.height||ji(e);return{width:n,height:r}}function _n(){let e,t;try{t=process}catch{}let n=t&&t.env?t.env.devicePixelRatio:null;return n&&(e=parseInt(n,10),Number.isNaN(e)&&(e=1)),e||window.devicePixelRatio||1}var G=16384;function Hn(e){(e.width>G||e.height>G)&&(e.width>G&&e.height>G?e.width>e.height?(e.height*=G/e.width,e.width=G):(e.width*=G/e.height,e.height=G):e.width>G?(e.height*=G/e.width,e.width=G):(e.width*=G/e.height,e.height=G))}function Te(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>t(r))})},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=e})}async function Gi(e){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(e)).then(encodeURIComponent).then(t=>`data:image/svg+xml;charset=utf-8,${t}`)}async function Vn(e,t,n){let r="http://www.w3.org/2000/svg",o=document.createElementNS(r,"svg"),i=document.createElementNS(r,"foreignObject");return o.setAttribute("width",`${t}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${t} ${n}`),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("x","0"),i.setAttribute("y","0"),i.setAttribute("externalResourcesRequired","true"),o.appendChild(i),i.appendChild(e),Gi(o)}var V=(e,t)=>{if(e instanceof t)return!0;let n=Object.getPrototypeOf(e);return n===null?!1:n.constructor.name===t.name||V(n,t)};function Xi(e){let t=e.getPropertyValue("content");return`${e.cssText} content: '${t.replace(/'|"/g,"")}';`}function Ki(e,t){return dt(t).map(n=>{let r=e.getPropertyValue(n),o=e.getPropertyPriority(n);return`${n}: ${r}${o?" !important":""};`}).join(" ")}function Yi(e,t,n,r){let o=`.${e}:${t}`,i=n.cssText?Xi(n):Ki(n,r);return document.createTextNode(`${o}{${i}}`)}function Un(e,t,n,r){let o=window.getComputedStyle(e,n),i=o.getPropertyValue("content");if(i===""||i==="none")return;let a=Nn();try{t.className=`${t.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(Yi(a,n,o,r)),t.appendChild(s)}function qn(e,t,n){Un(e,t,":before",n),Un(e,t,":after",n)}var Wn="application/font-woff",jn="image/jpeg",Zi={woff:Wn,woff2:Wn,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:jn,jpeg:jn,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Ji(e){let t=/\.([^./]*?)$/g.exec(e);return t?t[1]:""}function Ce(e){let t=Ji(e).toLowerCase();return Zi[t]||""}function Qi(e){return e.split(/,/)[1]}function qe(e){return e.search(/^(data:)/)!==-1}function Yt(e,t){return`data:${t};base64,${e}`}async function Zt(e,t,n){let r=await fetch(e,t);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);let o=await r.blob();return new Promise((i,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{i(n({res:r,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var Kt={};function ea(e,t,n){let r=e.replace(/\?.*/,"");return n&&(r=e),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),t?`[${t}]${r}`:r}async function Le(e,t,n){let r=ea(e,t,n.includeQueryParams);if(Kt[r]!=null)return Kt[r];n.cacheBust&&(e+=(/\?/.test(e)?"&":"?")+new Date().getTime());let o;try{let i=await Zt(e,n.fetchRequestInit,({res:a,result:s})=>(t||(t=a.headers.get("Content-Type")||""),Qi(s)));o=Yt(i,t)}catch(i){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${e}`;i&&(a=typeof i=="string"?i:i.message),a&&console.warn(a)}return Kt[r]=o,o}async function ta(e){let t=e.toDataURL();return t==="data:,"?e.cloneNode(!1):Te(t)}async function na(e,t){if(e.currentSrc){let i=document.createElement("canvas"),a=i.getContext("2d");i.width=e.clientWidth,i.height=e.clientHeight,a?.drawImage(e,0,0,i.width,i.height);let s=i.toDataURL();return Te(s)}let n=e.poster,r=Ce(n),o=await Le(n,r,t);return Te(o)}async function ra(e,t){var n;try{if(!((n=e?.contentDocument)===null||n===void 0)&&n.body)return await We(e.contentDocument.body,t,!0)}catch{}return e.cloneNode(!1)}async function oa(e,t){return V(e,HTMLCanvasElement)?ta(e):V(e,HTMLVideoElement)?na(e,t):V(e,HTMLIFrameElement)?ra(e,t):e.cloneNode(Gn(e))}var ia=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SLOT",Gn=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SVG";async function aa(e,t,n){var r,o;if(Gn(t))return t;let i=[];return ia(e)&&e.assignedNodes?i=J(e.assignedNodes()):V(e,HTMLIFrameElement)&&(!((r=e.contentDocument)===null||r===void 0)&&r.body)?i=J(e.contentDocument.body.childNodes):i=J(((o=e.shadowRoot)!==null&&o!==void 0?o:e).childNodes),i.length===0||V(e,HTMLVideoElement)||await i.reduce((a,s)=>a.then(()=>We(s,n)).then(l=>{l&&t.appendChild(l)}),Promise.resolve()),t}function sa(e,t,n){let r=t.style;if(!r)return;let o=window.getComputedStyle(e);o.cssText?(r.cssText=o.cssText,r.transformOrigin=o.transformOrigin):dt(n).forEach(i=>{let a=o.getPropertyValue(i);i==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),V(e,HTMLIFrameElement)&&i==="display"&&a==="inline"&&(a="block"),i==="d"&&t.getAttribute("d")&&(a=`path(${t.getAttribute("d")})`),r.setProperty(i,a,o.getPropertyPriority(i))})}function la(e,t){V(e,HTMLTextAreaElement)&&(t.innerHTML=e.value),V(e,HTMLInputElement)&&t.setAttribute("value",e.value)}function ca(e,t){if(V(e,HTMLSelectElement)){let r=Array.from(t.children).find(o=>e.value===o.getAttribute("value"));r&&r.setAttribute("selected","")}}function da(e,t,n){return V(t,Element)&&(sa(e,t,n),qn(e,t,n),la(e,t),ca(e,t)),t}async function ua(e,t){let n=e.querySelectorAll?e.querySelectorAll("use"):[];if(n.length===0)return e;let r={};for(let i=0;i<n.length;i++){let s=n[i].getAttribute("xlink:href");if(s){let l=e.querySelector(s),c=document.querySelector(s);!l&&c&&!r[s]&&(r[s]=await We(c,t,!0))}}let o=Object.values(r);if(o.length){let i="http://www.w3.org/1999/xhtml",a=document.createElementNS(i,"svg");a.setAttribute("xmlns",i),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(i,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);e.appendChild(a)}return e}async function We(e,t,n){return!n&&t.filter&&!t.filter(e)?null:Promise.resolve(e).then(r=>oa(r,t)).then(r=>aa(e,r,t)).then(r=>da(e,r,t)).then(r=>ua(r,t))}var Xn=/url\((['"]?)([^'"]+?)\1\)/g,pa=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,ma=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function ba(e){let t=e.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`,"g")}function fa(e){let t=[];return e.replace(Xn,(n,r,o)=>(t.push(o),n)),t.filter(n=>!qe(n))}async function ga(e,t,n,r,o){try{let i=n?Bn(t,n):t,a=Ce(t),s;if(o){let l=await o(i);s=Yt(l,a)}else s=await Le(i,a,r);return e.replace(ba(t),`$1${s}$3`)}catch{}return e}function ha(e,{preferredFontFormat:t}){return t?e.replace(ma,n=>{for(;;){let[r,,o]=pa.exec(n)||[];if(!o)return"";if(o===t)return`src: ${r};`}}):e}function Jt(e){return e.search(Xn)!==-1}async function ut(e,t,n){if(!Jt(e))return e;let r=ha(e,n);return fa(r).reduce((i,a)=>i.then(s=>ga(s,a,t,n)),Promise.resolve(r))}async function Fe(e,t,n){var r;let o=(r=t.style)===null||r===void 0?void 0:r.getPropertyValue(e);if(o){let i=await ut(o,null,n);return t.style.setProperty(e,i,t.style.getPropertyPriority(e)),!0}return!1}async function ya(e,t){await Fe("background",e,t)||await Fe("background-image",e,t),await Fe("mask",e,t)||await Fe("-webkit-mask",e,t)||await Fe("mask-image",e,t)||await Fe("-webkit-mask-image",e,t)}async function wa(e,t){let n=V(e,HTMLImageElement);if(!(n&&!qe(e.src))&&!(V(e,SVGImageElement)&&!qe(e.href.baseVal)))return;let r=n?e.src:e.href.baseVal,o=await Le(r,Ce(r),t);await new Promise((i,a)=>{e.onload=i,e.onerror=t.onImageErrorHandler?(...l)=>{try{i(t.onImageErrorHandler(...l))}catch(c){a(c)}}:a;let s=e;s.decode&&(s.decode=i),s.loading==="lazy"&&(s.loading="eager"),n?(e.srcset="",e.src=o):e.href.baseVal=o})}async function va(e,t){let r=J(e.childNodes).map(o=>Qt(o,t));await Promise.all(r).then(()=>e)}async function Qt(e,t){V(e,Element)&&(await ya(e,t),await wa(e,t),await va(e,t))}function Kn(e,t){let{style:n}=e;t.backgroundColor&&(n.backgroundColor=t.backgroundColor),t.width&&(n.width=`${t.width}px`),t.height&&(n.height=`${t.height}px`);let r=t.style;return r!=null&&Object.keys(r).forEach(o=>{n[o]=r[o]}),e}var Yn={};async function Zn(e){let t=Yn[e];if(t!=null)return t;let r=await(await fetch(e)).text();return t={url:e,cssText:r},Yn[e]=t,t}async function Jn(e,t){let n=e.cssText,r=/url\(["']?([^"')]+)["']?\)/g,i=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(r,"$1");return s.startsWith("https://")||(s=new URL(s,e.url).href),Zt(s,t.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(i).then(()=>n)}function Qn(e){if(e==null)return[];let t=[],n=/(\/\*[\s\S]*?\*\/)/gi,r=e.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(r);if(l===null)break;t.push(l[0])}r=r.replace(o,"");let i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=i.exec(r);if(l===null){if(l=s.exec(r),l===null)break;i.lastIndex=s.lastIndex}else s.lastIndex=i.lastIndex;t.push(l[0])}return t}async function xa(e,t){let n=[],r=[];return e.forEach(o=>{if("cssRules"in o)try{J(o.cssRules||[]).forEach((i,a)=>{if(i.type===CSSRule.IMPORT_RULE){let s=a+1,l=i.href,c=Zn(l).then(d=>Jn(d,t)).then(d=>Qn(d).forEach(u=>{try{o.insertRule(u,u.startsWith("@import")?s+=1:o.cssRules.length)}catch(b){console.error("Error inserting rule from remote css",{rule:u,error:b})}})).catch(d=>{console.error("Error loading remote css",d.toString())});r.push(c)}})}catch(i){let a=e.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&r.push(Zn(o.href).then(s=>Jn(s,t)).then(s=>Qn(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",i)}}),Promise.all(r).then(()=>(e.forEach(o=>{if("cssRules"in o)try{J(o.cssRules||[]).forEach(i=>{n.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${o.href}`,i)}}),n))}function Ea(e){return e.filter(t=>t.type===CSSRule.FONT_FACE_RULE).filter(t=>Jt(t.style.getPropertyValue("src")))}async function Sa(e,t){if(e.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=J(e.ownerDocument.styleSheets),r=await xa(n,t);return Ea(r)}function er(e){return e.trim().replace(/["']/g,"")}function ka(e){let t=new Set;function n(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(i=>{t.add(er(i))}),Array.from(r.children).forEach(i=>{i instanceof HTMLElement&&n(i)})}return n(e),t}async function tr(e,t){let n=await Sa(e,t),r=ka(e);return(await Promise.all(n.filter(i=>r.has(er(i.style.fontFamily))).map(i=>{let a=i.parentStyleSheet?i.parentStyleSheet.href:null;return ut(i.cssText,a,t)}))).join(`
`)}async function nr(e,t){let n=t.fontEmbedCSS!=null?t.fontEmbedCSS:t.skipFonts?null:await tr(e,t);if(n){let r=document.createElement("style"),o=document.createTextNode(n);r.appendChild(o),e.firstChild?e.insertBefore(r,e.firstChild):e.appendChild(r)}}async function Ta(e,t={}){let{width:n,height:r}=Xt(e,t),o=await We(e,t,!0);return await nr(o,t),await Qt(o,t),Kn(o,t),await Vn(o,n,r)}async function Ca(e,t={}){let{width:n,height:r}=Xt(e,t),o=await Ta(e,t),i=await Te(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=t.pixelRatio||_n(),c=t.canvasWidth||n,d=t.canvasHeight||r;return a.width=c*l,a.height=d*l,t.skipAutoScale||Hn(a),a.style.width=`${c}`,a.style.height=`${d}`,t.backgroundColor&&(s.fillStyle=t.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(i,0,0,a.width,a.height),a}async function rr(e,t={}){return(await Ca(e,t)).toDataURL()}var or={triggerLabel:"Feedback",triggerAriaLabel:"Fehler melden oder Feedback senden",dismissButtonAriaLabel:"Feedback-Button ausblenden",pullTabAriaLabel:"Feedback-Button anzeigen",dragHandleTitle:"Feedback-Button verschieben",installRequiredTitle:"Installation erforderlich",connectionErrorTitle:"Verbindungsfehler",installRequiredMessage:"BugDrop ben\xF6tigt die Installation der GitHub-App, um Issues zu erstellen.",apiUnreachableMessage:"Die BugDrop-API ist nicht erreichbar. \xDCberpr\xFCfen Sie Ihre Netzwerkverbindung oder die URL des Script-Tags.",installApp:"App installieren",welcomeTitle:"Teilen Sie Ihr Feedback",welcomeHeadline:"Helfen Sie uns, besser zu werden, indem Sie Ihre Meinung teilen",welcomeBodyLine1:"Melden Sie Fehler, schlagen Sie Funktionen vor oder hinterlassen Sie Feedback.",welcomeBodyLine2:"Sie k\xF6nnen optional kommentierte Screenshots hinzuf\xFCgen.",getStarted:"Los geht\u2019s",feedbackFormTitle:"Feedback senden",categoryLabel:"Kategorie",categoryBug:"Fehler",categoryFeature:"Funktion",categoryQuestion:"Frage",nameLabel:"Name",namePlaceholder:"Ihr Name",emailLabel:"E-Mail",emailPlaceholder:"ihre@email.de",titleLabel:"Titel",titlePlaceholder:"Kurze Beschreibung des Problems oder Vorschlags",descriptionLabel:"Beschreibung",descriptionPlaceholder:"Geben Sie weitere Details, Schritte zur Reproduktion oder Kontext an...",screenshotAutoNote:"Diese Website h\xE4ngt beim Absenden automatisch einen Screenshot der gesamten Seite an, ohne eine Vorschau anzuzeigen. \xDCberpr\xFCfen Sie Ihre Seite vor dem Senden auf sensible Informationen.",screenshotAutoRedactionNote:"Einige von dieser Website als privat markierte Felder k\xF6nnen auf unterst\xFCtzten Seiten optisch maskiert werden, nicht markierte sensible Informationen k\xF6nnen jedoch weiterhin enthalten sein.",screenshotRequiredNote:"\u{1F4F8} Vor dem Absenden ist ein Screenshot erforderlich.",includeScreenshotLabel:"\u{1F4F8} Screenshot hinzuf\xFCgen",sendConsoleLogsLabel:"Konsolenprotokolle mitsenden",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Dateien hochladen",uploadButton:"Hochladen",uploadTooMany:e=>`Laden Sie bis zu ${e} Dateien hoch. Entfernen Sie eine Datei, bevor Sie eine weitere hinzuf\xFCgen.`,uploadUnsupportedType:"Dieser Dateityp wird nicht unterst\xFCtzt. Laden Sie ein Bild, ein PDF oder ein kurzes Video hoch.",uploadTooLarge:e=>`Die Datei ist zu gro\xDF. Laden Sie Dateien bis zu ${e} hoch.`,uploadReadError:"Diese Datei konnte nicht gelesen werden. Versuchen Sie es mit einer anderen.",removeAttachmentAriaLabel:e=>`${e} entfernen`,cancel:"Abbrechen",continueButton:"Weiter",submit:"Absenden",submittingTitle:"Wird gesendet...",creatingIssue:"Issue wird erstellt...",rateLimited:e=>`Zu viele \xDCbermittlungen. Bitte versuchen Sie es in ${e} Minute${e===1?"":"n"} erneut.`,submitFailedFallback:"Senden fehlgeschlagen",networkError:"Netzwerkfehler. Bitte \xFCberpr\xFCfen Sie Ihre Verbindung.",submissionFailedTitle:"Senden fehlgeschlagen",tryAgain:"Erneut versuchen",successTitle:"Feedback gesendet!",issueCreated:e=>`Issue ${e} wurde erstellt.`,feedbackSubmittedMessage:"Ihr Feedback wurde erfolgreich gesendet.",viewOnGitHub:"Auf GitHub ansehen",done:"Fertig",captureScreenshotTitle:"Screenshot erstellen",chooseWhatToCapture:"W\xE4hlen Sie aus, was erfasst werden soll:",viewportRedactionWarning:"Bei der Erfassung des sichtbaren Bereichs \xFCber den Browser k\xF6nnen private Felder nicht automatisch maskiert werden. W\xE4hlen Sie \u201EElement ausw\xE4hlen\u201C, um die automatische Maskierung beizubehalten, oder \xFCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionReviewNote:"Diese Website hat einige Felder zur Schw\xE4rzung markiert. \xDCberpr\xFCfen Sie den Screenshot vor dem Senden.",pageTooComplexViewportNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. Erfassen Sie stattdessen den sichtbaren Bereich oder w\xE4hlen Sie ein bestimmtes Element aus.",pageTooComplexElementNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. W\xE4hlen Sie stattdessen ein bestimmtes Element aus.",fullPage:"Ganze Seite",captureViewport:"Sichtbaren Bereich erfassen",selectArea:"Bereich ausw\xE4hlen",selectElement:"Element ausw\xE4hlen",skipScreenshot:"Screenshot \xFCberspringen",areaPickerInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich",areaPickerRedactionInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich. Markierte private Felder k\xF6nnen maskiert werden, wenn sie darin enthalten sind.",elementPickerInstruction:"Klicken Sie auf ein beliebiges Element, um es zu erfassen",elementPickerTouchInstruction:"Tippen Sie auf ein beliebiges Element, um es zu erfassen",escToCancel:"ESC zum Abbrechen",capturingTitle:"Wird erfasst...",capturingScreenshot:"Screenshot wird erfasst...",captureFailedTitle:"Erfassung fehlgeschlagen",captureFailedMessage:"Der Screenshot konnte nicht erfasst werden. Die Seite ist m\xF6glicherweise zu komplex, oder Browsereinschr\xE4nkungen greifen.",chooseAnotherMethod:"Andere Methode w\xE4hlen",maskFailureTitle:"Datenschutz-Maskierung fehlgeschlagen",maskFailureMessage:"Die automatische Schw\xE4rzung privater Felder konnte nicht angewendet werden. Zum Schutz Ihrer Daten wurde dieser Screenshot verworfen. Sie k\xF6nnen Ihr Feedback weiterhin ohne Screenshot senden.",continueWithoutScreenshot:"Ohne Screenshot fortfahren",reviewScreenshotTitle:"Screenshot \xFCberpr\xFCfen",viewportRedactionUnavailableNote:"Bei diesem \xFCber den Browser erfassten sichtbaren Bereich konnten private Felder nicht automatisch maskiert werden. \xDCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionCountNote:e=>e===1?`${e} privates Element wurde zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`:`${e} private Elemente wurden zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`,redactionLimitationsNote:"BugDrop hat nur die gemessenen markierten Bereiche abgedeckt. Es untersucht keine Pixel innerhalb eingebetteter oder gerenderter Inhalte wie iFrames, Canvas, Bildern, SVGs, Videos, CSS-Hintergr\xFCnden oder benutzerdefinierten Steuerelementen. Stellen Sie vor dem Senden sicher, dass das schwarze Feld den sensiblen Bereich vollst\xE4ndig abdeckt, oder nehmen Sie den Screenshot nach Markierung eines gr\xF6\xDFeren Bereichs erneut auf.",annotationInstruction:"Stellen Sie vor dem Senden sicher, dass keine sensiblen Informationen sichtbar sind. Verdecken Sie sensible Bereiche vor dem Absenden. Schw\xE4rzungen werden dauerhaft in das hochgeladene Bild eingebettet.",selectedElementNote:e=>`Ben\xF6tigen Sie mehr umgebenden Kontext? Passen Sie ${e} im BugDrop-Script-Tag an.`,toolDraw:"Zeichnen",toolArrow:"Pfeil",toolRectangle:"Rechteck",toolRedact:"Schw\xE4rzen",undo:"R\xFCckg\xE4ngig",retake:"Erneut aufnehmen",submitFeedback:"Feedback senden",captureTimeout:"Zeit\xFCberschreitung bei der Screenshot-Erfassung \u2014 die Seite ist m\xF6glicherweise zu komplex"};var en={triggerLabel:"Feedback",triggerAriaLabel:"Report a bug or send feedback",dismissButtonAriaLabel:"Dismiss feedback button",pullTabAriaLabel:"Show feedback button",dragHandleTitle:"Drag feedback button",installRequiredTitle:"Install Required",connectionErrorTitle:"Connection Error",installRequiredMessage:"BugDrop requires GitHub App installation to create issues.",apiUnreachableMessage:"Unable to reach BugDrop API. Check your network connection or script tag URL.",installApp:"Install App",welcomeTitle:"Share Your Feedback",welcomeHeadline:"Help us improve by sharing your thoughts",welcomeBodyLine1:"Report bugs, suggest features, or leave feedback.",welcomeBodyLine2:"You can optionally include annotated screenshots.",getStarted:"Get Started",feedbackFormTitle:"Send Feedback",categoryLabel:"Category",categoryBug:"Bug",categoryFeature:"Feature",categoryQuestion:"Question",nameLabel:"Name",namePlaceholder:"Your name",emailLabel:"Email",emailPlaceholder:"your@email.com",titleLabel:"Title",titlePlaceholder:"Brief description of the issue or suggestion",descriptionLabel:"Description",descriptionPlaceholder:"Provide additional details, steps to reproduce, or context...",screenshotAutoNote:"This site will attach a full-page screenshot when you submit without showing a preview. Review your page for sensitive information before sending.",screenshotAutoRedactionNote:"Some fields this site marked private may be visually masked on supported pages, but unmarked sensitive information can still be included.",screenshotRequiredNote:"\u{1F4F8} A screenshot is required before submitting.",includeScreenshotLabel:"\u{1F4F8} Include a screenshot",sendConsoleLogsLabel:"Send Console Logs",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Upload files",uploadButton:"Upload",uploadTooMany:e=>`Upload up to ${e} files. Remove a file before adding another.`,uploadUnsupportedType:"That file type is not supported. Upload an image, PDF, or short video.",uploadTooLarge:e=>`File is too large. Upload files up to ${e}.`,uploadReadError:"Could not read that file. Try another one.",removeAttachmentAriaLabel:e=>`Remove ${e}`,cancel:"Cancel",continueButton:"Continue",submit:"Submit",submittingTitle:"Submitting...",creatingIssue:"Creating issue...",rateLimited:e=>`Too many submissions. Please try again in ${e} minute${e===1?"":"s"}.`,submitFailedFallback:"Failed to submit",networkError:"Network error. Please check your connection.",submissionFailedTitle:"Submission Failed",tryAgain:"Try Again",successTitle:"Feedback Submitted!",issueCreated:e=>`Issue ${e} has been created.`,feedbackSubmittedMessage:"Your feedback has been submitted successfully.",viewOnGitHub:"View on GitHub",done:"Done",captureScreenshotTitle:"Capture Screenshot",chooseWhatToCapture:"Choose what to capture:",viewportRedactionWarning:"Browser viewport capture cannot apply automatic private-field masks. Select Element to preserve automatic masking, or review and cover sensitive areas before sending.",redactionReviewNote:"This site marked some fields for redaction. Review the screenshot before sending.",pageTooComplexViewportNote:"This page is too complex for full-page or area capture. Capture the visible viewport or select a specific element instead.",pageTooComplexElementNote:"This page is too complex for full-page or area capture. Select a specific element instead.",fullPage:"Full Page",captureViewport:"Capture Viewport",selectArea:"Select Area",selectElement:"Select Element",skipScreenshot:"Skip Screenshot",areaPickerInstruction:"Draw a selection around the area to capture",areaPickerRedactionInstruction:"Draw a selection around the area to capture. Marked private fields may be masked if included.",elementPickerInstruction:"Click any element to capture it",elementPickerTouchInstruction:"Tap any element to capture it",escToCancel:"ESC to cancel",capturingTitle:"Capturing...",capturingScreenshot:"Capturing screenshot...",captureFailedTitle:"Capture Failed",captureFailedMessage:"Failed to capture screenshot. The page may be too complex or browser restrictions may apply.",chooseAnotherMethod:"Choose Another Method",maskFailureTitle:"Privacy masking failed",maskFailureMessage:"Automatic redaction of private fields could not be applied. To protect your data, this screenshot was discarded. You can still submit feedback without one.",continueWithoutScreenshot:"Continue without screenshot",reviewScreenshotTitle:"Review Screenshot",viewportRedactionUnavailableNote:"This browser viewport capture could not apply automatic private-field masks. Review and cover any sensitive areas before sending.",redactionCountNote:e=>`${e} private ${e===1?"item was":"items were"} marked for redaction in this screenshot. Review before sending.`,redactionLimitationsNote:"BugDrop only covered the measured marked boxes. It does not inspect pixels inside embedded or rendered content such as iframes, canvas, images, SVGs, videos, CSS backgrounds, or custom controls. Confirm the black box fully covers the sensitive region before sending, or retake after marking a larger wrapper.",annotationInstruction:"Check that no sensitive information is visible before sending. Cover sensitive areas before submitting. Redactions are baked into the uploaded image.",selectedElementNote:e=>`Need more surrounding context? Adjust ${e} on the BugDrop script tag.`,toolDraw:"Draw",toolArrow:"Arrow",toolRectangle:"Rectangle",toolRedact:"Redact",undo:"Undo",retake:"Retake",submitFeedback:"Submit Feedback",captureTimeout:"Screenshot capture timed out \u2014 the page may be too complex"};var ir={triggerLabel:"Feedback",triggerAriaLabel:"Een fout melden of feedback versturen",dismissButtonAriaLabel:"Feedbackknop verbergen",pullTabAriaLabel:"Feedbackknop tonen",dragHandleTitle:"Feedbackknop verslepen",installRequiredTitle:"Installatie vereist",connectionErrorTitle:"Verbindingsfout",installRequiredMessage:"BugDrop vereist installatie van de GitHub-app om issues te kunnen aanmaken.",apiUnreachableMessage:"Kan de BugDrop-API niet bereiken. Controleer uw netwerkverbinding of de URL van de scripttag.",installApp:"App installeren",welcomeTitle:"Deel uw feedback",welcomeHeadline:"Help ons verbeteren door uw mening te delen",welcomeBodyLine1:"Meld fouten, stel functies voor of laat feedback achter.",welcomeBodyLine2:"U kunt optioneel schermafbeeldingen met aantekeningen toevoegen.",getStarted:"Aan de slag",feedbackFormTitle:"Feedback versturen",categoryLabel:"Categorie",categoryBug:"Fout",categoryFeature:"Suggestie",categoryQuestion:"Vraag",nameLabel:"Naam",namePlaceholder:"Uw naam",emailLabel:"E-mail",emailPlaceholder:"uw@email.nl",titleLabel:"Titel",titlePlaceholder:"Korte omschrijving van het probleem of de suggestie",descriptionLabel:"Omschrijving",descriptionPlaceholder:"Geef extra details, stappen om het te reproduceren of context...",screenshotAutoNote:"Deze site voegt bij het versturen automatisch een schermafbeelding van de volledige pagina toe, zonder voorbeeld. Controleer uw pagina op gevoelige informatie voordat u verstuurt.",screenshotAutoRedactionNote:"Sommige velden die deze site als priv\xE9 heeft gemarkeerd, kunnen op ondersteunde pagina\u2019s visueel worden gemaskeerd, maar niet-gemarkeerde gevoelige informatie kan nog steeds worden meegestuurd.",screenshotRequiredNote:"\u{1F4F8} Een schermafbeelding is vereist voordat u kunt versturen.",includeScreenshotLabel:"\u{1F4F8} Schermafbeelding toevoegen",sendConsoleLogsLabel:"Consolelogboeken meesturen",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Bestanden uploaden",uploadButton:"Uploaden",uploadTooMany:e=>`Upload maximaal ${e} bestanden. Verwijder een bestand voordat u er een toevoegt.`,uploadUnsupportedType:"Dat bestandstype wordt niet ondersteund. Upload een afbeelding, pdf of korte video.",uploadTooLarge:e=>`Het bestand is te groot. Upload bestanden tot ${e}.`,uploadReadError:"Kan dat bestand niet lezen. Probeer een ander bestand.",removeAttachmentAriaLabel:e=>`${e} verwijderen`,cancel:"Annuleren",continueButton:"Doorgaan",submit:"Versturen",submittingTitle:"Versturen...",creatingIssue:"Issue aanmaken...",rateLimited:e=>`Te veel inzendingen. Probeer het over ${e} ${e===1?"minuut":"minuten"} opnieuw.`,submitFailedFallback:"Versturen mislukt",networkError:"Netwerkfout. Controleer uw verbinding.",submissionFailedTitle:"Versturen mislukt",tryAgain:"Opnieuw proberen",successTitle:"Feedback verstuurd!",issueCreated:e=>`Issue ${e} is aangemaakt.`,feedbackSubmittedMessage:"Uw feedback is succesvol verstuurd.",viewOnGitHub:"Bekijken op GitHub",done:"Klaar",captureScreenshotTitle:"Schermafbeelding maken",chooseWhatToCapture:"Kies wat u wilt vastleggen:",viewportRedactionWarning:"Bij het vastleggen van het zichtbare deel via de browser kunnen priv\xE9velden niet automatisch worden gemaskeerd. Kies \u201CElement selecteren\u201D om automatische maskering te behouden, of controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionReviewNote:"Deze site heeft enkele velden gemarkeerd voor redactie. Controleer de schermafbeelding voordat u verstuurt.",pageTooComplexViewportNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Leg het zichtbare deel vast of selecteer een specifiek element.",pageTooComplexElementNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Selecteer in plaats daarvan een specifiek element.",fullPage:"Volledige pagina",captureViewport:"Zichtbaar deel vastleggen",selectArea:"Gebied selecteren",selectElement:"Element selecteren",skipScreenshot:"Schermafbeelding overslaan",areaPickerInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen",areaPickerRedactionInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen. Gemarkeerde priv\xE9velden kunnen worden gemaskeerd als ze binnen de selectie vallen.",elementPickerInstruction:"Klik op een element om het vast te leggen",elementPickerTouchInstruction:"Tik op een element om het vast te leggen",escToCancel:"ESC om te annuleren",capturingTitle:"Vastleggen...",capturingScreenshot:"Schermafbeelding wordt gemaakt...",captureFailedTitle:"Opname mislukt",captureFailedMessage:"Kan geen schermafbeelding maken. De pagina is mogelijk te complex of de browser staat dit niet toe.",chooseAnotherMethod:"Kies een andere methode",maskFailureTitle:"Privacymaskering mislukt",maskFailureMessage:"Automatische redactie van priv\xE9velden kon niet worden toegepast. Om uw gegevens te beschermen is deze schermafbeelding verwijderd. U kunt uw feedback nog steeds zonder schermafbeelding versturen.",continueWithoutScreenshot:"Doorgaan zonder schermafbeelding",reviewScreenshotTitle:"Schermafbeelding controleren",viewportRedactionUnavailableNote:"Bij deze via de browser vastgelegde schermafbeelding konden priv\xE9velden niet automatisch worden gemaskeerd. Controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionCountNote:e=>e===1?"1 priv\xE9-item is gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.":`${e} priv\xE9-items zijn gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.`,redactionLimitationsNote:"BugDrop heeft alleen de gemeten gemarkeerde vakken afgedekt. Het inspecteert geen pixels binnen ingesloten of gerenderde inhoud zoals iframes, canvas, afbeeldingen, SVG\u2019s, video\u2019s, CSS-achtergronden of aangepaste elementen. Controleer of het zwarte vak het gevoelige gebied volledig bedekt voordat u verstuurt, of maak de afbeelding opnieuw nadat u een groter element hebt gemarkeerd.",annotationInstruction:"Controleer of er geen gevoelige informatie zichtbaar is voordat u verstuurt. Dek gevoelige gebieden af voordat u indient. Redacties worden permanent in de ge\xFCploade afbeelding verwerkt.",selectedElementNote:e=>`Meer omringende context nodig? Pas ${e} aan op de BugDrop-scripttag.`,toolDraw:"Tekenen",toolArrow:"Pijl",toolRectangle:"Rechthoek",toolRedact:"Redigeren",undo:"Ongedaan maken",retake:"Opnieuw maken",submitFeedback:"Feedback versturen",captureTimeout:"Het maken van de schermafbeelding duurde te lang \u2014 de pagina is mogelijk te complex"};function tn(e){let t=e%10,n=e%100;return t>=2&&t<=4&&(n<12||n>14)}var ar={triggerLabel:"Opinia",triggerAriaLabel:"Zg\u0142o\u015B b\u0142\u0105d lub wy\u015Blij opini\u0119",dismissButtonAriaLabel:"Ukryj przycisk opinii",pullTabAriaLabel:"Poka\u017C przycisk opinii",dragHandleTitle:"Przeci\u0105gnij przycisk opinii",installRequiredTitle:"Wymagana instalacja",connectionErrorTitle:"B\u0142\u0105d po\u0142\u0105czenia",installRequiredMessage:"BugDrop wymaga instalacji aplikacji GitHub, aby tworzy\u0107 zg\u0142oszenia.",apiUnreachableMessage:"Nie mo\u017Cna po\u0142\u0105czy\u0107 si\u0119 z API BugDrop. Sprawd\u017A po\u0142\u0105czenie sieciowe lub adres URL w tagu skryptu.",installApp:"Zainstaluj aplikacj\u0119",welcomeTitle:"Podziel si\u0119 opini\u0105",welcomeHeadline:"Pom\xF3\u017C nam si\u0119 rozwija\u0107, dziel\u0105c si\u0119 swoimi uwagami",welcomeBodyLine1:"Zg\u0142aszaj b\u0142\u0119dy, proponuj funkcje lub zostaw opini\u0119.",welcomeBodyLine2:"Opcjonalnie mo\u017Cesz do\u0142\u0105czy\u0107 zrzuty ekranu z adnotacjami.",getStarted:"Rozpocznij",feedbackFormTitle:"Wy\u015Blij opini\u0119",categoryLabel:"Kategoria",categoryBug:"B\u0142\u0105d",categoryFeature:"Propozycja",categoryQuestion:"Pytanie",nameLabel:"Imi\u0119 i nazwisko",namePlaceholder:"Twoje imi\u0119 i nazwisko",emailLabel:"E-mail",emailPlaceholder:"twoj@email.com",titleLabel:"Tytu\u0142",titlePlaceholder:"Kr\xF3tki opis problemu lub sugestii",descriptionLabel:"Opis",descriptionPlaceholder:"Podaj dodatkowe szczeg\xF3\u0142y, kroki do odtworzenia lub kontekst...",screenshotAutoNote:"Ta strona automatycznie do\u0142\u0105czy zrzut ca\u0142ej strony podczas wysy\u0142ania, bez pokazywania podgl\u0105du. Przed wys\u0142aniem sprawd\u017A, czy strona nie zawiera poufnych informacji.",screenshotAutoRedactionNote:"Niekt\xF3re pola oznaczone przez t\u0119 stron\u0119 jako prywatne mog\u0105 zosta\u0107 zamaskowane na obs\u0142ugiwanych stronach, ale nieoznaczone poufne informacje nadal mog\u0105 zosta\u0107 do\u0142\u0105czone.",screenshotRequiredNote:"\u{1F4F8} Zrzut ekranu jest wymagany przed wys\u0142aniem.",includeScreenshotLabel:"\u{1F4F8} Do\u0142\u0105cz zrzut ekranu",sendConsoleLogsLabel:"Wy\u015Blij logi konsoli",uploadsAriaLabel:"Za\u0142\u0105czniki",uploadFilesAriaLabel:"Prze\u015Blij pliki",uploadButton:"Prze\u015Blij",uploadTooMany:e=>`Mo\u017Cna przes\u0142a\u0107 maksymalnie ${e} ${tn(e)?"pliki":"plik\xF3w"}. Usu\u0144 plik, aby doda\u0107 kolejny.`,uploadUnsupportedType:"Ten typ pliku nie jest obs\u0142ugiwany. Prze\u015Blij obraz, plik PDF lub kr\xF3tki film.",uploadTooLarge:e=>`Plik jest za du\u017Cy. Prze\u015Blij pliki o rozmiarze do ${e}.`,uploadReadError:"Nie uda\u0142o si\u0119 odczyta\u0107 pliku. Spr\xF3buj z innym.",removeAttachmentAriaLabel:e=>`Usu\u0144 ${e}`,cancel:"Anuluj",continueButton:"Dalej",submit:"Wy\u015Blij",submittingTitle:"Wysy\u0142anie...",creatingIssue:"Tworzenie zg\u0142oszenia...",rateLimited:e=>`Zbyt wiele zg\u0142osze\u0144. Spr\xF3buj ponownie za ${e} ${e===1?"minut\u0119":tn(e)?"minuty":"minut"}.`,submitFailedFallback:"Nie uda\u0142o si\u0119 wys\u0142a\u0107",networkError:"B\u0142\u0105d sieci. Sprawd\u017A po\u0142\u0105czenie z internetem.",submissionFailedTitle:"Wysy\u0142anie nie powiod\u0142o si\u0119",tryAgain:"Spr\xF3buj ponownie",successTitle:"Opinia wys\u0142ana!",issueCreated:e=>`Utworzono zg\u0142oszenie ${e}.`,feedbackSubmittedMessage:"Twoja opinia zosta\u0142a pomy\u015Blnie wys\u0142ana.",viewOnGitHub:"Zobacz na GitHubie",done:"Gotowe",captureScreenshotTitle:"Zr\xF3b zrzut ekranu",chooseWhatToCapture:"Wybierz, co przechwyci\u0107:",viewportRedactionWarning:"Przechwytywanie widocznego obszaru przez przegl\u0105dark\u0119 nie pozwala automatycznie zamaskowa\u0107 p\xF3l prywatnych. Wybierz \u201EZaznacz element\u201D, aby zachowa\u0107 automatyczne maskowanie, albo sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionReviewNote:"Ta strona oznaczy\u0142a niekt\xF3re pola do zamazania. Sprawd\u017A zrzut ekranu przed wys\u0142aniem.",pageTooComplexViewportNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Przechwy\u0107 widoczny obszar albo zaznacz konkretny element.",pageTooComplexElementNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Zamiast tego zaznacz konkretny element.",fullPage:"Ca\u0142a strona",captureViewport:"Przechwy\u0107 widoczny obszar",selectArea:"Zaznacz obszar",selectElement:"Zaznacz element",skipScreenshot:"Pomi\u0144 zrzut ekranu",areaPickerInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia",areaPickerRedactionInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia. Pola oznaczone jako prywatne mog\u0105 zosta\u0107 zamaskowane, je\u015Bli znajd\u0105 si\u0119 w zaznaczeniu.",elementPickerInstruction:"Kliknij dowolny element, aby go przechwyci\u0107",elementPickerTouchInstruction:"Dotknij dowolny element, aby go przechwyci\u0107",escToCancel:"ESC, aby anulowa\u0107",capturingTitle:"Przechwytywanie...",capturingScreenshot:"Trwa przechwytywanie zrzutu ekranu...",captureFailedTitle:"Przechwytywanie nie powiod\u0142o si\u0119",captureFailedMessage:"Nie uda\u0142o si\u0119 przechwyci\u0107 zrzutu ekranu. Strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona lub przegl\u0105darka na to nie pozwala.",chooseAnotherMethod:"Wybierz inn\u0105 metod\u0119",maskFailureTitle:"Maskowanie prywatno\u015Bci nie powiod\u0142o si\u0119",maskFailureMessage:"Nie uda\u0142o si\u0119 automatycznie zamaza\u0107 p\xF3l prywatnych. Aby chroni\u0107 Twoje dane, ten zrzut ekranu zosta\u0142 odrzucony. Nadal mo\u017Cesz wys\u0142a\u0107 opini\u0119 bez zrzutu ekranu.",continueWithoutScreenshot:"Kontynuuj bez zrzutu ekranu",reviewScreenshotTitle:"Sprawd\u017A zrzut ekranu",viewportRedactionUnavailableNote:"Na tym zrzucie przechwyconym przez przegl\u0105dark\u0119 nie uda\u0142o si\u0119 automatycznie zamaskowa\u0107 p\xF3l prywatnych. Sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionCountNote:e=>`${e} ${e===1?"prywatny element oznaczono":tn(e)?"prywatne elementy oznaczono":"prywatnych element\xF3w oznaczono"} do zamazania na tym zrzucie ekranu. Sprawd\u017A przed wys\u0142aniem.`,redactionLimitationsNote:"BugDrop zakrywa tylko zmierzone, oznaczone obszary. Nie analizuje pikseli wewn\u0105trz osadzonej lub renderowanej zawarto\u015Bci, takiej jak elementy iframe, canvas, obrazy, pliki SVG, filmy, t\u0142a CSS czy niestandardowe kontrolki. Przed wys\u0142aniem upewnij si\u0119, \u017Ce czarny prostok\u0105t w pe\u0142ni zakrywa poufny obszar, albo pon\xF3w zrzut po oznaczeniu wi\u0119kszego elementu.",annotationInstruction:"Przed wys\u0142aniem sprawd\u017A, czy nie wida\u0107 poufnych informacji. Zakryj poufne obszary przed przes\u0142aniem. Zamazania s\u0105 trwale zapisywane w przesy\u0142anym obrazie.",selectedElementNote:e=>`Potrzebujesz wi\u0119cej otaczaj\u0105cego kontekstu? Dostosuj ${e} w tagu skryptu BugDrop.`,toolDraw:"Rysuj",toolArrow:"Strza\u0142ka",toolRectangle:"Prostok\u0105t",toolRedact:"Zama\u017C",undo:"Cofnij",retake:"Pon\xF3w zrzut",submitFeedback:"Wy\u015Blij opini\u0119",captureTimeout:"Up\u0142yn\u0105\u0142 limit czasu przechwytywania zrzutu ekranu \u2014 strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona"};var sr=/[;{}<>]|\/\*|\*\/|@import|url\s*\(|<\/style/i,Fa=/^-?[_a-zA-Z][_a-zA-Z0-9-]*$/,Aa=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,Pa=/^(?:rgb|rgba|hsl|hsla)\(\s*[-+.\d%]+\s*(?:,\s*[-+.\d%]+\s*){2,3}\)$/i;function W(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function je(e){let t=e?.trim();if(!t||t==="none")return t;try{let n=new URL(t,window.location.href);if(n.protocol==="https:"||n.protocol==="http:")return t}catch{return}}function H(e){let t=e?.trim();if(!(!t||sr.test(t))&&(Aa.test(t)||Pa.test(t)||Fa.test(t)||typeof CSS<"u"&&CSS.supports?.("color",t)))return t}function Ae(e){let t=e?.trim();if(t){if(t==="inherit")return t;if(!sr.test(t)&&/^[\w\s"',.-]+$/.test(t))return t}}function nn(e){let t=e?.trim();if(!t||!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(t))return;let n=Number(t);return Number.isFinite(n)?n:void 0}function Q(e){let n=e?.trim()?.match(/^((?:0|[1-9]\d*)(?:\.\d+)?)(?:px)?$/);if(!n)return;let r=Number(n[1]);return Number.isFinite(r)?r:void 0}function lr(e){let t=e?.trim();if(!t||!/^[1-9]\d*$/.test(t))return;let n=Number(t);return Number.isSafeInteger(n)?n:void 0}function pt(e){if(e==="none"||e==="soft"||e==="hard")return e}var cr={en,de:or,nl:ir,pl:ar};function x(e){return W(e)}function dr(e){if(!e)return"en";let t=e.toLowerCase().split(/[-_]/)[0];return Object.prototype.hasOwnProperty.call(cr,t)?t:(console.warn(`[BugDrop] Unsupported data-locale "${e}"; falling back to English.`),"en")}var ur=en;function pr(e){ur=cr[e]}function p(){return ur}var Ma=15e3;function Ge(e,t){let n,r=new Promise((o,i)=>{n=setTimeout(()=>{try{t?.()}catch{}i(new Error(p().captureTimeout))},Ma)});return Promise.race([e,r]).finally(()=>clearTimeout(n))}var rn="#bugdrop-host, [data-bugdrop-owned]";function ne(e){if(e instanceof ShadowRoot)return ne(e.host);if(!(e instanceof Element))return!1;if(e.matches(rn)||e.closest(rn))return!0;let t=e.getRootNode();return t instanceof ShadowRoot&&ne(t.host)}async function mr(e){let n=Array.from(document.querySelectorAll(rn)).map(r=>({root:r,value:r.style.getPropertyValue("visibility"),priority:r.style.getPropertyPriority("visibility")}));for(let{root:r}of n)r.style.setProperty("visibility","hidden","important");try{return await e()}finally{for(let{root:r,value:o,priority:i}of n)o?r.style.setProperty("visibility",o,i):r.style.removeProperty("visibility")}}var Pe=class extends Error{constructor(t,n){super(t,n),this.name="MaskApplicationError"}},Ra="[data-bugdrop-mask], [data-bugdrop-redact], [data-bd-redact], [data-bugdrop-redacted]",Da='input[type="password"], input[autocomplete*="cc-number"], input[autocomplete*="cc-csc"], input[autocomplete*="cc-exp"]',br="iframe, canvas, img, svg, video",za=new Set(["CANVAS","IMG","SVG"]),Ia=new Set(["VIDEO"]);function mt(e){return e.matches(Ra)?"developer-marked":e.matches(Da)?"sensitive-input":null}function bt(e,t){let n=e.getBoundingClientRect();return n.width===0||n.height===0?null:{element:e,rect:{x:n.left+window.scrollX,y:n.top+window.scrollY,w:n.width,h:n.height},reason:t,strategy:"canvas-mask"}}function ft(e){let t=[],n=[];if(ne(e))return{targets:t,unsupportedSurfaces:n,redactionCount:0};let r=mt(e);if(r){let o=bt(e,r);return o&&(t.push(o),cn(e,n)),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}return sn(e,t,n),ln(e,t,n),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}function fr(e=document.body,t){let n=ft(e).targets.map(r=>r.rect);return t?n.filter(r=>on(r,t)).length:n.length}function gr(e,t){let n=t?e.targets.filter(o=>on(o.rect,t)):e.targets,r=t?e.unsupportedSurfaces.filter(o=>on(o.rect,t)):e.unsupportedSurfaces;return{count:n.length,hasLimitations:r.length>0}}function on(e,t){return e.x<t.x+t.width&&e.x+e.w>t.x&&e.y<t.y+t.height&&e.y+e.h>t.y}function sn(e,t,n){for(let r of Array.from(e.children)){if(ne(r))continue;let o=mt(r);if(o){let i=bt(r,o);i&&(t.push(i),cn(r,n));continue}sn(r,t,n),ln(r,t,n)}}function ln(e,t,n){let r=e.shadowRoot;if(r)for(let o of Array.from(r.children)){let i=mt(o);if(i){let a=bt(o,i);a&&(t.push(a),cn(o,n));continue}sn(o,t,n),ln(o,t,n)}}function cn(e,t){an(e,t);for(let n of Array.from(e.querySelectorAll(br)))an(n,t);hr(e,t)}function an(e,t){let n=$a(e);if(!n)return;let r=bt(e,mt(e)??"developer-marked");r&&t.push({tagName:e.tagName,reason:n,rect:r.rect})}function $a(e){let t=e.tagName.toUpperCase();return t==="IFRAME"?"embedded-document":za.has(t)?"pixel-content":Ia.has(t)?"media-content":null}function hr(e,t){let n=e.shadowRoot;if(n)for(let r of Array.from(n.querySelectorAll(br)))an(r,t);for(let r of Array.from(e.children))hr(r,t)}function Oa(e,t,n,r,o){let i=(e.x-n.x)*t,a=(e.y-n.y)*t,s=e.w*t,l=e.h*t,c=Math.max(0,Math.floor(i)-1),d=Math.max(0,Math.floor(a)-1),u=Math.min(r,Math.ceil(i+s)+1),b=Math.min(o,Math.ceil(a+l)+1);return{x:c,y:d,w:u-c,h:b-d}}async function dn(e,t,n,r={x:0,y:0}){if(t.length===0)return e;let o=await Ba(e),i=document.createElement("canvas");i.width=o.naturalWidth||o.width,i.height=o.naturalHeight||o.height;let a=i.getContext("2d");if(!a)throw new Pe("Failed to get canvas context for privacy masking");a.drawImage(o,0,0),a.fillStyle="#000";for(let s of t){let l=Oa(s,n,r,i.width,i.height);l.w>0&&l.h>0&&a.fillRect(l.x,l.y,l.w,l.h)}return i.toDataURL("image/png")}function Ba(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Pe("Failed to load image for privacy masking")),r.src=e})}var Xe="#14b8a6";function fe(e){return e||Xe}function gt(e){return`color-mix(in srgb, ${e} 85%, black)`}function yr(e){return e??0}function pn(){return mr(Na)}function Na(){if(window.__bugdropMockViewportCapture)return window.__bugdropMockViewportCapture();if(!navigator.mediaDevices?.getDisplayMedia)return Promise.reject(new Error("Screen Capture API is not available"));let e={video:{displaySurface:"browser"},audio:!1,preferCurrentTab:!0},t=new AbortController,n=navigator.mediaDevices.getDisplayMedia(e).then(r=>_a(r,t.signal));return Ge(n,()=>t.abort())}async function _a(e,t){let n=document.createElement("video");n.muted=!0,n.playsInline=!0;let r=Va(e,n,t);try{Ha(e),un(t),await Ua(n,e,t,r),un(t);let o=n.videoWidth||window.innerWidth,i=n.videoHeight||window.innerHeight;if(!o||!i)throw new Error("Screen capture stream did not provide a video frame");let a=document.createElement("canvas");a.width=o,a.height=i;let s=a.getContext("2d");if(!s)throw new Error("Failed to get canvas context");return s.drawImage(n,0,0,o,i),a.toDataURL("image/png")}finally{r.cleanup()}}function Ha(e){let[t]=e.getVideoTracks(),n=t?.getSettings().displaySurface;if(n&&n!=="browser")throw new Error("Please choose the current browser tab for viewport capture")}function Va(e,t,n){let r=!1,o=!1,i=[],a=()=>{if(!r){r=!0;for(let l of i.splice(0))l();for(let l of e.getTracks())l.stop();o&&(t.srcObject=null)}},s=()=>a();return n.addEventListener("abort",s,{once:!0}),i.push(()=>n.removeEventListener("abort",s)),n.aborted&&a(),{attachStream:()=>{r||(t.srcObject=e,o=!0)},cleanup:a}}async function Ua(e,t,n,r){r.attachStream(),un(n);let o;try{o=e.play()}catch{o=Promise.resolve()}await qa(o.then(()=>{},()=>{}),n),!(typeof e.requestVideoFrameCallback=="function"&&(await Wa(e,n),e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA))&&(e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA||await ja(e,n))}function qa(e,t){return t.aborted?Promise.reject(Ke()):new Promise((n,r)=>{let o=()=>{t.removeEventListener("abort",o),r(Ke())};t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})})}function Wa(e,t){return new Promise((n,r)=>{let o,i=setTimeout(()=>s(n),250),a=()=>s(()=>r(Ke())),s=l=>{clearTimeout(i),t.removeEventListener("abort",a),o!==void 0&&e.cancelVideoFrameCallback?.(o),o=void 0,l()};t.addEventListener("abort",a,{once:!0}),o=e.requestVideoFrameCallback?.(()=>s(n)),t.aborted&&a()})}function ja(e,t){return new Promise((n,r)=>{let o=setTimeout(()=>l(n),250),i=()=>l(n),a=()=>l(()=>r(new Error("Failed to load screen capture stream"))),s=()=>l(()=>r(Ke())),l=c=>{clearTimeout(o),e.removeEventListener("loadeddata",i),e.removeEventListener("canplay",i),e.removeEventListener("error",a),t.removeEventListener("abort",s),c()};e.addEventListener("loadeddata",i),e.addEventListener("canplay",i),e.addEventListener("error",a),t.addEventListener("abort",s,{once:!0}),t.aborted&&s()})}function un(e){if(e.aborted)throw Ke()}function Ke(){return new DOMException("Viewport capture aborted","AbortError")}var wr=3e3,vr="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",Ga=1e4,Xa=wr;function Me(){return document.body.querySelectorAll("*").length}function re(){return Me()>=Ka()}function Ka(e=navigator.userAgent){return Ya(e)?Xa:Ga}function Ya(e=navigator.userAgent){return/Safari\//.test(e)&&!/(Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|Opera)\//.test(e)}function xr(e,t){if(e&&Me()>wr)return 1;let n=t??2;return Math.max(window.devicePixelRatio||1,n)}function Er(){let e=window.isSecureContext||location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1",t=typeof window.__bugdropMockViewportCapture=="function"||typeof navigator.mediaDevices?.getDisplayMedia=="function";return e&&t}async function Sr(e,t,n={}){let r=e||document.body,o=!e,i=ht(e||document.body),a=n.highlightElement&&r.contains(n.highlightElement)?ht(n.highlightElement):null,s=n.pixelRatio??xr(o,t),l=e?window.getComputedStyle(e):null,c=Cr(),d={cacheBust:!1,imagePlaceholder:vr,pixelRatio:s,filter:Tr,...l&&(l.marginLeft!=="0px"||l.marginRight!=="0px")?{style:{margin:`${l.marginTop} 0px ${l.marginBottom} 0px`}}:{}},u=ft(r),b=e?{x:i.x,y:i.y}:{x:0,y:0},m=c(r,d),f=await Ge(m),h=await dn(f,u.targets.map(S=>S.rect),s,b);return yt(a?await Lr(h,a,i,n.highlightStyle):h,u)}async function kr(e,t,n={}){let r=n.pixelRatio??xr(!0,t),o={x:e.x,y:e.y,w:e.width,h:e.height},i=n.highlightElement&&document.body.contains(n.highlightElement)?ht(n.highlightElement):null,a=Cr(),s={cacheBust:!1,imagePlaceholder:vr,pixelRatio:r,width:e.width,height:e.height,style:{transform:`translate(${-e.x}px, ${-e.y}px)`,transformOrigin:"top left",width:`${document.documentElement.scrollWidth}px`,height:`${document.documentElement.scrollHeight}px`},filter:Tr},l=ft(document.body),c=await Ge(a(document.body,s)),d=await dn(c,l.targets.map(u=>u.rect),r,{x:e.x,y:e.y});return yt(i?await Lr(d,i,o,n.highlightStyle):d,l,e)}function Re(e,t){return fr(e??document.body,t)}function Tr(e){return!(ne(e)||Za(e)&&Ja(e))}function Za(e){return e.tagName?.toUpperCase()==="IMG"}function Ja(e){let t=(e.ownerDocument.defaultView??window).getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden")return!0;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0}function Cr(){return rr}function yt(e,t,n){return{dataUrl:e,redaction:gr(t,n)}}async function Lr(e,t,n,r={}){if(t.w<=0||t.h<=0)return e;let o=await ns(e),i=o.naturalWidth||o.width,a=o.naturalHeight||o.height,s=i/Math.max(1,n.w),l=a/Math.max(1,n.h),c=Math.max(1,(s+l)/2),d=es(r.borderWidth,c),b=2*c+d/2,m=(t.x-n.x)*s-b,f=(t.y-n.y)*l-b,h=t.w*s+b*2,S=t.h*l+b*2,T=Math.max(0,Math.ceil(-m)),F=Math.max(0,Math.ceil(-f)),P=Math.max(0,Math.ceil(m+h-i)),L=Math.max(0,Math.ceil(f+S-a)),D=document.createElement("canvas");D.width=i+T+P,D.height=a+F+L;let v=D.getContext("2d");if(!v)throw new Error("Failed to get canvas context for selected element highlight");v.drawImage(o,T,F);let A=Math.round(m+T),I=Math.round(f+F),z=Math.round(h),$=Math.round(S),C=ts(r.radius,c),N=fe(r.accentColor);return Qa(v,A,I,z,$,C),v.lineWidth=d,v.strokeStyle=N,v.stroke(),D.toDataURL("image/png")}function Qa(e,t,n,r,o,i){let a=Math.max(0,Math.min(i,r/2,o/2));e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+o-a),e.quadraticCurveTo(t+r,n+o,t+r-a,n+o),e.lineTo(t+a,n+o),e.quadraticCurveTo(t,n+o,t,n+o-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath()}function es(e,t){let n=Number.parseFloat(e||"3");return Math.max(1,Math.round((Number.isFinite(n)?n:3)*t))}function ts(e,t){let n=Number.parseFloat(e||"6");return Math.max(0,Math.round((Number.isFinite(n)?n:6)*t))}function ht(e){let t=e.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function ns(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Error("Failed to load image for selected element highlight")),r.src=e})}function wt(e){let t=e?.theme==="dark",n=Q(e?.radius),r=Q(e?.borderWidth),o=Ae(e?.font);return{accent:fe(H(e?.accentColor)),fontFamily:e?.font==="inherit"?"system-ui, sans-serif":o||"'Space Grotesk', system-ui, sans-serif",radius:n!==void 0?`${n}px`:"6px",bw:r!==void 0?String(r):"3",tooltipBg:H(e?.bgColor)||(t?"#0f172a":"#1a1a1a"),tooltipText:H(e?.textColor)||"#f1f5f9",tooltipBorder:H(e?.borderColor)||(t?"#334155":"#333")}}var rs=new Set(["alert","alertdialog","application","article","banner","button","cell","checkbox","columnheader","combobox","complementary","contentinfo","definition","dialog","directory","document","feed","figure","form","grid","gridcell","group","heading","img","link","list","listbox","listitem","log","main","marquee","math","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","meter","navigation","none","note","option","presentation","progressbar","radio","radiogroup","region","row","rowgroup","rowheader","scrollbar","search","searchbox","separator","slider","spinbutton","status","switch","tab","table","tablist","tabpanel","term","textbox","timer","toolbar","tooltip","tree","treegrid","treeitem"]),os=new Set(["button","checkbox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","searchbox","switch","tab","textbox"]),is=new Set(["button","input","select","textarea"]);function Fr(e){return as(e)??e}function as(e){let{body:t,documentElement:n}=e.ownerDocument,r=e;for(;r&&r!==t&&r!==n;){if(ss(r))return r;r=r.parentElement}return null}function ss(e){if(e.getAttribute("aria-disabled")==="true")return!1;let t=e.tagName.toLowerCase();if(t==="a")return e.hasAttribute("href");if(is.has(t))return!("disabled"in e&&e.disabled);if(t==="summary")return!0;let n=ls(e);if(n&&os.has(n))return!0;let r=e.getAttribute("tabindex");return r!==null&&Number.parseInt(r,10)>=0}function ls(e){let t=e.getAttribute("role");if(!t)return null;for(let n of t.split(/\s+/)){let r=n.toLowerCase();if(rs.has(r))return r}return null}var cs=new Set(["bugdrop-element-picker-overlay","bugdrop-element-picker-highlight","bugdrop-element-picker-tooltip","bugdrop-element-picker-cancel"]);function ds(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}function us(){let e=document.createElement("div");return e.id="bugdrop-element-picker-overlay",e.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    cursor: crosshair;
    touch-action: none;
    user-select: none;
    background: transparent;
  `,e}function ps(e){let t=document.createElement("div");return t.id="bugdrop-element-picker-highlight",t.style.cssText=`
    position: fixed;
    box-sizing: content-box;
    pointer-events: none;
    border: ${e.bw}px solid ${e.accent};
    background: transparent;
    z-index: 2147483645;
    transition: all 0.05s ease-out;
    box-shadow: none;
    border-radius: ${e.radius};
  `,t}function ms(e,t){let n=document.createElement("div");if(n.id="bugdrop-element-picker-tooltip",n.style.cssText=`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${e.tooltipBg};
    color: ${e.tooltipText};
    padding: 14px 28px;
    border-radius: ${e.radius};
    font-family: ${e.fontFamily};
    font-size: 14px;
    font-weight: 500;
    z-index: 2147483647;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: ${e.bw}px solid ${e.tooltipBorder};
  `,!t)return n.textContent=`${p().elementPickerInstruction} (${p().escToCancel})`,{tooltip:n,cancelButton:null};let r=ys(e.accent);return n.append(`${p().elementPickerTouchInstruction} (`,r,")"),{tooltip:n,cancelButton:r}}function bs(e,t){let n=t.getBoundingClientRect();e.style.top=`${n.top-2}px`,e.style.left=`${n.left-2}px`,e.style.width=`${n.width+4}px`,e.style.height=`${n.height+4}px`,e.style.display="block"}function fs(e){e.overlay.addEventListener("pointerdown",e.onPointerDown),e.overlay.addEventListener("pointermove",e.onPointerMove),e.overlay.addEventListener("pointerup",e.onPointerUp),e.overlay.addEventListener("pointercancel",e.onPointerCancel),document.addEventListener("mousemove",e.onMouseMove,!0)}function gs(e){e.overlay.removeEventListener("pointerdown",e.onPointerDown),e.overlay.removeEventListener("pointermove",e.onPointerMove),e.overlay.removeEventListener("pointerup",e.onPointerUp),e.overlay.removeEventListener("pointercancel",e.onPointerCancel),document.removeEventListener("mousemove",e.onMouseMove,!0)}function Ar(e,t){return new Promise(n=>{setTimeout(()=>{t?.aborted?n(null):hs(n,e,t)},50)})}function hs(e,t,n){let{accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:c}=wt(t),d=us();document.body.appendChild(d);let u=ps({accent:r,bw:a,radius:i});document.body.appendChild(u);let{tooltip:b,cancelButton:m}=ms({accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:c},ds());document.body.appendChild(b);let f=null,h=null,S=!1,T;function F(y){return y===d||y===u||y===b||cs.has(y.id)}function P(y,Z){let te=d.style.pointerEvents;return d.style.pointerEvents="none",(()=>{try{return document.elementsFromPoint(y,Z)}finally{d.style.pointerEvents=te}})().find(On=>!(F(On)||ne(On)))}function L(y,Z,te){let Se=P(y,Z);return Se?Fr(Se):te}function D(y){f=L(y.clientX,y.clientY,f),f&&bs(u,f)}function v(y,Z,te=!1){f=L(y,Z,f),A(f,te)}function A(y,Z=!1){S||(S=!0,q(Z),e(y))}let I=()=>A(null);function z(y){h!==null||!y.isPrimary||(y.preventDefault(),y.stopPropagation(),h=y.pointerId,d.setPointerCapture?.(y.pointerId),f=L(y.clientX,y.clientY,f))}function $(y){h!==null&&y.pointerId!==h||(y.preventDefault(),y.stopPropagation(),D(y))}function C(y){h!==null&&y.pointerId!==h||(y.preventDefault(),y.stopPropagation(),h=null,d.releasePointerCapture?.(y.pointerId),v(y.clientX,y.clientY,!0))}function N(y){y.pointerId===h&&(h=null,d.releasePointerCapture?.(y.pointerId))}function w(y){if(S){if(document.removeEventListener("click",w,!0),ne(y.target))return;y.preventDefault(),y.stopImmediatePropagation();return}if(y.preventDefault(),y.stopImmediatePropagation(),y.target instanceof Element&&y.target.id==="bugdrop-element-picker-cancel"){A(null);return}v(y.clientX,y.clientY)}function g(y){y.target instanceof Element&&y.target.id==="bugdrop-element-picker-cancel"||(y.type==="pointerdown"&&z(y),y.type==="pointermove"&&$(y),y.type==="pointerup"&&C(y),y.type==="pointercancel"&&N(y),y.preventDefault(),y.stopImmediatePropagation())}function M(y){y.key==="Escape"&&A(null)}function O(y){y.preventDefault(),y.stopPropagation(),A(null)}function q(y=!1){T!==void 0&&(window.clearTimeout(T),T=void 0),gs({overlay:d,onPointerDown:z,onPointerMove:$,onPointerUp:C,onPointerCancel:N,onMouseMove:D}),y?T=window.setTimeout(()=>{document.removeEventListener("click",w,!0),T=void 0},1e3):document.removeEventListener("click",w,!0),document.removeEventListener("keydown",M),ae(),m?.removeEventListener("click",O),n?.removeEventListener("abort",I),d.remove(),u.remove(),b.remove(),document.body.style.cursor=""}function _(){window.addEventListener("pointerdown",g,!0),window.addEventListener("pointermove",g,!0),window.addEventListener("pointerup",g,!0),window.addEventListener("pointercancel",g,!0)}function ae(){window.removeEventListener("pointerdown",g,!0),window.removeEventListener("pointermove",g,!0),window.removeEventListener("pointerup",g,!0),window.removeEventListener("pointercancel",g,!0)}document.body.style.cursor="crosshair",_(),fs({overlay:d,onPointerDown:z,onPointerMove:$,onPointerUp:C,onPointerCancel:N,onMouseMove:D}),document.addEventListener("click",w,!0),document.addEventListener("keydown",M),m?.addEventListener("click",O),n?.addEventListener("abort",I,{once:!0})}function ys(e){let t=document.createElement("button");return t.id="bugdrop-element-picker-cancel",t.type="button",t.textContent=p().cancel,t.style.cssText=`
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: ${e};
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-weight: 700;
    justify-content: center;
    margin: -10px -12px;
    min-height: 44px;
    min-width: 44px;
    padding: 10px 12px;
    pointer-events: auto;
    text-decoration: underline;
    text-underline-offset: 2px;
    touch-action: manipulation;
    white-space: nowrap;
    width: auto;
  `,t}var Pr=10;function Mr(e,t,n){return new Promise(r=>{setTimeout(()=>{n?.aborted?r(null):ws(r,e,t,n)},50)})}function ws(e,t,n,r){let{accent:o,fontFamily:i,radius:a,bw:s,tooltipBg:l,tooltipText:c,tooltipBorder:d}=wt(t),u=vs();document.body.appendChild(u);let b=xs({accent:o,bw:s,radius:a});document.body.appendChild(b);let m=n?.redactionsAvailable?p().areaPickerRedactionInstruction:p().areaPickerInstruction,f=Ss(),h=Es({accent:o,fontFamily:i,radius:a,bw:s,tooltipBg:l,tooltipText:c,tooltipBorder:d},m,f);document.body.appendChild(h);let S=h.querySelector("#bugdrop-area-picker-cancel"),T=0,F=0,P=!1,L=null;function D(g,M,O,q){let _=Math.min(g,O),ae=Math.min(M,q),y=Math.abs(O-g),Z=Math.abs(q-M);b.style.left=`${_}px`,b.style.top=`${ae}px`,b.style.width=`${y}px`,b.style.height=`${Z}px`,b.style.display="block";let te=_+y,Se=ae+Z;u.style.clipPath=`polygon(
      0% 0%, 0% 100%, ${_}px 100%, ${_}px ${ae}px,
      ${te}px ${ae}px, ${te}px ${Se}px,
      ${_}px ${Se}px, ${_}px 100%, 100% 100%, 100% 0%
    )`}function v(g){L!==null||!g.isPrimary||(g.preventDefault(),T=g.clientX,F=g.clientY,P=!0,L=g.pointerId,u.setPointerCapture?.(g.pointerId))}function A(g){!P||g.pointerId!==L||(g.preventDefault(),D(T,F,g.clientX,g.clientY))}function I(g){if(!P||g.pointerId!==L)return;g.preventDefault(),P=!1,L=null,u.releasePointerCapture?.(g.pointerId);let M=Math.abs(g.clientX-T),O=Math.abs(g.clientY-F);if(M<Pr||O<Pr){b.style.display="none",u.style.clipPath="";return}let q=Math.min(T,g.clientX)+window.scrollX,_=Math.min(F,g.clientY)+window.scrollY;w(),e(new DOMRect(q,_,M,O))}function z(g){g.pointerId===L&&(P=!1,L=null,b.style.display="none",u.style.clipPath="")}function $(g){g.key==="Escape"&&(w(),e(null))}function C(){w(),e(null)}let N=()=>{w(),e(null)};function w(){u.removeEventListener("pointerdown",v),document.removeEventListener("pointermove",A),document.removeEventListener("pointerup",I),document.removeEventListener("pointercancel",z),document.removeEventListener("keydown",$),S?.removeEventListener("click",C),r?.removeEventListener("abort",N),u.remove(),b.remove(),h.remove()}u.addEventListener("pointerdown",v),document.addEventListener("pointermove",A),document.addEventListener("pointerup",I),document.addEventListener("pointercancel",z),document.addEventListener("keydown",$),S?.addEventListener("click",C),r?.addEventListener("abort",N,{once:!0})}function vs(){let e=document.createElement("div");return e.id="bugdrop-area-picker-overlay",e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2147483646;
    cursor: crosshair;
    touch-action: none;
    user-select: none;
  `,e}function xs(e){let t=document.createElement("div");return t.id="bugdrop-area-picker-selection",t.style.cssText=`
    position: fixed;
    border: ${e.bw}px solid ${e.accent};
    box-shadow: 0 0 0 4px color-mix(in srgb, ${e.accent} 30%, transparent);
    border-radius: ${e.radius};
    z-index: 2147483647;
    pointer-events: none;
    display: none;
  `,t}function Es(e,t,n){let r=document.createElement("div");if(r.id="bugdrop-area-picker-tooltip",r.style.cssText=`
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 20px);
    left: 50%;
    transform: translateX(-50%);
    background: ${e.tooltipBg};
    color: ${e.tooltipText};
    padding: 14px 28px;
    border-radius: ${e.radius};
    font-family: ${e.fontFamily};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    max-width: min(420px, calc(100vw - 40px));
    box-sizing: border-box;
    text-align: center;
    z-index: 2147483647;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: ${e.bw}px solid ${e.tooltipBorder};
    pointer-events: none;
  `,n){let o=document.createElement("button");o.id="bugdrop-area-picker-cancel",o.type="button",o.textContent=p().cancel,o.style.cssText=`
      align-items: center;
      appearance: none;
      background: transparent;
      border: 0;
      color: ${e.accent};
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-weight: 700;
      justify-content: center;
      margin: -10px -12px;
      min-height: 44px;
      min-width: 44px;
      padding: 10px 12px;
      pointer-events: auto;
      text-decoration: underline;
      text-underline-offset: 2px;
      touch-action: manipulation;
      white-space: nowrap;
      width: auto;
    `,r.append(t," (",o,")")}else r.textContent=`${t} (${p().escToCancel})`;return r}function Ss(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}var mn="#ff0000",ks="#000000";var vt=Math.PI/7,Rr=2,Dr=4,xt=1;function zr(e,t){let n=document.createElement("canvas"),r=n.getContext("2d"),o="draw",i=!1,a=[],s=null,l=!1,c=[],d=new Image;d.onload=()=>{n.width=d.width,n.height=d.height,n.style.maxWidth="100%",n.style.height="auto",n.style.cursor="crosshair",r.drawImage(d,0,0),u()},d.src=t,e.appendChild(n);function u(){c.push(r.getImageData(0,0,n.width,n.height))}function b(w){r.putImageData(w,0,0)}function m(){return c[c.length-1]??null}function f(w,g){return Math.hypot(g.x-w.x,g.y-w.y)}function h(){window.removeEventListener("mouseup",N),i=!1,a=[],s=null,l=!1}function S(){s&&b(s),h()}function T(w){let g=n.getBoundingClientRect(),M=d.width/g.width,O=d.height/g.height,q=(w.clientX-g.left)*M,_=(w.clientY-g.top)*O;return{x:Math.max(0,Math.min(n.width,q)),y:Math.max(0,Math.min(n.height,_))}}function F(){let w=n.getBoundingClientRect(),g=Math.max(n.width/w.width,n.height/w.height,1);return Math.round(5.5*g)}function P(w,g){let M=F();r.beginPath(),r.moveTo(w.x,w.y),r.lineTo(g.x,g.y),r.strokeStyle=mn,r.lineWidth=M,r.lineCap="round",r.lineJoin="round",r.stroke()}function L(w,g){P(w,g);let M=Math.atan2(g.y-w.y,g.x-w.x),O=F()*5;r.beginPath(),r.moveTo(g.x,g.y),r.lineTo(g.x-O*Math.cos(M-vt),g.y-O*Math.sin(M-vt)),r.lineTo(g.x-O*Math.cos(M+vt),g.y-O*Math.sin(M+vt)),r.closePath(),r.fillStyle=mn,r.fill()}function D(w,g){r.strokeStyle=mn,r.lineWidth=F(),r.lineCap="round",r.lineJoin="round",r.strokeRect(w.x,w.y,g.x-w.x,g.y-w.y)}function v(w,g){let M=Math.min(w.x,g.x),O=Math.min(w.y,g.y),q=Math.abs(g.x-w.x),_=Math.abs(g.y-w.y);return{x:M,y:O,width:q,height:_}}function A(w,g){let{x:M,y:O,width:q,height:_}=v(w,g),ae=Math.max(0,Math.floor(M)-xt),y=Math.max(0,Math.floor(O)-xt),Z=Math.min(n.width,Math.ceil(M+q)+xt),te=Math.min(n.height,Math.ceil(O+_)+xt);return{x:ae,y,width:Math.max(0,Z-ae),height:Math.max(0,te-y)}}function I(w,g){let{width:M,height:O}=A(w,g);return M>=Dr&&O>=Dr}function z(w,g){let{x:M,y:O,width:q,height:_}=A(w,g);r.fillStyle=ks,r.fillRect(M,O,q,_)}function $(w){let g=m();g&&(i=!0,a=[T(w)],s=g,l=!1,window.addEventListener("mouseup",N))}function C(w){if(!i||!s)return;let g=T(w);o==="draw"?(P(a[a.length-1],g),a.push(g),l=l||f(a[0],g)>=Rr):(b(s),o==="arrow"?L(a[0],g):o==="rect"?D(a[0],g):o==="redact"&&z(a[0],g))}function N(w){if(!i||!s){h();return}let g=T(w),M=a[0];if(!(o==="redact"?I(M,g):l||f(M,g)>=Rr)){b(s),h();return}o==="arrow"?(b(s),L(M,g)):o==="rect"?(b(s),D(M,g)):o==="redact"?(b(s),z(M,g)):o==="draw"&&!l&&P(M,g),u(),h()}return n.addEventListener("mousedown",$),n.addEventListener("mousemove",C),n.addEventListener("mouseup",N),{setTool(w){S(),o=w},undo(){if(s){S();return}if(c.length<=1)return;h(),c.pop();let w=m();w&&b(w)},getImageData(){return n.toDataURL("image/png")},destroy(){h(),n.removeEventListener("mousedown",$),n.removeEventListener("mousemove",C),n.removeEventListener("mouseup",N),n.remove()}}}function Ts(){return typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function De(e,t=Ts){return e==="auto"?t():e}function Et(e){return e==="light"||e==="dark"||e==="auto"}function Ye(e,t){e.classList.toggle("bd-dark",t==="dark")}function Ze(e,t,n){let r=n==="dark",o=H(t.accentColor);if(o){let d=o;e.style.setProperty("--bd-primary",d),e.style.setProperty("--bd-primary-hover",gt(d)),e.style.setProperty("--bd-border-focus",d)}let i=H(t.bgColor);i&&(e.style.setProperty("--bd-bg-primary",i),r?(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 85%, white)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 70%, white)`)):(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 93%, black)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 85%, black)`)));let a=H(t.textColor);if(a){e.style.setProperty("--bd-text-primary",a);let d=i||(r?"#0f172a":"#fafaf9");e.style.setProperty("--bd-text-secondary",`color-mix(in srgb, ${a} 65%, ${d})`),e.style.setProperty("--bd-text-muted",`color-mix(in srgb, ${a} 40%, ${d})`)}let s=Q(t.borderWidth)??null,l=H(t.borderColor)||null;if(s!==null||l!==null){let d=s!==null?`${s}px`:"1px",u=l||"var(--bd-border)";e.style.setProperty("--bd-border-width",d),l&&e.style.setProperty("--bd-border",u),e.style.setProperty("--bd-border-style",`var(--bd-border-width) solid ${u}`)}let c=pt(t.shadow)||null;if(c==="none")e.style.setProperty("--bd-shadow-sm","none"),e.style.setProperty("--bd-shadow-md","none"),e.style.setProperty("--bd-shadow-lg","none"),e.style.setProperty("--bd-shadow-glow","none");else if(c==="hard"){let d=l||(r?"#000":"#1a1a1a"),u=s!==null?"calc(var(--bd-border-width) + 2px)":"6px";e.style.setProperty("--bd-shadow-sm",`${d} 2px 2px 0 0`),e.style.setProperty("--bd-shadow-md",`${d} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-lg",`${d} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-glow","none")}}function St(e){if(typeof window>"u"||!window.matchMedia)return typeof console<"u"&&console.warn&&console.warn('[BugDrop] window.matchMedia unavailable; data-theme="auto" will not react to OS theme changes.'),()=>{};let t=window.matchMedia("(prefers-color-scheme: dark)"),n=r=>{try{e(r.matches?"dark":"light")}catch(o){console.warn("[BugDrop] Error applying system theme change:",o)}};return t.addEventListener("change",n),()=>t.removeEventListener("change",n)}var ze=8,Cs="(hover: none), (pointer: coarse)",Ls="(max-width: 640px)";function Fs(e,t,n){let r=je(e);return!!(r&&r!=="none"&&r!=="#"&&n!=="never"&&(t||n==="always"))}function Ir(e,t){let n=t.position==="bottom-left"?"left: 0":"right: 0",r=De(t.theme),o=t.font==="inherit",i=t.font&&t.font!=="inherit"?Ae(t.font):null,a=o||i?"":"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');",s=o?"inherit":i?`${i}, system-ui, sans-serif`:"'Space Grotesk', system-ui, sans-serif",l=Q(t.radius)??null,c=l!==null?`${l}px`:"6px",d=l!==null?`${Math.round(l*1.4)}px`:"10px",u=l!==null?`${Math.round(l*2)}px`:"14px",b=Q(t.borderWidth)??null,m=document.createElement("style");m.textContent=`
    ${a}

    :host {
      /* Typography */
      --bd-font: ${s};

      /* Radius */
      --bd-radius-sm: ${c};
      --bd-radius-md: ${d};
      --bd-radius-lg: ${u};

      /* Border */
      --bd-border-width: ${b!==null?`${b}px`:"1px"};

      /* Transitions */
      --bd-transition: 0.15s ease;
      --bd-transition-slow: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Light Theme (Default) */
    .bd-root {
      --bd-bg-primary: #fafaf9;
      --bd-bg-secondary: #f5f5f4;
      --bd-bg-tertiary: #e7e5e4;
      --bd-text-primary: #1c1917;
      --bd-text-secondary: #57534e;
      --bd-text-muted: #a8a29e;
      --bd-border: #e7e5e4;
      --bd-border-style: var(--bd-border-width) solid var(--bd-border);
      --bd-border-focus: ${Xe};
      --bd-primary: ${Xe};
      --bd-primary-hover: ${gt(Xe)};
      --bd-primary-text: #ffffff;
      --bd-overlay-bg: rgba(0, 0, 0, 0.4);
      --bd-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --bd-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
      --bd-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
      --bd-shadow-glow: none;
      --bd-success: #22c55e;
      --bd-error: #ef4444;
    }

    /* Dark Theme */
    .bd-root.bd-dark {
      --bd-bg-primary: #0f172a;
      --bd-bg-secondary: #1e293b;
      --bd-bg-tertiary: #334155;
      --bd-text-primary: #f1f5f9;
      --bd-text-secondary: #94a3b8;
      --bd-text-muted: #64748b;
      --bd-border: #334155;
      --bd-border-focus: #22d3ee;
      --bd-primary: #22d3ee;
      --bd-primary-hover: #06b6d4;
      --bd-primary-text: #0f172a;
      --bd-overlay-bg: rgba(0, 0, 0, 0.6);
      --bd-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
      --bd-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
      --bd-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.4);
      --bd-shadow-glow: 0 0 40px rgba(34, 211, 238, 0.15);
      --bd-success: #34d399;
      --bd-error: #f87171;
    }

    .bd-root {
      font-family: var(--bd-font);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    * {
      box-sizing: border-box;
      font-family: inherit;
    }

    /* Trigger Button (edge label) */
    .bd-trigger {
      position: fixed;
      bottom: 20px;
      ${n};
      height: 44px;
      min-width: 0;
      padding: 0 0 0 16px;
      border-radius: ${l!==null?`${l*2}px 0 0 ${l*2}px`:"22px 0 0 22px"};
      border: ${b!==null?"var(--bd-border-style)":"none"};
      background: var(--bd-primary);
      color: var(--bd-primary-text);
      cursor: pointer;
      box-shadow:
        var(--bd-shadow-md),
        0 0 0 0 var(--bd-primary);
      z-index: 999999;
      transition: transform var(--bd-transition), box-shadow var(--bd-transition), opacity var(--bd-transition);
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: visible;
      animation: bd-triggerSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    .bd-trigger--left {
      padding: 0 16px 0 0;
      border-radius: ${l!==null?`0 ${l*2}px ${l*2}px 0`:"0 22px 22px 0"};
    }

    .bd-trigger--positioned {
      animation: none;
    }

    .bd-trigger:hover {
      transform: scale(1.03);
      box-shadow:
        var(--bd-shadow-lg),
        0 0 20px color-mix(in srgb, var(--bd-primary) 30%, transparent);
    }

    .bd-trigger:active {
      transform: scale(0.97);
    }

    .bd-trigger-icon {
      font-size: 18px;
      line-height: 1;
    }

    .bd-trigger-icon img {
      width: 18px;
      height: 18px;
      object-fit: contain;
      display: block;
    }

    .bd-trigger-label {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .bd-trigger-drag-handle {
      align-self: center;
      width: 30px;
      height: calc(100% - 8px);
      margin: 4px;
      border-radius: 7px;
      background: transparent;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--bd-primary-text);
      opacity: 0.95;
      touch-action: none;
    }

    .bd-trigger--left .bd-trigger-drag-handle {
      order: -1;
    }

    .bd-trigger-drag-handle:hover,
    .bd-trigger-drag-handle:active,
    .bd-trigger--dragging .bd-trigger-drag-handle {
      background: color-mix(in srgb, var(--bd-primary-text) 18%, transparent);
      opacity: 1;
    }

    .bd-trigger-drag-handle:hover {
      cursor: grab;
    }

    .bd-trigger-drag-handle:active,
    .bd-trigger--dragging .bd-trigger-drag-handle {
      cursor: grabbing;
    }

    .bd-trigger-drag-handle svg {
      display: block;
      width: 14px;
      height: 22px;
      pointer-events: none;
    }

    @keyframes bd-triggerSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Pull Tab (shown after dismissal) */
    .bd-pull-tab {
      position: fixed;
      bottom: 20px;
      right: 0;
      width: 24px;
      height: 48px;
      border-radius: 8px 0 0 8px;
      border: none;
      background: var(--bd-primary);
      color: var(--bd-primary-text);
      cursor: pointer;
      box-shadow: -2px 4px 12px color-mix(in srgb, var(--bd-primary) 30%, transparent);
      z-index: 999999;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bd-pullTabSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bd-pull-tab:hover {
      width: 32px;
      box-shadow: -4px 6px 16px color-mix(in srgb, var(--bd-primary) 40%, transparent);
    }

    .bd-pull-tab:active {
      width: 28px;
    }

    .bd-pull-tab-chevron {
      font-size: 16px;
      font-weight: bold;
      transition: transform 0.2s;
    }

    .bd-pull-tab:hover .bd-pull-tab-chevron {
      transform: translateX(-2px);
    }

    /* Pull tab position for bottom-left */
    .bd-pull-tab--left {
      right: auto;
      left: 0;
      border-radius: 0 8px 8px 0;
      box-shadow: 2px 4px 12px color-mix(in srgb, var(--bd-primary) 30%, transparent);
    }

    .bd-pull-tab--left:hover {
      box-shadow: 4px 6px 16px color-mix(in srgb, var(--bd-primary) 40%, transparent);
    }

    .bd-pull-tab--left .bd-pull-tab-chevron {
      transform: rotate(180deg);
    }

    .bd-pull-tab--left:hover .bd-pull-tab-chevron {
      transform: rotate(180deg) translateX(-2px);
    }

    @media (max-width: 640px) {
      .bd-pull-tab {
        bottom: 16px;
        height: 44px;
        width: 22px;
      }

      .bd-pull-tab:hover {
        width: 28px;
      }
    }

    /* Touch devices - always slightly expanded */
    @media (hover: none) {
      .bd-pull-tab {
        width: 28px;
      }
    }

    /* Dismissible close button */
    .bd-trigger-close {
      position: absolute;
      top: -4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: var(--bd-text-primary);
      color: var(--bd-bg-primary);
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.8);
      transition: opacity var(--bd-transition), transform var(--bd-transition);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-shadow: var(--bd-shadow-sm);
    }

    .bd-trigger--left .bd-trigger-close {
      right: auto;
      left: 36px;
    }

    .bd-trigger--right .bd-trigger-close {
      right: 36px;
    }

    .bd-trigger:hover .bd-trigger-close,
    .bd-trigger-close:focus-visible {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }

    .bd-trigger-close:hover {
      background: var(--bd-error);
      color: white;
    }

    /* Modal Overlay */
    .bd-overlay {
      position: fixed;
      inset: 0;
      background: var(--bd-overlay-bg);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bd-fadeIn 0.2s ease;
    }

    /* Modal */
    .bd-modal {
      background: var(--bd-bg-primary);
      border-radius: var(--bd-radius-lg);
      border: var(--bd-border-style);
      box-shadow: var(--bd-shadow-lg), var(--bd-shadow-glow);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: bd-slideUp var(--bd-transition-slow);
    }

    .bd-modal--positioned {
      position: fixed;
      margin: 0;
      animation: none;
    }

    .bd-modal--dragging {
      user-select: none;
    }

    .bd-modal--annotator {
      width: min(96vw, 1100px);
      max-width: 1100px;
    }

    /* Modal Header */
    .bd-header {
      position: relative;
      padding: 16px 20px;
      border-bottom: var(--bd-border-style);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bd-bg-primary);
      animation: bd-fadeIn 0.2s ease 0.05s both;
      cursor: grab;
      user-select: none;
      touch-action: none;
    }

    .bd-modal-drag-indicator {
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 10px;
      display: grid;
      grid-template-columns: repeat(3, 4px);
      grid-auto-rows: 4px;
      gap: 3px 5px;
      justify-content: center;
      align-content: center;
      color: var(--bd-text-muted);
      opacity: 0.8;
      pointer-events: none;
    }

    .bd-modal-drag-indicator span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
    }

    .bd-modal--dragging .bd-header {
      cursor: grabbing;
    }

    .bd-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--bd-text-primary);
    }

    .bd-close {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: var(--bd-radius-sm);
      font-size: 24px;
      cursor: pointer;
      color: var(--bd-text-secondary);
      padding: 0;
      line-height: 1;
      transition: background var(--bd-transition), color var(--bd-transition);
    }

    .bd-close:hover {
      background: var(--bd-bg-secondary);
      color: var(--bd-text-primary);
    }

    /* Modal Body with staggered animation */
    .bd-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .bd-modal--annotator .bd-body {
      padding-top: 0;
    }

    .bd-body > *:nth-child(1) { animation: bd-fadeIn 0.2s ease 0.1s both; }
    .bd-body > *:nth-child(2) { animation: bd-fadeIn 0.2s ease 0.15s both; }
    .bd-body > *:nth-child(3) { animation: bd-fadeIn 0.2s ease 0.2s both; }
    .bd-body > *:nth-child(4) { animation: bd-fadeIn 0.2s ease 0.25s both; }
    .bd-body > *:nth-child(5) { animation: bd-fadeIn 0.2s ease 0.3s both; }

    .bd-version {
      text-align: center;
      padding: 4px 0;
      font-size: 0.7rem;
      color: var(--bd-text-secondary);
      opacity: 0.5;
    }

    /* Form Elements */
    .bd-form-group {
      margin-bottom: 16px;
    }

    .bd-label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      font-size: 13px;
      color: var(--bd-text-secondary);
      letter-spacing: 0.01em;
    }

    .bd-input, .bd-textarea {
      width: 100%;
      padding: 12px 14px;
      background: var(--bd-bg-primary);
      border: var(--bd-border-style);
      border-radius: var(--bd-radius-sm);
      font-size: 14px;
      color: var(--bd-text-primary);
      transition: border-color var(--bd-transition), box-shadow var(--bd-transition);
    }

    .bd-input::placeholder, .bd-textarea::placeholder {
      color: var(--bd-text-muted);
    }

    .bd-input:focus, .bd-textarea:focus {
      outline: none;
      border-color: var(--bd-border-focus);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--bd-border-focus) 15%, transparent);
    }

    .bd-textarea {
      min-height: 100px;
      resize: vertical;
    }

    /* Buttons */
    .bd-btn {
      padding: 11px 20px;
      border-radius: var(--bd-radius-sm);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--bd-transition);
      position: relative;
    }

    .bd-btn-primary {
      background: var(--bd-primary);
      color: var(--bd-primary-text);
      border: none;
      box-shadow: var(--bd-shadow-sm);
    }

    .bd-btn-primary:hover {
      background: var(--bd-primary-hover);
      box-shadow: var(--bd-shadow-md);
    }

    .bd-dark .bd-btn-primary:hover {
      box-shadow: var(--bd-shadow-md), 0 0 20px rgba(34, 211, 238, 0.2);
    }

    .bd-btn-secondary {
      background: var(--bd-bg-primary);
      border: var(--bd-border-style);
      color: var(--bd-text-primary);
    }

    .bd-btn-secondary:hover {
      background: var(--bd-bg-secondary);
    }

    .bd-btn-quiet {
      background: transparent;
      border: none;
      color: var(--bd-text-secondary);
      padding-left: 12px;
      padding-right: 12px;
    }

    .bd-btn-quiet:hover {
      background: var(--bd-bg-secondary);
      color: var(--bd-text-primary);
    }

    .bd-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .bd-evidence-block {
      margin: 8px 0 16px;
    }

    .bd-evidence-row {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      align-items: center;
      gap: 14px;
    }

    .bd-screenshot-control {
      min-height: 36px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-top: 3px;
    }

    .bd-checkbox {
      width: 18px;
      height: 18px;
      accent-color: var(--bd-primary);
      cursor: pointer;
      flex: 0 0 auto;
    }

    .bd-checkbox-label {
      color: var(--bd-text-secondary);
      cursor: pointer;
      font-size: 0.95rem;
      line-height: 1.35;
      user-select: none;
    }

    .bd-upload-group {
      min-width: 0;
      justify-self: end;
    }

    .bd-upload-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .bd-upload-button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 32px;
      padding: 6px 9px;
      font-size: 13px;
      white-space: nowrap;
    }

    .bd-upload-icon {
      width: 14px;
      height: 14px;
      flex: 0 0 auto;
    }

    .bd-upload-input {
      display: none;
    }

    .bd-upload-list {
      display: grid;
      gap: 6px;
      margin-top: 10px;
    }

    .bd-upload-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto 28px;
      align-items: center;
      gap: 8px;
      min-height: 34px;
      padding: 5px 5px 5px 10px;
      background: var(--bd-bg-secondary);
      border: var(--bd-border-style);
      border-radius: var(--bd-radius-sm);
    }

    .bd-upload-item__name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--bd-text-primary);
      font-size: 13px;
    }

    .bd-upload-item__meta {
      color: var(--bd-text-secondary);
      font-size: 12px;
      white-space: nowrap;
    }

    .bd-upload-remove {
      width: 28px;
      height: 28px;
      display: inline-grid;
      place-items: center;
      border: none;
      border-radius: var(--bd-radius-sm);
      background: transparent;
      color: var(--bd-text-secondary);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      transition: background var(--bd-transition), color var(--bd-transition);
    }

    .bd-upload-remove:hover {
      background: var(--bd-bg-tertiary);
      color: var(--bd-text-primary);
    }

    /* Loading States */
    .bd-btn--loading {
      color: transparent !important;
      pointer-events: none;
    }

    .bd-btn--loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin: -8px 0 0 -8px;
      border: 2px solid currentColor;
      border-color: var(--bd-primary-text) transparent var(--bd-primary-text) transparent;
      border-radius: 50%;
      animation: bd-spin 0.8s linear infinite;
    }

    .bd-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--bd-border);
      border-top-color: var(--bd-primary);
      border-radius: 50%;
      animation: bd-spin 0.8s linear infinite;
    }

    .bd-spinner--lg {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .bd-loading-overlay {
      position: absolute;
      inset: 0;
      background: var(--bd-bg-primary);
      opacity: 0.95;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 10;
      border-radius: var(--bd-radius-lg);
    }

    .bd-loading-text {
      font-size: 14px;
      color: var(--bd-text-secondary);
      font-weight: 500;
    }

    .bd-skeleton {
      background: linear-gradient(
        90deg,
        var(--bd-bg-secondary) 0%,
        var(--bd-bg-tertiary) 50%,
        var(--bd-bg-secondary) 100%
      );
      background-size: 200% 100%;
      animation: bd-shimmer 1.5s ease-in-out infinite;
      border-radius: var(--bd-radius-sm);
    }

    /* Error States */
    .bd-error-message {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--bd-radius-sm);
      color: var(--bd-error);
      font-size: 13px;
      margin-bottom: 16px;
    }

    .bd-dark .bd-error-message {
      background: rgba(248, 113, 113, 0.1);
      border-color: rgba(248, 113, 113, 0.2);
    }

    .bd-error-message__icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    .bd-error-message__text {
      flex: 1;
      line-height: 1.4;
    }

    .bd-error-message__retry {
      background: none;
      border: none;
      color: inherit;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
      font-size: 13px;
    }

    .bd-input--error, .bd-textarea--error {
      border-color: var(--bd-error) !important;
    }

    /* Success Modal */
    .bd-success-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 8px 0 16px;
    }

    .bd-success-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--bd-success);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .bd-success-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .bd-success-issue {
      margin: 0 0 12px;
      color: var(--bd-text-primary);
      font-size: 15px;
    }

    .bd-issue-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--bd-primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: var(--bd-radius-sm);
      background: var(--bd-bg-secondary);
      transition: background var(--bd-transition), color var(--bd-transition);
    }

    .bd-issue-link:hover {
      background: var(--bd-bg-tertiary);
      color: var(--bd-primary-hover);
    }

    .bd-issue-link svg {
      flex-shrink: 0;
    }

    .bd-powered-by {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--bd-border);
      text-align: center;
    }

    .bd-powered-by a {
      color: var(--bd-text-secondary);
      text-decoration: none;
      font-size: 12px;
      transition: color var(--bd-transition);
    }

    .bd-powered-by a:hover {
      color: var(--bd-text-primary);
    }

    .bd-input--error:focus, .bd-textarea--error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
    }

    .bd-field-error {
      color: var(--bd-error);
      font-size: 12px;
      margin-top: 4px;
    }

    /* Actions */
    .bd-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .bd-success-actions {
      justify-content: center;
    }

    .bd-screenshot-actions {
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Tools Toolbar */
    .bd-tools {
      display: flex;
      gap: 6px;
      padding: 8px;
      background: var(--bd-bg-secondary);
      border: var(--bd-border-style);
      border-radius: var(--bd-radius-md);
      margin-bottom: 12px;
    }

    .bd-tool {
      padding: 8px 14px;
      background: transparent;
      border: none;
      border-radius: var(--bd-radius-sm);
      font-size: 13px;
      font-weight: 500;
      color: var(--bd-text-secondary);
      cursor: pointer;
      transition: all var(--bd-transition);
    }

    .bd-tool:hover {
      background: var(--bd-bg-tertiary);
      color: var(--bd-text-primary);
    }

    .bd-tool.active {
      background: var(--bd-bg-primary);
      color: var(--bd-primary);
      box-shadow: var(--bd-shadow-sm);
    }

    .bd-annotation-stage {
      min-height: 240px;
      max-height: min(58vh, 620px);
      padding: 18px;
      border: 1px solid var(--bd-border, #e7e5e4);
      border-radius: var(--bd-radius-md);
      background:
        linear-gradient(45deg, var(--bd-bg-secondary) 25%, transparent 25%),
        linear-gradient(-45deg, var(--bd-bg-secondary) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--bd-bg-secondary) 75%),
        linear-gradient(-45deg, transparent 75%, var(--bd-bg-secondary) 75%),
        var(--bd-bg-primary);
      background-position: 0 0, 0 8px, 8px -8px, -8px 0;
      background-size: 16px 16px;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bd-border) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
    }

    .bd-annotation-stage canvas {
      display: block;
      max-width: 100%;
      max-height: calc(min(58vh, 620px) - 36px);
      width: auto;
      height: auto;
      background: #ffffff;
      box-shadow: var(--bd-shadow-md);
    }

    /* Preview */
    .bd-preview {
      border: var(--bd-border-style);
      border-radius: var(--bd-radius-md);
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: var(--bd-shadow-sm);
    }

    .bd-preview img {
      width: 100%;
      display: block;
    }

    /* Toast Notifications */
    .bd-toast {
      position: fixed;
      bottom: 100px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: var(--bd-radius-md);
      color: white;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000001;
      box-shadow: var(--bd-shadow-lg);
      animation: bd-slideIn 0.3s ease;
    }

    .bd-toast.success {
      background: var(--bd-success);
    }

    .bd-toast.error {
      background: var(--bd-error);
    }

    /* Animations */
    @keyframes bd-fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes bd-slideUp {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes bd-slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes bd-pullTabSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* Directional animations for dismiss/restore */
    @keyframes bd-triggerSlideInFromRight {
      from {
        opacity: 0;
        transform: translateX(100px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes bd-triggerSlideOutToRight {
      from {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateX(100px) scale(0.8);
      }
    }

    .bd-trigger--dismissing {
      animation: bd-triggerSlideOutToRight 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
    }

    .bd-trigger--restoring {
      animation: bd-triggerSlideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes bd-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes bd-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Mobile Responsiveness */
    @media (max-width: 640px) {
      .bd-trigger {
        height: 40px;
        padding: 0 0 0 14px;
        bottom: 16px;
        gap: 6px;
      }

      .bd-trigger--left {
        padding: 0 14px 0 0;
      }

      .bd-trigger-drag-handle {
        width: 28px;
      }

      .bd-trigger-icon {
        font-size: 16px;
      }

      .bd-trigger-icon img {
        width: 16px;
        height: 16px;
      }

      .bd-trigger-label {
        font-size: 13px;
      }

      .bd-overlay {
        align-items: flex-end;
      }

      .bd-modal {
        width: 100%;
        max-width: 100%;
        max-height: 95vh;
        border-radius: var(--bd-radius-lg) var(--bd-radius-lg) 0 0;
        animation: bd-slideUpMobile var(--bd-transition-slow);
      }

      .bd-modal--positioned {
        position: static;
        width: 100%;
      }

      .bd-modal--annotator {
        width: calc(100% - 16px);
        max-width: calc(100% - 16px);
      }

      .bd-header {
        padding: 16px;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .bd-close {
        width: 44px;
        height: 44px;
        font-size: 28px;
      }

      .bd-body {
        padding: 16px;
        padding-bottom: 32px;
      }

      .bd-btn {
        padding: 14px 24px;
        font-size: 16px;
        min-height: 48px;
      }

      .bd-input, .bd-textarea {
        padding: 14px;
        font-size: 16px;
        min-height: 48px;
      }

      .bd-category-option {
        gap: 4px !important;
        padding: 8px !important;
        min-width: 0;
      }

      .bd-category-option span {
        font-size: 0.85rem !important;
        white-space: nowrap;
      }

      .bd-textarea {
        min-height: 120px;
      }

      .bd-evidence-row {
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px;
      }

      .bd-upload-button {
        min-height: 34px;
        padding: 7px 10px;
        font-size: 14px;
      }

      .bd-actions {
        flex-direction: column-reverse;
        gap: 8px;
      }

      .bd-actions .bd-btn {
        width: 100%;
      }

      .bd-screenshot-actions {
        flex-direction: column;
      }

      .bd-tools {
        flex-wrap: wrap;
      }

      .bd-annotation-stage {
        min-height: 180px;
        max-height: 46vh;
        padding: 12px;
      }

      .bd-annotation-stage canvas {
        max-height: calc(46vh - 24px);
      }

      .bd-tool {
        flex: 1;
        min-width: calc(50% - 4px);
        justify-content: center;
        padding: 12px;
        text-align: center;
      }

      .bd-toast {
        left: 16px;
        right: 16px;
        bottom: 80px;
        justify-content: center;
      }
    }

    @keyframes bd-slideUpMobile {
      from { opacity: 0; transform: translateY(100%); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Touch-friendly hover states */
    @media (hover: none) {
      .bd-trigger:hover {
        transform: none;
        box-shadow: var(--bd-shadow-md);
      }

      .bd-trigger:active {
        transform: scale(0.97);
      }

      /* Always show close button on touch devices */
      .bd-trigger-close {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
      }

      .bd-header {
        cursor: default;
        user-select: auto;
        touch-action: auto;
      }

      .bd-modal-drag-indicator {
        display: none;
      }

      .bd-btn:hover {
        background: inherit;
      }

      .bd-btn-primary:hover {
        background: var(--bd-primary);
      }

      .bd-btn-primary:active {
        background: var(--bd-primary-hover);
      }

      .bd-btn-secondary:hover {
        background: var(--bd-bg-primary);
      }

      .bd-btn-secondary:active {
        background: var(--bd-bg-secondary);
      }
    }

    /* Safe area support for notched devices */
    @supports (padding-bottom: env(safe-area-inset-bottom)) {
      .bd-modal {
        padding-bottom: env(safe-area-inset-bottom);
      }
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `,e.appendChild(m);let f=document.createElement("div");return f.className="bd-root",Ye(f,r),Ze(f,t,r),e.appendChild(f),f}function Je(e){return`<p class="bd-redaction-note" style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-warning-bg, #fff8e1); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${W(e)}</p>`}function U(e,t,n,r=!1,o=""){let i=document.createElement("div");i.className="bd-overlay";let a=["bd-modal",o].filter(Boolean).join(" "),s=r?'<div class="bd-version">BugDrop v1.56.4</div>':"";return i.innerHTML=`
    <div class="${a}">
      <div class="bd-header">
        <span class="bd-modal-drag-indicator" aria-hidden="true">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </span>
        <h2 class="bd-title">${W(t)}</h2>
        <button class="bd-close">&times;</button>
      </div>
      <div class="bd-body">
        ${n}
      </div>
      ${s}
    </div>
  `,e.appendChild(i),As(i),i}function As(e){if(typeof window.matchMedia!="function"||window.matchMedia(Cs).matches)return;let t=e.querySelector(".bd-modal"),n=e.querySelector(".bd-header");if(!t||!n)return;let r=t,o=n,i=null,a=0,s=0,l=0,c=0,d=!1,u=null,b=()=>{d||(d=!0,F(),window.removeEventListener("resize",h),window.visualViewport?.removeEventListener("resize",h),u?.disconnect())};function m(v,A){let I=r.getBoundingClientRect(),z=Math.max(ze,window.innerWidth-I.width-ze),$=Math.max(ze,window.innerHeight-I.height-ze);return{left:Math.min(Math.max(v,ze),z),top:Math.min(Math.max(A,ze),$)}}function f(v,A){let I=m(v,A);r.style.left=`${I.left}px`,r.style.top=`${I.top}px`}function h(){if(!e.isConnected){b();return}if(!r.classList.contains("bd-modal--positioned"))return;if(window.matchMedia(Ls).matches){T();return}S();let v=r.getBoundingClientRect();f(v.left,v.top)}function S(){r.style.removeProperty("width"),r.style.removeProperty("max-width");let v=r.getBoundingClientRect(),A=Math.floor(window.innerWidth*.9);r.style.width=`${Math.min(v.width,A)}px`,r.style.maxWidth="none"}function T(){r.classList.remove("bd-modal--positioned","bd-modal--dragging"),r.style.removeProperty("left"),r.style.removeProperty("top"),r.style.removeProperty("width"),r.style.removeProperty("max-width")}function F(){i!==null&&(i=null,r.classList.remove("bd-modal--dragging"),window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",L),window.removeEventListener("pointercancel",D))}function P(v){i===v.pointerId&&f(l+v.clientX-a,c+v.clientY-s)}function L(v){i===v.pointerId&&F()}function D(v){i===v.pointerId&&F()}o.addEventListener("pointerdown",v=>{if(v.target.closest("button, a, input, textarea, select, label"))return;v.preventDefault();let A=r.getBoundingClientRect();i=v.pointerId,a=v.clientX,s=v.clientY,l=A.left,c=A.top,r.classList.add("bd-modal--positioned","bd-modal--dragging"),r.style.width=`${A.width}px`,r.style.maxWidth="none",f(l,c),o.setPointerCapture(v.pointerId),window.addEventListener("pointermove",P),window.addEventListener("pointerup",L),window.addEventListener("pointercancel",D)}),window.addEventListener("resize",h),window.visualViewport?.addEventListener("resize",h),e.parentNode&&(u=new MutationObserver(()=>{e.isConnected||b()}),u.observe(e.parentNode,{childList:!0}))}function $r(e,t,n,r,o="public"){return new Promise(i=>{let a=je(n),s=Fs(n,r,o),l=s&&a?`<a href="${W(a)}" target="_blank" rel="noopener noreferrer" class="bd-issue-link">
          <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
          </svg>
          ${x(p().viewOnGitHub)}
        </a>`:"",c=r||o==="always"&&s?`
        <p class="bd-success-issue">${p().issueCreated(`<strong>#${t}</strong>`)}</p>
        ${l}
      `:`<p class="bd-success-issue">${x(p().feedbackSubmittedMessage)}</p>`,d=U(e,p().successTitle,`
        <div class="bd-success-content">
          <div class="bd-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          ${c}
        </div>
        <div class="bd-actions bd-success-actions">
          <button class="bd-btn bd-btn-primary" data-action="done">${x(p().done)}</button>
        </div>
        <div class="bd-powered-by">
          <a href="https://github.com/mean-weasel/bugdrop" target="_blank" rel="noopener noreferrer">Powered by BugDrop</a>
        </div>
      `,!0),u=d.querySelector(".bd-close"),b=d.querySelector('[data-action="done"]'),m=()=>{d.remove(),i()};u?.addEventListener("click",m),b?.addEventListener("click",m)})}function Or(e,t,n=0,r){return new Promise(o=>{let i=[];r?.redactionUnavailable?i.push(p().viewportRedactionUnavailableNote):(n>0&&i.push(p().redactionCountNote(n)),r?.redactionLimitations&&i.push(p().redactionLimitationsNote));let a=i.length?Je(i.join(" ")):"",l=r?.selectedElementCapture?`
        <p class="bd-selected-element-note" style="margin: -4px 0 12px; color: var(--bd-text-secondary); font-size: 13px;">
          ${p().selectedElementNote('<a href="https://bugdrop.dev/docs/configuration#select-element-screenshots" target="_blank" rel="noopener noreferrer">data-element-context-max-area</a>')}
        </p>
      `:"",c=U(e,p().reviewScreenshotTitle,`
        ${a}
        <p style="margin: 0 0 12px; color: var(--bd-text-secondary); font-size: 13px;">
          ${x(p().annotationInstruction)}
        </p>
        ${l}
        <div class="bd-tools">
          <button class="bd-tool active" data-tool="draw">\u270F\uFE0F ${x(p().toolDraw)}</button>
          <button class="bd-tool" data-tool="arrow">\u27A1\uFE0F ${x(p().toolArrow)}</button>
          <button class="bd-tool" data-tool="rect">\u25A2 ${x(p().toolRectangle)}</button>
          <button class="bd-tool" data-tool="redact">${x(p().toolRedact)}</button>
          <button class="bd-tool" data-action="undo">\u21B6 ${x(p().undo)}</button>
        </div>
        <div id="annotation-canvas" class="bd-annotation-stage"></div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-secondary" data-action="retake">${x(p().retake)}</button>
          <button class="bd-btn bd-btn-primary" data-action="done">${x(p().submitFeedback)}</button>
        </div>
      `,!1,"bd-modal--annotator"),d=c.querySelector("#annotation-canvas"),u=zr(d,t),b=c.querySelectorAll("[data-tool]");b.forEach(T=>{T.addEventListener("click",F=>{let P=F.currentTarget,L=P.dataset.tool;L&&(b.forEach(D=>D.classList.remove("active")),P.classList.add("active"),u.setTool(L))})}),c.querySelector('[data-action="undo"]')?.addEventListener("click",()=>u.undo());let f=c.querySelector(".bd-close"),h=c.querySelector('[data-action="retake"]'),S=c.querySelector('[data-action="done"]');f?.addEventListener("click",()=>{u.destroy(),c.remove(),o("cancel")}),h?.addEventListener("click",()=>{u.destroy(),c.remove(),o("retake")}),S?.addEventListener("click",()=>{let T=u.getImageData();u.destroy(),c.remove(),o(T)})})}async function kt(e,t,n,r){return Tt(e,()=>Sr(t,n,r?.captureOptions),r)}async function Br(e,t,n,r){return Tt(e,()=>kr(t,n,r?.captureOptions),r)}async function Tt(e,t,n){let r=n?.showLoading===!1?null:U(e,p().capturingTitle,`
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
              <div class="bd-spinner bd-spinner--lg"></div>
              <p class="bd-loading-text" style="margin-top: 12px;">${x(p().capturingScreenshot)}</p>
            </div>
          `);try{if(r&&await Ms(),n?.signal?.aborted)return r?.remove(),{kind:"cancelled"};let o=typeof t=="function"?t():t,i=await Ps(o,n?.signal);return r?.remove(),i===null?{kind:"cancelled"}:Ds(i)}catch(o){if(r?.remove(),n?.signal?.aborted)return{kind:"cancelled"};console.warn("[BugDrop] Screenshot capture failed:",o);let i=n?.allowSkip!==!1,a=n?.allowChooseAgain!==!1;return o instanceof Pe?Rs(e):new Promise(s=>{let l=U(e,p().captureFailedTitle,`
          <div class="bd-error-message">
            <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            <span class="bd-error-message__text">${x(p().captureFailedMessage)}</span>
          </div>
          <div class="bd-actions">
            ${i?`<button class="bd-btn bd-btn-secondary" data-action="skip">${x(p().skipScreenshot)}</button>`:""}
            ${a?`<button class="bd-btn bd-btn-primary" data-action="choose-again">${x(p().chooseAnotherMethod)}</button>`:""}
          </div>
        `,!0),c=l.querySelector(".bd-close"),d=l.querySelector('[data-action="skip"]'),u=l.querySelector('[data-action="choose-again"]');c?.addEventListener("click",()=>{l.remove(),s({kind:"cancelled"})}),d?.addEventListener("click",()=>{l.remove(),s({kind:"skipped"})}),u?.addEventListener("click",()=>{l.remove(),s({kind:"choose-again"})})})}}function Ps(e,t){return t?t.aborted?Promise.resolve(null):new Promise((n,r)=>{let o=()=>n(null);t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})}):e}function Ms(){return typeof requestAnimationFrame!="function"?new Promise(e=>setTimeout(e,0)):new Promise(e=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>e())})})}function Rs(e){return new Promise(t=>{let n=U(e,p().maskFailureTitle,`
        <div class="bd-error-message">
          <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
          <span class="bd-error-message__text">${x(p().maskFailureMessage)}</span>
        </div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-primary" data-action="skip">${x(p().continueWithoutScreenshot)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="skip"]');r?.addEventListener("click",()=>{n.remove(),t({kind:"cancelled"})}),o?.addEventListener("click",()=>{n.remove(),t({kind:"skipped"})})})}function Ds(e){return typeof e=="string"?{kind:"ok",dataUrl:e}:{kind:"ok",dataUrl:e.dataUrl,redaction:e.redaction}}function Hr(e,t){let n=e.getBoundingClientRect();if(!_r(n))return e;let o=Math.max(1,window.innerWidth*window.innerHeight)*yr(t.maxViewportAreaMultiplier),i=e,a=e.parentElement;for(;a&&a!==document.body&&a!==document.documentElement;){let s=a.getBoundingClientRect(),l=s.width*s.height;_r(s)&&l<=o&&zs(s,n)&&Is(s,n)&&(i=a),a=a.parentElement}return i}function _r(e){return e.width>0&&e.height>0}function zs(e,t){return e.left<=t.left&&e.top<=t.top&&e.right>=t.right&&e.bottom>=t.bottom}function Is(e,t){let n=e.width>=t.width+160,r=e.height>=t.height+160,o=t.width*t.height,i=e.width*e.height;return n||r||i>=o*4}function Ur(e){let t=[],n=e.ownerDocument.body,r=e;if(r===n)return Ct(r);for(;r&&r!==n;){let o=Ct(r);if(r.id){o=`#${Qe(r.id)}`,t.unshift(o);break}let i=Wr(r).slice(0,2);i.length&&(o+=`.${i.map(Qe).join(".")}`),t.unshift(o),r=r.parentElement}return t.join(" > ")}function qr(e){let t=$s(e),n=t.map(Os),r=t.map(bn);return Ns(n,r,e)}function $s(e){let t=[],n=e;for(;n;)t.unshift(n),n=n.parentElement;return t}function Os(e){let t=Bs(e);return t.length<=128?t:bn(e)}function Bs(e){let t=Ct(e);e.id&&(t+=`#${Qe(e.id)}`);let n=Wr(e).slice(0,3);return n.length>0&&(t+=`.${n.map(Qe).join(".")}`),e.id||(t+=jr(e)),t}function bn(e){return`${Ct(e)}${jr(e)}`}function Wr(e){return Array.from(e.classList).filter(Boolean)}function Ct(e){return Qe(e.localName||e.tagName.toLowerCase())}function Ns(e,t,n){let r=e.join(" > ");return r.length<=1024?r:Vr(e,n)||Vr(t,n)||bn(n)}function Vr(e,t){for(let n=e.length-1;n>=0;n-=1){let r=e.slice(n).join(" > ");if(!(r.length>1024)&&_s(r,t))return r}return null}function _s(e,t){try{return t.ownerDocument.querySelector(e)===t}catch{return!1}}function jr(e){let t=Hs(e);return t>1||Vs(e)?`:nth-of-type(${t})`:""}function Hs(e){let t=1,n=e.previousElementSibling;for(;n;)n.tagName===e.tagName&&(t+=1),n=n.previousElementSibling;return t}function Vs(e){let t=e.previousElementSibling;for(;t;){if(t.tagName===e.tagName)return!0;t=t.previousElementSibling}for(t=e.nextElementSibling;t;){if(t.tagName===e.tagName)return!0;t=t.nextElementSibling}return!1}function Qe(e){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):Us(e)}function Us(e){let t="";for(let n=0;n<e.length;n+=1){let r=e.charAt(n),o=e.charCodeAt(n),i=n===0,a=n===1,s=e.charCodeAt(0);if(o===0){t+="\uFFFD";continue}if(o>=1&&o<=31||o===127||i&&o>=48&&o<=57||a&&o>=48&&o<=57&&s===45){t+=`\\${o.toString(16)} `;continue}if(i&&o===45&&e.length===1){t+="\\-";continue}if(o>=128||o===45||o===95||o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122){t+=r;continue}t+=`\\${r}`}return t}function Gr(e,t){let n=re(),r=n&&Er(),o=t?.allowSkip!==!1,i="";return r?i=Je(p().viewportRedactionWarning):Re()>0&&(i=Je(p().redactionReviewNote)),new Promise(a=>{let s=n?`<p style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-bg-secondary, #f5f5f5); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${r?x(p().pageTooComplexViewportNote):x(p().pageTooComplexElementNote)}</p>`:"",l="";n?r&&(l=`<button class="bd-btn bd-btn-primary" data-action="viewport">${x(p().captureViewport)}</button>`):l=`<button class="bd-btn bd-btn-primary" data-action="capture">${x(p().fullPage)}</button>`;let c=U(e,p().captureScreenshotTitle,`
        <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${x(p().chooseWhatToCapture)}</p>
        ${s}
        ${i}
        <div class="bd-actions bd-screenshot-actions">
          ${l}
          ${n?"":`<button class="bd-btn bd-btn-secondary" data-action="area">${x(p().selectArea)}</button>`}
          <button class="bd-btn bd-btn-secondary" data-action="element">${x(p().selectElement)}</button>
          ${o?`<button class="bd-btn bd-btn-quiet" data-action="skip">${x(p().skipScreenshot)}</button>`:""}
        </div>
      `),d=c.querySelector(".bd-close"),u=c.querySelector('[data-action="skip"]'),b=c.querySelector('[data-action="element"]'),m=c.querySelector('[data-action="area"]'),f=c.querySelector('[data-action="capture"]'),h=c.querySelector('[data-action="viewport"]');d?.addEventListener("click",()=>{c.remove(),a({kind:"cancel"})}),u?.addEventListener("click",()=>{c.remove(),a({kind:"skip"})}),b?.addEventListener("click",()=>{c.remove(),a({kind:"element"})}),m?.addEventListener("click",()=>{c.remove(),a({kind:"area"})}),f?.addEventListener("click",()=>{c.remove(),a({kind:"capture"})}),h?.addEventListener("click",()=>{c.remove();let S=pn();S.catch(()=>{}),a({kind:"viewport",capture:S})})})}function Xr(e,t,n,r){return new Promise((o,i)=>{let a=!1,s=()=>{n.removeEventListener("abort",l)},l=()=>{a||(a=!0,qs(e),s(),o(r))};n.addEventListener("abort",l,{once:!0}),n.aborted&&l(),t.then(c=>{s(),a||o(c)},c=>{s(),a||i(c)})})}function qs(e){let t=Array.from(e.querySelectorAll(".bd-overlay"));for(let n of t)n.querySelector(".bd-close")?.click(),n.remove();document.querySelector("#bugdrop-element-picker-cancel")?.click(),document.querySelector("#bugdrop-area-picker-cancel")?.click()}function oe(){return{screenshot:null,...fn(),returnToForm:!1}}function fn(){return{elementSelector:null,fullElementSelector:null}}function gn(e){return e==="explicit-skip"||e==="capture-failure-skip"}function Kr(e){throw new Error(`Unhandled screenshot choice: ${JSON.stringify(e)}`)}function hn(e){return{accentColor:e.accentColor,font:e.font,radius:e.radius,borderWidth:e.borderWidth,bgColor:e.bgColor,textColor:e.textColor,borderColor:e.borderColor,theme:e.theme}}function Yr(e){let t=/^data:[^;,]+;base64,([A-Za-z0-9+/]*={0,2})$/.exec(e);if(!t)return null;let n=t[1],r=n.endsWith("==")?2:n.endsWith("=")?1:0;return Math.floor(n.length*3/4)-r}async function yn(e,t=5242880){try{return await Ws(e,t)}catch(n){return console.warn("[BugDrop] Unable to resize oversized screenshot; submitting original.",n),e}}async function Ws(e,t){let n=Yr(e);if(n===null||n<=t)return e;let r=await js(e),o=r.naturalWidth||r.width,i=r.naturalHeight||r.height,a=Math.floor(t*.9);for(let s=0;s<8;s+=1){let l=Math.min(.9,Math.sqrt(a/n));o=Math.max(1,Math.floor(o*l)),i=Math.max(1,Math.floor(i*l));let c=document.createElement("canvas");c.width=o,c.height=i;let d=c.getContext("2d");if(!d)throw new Error("Failed to get canvas context for screenshot resize");d.drawImage(r,0,0,o,i);let u=c.toDataURL("image/png"),b=Yr(u);if(b===null)throw new Error("Failed to encode resized screenshot");if(b<=t)return u;n=b}throw new Error("Screenshot remains too large after resizing")}function js(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Error("Failed to load screenshot for resizing")),r.src=e})}async function Lt(e,t,n,r,o){if(o?.aborted)return{...oe(),returnToForm:!0};let i=Xs(e,t,n,r,o);return o?Xr(e,i,o,{...oe(),returnToForm:!0}):i}async function Xs(e,t,n,r,o){if(t.screenshotMode==="auto")return Ks(e,t,o);if(!n)return oe();let i=t.screenshotMode==="required";for(;;){let a=await Ys(e,t,i,o);if(o?.aborted)return{...oe(),returnToForm:!0};if(a.kind==="returnToForm")return{...oe(),returnToForm:!0};if(a.kind==="chooseAgain")continue;if(a.kind==="empty"){if(!i&&gn(a.reason)&&r(),i)continue;return{screenshot:null,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}let s=await Or(e,a.screenshot,a.redactionCount,{redactionUnavailable:a.redactionUnavailable,...a.redactionLimitations?{redactionLimitations:!0}:{},...a.elementSelector?{selectedElementCapture:!0}:{}});if(o?.aborted)return{...oe(),returnToForm:!0};if(s!=="retake")return s==="cancel"?{...oe(),returnToForm:!0}:{screenshot:await yn(s,t.maxScreenshotSizeBytes),elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}}async function Ks(e,t,n){if(re())return oe();let r=await kt(e,void 0,t.screenshotScale,{allowChooseAgain:!1,signal:n});return r.kind==="cancelled"?{...oe(),returnToForm:!0}:{screenshot:r.kind==="ok"?await yn(r.dataUrl,t.maxScreenshotSizeBytes):null,elementSelector:null,fullElementSelector:null,returnToForm:!1}}async function Ys(e,t,n,r){let o=await Gr(e,{allowSkip:!n});switch(o.kind){case"cancel":return{kind:"returnToForm"};case"skip":return ge("explicit-skip");case"viewport":return Zs(e,o,n,r);case"capture":return Js(e,t,n,r);case"element":return Qs(e,t,n,r);case"area":return el(e,t,n,r);default:return Kr(o)}}async function Zs(e,t,n,r){let o=await Tt(e,t.capture,{allowSkip:!n,showLoading:!1,signal:r});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?ge("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:0,redactionUnavailable:!0,redactionLimitations:!1}}async function Js(e,t,n,r){let o=await kt(e,void 0,t.screenshotScale,{allowSkip:!n,signal:r});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?ge("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:o.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:o.redaction?.hasLimitations??!1}}async function Qs(e,t,n,r){let o=await Ar(hn(t),r);if(!o)return ge("selection-cancelled");let i={elementSelector:Ur(o),fullElementSelector:qr(o)},a=Hr(o,{maxViewportAreaMultiplier:t.elementContextMaxArea}),s=await kt(e,a,t.screenshotScale,{allowSkip:!n,captureOptions:{highlightElement:o,highlightStyle:{accentColor:t.accentColor,radius:t.radius,borderWidth:t.borderWidth},pixelRatio:1},signal:r});return s.kind==="cancelled"?{kind:"returnToForm"}:s.kind==="choose-again"?{kind:"chooseAgain"}:s.kind==="skipped"?ge("capture-failure-skip",i):{kind:"captured",screenshot:s.dataUrl,...i,redactionCount:s.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:s.redaction?.hasLimitations??!1}}async function el(e,t,n,r){let o=await Mr(hn(t),{redactionsAvailable:Re()>0},r);if(!o)return ge("selection-cancelled");let i=await Br(e,o,t.screenshotScale,{allowSkip:!n,signal:r});return i.kind==="cancelled"?{kind:"returnToForm"}:i.kind==="choose-again"?{kind:"chooseAgain"}:i.kind==="skipped"?ge("capture-failure-skip"):{kind:"captured",screenshot:i.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:i.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:i.redaction?.hasLimitations??!1}}function ge(e,t=fn()){return{kind:"empty",reason:e,...t}}function Zr(e,t=window){if(!e)return;let n=t[e];if(typeof n!="function"){console.warn(`[BugDrop] data-auth-token-provider "${e}" must reference a function.`);return}return n}async function he(e){if(!e)return{};let t=await e();return t?{Authorization:t.startsWith("Bearer ")?t:`Bearer ${t}`}:{}}var Ft=String.raw`(?:"|')?\b(?:password|passwd|pwd|token|api[_-]?key|secret|authorization|auth|cookie)\b(?:"|')?`,tl=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[\s\S]|(?!\2)[^\\])*?\2`,"gi"),nl=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[^\r\n]|(?!\2)[^\\\r\n])*(?=\r?\n|$)`,"gi"),rl=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(?:\[[^\]\r\n]*\]|\{[^\}\r\n]*\})`,"gi"),ol=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(?!Bearer\b)[^"',\s}&]+`,"gi"),il=/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,al=/\b[A-Za-z0-9+/_=-]{32,}\b/g;function Jr(e){return e.replace(il,"Bearer [redacted]").replace(rl,"$1[redacted]").replace(tl,"$1$2[redacted]$2").replace(nl,"$1$2[redacted]").replace(ol,"$1[redacted]").replace(al,"[redacted]")}var sl=50,ll=1e3,Pt=[],Qr=!1;function eo(){Qr||typeof window>"u"||typeof console>"u"||(Qr=!0,At("log"),At("info"),At("warn"),At("error"),window.addEventListener("error",e=>{wn({level:"error",message:e.message||"Unhandled error",timestamp:new Date().toISOString(),sourceUrl:e.filename||void 0,lineNumber:e.lineno||void 0,columnNumber:e.colno||void 0})}),window.addEventListener("unhandledrejection",e=>{wn({level:"error",message:`Unhandled promise rejection: ${to(e.reason)}`,timestamp:new Date().toISOString()})}))}function Mt(){return Pt.map(e=>({...e}))}function At(e){let t=console[e];typeof t=="function"&&(console[e]=(...n)=>{wn({level:e,message:n.map(to).join(" "),timestamp:new Date().toISOString(),...cl()}),t.apply(console,n)})}function wn(e){for(Pt.push({...e,message:Jr(e.message).slice(0,ll)});Pt.length>sl;)Pt.shift()}function to(e){if(e instanceof Error)return e.stack||e.message;if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}function cl(){let e=new Error().stack;if(!e)return{};for(let t of e.split(`
`).slice(2)){if(t.includes("console-logs"))continue;let n=t.match(/\(?((?:https?:|file:|\/)[^():]+):(\d+):(\d+)\)?$/);if(n)return{sourceUrl:n[1],lineNumber:Number(n[2]),columnNumber:Number(n[3])}}return{}}var Dt=new Set,no=!1,vn=!1;function de(e){Dt.add(e),no||dl();let t=!1;return()=>{t||(t=!0,Dt.delete(e))}}function dl(){no=!0;let e=n=>{Rt(n)&&n.preventDefault()},t=n=>{if(!vn&&ul(n)){if(n.type==="focusin"){n.stopImmediatePropagation();return}if(n.type==="focusout"){vn=!0;try{pl(n)}finally{vn=!1}n.stopImmediatePropagation();return}n.stopImmediatePropagation()}};for(let n of["dismissableLayer.pointerDownOutside","dismissableLayer.interactOutside"])document.addEventListener(n,e,!0);window.addEventListener("focusin",t,!0),window.addEventListener("focusout",t,!0)}function Rt(e){let t=e.detail?.originalEvent,n=typeof t?.composedPath=="function"?t.composedPath():typeof e.composedPath=="function"?e.composedPath():[];return Array.from(Dt).some(r=>n.includes(r)||(t?.target??e.target)===r)}function ul(e){if(!(e instanceof FocusEvent)||e.type==="focusin")return Rt(e);if(e.type!=="focusout")return!1;let t=e.relatedTarget;return Array.from(Dt).some(r=>t===r||t instanceof Node&&(r.shadowRoot?.contains(t)??!1))&&!Rt(e)}function pl(e){let t=typeof e.composedPath=="function"?e.composedPath():[];for(let n of t)if(n instanceof HTMLElement&&(n.dispatchEvent(new FocusEvent("focusout",{bubbles:!1,composed:!1,relatedTarget:e instanceof FocusEvent?e.relatedTarget:null})),n===document.body))break}var zt;function Ie(){zt?.close()}function It(e){return zt=e,()=>{zt===e&&(zt=void 0)}}var ml="bugdrop-variant@1";function ro(e){let t=Object.freeze({kind:"variant",config:e}),n=Object.freeze([t]);return Object.freeze({id:ml,variantId:e.id,screens:n})}var se=class extends TypeError{constructor(n,r){super(r);this.fieldId=n;this.name="VariantAnswerError"}fieldId};function ye(e,t){if(!fl(t))throw new se(null,"BugDrop variant answers must be an object");let n=new Set(e.map(o=>o.id)),r=Object.keys(t).find(o=>!n.has(o));if(r)throw new se(null,`Unknown BugDrop variant answer: ${r}`)}function $e(e,t){return ye(e,t),Object.fromEntries(e.map(n=>[n.id,bl(n,t[n.id])]))}function bl(e,t){if(e.type==="shortText"||e.type==="longText"){if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(typeof t!="string")throw ue(e,`Answer ${e.id} must be text`);let n=t.trim();if(e.required&&!n)throw ue(e,`Answer ${e.id} is required`);let r=e.minLength??0,o=e.maxLength??(e.type==="shortText"?500:5e3);if(n.length<r||n.length>o)throw ue(e,`Answer ${e.id} must be ${r}-${o} characters`);return n}if(e.type==="rating"){let n=e.scale??5;if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(!Number.isInteger(t)||t<1||t>n)throw ue(e,`Answer ${e.id} must be a rating from 1-${n}`);return t}if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(typeof t!="string"||!e.options.some(n=>n.value===t))throw ue(e,`Answer ${e.id} must be a configured choice`);return t}function ue(e,t){return new se(e.id,t)}function fl(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function pe(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=`${r}-label`,i=`${r}-help`,a=`${r}-error`,s=document.createElement("label");if(s.className="bdv-label",s.id=o,s.htmlFor=r,s.textContent=e.label,e.required){let d=document.createElement("span");d.className="bdv-required",d.textContent=" *",d.setAttribute("aria-hidden","true"),s.appendChild(d)}n.appendChild(s);let l=[];if(e.helpText){let d=document.createElement("div");d.className="bdv-help",d.id=i,d.textContent=e.helpText,n.appendChild(d),l.push(i)}let c=document.createElement("div");return c.className="bdv-error",c.id=a,c.hidden=!0,c.setAttribute("aria-live","polite"),n.appendChild(c),l.push(a),{wrapper:n,label:s,controlId:r,labelId:o,describedBy:l.join(" ")||null,setError(d,u){c.textContent=u??"",c.hidden=!u,u?d.setAttribute("aria-invalid","true"):d.removeAttribute("aria-invalid")}}}function $t(e,t,n){e.id=n.controlId,e.className="bdv-input",e.required=t.required??!1,e.setAttribute("aria-required",String(t.required??!1)),n.describedBy&&e.setAttribute("aria-describedby",n.describedBy),t.placeholder&&(e.placeholder=t.placeholder),e.minLength=t.minLength??0,e.maxLength=t.maxLength??(t.type==="shortText"?500:5e3),n.wrapper.insertBefore(e,n.wrapper.querySelector(".bdv-error"))}function oo(e,t){let n=pe(e,t),r=document.createElement("textarea");return r.rows=e.rows??4,$t(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function io(e,t){let n=pe(e,t),r=e.scale??5,o=document.createElement("div");o.id=n.controlId,o.className="bdv-rating",o.setAttribute("role","radiogroup"),o.setAttribute("aria-labelledby",n.labelId),o.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&o.setAttribute("aria-describedby",n.describedBy);let i=[],a=null,s=null,l=()=>{for(let[m,f]of i.entries()){let h=m+1,S=s===null&&a!==null&&h<=a,T=s!==null&&h<=s;f.classList.toggle("bdv-rating-option--active",S),f.classList.toggle("bdv-rating-option--preview",T),f.setAttribute("aria-checked",String(h===a)),f.tabIndex=h===(a??1)?0:-1}},c=(m,f=!1)=>{a=m,s=null,l(),f&&i[m-1]?.focus()},d=[],u=()=>{s!==null&&(s=null,l())},b=m=>{let f=m.target;f instanceof HTMLButtonElement&&i.includes(f)&&!f.disabled||u()};for(let m=1;m<=r;m+=1){let f=document.createElement("button");f.type="button",f.className="bdv-rating-option",f.setAttribute("role","radio"),f.setAttribute("aria-label",`${m} ${m===1?"star":"stars"}`),f.textContent=e.icon==="number"?String(m):"\u2605";let h=()=>c(m),S=()=>{f.disabled||(s=m,l())},T=F=>{let P=null;F.key==="ArrowRight"||F.key==="ArrowDown"?P=m===r?1:m+1:F.key==="ArrowLeft"||F.key==="ArrowUp"?P=m===1?r:m-1:F.key==="Home"?P=1:F.key==="End"?P=r:(F.key==="Enter"||F.key===" ")&&(P=m),P!==null&&(F.preventDefault(),c(P,!0))};f.addEventListener("click",h),f.addEventListener("keydown",T),f.addEventListener("pointerenter",S),d.push({button:f,click:h,keydown:T,pointerenter:S}),i.push(f),o.appendChild(f)}if(o.addEventListener("pointermove",b),o.addEventListener("pointerleave",u),n.wrapper.insertBefore(o,n.wrapper.querySelector(".bdv-error")),e.lowLabel||e.highLabel){let m=document.createElement("div");m.className="bdv-rating-labels";let f=document.createElement("span");f.textContent=e.lowLabel??"";let h=document.createElement("span");h.textContent=e.highLabel??"",m.append(f,h),n.wrapper.insertBefore(m,n.wrapper.querySelector(".bdv-error"))}return l(),{field:e,element:n.wrapper,getValue:()=>a??"",setValue(m){a=Number.isInteger(m)&&m>=1&&m<=r?m:null,s=null,l()},setError:m=>n.setError(o,m),setDisabled(m){for(let f of i)f.disabled=m;m&&u()},focus(){i[(a??1)-1]?.focus()},dispose(){u(),o.removeEventListener("pointermove",b),o.removeEventListener("pointerleave",u);for(let m of d)m.button.removeEventListener("click",m.click),m.button.removeEventListener("keydown",m.keydown),m.button.removeEventListener("pointerenter",m.pointerenter)}}}function ao(e,t){let n=pe(e,t),r=document.createElement("input");return r.type="text",$t(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function so(e,t){let n=pe(e,t),r=document.createElement("div");r.className=`choice ${e.display??""}`,r.setAttribute("role","radiogroup"),r.setAttribute("aria-labelledby",n.labelId),r.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&r.setAttribute("aria-describedby",n.describedBy);let o=e.options.map(a=>{let s=document.createElement("label"),l=document.createElement("input");if(l.type="radio",l.name=n.controlId,l.value=a.value,s.append(l,a.label),a.description){let c=document.createElement("span");c.className="bdv-help",c.textContent=a.description,s.appendChild(c)}return r.appendChild(s),l});n.wrapper.insertBefore(r,n.wrapper.querySelector(".bdv-error"));let i=()=>r.querySelector(":checked");return{field:e,element:n.wrapper,getValue:()=>i()?.value??"",setValue(a){for(let s of o)s.checked=s.value===a},setError:a=>n.setError(r,a),setDisabled(a){for(let s of o)s.disabled=a},focus(){(i()??o[0])?.focus()},dispose(){}}}function Ot(e,t){return e.type==="shortText"?ao(e,t):e.type==="longText"?oo(e,t):e.type==="rating"?io(e,t):so(e,t)}function Bt(e){let{config:t,instanceId:n}=e,r={...e.context??{}},o={...e.initialAnswers??{}};ye(t.fields,o);let i=document.createElement("section");i.className="bdv-surface";let a=`${n}-title`;i.setAttribute("aria-labelledby",a);let s=document.createElement("div");s.className="bdv-header";let l=document.createElement("h2");if(l.className="bdv-title",l.id=a,l.textContent=t.content.title,s.appendChild(l),t.content.description){let C=document.createElement("p");C.className="bdv-description",C.textContent=t.content.description,s.appendChild(C)}i.appendChild(s);let c=document.createElement("form");c.className="bdv-form",c.noValidate=!0;let d=document.createElement("div");d.className="bdv-fields";let u=t.fields.map(C=>Ot(C,n));for(let C of u)d.appendChild(C.element);c.appendChild(d);let b=document.createElement("div");b.className="bdv-actions";let m=document.createElement("button");m.type="submit",m.className="bdv-submit",m.textContent=t.content.submitLabel??"Submit",b.appendChild(m);let f;e.cancel&&(f=document.createElement("button"),f.type="button",f.className="bdv-cancel",f.textContent=e.cancel.label,f.addEventListener("click",e.cancel.onCancel),b.appendChild(f)),c.appendChild(b);let h=document.createElement("p");h.className="bdv-status",h.setAttribute("role","status"),h.setAttribute("aria-live","polite"),c.appendChild(h),i.appendChild(c);let{success:S,successLink:T}=gl(t);i.appendChild(S);let F=ee("submission"),P=!1,L=!1,D=C=>{P=C,c.setAttribute("aria-busy",String(C)),m.disabled=C,f&&(f.disabled=C);for(let N of u)N.setDisabled(C)},v=()=>{h.textContent="",h.removeAttribute("data-kind");for(let C of u)C.setError(null)},A=()=>{for(let C of u)C.setValue(o[C.field.id]??"")},I=()=>Object.fromEntries(u.map(C=>[C.field.id,C.getValue()])),z=async C=>{if(C.preventDefault(),P||L)return;v();let N;try{N=$e(t.fields,I())}catch(w){if(w instanceof se&&w.fieldId){let g=u.find(M=>M.field.id===w.fieldId);g?.setError(hl(w)),g?.focus()}else h.textContent=w instanceof Error?w.message:"Please check your response.",h.dataset.kind="error";return}D(!0),h.textContent="Submitting\u2026";try{let w=await e.submit(N,{context:r,submissionId:F});if(L)return;D(!1),T.hidden=!w.isPublic,w.isPublic&&(T.href=w.issueUrl),c.hidden=!0,S.hidden=!1,S.focus(),e.onSubmitted?.(w)}catch(w){if(L)return;h.textContent=w instanceof Error?w.message:"Failed to submit feedback.",h.dataset.kind="error",D(!1)}},$=C=>{C.key==="Enter"&&C.target instanceof HTMLInputElement&&C.target.type!=="submit"&&C.preventDefault()};return c.addEventListener("submit",z),c.addEventListener("keydown",$),A(),{element:i,reset(){P||L||(F=ee("submission"),v(),A(),S.hidden=!0,T.removeAttribute("href"),c.hidden=!1)},dispose(){if(!L){L=!0,c.removeEventListener("submit",z),c.removeEventListener("keydown",$),f&&e.cancel&&f.removeEventListener("click",e.cancel.onCancel);for(let C of u)C.dispose()}}}}function ee(e){if(typeof globalThis.crypto?.randomUUID=="function")return`${e}-${globalThis.crypto.randomUUID()}`;if(typeof globalThis.crypto?.getRandomValues!="function")throw new Error("BugDrop rendered variants require a cryptographically secure random generator");let t=globalThis.crypto.getRandomValues(new Uint8Array(16));return`${e}-${Array.from(t,n=>n.toString(16).padStart(2,"0")).join("")}`}function gl(e){let t=document.createElement("div");t.className="bdv-success",t.hidden=!0,t.tabIndex=-1;let n=document.createElement("h3");n.className="bdv-success-title",n.textContent=e.content.successTitle??"Thanks for your feedback!";let r=document.createElement("p");r.className="bdv-success-message",r.textContent=e.content.successMessage??"Your response was submitted.";let o=document.createElement("a");return o.className="bdv-success-link",o.textContent="View GitHub Issue",o.target="_blank",o.rel="noopener noreferrer",t.append(n,r,o),{success:t,successLink:o}}function hl(e){if(!e.fieldId)return e.message;let t=`Answer ${e.fieldId} `,n=e.message.startsWith(t)?e.message.slice(t.length):e.message;return n.charAt(0).toUpperCase()+n.slice(1)}function Oe(e,t,n){let r=document.createElement("style");r.textContent=yl,e.appendChild(r);let o=document.createElement("div");o.className="bdv-root",o.dataset.presentation=n,t.presentation.kind==="modal"&&(o.dataset.size=t.presentation.size??"default"),o.dataset.density=t.appearance?.density??"comfortable",o.dataset.columns=String(t.presentation.columns??1);let i=H(t.appearance?.accentColor);i&&o.style.setProperty("--bdv-accent",i),e.appendChild(o);let a=t.appearance?.theme??"auto",s=c=>{o.classList.toggle("bdv-dark",c==="dark")};s(De(a));let l=a==="auto"?St(s):()=>{};return{root:o,dispose(){l(),r.remove(),o.remove()}}}var yl=`
  :host {
    --bdv-accent: #2563eb;
    display: block;
    color-scheme: light;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .bdv-root {
    --bdv-bg: #fff;
    --bdv-bg-muted: #f8fafc;
    --bdv-text: #0f172a;
    --bdv-text-muted: #64748b;
    --bdv-border: #cbd5e1;
    --bdv-danger: #b91c1c;
    --bdv-success: #047857;
    color: var(--bdv-text);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.5;
  }

  .bdv-root.bdv-dark {
    --bdv-bg: #0f172a;
    --bdv-bg-muted: #1e293b;
    --bdv-text: #f8fafc;
    --bdv-text-muted: #94a3b8;
    --bdv-border: #475569;
    --bdv-danger: #fca5a5;
    --bdv-success: #6ee7b7;
    color-scheme: dark;
  }

  .bdv-surface {
    position: relative;
    width: 100%;
    border: 1px solid var(--bdv-border);
    border-radius: 14px;
    background: var(--bdv-bg);
    color: var(--bdv-text);
    padding: 24px;
    box-shadow: 0 8px 28px #0f172a1a;
  }

  .bdv-root[data-density="compact"] .bdv-surface { padding: 16px; }
  .bdv-header { margin-bottom: 20px; }
  .bdv-title { margin: 0; font-size: 1.25rem; line-height: 1.3; }
  .bdv-description { margin: 8px 0 0; color: var(--bdv-text-muted); }

  .bdv-fields {
    display: grid;
    grid-template-columns: repeat(var(--bdv-columns, 1), minmax(0, 1fr));
    gap: 18px;
  }
  .bdv-root[data-columns="2"] .bdv-fields { --bdv-columns: 2; }
  .bdv-field[data-span="2"] { grid-column: span 2; }
  .bdv-field { min-width: 0; }
  .bdv-label { display: block; margin-bottom: 6px; font-weight: 650; }
  .bdv-required { color: var(--bdv-danger); }
  .bdv-help { margin: -2px 0 7px; color: var(--bdv-text-muted); font-size: .875rem; }
  .bdv-error { margin-top: 6px; color: var(--bdv-danger); font-size: .875rem; }

  .bdv-input {
    width: 100%;
    min-height: 44px;
    border: 1px solid var(--bdv-border);
    border-radius: 9px;
    background: var(--bdv-bg);
    color: var(--bdv-text);
    padding: 10px 12px;
    font: inherit;
  }
  textarea.bdv-input { min-height: 108px; resize: vertical; }
  .bdv-input:focus-visible,
  .bdv-rating-option:focus-visible,
  .choice > label:has(:focus-visible),
  .bdv-submit:focus-visible,
  .bdv-cancel:focus-visible,
  .bdv-close:focus-visible,
  .bdv-success-link:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--bdv-accent) 35%, transparent);
    outline-offset: 2px;
  }
  [aria-invalid="true"] { border-color: var(--bdv-danger); }

  .bdv-rating { display: flex; flex-wrap: wrap; gap: 6px; }
  .bdv-rating-option {
    width: 44px;
    height: 44px;
    border: 1px solid var(--bdv-border);
    border-radius: 9px;
    background: var(--bdv-bg-muted);
    color: var(--bdv-text-muted);
    cursor: pointer;
    font: inherit;
    font-size: 1.4rem;
    line-height: 1;
  }
  .bdv-rating-option--active {
    color: var(--bdv-accent);
    border-color: var(--bdv-accent);
    background: color-mix(in srgb, var(--bdv-accent) 18%, var(--bdv-bg-muted));
  }
  .bdv-rating-option--preview {
    color: color-mix(in srgb, var(--bdv-accent) 70%, var(--bdv-text-muted));
    border-color: color-mix(in srgb, var(--bdv-accent) 55%, var(--bdv-border));
    background: color-mix(in srgb, var(--bdv-accent) 8%, var(--bdv-bg-muted));
  }
  .bdv-rating-option:disabled { cursor: wait; opacity: .65; }
  .bdv-rating-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    color: var(--bdv-text-muted);
    font-size: .8rem;
  }

  .choice { display: grid; gap: 8px; }
  .choice > label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    min-height: 44px;
    align-items: center;
    gap: 0 10px;
    border: 1px solid transparent;
    border-radius: 9px;
    cursor: pointer;
    padding: 9px 10px;
    font-weight: 650;
  }
  .choice > label:has(:checked) { border-color: var(--bdv-accent); }
  .cards > *, .buttons > * { background: var(--bdv-bg-muted); border-color: var(--bdv-border); }
  .buttons { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
  .choice input { grid-row: span 2; width: 20px; height: 20px; accent-color: var(--bdv-accent); }
  .choice .bdv-help { margin: 0; font-weight: 400; }
  .choice :disabled ~ * { opacity: .65; }

  .bdv-actions { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
  .bdv-submit {
    min-height: 44px;
    border: 0;
    border-radius: 9px;
    background: var(--bdv-accent);
    color: #fff;
    cursor: pointer;
    padding: 10px 18px;
    font: inherit;
    font-weight: 700;
  }
  .bdv-cancel {
    min-height: 44px;
    border: 1px solid var(--bdv-border);
    border-radius: 9px;
    background: var(--bdv-bg);
    color: var(--bdv-text);
    cursor: pointer;
    padding: 10px 18px;
    font: inherit;
    font-weight: 650;
  }
  .bdv-cancel:disabled { cursor: wait; opacity: .65; }
  .bdv-overlay {
    display: grid;
    height: 100%;
    min-height: 0;
    align-items: safe center;
    justify-items: center;
    overflow: auto;
    padding: max(20px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
      max(20px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
    background: #0f172a8f;
  }
  .bdv-root[data-presentation="modal"] { height: 100%; }
  .bdv-root[data-presentation="modal"] .bdv-surface { max-width: 560px; }
  .bdv-root[data-size="compact"] .bdv-surface { max-width: 440px; }
  .bdv-root[data-size="wide"] .bdv-surface { max-width: 760px; }
  .bdv-close {
    position: absolute;
    top: 10px;
    right: 10px;
    display: grid;
    width: 44px;
    height: 44px;
    place-items: center;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--bdv-text-muted);
    cursor: pointer;
    font: inherit;
    font-size: 1.6rem;
    line-height: 1;
  }
  .bdv-close:hover { background: var(--bdv-bg-muted); color: var(--bdv-text); }
  .bdv-root[data-presentation="modal"] .bdv-header { padding-right: 36px; }
  .bdv-submit:disabled { cursor: wait; opacity: .65; }
  .bdv-status { min-height: 1.5em; margin: 12px 0 0; color: var(--bdv-text-muted); }
  .bdv-status[data-kind="error"] { color: var(--bdv-danger); }
  .bdv-success { outline: none; }
  .bdv-success-title { margin: 0; color: var(--bdv-success); font-size: 1.2rem; }
  .bdv-success-message { margin: 8px 0 0; color: var(--bdv-text-muted); }
  .bdv-success-link { display: inline-block; margin-top: 14px; color: var(--bdv-accent); }

  @media (max-width: 640px) {
    .bdv-root[data-columns="2"] .bdv-fields { --bdv-columns: 1; }
    .bdv-field[data-span="2"] { grid-column: span 1; }
    .bdv-surface { padding: 18px; }
    .bdv-root[data-presentation="modal"] .bdv-surface { max-width: none; }
  }
`;function lo(e){if(!(e.target instanceof HTMLElement))throw new TypeError("BugDrop inline variant target must be an HTMLElement");if(e.config.presentation.kind!=="inline")throw new TypeError("BugDrop mount() requires an inline variant");ye(e.config.fields,e.options?.initialAnswers??{});let t=ee(e.config.id),n=document.createElement("div");n.dataset.bugdropOwned="",n.dataset.bugdropInstance=t;let r=n.attachShadow({mode:"open"}),o=de(n),i=Oe(r,e.config,"inline"),a=Bt({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit});i.root.appendChild(a.element),e.target.appendChild(n);let s=!1;return Object.freeze({instanceId:t,reset(){s||a.reset()},unmount(){s||(s=!0,a.dispose(),o(),i.dispose(),n.remove())}})}function uo(e){if(e.config.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");ye(e.config.fields,e.options?.initialAnswers??{}),Ie();let t=ee(e.config.id),n=document.activeElement instanceof HTMLElement?document.activeElement:null,r=document.body.style.getPropertyValue("overflow"),o=document.body.style.getPropertyPriority("overflow"),i=document.createElement("div");i.dataset.bugdropOwned="",i.dataset.bugdropInstance=t,Object.assign(i.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let a=i.attachShadow({mode:"open"}),s=Oe(a,e.config,"modal"),l=document.createElement("div");l.className="bdv-overlay",s.root.appendChild(l);let c,d=new Promise(v=>{c=v}),u=!1,b=!1,m=()=>{},f=v=>{u||(u=!0,c(v))},h=()=>{b||(b=!0,f({status:"closed"}),m(),a.removeEventListener("keydown",F),l.removeEventListener("pointerdown",P),S.dispose(),L(),s.dispose(),i.remove(),wl(r,o),n?.isConnected&&n.focus())},S=Bt({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit,cancel:{label:e.config.content.cancelLabel??"Cancel",onCancel:h},onSubmitted:v=>f({status:"submitted",result:v})});S.element.setAttribute("role","dialog"),S.element.setAttribute("aria-modal","true"),S.element.dataset.size=e.config.presentation.size??"default";let T=document.createElement("button");T.type="button",T.className="bdv-close",T.setAttribute("aria-label","Close"),T.textContent="\xD7",T.addEventListener("click",h,{once:!0}),S.element.prepend(T),l.appendChild(S.element);function F(v){if(!(v instanceof KeyboardEvent))return;if(v.key==="Escape"){v.preventDefault(),h();return}if(v.key!=="Tab")return;let A=co(S.element);if(A.length===0){v.preventDefault(),S.element.focus();return}let I=a.activeElement,z=A[0],$=A.at(-1);v.shiftKey&&(I===z||!S.element.contains(I))?(v.preventDefault(),$.focus()):!v.shiftKey&&I===$&&(v.preventDefault(),z.focus())}function P(v){v.target===l&&h()}document.body.style.setProperty("overflow","hidden"),document.body.appendChild(i);let L=de(i);a.addEventListener("keydown",F),l.addEventListener("pointerdown",P);let D=Object.freeze({instanceId:t,result:d,close:h});return m=It(D),queueMicrotask(()=>{if(b)return;(S.element.querySelector('textarea:not(:disabled), input:not(:disabled), [role="radio"][tabindex="0"]')??co(S.element)[0]??S.element).focus()}),D}function po(e){return Object.freeze({instanceId:ee(e),result:Promise.resolve({status:"busy"}),close(){}})}function co(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&t.getAttribute("aria-hidden")!=="true")}function wl(e,t){e?document.body.style.setProperty("overflow",e,t):document.body.style.removeProperty("overflow")}var _t=/^[a-z][a-z0-9_-]{0,63}$/,mo=/{{\s*([^{}]+?)\s*}}/g,vl=new Set(["bug","feature","question","feedback"]),xl=new Set(["shortText","longText","rating","singleChoice"]),El=new Set(["id","configVersion","presentation","appearance","content","fields","issue"]),Sl=new Set(["title","description","submitLabel","cancelLabel","successTitle","successMessage"]),kl=new Set(["theme","accentColor","density"]),Tl=new Set(["classification","title","sections"]),Nt=["id","type","label","helpText","required","layout"],Cl={shortText:new Set([...Nt,"placeholder","minLength","maxLength"]),longText:new Set([...Nt,"placeholder","rows","minLength","maxLength"]),rating:new Set([...Nt,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([...Nt,"options","display"])};function fo(e){if(!ie(e))throw new TypeError("BugDrop variant config must be an object");if(le(e,El,"variant config"),typeof e.id!="string"||!_t.test(e.id)||e.id==="legacy")throw new TypeError("BugDrop variant id must match [a-z][a-z0-9_-]{0,63} and cannot be legacy");if(e.configVersion!==void 0&&e.configVersion!==1)throw new TypeError("BugDrop variant configVersion must be 1");if(Ll(e.presentation),Fl(e.appearance),Al(e.content),!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)throw new TypeError("BugDrop variant fields must contain 1-20 entries");let t=new Map;for(let n of e.fields)Pl(n,t);return Il(e,t),go(xn(e))}function Ll(e){if(!ie(e)||e.kind!=="modal"&&e.kind!=="inline")throw new TypeError("BugDrop variant presentation must be modal or inline");if(le(e,e.kind==="modal"?new Set(["kind","size","columns"]):new Set(["kind","columns"]),"variant presentation"),e.columns!==void 0&&e.columns!==1&&e.columns!==2)throw new TypeError("BugDrop variant presentation columns must be 1 or 2");if(e.kind==="modal"&&e.size!==void 0&&!["compact","default","wide"].includes(e.size))throw new TypeError("BugDrop modal size must be compact, default, or wide")}function Fl(e){if(e!==void 0){if(!ie(e))throw new TypeError("BugDrop variant appearance must be an object");if(le(e,kl,"variant appearance"),e.theme!==void 0&&!["light","dark","auto"].includes(e.theme))throw new TypeError("BugDrop variant appearance theme is invalid");if(e.accentColor!==void 0&&(!X(e.accentColor,120)||Ol(e.accentColor)))throw new TypeError("BugDrop variant appearance accentColor is invalid");if(e.density!==void 0&&e.density!=="compact"&&e.density!=="comfortable")throw new TypeError("BugDrop variant appearance density is invalid")}}function Al(e){if(!ie(e))throw new TypeError("BugDrop variant content must be an object");if(le(e,Sl,"variant content"),!X(e.title,500))throw new TypeError("BugDrop variant content.title is required");et(e.description,"description",2e3),et(e.submitLabel,"submitLabel",120),et(e.cancelLabel,"cancelLabel",120),et(e.successTitle,"successTitle",500),et(e.successMessage,"successMessage",2e3)}function et(e,t,n){if(e!==void 0&&!X(e,n))throw new TypeError(`BugDrop variant content.${t} is invalid`)}function Pl(e,t){if(!ie(e)||!xl.has(e.type)||typeof e.id!="string"||!_t.test(e.id))throw new TypeError("BugDrop variant field has an invalid type or id");if(le(e,Cl[e.type],`field ${e.id}`),t.has(e.id))throw new TypeError(`Duplicate BugDrop variant field id: ${e.id}`);if(t.set(e.id,e),!X(e.label,500))throw new TypeError(`Field ${e.id} requires a label`);if(e.helpText!==void 0&&!X(e.helpText,1e3))throw new TypeError(`Field ${e.id} has invalid helpText`);if(e.required!==void 0&&typeof e.required!="boolean")throw new TypeError(`Field ${e.id} required must be boolean`);Ml(e),e.type==="shortText"||e.type==="longText"?Rl(e):e.type==="rating"?Dl(e):zl(e)}function Ml(e){if(e.layout!==void 0){if(!ie(e.layout))throw new TypeError(`Field ${e.id} layout must be an object`);if(le(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2)throw new TypeError(`Field ${e.id} layout span must be 1 or 2`)}}function Rl(e){if(e.placeholder!==void 0&&!X(e.placeholder,500))throw new TypeError(`Field ${e.id} has invalid placeholder`);let t=e.type==="shortText"?500:5e3;if(e.minLength!==void 0&&!tt(e.minLength,0,5e3)||e.maxLength!==void 0&&!tt(e.maxLength,1,5e3))throw new TypeError(`Field ${e.id} has invalid text bounds`);let n=e.minLength===void 0?0:e.minLength,r=e.maxLength===void 0?t:e.maxLength;if(!tt(n,0,5e3)||!tt(r,1,5e3)||n>r)throw new TypeError(`Field ${e.id} has invalid text bounds`);if(e.type==="longText"&&e.rows!==void 0&&!tt(e.rows,1,50))throw new TypeError(`Field ${e.id} rows must be an integer from 1-50`)}function Dl(e){if(e.scale!==void 0&&e.scale!==5&&e.scale!==10)throw new TypeError(`Field ${e.id} rating scale must be 5 or 10`);if(e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number")throw new TypeError(`Field ${e.id} rating icon must be star or number`);if(e.lowLabel!==void 0&&!X(e.lowLabel,500))throw new TypeError(`Field ${e.id} has invalid lowLabel`);if(e.highLabel!==void 0&&!X(e.highLabel,500))throw new TypeError(`Field ${e.id} has invalid highLabel`)}function zl(e){if(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)throw new TypeError(`Field ${e.id} requires 2-50 choices`);if(e.display!==void 0&&e.display!=="radio"&&e.display!=="cards"&&e.display!=="buttons")throw new TypeError(`Field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options){if(!ie(n))throw new TypeError(`Field ${e.id} has an invalid choice`);if(le(n,new Set(["value","label","description"]),`field ${e.id} choice`),!X(n.value,120)||!X(n.label,500))throw new TypeError(`Field ${e.id} has an invalid choice`);if(n.description!==void 0&&!X(n.description,1e3))throw new TypeError(`Field ${e.id} has an invalid choice description`);if(t.has(n.value))throw new TypeError(`Field ${e.id} has duplicate choices`);t.add(n.value)}}function Il(e,t){if(!ie(e.issue))throw new TypeError("BugDrop variant issue must be an object");if(le(e.issue,Tl,"variant issue"),!X(e.issue.title,2e3))throw new TypeError("BugDrop variant issue.title is required");if(e.issue.classification!==void 0&&!vl.has(e.issue.classification))throw new TypeError("BugDrop variant issue.classification is invalid");for(let o of e.issue.title.matchAll(mo)){let i=o[1];if(i.startsWith("context.")){if(!_t.test(i.slice(8)))throw bo()}else if(!t.has(i))throw new TypeError(`Unknown BugDrop variant title field: ${i}`)}if(e.issue.title.replace(mo,"").includes("{{"))throw bo();if(e.issue.sections!==void 0&&!Array.isArray(e.issue.sections))throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let n=e.issue.sections??[];if(n.length>20)throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let r=new Set;for(let o of n)$l(o,t,r)}function $l(e,t,n){if(!ie(e)||!X(e.heading,120))throw new TypeError("BugDrop variant Issue section requires a heading");let r="field"in e,o="context"in e;if(r===o)throw new TypeError("BugDrop variant Issue section must reference one field or context key");if(le(e,r?new Set(["heading","field","format","omitWhenEmpty"]):new Set(["heading","context","format","omitWhenEmpty"]),"variant Issue section"),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean")throw new TypeError("BugDrop variant Issue section omitWhenEmpty must be boolean");let i=e.heading.trim().toLowerCase();if(n.has(i))throw new TypeError(`Duplicate BugDrop Issue heading: ${e.heading}`);if(n.add(i),r){let a=t.get(e.field);if(!a)throw new TypeError(`Unknown Issue field: ${e.field}`);let s=e.format===void 0?"text":e.format;if(!["text","quote","stars","choice"].includes(s))throw new TypeError(`Invalid Issue field format: ${String(s)}`);if(s==="stars"&&a.type!=="rating")throw new TypeError("BugDrop stars format requires a rating field");if(s==="choice"&&a.type!=="singleChoice")throw new TypeError("BugDrop choice format requires a singleChoice field")}else{if(typeof e.context!="string"||!_t.test(e.context))throw new TypeError(`Invalid Issue context key: ${e.context}`);if(e.format!==void 0&&e.format!=="text"&&e.format!=="code")throw new TypeError(`Invalid Issue context format: ${String(e.format)}`)}}function bo(){return new TypeError("BugDrop variant title contains an invalid placeholder")}function le(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));if(r)throw new TypeError(`Unknown BugDrop ${n} property: ${r}`)}function X(e,t){return typeof e=="string"&&e.trim().length>0&&e.length<=t}function tt(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function Ol(e){return Array.from(e).some(t=>{let n=t.charCodeAt(0);return n<32||n===127})}function ie(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function xn(e){return Array.isArray(e)?e.map(t=>xn(t)):ie(e)?Object.fromEntries(Object.entries(e).map(([t,n])=>[t,xn(n)])):e}function go(e){if(e&&typeof e=="object"){Object.freeze(e);for(let t of Object.values(e))go(t)}return e}function ho(e,t,n={}){_l(n);let r=$e(e.fields,t),o=e.issue.title.replace(/{{\s*([^{}]+?)\s*}}/g,(a,s)=>{let l=s.startsWith("context.")?n[s.slice(8)]:r[s];return yo(e.fields,s,l,"text")}).replace(/\s+/g," ").trim().slice(0,256).trim();if(!o)throw new TypeError("BugDrop variant produced an empty Issue title");let i=(e.issue.sections??[]).flatMap(a=>{let s=Bl(a,e.fields,r,n);return!s.trim()&&a.omitWhenEmpty?[]:[{heading:a.heading.trim(),value:s.trim()?s:"Not provided.",format:Nl(a)}]});return{title:o,...e.issue.classification?{classification:e.issue.classification}:{},sections:i}}function Bl(e,t,n,r){return"context"in e?String(r[e.context]??""):yo(t,e.field,n[e.field],e.format??"text")}function yo(e,t,n,r){if(n==null||n==="")return"";let o=e.find(i=>i.id===t);if(r==="stars"&&o?.type==="rating"&&typeof n=="number"){let i=o.scale??5;return`${"\u2605".repeat(n)}${"\u2606".repeat(i-n)} (${n}/${i})`}return r==="choice"&&o?.type==="singleChoice"?o.options.find(i=>i.value===n)?.label??String(n):String(n)}function Nl(e){return e.format==="quote"||e.format==="code"?e.format:"text"}function _l(e){if(!Hl(e)||Object.keys(e).length>50)throw new TypeError("BugDrop variant context must contain at most 50 values");for(let[t,n]of Object.entries(e)){if(!/^[a-z][a-z0-9_-]{0,63}$/.test(t))throw new TypeError(`Invalid context key: ${t}`);if(!["string","number","boolean"].includes(typeof n)&&n!==null)throw new TypeError(`Invalid context value: ${t}`);if(typeof n=="number"&&!Number.isFinite(n))throw new TypeError(`Invalid context value: ${t}`);if(String(n??"").length>5e3)throw new TypeError(`Context value is too long: ${t}`)}}function Hl(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}async function wo(e,t,n,r={}){let o=r.submissionId??Vl(),i=ho(t,n,r.context),a=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(e.authTokenProvider)},body:JSON.stringify({kind:"bugdrop.variant-submission",schemaVersion:1,repo:e.repo,variantId:t.id,submissionId:o,issue:i,metadata:Ul()})}),s=await a.json();if(!a.ok||s.success!==!0)throw new Error(typeof s.error=="string"?s.error:"Failed to submit feedback");if(!Number.isInteger(s.issueNumber)||s.issueNumber<=0||typeof s.issueUrl!="string"||!jl(s.issueUrl,e.repo,s.issueNumber)||typeof s.isPublic!="boolean")throw new Error("BugDrop received an invalid Issue result");return{issueNumber:s.issueNumber,issueUrl:s.issueUrl,isPublic:s.isPublic,...Array.isArray(s.labelMappingWarnings)&&s.labelMappingWarnings.every(l=>typeof l=="string")?{labelMappingWarnings:s.labelMappingWarnings}:{}}}function Vl(){if(typeof crypto?.randomUUID=="function")return crypto.randomUUID();if(typeof crypto?.getRandomValues!="function")throw new Error("BugDrop variants require a cryptographically secure random generator");let e=crypto.getRandomValues(new Uint8Array(16));return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Ul(){let e=new URL(window.location.href);return e.search="",e.hash="",{url:e.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),browser:ql(navigator.userAgent),os:Wl(navigator.userAgent),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function ql(e){for(let[t,n]of[["Edge",/Edg\/(\d+[\d.]*)/],["Chrome",/Chrome\/(\d+[\d.]*)/],["Safari",/Version\/(\d+[\d.]*).*Safari/],["Firefox",/Firefox\/(\d+[\d.]*)/]]){let r=e.match(n);if(r)return{name:t,version:r[1]??"unknown"}}return{name:"Unknown",version:"unknown"}}function Wl(e){let t=e.match(/(?:Mac OS X|Windows NT|Android) ([\d_.]+)/);return t?{name:e.includes("Mac OS X")?"macOS":e.includes("Windows NT")?"Windows":"Android",version:(t[1]??"unknown").replaceAll("_",".")}:{name:e.includes("Linux")?"Linux":"Unknown",version:"unknown"}}function jl(e,t,n){try{let r=new URL(e);return r.protocol==="https:"&&r.hostname==="github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function vo(e,t={isLegacyModalOpen:()=>!1}){let n=new Map;return{register(r){let o=fo(r);if(n.has(o.id))throw new TypeError(`BugDrop variant is already registered: ${o.id}`);let i=ro(o);n.set(o.id,i);let s=i.screens[0].config,l=(c,d={})=>wo(e,s,c,d);return Object.freeze({id:i.variantId,open(c){if(s.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");return t.isLegacyModalOpen()?po(i.variantId):uo({config:s,options:c,submit:l})},mount(c,d){return lo({config:s,target:c,options:d,submit:l})},submit(c,d={}){return l(c,d)}})}}}function nt(e,t,n){return e?"answer"in e?xo(t,e.answer,e.equals):"context"in e?xo(n,e.context,e.equals):"all"in e?e.all.every(r=>nt(r,t,n)):e.any.some(r=>nt(r,t,n)):!0}function xo(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)&&e[t]===n}function En(e,t=1){if(t>4)throw new TypeError("BugDrop flow condition depth cannot exceed 4");if("answer"in e||"context"in e)return 1;let n="all"in e?e.all:e.any,r=1;for(let o of n)r+=En(o,t+1);if(r>32)throw new TypeError("BugDrop flow conditions cannot exceed 32 nodes");return r}var Be=class{constructor(t,n,r={}){this.definition=t;this.context=n;this.answers={...r},this.reconcileInitiallyHidden(),this.currentId=this.visibleScreens()[0]?.id??""}definition;context;answers;capture=null;currentId;current(){return this.route().screen}route(){let t=this.visibleScreens(),n=t.findIndex(o=>o.id===this.currentId),r=n>=0?n:0;return Object.freeze({screen:t[r],position:t.length===0?0:r+1,total:t.length,canGoBack:r>0,hasNext:r>=0&&r<t.length-1})}setFormAnswers(t,n){let r=new Set(this.visibleScreens().map(i=>i.id)),o=this.definition.screenAnswerPaths.get(this.definition.screens.find(i=>i.type==="form"&&i.form===t).id);for(let i of o){let a=i.slice(t.length+1);this.answers[i]=n[a]}this.reconcileNewlyHidden(r)}next(){let t=this.route(),n=this.visibleScreens();return t.hasNext?(this.currentId=n[t.position].id,!0):!1}back(){let t=this.route(),n=this.visibleScreens();return t.canGoBack?(this.currentId=n[t.position-2].id,!0):!1}hasNext(){return this.route().hasNext}visibleScreens(){return this.definition.screens.filter(t=>nt(t.when,this.answers,this.context))}reconcileInitiallyHidden(){for(let t of this.definition.screens)nt(t.when,this.answers,this.context)||this.clearScreenState(t)}reconcileNewlyHidden(t){let n=new Set(this.visibleScreens().map(o=>o.id)),r=!0;for(;r;){r=!1;for(let o of this.definition.screens)!t.has(o.id)||n.has(o.id)||(r=this.clearScreenState(o)||r);r&&(n=new Set(this.visibleScreens().map(o=>o.id)))}n.has(this.currentId)||(this.currentId=this.nearestVisibleId(n))}clearScreenState(t){let n=!1;for(let r of this.definition.screenAnswerPaths.get(t.id)??[])Object.prototype.hasOwnProperty.call(this.answers,r)&&(n=!0),delete this.answers[r];return t.type==="screenshot"&&this.capture!==null&&(this.capture=null,n=!0),n}nearestVisibleId(t){let n=this.definition.screens.findIndex(r=>r.id===this.currentId);for(let r=n;r>=0;r-=1){let o=this.definition.screens[r];if(o&&t.has(o.id))return o.id}return this.visibleScreens()[0]?.id??""}};async function Eo(e,t){let n=await t.preflight(e.system.preflight);if(n.status!=="installed")return t.showPreflightFailure(n),"preflight-blocked";let r=e.steps[0],o=new Be(e.flow,{"show-welcome":r.enabled});if(o.current()?.id==="welcome"){if(!await t.showWelcome(r))return"finished";r.remember&&t.rememberWelcome(r),o.next()}let i=e.steps[1],a=e.steps[2],s=null;for(;;){if(o.current()?.id!=="details")throw new Error("Default flow expected details screen");if(s=await t.showDetails(i,s),!s)return"finished";if(o.next(),o.current()?.id!=="screenshot")throw new Error("Default flow expected screenshot screen");let l=await t.capture(a,s);if(l.returnToDetails){o.back();continue}return await t.submit(e.system.submission,s,l),"finished"}}function Ht(e){let t=new Map;for(let o of e.forms)for(let i of o.fields)t.set(`${o.id}.${i.id}`,i);let n=new Map,r=new Set;for(let o of e.screens)Sn(o.when,r),n.set(o.id,o.type==="form"?e.forms.find(i=>i.id===o.form).fields.map(i=>`${o.form}.${i.id}`):[]);for(let o of e.issue.sections??[])"context"in o&&r.add(o.context);return Object.freeze({compiler:"bugdrop-flow@1",flowId:e.id,config:e,fields:t,contextKeys:r,screenAnswerPaths:n,screens:e.screens})}function Sn(e,t){e&&("context"in e?t.add(e.context):"all"in e?e.all.forEach(n=>Sn(n,t)):"any"in e&&e.any.forEach(n=>Sn(n,t)))}var Gl=/^[a-z][a-z0-9_-]{0,63}$/;function B(e,t,n){for(let r of Object.keys(e))t.has(r)||E(`${n} contains unknown key ${r}`)}function we(e,t){(typeof e!="string"||!Gl.test(e)||e==="legacy")&&E(`${t} is invalid`)}function ve(e,t,n){(typeof e!="string"||e.trim().length===0||e.length>n||[...e].some(r=>{let o=r.charCodeAt(0);return o<32&&o!==9&&o!==10&&o!==13}))&&E(`${t} is invalid`)}function me(e,t,n){e!==void 0&&ve(e,t,n)}function kn(e,t){(e!==null&&!["string","number","boolean"].includes(typeof e)||typeof e=="number"&&!Number.isFinite(e))&&E(`${t} must be scalar`)}function j(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function E(e){throw new TypeError(`BugDrop flow ${e}`)}function Tn(e){if(!e||typeof e!="object"||Object.isFrozen(e))return e;Object.freeze(e);for(let t of Object.values(e))Tn(t);return e}var Xl=new Set(["slide-horizontal","slide-vertical","fade","scale-fade"]),Kl=new Set(["standard","linear","ease-in","ease-out","ease-in-out"]),Yl=new Set(["opacity","translateX","translateY","scale"]);function Co(e){if(e!==void 0){if(j(e)||E("screen transition must be an object"),e.kind==="none"){B(e,new Set(["kind"]),"screen transition");return}if(Xl.has(e.kind)){B(e,new Set(["kind","durationMs"]),"screen transition"),So(e.durationMs);return}e.kind!=="custom"&&E("screen transition kind is invalid"),B(e,new Set(["kind","durationMs","easing","forward","backward"]),"screen transition"),So(e.durationMs),e.easing!==void 0&&!Kl.has(e.easing)&&E("custom screen transition easing is invalid"),ko(e.forward,"forward"),ko(e.backward,"backward")}}function So(e){e!==void 0&&(!Number.isInteger(e)||e<100||e>1e3)&&E("screen transition durationMs must be an integer from 100 to 1000")}function ko(e,t){j(e)||E(`custom screen transition ${t} motion must be an object`),B(e,new Set(["enterFrom","exitTo"]),`custom screen transition ${t} motion`),To(e.enterFrom,`${t} enterFrom`),To(e.exitTo,`${t} exitTo`)}function To(e,t){j(e)||E(`custom screen transition ${t} must be an object`),B(e,Yl,`custom screen transition ${t}`),Vt(e.opacity,0,1,`${t} opacity`),Vt(e.translateX,-200,200,`${t} translateX`),Vt(e.translateY,-200,200,`${t} translateY`),Vt(e.scale,.5,1.5,`${t} scale`)}function Vt(e,t,n,r){e!==void 0&&(typeof e!="number"||!Number.isFinite(e)||e<t||e>n)&&E(`custom screen transition ${r} is out of range`)}var Zl=new Set(["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"]),qt=e=>Zl.has(e);function Wt(e,t){let n=t;return t!==void 0&&!ce(t)&&k("open options must be an object"),xe(t??{},new Set(["context","initialAnswers"]),"open options"),{context:Object.freeze(Ql(e,n?.context)),initialAnswers:ec(e,n?.initialAnswers)}}function Lo(e){tc(e),e.type==="shortText"||e.type==="longText"?nc(e):e.type==="rating"?rc(e):e.type==="singleChoice"?oc(e):e.type==="checkbox"?ic(e):ac(e)}function Fo(e,t){if(e.type==="rating"){let o=e.scale??5;(!Number.isInteger(t)||t<1||t>o)&&k(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="singleChoice"){(typeof t!="string"||!e.options.some(o=>o.value===t))&&k(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="checkbox"){typeof t!="boolean"&&k(`condition equals is not a valid value for field ${e.id}`);return}e.type==="attachments"&&k(`condition answer cannot reference attachments field ${e.id}`),(typeof t!="string"||t!==t.trim())&&k(`condition equals is not a valid value for field ${e.id}`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3);(t.length<n||t.length>r)&&k(`condition equals is not a valid value for field ${e.id}`)}function Ao(e){let{presentation:t,appearance:n,content:r}=e;ce(t)||k("presentation must be an object"),xe(t,new Set(["kind","size","columns","screenTransition"]),"presentation"),t.kind!=="modal"&&k("presentation kind must be modal"),t.size!==void 0&&!["compact","default","wide"].includes(t.size)&&k("modal size is invalid"),t.columns!==void 0&&![1,2].includes(t.columns)&&k("presentation columns must be 1 or 2"),Co(t.screenTransition),n!==void 0&&(ce(n)||k("appearance must be an object"),xe(n,new Set(["theme","accentColor","density"]),"appearance"),n.theme!==void 0&&!["light","dark","auto"].includes(n.theme)&&k("appearance theme is invalid"),be(n.accentColor,"appearance accentColor",120),n.density!==void 0&&!["compact","comfortable"].includes(n.density)&&k("appearance density is invalid")),r!==void 0&&(ce(r)||k("content must be an object"),xe(r,new Set(["successTitle","successMessage","cancelLabel"]),"content"),be(r.successTitle,"successTitle",500),be(r.successMessage,"successMessage",2e3),be(r.cancelLabel,"cancelLabel",120))}function Jl(e,t){if(e.type==="shortText"||e.type==="longText"){typeof t!="string"&&k(`initial answer ${e.id} must be text`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3),o=t.trim();return(o.length<n||o.length>r)&&k(`initial answer ${e.id} has invalid length`),o}if(e.type==="rating"){let n=e.scale??5;return(!Number.isInteger(t)||t<1||t>n)&&k(`initial answer ${e.id} must be a rating from 1-${n}`),t}return e.type==="singleChoice"?((typeof t!="string"||!e.options.some(n=>n.value===t))&&k(`initial answer ${e.id} must be a configured choice`),t):e.type==="checkbox"?(typeof t!="boolean"&&k(`initial answer ${e.id} must be boolean`),t):sc(e,t)}function Ql(e,t){t!==void 0&&!ce(t)&&k("context must be an object");let n=t??{},r=Object.keys(n).find(i=>!e.contextKeys.has(i));r&&k(`context contains unknown key ${r}`);let o={};for(let[i,a]of Object.entries(n))(!dc(a)||typeof a=="number"&&!Number.isFinite(a))&&k(`context ${i} must be a finite scalar`),o[i]=a;return o}function ec(e,t){t!==void 0&&!ce(t)&&k("initialAnswers must be an object");let n=t??{},r=Object.keys(n).find(o=>!e.fields.has(o));return r&&k(`initialAnswers contains unknown key ${r}`),Object.fromEntries(Object.entries(n).map(([o,i])=>[o,Jl(e.fields.get(o),i)]))}function tc(e){e.layout!==void 0&&(ce(e.layout)||k(`field ${e.id} layout must be an object`),xe(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2&&k(`field ${e.id} layout span must be 1 or 2`))}function nc(e){be(e.placeholder,`field ${e.id} placeholder`,500);let t=e.minLength??0,n=e.maxLength??(e.type==="shortText"?500:5e3);(!Ne(t,0,5e3)||!Ne(n,1,5e3)||t>n)&&k(`field ${e.id} has invalid text bounds`),e.type==="longText"&&e.rows!==void 0&&!Ne(e.rows,1,50)&&k(`field ${e.id} rows must be 1-50`)}function rc(e){e.scale!==void 0&&e.scale!==5&&e.scale!==10&&k(`field ${e.id} rating scale must be 5 or 10`),e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number"&&k(`field ${e.id} rating icon is invalid`),be(e.lowLabel,`field ${e.id} lowLabel`,500),be(e.highLabel,`field ${e.id} highLabel`,500)}function oc(e){(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)&&k(`field ${e.id} requires 2-50 choices`),e.display!==void 0&&!["radio","cards","buttons"].includes(e.display)&&k(`field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options)ce(n)||k(`field ${e.id} has an invalid choice`),xe(n,new Set(["value","label","description"]),`field ${e.id} choice`),Ut(n.value,`field ${e.id} choice value`,120),Ut(n.label,`field ${e.id} choice label`,500),be(n.description,`field ${e.id} choice description`,1e3),t.has(n.value)&&k(`field ${e.id} has duplicate choices`),t.add(n.value)}function ic(e){e.initialValue!==void 0&&typeof e.initialValue!="boolean"&&k(`field ${e.id} initialValue must be boolean`)}function ac(e){e.maxFiles!==void 0&&!Ne(e.maxFiles,1,5)&&k(`field ${e.id} maxFiles must be 1-5`),e.maxFileSize!==void 0&&!Ne(e.maxFileSize,1,5*1024*1024)&&k(`field ${e.id} maxFileSize is invalid`),e.accept!==void 0&&(!Array.isArray(e.accept)||e.accept.length===0||e.accept.length>20||e.accept.some(t=>typeof t!="string"||!t.trim()||t.length>120||!qt(t)))&&k(`field ${e.id} accept is invalid`)}function sc(e,t){return(!Array.isArray(t)||t.length>(e.maxFiles??5))&&k(`initial answer ${e.id} has too many attachments`),t.map(n=>{ce(n)||k(`initial answer ${e.id} has an invalid attachment`),xe(n,new Set(["name","type","size","dataUrl"]),"attachment"),Ut(n.name,"attachment name",500),(typeof n.type!="string"||!qt(n.type))&&k("attachment type is invalid"),e.accept&&!e.accept.includes(n.type)&&k(`initial answer ${e.id} has a disallowed attachment type`),Ne(n.size,0,e.maxFileSize??5*1024*1024)||k("attachment size is invalid"),(typeof n.dataUrl!="string"||!new RegExp(`^data:${lc(n.type)};base64,[A-Za-z0-9+/]+={0,2}$`).test(n.dataUrl))&&k("attachment dataUrl is invalid");let r=n.dataUrl.slice(n.dataUrl.indexOf(",")+1);return r.length%4!==0&&k("attachment dataUrl is invalid"),atob(r).length>(e.maxFileSize??5*1024*1024)&&k("attachment size is invalid"),{name:n.name,type:n.type,size:n.size,dataUrl:n.dataUrl}})}function lc(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ut(e,t,n){(typeof e!="string"||!e.trim()||e.length>n||cc(e))&&k(`${t} is invalid`)}function be(e,t,n){e!==void 0&&Ut(e,t,n)}function cc(e){return[...e].some(t=>{let n=t.charCodeAt(0);return n<32&&n!==9&&n!==10&&n!==13||n===127})}function Ne(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function dc(e){return e===null||["string","number","boolean"].includes(typeof e)}function ce(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function xe(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));r&&k(`${n} contains unknown key ${r}`)}function k(e){throw new TypeError(`BugDrop flow ${e}`)}var Do=/^([a-z][a-z0-9_-]{0,63})\.([a-z][a-z0-9_-]{0,63})$/,uc=new Set(["configVersion","id","presentation","appearance","content","forms","screens","issue","evidence"]),_e=["id","type","label","helpText","required","layout"],Po={shortText:new Set([..._e,"placeholder","minLength","maxLength"]),longText:new Set([..._e,"placeholder","rows","minLength","maxLength"]),rating:new Set([..._e,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([..._e,"options","display"]),checkbox:new Set([..._e,"initialValue"]),attachments:new Set([..._e,"maxFiles","maxFileSize","accept"])};function jt(e){j(e)||E("config must be an object"),B(e,uc,"config"),e.configVersion!==1&&E("configVersion must be 1"),we(e.id,"id"),Ao(e),(!Array.isArray(e.forms)||e.forms.length===0||e.forms.length>12)&&E("forms must contain 1-12 entries"),(!Array.isArray(e.screens)||e.screens.length===0||e.screens.length>20)&&E("screens must contain 1-20 entries");let t=new Map,n=new Map;for(let l of e.forms)pc(l,n,t);let r=new Set,o=new Set,i=new Map,a=0,s=new Set;for(let l of e.screens){if(mc(l,s,n,i),l.type==="form"){r.has(l.form)&&E(`form ${l.form} may be referenced only once`),r.add(l.form);for(let c of n.get(l.form).fields)i.set(`${l.form}.${c.id}`,c);if(l.when===void 0)for(let c of n.get(l.form).fields)c.required&&o.add(`${l.form}.${c.id}`)}l.type==="screenshot"&&++a>1&&E("only one screenshot screen is supported")}for(let l of n.keys())r.has(l)||E(`form ${l} is unused`);return e.screens.every(l=>l.when!==void 0)&&E("at least one screen must be unconditional"),bc(e.issue,t,o),gc(e.evidence,t),Tn(structuredClone(e))}function pc(e,t,n){j(e)||E("form must be an object"),B(e,new Set(["id","title","description","fields"]),"form"),we(e.id,"form id"),t.has(e.id)&&E(`duplicate form id ${e.id}`),ve(e.title,"form title",500),me(e.description,"form description",2e3),(!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)&&E("form fields must contain 1-20 entries");let r=new Set;for(let o of e.fields)(!j(o)||typeof o.type!="string"||!(o.type in Po))&&E("field type is unsupported"),B(o,Po[o.type],"field"),we(o.id,"field id"),r.has(o.id)&&E(`duplicate field id ${o.id}`),r.add(o.id),ve(o.label,"field label",500),me(o.helpText,"field helpText",1e3),o.required!==void 0&&typeof o.required!="boolean"&&E("field required must be boolean"),Lo(o),n.set(`${e.id}.${o.id}`,o);t.set(e.id,e)}function mc(e,t,n,r){j(e)||E("screen must be an object"),we(e.id,"screen id"),t.has(e.id)&&E(`duplicate screen id ${e.id}`),t.add(e.id),["message","form","screenshot"].includes(e.type)||E("screen type is unsupported");let o=e.type==="message"?new Set(["id","type","when","title","description","continueLabel"]):e.type==="form"?new Set(["id","type","when","form","continueLabel","backLabel"]):new Set(["id","type","when","title","description","mode","continueLabel","backLabel"]);B(e,o,"screen"),Object.prototype.hasOwnProperty.call(e,"when")&&zo(e.when,r),e.type==="message"&&(ve(e.title,"message title",500),me(e.description,"message description",2e3)),e.type==="form"&&!n.has(e.form)&&E(`screen references unknown form ${e.form}`),e.type==="screenshot"&&!["optional","auto","required"].includes(e.mode)&&E("screenshot mode is invalid"),e.type==="screenshot"&&(me(e.title,"screenshot title",500),me(e.description,"screenshot description",2e3)),me(e.continueLabel,"screen continueLabel",120),e.type!=="message"&&me(e.backLabel,"screen backLabel",120)}function zo(e,t){if(j(e)||E("condition must be an object"),En(e),"answer"in e){B(e,new Set(["answer","equals"]),"answer condition");let o=t.get(e.answer);o||E(`condition answer must reference an earlier field: ${e.answer}`),kn(e.equals,"condition equals"),Fo(o,e.equals);return}if("context"in e){B(e,new Set(["context","equals"]),"context condition"),we(e.context,"condition context"),kn(e.equals,"condition equals");return}let n="all"in e?"all":"any"in e?"any":null;n||E("condition must contain answer, context, all, or any"),B(e,new Set([n]),"condition group");let r=n==="all"?e.all:e.any;(!Array.isArray(r)||r.length<1||r.length>8)&&E(`condition ${n} must contain 1-8 entries`);for(let o of r)zo(o,t)}function bc(e,t,n){if(j(e)||E("issue must be an object"),B(e,new Set(["classification","title","sections"]),"issue"),ve(e.title,"issue title",2e3),e.classification!==void 0&&!["bug","feature","question"].includes(e.classification)&&E("issue classification is invalid"),hc(e.title,t,n),e.sections!==void 0){(!Array.isArray(e.sections)||e.sections.length>20)&&E("issue sections are invalid");let r=new Set;for(let o of e.sections)fc(o,t,r)}}function fc(e,t,n){j(e)||E("issue section must be an object"),"answer"in e?(B(e,new Set(["heading","answer","format","omitWhenEmpty"]),"issue section"),Io(e.answer,t,"issue section")):(B(e,new Set(["heading","context","format","omitWhenEmpty"]),"issue section"),we(e.context,"issue context")),ve(e.heading,"issue section heading",120);let r=e.heading.trim().toLowerCase();n.has(r)&&E(`duplicate issue section heading ${e.heading}`),n.add(r),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean"&&E("issue section omitWhenEmpty must be boolean");let o=e.format??"text";if("answer"in e){["text","quote","stars","choice","code"].includes(o)||E("issue answer format is invalid");let i=t.get(e.answer);o==="stars"&&i.type!=="rating"&&E("stars format requires a rating field"),o==="choice"&&i.type!=="singleChoice"&&E("choice format requires a singleChoice field")}else["text","code"].includes(o)||E("issue context format is invalid")}function gc(e,t){e!==void 0&&(j(e)||E("evidence must be an object"),B(e,new Set(["attachments","sendConsoleLogs","submitter"]),"evidence"),Mo(e.attachments,"attachments",t,"attachments"),Mo(e.sendConsoleLogs,"checkbox",t,"sendConsoleLogs"),e.submitter!==void 0&&(j(e.submitter)||E("evidence submitter must be an object"),B(e.submitter,new Set(["name","email"]),"evidence submitter"),!e.submitter.name&&!e.submitter.email&&E("evidence submitter must map name or email"),e.submitter.name&&Ro(e.submitter.name,t,"submitter name"),e.submitter.email&&Ro(e.submitter.email,t,"submitter email")))}function Mo(e,t,n,r){e!==void 0&&n.get(e)?.type!==t&&E(`${r} must reference a ${t} field`)}function Io(e,t,n){(!Do.test(e)||!t.has(e)||t.get(e)?.type==="attachments")&&E(`${n} references an unknown scalar answer: ${e}`)}function Ro(e,t,n){let r=t.get(e)?.type;(!Do.test(e)||r!=="shortText"&&r!=="longText")&&E(`${n} must reference a text field`)}function hc(e,t,n){let r=0,o=!1,i="";for(let s of e.matchAll(/{{\s*([^{}]+?)\s*}}/g)){let l=s.index,c=e.slice(r,l);i+=c,(c.includes("{{")||c.includes("}}")||c.endsWith("{"))&&E("issue title template is malformed");let d=s[1].trim();Io(d,t,"issue title"),o||=n.has(d),r=l+s[0].length,e[r]==="}"&&E("issue title template is malformed")}let a=e.slice(r);(a.includes("{{")||a.includes("}}"))&&E("issue title template is malformed"),i+=a,!i.trim()&&!o&&E("issue title must contain text or reference a required answer")}var yc="bugdrop-default@1";function wc(e){if(e)return Object.freeze(Object.fromEntries(Object.entries(e).map(([t,n])=>[t,Array.isArray(n)?Object.freeze([...n]):n])))}function $o(e){let t=!e.skipWelcome&&e.welcome!=="never"&&!(e.welcome==="once"&&e.hasSeenWelcome),n=Object.freeze([Object.freeze({kind:"welcome",enabled:t,remember:t&&e.welcome==="once"}),Object.freeze({kind:"details",repo:e.repo,showName:e.showName,requireName:e.requireName,showEmail:e.showEmail,requireEmail:e.requireEmail,sendConsoleLogs:e.sendConsoleLogs}),Object.freeze({kind:"screenshot",mode:e.screenshotMode,repo:e.repo,screenshotScale:e.screenshotScale,elementContextMaxArea:e.elementContextMaxArea,accentColor:e.accentColor})]),r={configVersion:1,id:"bugdrop-default-v1",presentation:{kind:"modal"},forms:[{id:"details",title:"Send Feedback",fields:[{id:"title",type:"shortText",label:"Title",required:!0},{id:"description",type:"longText",label:"Description"},{id:"category",type:"singleChoice",label:"Category",required:!0,options:[{value:"bug",label:"Bug"},{value:"feature",label:"Feature"},{value:"question",label:"Question"}]},{id:"attachments",type:"attachments",label:"Attachments"},{id:"send-console-logs",type:"checkbox",label:"Include console logs"},{id:"name",type:"shortText",label:"Name"},{id:"email",type:"shortText",label:"Email"}]}],screens:[{id:"welcome",type:"message",title:"Share feedback",when:{context:"show-welcome",equals:!0}},{id:"details",type:"form",form:"details"},{id:"screenshot",type:"screenshot",mode:e.screenshotMode}],issue:{classification:"bug",title:"{{details.title}}",sections:[{heading:"Description",answer:"details.description",omitWhenEmpty:!0}]},evidence:{attachments:"details.attachments",sendConsoleLogs:"details.send-console-logs",submitter:{name:"details.name",email:"details.email"}}},o=Ht(jt(r));return Object.freeze({id:yc,flow:o,steps:n,system:Object.freeze({preflight:Object.freeze({kind:"installation",repo:e.repo,apiUrl:e.apiUrl,authTokenProvider:e.authTokenProvider}),submission:Object.freeze({kind:"legacy-feedback",repo:e.repo,apiUrl:e.apiUrl,authTokenProvider:e.authTokenProvider,categoryLabels:wc(e.categoryLabels),issueLinkVisibility:e.issueLinkVisibility})})})}function Oo(e){return Object.freeze({instanceId:ee(e),result:Promise.resolve({status:"busy"}),close(){}})}function No(e,t,n,r){let o=Ho(e,n),i=document.createElement("input");return i.type="checkbox",i.id=o.controlId,i.checked=typeof r[`${t}.${e.id}`]=="boolean"?!!r[`${t}.${e.id}`]:!!e.initialValue,i.setAttribute("aria-required",String(e.required??!1)),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy),o.wrapper.classList.add("bdf-checkbox"),o.wrapper.insertBefore(i,o.label),{id:e.id,required:!!e.required,element:o.wrapper,read:async()=>({ok:!0,value:i.checked}),setRequiredError(a){o.setError(i,a?"This checkbox is required.":null)},focus:()=>i.focus(),dispose(){}}}function _o(e,t,n,r){let o=Ho(e,n);o.wrapper.classList.add("bdf-attachment");let i=document.createElement("input");i.className="bdv-input",i.type="file",i.id=o.controlId,i.multiple=(e.maxFiles??5)>1,i.setAttribute("aria-required",String(e.required??!1)),e.accept&&(i.accept=e.accept.join(",")),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy);let a=document.createElement("ul");a.className="bdf-file-list",a.setAttribute("aria-live","polite"),o.wrapper.insertBefore(i,o.error),o.wrapper.insertBefore(a,o.error);let s=r[`${t}.${e.id}`],l=Array.isArray(s)?[...s]:[],c=!1,d=Promise.resolve(),u=0;Bo(a,l.map(m=>m.name));let b=()=>{let m=++u;c=!1,o.setError(i,null);let f=Array.from(i.files??[]);d=vc(f,e).then(h=>{m===u&&(l=h,Bo(a,h.map(S=>S.name)))}).catch(h=>{m===u&&(c=!0,o.setError(i,h instanceof Error?h.message:"Could not read the selected attachment."))})};return i.addEventListener("change",b),{id:e.id,required:!!e.required,element:o.wrapper,async read(m){for(;;){let f=d;if(await f,f===d)break}return c&&m?{ok:!1}:{ok:!0,value:l}},setRequiredError(m){c||o.setError(i,m?"Select at least one attachment.":null)},focus:()=>i.focus(),dispose:()=>{u+=1,i.removeEventListener("change",b)}}}function Ho(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=document.createElement("label");if(o.className="bdv-label",o.htmlFor=r,o.textContent=e.label,e.required){let s=document.createElement("span");s.className="bdv-required",s.textContent=" *",s.setAttribute("aria-hidden","true"),o.appendChild(s)}n.appendChild(o);let i=[];if(e.helpText){let s=document.createElement("div");s.className="bdv-help",s.id=`${r}-help`,s.textContent=e.helpText,n.appendChild(s),i.push(s.id)}let a=document.createElement("div");return a.className="bdv-error",a.id=`${r}-error`,a.hidden=!0,a.setAttribute("aria-live","polite"),n.appendChild(a),i.push(a.id),{wrapper:n,label:o,error:a,controlId:r,describedBy:i.join(" ")||null,setError(s,l){a.textContent=l??"",a.hidden=!l,l?s.setAttribute("aria-invalid","true"):s.removeAttribute("aria-invalid")}}}async function vc(e,t){if(e.length>(t.maxFiles??5))throw new TypeError(`Select at most ${t.maxFiles??5} attachments.`);return Promise.all(e.map(n=>xc(n,t.maxFileSize??5*1024*1024,t.accept)))}async function xc(e,t,n){if(!qt(e.type))throw new TypeError(`${e.name} has an unsupported file type.`);if(n&&!n.includes(e.type))throw new TypeError(`${e.name} is not an accepted file type.`);if(e.size>t)throw new TypeError(`${e.name} is too large.`);let r=await new Promise((o,i)=>{let a=new FileReader;a.addEventListener("load",()=>typeof a.result=="string"?o(a.result):i(new Error("Could not read the selected attachment."))),a.addEventListener("error",()=>i(new Error("Could not read the selected attachment."))),a.readAsDataURL(e)});return{name:e.name,type:e.type,size:e.size,dataUrl:r}}function Bo(e,t){e.replaceChildren(...t.map(n=>{let r=document.createElement("li");return r.textContent=n,r}))}function Vo(e,t,n){let r=Sc(e),o=document.createElement("div");o.className="bdv-fields",r.appendChild(o);let i=e.fields.map(s=>Ec(s,e.id,t,n));for(let s of i)o.appendChild(s.element);let a=async s=>{let l=i.filter(Cc);for(let d of l)d.setError(null);let c=Object.fromEntries(l.map(d=>[d.field.id,d.getValue()]));if(s)try{c=$e(e.fields.filter(Tc),c)}catch(d){return kc(d,l),null}for(let d of i.filter(Lc)){d.setRequiredError(!1);let u=await d.read(s);if(!u.ok)return d.focus(),null;if(s&&d.required&&(u.value===!1||Array.isArray(u.value)&&u.value.length===0))return d.setRequiredError(!0),d.focus(),null;c[d.id]=u.value}return c};return{element:r,collect:()=>a(!0),snapshot:()=>a(!1),dispose(){for(let s of i)s.dispose()}}}function Ec(e,t,n,r){if(e.type==="checkbox")return No(e,t,n,r);if(e.type==="attachments")return _o(e,t,n,r);let o=Ot(e,n);return o.setValue(r[`${t}.${e.id}`]??""),o}function Sc(e){let t=document.createElement("section");t.className="bdv-surface";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function kc(e,t){let n=e instanceof se?t.find(r=>r.field.id===e.fieldId):void 0;n?.setError(e instanceof Error?e.message.replace(/^Answer \S+ /,""):"Invalid answer"),n?.focus()}function Tc(e){return e.type!=="checkbox"&&e.type!=="attachments"}function Cc(e){return"field"in e}function Lc(e){return"read"in e}function Uo(e){let t=document.createElement("section");t.className="bdv-surface bdf-message";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function qo(e,t,n,r,o){let i=document.activeElement instanceof HTMLElement?document.activeElement:null,a=document.body.style.getPropertyValue("overflow"),s=document.body.style.getPropertyPriority("overflow"),l=document.createElement("div");l.dataset.bugdropOwned="",l.dataset.bugdropFlow=e,l.dataset.bugdropInstance=t,Object.assign(l.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let c=l.attachShadow({mode:"open"}),d=n(c),u=document.createElement("div");u.className="bdv-overlay",d.root.appendChild(u);let b=()=>{},m=()=>{},f=!1;return{host:l,shadow:c,overlay:u,activate(h){document.body.style.setProperty("overflow","hidden"),document.body.appendChild(l),m=de(l),c.addEventListener("keydown",r),u.addEventListener("pointerdown",o),b=It({close:h})},dispose(){f||(f=!0,b(),c.removeEventListener("keydown",r),u.removeEventListener("pointerdown",o),m(),d.dispose(),l.remove(),a?document.body.style.setProperty("overflow",a,s):document.body.style.removeProperty("overflow"),i?.isConnected&&i.focus())}}}function Wo(e,t,n){let r=e.querySelector(".bdv-title"),o=`${t}-title`;return r&&(r.id=o),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby",o),e.tabIndex=-1,e.dataset.size=n,e}function jo(e,t,n,r,o){let i=t.screen,a=He("\xD7","bdv-close");a.setAttribute("aria-label","Close"),a.addEventListener("click",o,{once:!0}),e.prepend(a);let s=document.createElement("p");s.className="bdf-progress",s.textContent=`Step ${t.position} of ${t.total}`,e.querySelector(".bdv-header")?.prepend(s);let l=document.createElement("div");if(l.className="bdv-actions",t.canGoBack){let u=He(i.type==="message"?"Back":i.backLabel??"Back","bdv-cancel bdf-back");u.addEventListener("click",n),l.appendChild(u)}let c=i.continueLabel??(t.hasNext?"Continue":"Submit"),d=He(c,"bdv-submit");d.addEventListener("click",r),l.appendChild(d),e.appendChild(l)}function Go(e){let t=Ve(e.title??"Add a screenshot",e.description??(e.mode==="required"?"A screenshot is required before submitting.":"Include a screenshot to help explain your feedback."));if(e.mode==="optional"){let n=document.createElement("label");n.className="bdf-checkbox";let r=document.createElement("input");r.type="checkbox",r.checked=!0,r.dataset.screenshot="",n.append(r,document.createTextNode("Include a screenshot")),t.appendChild(n)}return t}function Ve(e,t){let n=document.createElement("section");n.className="bdv-surface";let r=document.createElement("div");r.className="bdv-header";let o=document.createElement("h2");o.className="bdv-title",o.textContent=e;let i=document.createElement("p");return i.className="bdv-description",i.textContent=t,r.append(o,i),n.appendChild(r),n}function Xo(e,t,n,r){let o=Ve("Submission failed",e),i=document.createElement("div");i.className="bdv-actions";let a=He("Try again","bdv-submit");a.addEventListener("click",n);let s=He(t,"bdv-cancel");return s.addEventListener("click",r),i.append(a,s),o.appendChild(i),o}function Ko(e,t,n){let r=Ve(e.config.content?.successTitle??"Thanks for your feedback!",e.config.content?.successMessage??"Your response was submitted.");if(t.isPublic){let i=document.createElement("a");i.className="bdv-success-link",i.href=t.issueUrl,i.target="_blank",i.rel="noopener noreferrer",i.textContent="View GitHub Issue",r.appendChild(i)}let o=He("Done","bdv-submit");return o.addEventListener("click",n),r.appendChild(o),r}function Yo(e){return e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href]")}function Zo(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}function Jo(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&!t.closest('[inert], [aria-hidden="true"]'))}function He(e,t){let n=document.createElement("button");return n.type="button",n.className=t,n.textContent=e,n}var Fc={"slide-horizontal":{defaultDurationMs:500,classes:e=>({enter:`bdf-slide-${e}-enter`,exit:`bdf-slide-${e}-exit`})},"slide-vertical":{defaultDurationMs:500,classes:e=>({enter:`bdf-slide-vertical-${e}-enter`,exit:`bdf-slide-vertical-${e}-exit`})},fade:{defaultDurationMs:350,classes:()=>({enter:"bdf-fade-enter",exit:"bdf-fade-exit"})},"scale-fade":{defaultDurationMs:450,classes:()=>({enter:"bdf-scale-fade-enter",exit:"bdf-scale-fade-exit"})}},Ac={defaultDurationMs:500,classes:()=>({enter:"bdf-custom-enter",exit:"bdf-custom-exit"})},Pc={standard:"cubic-bezier(.2, .8, .2, 1)",linear:"linear","ease-in":"ease-in","ease-out":"ease-out","ease-in-out":"ease-in-out"};function ei(e,t){let n=()=>{},r=Mc(t),o=t&&t.kind!=="none"?t.durationMs??r?.defaultDurationMs:void 0;return o!==void 0&&e.style.setProperty("--bdf-screen-transition-duration",`${o}ms`),{show:(a,s)=>{n();let l=Array.from(e.children).find(f=>f instanceof HTMLElement&&f.classList.contains("bdv-surface"));if(!s||!l||!r||Dc()){e.replaceChildren(a);return}l.setAttribute("aria-hidden","true"),l.setAttribute("inert",""),t?.kind==="custom"&&Rc(e,t,s);let c=r.classes(s);l.classList.add(c.exit),a.classList.add(c.enter),e.classList.add("bdf-transitioning"),e.appendChild(a);let d=!1,u=()=>{d||(d=!0,window.clearTimeout(m),a.removeEventListener("animationend",b),l.remove(),a.classList.remove(c.enter),e.classList.remove("bdf-transitioning"),n=()=>{})},b=f=>{f.target===a&&u()};a.addEventListener("animationend",b);let m=window.setTimeout(u,(o??r.defaultDurationMs)+60);n=u},dispose(){n()}}}function Mc(e){if(!(!e||e.kind==="none"))return e.kind==="custom"?Ac:Fc[e.kind]}function Rc(e,t,n){let r=t[n];Qo(e,"enter",r.enterFrom),Qo(e,"exit",r.exitTo),e.style.setProperty("--bdf-screen-transition-easing",Pc[t.easing??"standard"])}function Qo(e,t,n){e.style.setProperty(`--bdf-custom-${t}-opacity`,String(n.opacity??1)),e.style.setProperty(`--bdf-custom-${t}-x`,`${n.translateX??0}px`),e.style.setProperty(`--bdf-custom-${t}-y`,`${n.translateY??0}px`),e.style.setProperty(`--bdf-custom-${t}-scale`,String(n.scale??1))}function Dc(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function ti(e,t){let n={id:t.id,presentation:t.presentation,appearance:t.appearance,content:{title:t.id},fields:[{id:"placeholder",type:"shortText",label:"Placeholder"}],issue:{title:t.id}},r=Oe(e,n,"modal"),o=document.createElement("style");return o.textContent=`
    .bdf-progress { margin: 0 0 12px; color: var(--bdv-text-muted); font-size: .8rem; }
    .bdf-message { min-height: 180px; display: grid; align-content: center; }
    .bdf-attachment { display: grid; gap: 7px; }
    .bdf-checkbox { display: flex; min-height: 44px; align-items: center; gap: 10px; }
    .bdf-checkbox input { width: 20px; height: 20px; accent-color: var(--bdv-accent); }
    .bdf-file-list { margin: 0; padding-left: 20px; color: var(--bdv-text-muted); }
    .bdf-back { order: -1; }
    .bdf-transitioning { overflow: hidden; }
    .bdf-transitioning > .bdv-surface { grid-area: 1 / 1; }
    .bdf-slide-forward-enter { animation: bdf-slide-from-right var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-forward-exit { animation: bdf-slide-to-left var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-backward-enter { animation: bdf-slide-from-left var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-backward-exit { animation: bdf-slide-to-right var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-vertical-forward-enter { animation: bdf-slide-from-bottom var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-vertical-forward-exit { animation: bdf-slide-to-top var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-vertical-backward-enter { animation: bdf-slide-from-top var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-slide-vertical-backward-exit { animation: bdf-slide-to-bottom var(--bdf-screen-transition-duration, 500ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-fade-enter { animation: bdf-fade-in var(--bdf-screen-transition-duration, 350ms) ease-out; }
    .bdf-fade-exit { animation: bdf-fade-out var(--bdf-screen-transition-duration, 350ms) ease-in; }
    .bdf-scale-fade-enter { animation: bdf-scale-fade-in var(--bdf-screen-transition-duration, 450ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-scale-fade-exit { animation: bdf-scale-fade-out var(--bdf-screen-transition-duration, 450ms) cubic-bezier(.2, .8, .2, 1); }
    .bdf-custom-enter { animation: bdf-custom-in var(--bdf-screen-transition-duration, 500ms) var(--bdf-screen-transition-easing, ease); }
    .bdf-custom-exit { animation: bdf-custom-out var(--bdf-screen-transition-duration, 500ms) var(--bdf-screen-transition-easing, ease); }
    @keyframes bdf-slide-from-right {
      from { opacity: .35; transform: translateX(24px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes bdf-slide-to-left {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(-24px); }
    }
    @keyframes bdf-slide-from-left {
      from { opacity: .35; transform: translateX(-24px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes bdf-slide-to-right {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(24px); }
    }
    @keyframes bdf-slide-from-bottom {
      from { opacity: .35; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bdf-slide-to-top {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-24px); }
    }
    @keyframes bdf-slide-from-top {
      from { opacity: .35; transform: translateY(-24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bdf-slide-to-bottom {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(24px); }
    }
    @keyframes bdf-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes bdf-fade-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes bdf-scale-fade-in {
      from { opacity: 0; transform: scale(.96); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes bdf-scale-fade-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(1.025); }
    }
    @keyframes bdf-custom-in {
      from {
        opacity: var(--bdf-custom-enter-opacity, 1);
        transform: translate3d(var(--bdf-custom-enter-x, 0), var(--bdf-custom-enter-y, 0), 0) scale(var(--bdf-custom-enter-scale, 1));
      }
      to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    }
    @keyframes bdf-custom-out {
      from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      to {
        opacity: var(--bdf-custom-exit-opacity, 1);
        transform: translate3d(var(--bdf-custom-exit-x, 0), var(--bdf-custom-exit-y, 0), 0) scale(var(--bdf-custom-exit-scale, 1));
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bdf-slide-forward-enter, .bdf-slide-forward-exit,
      .bdf-slide-backward-enter, .bdf-slide-backward-exit,
      .bdf-slide-vertical-forward-enter, .bdf-slide-vertical-forward-exit,
      .bdf-slide-vertical-backward-enter, .bdf-slide-vertical-backward-exit,
      .bdf-fade-enter, .bdf-fade-exit,
      .bdf-scale-fade-enter, .bdf-scale-fade-exit,
      .bdf-custom-enter, .bdf-custom-exit { animation: none; }
    }
  `,e.prepend(o),{root:r.root,dispose(){o.remove(),r.dispose()}}}function ni(e,t,n){let r=Wt(e,t);return Ie(),new Cn(e,r,n).open()}var Cn=class{constructor(t,n,r){this.definition=t;this.ports=r;this.instanceId=ee(t.flowId),this.previousFocus=Zo(),this.runtime=new Be(t,n.context,n.initialAnswers),this.result=new Promise(o=>{this.resolveOutcome=o}),this.state=qo(t.flowId,this.instanceId,o=>ti(o,t.config),o=>this.onKeydown(o),o=>this.onBackdrop(o)),this.screenTransition=ei(this.state.overlay,t.config.presentation.screenTransition)}definition;ports;instanceId;previousFocus;runtime;result;resolveOutcome;state;screenTransition;currentForm=null;settled=!1;closed=!1;busy=!1;dialogVersion=0;routePreviewVersion=0;preflightVersion=0;captureAbortController=null;open(){let t=Object.freeze({instanceId:this.instanceId,result:this.result,close:()=>this.close()});this.state.activate(t.close);let n=Ve("Preparing feedback","Checking installation\u2026");return n.setAttribute("aria-busy","true"),this.show(n),this.preflight(),t}async preflight(){let t=++this.preflightVersion;try{let n=await this.ports.preflight();if(this.closed||t!==this.preflightVersion)return;if(n.status==="installed")this.render();else{let r=n.status==="not_installed"?`Install the ${n.appName??"BugDrop"} GitHub App to continue.`:"BugDrop could not reach the feedback service.";this.renderError(r,()=>{this.preflight()})}}catch{!this.closed&&t===this.preflightVersion&&this.renderError("BugDrop could not reach the feedback service.",()=>{this.preflight()})}}render(t){this.disposeForm();let n=this.runtime.route(),r=n.screen;if(!r){this.finish();return}let o;if(r.type==="message")o=Uo(r);else if(r.type==="form"){let i=this.definition.config.forms.find(a=>a.id===r.form);this.currentForm=Vo(i,this.instanceId,this.runtime.answers),o=this.currentForm.element}else o=Go(r);if(jo(o,n,()=>{this.back(r)},()=>{this.advance(r,o)},()=>this.close()),r.type==="form"){let i=()=>{this.previewFormRoute(r.form,o)};o.addEventListener("input",i),o.addEventListener("change",i)}this.show(o,t)}async previewFormRoute(t,n){let r=++this.routePreviewVersion,o=await this.currentForm?.snapshot();if(!o||r!==this.routePreviewVersion||!n.isConnected||this.closed)return;this.runtime.setFormAnswers(t,o);let i=this.runtime.route(),a=i.screen;if(!a)return;let s=n.querySelector(".bdf-progress");s&&(s.textContent=`Step ${i.position} of ${i.total}`);let l=n.querySelector(".bdv-submit");l&&(l.textContent=a.continueLabel??(i.hasNext?"Continue":"Submit"))}async back(t){if(!this.busy){if(this.busy=!0,t.type==="form"){let n=await this.currentForm?.snapshot();if(n===null||this.closed){this.busy=!1;return}n&&this.runtime.setFormAnswers(t.form,n)}this.runtime.back(),this.busy=!1,this.render("backward")}}async advance(t,n){if(!this.busy){if(this.busy=!0,t.type==="form"){let r=await this.currentForm?.collect();if(!r||this.closed){this.busy=!1;return}this.runtime.setFormAnswers(t.form,r)}if(t.type==="screenshot"){this.busy=!1,await this.capture(t,n);return}this.runtime.next()?(this.busy=!1,this.render("forward")):(this.busy=!1,await this.finish())}}async capture(t,n){let r=t.mode!=="optional"||!!n.querySelector("[data-screenshot]")?.checked;this.busy=!0,this.state.host.hidden=!0;let o=new AbortController;this.captureAbortController=o;let i;try{let a=await this.ports.capture(t,r,o.signal);if(this.closed)return;if(i=a.returnToForm?"backward":"forward",a.returnToForm)this.runtime.back();else if(this.runtime.capture=a,!this.runtime.next()){this.busy=!1,await this.finish();return}}finally{this.captureAbortController===o&&(this.captureAbortController=null),this.busy=!1,this.state.host.hidden=!1}this.closed||this.render(i)}async finish(){if(this.busy||this.closed)return;this.busy=!0;let t=Ve("Submitting feedback","Submitting\u2026");t.setAttribute("aria-busy","true"),this.show(t);try{let n=await this.ports.submit(this.runtime);if(this.closed)return;this.settle({status:"submitted",result:n}),this.busy=!1,this.show(Ko(this.definition,n,()=>this.close(!1)))}catch(n){if(this.closed)return;this.busy=!1,this.renderError(n instanceof Error?n.message:"Failed to submit feedback",()=>{this.finish()})}}renderError(t,n){this.show(Xo(t,this.definition.config.content?.cancelLabel??"Cancel",n,()=>this.close()))}show(t,n){Wo(t,`${this.instanceId}-surface-${++this.dialogVersion}`,this.definition.config.presentation.size??"default"),this.screenTransition.show(t,n),queueMicrotask(()=>(Yo(t)??t).focus())}close(t=!0){this.closed||(this.closed=!0,this.preflightVersion+=1,this.captureAbortController?.abort(),this.captureAbortController=null,t&&this.settle({status:"closed"}),this.disposeForm(),this.screenTransition.dispose(),this.state.dispose(),this.previousFocus?.isConnected&&this.previousFocus.focus())}settle(t){this.settled||(this.settled=!0,this.resolveOutcome(t))}disposeForm(){this.routePreviewVersion+=1,this.currentForm?.dispose(),this.currentForm=null}onKeydown(t){if(!(t instanceof KeyboardEvent))return;if(t.key==="Escape"){t.preventDefault(),this.close();return}if(t.key!=="Tab")return;let n=Jo(this.state.overlay);if(!n.length){t.preventDefault(),this.state.overlay.querySelector('[role="dialog"]')?.focus();return}let r=n[0],o=n.at(-1),i=this.state.shadow.activeElement;t.shiftKey&&(i===r||!this.state.overlay.contains(i))?(t.preventDefault(),o.focus()):!t.shiftKey&&i===o&&(t.preventDefault(),r.focus())}onBackdrop(t){t.target===this.state.overlay&&this.close()}};function oi(e,t,n){let r=zc(e.issue.title,t).trim().slice(0,256);if(!r)throw new TypeError("BugDrop flow Issue title cannot be empty");let o=(e.issue.sections??[]).map(i=>Ic(e,i,t,n)).filter(i=>i!==null);return{title:r,description:o.join(`

`),category:e.issue.classification??"bug"}}function zc(e,t){return e.replace(/{{\s*([^{}]+?)\s*}}/g,(n,r)=>ii(t[r.trim()]))}function Ic(e,t,n,r){let o="answer"in t?n[t.answer]:r[t.context];if(t.omitWhenEmpty&&(o==null||o===""))return null;let i=$c(e,t,o);return`## ${t.heading}

${i}`}function $c(e,t,n){let r=t.format,o=ii(n);if(r==="quote")return o.split(`
`).map(i=>`> ${i}`).join(`
`);if(r==="code")return Oc(o);if(r==="stars"&&typeof n=="number"&&"answer"in t){let i=ri(e,t.answer),a=i?.type==="rating"?i.scale??5:5;return`${"\u2605".repeat(n)}${"\u2606".repeat(Math.max(0,a-n))} (${n}/${a})`}if(r==="choice"&&typeof n=="string"&&"answer"in t){let i=ri(e,t.answer);if(i?.type==="singleChoice")return i.options.find(a=>a.value===n)?.label??o}return o}function Oc(e){let t=Math.max(0,...[...e.matchAll(/`+/g)].map(o=>o[0].length)),n="`".repeat(t+1),r=e.startsWith("`")||e.endsWith("`")?" ":"";return`${n}${r}${e}${r}${n}`}function ri(e,t){let n=t.indexOf("."),r=t.slice(0,n),o=t.slice(n+1);return e.forms.find(i=>i.id===r)?.fields.find(i=>i.id===o)}function ii(e){return e==null?"":typeof e=="string"?e.trim():String(e)}async function si(e,t,n,r,o){let i=oi(t,n,r),a=t.evidence?.attachments,s=t.evidence?.sendConsoleLogs,l=t.evidence?.submitter?.name,c=t.evidence?.submitter?.email,d=l||c?{name:ai(n[l??""]),email:ai(n[c??""])}:void 0,u=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(e.authTokenProvider)},body:JSON.stringify({repo:e.repo,title:i.title,description:i.description,category:i.category,categoryLabels:e.categoryLabels,screenshot:o?.screenshot??null,attachments:a?n[a]??[]:[],consoleLogs:s&&n[s]===!0?Mt():void 0,submitter:d&&(d.name||d.email)?d:void 0,metadata:Nc(o)})});if(u.status===429)throw new Error("Too many submissions. Please try again later.");let b=await u.json();if(!u.ok||b.success!==!0)throw new Error(typeof b.error=="string"?b.error:"Failed to submit feedback");if(!Number.isInteger(b.issueNumber)||b.issueNumber<=0||typeof b.issueUrl!="string"||typeof b.isPublic!="boolean"||!Bc(b.issueUrl,e.repo,b.issueNumber))throw new Error("BugDrop received an invalid Issue result");return{issueNumber:b.issueNumber,issueUrl:b.issueUrl,isPublic:b.isPublic,...Array.isArray(b.labelMappingWarnings)&&b.labelMappingWarnings.every(m=>typeof m=="string")?{labelMappingWarnings:b.labelMappingWarnings}:{}}}function Bc(e,t,n){try{let r=new URL(e);return r.origin==="https://github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function Nc(e){let t=new URL(window.location.href);return t.search="",t.hash="",{url:t.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:e?.elementSelector??null,fullElementSelector:e?.fullElementSelector??null,domNodeCount:Me(),fullPageDisabled:re(),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function ai(e){return typeof e=="string"&&e.trim()?e.trim():void 0}function li(e,t,n={isLegacyModalOpen:()=>!1}){let r=new Map;return{register(o){let i=jt(o);if(r.has(i.id))throw new TypeError(`BugDrop flow is already registered: ${i.id}`);let a=Ht(i);return r.set(i.id,a),Object.freeze({id:i.id,open(s){return n.isLegacyModalOpen()?(Wt(a,s),Oo(i.id)):ni(a,s,{...t,submit:l=>si(e,i,l.answers,l.context,l.capture)})}})}}}var lt="bugdrop_dismissed",_c="bugdrop_trigger_position_",gi="bugdrop_welcomed_",Hc="bugdrop_complex_screenshot_skipped_",Vc=10080*60*1e3,it=8,ci=16,di=5,ui=5*1024*1024,hi=["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"];function Uc(e){let t=[{name:"Edge",pattern:/Edg(?:e|A|iOS)?\/(\d+[\d.]*)/},{name:"Opera",pattern:/(?:OPR|Opera)\/(\d+[\d.]*)/},{name:"Chrome",pattern:/Chrome\/(\d+[\d.]*)/},{name:"Safari",pattern:/Version\/(\d+[\d.]*).*Safari/},{name:"Firefox",pattern:/Firefox\/(\d+[\d.]*)/}];for(let{name:n,pattern:r}of t){let o=e.match(r);if(o)return{name:n,version:o[1]||"unknown"}}return{name:"Unknown",version:"unknown"}}function qc(e){let t=[{name:"iOS",pattern:/iPhone OS (\d+[_\d]*)/,versionIndex:1},{name:"iOS",pattern:/iPad.*OS (\d+[_\d]*)/,versionIndex:1},{name:"macOS",pattern:/Mac OS X (\d+[_.\d]*)/,versionIndex:1},{name:"Windows",pattern:/Windows NT (\d+\.\d+)/,versionIndex:1},{name:"Android",pattern:/Android (\d+[\d.]*)/,versionIndex:1},{name:"Linux",pattern:/Linux/,versionIndex:void 0},{name:"Chrome OS",pattern:/CrOS/,versionIndex:void 0}];for(let{name:n,pattern:r,versionIndex:o}of t){let i=e.match(r);if(i){let a=o!==void 0&&i[o]?i[o].replace(/_/g,"."):"";return{name:n,version:a}}}return{name:"Unknown",version:""}}function yi(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return e.split("?")[0].split("#")[0]}}function Wc(){let e=navigator.userAgent;return{browser:Uc(e),os:qc(e),devicePixelRatio:window.devicePixelRatio||1,language:navigator.language||"unknown",url:yi(window.location.href)}}var jc=null,K=null,at=null,Y=!1,Gc=null,Ue=!1;function pi(e){try{let t=localStorage.getItem(lt);if(!t)return!1;if(t==="true")return!0;let n=parseInt(t,10);if(isNaN(n))return!1;if(e===void 0)return!0;let r=e*24*60*60*1e3;return Date.now()-n<r}catch{return!1}}function wi(){try{localStorage.setItem(lt,Date.now().toString())}catch{}}function vi(e){try{return localStorage.getItem(gi+e)!==null}catch{return!1}}function xi(e){try{localStorage.setItem(gi+e,Date.now().toString())}catch{}}function Dn(e){return`${Hc}${e}:${yi(window.location.href)}`}function Xc(e){try{let t=Dn(e),n=localStorage.getItem(t);if(!n)return!1;let r=parseInt(n,10);return isNaN(r)||Date.now()-r>Vc?(localStorage.removeItem(t),!1):!0}catch{return!1}}function Kc(e){try{localStorage.setItem(Dn(e),Date.now().toString())}catch{}}function Yc(e){try{localStorage.removeItem(Dn(e))}catch{}}function Ei(e,t){re()&&(Kc(e.repo),t.includeScreenshot=!1)}function Zc(e){if(!e)return;let t;try{t=JSON.parse(e)}catch(o){let i=o instanceof Error?`: ${o.message}`:"";console.warn(`[BugDrop] Invalid data-category-labels JSON${i}. Using default GitHub labels.`);return}if(!t||typeof t!="object"||Array.isArray(t)){console.warn("[BugDrop] Invalid data-category-labels: expected a JSON object. Using default GitHub labels.");return}let n=["bug","feature","question"],r={};for(let[o,i]of Object.entries(t)){if(!n.includes(o)){console.warn(`[BugDrop] Invalid data-category-labels: unknown category "${o}" (expected ${n.join(", ")}). Ignoring.`);continue}typeof i=="string"||Array.isArray(i)&&i.every(a=>typeof a=="string")?r[o]=i:console.warn(`[BugDrop] Invalid data-category-labels: value for "${o}" must be a string or string array. Ignoring.`)}return Object.keys(r).length>0?r:void 0}var R=document.currentScript||document.querySelector('script[src*="bugdrop"][src*="widget"]');document.currentScript||console.warn("[BugDrop] document.currentScript is null \u2014 do not use async or defer on the BugDrop script tag.");var st=R?.dataset.theme;st&&!Et(st)&&console.warn(`[BugDrop] Invalid data-theme "${st}". Expected "light", "dark", or "auto".`);var Jc=dr(R?.dataset.locale||document.documentElement.lang),mi=R?.dataset.requireName==="true",bi=R?.dataset.requireEmail==="true",rt=R?.dataset.position;rt&&rt!=="bottom-right"&&rt!=="bottom-left"&&console.warn(`[BugDrop] Invalid data-position "${rt}". Expected "bottom-right" or "bottom-left".`);var Si=R?.dataset.dismissDuration,ki=lr(Si);Si&&ki===void 0&&console.warn("[BugDrop] Invalid data-dismiss-duration. Expected a positive whole number of days.");var Ti=R?.dataset.screenshotScale,Ci=nn(Ti);Ti&&Ci===void 0&&console.warn("[BugDrop] Invalid data-screenshot-scale. Expected a non-negative number.");var Li=R?.dataset.elementContextMaxArea,Fi=nn(Li);Li&&Fi===void 0&&console.warn("[BugDrop] Invalid data-element-context-max-area. Expected a non-negative number.");var Ai=R?.dataset.shadow,Pi=pt(Ai);Ai&&!Pi&&console.warn('[BugDrop] Invalid data-shadow. Expected "soft", "hard", or "none".');var Ee=R?.dataset.showIssueLink,Mi=Ee==="always"||Ee==="never"?Ee:"public";Ee&&Ee!=="public"&&Ee!==Mi&&console.warn(`[BugDrop] Invalid data-show-issue-link "${Ee}". Expected "public", "always", or "never".`);var ot={repo:R?.dataset.repo||"",apiUrl:R?.src.replace(/\/widget(?:\.v[\d.]+)?\.js$/,"/api")||"",authTokenProvider:Zr(R?.dataset.authTokenProvider),position:rt==="bottom-left"?"bottom-left":"bottom-right",theme:Et(st)?st:"auto",showName:R?.dataset.showName==="true"||mi,requireName:mi,showEmail:R?.dataset.showEmail==="true"||bi,requireEmail:bi,buttonDismissible:R?.dataset.buttonDismissible==="true",dismissDuration:ki,showRestore:R?.dataset.showRestore!=="false",showButton:R?.dataset.button!=="false",accentColor:H(R?.dataset.color),iconUrl:je(R?.dataset.icon),label:R?.dataset.label||void 0,categoryLabels:Zc(R?.dataset.categoryLabels),font:Ae(R?.dataset.font),radius:Q(R?.dataset.radius)?.toString(),bgColor:H(R?.dataset.bg),textColor:H(R?.dataset.text),borderWidth:Q(R?.dataset.borderWidth)?.toString(),borderColor:H(R?.dataset.borderColor),shadow:Pi,welcome:(()=>{let e=R?.dataset.welcome;return e==="false"||e==="never"?"never":e==="always"?"always":"once"})(),screenshotMode:(()=>{let e=R?.dataset.screenshot;return e==="auto"||e==="required"?e:(e&&e!=="optional"&&console.warn(`[BugDrop] Invalid data-screenshot "${e}". Expected "optional", "auto", or "required".`),"optional")})(),screenshotScale:Ci,elementContextMaxArea:Fi,issueLinkVisibility:Mi,sendConsoleLogs:R?.dataset.sendConsoleLogs==="true",locale:Jc};pr(ot.locale);eo();ot.repo?/^[^/]+\/[^/]+$/.test(ot.repo)?td(ot):console.error(`[BugDrop] Invalid data-repo format "${ot.repo}". Expected "owner/repo" (e.g., "octocat/hello-world").`):console.error("[BugDrop] Missing data-repo attribute");function Qc(e){return e.label!==void 0?e.label:p().triggerLabel}function Ri(e,t){if(t.position==="bottom-left"&&e.appendChild(fi()),t.iconUrl!=="none"){let r=document.createElement("span");if(r.className="bd-trigger-icon",t.iconUrl){let o=document.createElement("img");o.src=t.iconUrl,o.alt="";let i=document.createElement("span");i.textContent="\u{1F41B}",i.style.display="none",o.addEventListener("error",()=>{o.style.display="none",i.style.display=""}),r.append(o,i)}else r.textContent="\u{1F41B}";e.appendChild(r)}let n=document.createElement("span");n.className="bd-trigger-label",n.textContent=Qc(t),e.appendChild(n),t.position!=="bottom-left"&&e.appendChild(fi())}function fi(){let e=document.createElement("span");return e.className="bd-trigger-drag-handle",e.setAttribute("aria-hidden","true"),e.title=p().dragHandleTitle,e.innerHTML=`
    <svg viewBox="0 0 12 24" aria-hidden="true" focusable="false">
      <circle cx="4" cy="5" r="1.5" fill="currentColor"></circle>
      <circle cx="8" cy="5" r="1.5" fill="currentColor"></circle>
      <circle cx="4" cy="9.5" r="1.5" fill="currentColor"></circle>
      <circle cx="8" cy="9.5" r="1.5" fill="currentColor"></circle>
      <circle cx="4" cy="14" r="1.5" fill="currentColor"></circle>
      <circle cx="8" cy="14" r="1.5" fill="currentColor"></circle>
      <circle cx="4" cy="18.5" r="1.5" fill="currentColor"></circle>
      <circle cx="8" cy="18.5" r="1.5" fill="currentColor"></circle>
    </svg>
  `,e}function Di(e,t=!1){let n=["bd-trigger",`bd-trigger--${e.position==="bottom-left"?"left":"right"}`];return t&&n.push("bd-trigger--restoring"),n.join(" ")}function zi(e){return`${_c}${e.repo}_${e.position}`}function Ii(e){try{let t=localStorage.getItem(zi(e));if(!t)return null;let n=Number(t);return Number.isFinite(n)?n:null}catch{return null}}function $i(e,t){try{localStorage.setItem(zi(e),String(Math.round(t)))}catch{}}function ed(e,t){let n=e.getBoundingClientRect(),r=Math.max(it,window.innerHeight-n.height-it);return Math.min(Math.max(t,it),r)}function Gt(e,t){let n=ed(e,t);return e.style.top=`${n}px`,e.style.bottom="auto",n}function Oi(e,t){let n=Ii(t);n!==null&&(e.classList.add("bd-trigger--positioned"),Gt(e,n))}function Pn(e,t){if(!e.style.top)return;let n=e.getBoundingClientRect();if(n.width===0||n.height===0)return;let r=parseFloat(e.style.top);if(!Number.isFinite(r))return;let o=e.classList.contains("bd-trigger--dragging")?r:Ii(t)??r;Gt(e,o)}function Bi(e,t){let n=()=>{if(!e.isConnected){r();return}Pn(e,t)},r=()=>{window.removeEventListener("resize",n),window.visualViewport?.removeEventListener("resize",n)};window.addEventListener("resize",n),window.visualViewport?.addEventListener("resize",n)}function Ni(e,t){let n=e.querySelector(".bd-trigger-drag-handle");if(!n)return;let r=null,o=0,i=0,a=!1,s=()=>{r!==null&&(r=null,e.classList.remove("bd-trigger--dragging"),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",c),window.removeEventListener("pointercancel",d),a&&($i(t,e.getBoundingClientRect().top),window.setTimeout(()=>{Ue=!1},0)))};function l(u){if(r!==u.pointerId)return;let b=i+u.clientY-o;Math.abs(u.clientY-o)>3&&(a=!0,Ue=!0),Gt(e,b)}function c(u){r===u.pointerId&&s()}function d(u){r===u.pointerId&&s()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation();let b=e.getBoundingClientRect();r=u.pointerId,o=u.clientY,i=b.top,a=!1,e.classList.add("bd-trigger--dragging"),n.setPointerCapture(u.pointerId),window.addEventListener("pointermove",l),window.addEventListener("pointerup",c),window.addEventListener("pointercancel",d)}),n.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation()})}function _i(e,t){e.addEventListener("keydown",n=>{if(n.target!==e||!["ArrowUp","ArrowDown","Home","End"].includes(n.key))return;n.preventDefault(),n.stopPropagation();let r=e.getBoundingClientRect(),o=window.innerHeight-r.height-it,i=n.key==="ArrowUp"?r.top-ci:n.key==="ArrowDown"?r.top+ci:n.key==="Home"?it:o;e.classList.add("bd-trigger--positioned"),$i(t,Gt(e,i))})}function Mn(e,t){let n=document.createElement("div");n.className=t.position==="bottom-left"?"bd-pull-tab bd-pull-tab--left":"bd-pull-tab",n.innerHTML='<span class="bd-pull-tab-chevron">\u2039</span>',n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-label",p().pullTabAriaLabel);let r=()=>{try{localStorage.removeItem(lt)}catch{}n.remove(),at=null,Hi(e,t,!0)};return n.addEventListener("click",r),n.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),r())}),e.appendChild(n),at=n,n}function td(e){if(Gc=e,!e.buttonDismissible)try{localStorage.removeItem(lt)}catch{}let t=document.createElement("div");t.id="bugdrop-host",t.style.pointerEvents="auto",document.body.appendChild(t);let n=t.attachShadow({mode:"open"});de(t);for(let i of["keydown","keypress","keyup"])n.addEventListener(i,a=>{let s=a.target;(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&a.stopPropagation()});let r=Ir(n,e);if(jc=r,e.showButton&&!(e.buttonDismissible&&pi(e.dismissDuration))){let i=document.createElement("button");if(i.className=Di(e),Ri(i,e),i.setAttribute("aria-label",p().triggerAriaLabel),e.buttonDismissible){let a=document.createElement("button");a.className="bd-trigger-close",a.textContent="\xD7",a.setAttribute("aria-label",p().dismissButtonAriaLabel),i.appendChild(a),a.addEventListener("click",s=>{s.stopPropagation(),wi(),i.classList.remove("bd-trigger--restoring"),i.classList.add("bd-trigger--dismissing"),i.addEventListener("animationend",()=>{i.remove(),K=null,e.showRestore&&Mn(r,e)},{once:!0})})}r.appendChild(i),K=i,Oi(i,e),Bi(i,e),Ni(i,e),_i(i,e),i.addEventListener("click",()=>{if(Ue){Ue=!1;return}zn(r,e)})}else e.showButton&&e.buttonDismissible&&e.showRestore&&pi(e.dismissDuration)&&Mn(r,e);nd(r,e),window.dispatchEvent(new CustomEvent("bugdrop:ready"))}function nd(e,t){let n=t.theme,r,o;window.BugDrop={open:()=>{Y||zn(e,t,{skipWelcome:!0})},close:()=>{if(Y){let i=e.querySelector(".bd-modal");i&&i.remove(),Y=!1}},hide:()=>{K&&(K.style.display="none")},show:()=>{try{localStorage.removeItem(lt)}catch{}at&&(at.remove(),at=null),K?(K.style.display="",Pn(K,t),window.requestAnimationFrame(()=>{K&&Pn(K,t)})):t.showButton&&Hi(e,t)},isOpen:()=>Y,isButtonVisible:()=>K!==null&&K.style.display!=="none",setTheme:i=>{if(!Et(i)){console.warn(`[BugDrop] Invalid theme ${String(i)}. Expected 'light' | 'dark' | 'auto'.`);return}n=i;let a=De(i);Ye(e,a),Ze(e,t,a)},registerVariant:i=>(r??=vo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider},{isLegacyModalOpen:()=>Y}),r.register(i)),registerFlow:i=>(o??=li({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,categoryLabels:t.categoryLabels},{preflight:()=>In(t),capture:async(a,s,l)=>await Lt(e,{...t,screenshotMode:a.mode},s,()=>{},l)},{isLegacyModalOpen:()=>Y}),o.register(i))},St(i=>{n==="auto"&&(Ye(e,i),Ze(e,t,i))})}function Hi(e,t,n=!1){let r=document.createElement("button");if(r.className=Di(t,n),Ri(r,t),r.setAttribute("aria-label",p().triggerAriaLabel),t.buttonDismissible){let o=document.createElement("button");o.className="bd-trigger-close",o.textContent="\xD7",o.setAttribute("aria-label",p().dismissButtonAriaLabel),r.appendChild(o),o.addEventListener("click",i=>{i.stopPropagation(),wi(),r.classList.remove("bd-trigger--restoring"),r.classList.add("bd-trigger--dismissing"),r.addEventListener("animationend",()=>{r.remove(),K=null,t.showRestore&&Mn(e,t)},{once:!0})})}e.appendChild(r),K=r,Oi(r,t),Bi(r,t),Ni(r,t),_i(r,t),r.addEventListener("click",()=>{if(Ue){Ue=!1;return}zn(e,t)})}async function zn(e,t,n){if(Y)return;Ie(),Y=!0;let r=void 0;if(r==="private"||r!=="fixed"&&!0){if(await od(e,t,n)==="preflight-blocked")return}else{let{status:i,appName:a}=await In(t);if(i==="not_installed"){Rn(e,t,void 0,a);return}if(i==="unreachable"){Rn(e,t,p().apiUnreachableMessage,a);return}await rd(e,t,n)}Y=!1}async function rd(e,t,n){if(!(n?.skipWelcome||t.welcome==="never"||t.welcome==="once"&&vi(t.repo))){if(!await Vi(e)){Y=!1;return}t.welcome==="once"&&xi(t.repo)}let o=null;for(;;){if(o=await Ui(e,t,o),!o){Y=!1;return}let i=o,a=await Lt(e,t,i.includeScreenshot,()=>Ei(t,i));if(!a.returnToForm){await $n(e,t,{title:o.title,description:o.description,category:o.category,name:o.name,email:o.email,screenshot:a.screenshot,attachments:o.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?fe(t.accentColor):null,sendConsoleLogs:o.sendConsoleLogs});break}}}async function od(e,t,n){let r=$o({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,welcome:t.welcome,screenshotMode:t.screenshotMode,skipWelcome:!!n?.skipWelcome,hasSeenWelcome:vi(t.repo),showName:t.showName,requireName:t.requireName,showEmail:t.showEmail,requireEmail:t.requireEmail,sendConsoleLogs:t.sendConsoleLogs,screenshotScale:t.screenshotScale,elementContextMaxArea:t.elementContextMaxArea,accentColor:t.accentColor,categoryLabels:t.categoryLabels,issueLinkVisibility:t.issueLinkVisibility});return Eo(r,{preflight:o=>In(t,{repo:o.repo,apiUrl:o.apiUrl,authTokenProvider:o.authTokenProvider}),showPreflightFailure:o=>Rn(e,t,o.status==="unreachable"?p().apiUnreachableMessage:void 0,o.appName),showWelcome:()=>Vi(e),rememberWelcome:()=>xi(r.steps[1].repo),showDetails:(o,i)=>Ui(e,{...t,repo:o.repo,showName:o.showName,requireName:o.requireName,showEmail:o.showEmail,requireEmail:o.requireEmail,sendConsoleLogs:o.sendConsoleLogs,screenshotMode:r.steps[2].mode},i),capture:async(o,i)=>{let a={...t,repo:o.repo,screenshotMode:o.mode,screenshotScale:o.screenshotScale,elementContextMaxArea:o.elementContextMaxArea,accentColor:o.accentColor},s=await Lt(e,a,i.includeScreenshot,()=>Ei(a,i));return{...s,returnToDetails:s.returnToForm}},submit:(o,i,a)=>$n(e,{...t,repo:o.repo,apiUrl:o.apiUrl,authTokenProvider:o.authTokenProvider,categoryLabels:o.categoryLabels,issueLinkVisibility:o.issueLinkVisibility},{title:i.title,description:i.description,category:i.category,name:i.name,email:i.email,screenshot:a.screenshot,attachments:i.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?fe(t.accentColor):null,sendConsoleLogs:i.sendConsoleLogs})})}async function In(e,t=e){try{let n=await fetch(`${t.apiUrl}/check/${t.repo}`,{headers:await he(t.authTokenProvider)});if(!n.ok)return{status:"unreachable"};let r=await n.json();return Number.isSafeInteger(r.maxScreenshotSizeBytes)&&r.maxScreenshotSizeBytes>0&&(e.maxScreenshotSizeBytes=r.maxScreenshotSizeBytes),{status:r.installed===!0?"installed":"not_installed",appName:r.appName}}catch{return{status:"unreachable"}}}function Rn(e,t,n,r){let i=`https://github.com/apps/${r||(t.apiUrl.includes("bugdrop.neonwatty.workers.dev")?"neonwatty-bugdrop":t.apiUrl.replace(/https?:\/\//,"").replace(/\..*/,""))}/installations/new`,a=n||p().installRequiredMessage,s=n?p().connectionErrorTitle:p().installRequiredTitle,l=U(e,s,`
      <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${W(a)}</p>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${x(p().cancel)}</button>
        ${n?"":`<a href="${i}" target="_blank" class="bd-btn bd-btn-primary" style="text-decoration: none;">${x(p().installApp)}</a>`}
      </div>
    `,!0),c=l.querySelector(".bd-close"),d=l.querySelector('[data-action="cancel"]');c?.addEventListener("click",()=>{l.remove(),Y=!1}),d?.addEventListener("click",()=>{l.remove(),Y=!1})}function Vi(e){return new Promise(t=>{let n=U(e,p().welcomeTitle,`
        <div style="text-align: center; padding: 8px 0 16px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">\u{1F4AC}</div>
          <p style="margin: 0 0 12px; color: var(--bd-text-primary); font-size: 1.05rem; font-weight: 500;">
            ${x(p().welcomeHeadline)}
          </p>
          <p style="margin: 0 0 8px; color: var(--bd-text-secondary); font-size: 0.95rem; line-height: 1.6;">
            ${x(p().welcomeBodyLine1)}<br/>
            ${x(p().welcomeBodyLine2)}
          </p>
        </div>
        <div class="bd-actions" style="justify-content: center;">
          <button class="bd-btn bd-btn-primary" data-action="continue">${x(p().getStarted)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="continue"]');r?.addEventListener("click",()=>{n.remove(),t(!1)}),o?.addEventListener("click",()=>{n.remove(),t(!0)})})}function Ui(e,t,n){return new Promise(r=>{let o=t.showName?`
          <div class="bd-form-group">
            <label class="bd-label" for="name">${x(p().nameLabel)}${t.requireName?" *":""}</label>
            <input type="text" id="name" class="bd-input" ${t.requireName?"required":""} placeholder="${x(p().namePlaceholder)}" value="${W(n?.name||"")}" />
          </div>
        `:"",i=t.showEmail?`
          <div class="bd-form-group">
            <label class="bd-label" for="email">${x(p().emailLabel)}${t.requireEmail?" *":""}</label>
            <input type="email" id="email" class="bd-input" ${t.requireEmail?"required":""} placeholder="${x(p().emailPlaceholder)}" value="${W(n?.email||"")}" />
          </div>
        `:"",a=U(e,p().feedbackFormTitle,`
        <form id="feedback-form">
          <div class="bd-form-group">
            <label class="bd-label">${x(p().categoryLabel)}</label>
            <div class="bd-category-selector" style="display: flex; gap: 8px; margin-top: 6px;">
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="bug" ${Fn(n,"bug")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u{1F41B} ${x(p().categoryBug)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="feature" ${Fn(n,"feature")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2728 ${x(p().categoryFeature)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="question" ${Fn(n,"question")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2753 ${x(p().categoryQuestion)}</span>
              </label>
            </div>
          </div>
          <div class="bd-form-group">
            <label class="bd-label" for="title">${x(p().titleLabel)} *</label>
            <input type="text" id="title" class="bd-input" required placeholder="${x(p().titlePlaceholder)}" value="${W(n?.title||"")}" />
          </div>
          <div class="bd-form-group">
            <label class="bd-label" for="description">${x(p().descriptionLabel)}</label>
            <textarea id="description" class="bd-textarea" placeholder="${x(p().descriptionPlaceholder)}">${W(n?.description||"")}</textarea>
          </div>
          ${o}
          ${i}
          <div class="bd-evidence-block">
            <div class="bd-evidence-row">
              ${cd(t,n)}
              ${id()}
            </div>
            <input type="file" id="attachment-upload" accept="${hi.join(",")}" multiple class="bd-upload-input" />
            <div id="attachment-list" class="bd-upload-list" aria-live="polite">${n?.attachments.length,""}</div>
            <p id="attachment-error" class="bd-field-error" hidden></p>
            ${dd(t,n)}
          </div>
          <div class="bd-actions">
            <button type="button" class="bd-btn bd-btn-secondary" data-action="cancel">${x(p().cancel)}</button>
            <button type="submit" class="bd-btn bd-btn-primary" id="submit-btn">${t.screenshotMode==="auto"?x(p().submit):x(p().continueButton)}</button>
          </div>
        </form>
      `),s=a.querySelector("#feedback-form"),l=a.querySelector("#name"),c=a.querySelector("#email"),d=a.querySelector("#title"),u=a.querySelector("#description"),b=a.querySelector("#include-screenshot"),m=a.querySelector("#attachment-upload"),f=a.querySelector('[data-action="choose-uploads"]'),h=a.querySelector("#attachment-list"),S=a.querySelector("#attachment-error"),T=a.querySelector("#send-console-logs"),F=a.querySelector(".bd-close"),P=a.querySelector('[data-action="cancel"]'),L=[...n?.attachments??[]],D=()=>{a.remove(),r(null)};F?.addEventListener("click",D),P?.addEventListener("click",D),s.addEventListener("submit",A=>{if(A.preventDefault(),!d.value.trim()){d.classList.add("bd-input--error"),d.focus();return}if(t.requireName&&l&&!l.value.trim()){l.classList.add("bd-input--error"),l.focus();return}if(t.requireEmail&&c&&!c.value.trim()){c.classList.add("bd-input--error"),c.focus();return}let z=a.querySelector('input[name="category"]:checked')?.value||"bug",$=t.screenshotMode==="optional"?b?.checked??!1:!0;t.screenshotMode==="optional"&&$&&Yc(t.repo),a.remove(),r({title:d.value.trim(),description:u.value.trim(),category:z,name:l?.value.trim()||void 0,email:c?.value.trim()||void 0,includeScreenshot:$,attachments:L,sendConsoleLogs:T.checked})}),d.addEventListener("input",()=>d.classList.remove("bd-input--error")),l?.addEventListener("input",()=>l.classList.remove("bd-input--error")),c?.addEventListener("input",()=>c.classList.remove("bd-input--error"));let v=()=>{sd(h,L,A=>{L=L.filter((I,z)=>z!==A),v()})};f.addEventListener("click",()=>m.click()),m.addEventListener("change",async()=>{let A=Array.from(m.files??[]);m.value="",S.textContent="",S.hidden=!0;let I=di-L.length;if(A.length>I){Ln(S,p().uploadTooMany(di));return}for(let z of A){let $=ad(z);if($){Ln(S,$);return}}try{let z=await Promise.all(A.map(ld));L=[...L,...z],v()}catch{Ln(S,p().uploadReadError)}}),v()})}function id(){return`
    <div class="bd-upload-group">
      <div class="bd-upload-row" aria-label="${x(p().uploadsAriaLabel)}">
        <button type="button" class="bd-btn bd-btn-secondary bd-upload-button" data-action="choose-uploads" aria-label="${x(p().uploadFilesAriaLabel)}">
          <svg class="bd-upload-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M8 11V3" />
            <path d="M4.5 6.5 8 3l3.5 3.5" />
            <path d="M3 12.5h10" />
          </svg>
          ${x(p().uploadButton)}
        </button>
      </div>
    </div>
  `}function ad(e){return hi.includes(e.type)?e.size>ui?p().uploadTooLarge(qi(ui)):null:p().uploadUnsupportedType}function Ln(e,t){e.textContent=t,e.hidden=!1}function sd(e,t,n){e.innerHTML=t.map((r,o)=>`
        <div class="bd-upload-item">
          <span class="bd-upload-item__name">${W(r.name)}</span>
          <span class="bd-upload-item__meta">${qi(r.size)}</span>
          <button type="button" class="bd-upload-remove" data-index="${o}" aria-label="${x(p().removeAttachmentAriaLabel(r.name))}">&times;</button>
        </div>
      `).join(""),e.querySelectorAll(".bd-upload-remove").forEach(r=>{r.addEventListener("click",()=>{let o=Number(r.dataset.index);Number.isInteger(o)&&n(o)})})}function ld(e){return new Promise((t,n)=>{let r=new FileReader;r.addEventListener("load",()=>{if(typeof r.result!="string"){n(new Error("Could not read file."));return}t({name:e.name,type:e.type,size:e.size,dataUrl:r.result})}),r.addEventListener("error",()=>n(new Error("Could not read file."))),r.readAsDataURL(e)})}function qi(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${Math.round(e/(1024*1024)*10)/10} MB`}function cd(e,t){if(e.screenshotMode==="auto"){let r=Re()>0?` ${x(p().screenshotAutoRedactionNote)}`:"";return`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${x(p().screenshotAutoNote)}${r}
      </p>
    `}return e.screenshotMode==="required"?`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${x(p().screenshotRequiredNote)}
      </p>
    `:`
    <div class="bd-screenshot-control">
      <input type="checkbox" id="include-screenshot" ${t?.includeScreenshot??(!re()||!Xc(e.repo))?"checked":""} class="bd-checkbox" />
      <label for="include-screenshot" class="bd-checkbox-label">
        ${x(p().includeScreenshotLabel)}
      </label>
    </div>
  `}function dd(e,t){return`
    <div class="bd-form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
      <input type="checkbox" id="send-console-logs" ${t?.sendConsoleLogs??e.sendConsoleLogs?"checked":""} style="width: 18px; height: 18px; accent-color: var(--bd-primary); cursor: pointer;" />
      <label for="send-console-logs" style="font-size: 0.95rem; color: var(--bd-text-secondary); cursor: pointer; user-select: none;">
        ${x(p().sendConsoleLogsLabel)}
      </label>
    </div>
  `}function Fn(e,t){return(e?.category||"bug")===t?"checked":""}async function $n(e,t,n){let r=U(e,p().submittingTitle,`
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <div class="bd-spinner bd-spinner--lg"></div>
        <p class="bd-loading-text" style="margin-top: 12px;">${x(p().creatingIssue)}</p>
      </div>
    `);try{let o=n.name||n.email?{name:n.name,email:n.email}:void 0,i=Wc(),a=Me(),s=n.sendConsoleLogs?Mt():void 0,l=await fetch(`${t.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(t.authTokenProvider)},body:JSON.stringify({repo:t.repo,title:n.title,description:n.description,category:n.category,categoryLabels:t.categoryLabels,screenshot:n.screenshot,attachments:n.attachments,consoleLogs:s,submitter:o,metadata:{url:i.url,userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:n.elementSelector,fullElementSelector:n.fullElementSelector,selectedElementHighlightColor:n.selectedElementHighlightColor||void 0,domNodeCount:a,fullPageDisabled:re(),browser:i.browser,os:i.os,devicePixelRatio:i.devicePixelRatio,language:i.language}})});if(r.remove(),l.status===429){let d=l.headers.get("Retry-After"),u=d?Math.ceil(parseInt(d,10)/60):15;An(e,t,n,p().rateLimited(u));return}let c=await l.json();c.success?await $r(e,c.issueNumber,c.issueUrl,c.isPublic??!1,t.issueLinkVisibility):An(e,t,n,c.error||p().submitFailedFallback)}catch{r.remove(),An(e,t,n,p().networkError)}}function An(e,t,n,r){let o=U(e,p().submissionFailedTitle,`
      <div class="bd-error-message">
        <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
        <span class="bd-error-message__text">${W(r)}</span>
      </div>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${x(p().cancel)}</button>
        <button class="bd-btn bd-btn-primary" data-action="retry">${x(p().tryAgain)}</button>
      </div>
    `,!0),i=o.querySelector(".bd-close"),a=o.querySelector('[data-action="cancel"]'),s=o.querySelector('[data-action="retry"]');i?.addEventListener("click",()=>o.remove()),a?.addEventListener("click",()=>o.remove()),s?.addEventListener("click",async()=>{o.remove(),await $n(e,t,n)})}})();
