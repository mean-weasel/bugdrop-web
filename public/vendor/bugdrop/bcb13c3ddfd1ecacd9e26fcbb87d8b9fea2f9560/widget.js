"use strict";(()=>{function An(e,t){if(e.match(/^[a-z]+:\/\//i))return e;if(e.match(/^\/\//))return window.location.protocol+e;if(e.match(/^[a-z]+:/i))return e;let n=document.implementation.createHTMLDocument(),r=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(o),t&&(r.href=t),o.href=e,o.href}var Rn=(()=>{let e=0,t=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(e+=1,`u${t()}${e}`)})();function Z(e){let t=[];for(let n=0,r=e.length;n<r;n++)t.push(e[n]);return t}var xe=null;function lt(e={}){return xe||(e.includeStyleProperties?(xe=e.includeStyleProperties,xe):(xe=Z(window.getComputedStyle(document.documentElement)),xe))}function st(e,t){let r=(e.ownerDocument.defaultView||window).getComputedStyle(e).getPropertyValue(t);return r?parseFloat(r.replace("px","")):0}function Si(e){let t=st(e,"border-left-width"),n=st(e,"border-right-width");return e.clientWidth+t+n}function Ci(e){let t=st(e,"border-top-width"),n=st(e,"border-bottom-width");return e.clientHeight+t+n}function qt(e,t={}){let n=t.width||Si(e),r=t.height||Ci(e);return{width:n,height:r}}function Mn(){let e,t;try{t=process}catch{}let n=t&&t.env?t.env.devicePixelRatio:null;return n&&(e=parseInt(n,10),Number.isNaN(e)&&(e=1)),e||window.devicePixelRatio||1}var W=16384;function Dn(e){(e.width>W||e.height>W)&&(e.width>W&&e.height>W?e.width>e.height?(e.height*=W/e.width,e.width=W):(e.width*=W/e.height,e.height=W):e.width>W?(e.height*=W/e.width,e.width=W):(e.width*=W/e.height,e.height=W))}function Ee(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>t(r))})},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=e})}async function Ti(e){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(e)).then(encodeURIComponent).then(t=>`data:image/svg+xml;charset=utf-8,${t}`)}async function In(e,t,n){let r="http://www.w3.org/2000/svg",o=document.createElementNS(r,"svg"),i=document.createElementNS(r,"foreignObject");return o.setAttribute("width",`${t}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${t} ${n}`),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("x","0"),i.setAttribute("y","0"),i.setAttribute("externalResourcesRequired","true"),o.appendChild(i),i.appendChild(e),Ti(o)}var _=(e,t)=>{if(e instanceof t)return!0;let n=Object.getPrototypeOf(e);return n===null?!1:n.constructor.name===t.name||_(n,t)};function Li(e){let t=e.getPropertyValue("content");return`${e.cssText} content: '${t.replace(/'|"/g,"")}';`}function Fi(e,t){return lt(t).map(n=>{let r=e.getPropertyValue(n),o=e.getPropertyPriority(n);return`${n}: ${r}${o?" !important":""};`}).join(" ")}function Pi(e,t,n,r){let o=`.${e}:${t}`,i=n.cssText?Li(n):Fi(n,r);return document.createTextNode(`${o}{${i}}`)}function zn(e,t,n,r){let o=window.getComputedStyle(e,n),i=o.getPropertyValue("content");if(i===""||i==="none")return;let a=Rn();try{t.className=`${t.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(Pi(a,n,o,r)),t.appendChild(s)}function $n(e,t,n){zn(e,t,":before",n),zn(e,t,":after",n)}var On="application/font-woff",Nn="image/jpeg",Ai={woff:On,woff2:On,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:Nn,jpeg:Nn,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Ri(e){let t=/\.([^./]*?)$/g.exec(e);return t?t[1]:""}function ke(e){let t=Ri(e).toLowerCase();return Ai[t]||""}function Mi(e){return e.split(/,/)[1]}function He(e){return e.search(/^(data:)/)!==-1}function jt(e,t){return`data:${t};base64,${e}`}async function Gt(e,t,n){let r=await fetch(e,t);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);let o=await r.blob();return new Promise((i,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{i(n({res:r,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var Wt={};function Di(e,t,n){let r=e.replace(/\?.*/,"");return n&&(r=e),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),t?`[${t}]${r}`:r}async function Se(e,t,n){let r=Di(e,t,n.includeQueryParams);if(Wt[r]!=null)return Wt[r];n.cacheBust&&(e+=(/\?/.test(e)?"&":"?")+new Date().getTime());let o;try{let i=await Gt(e,n.fetchRequestInit,({res:a,result:s})=>(t||(t=a.headers.get("Content-Type")||""),Mi(s)));o=jt(i,t)}catch(i){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${e}`;i&&(a=typeof i=="string"?i:i.message),a&&console.warn(a)}return Wt[r]=o,o}async function Ii(e){let t=e.toDataURL();return t==="data:,"?e.cloneNode(!1):Ee(t)}async function zi(e,t){if(e.currentSrc){let i=document.createElement("canvas"),a=i.getContext("2d");i.width=e.clientWidth,i.height=e.clientHeight,a?.drawImage(e,0,0,i.width,i.height);let s=i.toDataURL();return Ee(s)}let n=e.poster,r=ke(n),o=await Se(n,r,t);return Ee(o)}async function $i(e,t){var n;try{if(!((n=e?.contentDocument)===null||n===void 0)&&n.body)return await Ve(e.contentDocument.body,t,!0)}catch{}return e.cloneNode(!1)}async function Oi(e,t){return _(e,HTMLCanvasElement)?Ii(e):_(e,HTMLVideoElement)?zi(e,t):_(e,HTMLIFrameElement)?$i(e,t):e.cloneNode(Bn(e))}var Ni=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SLOT",Bn=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SVG";async function Bi(e,t,n){var r,o;if(Bn(t))return t;let i=[];return Ni(e)&&e.assignedNodes?i=Z(e.assignedNodes()):_(e,HTMLIFrameElement)&&(!((r=e.contentDocument)===null||r===void 0)&&r.body)?i=Z(e.contentDocument.body.childNodes):i=Z(((o=e.shadowRoot)!==null&&o!==void 0?o:e).childNodes),i.length===0||_(e,HTMLVideoElement)||await i.reduce((a,s)=>a.then(()=>Ve(s,n)).then(l=>{l&&t.appendChild(l)}),Promise.resolve()),t}function _i(e,t,n){let r=t.style;if(!r)return;let o=window.getComputedStyle(e);o.cssText?(r.cssText=o.cssText,r.transformOrigin=o.transformOrigin):lt(n).forEach(i=>{let a=o.getPropertyValue(i);i==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),_(e,HTMLIFrameElement)&&i==="display"&&a==="inline"&&(a="block"),i==="d"&&t.getAttribute("d")&&(a=`path(${t.getAttribute("d")})`),r.setProperty(i,a,o.getPropertyPriority(i))})}function Hi(e,t){_(e,HTMLTextAreaElement)&&(t.innerHTML=e.value),_(e,HTMLInputElement)&&t.setAttribute("value",e.value)}function Vi(e,t){if(_(e,HTMLSelectElement)){let r=Array.from(t.children).find(o=>e.value===o.getAttribute("value"));r&&r.setAttribute("selected","")}}function Ui(e,t,n){return _(t,Element)&&(_i(e,t,n),$n(e,t,n),Hi(e,t),Vi(e,t)),t}async function qi(e,t){let n=e.querySelectorAll?e.querySelectorAll("use"):[];if(n.length===0)return e;let r={};for(let i=0;i<n.length;i++){let s=n[i].getAttribute("xlink:href");if(s){let l=e.querySelector(s),d=document.querySelector(s);!l&&d&&!r[s]&&(r[s]=await Ve(d,t,!0))}}let o=Object.values(r);if(o.length){let i="http://www.w3.org/1999/xhtml",a=document.createElementNS(i,"svg");a.setAttribute("xmlns",i),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(i,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);e.appendChild(a)}return e}async function Ve(e,t,n){return!n&&t.filter&&!t.filter(e)?null:Promise.resolve(e).then(r=>Oi(r,t)).then(r=>Bi(e,r,t)).then(r=>Ui(e,r,t)).then(r=>qi(r,t))}var _n=/url\((['"]?)([^'"]+?)\1\)/g,Wi=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,ji=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Gi(e){let t=e.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`,"g")}function Xi(e){let t=[];return e.replace(_n,(n,r,o)=>(t.push(o),n)),t.filter(n=>!He(n))}async function Ki(e,t,n,r,o){try{let i=n?An(t,n):t,a=ke(t),s;if(o){let l=await o(i);s=jt(l,a)}else s=await Se(i,a,r);return e.replace(Gi(t),`$1${s}$3`)}catch{}return e}function Yi(e,{preferredFontFormat:t}){return t?e.replace(ji,n=>{for(;;){let[r,,o]=Wi.exec(n)||[];if(!o)return"";if(o===t)return`src: ${r};`}}):e}function Xt(e){return e.search(_n)!==-1}async function ct(e,t,n){if(!Xt(e))return e;let r=Yi(e,n);return Xi(r).reduce((i,a)=>i.then(s=>Ki(s,a,t,n)),Promise.resolve(r))}async function Ce(e,t,n){var r;let o=(r=t.style)===null||r===void 0?void 0:r.getPropertyValue(e);if(o){let i=await ct(o,null,n);return t.style.setProperty(e,i,t.style.getPropertyPriority(e)),!0}return!1}async function Zi(e,t){await Ce("background",e,t)||await Ce("background-image",e,t),await Ce("mask",e,t)||await Ce("-webkit-mask",e,t)||await Ce("mask-image",e,t)||await Ce("-webkit-mask-image",e,t)}async function Ji(e,t){let n=_(e,HTMLImageElement);if(!(n&&!He(e.src))&&!(_(e,SVGImageElement)&&!He(e.href.baseVal)))return;let r=n?e.src:e.href.baseVal,o=await Se(r,ke(r),t);await new Promise((i,a)=>{e.onload=i,e.onerror=t.onImageErrorHandler?(...l)=>{try{i(t.onImageErrorHandler(...l))}catch(d){a(d)}}:a;let s=e;s.decode&&(s.decode=i),s.loading==="lazy"&&(s.loading="eager"),n?(e.srcset="",e.src=o):e.href.baseVal=o})}async function Qi(e,t){let r=Z(e.childNodes).map(o=>Kt(o,t));await Promise.all(r).then(()=>e)}async function Kt(e,t){_(e,Element)&&(await Zi(e,t),await Ji(e,t),await Qi(e,t))}function Hn(e,t){let{style:n}=e;t.backgroundColor&&(n.backgroundColor=t.backgroundColor),t.width&&(n.width=`${t.width}px`),t.height&&(n.height=`${t.height}px`);let r=t.style;return r!=null&&Object.keys(r).forEach(o=>{n[o]=r[o]}),e}var Vn={};async function Un(e){let t=Vn[e];if(t!=null)return t;let r=await(await fetch(e)).text();return t={url:e,cssText:r},Vn[e]=t,t}async function qn(e,t){let n=e.cssText,r=/url\(["']?([^"')]+)["']?\)/g,i=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(r,"$1");return s.startsWith("https://")||(s=new URL(s,e.url).href),Gt(s,t.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(i).then(()=>n)}function Wn(e){if(e==null)return[];let t=[],n=/(\/\*[\s\S]*?\*\/)/gi,r=e.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(r);if(l===null)break;t.push(l[0])}r=r.replace(o,"");let i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=i.exec(r);if(l===null){if(l=s.exec(r),l===null)break;i.lastIndex=s.lastIndex}else s.lastIndex=i.lastIndex;t.push(l[0])}return t}async function ea(e,t){let n=[],r=[];return e.forEach(o=>{if("cssRules"in o)try{Z(o.cssRules||[]).forEach((i,a)=>{if(i.type===CSSRule.IMPORT_RULE){let s=a+1,l=i.href,d=Un(l).then(c=>qn(c,t)).then(c=>Wn(c).forEach(u=>{try{o.insertRule(u,u.startsWith("@import")?s+=1:o.cssRules.length)}catch(m){console.error("Error inserting rule from remote css",{rule:u,error:m})}})).catch(c=>{console.error("Error loading remote css",c.toString())});r.push(d)}})}catch(i){let a=e.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&r.push(Un(o.href).then(s=>qn(s,t)).then(s=>Wn(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",i)}}),Promise.all(r).then(()=>(e.forEach(o=>{if("cssRules"in o)try{Z(o.cssRules||[]).forEach(i=>{n.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${o.href}`,i)}}),n))}function ta(e){return e.filter(t=>t.type===CSSRule.FONT_FACE_RULE).filter(t=>Xt(t.style.getPropertyValue("src")))}async function na(e,t){if(e.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=Z(e.ownerDocument.styleSheets),r=await ea(n,t);return ta(r)}function jn(e){return e.trim().replace(/["']/g,"")}function ra(e){let t=new Set;function n(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(i=>{t.add(jn(i))}),Array.from(r.children).forEach(i=>{i instanceof HTMLElement&&n(i)})}return n(e),t}async function Gn(e,t){let n=await na(e,t),r=ra(e);return(await Promise.all(n.filter(i=>r.has(jn(i.style.fontFamily))).map(i=>{let a=i.parentStyleSheet?i.parentStyleSheet.href:null;return ct(i.cssText,a,t)}))).join(`
`)}async function Xn(e,t){let n=t.fontEmbedCSS!=null?t.fontEmbedCSS:t.skipFonts?null:await Gn(e,t);if(n){let r=document.createElement("style"),o=document.createTextNode(n);r.appendChild(o),e.firstChild?e.insertBefore(r,e.firstChild):e.appendChild(r)}}async function oa(e,t={}){let{width:n,height:r}=qt(e,t),o=await Ve(e,t,!0);return await Xn(o,t),await Kt(o,t),Hn(o,t),await In(o,n,r)}async function ia(e,t={}){let{width:n,height:r}=qt(e,t),o=await oa(e,t),i=await Ee(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=t.pixelRatio||Mn(),d=t.canvasWidth||n,c=t.canvasHeight||r;return a.width=d*l,a.height=c*l,t.skipAutoScale||Dn(a),a.style.width=`${d}`,a.style.height=`${c}`,t.backgroundColor&&(s.fillStyle=t.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(i,0,0,a.width,a.height),a}async function Kn(e,t={}){return(await ia(e,t)).toDataURL()}var Yn={triggerLabel:"Feedback",triggerAriaLabel:"Fehler melden oder Feedback senden",dismissButtonAriaLabel:"Feedback-Button ausblenden",pullTabAriaLabel:"Feedback-Button anzeigen",dragHandleTitle:"Feedback-Button verschieben",installRequiredTitle:"Installation erforderlich",connectionErrorTitle:"Verbindungsfehler",installRequiredMessage:"BugDrop ben\xF6tigt die Installation der GitHub-App, um Issues zu erstellen.",apiUnreachableMessage:"Die BugDrop-API ist nicht erreichbar. \xDCberpr\xFCfen Sie Ihre Netzwerkverbindung oder die URL des Script-Tags.",installApp:"App installieren",welcomeTitle:"Teilen Sie Ihr Feedback",welcomeHeadline:"Helfen Sie uns, besser zu werden, indem Sie Ihre Meinung teilen",welcomeBodyLine1:"Melden Sie Fehler, schlagen Sie Funktionen vor oder hinterlassen Sie Feedback.",welcomeBodyLine2:"Sie k\xF6nnen optional kommentierte Screenshots hinzuf\xFCgen.",getStarted:"Los geht\u2019s",feedbackFormTitle:"Feedback senden",categoryLabel:"Kategorie",categoryBug:"Fehler",categoryFeature:"Funktion",categoryQuestion:"Frage",nameLabel:"Name",namePlaceholder:"Ihr Name",emailLabel:"E-Mail",emailPlaceholder:"ihre@email.de",titleLabel:"Titel",titlePlaceholder:"Kurze Beschreibung des Problems oder Vorschlags",descriptionLabel:"Beschreibung",descriptionPlaceholder:"Geben Sie weitere Details, Schritte zur Reproduktion oder Kontext an...",screenshotAutoNote:"Diese Website h\xE4ngt beim Absenden automatisch einen Screenshot der gesamten Seite an, ohne eine Vorschau anzuzeigen. \xDCberpr\xFCfen Sie Ihre Seite vor dem Senden auf sensible Informationen.",screenshotAutoRedactionNote:"Einige von dieser Website als privat markierte Felder k\xF6nnen auf unterst\xFCtzten Seiten optisch maskiert werden, nicht markierte sensible Informationen k\xF6nnen jedoch weiterhin enthalten sein.",screenshotRequiredNote:"\u{1F4F8} Vor dem Absenden ist ein Screenshot erforderlich.",includeScreenshotLabel:"\u{1F4F8} Screenshot hinzuf\xFCgen",sendConsoleLogsLabel:"Konsolenprotokolle mitsenden",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Dateien hochladen",uploadButton:"Hochladen",uploadTooMany:e=>`Laden Sie bis zu ${e} Dateien hoch. Entfernen Sie eine Datei, bevor Sie eine weitere hinzuf\xFCgen.`,uploadUnsupportedType:"Dieser Dateityp wird nicht unterst\xFCtzt. Laden Sie ein Bild, ein PDF oder ein kurzes Video hoch.",uploadTooLarge:e=>`Die Datei ist zu gro\xDF. Laden Sie Dateien bis zu ${e} hoch.`,uploadReadError:"Diese Datei konnte nicht gelesen werden. Versuchen Sie es mit einer anderen.",removeAttachmentAriaLabel:e=>`${e} entfernen`,cancel:"Abbrechen",continueButton:"Weiter",submit:"Absenden",submittingTitle:"Wird gesendet...",creatingIssue:"Issue wird erstellt...",rateLimited:e=>`Zu viele \xDCbermittlungen. Bitte versuchen Sie es in ${e} Minute${e===1?"":"n"} erneut.`,submitFailedFallback:"Senden fehlgeschlagen",networkError:"Netzwerkfehler. Bitte \xFCberpr\xFCfen Sie Ihre Verbindung.",submissionFailedTitle:"Senden fehlgeschlagen",tryAgain:"Erneut versuchen",successTitle:"Feedback gesendet!",issueCreated:e=>`Issue ${e} wurde erstellt.`,feedbackSubmittedMessage:"Ihr Feedback wurde erfolgreich gesendet.",viewOnGitHub:"Auf GitHub ansehen",done:"Fertig",captureScreenshotTitle:"Screenshot erstellen",chooseWhatToCapture:"W\xE4hlen Sie aus, was erfasst werden soll:",viewportRedactionWarning:"Bei der Erfassung des sichtbaren Bereichs \xFCber den Browser k\xF6nnen private Felder nicht automatisch maskiert werden. W\xE4hlen Sie \u201EElement ausw\xE4hlen\u201C, um die automatische Maskierung beizubehalten, oder \xFCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionReviewNote:"Diese Website hat einige Felder zur Schw\xE4rzung markiert. \xDCberpr\xFCfen Sie den Screenshot vor dem Senden.",pageTooComplexViewportNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. Erfassen Sie stattdessen den sichtbaren Bereich oder w\xE4hlen Sie ein bestimmtes Element aus.",pageTooComplexElementNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. W\xE4hlen Sie stattdessen ein bestimmtes Element aus.",fullPage:"Ganze Seite",captureViewport:"Sichtbaren Bereich erfassen",selectArea:"Bereich ausw\xE4hlen",selectElement:"Element ausw\xE4hlen",skipScreenshot:"Screenshot \xFCberspringen",areaPickerInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich",areaPickerRedactionInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich. Markierte private Felder k\xF6nnen maskiert werden, wenn sie darin enthalten sind.",elementPickerInstruction:"Klicken Sie auf ein beliebiges Element, um es zu erfassen",elementPickerTouchInstruction:"Tippen Sie auf ein beliebiges Element, um es zu erfassen",escToCancel:"ESC zum Abbrechen",capturingTitle:"Wird erfasst...",capturingScreenshot:"Screenshot wird erfasst...",captureFailedTitle:"Erfassung fehlgeschlagen",captureFailedMessage:"Der Screenshot konnte nicht erfasst werden. Die Seite ist m\xF6glicherweise zu komplex, oder Browsereinschr\xE4nkungen greifen.",chooseAnotherMethod:"Andere Methode w\xE4hlen",maskFailureTitle:"Datenschutz-Maskierung fehlgeschlagen",maskFailureMessage:"Die automatische Schw\xE4rzung privater Felder konnte nicht angewendet werden. Zum Schutz Ihrer Daten wurde dieser Screenshot verworfen. Sie k\xF6nnen Ihr Feedback weiterhin ohne Screenshot senden.",continueWithoutScreenshot:"Ohne Screenshot fortfahren",reviewScreenshotTitle:"Screenshot \xFCberpr\xFCfen",viewportRedactionUnavailableNote:"Bei diesem \xFCber den Browser erfassten sichtbaren Bereich konnten private Felder nicht automatisch maskiert werden. \xDCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionCountNote:e=>e===1?`${e} privates Element wurde zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`:`${e} private Elemente wurden zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`,redactionLimitationsNote:"BugDrop hat nur die gemessenen markierten Bereiche abgedeckt. Es untersucht keine Pixel innerhalb eingebetteter oder gerenderter Inhalte wie iFrames, Canvas, Bildern, SVGs, Videos, CSS-Hintergr\xFCnden oder benutzerdefinierten Steuerelementen. Stellen Sie vor dem Senden sicher, dass das schwarze Feld den sensiblen Bereich vollst\xE4ndig abdeckt, oder nehmen Sie den Screenshot nach Markierung eines gr\xF6\xDFeren Bereichs erneut auf.",annotationInstruction:"Stellen Sie vor dem Senden sicher, dass keine sensiblen Informationen sichtbar sind. Verdecken Sie sensible Bereiche vor dem Absenden. Schw\xE4rzungen werden dauerhaft in das hochgeladene Bild eingebettet.",selectedElementNote:e=>`Ben\xF6tigen Sie mehr umgebenden Kontext? Passen Sie ${e} im BugDrop-Script-Tag an.`,toolDraw:"Zeichnen",toolArrow:"Pfeil",toolRectangle:"Rechteck",toolRedact:"Schw\xE4rzen",undo:"R\xFCckg\xE4ngig",retake:"Erneut aufnehmen",submitFeedback:"Feedback senden",captureTimeout:"Zeit\xFCberschreitung bei der Screenshot-Erfassung \u2014 die Seite ist m\xF6glicherweise zu komplex"};var Yt={triggerLabel:"Feedback",triggerAriaLabel:"Report a bug or send feedback",dismissButtonAriaLabel:"Dismiss feedback button",pullTabAriaLabel:"Show feedback button",dragHandleTitle:"Drag feedback button",installRequiredTitle:"Install Required",connectionErrorTitle:"Connection Error",installRequiredMessage:"BugDrop requires GitHub App installation to create issues.",apiUnreachableMessage:"Unable to reach BugDrop API. Check your network connection or script tag URL.",installApp:"Install App",welcomeTitle:"Share Your Feedback",welcomeHeadline:"Help us improve by sharing your thoughts",welcomeBodyLine1:"Report bugs, suggest features, or leave feedback.",welcomeBodyLine2:"You can optionally include annotated screenshots.",getStarted:"Get Started",feedbackFormTitle:"Send Feedback",categoryLabel:"Category",categoryBug:"Bug",categoryFeature:"Feature",categoryQuestion:"Question",nameLabel:"Name",namePlaceholder:"Your name",emailLabel:"Email",emailPlaceholder:"your@email.com",titleLabel:"Title",titlePlaceholder:"Brief description of the issue or suggestion",descriptionLabel:"Description",descriptionPlaceholder:"Provide additional details, steps to reproduce, or context...",screenshotAutoNote:"This site will attach a full-page screenshot when you submit without showing a preview. Review your page for sensitive information before sending.",screenshotAutoRedactionNote:"Some fields this site marked private may be visually masked on supported pages, but unmarked sensitive information can still be included.",screenshotRequiredNote:"\u{1F4F8} A screenshot is required before submitting.",includeScreenshotLabel:"\u{1F4F8} Include a screenshot",sendConsoleLogsLabel:"Send Console Logs",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Upload files",uploadButton:"Upload",uploadTooMany:e=>`Upload up to ${e} files. Remove a file before adding another.`,uploadUnsupportedType:"That file type is not supported. Upload an image, PDF, or short video.",uploadTooLarge:e=>`File is too large. Upload files up to ${e}.`,uploadReadError:"Could not read that file. Try another one.",removeAttachmentAriaLabel:e=>`Remove ${e}`,cancel:"Cancel",continueButton:"Continue",submit:"Submit",submittingTitle:"Submitting...",creatingIssue:"Creating issue...",rateLimited:e=>`Too many submissions. Please try again in ${e} minute${e===1?"":"s"}.`,submitFailedFallback:"Failed to submit",networkError:"Network error. Please check your connection.",submissionFailedTitle:"Submission Failed",tryAgain:"Try Again",successTitle:"Feedback Submitted!",issueCreated:e=>`Issue ${e} has been created.`,feedbackSubmittedMessage:"Your feedback has been submitted successfully.",viewOnGitHub:"View on GitHub",done:"Done",captureScreenshotTitle:"Capture Screenshot",chooseWhatToCapture:"Choose what to capture:",viewportRedactionWarning:"Browser viewport capture cannot apply automatic private-field masks. Select Element to preserve automatic masking, or review and cover sensitive areas before sending.",redactionReviewNote:"This site marked some fields for redaction. Review the screenshot before sending.",pageTooComplexViewportNote:"This page is too complex for full-page or area capture. Capture the visible viewport or select a specific element instead.",pageTooComplexElementNote:"This page is too complex for full-page or area capture. Select a specific element instead.",fullPage:"Full Page",captureViewport:"Capture Viewport",selectArea:"Select Area",selectElement:"Select Element",skipScreenshot:"Skip Screenshot",areaPickerInstruction:"Draw a selection around the area to capture",areaPickerRedactionInstruction:"Draw a selection around the area to capture. Marked private fields may be masked if included.",elementPickerInstruction:"Click any element to capture it",elementPickerTouchInstruction:"Tap any element to capture it",escToCancel:"ESC to cancel",capturingTitle:"Capturing...",capturingScreenshot:"Capturing screenshot...",captureFailedTitle:"Capture Failed",captureFailedMessage:"Failed to capture screenshot. The page may be too complex or browser restrictions may apply.",chooseAnotherMethod:"Choose Another Method",maskFailureTitle:"Privacy masking failed",maskFailureMessage:"Automatic redaction of private fields could not be applied. To protect your data, this screenshot was discarded. You can still submit feedback without one.",continueWithoutScreenshot:"Continue without screenshot",reviewScreenshotTitle:"Review Screenshot",viewportRedactionUnavailableNote:"This browser viewport capture could not apply automatic private-field masks. Review and cover any sensitive areas before sending.",redactionCountNote:e=>`${e} private ${e===1?"item was":"items were"} marked for redaction in this screenshot. Review before sending.`,redactionLimitationsNote:"BugDrop only covered the measured marked boxes. It does not inspect pixels inside embedded or rendered content such as iframes, canvas, images, SVGs, videos, CSS backgrounds, or custom controls. Confirm the black box fully covers the sensitive region before sending, or retake after marking a larger wrapper.",annotationInstruction:"Check that no sensitive information is visible before sending. Cover sensitive areas before submitting. Redactions are baked into the uploaded image.",selectedElementNote:e=>`Need more surrounding context? Adjust ${e} on the BugDrop script tag.`,toolDraw:"Draw",toolArrow:"Arrow",toolRectangle:"Rectangle",toolRedact:"Redact",undo:"Undo",retake:"Retake",submitFeedback:"Submit Feedback",captureTimeout:"Screenshot capture timed out \u2014 the page may be too complex"};var Zn={triggerLabel:"Feedback",triggerAriaLabel:"Een fout melden of feedback versturen",dismissButtonAriaLabel:"Feedbackknop verbergen",pullTabAriaLabel:"Feedbackknop tonen",dragHandleTitle:"Feedbackknop verslepen",installRequiredTitle:"Installatie vereist",connectionErrorTitle:"Verbindingsfout",installRequiredMessage:"BugDrop vereist installatie van de GitHub-app om issues te kunnen aanmaken.",apiUnreachableMessage:"Kan de BugDrop-API niet bereiken. Controleer uw netwerkverbinding of de URL van de scripttag.",installApp:"App installeren",welcomeTitle:"Deel uw feedback",welcomeHeadline:"Help ons verbeteren door uw mening te delen",welcomeBodyLine1:"Meld fouten, stel functies voor of laat feedback achter.",welcomeBodyLine2:"U kunt optioneel schermafbeeldingen met aantekeningen toevoegen.",getStarted:"Aan de slag",feedbackFormTitle:"Feedback versturen",categoryLabel:"Categorie",categoryBug:"Fout",categoryFeature:"Suggestie",categoryQuestion:"Vraag",nameLabel:"Naam",namePlaceholder:"Uw naam",emailLabel:"E-mail",emailPlaceholder:"uw@email.nl",titleLabel:"Titel",titlePlaceholder:"Korte omschrijving van het probleem of de suggestie",descriptionLabel:"Omschrijving",descriptionPlaceholder:"Geef extra details, stappen om het te reproduceren of context...",screenshotAutoNote:"Deze site voegt bij het versturen automatisch een schermafbeelding van de volledige pagina toe, zonder voorbeeld. Controleer uw pagina op gevoelige informatie voordat u verstuurt.",screenshotAutoRedactionNote:"Sommige velden die deze site als priv\xE9 heeft gemarkeerd, kunnen op ondersteunde pagina\u2019s visueel worden gemaskeerd, maar niet-gemarkeerde gevoelige informatie kan nog steeds worden meegestuurd.",screenshotRequiredNote:"\u{1F4F8} Een schermafbeelding is vereist voordat u kunt versturen.",includeScreenshotLabel:"\u{1F4F8} Schermafbeelding toevoegen",sendConsoleLogsLabel:"Consolelogboeken meesturen",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Bestanden uploaden",uploadButton:"Uploaden",uploadTooMany:e=>`Upload maximaal ${e} bestanden. Verwijder een bestand voordat u er een toevoegt.`,uploadUnsupportedType:"Dat bestandstype wordt niet ondersteund. Upload een afbeelding, pdf of korte video.",uploadTooLarge:e=>`Het bestand is te groot. Upload bestanden tot ${e}.`,uploadReadError:"Kan dat bestand niet lezen. Probeer een ander bestand.",removeAttachmentAriaLabel:e=>`${e} verwijderen`,cancel:"Annuleren",continueButton:"Doorgaan",submit:"Versturen",submittingTitle:"Versturen...",creatingIssue:"Issue aanmaken...",rateLimited:e=>`Te veel inzendingen. Probeer het over ${e} ${e===1?"minuut":"minuten"} opnieuw.`,submitFailedFallback:"Versturen mislukt",networkError:"Netwerkfout. Controleer uw verbinding.",submissionFailedTitle:"Versturen mislukt",tryAgain:"Opnieuw proberen",successTitle:"Feedback verstuurd!",issueCreated:e=>`Issue ${e} is aangemaakt.`,feedbackSubmittedMessage:"Uw feedback is succesvol verstuurd.",viewOnGitHub:"Bekijken op GitHub",done:"Klaar",captureScreenshotTitle:"Schermafbeelding maken",chooseWhatToCapture:"Kies wat u wilt vastleggen:",viewportRedactionWarning:"Bij het vastleggen van het zichtbare deel via de browser kunnen priv\xE9velden niet automatisch worden gemaskeerd. Kies \u201CElement selecteren\u201D om automatische maskering te behouden, of controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionReviewNote:"Deze site heeft enkele velden gemarkeerd voor redactie. Controleer de schermafbeelding voordat u verstuurt.",pageTooComplexViewportNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Leg het zichtbare deel vast of selecteer een specifiek element.",pageTooComplexElementNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Selecteer in plaats daarvan een specifiek element.",fullPage:"Volledige pagina",captureViewport:"Zichtbaar deel vastleggen",selectArea:"Gebied selecteren",selectElement:"Element selecteren",skipScreenshot:"Schermafbeelding overslaan",areaPickerInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen",areaPickerRedactionInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen. Gemarkeerde priv\xE9velden kunnen worden gemaskeerd als ze binnen de selectie vallen.",elementPickerInstruction:"Klik op een element om het vast te leggen",elementPickerTouchInstruction:"Tik op een element om het vast te leggen",escToCancel:"ESC om te annuleren",capturingTitle:"Vastleggen...",capturingScreenshot:"Schermafbeelding wordt gemaakt...",captureFailedTitle:"Opname mislukt",captureFailedMessage:"Kan geen schermafbeelding maken. De pagina is mogelijk te complex of de browser staat dit niet toe.",chooseAnotherMethod:"Kies een andere methode",maskFailureTitle:"Privacymaskering mislukt",maskFailureMessage:"Automatische redactie van priv\xE9velden kon niet worden toegepast. Om uw gegevens te beschermen is deze schermafbeelding verwijderd. U kunt uw feedback nog steeds zonder schermafbeelding versturen.",continueWithoutScreenshot:"Doorgaan zonder schermafbeelding",reviewScreenshotTitle:"Schermafbeelding controleren",viewportRedactionUnavailableNote:"Bij deze via de browser vastgelegde schermafbeelding konden priv\xE9velden niet automatisch worden gemaskeerd. Controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionCountNote:e=>e===1?"1 priv\xE9-item is gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.":`${e} priv\xE9-items zijn gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.`,redactionLimitationsNote:"BugDrop heeft alleen de gemeten gemarkeerde vakken afgedekt. Het inspecteert geen pixels binnen ingesloten of gerenderde inhoud zoals iframes, canvas, afbeeldingen, SVG\u2019s, video\u2019s, CSS-achtergronden of aangepaste elementen. Controleer of het zwarte vak het gevoelige gebied volledig bedekt voordat u verstuurt, of maak de afbeelding opnieuw nadat u een groter element hebt gemarkeerd.",annotationInstruction:"Controleer of er geen gevoelige informatie zichtbaar is voordat u verstuurt. Dek gevoelige gebieden af voordat u indient. Redacties worden permanent in de ge\xFCploade afbeelding verwerkt.",selectedElementNote:e=>`Meer omringende context nodig? Pas ${e} aan op de BugDrop-scripttag.`,toolDraw:"Tekenen",toolArrow:"Pijl",toolRectangle:"Rechthoek",toolRedact:"Redigeren",undo:"Ongedaan maken",retake:"Opnieuw maken",submitFeedback:"Feedback versturen",captureTimeout:"Het maken van de schermafbeelding duurde te lang \u2014 de pagina is mogelijk te complex"};function Zt(e){let t=e%10,n=e%100;return t>=2&&t<=4&&(n<12||n>14)}var Jn={triggerLabel:"Opinia",triggerAriaLabel:"Zg\u0142o\u015B b\u0142\u0105d lub wy\u015Blij opini\u0119",dismissButtonAriaLabel:"Ukryj przycisk opinii",pullTabAriaLabel:"Poka\u017C przycisk opinii",dragHandleTitle:"Przeci\u0105gnij przycisk opinii",installRequiredTitle:"Wymagana instalacja",connectionErrorTitle:"B\u0142\u0105d po\u0142\u0105czenia",installRequiredMessage:"BugDrop wymaga instalacji aplikacji GitHub, aby tworzy\u0107 zg\u0142oszenia.",apiUnreachableMessage:"Nie mo\u017Cna po\u0142\u0105czy\u0107 si\u0119 z API BugDrop. Sprawd\u017A po\u0142\u0105czenie sieciowe lub adres URL w tagu skryptu.",installApp:"Zainstaluj aplikacj\u0119",welcomeTitle:"Podziel si\u0119 opini\u0105",welcomeHeadline:"Pom\xF3\u017C nam si\u0119 rozwija\u0107, dziel\u0105c si\u0119 swoimi uwagami",welcomeBodyLine1:"Zg\u0142aszaj b\u0142\u0119dy, proponuj funkcje lub zostaw opini\u0119.",welcomeBodyLine2:"Opcjonalnie mo\u017Cesz do\u0142\u0105czy\u0107 zrzuty ekranu z adnotacjami.",getStarted:"Rozpocznij",feedbackFormTitle:"Wy\u015Blij opini\u0119",categoryLabel:"Kategoria",categoryBug:"B\u0142\u0105d",categoryFeature:"Propozycja",categoryQuestion:"Pytanie",nameLabel:"Imi\u0119 i nazwisko",namePlaceholder:"Twoje imi\u0119 i nazwisko",emailLabel:"E-mail",emailPlaceholder:"twoj@email.com",titleLabel:"Tytu\u0142",titlePlaceholder:"Kr\xF3tki opis problemu lub sugestii",descriptionLabel:"Opis",descriptionPlaceholder:"Podaj dodatkowe szczeg\xF3\u0142y, kroki do odtworzenia lub kontekst...",screenshotAutoNote:"Ta strona automatycznie do\u0142\u0105czy zrzut ca\u0142ej strony podczas wysy\u0142ania, bez pokazywania podgl\u0105du. Przed wys\u0142aniem sprawd\u017A, czy strona nie zawiera poufnych informacji.",screenshotAutoRedactionNote:"Niekt\xF3re pola oznaczone przez t\u0119 stron\u0119 jako prywatne mog\u0105 zosta\u0107 zamaskowane na obs\u0142ugiwanych stronach, ale nieoznaczone poufne informacje nadal mog\u0105 zosta\u0107 do\u0142\u0105czone.",screenshotRequiredNote:"\u{1F4F8} Zrzut ekranu jest wymagany przed wys\u0142aniem.",includeScreenshotLabel:"\u{1F4F8} Do\u0142\u0105cz zrzut ekranu",sendConsoleLogsLabel:"Wy\u015Blij logi konsoli",uploadsAriaLabel:"Za\u0142\u0105czniki",uploadFilesAriaLabel:"Prze\u015Blij pliki",uploadButton:"Prze\u015Blij",uploadTooMany:e=>`Mo\u017Cna przes\u0142a\u0107 maksymalnie ${e} ${Zt(e)?"pliki":"plik\xF3w"}. Usu\u0144 plik, aby doda\u0107 kolejny.`,uploadUnsupportedType:"Ten typ pliku nie jest obs\u0142ugiwany. Prze\u015Blij obraz, plik PDF lub kr\xF3tki film.",uploadTooLarge:e=>`Plik jest za du\u017Cy. Prze\u015Blij pliki o rozmiarze do ${e}.`,uploadReadError:"Nie uda\u0142o si\u0119 odczyta\u0107 pliku. Spr\xF3buj z innym.",removeAttachmentAriaLabel:e=>`Usu\u0144 ${e}`,cancel:"Anuluj",continueButton:"Dalej",submit:"Wy\u015Blij",submittingTitle:"Wysy\u0142anie...",creatingIssue:"Tworzenie zg\u0142oszenia...",rateLimited:e=>`Zbyt wiele zg\u0142osze\u0144. Spr\xF3buj ponownie za ${e} ${e===1?"minut\u0119":Zt(e)?"minuty":"minut"}.`,submitFailedFallback:"Nie uda\u0142o si\u0119 wys\u0142a\u0107",networkError:"B\u0142\u0105d sieci. Sprawd\u017A po\u0142\u0105czenie z internetem.",submissionFailedTitle:"Wysy\u0142anie nie powiod\u0142o si\u0119",tryAgain:"Spr\xF3buj ponownie",successTitle:"Opinia wys\u0142ana!",issueCreated:e=>`Utworzono zg\u0142oszenie ${e}.`,feedbackSubmittedMessage:"Twoja opinia zosta\u0142a pomy\u015Blnie wys\u0142ana.",viewOnGitHub:"Zobacz na GitHubie",done:"Gotowe",captureScreenshotTitle:"Zr\xF3b zrzut ekranu",chooseWhatToCapture:"Wybierz, co przechwyci\u0107:",viewportRedactionWarning:"Przechwytywanie widocznego obszaru przez przegl\u0105dark\u0119 nie pozwala automatycznie zamaskowa\u0107 p\xF3l prywatnych. Wybierz \u201EZaznacz element\u201D, aby zachowa\u0107 automatyczne maskowanie, albo sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionReviewNote:"Ta strona oznaczy\u0142a niekt\xF3re pola do zamazania. Sprawd\u017A zrzut ekranu przed wys\u0142aniem.",pageTooComplexViewportNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Przechwy\u0107 widoczny obszar albo zaznacz konkretny element.",pageTooComplexElementNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Zamiast tego zaznacz konkretny element.",fullPage:"Ca\u0142a strona",captureViewport:"Przechwy\u0107 widoczny obszar",selectArea:"Zaznacz obszar",selectElement:"Zaznacz element",skipScreenshot:"Pomi\u0144 zrzut ekranu",areaPickerInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia",areaPickerRedactionInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia. Pola oznaczone jako prywatne mog\u0105 zosta\u0107 zamaskowane, je\u015Bli znajd\u0105 si\u0119 w zaznaczeniu.",elementPickerInstruction:"Kliknij dowolny element, aby go przechwyci\u0107",elementPickerTouchInstruction:"Dotknij dowolny element, aby go przechwyci\u0107",escToCancel:"ESC, aby anulowa\u0107",capturingTitle:"Przechwytywanie...",capturingScreenshot:"Trwa przechwytywanie zrzutu ekranu...",captureFailedTitle:"Przechwytywanie nie powiod\u0142o si\u0119",captureFailedMessage:"Nie uda\u0142o si\u0119 przechwyci\u0107 zrzutu ekranu. Strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona lub przegl\u0105darka na to nie pozwala.",chooseAnotherMethod:"Wybierz inn\u0105 metod\u0119",maskFailureTitle:"Maskowanie prywatno\u015Bci nie powiod\u0142o si\u0119",maskFailureMessage:"Nie uda\u0142o si\u0119 automatycznie zamaza\u0107 p\xF3l prywatnych. Aby chroni\u0107 Twoje dane, ten zrzut ekranu zosta\u0142 odrzucony. Nadal mo\u017Cesz wys\u0142a\u0107 opini\u0119 bez zrzutu ekranu.",continueWithoutScreenshot:"Kontynuuj bez zrzutu ekranu",reviewScreenshotTitle:"Sprawd\u017A zrzut ekranu",viewportRedactionUnavailableNote:"Na tym zrzucie przechwyconym przez przegl\u0105dark\u0119 nie uda\u0142o si\u0119 automatycznie zamaskowa\u0107 p\xF3l prywatnych. Sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionCountNote:e=>`${e} ${e===1?"prywatny element oznaczono":Zt(e)?"prywatne elementy oznaczono":"prywatnych element\xF3w oznaczono"} do zamazania na tym zrzucie ekranu. Sprawd\u017A przed wys\u0142aniem.`,redactionLimitationsNote:"BugDrop zakrywa tylko zmierzone, oznaczone obszary. Nie analizuje pikseli wewn\u0105trz osadzonej lub renderowanej zawarto\u015Bci, takiej jak elementy iframe, canvas, obrazy, pliki SVG, filmy, t\u0142a CSS czy niestandardowe kontrolki. Przed wys\u0142aniem upewnij si\u0119, \u017Ce czarny prostok\u0105t w pe\u0142ni zakrywa poufny obszar, albo pon\xF3w zrzut po oznaczeniu wi\u0119kszego elementu.",annotationInstruction:"Przed wys\u0142aniem sprawd\u017A, czy nie wida\u0107 poufnych informacji. Zakryj poufne obszary przed przes\u0142aniem. Zamazania s\u0105 trwale zapisywane w przesy\u0142anym obrazie.",selectedElementNote:e=>`Potrzebujesz wi\u0119cej otaczaj\u0105cego kontekstu? Dostosuj ${e} w tagu skryptu BugDrop.`,toolDraw:"Rysuj",toolArrow:"Strza\u0142ka",toolRectangle:"Prostok\u0105t",toolRedact:"Zama\u017C",undo:"Cofnij",retake:"Pon\xF3w zrzut",submitFeedback:"Wy\u015Blij opini\u0119",captureTimeout:"Up\u0142yn\u0105\u0142 limit czasu przechwytywania zrzutu ekranu \u2014 strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona"};var Qn=/[;{}<>]|\/\*|\*\/|@import|url\s*\(|<\/style/i,sa=/^-?[_a-zA-Z][_a-zA-Z0-9-]*$/,la=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,ca=/^(?:rgb|rgba|hsl|hsla)\(\s*[-+.\d%]+\s*(?:,\s*[-+.\d%]+\s*){2,3}\)$/i;function U(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ue(e){let t=e?.trim();if(!t||t==="none")return t;try{let n=new URL(t,window.location.href);if(n.protocol==="https:"||n.protocol==="http:")return t}catch{return}}function B(e){let t=e?.trim();if(!(!t||Qn.test(t))&&(la.test(t)||ca.test(t)||sa.test(t)||typeof CSS<"u"&&CSS.supports?.("color",t)))return t}function Te(e){let t=e?.trim();if(t){if(t==="inherit")return t;if(!Qn.test(t)&&/^[\w\s"',.-]+$/.test(t))return t}}function Jt(e){let t=e?.trim();if(!t||!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(t))return;let n=Number(t);return Number.isFinite(n)?n:void 0}function J(e){let n=e?.trim()?.match(/^((?:0|[1-9]\d*)(?:\.\d+)?)(?:px)?$/);if(!n)return;let r=Number(n[1]);return Number.isFinite(r)?r:void 0}function er(e){let t=e?.trim();if(!t||!/^[1-9]\d*$/.test(t))return;let n=Number(t);return Number.isSafeInteger(n)?n:void 0}function dt(e){if(e==="none"||e==="soft"||e==="hard")return e}var tr={en:Yt,de:Yn,nl:Zn,pl:Jn};function w(e){return U(e)}function nr(e){if(!e)return"en";let t=e.toLowerCase().split(/[-_]/)[0];return Object.prototype.hasOwnProperty.call(tr,t)?t:(console.warn(`[BugDrop] Unsupported data-locale "${e}"; falling back to English.`),"en")}var rr=Yt;function or(e){rr=tr[e]}function p(){return rr}var da=15e3;function qe(e,t){let n,r=new Promise((o,i)=>{n=setTimeout(()=>{try{t?.()}catch{}i(new Error(p().captureTimeout))},da)});return Promise.race([e,r]).finally(()=>clearTimeout(n))}var Qt="#bugdrop-host, [data-bugdrop-owned]";function Q(e){if(e instanceof ShadowRoot)return Q(e.host);if(!(e instanceof Element))return!1;if(e.matches(Qt)||e.closest(Qt))return!0;let t=e.getRootNode();return t instanceof ShadowRoot&&Q(t.host)}async function ir(e){let n=Array.from(document.querySelectorAll(Qt)).map(r=>({root:r,value:r.style.getPropertyValue("visibility"),priority:r.style.getPropertyPriority("visibility")}));for(let{root:r}of n)r.style.setProperty("visibility","hidden","important");try{return await e()}finally{for(let{root:r,value:o,priority:i}of n)o?r.style.setProperty("visibility",o,i):r.style.removeProperty("visibility")}}var Le=class extends Error{constructor(t,n){super(t,n),this.name="MaskApplicationError"}},ua="[data-bugdrop-mask], [data-bugdrop-redact], [data-bd-redact], [data-bugdrop-redacted]",pa='input[type="password"], input[autocomplete*="cc-number"], input[autocomplete*="cc-csc"], input[autocomplete*="cc-exp"]',ar="iframe, canvas, img, svg, video",ma=new Set(["CANVAS","IMG","SVG"]),ba=new Set(["VIDEO"]);function ut(e){return e.matches(ua)?"developer-marked":e.matches(pa)?"sensitive-input":null}function pt(e,t){let n=e.getBoundingClientRect();return n.width===0||n.height===0?null:{element:e,rect:{x:n.left+window.scrollX,y:n.top+window.scrollY,w:n.width,h:n.height},reason:t,strategy:"canvas-mask"}}function mt(e){let t=[],n=[];if(Q(e))return{targets:t,unsupportedSurfaces:n,redactionCount:0};let r=ut(e);if(r){let o=pt(e,r);return o&&(t.push(o),on(e,n)),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}return nn(e,t,n),rn(e,t,n),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}function sr(e=document.body,t){let n=mt(e).targets.map(r=>r.rect);return t?n.filter(r=>en(r,t)).length:n.length}function lr(e,t){let n=t?e.targets.filter(o=>en(o.rect,t)):e.targets,r=t?e.unsupportedSurfaces.filter(o=>en(o.rect,t)):e.unsupportedSurfaces;return{count:n.length,hasLimitations:r.length>0}}function en(e,t){return e.x<t.x+t.width&&e.x+e.w>t.x&&e.y<t.y+t.height&&e.y+e.h>t.y}function nn(e,t,n){for(let r of Array.from(e.children)){if(Q(r))continue;let o=ut(r);if(o){let i=pt(r,o);i&&(t.push(i),on(r,n));continue}nn(r,t,n),rn(r,t,n)}}function rn(e,t,n){let r=e.shadowRoot;if(r)for(let o of Array.from(r.children)){let i=ut(o);if(i){let a=pt(o,i);a&&(t.push(a),on(o,n));continue}nn(o,t,n),rn(o,t,n)}}function on(e,t){tn(e,t);for(let n of Array.from(e.querySelectorAll(ar)))tn(n,t);cr(e,t)}function tn(e,t){let n=ga(e);if(!n)return;let r=pt(e,ut(e)??"developer-marked");r&&t.push({tagName:e.tagName,reason:n,rect:r.rect})}function ga(e){let t=e.tagName.toUpperCase();return t==="IFRAME"?"embedded-document":ma.has(t)?"pixel-content":ba.has(t)?"media-content":null}function cr(e,t){let n=e.shadowRoot;if(n)for(let r of Array.from(n.querySelectorAll(ar)))tn(r,t);for(let r of Array.from(e.children))cr(r,t)}function fa(e,t,n,r,o){let i=(e.x-n.x)*t,a=(e.y-n.y)*t,s=e.w*t,l=e.h*t,d=Math.max(0,Math.floor(i)-1),c=Math.max(0,Math.floor(a)-1),u=Math.min(r,Math.ceil(i+s)+1),m=Math.min(o,Math.ceil(a+l)+1);return{x:d,y:c,w:u-d,h:m-c}}async function an(e,t,n,r={x:0,y:0}){if(t.length===0)return e;let o=await ha(e),i=document.createElement("canvas");i.width=o.naturalWidth||o.width,i.height=o.naturalHeight||o.height;let a=i.getContext("2d");if(!a)throw new Le("Failed to get canvas context for privacy masking");a.drawImage(o,0,0),a.fillStyle="#000";for(let s of t){let l=fa(s,n,r,i.width,i.height);l.w>0&&l.h>0&&a.fillRect(l.x,l.y,l.w,l.h)}return i.toDataURL("image/png")}function ha(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Le("Failed to load image for privacy masking")),r.src=e})}var We="#14b8a6";function Fe(e){return e||We}function bt(e){return`color-mix(in srgb, ${e} 85%, black)`}function dr(e){return e??0}function ln(){return ir(ya)}function ya(){if(window.__bugdropMockViewportCapture)return window.__bugdropMockViewportCapture();if(!navigator.mediaDevices?.getDisplayMedia)return Promise.reject(new Error("Screen Capture API is not available"));let e={video:{displaySurface:"browser"},audio:!1,preferCurrentTab:!0},t=new AbortController,n=navigator.mediaDevices.getDisplayMedia(e).then(r=>wa(r,t.signal));return qe(n,()=>t.abort())}async function wa(e,t){let n=document.createElement("video");n.muted=!0,n.playsInline=!0;let r=xa(e,n,t);try{va(e),sn(t),await Ea(n,e,t,r),sn(t);let o=n.videoWidth||window.innerWidth,i=n.videoHeight||window.innerHeight;if(!o||!i)throw new Error("Screen capture stream did not provide a video frame");let a=document.createElement("canvas");a.width=o,a.height=i;let s=a.getContext("2d");if(!s)throw new Error("Failed to get canvas context");return s.drawImage(n,0,0,o,i),a.toDataURL("image/png")}finally{r.cleanup()}}function va(e){let[t]=e.getVideoTracks(),n=t?.getSettings().displaySurface;if(n&&n!=="browser")throw new Error("Please choose the current browser tab for viewport capture")}function xa(e,t,n){let r=!1,o=!1,i=[],a=()=>{if(!r){r=!0;for(let l of i.splice(0))l();for(let l of e.getTracks())l.stop();o&&(t.srcObject=null)}},s=()=>a();return n.addEventListener("abort",s,{once:!0}),i.push(()=>n.removeEventListener("abort",s)),n.aborted&&a(),{attachStream:()=>{r||(t.srcObject=e,o=!0)},cleanup:a}}async function Ea(e,t,n,r){r.attachStream(),sn(n);let o;try{o=e.play()}catch{o=Promise.resolve()}await ka(o.then(()=>{},()=>{}),n),!(typeof e.requestVideoFrameCallback=="function"&&(await Sa(e,n),e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA))&&(e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA||await Ca(e,n))}function ka(e,t){return t.aborted?Promise.reject(je()):new Promise((n,r)=>{let o=()=>{t.removeEventListener("abort",o),r(je())};t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})})}function Sa(e,t){return new Promise((n,r)=>{let o,i=setTimeout(()=>s(n),250),a=()=>s(()=>r(je())),s=l=>{clearTimeout(i),t.removeEventListener("abort",a),o!==void 0&&e.cancelVideoFrameCallback?.(o),o=void 0,l()};t.addEventListener("abort",a,{once:!0}),o=e.requestVideoFrameCallback?.(()=>s(n)),t.aborted&&a()})}function Ca(e,t){return new Promise((n,r)=>{let o=setTimeout(()=>l(n),250),i=()=>l(n),a=()=>l(()=>r(new Error("Failed to load screen capture stream"))),s=()=>l(()=>r(je())),l=d=>{clearTimeout(o),e.removeEventListener("loadeddata",i),e.removeEventListener("canplay",i),e.removeEventListener("error",a),t.removeEventListener("abort",s),d()};e.addEventListener("loadeddata",i),e.addEventListener("canplay",i),e.addEventListener("error",a),t.addEventListener("abort",s,{once:!0}),t.aborted&&s()})}function sn(e){if(e.aborted)throw je()}function je(){return new DOMException("Viewport capture aborted","AbortError")}var ur=3e3,pr="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",Ta=1e4,La=ur;function Pe(){return document.body.querySelectorAll("*").length}function ee(){return Pe()>=Fa()}function Fa(e=navigator.userAgent){return Pa(e)?La:Ta}function Pa(e=navigator.userAgent){return/Safari\//.test(e)&&!/(Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|Opera)\//.test(e)}function mr(e,t){if(e&&Pe()>ur)return 1;let n=t??2;return Math.max(window.devicePixelRatio||1,n)}function br(){let e=window.isSecureContext||location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1",t=typeof window.__bugdropMockViewportCapture=="function"||typeof navigator.mediaDevices?.getDisplayMedia=="function";return e&&t}async function gr(e,t,n={}){let r=e||document.body,o=!e,i=gt(e||document.body),a=n.highlightElement&&r.contains(n.highlightElement)?gt(n.highlightElement):null,s=n.pixelRatio??mr(o,t),l=e?window.getComputedStyle(e):null,d=yr(),c={cacheBust:!1,imagePlaceholder:pr,pixelRatio:s,filter:hr,...l&&(l.marginLeft!=="0px"||l.marginRight!=="0px")?{style:{margin:`${l.marginTop} 0px ${l.marginBottom} 0px`}}:{}},u=mt(r),m=e?{x:i.x,y:i.y}:{x:0,y:0},v=d(r,c),f=await qe(v),x=await an(f,u.targets.map(E=>E.rect),s,m);return ft(a?await wr(x,a,i,n.highlightStyle):x,u)}async function fr(e,t,n={}){let r=n.pixelRatio??mr(!0,t),o={x:e.x,y:e.y,w:e.width,h:e.height},i=n.highlightElement&&document.body.contains(n.highlightElement)?gt(n.highlightElement):null,a=yr(),s={cacheBust:!1,imagePlaceholder:pr,pixelRatio:r,width:e.width,height:e.height,style:{transform:`translate(${-e.x}px, ${-e.y}px)`,transformOrigin:"top left",width:`${document.documentElement.scrollWidth}px`,height:`${document.documentElement.scrollHeight}px`},filter:hr},l=mt(document.body),d=await qe(a(document.body,s)),c=await an(d,l.targets.map(u=>u.rect),r,{x:e.x,y:e.y});return ft(i?await wr(c,i,o,n.highlightStyle):c,l,e)}function Ae(e,t){return sr(e??document.body,t)}function hr(e){return!(Q(e)||Aa(e)&&Ra(e))}function Aa(e){return e.tagName?.toUpperCase()==="IMG"}function Ra(e){let t=(e.ownerDocument.defaultView??window).getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden")return!0;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0}function yr(){return Kn}function ft(e,t,n){return{dataUrl:e,redaction:lr(t,n)}}async function wr(e,t,n,r={}){if(t.w<=0||t.h<=0)return e;let o=await za(e),i=o.naturalWidth||o.width,a=o.naturalHeight||o.height,s=i/Math.max(1,n.w),l=a/Math.max(1,n.h),d=Math.max(1,(s+l)/2),c=Da(r.borderWidth,d),m=2*d+c/2,v=(t.x-n.x)*s-m,f=(t.y-n.y)*l-m,x=t.w*s+m*2,E=t.h*l+m*2,F=Math.max(0,Math.ceil(-v)),D=Math.max(0,Math.ceil(-f)),R=Math.max(0,Math.ceil(v+x-i)),P=Math.max(0,Math.ceil(f+E-a)),I=document.createElement("canvas");I.width=i+F+R,I.height=a+D+P;let h=I.getContext("2d");if(!h)throw new Error("Failed to get canvas context for selected element highlight");h.drawImage(o,F,D);let L=Math.round(v+F),O=Math.round(f+D),z=Math.round(x),N=Math.round(E),T=Ia(r.radius,d),k=Fe(r.accentColor);return Ma(h,L,O,z,N,T),h.lineWidth=c,h.strokeStyle=k,h.stroke(),I.toDataURL("image/png")}function Ma(e,t,n,r,o,i){let a=Math.max(0,Math.min(i,r/2,o/2));e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+o-a),e.quadraticCurveTo(t+r,n+o,t+r-a,n+o),e.lineTo(t+a,n+o),e.quadraticCurveTo(t,n+o,t,n+o-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath()}function Da(e,t){let n=Number.parseFloat(e||"3");return Math.max(1,Math.round((Number.isFinite(n)?n:3)*t))}function Ia(e,t){let n=Number.parseFloat(e||"6");return Math.max(0,Math.round((Number.isFinite(n)?n:6)*t))}function gt(e){let t=e.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function za(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Error("Failed to load image for selected element highlight")),r.src=e})}function ht(e){let t=e?.theme==="dark",n=J(e?.radius),r=J(e?.borderWidth),o=Te(e?.font);return{accent:Fe(B(e?.accentColor)),fontFamily:e?.font==="inherit"?"system-ui, sans-serif":o||"'Space Grotesk', system-ui, sans-serif",radius:n!==void 0?`${n}px`:"6px",bw:r!==void 0?String(r):"3",tooltipBg:B(e?.bgColor)||(t?"#0f172a":"#1a1a1a"),tooltipText:B(e?.textColor)||"#f1f5f9",tooltipBorder:B(e?.borderColor)||(t?"#334155":"#333")}}var $a=new Set(["alert","alertdialog","application","article","banner","button","cell","checkbox","columnheader","combobox","complementary","contentinfo","definition","dialog","directory","document","feed","figure","form","grid","gridcell","group","heading","img","link","list","listbox","listitem","log","main","marquee","math","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","meter","navigation","none","note","option","presentation","progressbar","radio","radiogroup","region","row","rowgroup","rowheader","scrollbar","search","searchbox","separator","slider","spinbutton","status","switch","tab","table","tablist","tabpanel","term","textbox","timer","toolbar","tooltip","tree","treegrid","treeitem"]),Oa=new Set(["button","checkbox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","searchbox","switch","tab","textbox"]),Na=new Set(["button","input","select","textarea"]);function vr(e){return Ba(e)??e}function Ba(e){let{body:t,documentElement:n}=e.ownerDocument,r=e;for(;r&&r!==t&&r!==n;){if(_a(r))return r;r=r.parentElement}return null}function _a(e){if(e.getAttribute("aria-disabled")==="true")return!1;let t=e.tagName.toLowerCase();if(t==="a")return e.hasAttribute("href");if(Na.has(t))return!("disabled"in e&&e.disabled);if(t==="summary")return!0;let n=Ha(e);if(n&&Oa.has(n))return!0;let r=e.getAttribute("tabindex");return r!==null&&Number.parseInt(r,10)>=0}function Ha(e){let t=e.getAttribute("role");if(!t)return null;for(let n of t.split(/\s+/)){let r=n.toLowerCase();if($a.has(r))return r}return null}var Va=new Set(["bugdrop-element-picker-overlay","bugdrop-element-picker-highlight","bugdrop-element-picker-tooltip","bugdrop-element-picker-cancel"]);function Ua(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}function qa(){let e=document.createElement("div");return e.id="bugdrop-element-picker-overlay",e.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    cursor: crosshair;
    touch-action: none;
    user-select: none;
    background: transparent;
  `,e}function Wa(e){let t=document.createElement("div");return t.id="bugdrop-element-picker-highlight",t.style.cssText=`
    position: fixed;
    box-sizing: content-box;
    pointer-events: none;
    border: ${e.bw}px solid ${e.accent};
    background: transparent;
    z-index: 2147483645;
    transition: all 0.05s ease-out;
    box-shadow: none;
    border-radius: ${e.radius};
  `,t}function ja(e,t){let n=document.createElement("div");if(n.id="bugdrop-element-picker-tooltip",n.style.cssText=`
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
  `,!t)return n.textContent=`${p().elementPickerInstruction} (${p().escToCancel})`,{tooltip:n,cancelButton:null};let r=Za(e.accent);return n.append(`${p().elementPickerTouchInstruction} (`,r,")"),{tooltip:n,cancelButton:r}}function Ga(e,t){let n=t.getBoundingClientRect();e.style.top=`${n.top-2}px`,e.style.left=`${n.left-2}px`,e.style.width=`${n.width+4}px`,e.style.height=`${n.height+4}px`,e.style.display="block"}function Xa(e){e.overlay.addEventListener("pointerdown",e.onPointerDown),e.overlay.addEventListener("pointermove",e.onPointerMove),e.overlay.addEventListener("pointerup",e.onPointerUp),e.overlay.addEventListener("pointercancel",e.onPointerCancel),document.addEventListener("mousemove",e.onMouseMove,!0)}function Ka(e){e.overlay.removeEventListener("pointerdown",e.onPointerDown),e.overlay.removeEventListener("pointermove",e.onPointerMove),e.overlay.removeEventListener("pointerup",e.onPointerUp),e.overlay.removeEventListener("pointercancel",e.onPointerCancel),document.removeEventListener("mousemove",e.onMouseMove,!0)}function xr(e){return new Promise(t=>{setTimeout(()=>{Ya(t,e)},50)})}function Ya(e,t){let{accent:n,fontFamily:r,radius:o,bw:i,tooltipBg:a,tooltipText:s,tooltipBorder:l}=ht(t),d=qa();document.body.appendChild(d);let c=Wa({accent:n,bw:i,radius:o});document.body.appendChild(c);let{tooltip:u,cancelButton:m}=ja({accent:n,fontFamily:r,radius:o,bw:i,tooltipBg:a,tooltipText:s,tooltipBorder:l},Ua());document.body.appendChild(u);let v=null,f=null,x=!1,E;function F(b){return b===d||b===c||b===u||Va.has(b.id)}function D(b,q){let Y=d.style.pointerEvents;return d.style.pointerEvents="none",(()=>{try{return document.elementsFromPoint(b,q)}finally{d.style.pointerEvents=Y}})().find(at=>!(F(at)||Q(at)))}function R(b,q,Y){let le=D(b,q);return le?vr(le):Y}function P(b){v=R(b.clientX,b.clientY,v),v&&Ga(c,v)}function I(b,q,Y=!1){v=R(b,q,v),h(v,Y)}function h(b,q=!1){x||(x=!0,A(q),e(b))}function L(b){f!==null||!b.isPrimary||(b.preventDefault(),b.stopPropagation(),f=b.pointerId,d.setPointerCapture?.(b.pointerId),v=R(b.clientX,b.clientY,v))}function O(b){f!==null&&b.pointerId!==f||(b.preventDefault(),b.stopPropagation(),P(b))}function z(b){f!==null&&b.pointerId!==f||(b.preventDefault(),b.stopPropagation(),f=null,d.releasePointerCapture?.(b.pointerId),I(b.clientX,b.clientY,!0))}function N(b){b.pointerId===f&&(f=null,d.releasePointerCapture?.(b.pointerId))}function T(b){if(x){if(document.removeEventListener("click",T,!0),Q(b.target))return;b.preventDefault(),b.stopImmediatePropagation();return}if(b.preventDefault(),b.stopImmediatePropagation(),b.target instanceof Element&&b.target.id==="bugdrop-element-picker-cancel"){h(null);return}I(b.clientX,b.clientY)}function k(b){b.target instanceof Element&&b.target.id==="bugdrop-element-picker-cancel"||(b.type==="pointerdown"&&L(b),b.type==="pointermove"&&O(b),b.type==="pointerup"&&z(b),b.type==="pointercancel"&&N(b),b.preventDefault(),b.stopImmediatePropagation())}function g(b){b.key==="Escape"&&h(null)}function y(b){b.preventDefault(),b.stopPropagation(),h(null)}function A(b=!1){E!==void 0&&(window.clearTimeout(E),E=void 0),Ka({overlay:d,onPointerDown:L,onPointerMove:O,onPointerUp:z,onPointerCancel:N,onMouseMove:P}),b?E=window.setTimeout(()=>{document.removeEventListener("click",T,!0),E=void 0},1e3):document.removeEventListener("click",T,!0),document.removeEventListener("keydown",g),V(),m?.removeEventListener("click",y),d.remove(),c.remove(),u.remove(),document.body.style.cursor=""}function $(){window.addEventListener("pointerdown",k,!0),window.addEventListener("pointermove",k,!0),window.addEventListener("pointerup",k,!0),window.addEventListener("pointercancel",k,!0)}function V(){window.removeEventListener("pointerdown",k,!0),window.removeEventListener("pointermove",k,!0),window.removeEventListener("pointerup",k,!0),window.removeEventListener("pointercancel",k,!0)}document.body.style.cursor="crosshair",$(),Xa({overlay:d,onPointerDown:L,onPointerMove:O,onPointerUp:z,onPointerCancel:N,onMouseMove:P}),document.addEventListener("click",T,!0),document.addEventListener("keydown",g),m?.addEventListener("click",y)}function Za(e){let t=document.createElement("button");return t.id="bugdrop-element-picker-cancel",t.type="button",t.textContent=p().cancel,t.style.cssText=`
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
  `,t}var Er=10;function kr(e,t){return new Promise(n=>{setTimeout(()=>{Ja(n,e,t)},50)})}function Ja(e,t,n){let{accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:d}=ht(t),c=Qa();document.body.appendChild(c);let u=es({accent:r,bw:a,radius:i});document.body.appendChild(u);let m=n?.redactionsAvailable?p().areaPickerRedactionInstruction:p().areaPickerInstruction,v=ns(),f=ts({accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:d},m,v);document.body.appendChild(f);let x=f.querySelector("#bugdrop-area-picker-cancel"),E=0,F=0,D=!1,R=null;function P(k,g,y,A){let $=Math.min(k,y),V=Math.min(g,A),b=Math.abs(y-k),q=Math.abs(A-g);u.style.left=`${$}px`,u.style.top=`${V}px`,u.style.width=`${b}px`,u.style.height=`${q}px`,u.style.display="block";let Y=$+b,le=V+q;c.style.clipPath=`polygon(
      0% 0%, 0% 100%, ${$}px 100%, ${$}px ${V}px,
      ${Y}px ${V}px, ${Y}px ${le}px,
      ${$}px ${le}px, ${$}px 100%, 100% 100%, 100% 0%
    )`}function I(k){R!==null||!k.isPrimary||(k.preventDefault(),E=k.clientX,F=k.clientY,D=!0,R=k.pointerId,c.setPointerCapture?.(k.pointerId))}function h(k){!D||k.pointerId!==R||(k.preventDefault(),P(E,F,k.clientX,k.clientY))}function L(k){if(!D||k.pointerId!==R)return;k.preventDefault(),D=!1,R=null,c.releasePointerCapture?.(k.pointerId);let g=Math.abs(k.clientX-E),y=Math.abs(k.clientY-F);if(g<Er||y<Er){u.style.display="none",c.style.clipPath="";return}let A=Math.min(E,k.clientX)+window.scrollX,$=Math.min(F,k.clientY)+window.scrollY;T(),e(new DOMRect(A,$,g,y))}function O(k){k.pointerId===R&&(D=!1,R=null,u.style.display="none",c.style.clipPath="")}function z(k){k.key==="Escape"&&(T(),e(null))}function N(){T(),e(null)}function T(){c.removeEventListener("pointerdown",I),document.removeEventListener("pointermove",h),document.removeEventListener("pointerup",L),document.removeEventListener("pointercancel",O),document.removeEventListener("keydown",z),x?.removeEventListener("click",N),c.remove(),u.remove(),f.remove()}c.addEventListener("pointerdown",I),document.addEventListener("pointermove",h),document.addEventListener("pointerup",L),document.addEventListener("pointercancel",O),document.addEventListener("keydown",z),x?.addEventListener("click",N)}function Qa(){let e=document.createElement("div");return e.id="bugdrop-area-picker-overlay",e.style.cssText=`
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
  `,e}function es(e){let t=document.createElement("div");return t.id="bugdrop-area-picker-selection",t.style.cssText=`
    position: fixed;
    border: ${e.bw}px solid ${e.accent};
    box-shadow: 0 0 0 4px color-mix(in srgb, ${e.accent} 30%, transparent);
    border-radius: ${e.radius};
    z-index: 2147483647;
    pointer-events: none;
    display: none;
  `,t}function ts(e,t,n){let r=document.createElement("div");if(r.id="bugdrop-area-picker-tooltip",r.style.cssText=`
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
    `,r.append(t," (",o,")")}else r.textContent=`${t} (${p().escToCancel})`;return r}function ns(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}var cn="#ff0000",rs="#000000";var yt=Math.PI/7,Sr=2,Cr=4,wt=1;function Tr(e,t){let n=document.createElement("canvas"),r=n.getContext("2d"),o="draw",i=!1,a=[],s=null,l=!1,d=[],c=new Image;c.onload=()=>{n.width=c.width,n.height=c.height,n.style.maxWidth="100%",n.style.height="auto",n.style.cursor="crosshair",r.drawImage(c,0,0),u()},c.src=t,e.appendChild(n);function u(){d.push(r.getImageData(0,0,n.width,n.height))}function m(g){r.putImageData(g,0,0)}function v(){return d[d.length-1]??null}function f(g,y){return Math.hypot(y.x-g.x,y.y-g.y)}function x(){window.removeEventListener("mouseup",k),i=!1,a=[],s=null,l=!1}function E(){s&&m(s),x()}function F(g){let y=n.getBoundingClientRect(),A=c.width/y.width,$=c.height/y.height,V=(g.clientX-y.left)*A,b=(g.clientY-y.top)*$;return{x:Math.max(0,Math.min(n.width,V)),y:Math.max(0,Math.min(n.height,b))}}function D(){let g=n.getBoundingClientRect(),y=Math.max(n.width/g.width,n.height/g.height,1);return Math.round(5.5*y)}function R(g,y){let A=D();r.beginPath(),r.moveTo(g.x,g.y),r.lineTo(y.x,y.y),r.strokeStyle=cn,r.lineWidth=A,r.lineCap="round",r.lineJoin="round",r.stroke()}function P(g,y){R(g,y);let A=Math.atan2(y.y-g.y,y.x-g.x),$=D()*5;r.beginPath(),r.moveTo(y.x,y.y),r.lineTo(y.x-$*Math.cos(A-yt),y.y-$*Math.sin(A-yt)),r.lineTo(y.x-$*Math.cos(A+yt),y.y-$*Math.sin(A+yt)),r.closePath(),r.fillStyle=cn,r.fill()}function I(g,y){r.strokeStyle=cn,r.lineWidth=D(),r.lineCap="round",r.lineJoin="round",r.strokeRect(g.x,g.y,y.x-g.x,y.y-g.y)}function h(g,y){let A=Math.min(g.x,y.x),$=Math.min(g.y,y.y),V=Math.abs(y.x-g.x),b=Math.abs(y.y-g.y);return{x:A,y:$,width:V,height:b}}function L(g,y){let{x:A,y:$,width:V,height:b}=h(g,y),q=Math.max(0,Math.floor(A)-wt),Y=Math.max(0,Math.floor($)-wt),le=Math.min(n.width,Math.ceil(A+V)+wt),at=Math.min(n.height,Math.ceil($+b)+wt);return{x:q,y:Y,width:Math.max(0,le-q),height:Math.max(0,at-Y)}}function O(g,y){let{width:A,height:$}=L(g,y);return A>=Cr&&$>=Cr}function z(g,y){let{x:A,y:$,width:V,height:b}=L(g,y);r.fillStyle=rs,r.fillRect(A,$,V,b)}function N(g){let y=v();y&&(i=!0,a=[F(g)],s=y,l=!1,window.addEventListener("mouseup",k))}function T(g){if(!i||!s)return;let y=F(g);o==="draw"?(R(a[a.length-1],y),a.push(y),l=l||f(a[0],y)>=Sr):(m(s),o==="arrow"?P(a[0],y):o==="rect"?I(a[0],y):o==="redact"&&z(a[0],y))}function k(g){if(!i||!s){x();return}let y=F(g),A=a[0];if(!(o==="redact"?O(A,y):l||f(A,y)>=Sr)){m(s),x();return}o==="arrow"?(m(s),P(A,y)):o==="rect"?(m(s),I(A,y)):o==="redact"?(m(s),z(A,y)):o==="draw"&&!l&&R(A,y),u(),x()}return n.addEventListener("mousedown",N),n.addEventListener("mousemove",T),n.addEventListener("mouseup",k),{setTool(g){E(),o=g},undo(){if(s){E();return}if(d.length<=1)return;x(),d.pop();let g=v();g&&m(g)},getImageData(){return n.toDataURL("image/png")},destroy(){x(),n.removeEventListener("mousedown",N),n.removeEventListener("mousemove",T),n.removeEventListener("mouseup",k),n.remove()}}}function os(){return typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function Re(e,t=os){return e==="auto"?t():e}function vt(e){return e==="light"||e==="dark"||e==="auto"}function Ge(e,t){e.classList.toggle("bd-dark",t==="dark")}function Xe(e,t,n){let r=n==="dark",o=B(t.accentColor);if(o){let c=o;e.style.setProperty("--bd-primary",c),e.style.setProperty("--bd-primary-hover",bt(c)),e.style.setProperty("--bd-border-focus",c)}let i=B(t.bgColor);i&&(e.style.setProperty("--bd-bg-primary",i),r?(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 85%, white)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 70%, white)`)):(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 93%, black)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 85%, black)`)));let a=B(t.textColor);if(a){e.style.setProperty("--bd-text-primary",a);let c=i||(r?"#0f172a":"#fafaf9");e.style.setProperty("--bd-text-secondary",`color-mix(in srgb, ${a} 65%, ${c})`),e.style.setProperty("--bd-text-muted",`color-mix(in srgb, ${a} 40%, ${c})`)}let s=J(t.borderWidth)??null,l=B(t.borderColor)||null;if(s!==null||l!==null){let c=s!==null?`${s}px`:"1px",u=l||"var(--bd-border)";e.style.setProperty("--bd-border-width",c),l&&e.style.setProperty("--bd-border",u),e.style.setProperty("--bd-border-style",`var(--bd-border-width) solid ${u}`)}let d=dt(t.shadow)||null;if(d==="none")e.style.setProperty("--bd-shadow-sm","none"),e.style.setProperty("--bd-shadow-md","none"),e.style.setProperty("--bd-shadow-lg","none"),e.style.setProperty("--bd-shadow-glow","none");else if(d==="hard"){let c=l||(r?"#000":"#1a1a1a"),u=s!==null?"calc(var(--bd-border-width) + 2px)":"6px";e.style.setProperty("--bd-shadow-sm",`${c} 2px 2px 0 0`),e.style.setProperty("--bd-shadow-md",`${c} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-lg",`${c} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-glow","none")}}function xt(e){if(typeof window>"u"||!window.matchMedia)return typeof console<"u"&&console.warn&&console.warn('[BugDrop] window.matchMedia unavailable; data-theme="auto" will not react to OS theme changes.'),()=>{};let t=window.matchMedia("(prefers-color-scheme: dark)"),n=r=>{try{e(r.matches?"dark":"light")}catch(o){console.warn("[BugDrop] Error applying system theme change:",o)}};return t.addEventListener("change",n),()=>t.removeEventListener("change",n)}var Me=8,is="(hover: none), (pointer: coarse)",as="(max-width: 640px)";function ss(e,t,n){let r=Ue(e);return!!(r&&r!=="none"&&r!=="#"&&n!=="never"&&(t||n==="always"))}function Lr(e,t){let n=t.position==="bottom-left"?"left: 0":"right: 0",r=Re(t.theme),o=t.font==="inherit",i=t.font&&t.font!=="inherit"?Te(t.font):null,a=o||i?"":"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');",s=o?"inherit":i?`${i}, system-ui, sans-serif`:"'Space Grotesk', system-ui, sans-serif",l=J(t.radius)??null,d=l!==null?`${l}px`:"6px",c=l!==null?`${Math.round(l*1.4)}px`:"10px",u=l!==null?`${Math.round(l*2)}px`:"14px",m=J(t.borderWidth)??null,v=document.createElement("style");v.textContent=`
    ${a}

    :host {
      /* Typography */
      --bd-font: ${s};

      /* Radius */
      --bd-radius-sm: ${d};
      --bd-radius-md: ${c};
      --bd-radius-lg: ${u};

      /* Border */
      --bd-border-width: ${m!==null?`${m}px`:"1px"};

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
      --bd-border-focus: ${We};
      --bd-primary: ${We};
      --bd-primary-hover: ${bt(We)};
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
      border: ${m!==null?"var(--bd-border-style)":"none"};
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
  `,e.appendChild(v);let f=document.createElement("div");return f.className="bd-root",Ge(f,r),Xe(f,t,r),e.appendChild(f),f}function Ke(e){return`<p class="bd-redaction-note" style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-warning-bg, #fff8e1); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${U(e)}</p>`}function H(e,t,n,r=!1,o=""){let i=document.createElement("div");i.className="bd-overlay";let a=["bd-modal",o].filter(Boolean).join(" "),s=r?'<div class="bd-version">BugDrop vdevelopment:local</div>':"";return i.innerHTML=`
    <div class="${a}">
      <div class="bd-header">
        <span class="bd-modal-drag-indicator" aria-hidden="true">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </span>
        <h2 class="bd-title">${U(t)}</h2>
        <button class="bd-close">&times;</button>
      </div>
      <div class="bd-body">
        ${n}
      </div>
      ${s}
    </div>
  `,e.appendChild(i),ls(i),i}function ls(e){if(typeof window.matchMedia!="function"||window.matchMedia(is).matches)return;let t=e.querySelector(".bd-modal"),n=e.querySelector(".bd-header");if(!t||!n)return;let r=t,o=n,i=null,a=0,s=0,l=0,d=0,c=!1,u=null,m=()=>{c||(c=!0,D(),window.removeEventListener("resize",x),window.visualViewport?.removeEventListener("resize",x),u?.disconnect())};function v(h,L){let O=r.getBoundingClientRect(),z=Math.max(Me,window.innerWidth-O.width-Me),N=Math.max(Me,window.innerHeight-O.height-Me);return{left:Math.min(Math.max(h,Me),z),top:Math.min(Math.max(L,Me),N)}}function f(h,L){let O=v(h,L);r.style.left=`${O.left}px`,r.style.top=`${O.top}px`}function x(){if(!e.isConnected){m();return}if(!r.classList.contains("bd-modal--positioned"))return;if(window.matchMedia(as).matches){F();return}E();let h=r.getBoundingClientRect();f(h.left,h.top)}function E(){r.style.removeProperty("width"),r.style.removeProperty("max-width");let h=r.getBoundingClientRect(),L=Math.floor(window.innerWidth*.9);r.style.width=`${Math.min(h.width,L)}px`,r.style.maxWidth="none"}function F(){r.classList.remove("bd-modal--positioned","bd-modal--dragging"),r.style.removeProperty("left"),r.style.removeProperty("top"),r.style.removeProperty("width"),r.style.removeProperty("max-width")}function D(){i!==null&&(i=null,r.classList.remove("bd-modal--dragging"),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",P),window.removeEventListener("pointercancel",I))}function R(h){i===h.pointerId&&f(l+h.clientX-a,d+h.clientY-s)}function P(h){i===h.pointerId&&D()}function I(h){i===h.pointerId&&D()}o.addEventListener("pointerdown",h=>{if(h.target.closest("button, a, input, textarea, select, label"))return;h.preventDefault();let L=r.getBoundingClientRect();i=h.pointerId,a=h.clientX,s=h.clientY,l=L.left,d=L.top,r.classList.add("bd-modal--positioned","bd-modal--dragging"),r.style.width=`${L.width}px`,r.style.maxWidth="none",f(l,d),o.setPointerCapture(h.pointerId),window.addEventListener("pointermove",R),window.addEventListener("pointerup",P),window.addEventListener("pointercancel",I)}),window.addEventListener("resize",x),window.visualViewport?.addEventListener("resize",x),e.parentNode&&(u=new MutationObserver(()=>{e.isConnected||m()}),u.observe(e.parentNode,{childList:!0}))}function Fr(e,t,n,r,o="public"){return new Promise(i=>{let a=Ue(n),s=ss(n,r,o),l=s&&a?`<a href="${U(a)}" target="_blank" rel="noopener noreferrer" class="bd-issue-link">
          <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
          </svg>
          ${w(p().viewOnGitHub)}
        </a>`:"",d=r||o==="always"&&s?`
        <p class="bd-success-issue">${p().issueCreated(`<strong>#${t}</strong>`)}</p>
        ${l}
      `:`<p class="bd-success-issue">${w(p().feedbackSubmittedMessage)}</p>`,c=H(e,p().successTitle,`
        <div class="bd-success-content">
          <div class="bd-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          ${d}
        </div>
        <div class="bd-actions bd-success-actions">
          <button class="bd-btn bd-btn-primary" data-action="done">${w(p().done)}</button>
        </div>
        <div class="bd-powered-by">
          <a href="https://github.com/mean-weasel/bugdrop" target="_blank" rel="noopener noreferrer">Powered by BugDrop</a>
        </div>
      `,!0),u=c.querySelector(".bd-close"),m=c.querySelector('[data-action="done"]'),v=()=>{c.remove(),i()};u?.addEventListener("click",v),m?.addEventListener("click",v)})}function Pr(e,t,n=0,r){return new Promise(o=>{let i=[];r?.redactionUnavailable?i.push(p().viewportRedactionUnavailableNote):(n>0&&i.push(p().redactionCountNote(n)),r?.redactionLimitations&&i.push(p().redactionLimitationsNote));let a=i.length?Ke(i.join(" ")):"",l=r?.selectedElementCapture?`
        <p class="bd-selected-element-note" style="margin: -4px 0 12px; color: var(--bd-text-secondary); font-size: 13px;">
          ${p().selectedElementNote('<a href="https://bugdrop.dev/docs/configuration#select-element-screenshots" target="_blank" rel="noopener noreferrer">data-element-context-max-area</a>')}
        </p>
      `:"",d=H(e,p().reviewScreenshotTitle,`
        ${a}
        <p style="margin: 0 0 12px; color: var(--bd-text-secondary); font-size: 13px;">
          ${w(p().annotationInstruction)}
        </p>
        ${l}
        <div class="bd-tools">
          <button class="bd-tool active" data-tool="draw">\u270F\uFE0F ${w(p().toolDraw)}</button>
          <button class="bd-tool" data-tool="arrow">\u27A1\uFE0F ${w(p().toolArrow)}</button>
          <button class="bd-tool" data-tool="rect">\u25A2 ${w(p().toolRectangle)}</button>
          <button class="bd-tool" data-tool="redact">${w(p().toolRedact)}</button>
          <button class="bd-tool" data-action="undo">\u21B6 ${w(p().undo)}</button>
        </div>
        <div id="annotation-canvas" class="bd-annotation-stage"></div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-secondary" data-action="retake">${w(p().retake)}</button>
          <button class="bd-btn bd-btn-primary" data-action="done">${w(p().submitFeedback)}</button>
        </div>
      `,!1,"bd-modal--annotator"),c=d.querySelector("#annotation-canvas"),u=Tr(c,t),m=d.querySelectorAll("[data-tool]");m.forEach(F=>{F.addEventListener("click",D=>{let R=D.currentTarget,P=R.dataset.tool;P&&(m.forEach(I=>I.classList.remove("active")),R.classList.add("active"),u.setTool(P))})}),d.querySelector('[data-action="undo"]')?.addEventListener("click",()=>u.undo());let f=d.querySelector(".bd-close"),x=d.querySelector('[data-action="retake"]'),E=d.querySelector('[data-action="done"]');f?.addEventListener("click",()=>{u.destroy(),d.remove(),o("cancel")}),x?.addEventListener("click",()=>{u.destroy(),d.remove(),o("retake")}),E?.addEventListener("click",()=>{let F=u.getImageData();u.destroy(),d.remove(),o(F)})})}async function Et(e,t,n,r){return kt(e,()=>gr(t,n,r?.captureOptions),r)}async function Ar(e,t,n,r){return kt(e,()=>fr(t,n,r?.captureOptions),r)}async function kt(e,t,n){let r=n?.showLoading===!1?null:H(e,p().capturingTitle,`
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
              <div class="bd-spinner bd-spinner--lg"></div>
              <p class="bd-loading-text" style="margin-top: 12px;">${w(p().capturingScreenshot)}</p>
            </div>
          `);try{r&&await cs();let i=await(typeof t=="function"?t():t);return r?.remove(),us(i)}catch(o){console.warn("[BugDrop] Screenshot capture failed:",o),r?.remove();let i=n?.allowSkip!==!1,a=n?.allowChooseAgain!==!1;return o instanceof Le?ds(e):new Promise(s=>{let l=H(e,p().captureFailedTitle,`
          <div class="bd-error-message">
            <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            <span class="bd-error-message__text">${w(p().captureFailedMessage)}</span>
          </div>
          <div class="bd-actions">
            ${i?`<button class="bd-btn bd-btn-secondary" data-action="skip">${w(p().skipScreenshot)}</button>`:""}
            ${a?`<button class="bd-btn bd-btn-primary" data-action="choose-again">${w(p().chooseAnotherMethod)}</button>`:""}
          </div>
        `,!0),d=l.querySelector(".bd-close"),c=l.querySelector('[data-action="skip"]'),u=l.querySelector('[data-action="choose-again"]');d?.addEventListener("click",()=>{l.remove(),s({kind:"cancelled"})}),c?.addEventListener("click",()=>{l.remove(),s({kind:"skipped"})}),u?.addEventListener("click",()=>{l.remove(),s({kind:"choose-again"})})})}}function cs(){return typeof requestAnimationFrame!="function"?new Promise(e=>setTimeout(e,0)):new Promise(e=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>e())})})}function ds(e){return new Promise(t=>{let n=H(e,p().maskFailureTitle,`
        <div class="bd-error-message">
          <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
          <span class="bd-error-message__text">${w(p().maskFailureMessage)}</span>
        </div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-primary" data-action="skip">${w(p().continueWithoutScreenshot)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="skip"]');r?.addEventListener("click",()=>{n.remove(),t({kind:"cancelled"})}),o?.addEventListener("click",()=>{n.remove(),t({kind:"skipped"})})})}function us(e){return typeof e=="string"?{kind:"ok",dataUrl:e}:{kind:"ok",dataUrl:e.dataUrl,redaction:e.redaction}}function Dr(e,t){let n=e.getBoundingClientRect();if(!Mr(n))return e;let o=Math.max(1,window.innerWidth*window.innerHeight)*dr(t.maxViewportAreaMultiplier),i=e,a=e.parentElement;for(;a&&a!==document.body&&a!==document.documentElement;){let s=a.getBoundingClientRect(),l=s.width*s.height;Mr(s)&&l<=o&&ps(s,n)&&ms(s,n)&&(i=a),a=a.parentElement}return i}function Mr(e){return e.width>0&&e.height>0}function ps(e,t){return e.left<=t.left&&e.top<=t.top&&e.right>=t.right&&e.bottom>=t.bottom}function ms(e,t){let n=e.width>=t.width+160,r=e.height>=t.height+160,o=t.width*t.height,i=e.width*e.height;return n||r||i>=o*4}function zr(e){let t=[],n=e.ownerDocument.body,r=e;if(r===n)return St(r);for(;r&&r!==n;){let o=St(r);if(r.id){o=`#${Ye(r.id)}`,t.unshift(o);break}let i=Or(r).slice(0,2);i.length&&(o+=`.${i.map(Ye).join(".")}`),t.unshift(o),r=r.parentElement}return t.join(" > ")}function $r(e){let t=bs(e),n=t.map(gs),r=t.map(dn);return hs(n,r,e)}function bs(e){let t=[],n=e;for(;n;)t.unshift(n),n=n.parentElement;return t}function gs(e){let t=fs(e);return t.length<=128?t:dn(e)}function fs(e){let t=St(e);e.id&&(t+=`#${Ye(e.id)}`);let n=Or(e).slice(0,3);return n.length>0&&(t+=`.${n.map(Ye).join(".")}`),e.id||(t+=Nr(e)),t}function dn(e){return`${St(e)}${Nr(e)}`}function Or(e){return Array.from(e.classList).filter(Boolean)}function St(e){return Ye(e.localName||e.tagName.toLowerCase())}function hs(e,t,n){let r=e.join(" > ");return r.length<=1024?r:Ir(e,n)||Ir(t,n)||dn(n)}function Ir(e,t){for(let n=e.length-1;n>=0;n-=1){let r=e.slice(n).join(" > ");if(!(r.length>1024)&&ys(r,t))return r}return null}function ys(e,t){try{return t.ownerDocument.querySelector(e)===t}catch{return!1}}function Nr(e){let t=ws(e);return t>1||vs(e)?`:nth-of-type(${t})`:""}function ws(e){let t=1,n=e.previousElementSibling;for(;n;)n.tagName===e.tagName&&(t+=1),n=n.previousElementSibling;return t}function vs(e){let t=e.previousElementSibling;for(;t;){if(t.tagName===e.tagName)return!0;t=t.previousElementSibling}for(t=e.nextElementSibling;t;){if(t.tagName===e.tagName)return!0;t=t.nextElementSibling}return!1}function Ye(e){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):xs(e)}function xs(e){let t="";for(let n=0;n<e.length;n+=1){let r=e.charAt(n),o=e.charCodeAt(n),i=n===0,a=n===1,s=e.charCodeAt(0);if(o===0){t+="\uFFFD";continue}if(o>=1&&o<=31||o===127||i&&o>=48&&o<=57||a&&o>=48&&o<=57&&s===45){t+=`\\${o.toString(16)} `;continue}if(i&&o===45&&e.length===1){t+="\\-";continue}if(o>=128||o===45||o===95||o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122){t+=r;continue}t+=`\\${r}`}return t}function Br(e,t){let n=ee(),r=n&&br(),o=t?.allowSkip!==!1,i="";return r?i=Ke(p().viewportRedactionWarning):Ae()>0&&(i=Ke(p().redactionReviewNote)),new Promise(a=>{let s=n?`<p style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-bg-secondary, #f5f5f5); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${r?w(p().pageTooComplexViewportNote):w(p().pageTooComplexElementNote)}</p>`:"",l="";n?r&&(l=`<button class="bd-btn bd-btn-primary" data-action="viewport">${w(p().captureViewport)}</button>`):l=`<button class="bd-btn bd-btn-primary" data-action="capture">${w(p().fullPage)}</button>`;let d=H(e,p().captureScreenshotTitle,`
        <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${w(p().chooseWhatToCapture)}</p>
        ${s}
        ${i}
        <div class="bd-actions bd-screenshot-actions">
          ${l}
          ${n?"":`<button class="bd-btn bd-btn-secondary" data-action="area">${w(p().selectArea)}</button>`}
          <button class="bd-btn bd-btn-secondary" data-action="element">${w(p().selectElement)}</button>
          ${o?`<button class="bd-btn bd-btn-quiet" data-action="skip">${w(p().skipScreenshot)}</button>`:""}
        </div>
      `),c=d.querySelector(".bd-close"),u=d.querySelector('[data-action="skip"]'),m=d.querySelector('[data-action="element"]'),v=d.querySelector('[data-action="area"]'),f=d.querySelector('[data-action="capture"]'),x=d.querySelector('[data-action="viewport"]');c?.addEventListener("click",()=>{d.remove(),a({kind:"cancel"})}),u?.addEventListener("click",()=>{d.remove(),a({kind:"skip"})}),m?.addEventListener("click",()=>{d.remove(),a({kind:"element"})}),v?.addEventListener("click",()=>{d.remove(),a({kind:"area"})}),f?.addEventListener("click",()=>{d.remove(),a({kind:"capture"})}),x?.addEventListener("click",()=>{d.remove();let E=ln();E.catch(()=>{}),a({kind:"viewport",capture:E})})})}function Hr(e,t,n,r){return new Promise((o,i)=>{let a=!1,s=null,l=()=>{n.removeEventListener("abort",d),s?.disconnect()},d=()=>{a||(a=!0,_r(e),s=new MutationObserver(()=>_r(e)),s.observe(e,{childList:!0,subtree:!0}),s.observe(document.body,{childList:!0,subtree:!0}),o(r))};n.addEventListener("abort",d,{once:!0}),n.aborted&&d(),t.then(c=>{l(),a||o(c)},c=>{l(),a||i(c)})})}function _r(e){document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:!0}));let t=Array.from(e.querySelectorAll(".bd-overlay"));for(let n of t)n.querySelector(".bd-close")?.click(),n.remove()}function te(){return{screenshot:null,...un(),returnToForm:!1}}function un(){return{elementSelector:null,fullElementSelector:null}}function pn(e){return{accentColor:e.accentColor,font:e.font,radius:e.radius,borderWidth:e.borderWidth,bgColor:e.bgColor,textColor:e.textColor,borderColor:e.borderColor,theme:e.theme}}async function mn(e,t,n,r,o){if(o?.aborted)return{...te(),returnToForm:!0};let i=ks(e,t,n,r,o);return o?Hr(e,i,o,{...te(),returnToForm:!0}):i}async function ks(e,t,n,r,o){if(t.screenshotMode==="auto")return Ss(e,t);if(!n)return te();let i=t.screenshotMode==="required";for(;;){let a=await Ts(e,t,i);if(o?.aborted)return{...te(),returnToForm:!0};if(a.kind==="returnToForm")return{...te(),returnToForm:!0};if(a.kind==="chooseAgain")continue;if(a.kind==="empty"){if(!i&&Cs(a.reason)&&r(),i)continue;return{screenshot:null,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}let s=await Pr(e,a.screenshot,a.redactionCount,{redactionUnavailable:a.redactionUnavailable,...a.redactionLimitations?{redactionLimitations:!0}:{},...a.elementSelector?{selectedElementCapture:!0}:{}});if(o?.aborted)return{...te(),returnToForm:!0};if(s!=="retake")return s==="cancel"?{...te(),returnToForm:!0}:{screenshot:s,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}}async function Ss(e,t){if(ee())return te();let n=await Et(e,void 0,t.screenshotScale,{allowChooseAgain:!1});return n.kind==="cancelled"?{...te(),returnToForm:!0}:{screenshot:n.kind==="ok"?n.dataUrl:null,elementSelector:null,fullElementSelector:null,returnToForm:!1}}function Cs(e){return e==="explicit-skip"||e==="capture-failure-skip"}async function Ts(e,t,n){let r=await Br(e,{allowSkip:!n});switch(r.kind){case"cancel":return{kind:"returnToForm"};case"skip":return be("explicit-skip");case"viewport":return Ls(e,r,n);case"capture":return Fs(e,t,n);case"element":return Ps(e,t,n);case"area":return As(e,t,n);default:return Rs(r)}}async function Ls(e,t,n){let r=await kt(e,t.capture,{allowSkip:!n,showLoading:!1});return r.kind==="cancelled"?{kind:"returnToForm"}:r.kind==="choose-again"?{kind:"chooseAgain"}:r.kind==="skipped"?be("capture-failure-skip"):{kind:"captured",screenshot:r.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:0,redactionUnavailable:!0,redactionLimitations:!1}}async function Fs(e,t,n){let r=await Et(e,void 0,t.screenshotScale,{allowSkip:!n});return r.kind==="cancelled"?{kind:"returnToForm"}:r.kind==="choose-again"?{kind:"chooseAgain"}:r.kind==="skipped"?be("capture-failure-skip"):{kind:"captured",screenshot:r.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:r.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:r.redaction?.hasLimitations??!1}}async function Ps(e,t,n){let r=await xr(pn(t));if(!r)return be("selection-cancelled");let o={elementSelector:zr(r),fullElementSelector:$r(r)},i=Dr(r,{maxViewportAreaMultiplier:t.elementContextMaxArea}),a=await Et(e,i,t.screenshotScale,{allowSkip:!n,captureOptions:{highlightElement:r,highlightStyle:{accentColor:t.accentColor,radius:t.radius,borderWidth:t.borderWidth},pixelRatio:1}});return a.kind==="cancelled"?{kind:"returnToForm"}:a.kind==="choose-again"?{kind:"chooseAgain"}:a.kind==="skipped"?be("capture-failure-skip",o):{kind:"captured",screenshot:a.dataUrl,...o,redactionCount:a.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:a.redaction?.hasLimitations??!1}}async function As(e,t,n){let r=await kr(pn(t),{redactionsAvailable:Ae()>0});if(!r)return be("selection-cancelled");let o=await Ar(e,r,t.screenshotScale,{allowSkip:!n});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?be("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:o.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:o.redaction?.hasLimitations??!1}}function be(e,t=un()){return{kind:"empty",reason:e,...t}}function Rs(e){throw new Error(`Unhandled screenshot choice: ${JSON.stringify(e)}`)}function Vr(e,t=window){if(!e)return;let n=t[e];if(typeof n!="function"){console.warn(`[BugDrop] data-auth-token-provider "${e}" must reference a function.`);return}return n}async function ge(e){if(!e)return{};let t=await e();return t?{Authorization:t.startsWith("Bearer ")?t:`Bearer ${t}`}:{}}var Ct=String.raw`(?:"|')?\b(?:password|passwd|pwd|token|api[_-]?key|secret|authorization|auth|cookie)\b(?:"|')?`,Ms=new RegExp(String.raw`(${Ct}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[\s\S]|(?!\2)[^\\])*?\2`,"gi"),Ds=new RegExp(String.raw`(${Ct}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[^\r\n]|(?!\2)[^\\\r\n])*(?=\r?\n|$)`,"gi"),Is=new RegExp(String.raw`(${Ct}\s*[:=]\s*)(?:\[[^\]\r\n]*\]|\{[^\}\r\n]*\})`,"gi"),zs=new RegExp(String.raw`(${Ct}\s*[:=]\s*)(?!Bearer\b)[^"',\s}&]+`,"gi"),$s=/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,Os=/\b[A-Za-z0-9+/_=-]{32,}\b/g;function Ur(e){return e.replace($s,"Bearer [redacted]").replace(Is,"$1[redacted]").replace(Ms,"$1$2[redacted]$2").replace(Ds,"$1$2[redacted]").replace(zs,"$1[redacted]").replace(Os,"[redacted]")}var Ns=50,Bs=1e3,Lt=[],qr=!1;function Wr(){qr||typeof window>"u"||typeof console>"u"||(qr=!0,Tt("log"),Tt("info"),Tt("warn"),Tt("error"),window.addEventListener("error",e=>{bn({level:"error",message:e.message||"Unhandled error",timestamp:new Date().toISOString(),sourceUrl:e.filename||void 0,lineNumber:e.lineno||void 0,columnNumber:e.colno||void 0})}),window.addEventListener("unhandledrejection",e=>{bn({level:"error",message:`Unhandled promise rejection: ${jr(e.reason)}`,timestamp:new Date().toISOString()})}))}function Ft(){return Lt.map(e=>({...e}))}function Tt(e){let t=console[e];typeof t=="function"&&(console[e]=(...n)=>{bn({level:e,message:n.map(jr).join(" "),timestamp:new Date().toISOString(),..._s()}),t.apply(console,n)})}function bn(e){for(Lt.push({...e,message:Ur(e.message).slice(0,Bs)});Lt.length>Ns;)Lt.shift()}function jr(e){if(e instanceof Error)return e.stack||e.message;if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}function _s(){let e=new Error().stack;if(!e)return{};for(let t of e.split(`
`).slice(2)){if(t.includes("console-logs"))continue;let n=t.match(/\(?((?:https?:|file:|\/)[^():]+):(\d+):(\d+)\)?$/);if(n)return{sourceUrl:n[1],lineNumber:Number(n[2]),columnNumber:Number(n[3])}}return{}}var At=new Set,Gr=!1,gn=!1;function ce(e){At.add(e),Gr||Hs();let t=!1;return()=>{t||(t=!0,At.delete(e))}}function Hs(){Gr=!0;let e=n=>{Pt(n)&&n.preventDefault()},t=n=>{if(!gn&&Vs(n)){if(n.type==="focusin"){n.stopImmediatePropagation();return}if(n.type==="focusout"){gn=!0;try{Us(n)}finally{gn=!1}n.stopImmediatePropagation();return}n.stopImmediatePropagation()}};for(let n of["dismissableLayer.pointerDownOutside","dismissableLayer.interactOutside"])document.addEventListener(n,e,!0);window.addEventListener("focusin",t,!0),window.addEventListener("focusout",t,!0)}function Pt(e){let t=e.detail?.originalEvent,n=typeof t?.composedPath=="function"?t.composedPath():typeof e.composedPath=="function"?e.composedPath():[];return Array.from(At).some(r=>n.includes(r)||(t?.target??e.target)===r)}function Vs(e){if(!(e instanceof FocusEvent)||e.type==="focusin")return Pt(e);if(e.type!=="focusout")return!1;let t=e.relatedTarget;return Array.from(At).some(r=>t===r||t instanceof Node&&(r.shadowRoot?.contains(t)??!1))&&!Pt(e)}function Us(e){let t=typeof e.composedPath=="function"?e.composedPath():[];for(let n of t)if(n instanceof HTMLElement&&(n.dispatchEvent(new FocusEvent("focusout",{bubbles:!1,composed:!1,relatedTarget:e instanceof FocusEvent?e.relatedTarget:null})),n===document.body))break}var Rt;function De(){Rt?.close()}function Mt(e){return Rt=e,()=>{Rt===e&&(Rt=void 0)}}var qs="bugdrop-variant@1";function Xr(e){let t=Object.freeze({kind:"variant",config:e}),n=Object.freeze([t]);return Object.freeze({id:qs,variantId:e.id,screens:n})}var ie=class extends TypeError{constructor(n,r){super(r);this.fieldId=n;this.name="VariantAnswerError"}fieldId};function fe(e,t){if(!js(t))throw new ie(null,"BugDrop variant answers must be an object");let n=new Set(e.map(o=>o.id)),r=Object.keys(t).find(o=>!n.has(o));if(r)throw new ie(null,`Unknown BugDrop variant answer: ${r}`)}function Ie(e,t){return fe(e,t),Object.fromEntries(e.map(n=>[n.id,Ws(n,t[n.id])]))}function Ws(e,t){if(e.type==="shortText"||e.type==="longText"){if(t==null||t===""){if(e.required)throw de(e,`Answer ${e.id} is required`);return""}if(typeof t!="string")throw de(e,`Answer ${e.id} must be text`);let n=t.trim();if(e.required&&!n)throw de(e,`Answer ${e.id} is required`);let r=e.minLength??0,o=e.maxLength??(e.type==="shortText"?500:5e3);if(n.length<r||n.length>o)throw de(e,`Answer ${e.id} must be ${r}-${o} characters`);return n}if(e.type==="rating"){let n=e.scale??5;if(t==null||t===""){if(e.required)throw de(e,`Answer ${e.id} is required`);return""}if(!Number.isInteger(t)||t<1||t>n)throw de(e,`Answer ${e.id} must be a rating from 1-${n}`);return t}if(t==null||t===""){if(e.required)throw de(e,`Answer ${e.id} is required`);return""}if(typeof t!="string"||!e.options.some(n=>n.value===t))throw de(e,`Answer ${e.id} must be a configured choice`);return t}function de(e,t){return new ie(e.id,t)}function js(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function ue(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=`${r}-label`,i=`${r}-help`,a=`${r}-error`,s=document.createElement("label");if(s.className="bdv-label",s.id=o,s.htmlFor=r,s.textContent=e.label,e.required){let c=document.createElement("span");c.className="bdv-required",c.textContent=" *",c.setAttribute("aria-hidden","true"),s.appendChild(c)}n.appendChild(s);let l=[];if(e.helpText){let c=document.createElement("div");c.className="bdv-help",c.id=i,c.textContent=e.helpText,n.appendChild(c),l.push(i)}let d=document.createElement("div");return d.className="bdv-error",d.id=a,d.hidden=!0,d.setAttribute("aria-live","polite"),n.appendChild(d),l.push(a),{wrapper:n,label:s,controlId:r,labelId:o,describedBy:l.join(" ")||null,setError(c,u){d.textContent=u??"",d.hidden=!u,u?c.setAttribute("aria-invalid","true"):c.removeAttribute("aria-invalid")}}}function Dt(e,t,n){e.id=n.controlId,e.className="bdv-input",e.required=t.required??!1,e.setAttribute("aria-required",String(t.required??!1)),n.describedBy&&e.setAttribute("aria-describedby",n.describedBy),t.placeholder&&(e.placeholder=t.placeholder),e.minLength=t.minLength??0,e.maxLength=t.maxLength??(t.type==="shortText"?500:5e3),n.wrapper.insertBefore(e,n.wrapper.querySelector(".bdv-error"))}function Kr(e,t){let n=ue(e,t),r=document.createElement("textarea");return r.rows=e.rows??4,Dt(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function Yr(e,t){let n=ue(e,t),r=e.scale??5,o=document.createElement("div");o.id=n.controlId,o.className="bdv-rating",o.setAttribute("role","radiogroup"),o.setAttribute("aria-labelledby",n.labelId),o.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&o.setAttribute("aria-describedby",n.describedBy);let i=[],a=null,s=()=>{for(let[c,u]of i.entries()){let m=c+1,v=a!==null&&m<=a;u.classList.toggle("bdv-rating-option--active",v),u.setAttribute("aria-checked",String(m===a)),u.tabIndex=m===(a??1)?0:-1}},l=(c,u=!1)=>{a=c,s(),u&&i[c-1]?.focus()},d=[];for(let c=1;c<=r;c+=1){let u=document.createElement("button");u.type="button",u.className="bdv-rating-option",u.setAttribute("role","radio"),u.setAttribute("aria-label",`${c} ${c===1?"star":"stars"}`),u.textContent=e.icon==="number"?String(c):"\u2605";let m=()=>l(c),v=f=>{let x=null;f.key==="ArrowRight"||f.key==="ArrowDown"?x=c===r?1:c+1:f.key==="ArrowLeft"||f.key==="ArrowUp"?x=c===1?r:c-1:f.key==="Home"?x=1:f.key==="End"?x=r:(f.key==="Enter"||f.key===" ")&&(x=c),x!==null&&(f.preventDefault(),l(x,!0))};u.addEventListener("click",m),u.addEventListener("keydown",v),d.push({button:u,click:m,keydown:v}),i.push(u),o.appendChild(u)}if(n.wrapper.insertBefore(o,n.wrapper.querySelector(".bdv-error")),e.lowLabel||e.highLabel){let c=document.createElement("div");c.className="bdv-rating-labels";let u=document.createElement("span");u.textContent=e.lowLabel??"";let m=document.createElement("span");m.textContent=e.highLabel??"",c.append(u,m),n.wrapper.insertBefore(c,n.wrapper.querySelector(".bdv-error"))}return s(),{field:e,element:n.wrapper,getValue:()=>a??"",setValue(c){a=Number.isInteger(c)&&c>=1&&c<=r?c:null,s()},setError:c=>n.setError(o,c),setDisabled(c){for(let u of i)u.disabled=c},focus(){i[(a??1)-1]?.focus()},dispose(){for(let c of d)c.button.removeEventListener("click",c.click),c.button.removeEventListener("keydown",c.keydown)}}}function Zr(e,t){let n=ue(e,t),r=document.createElement("input");return r.type="text",Dt(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function Jr(e,t){let n=ue(e,t),r=document.createElement("div");r.className=`choice ${e.display??""}`,r.setAttribute("role","radiogroup"),r.setAttribute("aria-labelledby",n.labelId),r.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&r.setAttribute("aria-describedby",n.describedBy);let o=e.options.map(a=>{let s=document.createElement("label"),l=document.createElement("input");if(l.type="radio",l.name=n.controlId,l.value=a.value,s.append(l,a.label),a.description){let d=document.createElement("span");d.className="bdv-help",d.textContent=a.description,s.appendChild(d)}return r.appendChild(s),l});n.wrapper.insertBefore(r,n.wrapper.querySelector(".bdv-error"));let i=()=>r.querySelector(":checked");return{field:e,element:n.wrapper,getValue:()=>i()?.value??"",setValue(a){for(let s of o)s.checked=s.value===a},setError:a=>n.setError(r,a),setDisabled(a){for(let s of o)s.disabled=a},focus(){(i()??o[0])?.focus()},dispose(){}}}function It(e,t){return e.type==="shortText"?Zr(e,t):e.type==="longText"?Kr(e,t):e.type==="rating"?Yr(e,t):Jr(e,t)}function zt(e){let{config:t,instanceId:n}=e,r={...e.context??{}},o={...e.initialAnswers??{}};fe(t.fields,o);let i=document.createElement("section");i.className="bdv-surface";let a=`${n}-title`;i.setAttribute("aria-labelledby",a);let s=document.createElement("div");s.className="bdv-header";let l=document.createElement("h2");if(l.className="bdv-title",l.id=a,l.textContent=t.content.title,s.appendChild(l),t.content.description){let T=document.createElement("p");T.className="bdv-description",T.textContent=t.content.description,s.appendChild(T)}i.appendChild(s);let d=document.createElement("form");d.className="bdv-form",d.noValidate=!0;let c=document.createElement("div");c.className="bdv-fields";let u=t.fields.map(T=>It(T,n));for(let T of u)c.appendChild(T.element);d.appendChild(c);let m=document.createElement("div");m.className="bdv-actions";let v=document.createElement("button");v.type="submit",v.className="bdv-submit",v.textContent=t.content.submitLabel??"Submit",m.appendChild(v);let f;e.cancel&&(f=document.createElement("button"),f.type="button",f.className="bdv-cancel",f.textContent=e.cancel.label,f.addEventListener("click",e.cancel.onCancel),m.appendChild(f)),d.appendChild(m);let x=document.createElement("p");x.className="bdv-status",x.setAttribute("role","status"),x.setAttribute("aria-live","polite"),d.appendChild(x),i.appendChild(d);let{success:E,successLink:F}=Gs(t);i.appendChild(E);let D=ne("submission"),R=!1,P=!1,I=T=>{R=T,d.setAttribute("aria-busy",String(T)),v.disabled=T,f&&(f.disabled=T);for(let k of u)k.setDisabled(T)},h=()=>{x.textContent="",x.removeAttribute("data-kind");for(let T of u)T.setError(null)},L=()=>{for(let T of u)T.setValue(o[T.field.id]??"")},O=()=>Object.fromEntries(u.map(T=>[T.field.id,T.getValue()])),z=async T=>{if(T.preventDefault(),R||P)return;h();let k;try{k=Ie(t.fields,O())}catch(g){if(g instanceof ie&&g.fieldId){let y=u.find(A=>A.field.id===g.fieldId);y?.setError(Xs(g)),y?.focus()}else x.textContent=g instanceof Error?g.message:"Please check your response.",x.dataset.kind="error";return}I(!0),x.textContent="Submitting\u2026";try{let g=await e.submit(k,{context:r,submissionId:D});if(P)return;I(!1),F.hidden=!g.isPublic,g.isPublic&&(F.href=g.issueUrl),d.hidden=!0,E.hidden=!1,E.focus(),e.onSubmitted?.(g)}catch(g){if(P)return;x.textContent=g instanceof Error?g.message:"Failed to submit feedback.",x.dataset.kind="error",I(!1)}},N=T=>{T.key==="Enter"&&T.target instanceof HTMLInputElement&&T.target.type!=="submit"&&T.preventDefault()};return d.addEventListener("submit",z),d.addEventListener("keydown",N),L(),{element:i,reset(){R||P||(D=ne("submission"),h(),L(),E.hidden=!0,F.removeAttribute("href"),d.hidden=!1)},dispose(){if(!P){P=!0,d.removeEventListener("submit",z),d.removeEventListener("keydown",N),f&&e.cancel&&f.removeEventListener("click",e.cancel.onCancel);for(let T of u)T.dispose()}}}}function ne(e){if(typeof globalThis.crypto?.randomUUID=="function")return`${e}-${globalThis.crypto.randomUUID()}`;if(typeof globalThis.crypto?.getRandomValues!="function")throw new Error("BugDrop rendered variants require a cryptographically secure random generator");let t=globalThis.crypto.getRandomValues(new Uint8Array(16));return`${e}-${Array.from(t,n=>n.toString(16).padStart(2,"0")).join("")}`}function Gs(e){let t=document.createElement("div");t.className="bdv-success",t.hidden=!0,t.tabIndex=-1;let n=document.createElement("h3");n.className="bdv-success-title",n.textContent=e.content.successTitle??"Thanks for your feedback!";let r=document.createElement("p");r.className="bdv-success-message",r.textContent=e.content.successMessage??"Your response was submitted.";let o=document.createElement("a");return o.className="bdv-success-link",o.textContent="View GitHub Issue",o.target="_blank",o.rel="noopener noreferrer",t.append(n,r,o),{success:t,successLink:o}}function Xs(e){if(!e.fieldId)return e.message;let t=`Answer ${e.fieldId} `,n=e.message.startsWith(t)?e.message.slice(t.length):e.message;return n.charAt(0).toUpperCase()+n.slice(1)}function ze(e,t,n){let r=document.createElement("style");r.textContent=Ks,e.appendChild(r);let o=document.createElement("div");o.className="bdv-root",o.dataset.presentation=n,t.presentation.kind==="modal"&&(o.dataset.size=t.presentation.size??"default"),o.dataset.density=t.appearance?.density??"comfortable",o.dataset.columns=String(t.presentation.columns??1);let i=B(t.appearance?.accentColor);i&&o.style.setProperty("--bdv-accent",i),e.appendChild(o);let a=t.appearance?.theme??"auto",s=d=>{o.classList.toggle("bdv-dark",d==="dark")};s(Re(a));let l=a==="auto"?xt(s):()=>{};return{root:o,dispose(){l(),r.remove(),o.remove()}}}var Ks=`
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
  .bdv-rating-option:hover,
  .bdv-rating-option--active { color: var(--bdv-accent); border-color: var(--bdv-accent); }
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
`;function Qr(e){if(!(e.target instanceof HTMLElement))throw new TypeError("BugDrop inline variant target must be an HTMLElement");if(e.config.presentation.kind!=="inline")throw new TypeError("BugDrop mount() requires an inline variant");fe(e.config.fields,e.options?.initialAnswers??{});let t=ne(e.config.id),n=document.createElement("div");n.dataset.bugdropOwned="",n.dataset.bugdropInstance=t;let r=n.attachShadow({mode:"open"}),o=ce(n),i=ze(r,e.config,"inline"),a=zt({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit});i.root.appendChild(a.element),e.target.appendChild(n);let s=!1;return Object.freeze({instanceId:t,reset(){s||a.reset()},unmount(){s||(s=!0,a.dispose(),o(),i.dispose(),n.remove())}})}function to(e){if(e.config.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");fe(e.config.fields,e.options?.initialAnswers??{}),De();let t=ne(e.config.id),n=document.activeElement instanceof HTMLElement?document.activeElement:null,r=document.body.style.getPropertyValue("overflow"),o=document.body.style.getPropertyPriority("overflow"),i=document.createElement("div");i.dataset.bugdropOwned="",i.dataset.bugdropInstance=t,Object.assign(i.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let a=i.attachShadow({mode:"open"}),s=ze(a,e.config,"modal"),l=document.createElement("div");l.className="bdv-overlay",s.root.appendChild(l);let d,c=new Promise(h=>{d=h}),u=!1,m=!1,v=()=>{},f=h=>{u||(u=!0,d(h))},x=()=>{m||(m=!0,f({status:"closed"}),v(),a.removeEventListener("keydown",D),l.removeEventListener("pointerdown",R),E.dispose(),P(),s.dispose(),i.remove(),Ys(r,o),n?.isConnected&&n.focus())},E=zt({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit,cancel:{label:e.config.content.cancelLabel??"Cancel",onCancel:x},onSubmitted:h=>f({status:"submitted",result:h})});E.element.setAttribute("role","dialog"),E.element.setAttribute("aria-modal","true"),E.element.dataset.size=e.config.presentation.size??"default";let F=document.createElement("button");F.type="button",F.className="bdv-close",F.setAttribute("aria-label","Close"),F.textContent="\xD7",F.addEventListener("click",x,{once:!0}),E.element.prepend(F),l.appendChild(E.element);function D(h){if(!(h instanceof KeyboardEvent))return;if(h.key==="Escape"){h.preventDefault(),x();return}if(h.key!=="Tab")return;let L=eo(E.element);if(L.length===0){h.preventDefault(),E.element.focus();return}let O=a.activeElement,z=L[0],N=L.at(-1);h.shiftKey&&(O===z||!E.element.contains(O))?(h.preventDefault(),N.focus()):!h.shiftKey&&O===N&&(h.preventDefault(),z.focus())}function R(h){h.target===l&&x()}document.body.style.setProperty("overflow","hidden"),document.body.appendChild(i);let P=ce(i);a.addEventListener("keydown",D),l.addEventListener("pointerdown",R);let I=Object.freeze({instanceId:t,result:c,close:x});return v=Mt(I),queueMicrotask(()=>{if(m)return;(E.element.querySelector('textarea:not(:disabled), input:not(:disabled), [role="radio"][tabindex="0"]')??eo(E.element)[0]??E.element).focus()}),I}function no(e){return Object.freeze({instanceId:ne(e),result:Promise.resolve({status:"busy"}),close(){}})}function eo(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&t.getAttribute("aria-hidden")!=="true")}function Ys(e,t){e?document.body.style.setProperty("overflow",e,t):document.body.style.removeProperty("overflow")}var Ot=/^[a-z][a-z0-9_-]{0,63}$/,ro=/{{\s*([^{}]+?)\s*}}/g,Zs=new Set(["bug","feature","question","feedback"]),Js=new Set(["shortText","longText","rating","singleChoice"]),Qs=new Set(["id","configVersion","presentation","appearance","content","fields","issue"]),el=new Set(["title","description","submitLabel","cancelLabel","successTitle","successMessage"]),tl=new Set(["theme","accentColor","density"]),nl=new Set(["classification","title","sections"]),$t=["id","type","label","helpText","required","layout"],rl={shortText:new Set([...$t,"placeholder","minLength","maxLength"]),longText:new Set([...$t,"placeholder","rows","minLength","maxLength"]),rating:new Set([...$t,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([...$t,"options","display"])};function io(e){if(!re(e))throw new TypeError("BugDrop variant config must be an object");if(ae(e,Qs,"variant config"),typeof e.id!="string"||!Ot.test(e.id)||e.id==="legacy")throw new TypeError("BugDrop variant id must match [a-z][a-z0-9_-]{0,63} and cannot be legacy");if(e.configVersion!==void 0&&e.configVersion!==1)throw new TypeError("BugDrop variant configVersion must be 1");if(ol(e.presentation),il(e.appearance),al(e.content),!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)throw new TypeError("BugDrop variant fields must contain 1-20 entries");let t=new Map;for(let n of e.fields)sl(n,t);return pl(e,t),ao(fn(e))}function ol(e){if(!re(e)||e.kind!=="modal"&&e.kind!=="inline")throw new TypeError("BugDrop variant presentation must be modal or inline");if(ae(e,e.kind==="modal"?new Set(["kind","size","columns"]):new Set(["kind","columns"]),"variant presentation"),e.columns!==void 0&&e.columns!==1&&e.columns!==2)throw new TypeError("BugDrop variant presentation columns must be 1 or 2");if(e.kind==="modal"&&e.size!==void 0&&!["compact","default","wide"].includes(e.size))throw new TypeError("BugDrop modal size must be compact, default, or wide")}function il(e){if(e!==void 0){if(!re(e))throw new TypeError("BugDrop variant appearance must be an object");if(ae(e,tl,"variant appearance"),e.theme!==void 0&&!["light","dark","auto"].includes(e.theme))throw new TypeError("BugDrop variant appearance theme is invalid");if(e.accentColor!==void 0&&(!j(e.accentColor,120)||bl(e.accentColor)))throw new TypeError("BugDrop variant appearance accentColor is invalid");if(e.density!==void 0&&e.density!=="compact"&&e.density!=="comfortable")throw new TypeError("BugDrop variant appearance density is invalid")}}function al(e){if(!re(e))throw new TypeError("BugDrop variant content must be an object");if(ae(e,el,"variant content"),!j(e.title,500))throw new TypeError("BugDrop variant content.title is required");Ze(e.description,"description",2e3),Ze(e.submitLabel,"submitLabel",120),Ze(e.cancelLabel,"cancelLabel",120),Ze(e.successTitle,"successTitle",500),Ze(e.successMessage,"successMessage",2e3)}function Ze(e,t,n){if(e!==void 0&&!j(e,n))throw new TypeError(`BugDrop variant content.${t} is invalid`)}function sl(e,t){if(!re(e)||!Js.has(e.type)||typeof e.id!="string"||!Ot.test(e.id))throw new TypeError("BugDrop variant field has an invalid type or id");if(ae(e,rl[e.type],`field ${e.id}`),t.has(e.id))throw new TypeError(`Duplicate BugDrop variant field id: ${e.id}`);if(t.set(e.id,e),!j(e.label,500))throw new TypeError(`Field ${e.id} requires a label`);if(e.helpText!==void 0&&!j(e.helpText,1e3))throw new TypeError(`Field ${e.id} has invalid helpText`);if(e.required!==void 0&&typeof e.required!="boolean")throw new TypeError(`Field ${e.id} required must be boolean`);ll(e),e.type==="shortText"||e.type==="longText"?cl(e):e.type==="rating"?dl(e):ul(e)}function ll(e){if(e.layout!==void 0){if(!re(e.layout))throw new TypeError(`Field ${e.id} layout must be an object`);if(ae(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2)throw new TypeError(`Field ${e.id} layout span must be 1 or 2`)}}function cl(e){if(e.placeholder!==void 0&&!j(e.placeholder,500))throw new TypeError(`Field ${e.id} has invalid placeholder`);let t=e.type==="shortText"?500:5e3;if(e.minLength!==void 0&&!Je(e.minLength,0,5e3)||e.maxLength!==void 0&&!Je(e.maxLength,1,5e3))throw new TypeError(`Field ${e.id} has invalid text bounds`);let n=e.minLength===void 0?0:e.minLength,r=e.maxLength===void 0?t:e.maxLength;if(!Je(n,0,5e3)||!Je(r,1,5e3)||n>r)throw new TypeError(`Field ${e.id} has invalid text bounds`);if(e.type==="longText"&&e.rows!==void 0&&!Je(e.rows,1,50))throw new TypeError(`Field ${e.id} rows must be an integer from 1-50`)}function dl(e){if(e.scale!==void 0&&e.scale!==5&&e.scale!==10)throw new TypeError(`Field ${e.id} rating scale must be 5 or 10`);if(e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number")throw new TypeError(`Field ${e.id} rating icon must be star or number`);if(e.lowLabel!==void 0&&!j(e.lowLabel,500))throw new TypeError(`Field ${e.id} has invalid lowLabel`);if(e.highLabel!==void 0&&!j(e.highLabel,500))throw new TypeError(`Field ${e.id} has invalid highLabel`)}function ul(e){if(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)throw new TypeError(`Field ${e.id} requires 2-50 choices`);if(e.display!==void 0&&e.display!=="radio"&&e.display!=="cards"&&e.display!=="buttons")throw new TypeError(`Field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options){if(!re(n))throw new TypeError(`Field ${e.id} has an invalid choice`);if(ae(n,new Set(["value","label","description"]),`field ${e.id} choice`),!j(n.value,120)||!j(n.label,500))throw new TypeError(`Field ${e.id} has an invalid choice`);if(n.description!==void 0&&!j(n.description,1e3))throw new TypeError(`Field ${e.id} has an invalid choice description`);if(t.has(n.value))throw new TypeError(`Field ${e.id} has duplicate choices`);t.add(n.value)}}function pl(e,t){if(!re(e.issue))throw new TypeError("BugDrop variant issue must be an object");if(ae(e.issue,nl,"variant issue"),!j(e.issue.title,2e3))throw new TypeError("BugDrop variant issue.title is required");if(e.issue.classification!==void 0&&!Zs.has(e.issue.classification))throw new TypeError("BugDrop variant issue.classification is invalid");for(let o of e.issue.title.matchAll(ro)){let i=o[1];if(i.startsWith("context.")){if(!Ot.test(i.slice(8)))throw oo()}else if(!t.has(i))throw new TypeError(`Unknown BugDrop variant title field: ${i}`)}if(e.issue.title.replace(ro,"").includes("{{"))throw oo();if(e.issue.sections!==void 0&&!Array.isArray(e.issue.sections))throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let n=e.issue.sections??[];if(n.length>20)throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let r=new Set;for(let o of n)ml(o,t,r)}function ml(e,t,n){if(!re(e)||!j(e.heading,120))throw new TypeError("BugDrop variant Issue section requires a heading");let r="field"in e,o="context"in e;if(r===o)throw new TypeError("BugDrop variant Issue section must reference one field or context key");if(ae(e,r?new Set(["heading","field","format","omitWhenEmpty"]):new Set(["heading","context","format","omitWhenEmpty"]),"variant Issue section"),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean")throw new TypeError("BugDrop variant Issue section omitWhenEmpty must be boolean");let i=e.heading.trim().toLowerCase();if(n.has(i))throw new TypeError(`Duplicate BugDrop Issue heading: ${e.heading}`);if(n.add(i),r){let a=t.get(e.field);if(!a)throw new TypeError(`Unknown Issue field: ${e.field}`);let s=e.format===void 0?"text":e.format;if(!["text","quote","stars","choice"].includes(s))throw new TypeError(`Invalid Issue field format: ${String(s)}`);if(s==="stars"&&a.type!=="rating")throw new TypeError("BugDrop stars format requires a rating field");if(s==="choice"&&a.type!=="singleChoice")throw new TypeError("BugDrop choice format requires a singleChoice field")}else{if(typeof e.context!="string"||!Ot.test(e.context))throw new TypeError(`Invalid Issue context key: ${e.context}`);if(e.format!==void 0&&e.format!=="text"&&e.format!=="code")throw new TypeError(`Invalid Issue context format: ${String(e.format)}`)}}function oo(){return new TypeError("BugDrop variant title contains an invalid placeholder")}function ae(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));if(r)throw new TypeError(`Unknown BugDrop ${n} property: ${r}`)}function j(e,t){return typeof e=="string"&&e.trim().length>0&&e.length<=t}function Je(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function bl(e){return Array.from(e).some(t=>{let n=t.charCodeAt(0);return n<32||n===127})}function re(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function fn(e){return Array.isArray(e)?e.map(t=>fn(t)):re(e)?Object.fromEntries(Object.entries(e).map(([t,n])=>[t,fn(n)])):e}function ao(e){if(e&&typeof e=="object"){Object.freeze(e);for(let t of Object.values(e))ao(t)}return e}function so(e,t,n={}){hl(n);let r=Ie(e.fields,t),o=e.issue.title.replace(/{{\s*([^{}]+?)\s*}}/g,(a,s)=>{let l=s.startsWith("context.")?n[s.slice(8)]:r[s];return lo(e.fields,s,l,"text")}).replace(/\s+/g," ").trim().slice(0,256).trim();if(!o)throw new TypeError("BugDrop variant produced an empty Issue title");let i=(e.issue.sections??[]).flatMap(a=>{let s=gl(a,e.fields,r,n);return!s.trim()&&a.omitWhenEmpty?[]:[{heading:a.heading.trim(),value:s.trim()?s:"Not provided.",format:fl(a)}]});return{title:o,...e.issue.classification?{classification:e.issue.classification}:{},sections:i}}function gl(e,t,n,r){return"context"in e?String(r[e.context]??""):lo(t,e.field,n[e.field],e.format??"text")}function lo(e,t,n,r){if(n==null||n==="")return"";let o=e.find(i=>i.id===t);if(r==="stars"&&o?.type==="rating"&&typeof n=="number"){let i=o.scale??5;return`${"\u2605".repeat(n)}${"\u2606".repeat(i-n)} (${n}/${i})`}return r==="choice"&&o?.type==="singleChoice"?o.options.find(i=>i.value===n)?.label??String(n):String(n)}function fl(e){return e.format==="quote"||e.format==="code"?e.format:"text"}function hl(e){if(!yl(e)||Object.keys(e).length>50)throw new TypeError("BugDrop variant context must contain at most 50 values");for(let[t,n]of Object.entries(e)){if(!/^[a-z][a-z0-9_-]{0,63}$/.test(t))throw new TypeError(`Invalid context key: ${t}`);if(!["string","number","boolean"].includes(typeof n)&&n!==null)throw new TypeError(`Invalid context value: ${t}`);if(typeof n=="number"&&!Number.isFinite(n))throw new TypeError(`Invalid context value: ${t}`);if(String(n??"").length>5e3)throw new TypeError(`Context value is too long: ${t}`)}}function yl(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}async function co(e,t,n,r={}){let o=r.submissionId??wl(),i=so(t,n,r.context),a=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await ge(e.authTokenProvider)},body:JSON.stringify({kind:"bugdrop.variant-submission",schemaVersion:1,repo:e.repo,variantId:t.id,submissionId:o,issue:i,metadata:vl()})}),s=await a.json();if(!a.ok||s.success!==!0)throw new Error(typeof s.error=="string"?s.error:"Failed to submit feedback");if(!Number.isInteger(s.issueNumber)||s.issueNumber<=0||typeof s.issueUrl!="string"||!kl(s.issueUrl,e.repo,s.issueNumber)||typeof s.isPublic!="boolean")throw new Error("BugDrop received an invalid Issue result");return{issueNumber:s.issueNumber,issueUrl:s.issueUrl,isPublic:s.isPublic,...Array.isArray(s.labelMappingWarnings)&&s.labelMappingWarnings.every(l=>typeof l=="string")?{labelMappingWarnings:s.labelMappingWarnings}:{}}}function wl(){if(typeof crypto?.randomUUID=="function")return crypto.randomUUID();if(typeof crypto?.getRandomValues!="function")throw new Error("BugDrop variants require a cryptographically secure random generator");let e=crypto.getRandomValues(new Uint8Array(16));return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function vl(){let e=new URL(window.location.href);return e.search="",e.hash="",{url:e.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),browser:xl(navigator.userAgent),os:El(navigator.userAgent),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function xl(e){for(let[t,n]of[["Edge",/Edg\/(\d+[\d.]*)/],["Chrome",/Chrome\/(\d+[\d.]*)/],["Safari",/Version\/(\d+[\d.]*).*Safari/],["Firefox",/Firefox\/(\d+[\d.]*)/]]){let r=e.match(n);if(r)return{name:t,version:r[1]??"unknown"}}return{name:"Unknown",version:"unknown"}}function El(e){let t=e.match(/(?:Mac OS X|Windows NT|Android) ([\d_.]+)/);return t?{name:e.includes("Mac OS X")?"macOS":e.includes("Windows NT")?"Windows":"Android",version:(t[1]??"unknown").replaceAll("_",".")}:{name:e.includes("Linux")?"Linux":"Unknown",version:"unknown"}}function kl(e,t,n){try{let r=new URL(e);return r.protocol==="https:"&&r.hostname==="github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function uo(e,t={isLegacyModalOpen:()=>!1}){let n=new Map;return{register(r){let o=io(r);if(n.has(o.id))throw new TypeError(`BugDrop variant is already registered: ${o.id}`);let i=Xr(o);n.set(o.id,i);let s=i.screens[0].config,l=(d,c={})=>co(e,s,d,c);return Object.freeze({id:i.variantId,open(d){if(s.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");return t.isLegacyModalOpen()?no(i.variantId):to({config:s,options:d,submit:l})},mount(d,c){return Qr({config:s,target:d,options:c,submit:l})},submit(d,c={}){return l(d,c)}})}}}function po(e){let t=new Map;for(let o of e.forms)for(let i of o.fields)t.set(`${o.id}.${i.id}`,i);let n=new Map,r=new Set;for(let o of e.screens)hn(o.when,r),n.set(o.id,o.type==="form"?e.forms.find(i=>i.id===o.form).fields.map(i=>`${o.form}.${i.id}`):[]);for(let o of e.issue.sections??[])"context"in o&&r.add(o.context);return Object.freeze({compiler:"bugdrop-flow@1",flowId:e.id,config:e,fields:t,contextKeys:r,screenAnswerPaths:n,screens:e.screens})}function hn(e,t){e&&("context"in e?t.add(e.context):"all"in e?e.all.forEach(n=>hn(n,t)):"any"in e&&e.any.forEach(n=>hn(n,t)))}var Sl=new Set(["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"]);function Bt(e){return Sl.has(e)}function _t(e,t){let n=t;return t!==void 0&&!se(t)&&S("open options must be an object"),he(t??{},new Set(["context","initialAnswers"]),"open options"),{context:Object.freeze(Tl(e,n?.context)),initialAnswers:Ll(e,n?.initialAnswers)}}function mo(e){Fl(e),e.type==="shortText"||e.type==="longText"?Pl(e):e.type==="rating"?Al(e):e.type==="singleChoice"?Rl(e):e.type==="checkbox"?Ml(e):Dl(e)}function bo(e,t){if(e.type==="rating"){let o=e.scale??5;(!Number.isInteger(t)||t<1||t>o)&&S(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="singleChoice"){(typeof t!="string"||!e.options.some(o=>o.value===t))&&S(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="checkbox"){typeof t!="boolean"&&S(`condition equals is not a valid value for field ${e.id}`);return}e.type==="attachments"&&S(`condition answer cannot reference attachments field ${e.id}`),(typeof t!="string"||t!==t.trim())&&S(`condition equals is not a valid value for field ${e.id}`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3);(t.length<n||t.length>r)&&S(`condition equals is not a valid value for field ${e.id}`)}function go(e){let{presentation:t,appearance:n,content:r}=e;se(t)||S("presentation must be an object"),he(t,new Set(["kind","size","columns"]),"presentation"),t.kind!=="modal"&&S("presentation kind must be modal"),t.size!==void 0&&!["compact","default","wide"].includes(t.size)&&S("modal size is invalid"),t.columns!==void 0&&t.columns!==1&&t.columns!==2&&S("presentation columns must be 1 or 2"),n!==void 0&&(se(n)||S("appearance must be an object"),he(n,new Set(["theme","accentColor","density"]),"appearance"),n.theme!==void 0&&!["light","dark","auto"].includes(n.theme)&&S("appearance theme is invalid"),pe(n.accentColor,"appearance accentColor",120),n.density!==void 0&&!["compact","comfortable"].includes(n.density)&&S("appearance density is invalid")),r!==void 0&&(se(r)||S("content must be an object"),he(r,new Set(["successTitle","successMessage","cancelLabel"]),"content"),pe(r.successTitle,"successTitle",500),pe(r.successMessage,"successMessage",2e3),pe(r.cancelLabel,"cancelLabel",120))}function Cl(e,t){if(e.type==="shortText"||e.type==="longText"){typeof t!="string"&&S(`initial answer ${e.id} must be text`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3),o=t.trim();return(o.length<n||o.length>r)&&S(`initial answer ${e.id} has invalid length`),o}if(e.type==="rating"){let n=e.scale??5;return(!Number.isInteger(t)||t<1||t>n)&&S(`initial answer ${e.id} must be a rating from 1-${n}`),t}return e.type==="singleChoice"?((typeof t!="string"||!e.options.some(n=>n.value===t))&&S(`initial answer ${e.id} must be a configured choice`),t):e.type==="checkbox"?(typeof t!="boolean"&&S(`initial answer ${e.id} must be boolean`),t):Il(e,t)}function Tl(e,t){t!==void 0&&!se(t)&&S("context must be an object");let n=t??{},r=Object.keys(n).find(i=>!e.contextKeys.has(i));r&&S(`context contains unknown key ${r}`);let o={};for(let[i,a]of Object.entries(n))(!Ol(a)||typeof a=="number"&&!Number.isFinite(a))&&S(`context ${i} must be a finite scalar`),o[i]=a;return o}function Ll(e,t){t!==void 0&&!se(t)&&S("initialAnswers must be an object");let n=t??{},r=Object.keys(n).find(o=>!e.fields.has(o));return r&&S(`initialAnswers contains unknown key ${r}`),Object.fromEntries(Object.entries(n).map(([o,i])=>[o,Cl(e.fields.get(o),i)]))}function Fl(e){e.layout!==void 0&&(se(e.layout)||S(`field ${e.id} layout must be an object`),he(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2&&S(`field ${e.id} layout span must be 1 or 2`))}function Pl(e){pe(e.placeholder,`field ${e.id} placeholder`,500);let t=e.minLength??0,n=e.maxLength??(e.type==="shortText"?500:5e3);(!$e(t,0,5e3)||!$e(n,1,5e3)||t>n)&&S(`field ${e.id} has invalid text bounds`),e.type==="longText"&&e.rows!==void 0&&!$e(e.rows,1,50)&&S(`field ${e.id} rows must be 1-50`)}function Al(e){e.scale!==void 0&&e.scale!==5&&e.scale!==10&&S(`field ${e.id} rating scale must be 5 or 10`),e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number"&&S(`field ${e.id} rating icon is invalid`),pe(e.lowLabel,`field ${e.id} lowLabel`,500),pe(e.highLabel,`field ${e.id} highLabel`,500)}function Rl(e){(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)&&S(`field ${e.id} requires 2-50 choices`),e.display!==void 0&&!["radio","cards","buttons"].includes(e.display)&&S(`field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options)se(n)||S(`field ${e.id} has an invalid choice`),he(n,new Set(["value","label","description"]),`field ${e.id} choice`),Nt(n.value,`field ${e.id} choice value`,120),Nt(n.label,`field ${e.id} choice label`,500),pe(n.description,`field ${e.id} choice description`,1e3),t.has(n.value)&&S(`field ${e.id} has duplicate choices`),t.add(n.value)}function Ml(e){e.initialValue!==void 0&&typeof e.initialValue!="boolean"&&S(`field ${e.id} initialValue must be boolean`)}function Dl(e){e.maxFiles!==void 0&&!$e(e.maxFiles,1,5)&&S(`field ${e.id} maxFiles must be 1-5`),e.maxFileSize!==void 0&&!$e(e.maxFileSize,1,5*1024*1024)&&S(`field ${e.id} maxFileSize is invalid`),e.accept!==void 0&&(!Array.isArray(e.accept)||e.accept.length===0||e.accept.length>20||e.accept.some(t=>typeof t!="string"||!t.trim()||t.length>120||!Bt(t)))&&S(`field ${e.id} accept is invalid`)}function Il(e,t){return(!Array.isArray(t)||t.length>(e.maxFiles??5))&&S(`initial answer ${e.id} has too many attachments`),t.map(n=>(se(n)||S(`initial answer ${e.id} has an invalid attachment`),he(n,new Set(["name","type","size","dataUrl"]),"attachment"),Nt(n.name,"attachment name",500),(typeof n.type!="string"||!Bt(n.type))&&S("attachment type is invalid"),$e(n.size,0,e.maxFileSize??5*1024*1024)||S("attachment size is invalid"),(typeof n.dataUrl!="string"||!new RegExp(`^data:${zl(n.type)};base64,[A-Za-z0-9+/]+={0,2}$`).test(n.dataUrl))&&S("attachment dataUrl is invalid"),{name:n.name,type:n.type,size:n.size,dataUrl:n.dataUrl}))}function zl(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Nt(e,t,n){(typeof e!="string"||!e.trim()||e.length>n||$l(e))&&S(`${t} is invalid`)}function pe(e,t,n){e!==void 0&&Nt(e,t,n)}function $l(e){return[...e].some(t=>{let n=t.charCodeAt(0);return n<32&&n!==9&&n!==10&&n!==13||n===127})}function $e(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function Ol(e){return e===null||["string","number","boolean"].includes(typeof e)}function se(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function he(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));r&&S(`${n} contains unknown key ${r}`)}function S(e){throw new TypeError(`BugDrop flow ${e}`)}function ho(e,t,n,r){let o=wo(e,n),i=document.createElement("input");return i.type="checkbox",i.id=o.controlId,i.checked=typeof r[`${t}.${e.id}`]=="boolean"?!!r[`${t}.${e.id}`]:!!e.initialValue,i.setAttribute("aria-required",String(e.required??!1)),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy),o.wrapper.classList.add("bdf-checkbox"),o.wrapper.insertBefore(i,o.label),{id:e.id,required:!!e.required,element:o.wrapper,read:async()=>({ok:!0,value:i.checked}),setRequiredError(a){o.setError(i,a?"This checkbox is required.":null)},focus:()=>i.focus(),dispose(){}}}function yo(e,t,n,r){let o=wo(e,n);o.wrapper.classList.add("bdf-attachment");let i=document.createElement("input");i.className="bdv-input",i.type="file",i.id=o.controlId,i.multiple=(e.maxFiles??5)>1,i.setAttribute("aria-required",String(e.required??!1)),e.accept&&(i.accept=e.accept.join(",")),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy);let a=document.createElement("ul");a.className="bdf-file-list",a.setAttribute("aria-live","polite"),o.wrapper.insertBefore(i,o.error),o.wrapper.insertBefore(a,o.error);let s=r[`${t}.${e.id}`],l=Array.isArray(s)?[...s]:[],d=!1,c=Promise.resolve();fo(a,l.map(m=>m.name));let u=()=>{d=!1,o.setError(i,null);let m=Array.from(i.files??[]);c=Nl(m,e).then(v=>{l=v,fo(a,v.map(f=>f.name))}).catch(v=>{d=!0,o.setError(i,v instanceof Error?v.message:"Could not read the selected attachment.")})};return i.addEventListener("change",u),{id:e.id,required:!!e.required,element:o.wrapper,async read(m){return await c,d&&m?{ok:!1}:{ok:!0,value:l}},setRequiredError(m){d||o.setError(i,m?"Select at least one attachment.":null)},focus:()=>i.focus(),dispose:()=>i.removeEventListener("change",u)}}function wo(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=document.createElement("label");if(o.className="bdv-label",o.htmlFor=r,o.textContent=e.label,e.required){let s=document.createElement("span");s.className="bdv-required",s.textContent=" *",s.setAttribute("aria-hidden","true"),o.appendChild(s)}n.appendChild(o);let i=[];if(e.helpText){let s=document.createElement("div");s.className="bdv-help",s.id=`${r}-help`,s.textContent=e.helpText,n.appendChild(s),i.push(s.id)}let a=document.createElement("div");return a.className="bdv-error",a.id=`${r}-error`,a.hidden=!0,a.setAttribute("aria-live","polite"),n.appendChild(a),i.push(a.id),{wrapper:n,label:o,error:a,controlId:r,describedBy:i.join(" ")||null,setError(s,l){a.textContent=l??"",a.hidden=!l,l?s.setAttribute("aria-invalid","true"):s.removeAttribute("aria-invalid")}}}async function Nl(e,t){if(e.length>(t.maxFiles??5))throw new TypeError(`Select at most ${t.maxFiles??5} attachments.`);return Promise.all(e.map(n=>Bl(n,t.maxFileSize??5*1024*1024)))}async function Bl(e,t){if(!Bt(e.type))throw new TypeError(`${e.name} has an unsupported file type.`);if(e.size>t)throw new TypeError(`${e.name} is too large.`);let n=await new Promise((r,o)=>{let i=new FileReader;i.addEventListener("load",()=>typeof i.result=="string"?r(i.result):o(new Error("Could not read the selected attachment."))),i.addEventListener("error",()=>o(new Error("Could not read the selected attachment."))),i.readAsDataURL(e)});return{name:e.name,type:e.type,size:e.size,dataUrl:n}}function fo(e,t){e.replaceChildren(...t.map(n=>{let r=document.createElement("li");return r.textContent=n,r}))}function vo(e,t,n){let r=Hl(e),o=document.createElement("div");o.className="bdv-fields",r.appendChild(o);let i=e.fields.map(s=>_l(s,e.id,t,n));for(let s of i)o.appendChild(s.element);let a=async s=>{let l=i.filter(ql);for(let c of l)c.setError(null);let d=Object.fromEntries(l.map(c=>[c.field.id,c.getValue()]));if(s)try{d=Ie(e.fields.filter(Ul),d)}catch(c){return Vl(c,l),null}for(let c of i.filter(Wl)){c.setRequiredError(!1);let u=await c.read(s);if(!u.ok)return c.focus(),null;if(s&&c.required&&(u.value===!1||Array.isArray(u.value)&&u.value.length===0))return c.setRequiredError(!0),c.focus(),null;d[c.id]=u.value}return d};return{element:r,collect:()=>a(!0),snapshot:()=>a(!1),dispose(){for(let s of i)s.dispose()}}}function _l(e,t,n,r){if(e.type==="checkbox")return ho(e,t,n,r);if(e.type==="attachments")return yo(e,t,n,r);let o=It(e,n);return o.setValue(r[`${t}.${e.id}`]??""),o}function Hl(e){let t=document.createElement("section");t.className="bdv-surface";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function Vl(e,t){let n=e instanceof ie?t.find(r=>r.field.id===e.fieldId):void 0;n?.setError(e instanceof Error?e.message.replace(/^Answer \S+ /,""):"Invalid answer"),n?.focus()}function Ul(e){return e.type!=="checkbox"&&e.type!=="attachments"}function ql(e){return"field"in e}function Wl(e){return"read"in e}function xo(e){let t=document.createElement("section");t.className="bdv-surface bdf-message";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function Eo(e,t,n,r,o){let i=document.activeElement instanceof HTMLElement?document.activeElement:null,a=document.body.style.getPropertyValue("overflow"),s=document.body.style.getPropertyPriority("overflow"),l=document.createElement("div");l.dataset.bugdropOwned="",l.dataset.bugdropFlow=e,l.dataset.bugdropInstance=t,Object.assign(l.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let d=l.attachShadow({mode:"open"}),c=n(d),u=document.createElement("div");u.className="bdv-overlay",c.root.appendChild(u);let m=()=>{},v=()=>{},f=!1;return{host:l,shadow:d,overlay:u,activate(x){document.body.style.setProperty("overflow","hidden"),document.body.appendChild(l),v=ce(l),d.addEventListener("keydown",r),u.addEventListener("pointerdown",o),m=Mt({close:x})},dispose(){f||(f=!0,m(),d.removeEventListener("keydown",r),u.removeEventListener("pointerdown",o),v(),c.dispose(),l.remove(),a?document.body.style.setProperty("overflow",a,s):document.body.style.removeProperty("overflow"),i?.isConnected&&i.focus())}}}function yn(e,t,n){let r=e.querySelector(".bdv-title"),o=`${t}-title`;return r&&(r.id=o),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby",o),e.tabIndex=-1,e.dataset.size=n,e}function ko(e,t,n,r,o){let i=t.screen,a=Oe("\xD7","bdv-close");a.setAttribute("aria-label","Close"),a.addEventListener("click",o,{once:!0}),e.prepend(a);let s=document.createElement("p");s.className="bdf-progress",s.textContent=`Step ${t.position} of ${t.total}`,e.querySelector(".bdv-header")?.prepend(s);let l=document.createElement("div");if(l.className="bdv-actions",t.canGoBack){let u=Oe(i.type==="message"?"Back":i.backLabel??"Back","bdv-cancel bdf-back");u.addEventListener("click",n),l.appendChild(u)}let d=i.continueLabel??(t.hasNext?"Continue":"Submit"),c=Oe(d,"bdv-submit");c.addEventListener("click",r),l.appendChild(c),e.appendChild(l)}function So(e){let t=Ne(e.title??"Add a screenshot",e.description??(e.mode==="required"?"A screenshot is required before submitting.":"Include a screenshot to help explain your feedback."));if(e.mode==="optional"){let n=document.createElement("label");n.className="bdf-checkbox";let r=document.createElement("input");r.type="checkbox",r.checked=!0,r.dataset.screenshot="",n.append(r,document.createTextNode("Include a screenshot")),t.appendChild(n)}return t}function Ne(e,t){let n=document.createElement("section");n.className="bdv-surface";let r=document.createElement("div");r.className="bdv-header";let o=document.createElement("h2");o.className="bdv-title",o.textContent=e;let i=document.createElement("p");return i.className="bdv-description",i.textContent=t,r.append(o,i),n.appendChild(r),n}function Co(e,t,n,r){let o=Ne("Submission failed",e),i=document.createElement("div");i.className="bdv-actions";let a=Oe("Try again","bdv-submit");a.addEventListener("click",n);let s=Oe(t,"bdv-cancel");return s.addEventListener("click",r),i.append(a,s),o.appendChild(i),o}function To(e,t,n){let r=Ne(e.config.content?.successTitle??"Thanks for your feedback!",e.config.content?.successMessage??"Your response was submitted.");if(t.isPublic){let i=document.createElement("a");i.className="bdv-success-link",i.href=t.issueUrl,i.target="_blank",i.rel="noopener noreferrer",i.textContent="View GitHub Issue",r.appendChild(i)}let o=Oe("Done","bdv-submit");return o.addEventListener("click",n),r.appendChild(o),r}function Lo(e){return e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href]")}function Fo(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}function Po(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&t.getAttribute("aria-hidden")!=="true")}function Oe(e,t){let n=document.createElement("button");return n.type="button",n.className=t,n.textContent=e,n}function Qe(e,t,n){return e?"answer"in e?Ao(t,e.answer,e.equals):"context"in e?Ao(n,e.context,e.equals):"all"in e?e.all.every(r=>Qe(r,t,n)):e.any.some(r=>Qe(r,t,n)):!0}function Ao(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)&&e[t]===n}function wn(e,t=1){if(t>4)throw new TypeError("BugDrop flow condition depth cannot exceed 4");if("answer"in e||"context"in e)return 1;let n="all"in e?e.all:e.any,r=1;for(let o of n)r+=wn(o,t+1);if(r>32)throw new TypeError("BugDrop flow conditions cannot exceed 32 nodes");return r}var Ht=class{constructor(t,n,r={}){this.definition=t;this.context=n;this.answers={...r},this.reconcileInitiallyHidden(),this.currentId=this.visibleScreens()[0]?.id??""}definition;context;answers;capture=null;currentId;current(){return this.route().screen}route(){let t=this.visibleScreens(),n=t.findIndex(o=>o.id===this.currentId),r=n>=0?n:0;return Object.freeze({screen:t[r],position:t.length===0?0:r+1,total:t.length,canGoBack:r>0,hasNext:r>=0&&r<t.length-1})}setFormAnswers(t,n){let r=new Set(this.visibleScreens().map(i=>i.id)),o=this.definition.screenAnswerPaths.get(this.definition.screens.find(i=>i.type==="form"&&i.form===t).id);for(let i of o){let a=i.slice(t.length+1);this.answers[i]=n[a]}this.reconcileNewlyHidden(r)}next(){let t=this.route(),n=this.visibleScreens();return t.hasNext?(this.currentId=n[t.position].id,!0):!1}back(){let t=this.route(),n=this.visibleScreens();return t.canGoBack?(this.currentId=n[t.position-2].id,!0):!1}hasNext(){return this.route().hasNext}visibleScreens(){return this.definition.screens.filter(t=>Qe(t.when,this.answers,this.context))}reconcileInitiallyHidden(){for(let t of this.definition.screens)Qe(t.when,this.answers,this.context)||this.clearScreenState(t)}reconcileNewlyHidden(t){let n=new Set(this.visibleScreens().map(o=>o.id)),r=!0;for(;r;){r=!1;for(let o of this.definition.screens)!t.has(o.id)||n.has(o.id)||(r=this.clearScreenState(o)||r);r&&(n=new Set(this.visibleScreens().map(o=>o.id)))}n.has(this.currentId)||(this.currentId=this.nearestVisibleId(n))}clearScreenState(t){let n=!1;for(let r of this.definition.screenAnswerPaths.get(t.id)??[])Object.prototype.hasOwnProperty.call(this.answers,r)&&(n=!0),delete this.answers[r];return t.type==="screenshot"&&this.capture!==null&&(this.capture=null,n=!0),n}nearestVisibleId(t){let n=this.definition.screens.findIndex(r=>r.id===this.currentId);for(let r=n;r>=0;r-=1){let o=this.definition.screens[r];if(o&&t.has(o.id))return o.id}return this.visibleScreens()[0]?.id??""}};function Ro(e,t){let n={id:t.id,presentation:t.presentation,appearance:t.appearance,content:{title:t.id},fields:[{id:"placeholder",type:"shortText",label:"Placeholder"}],issue:{title:t.id}},r=ze(e,n,"modal"),o=document.createElement("style");return o.textContent=`
    .bdf-progress { margin: 0 0 12px; color: var(--bdv-text-muted); font-size: .8rem; }
    .bdf-message { min-height: 180px; display: grid; align-content: center; }
    .bdf-attachment { display: grid; gap: 7px; }
    .bdf-checkbox { display: flex; min-height: 44px; align-items: center; gap: 10px; }
    .bdf-checkbox input { width: 20px; height: 20px; accent-color: var(--bdv-accent); }
    .bdf-file-list { margin: 0; padding-left: 20px; color: var(--bdv-text-muted); }
    .bdf-back { order: -1; }
  `,e.prepend(o),{root:r.root,dispose(){o.remove(),r.dispose()}}}function Mo(e,t,n){let r=_t(e,t);return De(),new vn(e,r,n).open()}var vn=class{constructor(t,n,r){this.definition=t;this.ports=r;this.instanceId=ne(t.flowId),this.previousFocus=Fo(),this.runtime=new Ht(t,n.context,n.initialAnswers),this.result=new Promise(o=>{this.resolveOutcome=o}),this.state=Eo(t.flowId,this.instanceId,o=>Ro(o,t.config),o=>this.onKeydown(o),o=>this.onBackdrop(o))}definition;ports;instanceId;previousFocus;runtime;result;resolveOutcome;state;currentForm=null;settled=!1;closed=!1;busy=!1;routePreviewVersion=0;preflightVersion=0;captureAbortController=null;open(){let t=Object.freeze({instanceId:this.instanceId,result:this.result,close:()=>this.close()});this.state.activate(t.close);let n=Ne("Preparing feedback","Checking installation\u2026");return n.setAttribute("aria-busy","true"),this.show(n),this.preflight(),t}async preflight(){let t=++this.preflightVersion;try{let n=await this.ports.preflight();if(this.closed||t!==this.preflightVersion)return;if(n.status==="installed")this.render();else{let r=n.status==="not_installed"?`Install the ${n.appName??"BugDrop"} GitHub App to continue.`:"BugDrop could not reach the feedback service.";this.renderError(r,()=>{this.preflight()})}}catch{!this.closed&&t===this.preflightVersion&&this.renderError("BugDrop could not reach the feedback service.",()=>{this.preflight()})}}render(){this.disposeForm();let t=this.runtime.route(),n=t.screen;if(!n){this.finish();return}let r;if(n.type==="message")r=xo(n);else if(n.type==="form"){let o=this.definition.config.forms.find(i=>i.id===n.form);this.currentForm=vo(o,this.instanceId,this.runtime.answers),r=this.currentForm.element}else r=So(n);if(yn(r,this.instanceId,this.definition.config.presentation.size??"default"),ko(r,t,()=>{this.back(n)},()=>{this.advance(n,r)},()=>this.close()),n.type==="form"){let o=()=>{this.previewFormRoute(n.form,r)};r.addEventListener("input",o),r.addEventListener("change",o)}this.show(r)}async previewFormRoute(t,n){let r=++this.routePreviewVersion,o=await this.currentForm?.snapshot();if(!o||r!==this.routePreviewVersion||!n.isConnected||this.closed)return;this.runtime.setFormAnswers(t,o);let i=this.runtime.route(),a=i.screen;if(!a)return;let s=n.querySelector(".bdf-progress");s&&(s.textContent=`Step ${i.position} of ${i.total}`);let l=n.querySelector(".bdv-submit");l&&(l.textContent=a.continueLabel??(i.hasNext?"Continue":"Submit"))}async back(t){if(!this.busy){if(t.type==="form"){let n=await this.currentForm?.snapshot();if(n===null||this.closed)return;n&&this.runtime.setFormAnswers(t.form,n)}this.runtime.back(),this.render()}}async advance(t,n){if(!this.busy){if(t.type==="form"){let r=await this.currentForm?.collect();if(!r||this.closed)return;this.runtime.setFormAnswers(t.form,r)}if(t.type==="screenshot"){await this.capture(t,n);return}this.runtime.next()?this.render():await this.finish()}}async capture(t,n){let r=t.mode!=="optional"||!!n.querySelector("[data-screenshot]")?.checked;this.busy=!0,this.state.host.hidden=!0;let o=new AbortController;this.captureAbortController=o;try{let i=await this.ports.capture(t,r,o.signal);if(this.closed)return;if(i.returnToForm)this.runtime.back();else if(this.runtime.capture=i,!this.runtime.next()){this.busy=!1,await this.finish();return}}finally{this.captureAbortController===o&&(this.captureAbortController=null),this.busy=!1,this.state.host.hidden=!1}this.closed||this.render()}async finish(){if(this.busy||this.closed)return;this.busy=!0;let t=Ne("Submitting feedback","Submitting\u2026");t.setAttribute("aria-busy","true"),this.show(t);try{let n=await this.ports.submit(this.runtime);if(this.closed)return;this.settle({status:"submitted",result:n}),this.busy=!1,this.show(To(this.definition,n,()=>this.close(!1)))}catch(n){if(this.closed)return;this.busy=!1,this.renderError(n instanceof Error?n.message:"Failed to submit feedback",()=>{this.finish()})}}renderError(t,n){this.show(Co(t,this.definition.config.content?.cancelLabel??"Cancel",n,()=>this.close()))}show(t){yn(t,this.instanceId,this.definition.config.presentation.size??"default"),this.state.overlay.replaceChildren(t),queueMicrotask(()=>(Lo(t)??t).focus())}close(t=!0){this.closed||(this.closed=!0,this.preflightVersion+=1,this.captureAbortController?.abort(),this.captureAbortController=null,t&&this.settle({status:"closed"}),this.disposeForm(),this.state.dispose(),this.previousFocus?.isConnected&&this.previousFocus.focus())}settle(t){this.settled||(this.settled=!0,this.resolveOutcome(t))}disposeForm(){this.routePreviewVersion+=1,this.currentForm?.dispose(),this.currentForm=null}onKeydown(t){if(!(t instanceof KeyboardEvent))return;if(t.key==="Escape"){t.preventDefault(),this.close();return}if(t.key!=="Tab")return;let n=Po(this.state.overlay);if(!n.length){t.preventDefault(),this.state.overlay.querySelector('[role="dialog"]')?.focus();return}let r=n[0],o=n.at(-1),i=this.state.shadow.activeElement;t.shiftKey&&(i===r||!this.state.overlay.contains(i))?(t.preventDefault(),o.focus()):!t.shiftKey&&i===o&&(t.preventDefault(),r.focus())}onBackdrop(t){t.target===this.state.overlay&&this.close()}};function Do(e){return Object.freeze({instanceId:ne(e),result:Promise.resolve({status:"busy"}),close(){}})}function zo(e,t,n){let r=jl(e.issue.title,t).trim().slice(0,256);if(!r)throw new TypeError("BugDrop flow Issue title cannot be empty");let o=(e.issue.sections??[]).map(i=>Gl(e,i,t,n)).filter(i=>i!==null);return{title:r,description:o.join(`

`),category:e.issue.classification??"bug"}}function jl(e,t){return e.replace(/{{\s*([^{}]+?)\s*}}/g,(n,r)=>$o(t[r.trim()]))}function Gl(e,t,n,r){let o="answer"in t?n[t.answer]:r[t.context];if(t.omitWhenEmpty&&(o==null||o===""))return null;let i=Xl(e,t,o);return`## ${t.heading}

${i}`}function Xl(e,t,n){let r=t.format,o=$o(n);if(r==="quote")return o.split(`
`).map(i=>`> ${i}`).join(`
`);if(r==="code")return`\`${o.replaceAll("`","\\`")}\``;if(r==="stars"&&typeof n=="number"&&"answer"in t){let i=Io(e,t.answer),a=i?.type==="rating"?i.scale??5:5;return`${"\u2605".repeat(n)}${"\u2606".repeat(Math.max(0,a-n))} (${n}/${a})`}if(r==="choice"&&typeof n=="string"&&"answer"in t){let i=Io(e,t.answer);if(i?.type==="singleChoice")return i.options.find(a=>a.value===n)?.label??o}return o}function Io(e,t){let n=t.indexOf("."),r=t.slice(0,n),o=t.slice(n+1);return e.forms.find(i=>i.id===r)?.fields.find(i=>i.id===o)}function $o(e){return e==null?"":typeof e=="string"?e.trim():String(e)}async function No(e,t,n,r,o){let i=zo(t,n,r),a=t.evidence?.attachments,s=t.evidence?.sendConsoleLogs,l=t.evidence?.submitter?.name,d=t.evidence?.submitter?.email,c=l||d?{name:Oo(n[l??""]),email:Oo(n[d??""])}:void 0,u=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await ge(e.authTokenProvider)},body:JSON.stringify({repo:e.repo,title:i.title,description:i.description,category:i.category,categoryLabels:e.categoryLabels,screenshot:o?.screenshot??null,attachments:a?n[a]??[]:[],consoleLogs:s&&n[s]===!0?Ft():void 0,submitter:c&&(c.name||c.email)?c:void 0,metadata:Yl(o)})});if(u.status===429)throw new Error("Too many submissions. Please try again later.");let m=await u.json();if(!u.ok||m.success!==!0)throw new Error(typeof m.error=="string"?m.error:"Failed to submit feedback");if(!Number.isInteger(m.issueNumber)||m.issueNumber<=0||typeof m.issueUrl!="string"||typeof m.isPublic!="boolean"||!Kl(m.issueUrl,e.repo,m.issueNumber))throw new Error("BugDrop received an invalid Issue result");return{issueNumber:m.issueNumber,issueUrl:m.issueUrl,isPublic:m.isPublic,...Array.isArray(m.labelMappingWarnings)&&m.labelMappingWarnings.every(v=>typeof v=="string")?{labelMappingWarnings:m.labelMappingWarnings}:{}}}function Kl(e,t,n){try{let r=new URL(e);return r.origin==="https://github.com"&&r.pathname===`/${t}/issues/${n}`&&!r.search&&!r.hash}catch{return!1}}function Yl(e){let t=new URL(window.location.href);return t.search="",t.hash="",{url:t.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:e?.elementSelector??null,fullElementSelector:e?.fullElementSelector??null,domNodeCount:Pe(),fullPageDisabled:ee(),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function Oo(e){return typeof e=="string"&&e.trim()?e.trim():void 0}var Zl=/^[a-z][a-z0-9_-]{0,63}$/;function G(e,t,n){for(let r of Object.keys(e))t.has(r)||C(`${n} contains unknown key ${r}`)}function ye(e,t){(typeof e!="string"||!Zl.test(e)||e==="legacy")&&C(`${t} is invalid`)}function we(e,t,n){(typeof e!="string"||e.trim().length===0||e.length>n||[...e].some(r=>{let o=r.charCodeAt(0);return o<32&&o!==9&&o!==10&&o!==13}))&&C(`${t} is invalid`)}function me(e,t,n){e!==void 0&&we(e,t,n)}function xn(e,t){(e!==null&&!["string","number","boolean"].includes(typeof e)||typeof e=="number"&&!Number.isFinite(e))&&C(`${t} must be scalar`)}function oe(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function C(e){throw new TypeError(`BugDrop flow ${e}`)}function En(e){if(!e||typeof e!="object"||Object.isFrozen(e))return e;Object.freeze(e);for(let t of Object.values(e))En(t);return e}var Jl=/^([a-z][a-z0-9_-]{0,63})\.([a-z][a-z0-9_-]{0,63})$/,Ql=new Set(["configVersion","id","presentation","appearance","content","forms","screens","issue","evidence"]),Be=["id","type","label","helpText","required","layout"],Bo={shortText:new Set([...Be,"placeholder","minLength","maxLength"]),longText:new Set([...Be,"placeholder","rows","minLength","maxLength"]),rating:new Set([...Be,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([...Be,"options","display"]),checkbox:new Set([...Be,"initialValue"]),attachments:new Set([...Be,"maxFiles","maxFileSize","accept"])};function Ho(e){oe(e)||C("config must be an object"),G(e,Ql,"config"),e.configVersion!==1&&C("configVersion must be 1"),ye(e.id,"id"),go(e),(!Array.isArray(e.forms)||e.forms.length===0||e.forms.length>12)&&C("forms must contain 1-12 entries"),(!Array.isArray(e.screens)||e.screens.length===0||e.screens.length>20)&&C("screens must contain 1-20 entries");let t=new Map,n=new Map;for(let s of e.forms)ec(s,n,t);let r=new Set,o=new Map,i=0,a=new Set;for(let s of e.screens){if(tc(s,a,n,o),s.type==="form"){r.has(s.form)&&C(`form ${s.form} may be referenced only once`),r.add(s.form);for(let l of n.get(s.form).fields)o.set(`${s.form}.${l.id}`,l)}s.type==="screenshot"&&++i>1&&C("only one screenshot screen is supported")}for(let s of n.keys())r.has(s)||C(`form ${s} is unused`);return e.screens.every(s=>s.when!==void 0)&&C("at least one screen must be unconditional"),nc(e.issue,t),oc(e.evidence,t),En(structuredClone(e))}function ec(e,t,n){oe(e)||C("form must be an object"),G(e,new Set(["id","title","description","fields"]),"form"),ye(e.id,"form id"),t.has(e.id)&&C(`duplicate form id ${e.id}`),we(e.title,"form title",500),me(e.description,"form description",2e3),(!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)&&C("form fields must contain 1-20 entries");let r=new Set;for(let o of e.fields)(!oe(o)||typeof o.type!="string"||!(o.type in Bo))&&C("field type is unsupported"),G(o,Bo[o.type],"field"),ye(o.id,"field id"),r.has(o.id)&&C(`duplicate field id ${o.id}`),r.add(o.id),we(o.label,"field label",500),me(o.helpText,"field helpText",1e3),o.required!==void 0&&typeof o.required!="boolean"&&C("field required must be boolean"),mo(o),n.set(`${e.id}.${o.id}`,o);t.set(e.id,e)}function tc(e,t,n,r){oe(e)||C("screen must be an object"),ye(e.id,"screen id"),t.has(e.id)&&C(`duplicate screen id ${e.id}`),t.add(e.id),["message","form","screenshot"].includes(e.type)||C("screen type is unsupported");let o=e.type==="message"?new Set(["id","type","when","title","description","continueLabel"]):e.type==="form"?new Set(["id","type","when","form","continueLabel","backLabel"]):new Set(["id","type","when","title","description","mode","continueLabel","backLabel"]);G(e,o,"screen"),Object.prototype.hasOwnProperty.call(e,"when")&&Vo(e.when,r),e.type==="message"&&(we(e.title,"message title",500),me(e.description,"message description",2e3)),e.type==="form"&&!n.has(e.form)&&C(`screen references unknown form ${e.form}`),e.type==="screenshot"&&!["optional","auto","required"].includes(e.mode)&&C("screenshot mode is invalid"),e.type==="screenshot"&&(me(e.title,"screenshot title",500),me(e.description,"screenshot description",2e3)),me(e.continueLabel,"screen continueLabel",120),e.type!=="message"&&me(e.backLabel,"screen backLabel",120)}function Vo(e,t){if(oe(e)||C("condition must be an object"),wn(e),"answer"in e){G(e,new Set(["answer","equals"]),"answer condition");let o=t.get(e.answer);o||C(`condition answer must reference an earlier field: ${e.answer}`),xn(e.equals,"condition equals"),bo(o,e.equals);return}if("context"in e){G(e,new Set(["context","equals"]),"context condition"),ye(e.context,"condition context"),xn(e.equals,"condition equals");return}let n="all"in e?"all":"any"in e?"any":null;n||C("condition must contain answer, context, all, or any"),G(e,new Set([n]),"condition group");let r=n==="all"?e.all:e.any;(!Array.isArray(r)||r.length<1||r.length>8)&&C(`condition ${n} must contain 1-8 entries`);for(let o of r)Vo(o,t)}function nc(e,t){if(oe(e)||C("issue must be an object"),G(e,new Set(["classification","title","sections"]),"issue"),we(e.title,"issue title",2e3),e.classification!==void 0&&!["bug","feature","question"].includes(e.classification)&&C("issue classification is invalid"),ic(e.title,t),e.sections!==void 0){(!Array.isArray(e.sections)||e.sections.length>20)&&C("issue sections are invalid");let n=new Set;for(let r of e.sections)rc(r,t,n)}}function rc(e,t,n){oe(e)||C("issue section must be an object"),"answer"in e?(G(e,new Set(["heading","answer","format","omitWhenEmpty"]),"issue section"),Vt(e.answer,t,"issue section")):(G(e,new Set(["heading","context","format","omitWhenEmpty"]),"issue section"),ye(e.context,"issue context")),we(e.heading,"issue section heading",120);let r=e.heading.trim().toLowerCase();n.has(r)&&C(`duplicate issue section heading ${e.heading}`),n.add(r),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean"&&C("issue section omitWhenEmpty must be boolean");let o=e.format??"text";if("answer"in e){["text","quote","stars","choice","code"].includes(o)||C("issue answer format is invalid");let i=t.get(e.answer);o==="stars"&&i.type!=="rating"&&C("stars format requires a rating field"),o==="choice"&&i.type!=="singleChoice"&&C("choice format requires a singleChoice field")}else["text","code"].includes(o)||C("issue context format is invalid")}function oc(e,t){e!==void 0&&(oe(e)||C("evidence must be an object"),G(e,new Set(["attachments","sendConsoleLogs","submitter"]),"evidence"),_o(e.attachments,"attachments",t,"attachments"),_o(e.sendConsoleLogs,"checkbox",t,"sendConsoleLogs"),e.submitter!==void 0&&(oe(e.submitter)||C("evidence submitter must be an object"),G(e.submitter,new Set(["name","email"]),"evidence submitter"),!e.submitter.name&&!e.submitter.email&&C("evidence submitter must map name or email"),e.submitter.name&&Vt(e.submitter.name,t,"submitter name"),e.submitter.email&&Vt(e.submitter.email,t,"submitter email")))}function _o(e,t,n,r){e!==void 0&&n.get(e)?.type!==t&&C(`${r} must reference a ${t} field`)}function Vt(e,t,n){(!Jl.test(e)||!t.has(e)||t.get(e)?.type==="attachments")&&C(`${n} references an unknown scalar answer: ${e}`)}function ic(e,t){let n=0;for(let o of e.matchAll(/{{\s*([^{}]+?)\s*}}/g)){let i=o.index,a=e.slice(n,i);(a.includes("{{")||a.includes("}}")||a.endsWith("{"))&&C("issue title template is malformed"),Vt(o[1].trim(),t,"issue title"),n=i+o[0].length,e[n]==="}"&&C("issue title template is malformed")}let r=e.slice(n);(r.includes("{{")||r.includes("}}"))&&C("issue title template is malformed")}function Uo(e,t,n={isLegacyModalOpen:()=>!1}){let r=new Map;return{register(o){let i=Ho(o);if(r.has(i.id))throw new TypeError(`BugDrop flow is already registered: ${i.id}`);let a=po(i);return r.set(i.id,a),Object.freeze({id:i.id,open(s){return n.isLegacyModalOpen()?(_t(a,s),Do(i.id)):Mo(a,s,{...t,submit:l=>No(e,i,l.answers,l.context,l.capture)})}})}}}var it="bugdrop_dismissed",ac="bugdrop_trigger_position_",Jo="bugdrop_welcomed_",sc="bugdrop_complex_screenshot_skipped_",lc=10080*60*1e3,nt=8,qo=16,Wo=5,jo=5*1024*1024,Qo=["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"];function cc(e){let t=[{name:"Edge",pattern:/Edg(?:e|A|iOS)?\/(\d+[\d.]*)/},{name:"Opera",pattern:/(?:OPR|Opera)\/(\d+[\d.]*)/},{name:"Chrome",pattern:/Chrome\/(\d+[\d.]*)/},{name:"Safari",pattern:/Version\/(\d+[\d.]*).*Safari/},{name:"Firefox",pattern:/Firefox\/(\d+[\d.]*)/}];for(let{name:n,pattern:r}of t){let o=e.match(r);if(o)return{name:n,version:o[1]||"unknown"}}return{name:"Unknown",version:"unknown"}}function dc(e){let t=[{name:"iOS",pattern:/iPhone OS (\d+[_\d]*)/,versionIndex:1},{name:"iOS",pattern:/iPad.*OS (\d+[_\d]*)/,versionIndex:1},{name:"macOS",pattern:/Mac OS X (\d+[_.\d]*)/,versionIndex:1},{name:"Windows",pattern:/Windows NT (\d+\.\d+)/,versionIndex:1},{name:"Android",pattern:/Android (\d+[\d.]*)/,versionIndex:1},{name:"Linux",pattern:/Linux/,versionIndex:void 0},{name:"Chrome OS",pattern:/CrOS/,versionIndex:void 0}];for(let{name:n,pattern:r,versionIndex:o}of t){let i=e.match(r);if(i){let a=o!==void 0&&i[o]?i[o].replace(/_/g,"."):"";return{name:n,version:a}}}return{name:"Unknown",version:""}}function ei(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return e.split("?")[0].split("#")[0]}}function uc(){let e=navigator.userAgent;return{browser:cc(e),os:dc(e),devicePixelRatio:window.devicePixelRatio||1,language:navigator.language||"unknown",url:ei(window.location.href)}}var pc=null,X=null,rt=null,K=!1,mc=null,_e=!1;function Go(e){try{let t=localStorage.getItem(it);if(!t)return!1;if(t==="true")return!0;let n=parseInt(t,10);if(isNaN(n))return!1;if(e===void 0)return!0;let r=e*24*60*60*1e3;return Date.now()-n<r}catch{return!1}}function ti(){try{localStorage.setItem(it,Date.now().toString())}catch{}}function bc(e){try{return localStorage.getItem(Jo+e)!==null}catch{return!1}}function gc(e){try{localStorage.setItem(Jo+e,Date.now().toString())}catch{}}function Fn(e){return`${sc}${e}:${ei(window.location.href)}`}function fc(e){try{let t=Fn(e),n=localStorage.getItem(t);if(!n)return!1;let r=parseInt(n,10);return isNaN(r)||Date.now()-r>lc?(localStorage.removeItem(t),!1):!0}catch{return!1}}function hc(e){try{localStorage.setItem(Fn(e),Date.now().toString())}catch{}}function yc(e){try{localStorage.removeItem(Fn(e))}catch{}}function wc(e,t){ee()&&(hc(e.repo),t.includeScreenshot=!1)}function vc(e){if(!e)return;let t;try{t=JSON.parse(e)}catch(o){let i=o instanceof Error?`: ${o.message}`:"";console.warn(`[BugDrop] Invalid data-category-labels JSON${i}. Using default GitHub labels.`);return}if(!t||typeof t!="object"||Array.isArray(t)){console.warn("[BugDrop] Invalid data-category-labels: expected a JSON object. Using default GitHub labels.");return}let n=["bug","feature","question"],r={};for(let[o,i]of Object.entries(t)){if(!n.includes(o)){console.warn(`[BugDrop] Invalid data-category-labels: unknown category "${o}" (expected ${n.join(", ")}). Ignoring.`);continue}typeof i=="string"||Array.isArray(i)&&i.every(a=>typeof a=="string")?r[o]=i:console.warn(`[BugDrop] Invalid data-category-labels: value for "${o}" must be a string or string array. Ignoring.`)}return Object.keys(r).length>0?r:void 0}var M=document.currentScript||document.querySelector('script[src*="bugdrop"][src*="widget"]');document.currentScript||console.warn("[BugDrop] document.currentScript is null \u2014 do not use async or defer on the BugDrop script tag.");var ot=M?.dataset.theme;ot&&!vt(ot)&&console.warn(`[BugDrop] Invalid data-theme "${ot}". Expected "light", "dark", or "auto".`);var xc=nr(M?.dataset.locale||document.documentElement.lang),Xo=M?.dataset.requireName==="true",Ko=M?.dataset.requireEmail==="true",et=M?.dataset.position;et&&et!=="bottom-right"&&et!=="bottom-left"&&console.warn(`[BugDrop] Invalid data-position "${et}". Expected "bottom-right" or "bottom-left".`);var ni=M?.dataset.dismissDuration,ri=er(ni);ni&&ri===void 0&&console.warn("[BugDrop] Invalid data-dismiss-duration. Expected a positive whole number of days.");var oi=M?.dataset.screenshotScale,ii=Jt(oi);oi&&ii===void 0&&console.warn("[BugDrop] Invalid data-screenshot-scale. Expected a non-negative number.");var ai=M?.dataset.elementContextMaxArea,si=Jt(ai);ai&&si===void 0&&console.warn("[BugDrop] Invalid data-element-context-max-area. Expected a non-negative number.");var li=M?.dataset.shadow,ci=dt(li);li&&!ci&&console.warn('[BugDrop] Invalid data-shadow. Expected "soft", "hard", or "none".');var ve=M?.dataset.showIssueLink,di=ve==="always"||ve==="never"?ve:"public";ve&&ve!=="public"&&ve!==di&&console.warn(`[BugDrop] Invalid data-show-issue-link "${ve}". Expected "public", "always", or "never".`);var tt={repo:M?.dataset.repo||"",apiUrl:M?.src.replace(/\/widget(?:\.v[\d.]+)?\.js$/,"/api")||"",authTokenProvider:Vr(M?.dataset.authTokenProvider),position:et==="bottom-left"?"bottom-left":"bottom-right",theme:vt(ot)?ot:"auto",showName:M?.dataset.showName==="true"||Xo,requireName:Xo,showEmail:M?.dataset.showEmail==="true"||Ko,requireEmail:Ko,buttonDismissible:M?.dataset.buttonDismissible==="true",dismissDuration:ri,showRestore:M?.dataset.showRestore!=="false",showButton:M?.dataset.button!=="false",accentColor:B(M?.dataset.color),iconUrl:Ue(M?.dataset.icon),label:M?.dataset.label||void 0,categoryLabels:vc(M?.dataset.categoryLabels),font:Te(M?.dataset.font),radius:J(M?.dataset.radius)?.toString(),bgColor:B(M?.dataset.bg),textColor:B(M?.dataset.text),borderWidth:J(M?.dataset.borderWidth)?.toString(),borderColor:B(M?.dataset.borderColor),shadow:ci,welcome:(()=>{let e=M?.dataset.welcome;return e==="false"||e==="never"?"never":e==="always"?"always":"once"})(),screenshotMode:(()=>{let e=M?.dataset.screenshot;return e==="auto"||e==="required"?e:(e&&e!=="optional"&&console.warn(`[BugDrop] Invalid data-screenshot "${e}". Expected "optional", "auto", or "required".`),"optional")})(),screenshotScale:ii,elementContextMaxArea:si,issueLinkVisibility:di,sendConsoleLogs:M?.dataset.sendConsoleLogs==="true",locale:xc};or(tt.locale);Wr();tt.repo?/^[^/]+\/[^/]+$/.test(tt.repo)?Sc(tt):console.error(`[BugDrop] Invalid data-repo format "${tt.repo}". Expected "owner/repo" (e.g., "octocat/hello-world").`):console.error("[BugDrop] Missing data-repo attribute");function Ec(e){return e.label!==void 0?e.label:p().triggerLabel}function ui(e,t){if(t.position==="bottom-left"&&e.appendChild(Yo()),t.iconUrl!=="none"){let r=document.createElement("span");if(r.className="bd-trigger-icon",t.iconUrl){let o=document.createElement("img");o.src=t.iconUrl,o.alt="";let i=document.createElement("span");i.textContent="\u{1F41B}",i.style.display="none",o.addEventListener("error",()=>{o.style.display="none",i.style.display=""}),r.append(o,i)}else r.textContent="\u{1F41B}";e.appendChild(r)}let n=document.createElement("span");n.className="bd-trigger-label",n.textContent=Ec(t),e.appendChild(n),t.position!=="bottom-left"&&e.appendChild(Yo())}function Yo(){let e=document.createElement("span");return e.className="bd-trigger-drag-handle",e.setAttribute("aria-hidden","true"),e.title=p().dragHandleTitle,e.innerHTML=`
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
  `,e}function pi(e,t=!1){let n=["bd-trigger",`bd-trigger--${e.position==="bottom-left"?"left":"right"}`];return t&&n.push("bd-trigger--restoring"),n.join(" ")}function mi(e){return`${ac}${e.repo}_${e.position}`}function bi(e){try{let t=localStorage.getItem(mi(e));if(!t)return null;let n=Number(t);return Number.isFinite(n)?n:null}catch{return null}}function gi(e,t){try{localStorage.setItem(mi(e),String(Math.round(t)))}catch{}}function kc(e,t){let n=e.getBoundingClientRect(),r=Math.max(nt,window.innerHeight-n.height-nt);return Math.min(Math.max(t,nt),r)}function Ut(e,t){let n=kc(e,t);return e.style.top=`${n}px`,e.style.bottom="auto",n}function fi(e,t){let n=bi(t);n!==null&&(e.classList.add("bd-trigger--positioned"),Ut(e,n))}function Tn(e,t){if(!e.style.top)return;let n=e.getBoundingClientRect();if(n.width===0||n.height===0)return;let r=parseFloat(e.style.top);if(!Number.isFinite(r))return;let o=e.classList.contains("bd-trigger--dragging")?r:bi(t)??r;Ut(e,o)}function hi(e,t){let n=()=>{if(!e.isConnected){r();return}Tn(e,t)},r=()=>{window.removeEventListener("resize",n),window.visualViewport?.removeEventListener("resize",n)};window.addEventListener("resize",n),window.visualViewport?.addEventListener("resize",n)}function yi(e,t){let n=e.querySelector(".bd-trigger-drag-handle");if(!n)return;let r=null,o=0,i=0,a=!1,s=()=>{r!==null&&(r=null,e.classList.remove("bd-trigger--dragging"),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",c),a&&(gi(t,e.getBoundingClientRect().top),window.setTimeout(()=>{_e=!1},0)))};function l(u){if(r!==u.pointerId)return;let m=i+u.clientY-o;Math.abs(u.clientY-o)>3&&(a=!0,_e=!0),Ut(e,m)}function d(u){r===u.pointerId&&s()}function c(u){r===u.pointerId&&s()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation();let m=e.getBoundingClientRect();r=u.pointerId,o=u.clientY,i=m.top,a=!1,e.classList.add("bd-trigger--dragging"),n.setPointerCapture(u.pointerId),window.addEventListener("pointermove",l),window.addEventListener("pointerup",d),window.addEventListener("pointercancel",c)}),n.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation()})}function wi(e,t){e.addEventListener("keydown",n=>{if(n.target!==e||!["ArrowUp","ArrowDown","Home","End"].includes(n.key))return;n.preventDefault(),n.stopPropagation();let r=e.getBoundingClientRect(),o=window.innerHeight-r.height-nt,i=n.key==="ArrowUp"?r.top-qo:n.key==="ArrowDown"?r.top+qo:n.key==="Home"?nt:o;e.classList.add("bd-trigger--positioned"),gi(t,Ut(e,i))})}function Ln(e,t){let n=document.createElement("div");n.className=t.position==="bottom-left"?"bd-pull-tab bd-pull-tab--left":"bd-pull-tab",n.innerHTML='<span class="bd-pull-tab-chevron">\u2039</span>',n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-label",p().pullTabAriaLabel);let r=()=>{try{localStorage.removeItem(it)}catch{}n.remove(),rt=null,vi(e,t,!0)};return n.addEventListener("click",r),n.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),r())}),e.appendChild(n),rt=n,n}function Sc(e){if(mc=e,!e.buttonDismissible)try{localStorage.removeItem(it)}catch{}let t=document.createElement("div");t.id="bugdrop-host",t.style.pointerEvents="auto",document.body.appendChild(t);let n=t.attachShadow({mode:"open"});ce(t);for(let i of["keydown","keypress","keyup"])n.addEventListener(i,a=>{let s=a.target;(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&a.stopPropagation()});let r=Lr(n,e);if(pc=r,e.showButton&&!(e.buttonDismissible&&Go(e.dismissDuration))){let i=document.createElement("button");if(i.className=pi(e),ui(i,e),i.setAttribute("aria-label",p().triggerAriaLabel),e.buttonDismissible){let a=document.createElement("button");a.className="bd-trigger-close",a.textContent="\xD7",a.setAttribute("aria-label",p().dismissButtonAriaLabel),i.appendChild(a),a.addEventListener("click",s=>{s.stopPropagation(),ti(),i.classList.remove("bd-trigger--restoring"),i.classList.add("bd-trigger--dismissing"),i.addEventListener("animationend",()=>{i.remove(),X=null,e.showRestore&&Ln(r,e)},{once:!0})})}r.appendChild(i),X=i,fi(i,e),hi(i,e),yi(i,e),wi(i,e),i.addEventListener("click",()=>{if(_e){_e=!1;return}Pn(r,e)})}else e.showButton&&e.buttonDismissible&&e.showRestore&&Go(e.dismissDuration)&&Ln(r,e);Cc(r,e),window.dispatchEvent(new CustomEvent("bugdrop:ready"))}function Cc(e,t){let n=t.theme,r,o;window.BugDrop={open:()=>{K||Pn(e,t,{skipWelcome:!0})},close:()=>{if(K){let i=e.querySelector(".bd-modal");i&&i.remove(),K=!1}},hide:()=>{X&&(X.style.display="none")},show:()=>{try{localStorage.removeItem(it)}catch{}rt&&(rt.remove(),rt=null),X?(X.style.display="",Tn(X,t),window.requestAnimationFrame(()=>{X&&Tn(X,t)})):t.showButton&&vi(e,t)},isOpen:()=>K,isButtonVisible:()=>X!==null&&X.style.display!=="none",setTheme:i=>{if(!vt(i)){console.warn(`[BugDrop] Invalid theme ${String(i)}. Expected 'light' | 'dark' | 'auto'.`);return}n=i;let a=Re(i);Ge(e,a),Xe(e,t,a)},registerVariant:i=>(r??=uo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider},{isLegacyModalOpen:()=>K}),r.register(i)),registerFlow:i=>(o??=Uo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,categoryLabels:t.categoryLabels},{preflight:()=>xi(t),capture:async(a,s,l)=>await mn(e,{...t,screenshotMode:a.mode},s,()=>{},l)},{isLegacyModalOpen:()=>K}),o.register(i))},xt(i=>{n==="auto"&&(Ge(e,i),Xe(e,t,i))})}function vi(e,t,n=!1){let r=document.createElement("button");if(r.className=pi(t,n),ui(r,t),r.setAttribute("aria-label",p().triggerAriaLabel),t.buttonDismissible){let o=document.createElement("button");o.className="bd-trigger-close",o.textContent="\xD7",o.setAttribute("aria-label",p().dismissButtonAriaLabel),r.appendChild(o),o.addEventListener("click",i=>{i.stopPropagation(),ti(),r.classList.remove("bd-trigger--restoring"),r.classList.add("bd-trigger--dismissing"),r.addEventListener("animationend",()=>{r.remove(),X=null,t.showRestore&&Ln(e,t)},{once:!0})})}e.appendChild(r),X=r,fi(r,t),hi(r,t),yi(r,t),wi(r,t),r.addEventListener("click",()=>{if(_e){_e=!1;return}Pn(e,t)})}async function Pn(e,t,n){if(!K){De(),K=!0;{let{status:r,appName:o}=await xi(t);if(r==="not_installed"){Zo(e,t,void 0,o);return}if(r==="unreachable"){Zo(e,t,p().apiUnreachableMessage,o);return}await Tc(e,t,n)}K=!1}}async function Tc(e,t,n){if(!(n?.skipWelcome||t.welcome==="never"||t.welcome==="once"&&bc(t.repo))){if(!await Lc(e)){K=!1;return}t.welcome==="once"&&gc(t.repo)}let o=null;for(;;){if(o=await Fc(e,t,o),!o){K=!1;return}let i=o,a=await mn(e,t,i.includeScreenshot,()=>wc(t,i));if(!a.returnToForm){await ki(e,t,{title:o.title,description:o.description,category:o.category,name:o.name,email:o.email,screenshot:a.screenshot,attachments:o.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?Fe(t.accentColor):null,sendConsoleLogs:o.sendConsoleLogs});break}}}async function xi(e){try{let t=await fetch(`${e.apiUrl}/check/${e.repo}`,{headers:await ge(e.authTokenProvider)});if(!t.ok)return{status:"unreachable"};let n=await t.json();return{status:n.installed===!0?"installed":"not_installed",appName:n.appName}}catch{return{status:"unreachable"}}}function Zo(e,t,n,r){let i=`https://github.com/apps/${r||(t.apiUrl.includes("bugdrop.neonwatty.workers.dev")?"neonwatty-bugdrop":t.apiUrl.replace(/https?:\/\//,"").replace(/\..*/,""))}/installations/new`,a=n||p().installRequiredMessage,s=n?p().connectionErrorTitle:p().installRequiredTitle,l=H(e,s,`
      <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${U(a)}</p>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${w(p().cancel)}</button>
        ${n?"":`<a href="${i}" target="_blank" class="bd-btn bd-btn-primary" style="text-decoration: none;">${w(p().installApp)}</a>`}
      </div>
    `,!0),d=l.querySelector(".bd-close"),c=l.querySelector('[data-action="cancel"]');d?.addEventListener("click",()=>{l.remove(),K=!1}),c?.addEventListener("click",()=>{l.remove(),K=!1})}function Lc(e){return new Promise(t=>{let n=H(e,p().welcomeTitle,`
        <div style="text-align: center; padding: 8px 0 16px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">\u{1F4AC}</div>
          <p style="margin: 0 0 12px; color: var(--bd-text-primary); font-size: 1.05rem; font-weight: 500;">
            ${w(p().welcomeHeadline)}
          </p>
          <p style="margin: 0 0 8px; color: var(--bd-text-secondary); font-size: 0.95rem; line-height: 1.6;">
            ${w(p().welcomeBodyLine1)}<br/>
            ${w(p().welcomeBodyLine2)}
          </p>
        </div>
        <div class="bd-actions" style="justify-content: center;">
          <button class="bd-btn bd-btn-primary" data-action="continue">${w(p().getStarted)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="continue"]');r?.addEventListener("click",()=>{n.remove(),t(!1)}),o?.addEventListener("click",()=>{n.remove(),t(!0)})})}function Fc(e,t,n){return new Promise(r=>{let o=t.showName?`
          <div class="bd-form-group">
            <label class="bd-label" for="name">${w(p().nameLabel)}${t.requireName?" *":""}</label>
            <input type="text" id="name" class="bd-input" ${t.requireName?"required":""} placeholder="${w(p().namePlaceholder)}" value="${U(n?.name||"")}" />
          </div>
        `:"",i=t.showEmail?`
          <div class="bd-form-group">
            <label class="bd-label" for="email">${w(p().emailLabel)}${t.requireEmail?" *":""}</label>
            <input type="email" id="email" class="bd-input" ${t.requireEmail?"required":""} placeholder="${w(p().emailPlaceholder)}" value="${U(n?.email||"")}" />
          </div>
        `:"",a=H(e,p().feedbackFormTitle,`
        <form id="feedback-form">
          <div class="bd-form-group">
            <label class="bd-label">${w(p().categoryLabel)}</label>
            <div class="bd-category-selector" style="display: flex; gap: 8px; margin-top: 6px;">
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="bug" ${Sn(n,"bug")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u{1F41B} ${w(p().categoryBug)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="feature" ${Sn(n,"feature")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2728 ${w(p().categoryFeature)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="question" ${Sn(n,"question")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2753 ${w(p().categoryQuestion)}</span>
              </label>
            </div>
          </div>
          <div class="bd-form-group">
            <label class="bd-label" for="title">${w(p().titleLabel)} *</label>
            <input type="text" id="title" class="bd-input" required placeholder="${w(p().titlePlaceholder)}" value="${U(n?.title||"")}" />
          </div>
          <div class="bd-form-group">
            <label class="bd-label" for="description">${w(p().descriptionLabel)}</label>
            <textarea id="description" class="bd-textarea" placeholder="${w(p().descriptionPlaceholder)}">${U(n?.description||"")}</textarea>
          </div>
          ${o}
          ${i}
          <div class="bd-evidence-block">
            <div class="bd-evidence-row">
              ${Dc(t,n)}
              ${Pc()}
            </div>
            <input type="file" id="attachment-upload" accept="${Qo.join(",")}" multiple class="bd-upload-input" />
            <div id="attachment-list" class="bd-upload-list" aria-live="polite">${n?.attachments.length,""}</div>
            <p id="attachment-error" class="bd-field-error" hidden></p>
            ${Ic(t,n)}
          </div>
          <div class="bd-actions">
            <button type="button" class="bd-btn bd-btn-secondary" data-action="cancel">${w(p().cancel)}</button>
            <button type="submit" class="bd-btn bd-btn-primary" id="submit-btn">${t.screenshotMode==="auto"?w(p().submit):w(p().continueButton)}</button>
          </div>
        </form>
      `),s=a.querySelector("#feedback-form"),l=a.querySelector("#name"),d=a.querySelector("#email"),c=a.querySelector("#title"),u=a.querySelector("#description"),m=a.querySelector("#include-screenshot"),v=a.querySelector("#attachment-upload"),f=a.querySelector('[data-action="choose-uploads"]'),x=a.querySelector("#attachment-list"),E=a.querySelector("#attachment-error"),F=a.querySelector("#send-console-logs"),D=a.querySelector(".bd-close"),R=a.querySelector('[data-action="cancel"]'),P=[...n?.attachments??[]],I=()=>{a.remove(),r(null)};D?.addEventListener("click",I),R?.addEventListener("click",I),s.addEventListener("submit",L=>{if(L.preventDefault(),!c.value.trim()){c.classList.add("bd-input--error"),c.focus();return}if(t.requireName&&l&&!l.value.trim()){l.classList.add("bd-input--error"),l.focus();return}if(t.requireEmail&&d&&!d.value.trim()){d.classList.add("bd-input--error"),d.focus();return}let z=a.querySelector('input[name="category"]:checked')?.value||"bug",N=t.screenshotMode==="optional"?m?.checked??!1:!0;t.screenshotMode==="optional"&&N&&yc(t.repo),a.remove(),r({title:c.value.trim(),description:u.value.trim(),category:z,name:l?.value.trim()||void 0,email:d?.value.trim()||void 0,includeScreenshot:N,attachments:P,sendConsoleLogs:F.checked})}),c.addEventListener("input",()=>c.classList.remove("bd-input--error")),l?.addEventListener("input",()=>l.classList.remove("bd-input--error")),d?.addEventListener("input",()=>d.classList.remove("bd-input--error"));let h=()=>{Rc(x,P,L=>{P=P.filter((O,z)=>z!==L),h()})};f.addEventListener("click",()=>v.click()),v.addEventListener("change",async()=>{let L=Array.from(v.files??[]);v.value="",E.textContent="",E.hidden=!0;let O=Wo-P.length;if(L.length>O){kn(E,p().uploadTooMany(Wo));return}for(let z of L){let N=Ac(z);if(N){kn(E,N);return}}try{let z=await Promise.all(L.map(Mc));P=[...P,...z],h()}catch{kn(E,p().uploadReadError)}}),h()})}function Pc(){return`
    <div class="bd-upload-group">
      <div class="bd-upload-row" aria-label="${w(p().uploadsAriaLabel)}">
        <button type="button" class="bd-btn bd-btn-secondary bd-upload-button" data-action="choose-uploads" aria-label="${w(p().uploadFilesAriaLabel)}">
          <svg class="bd-upload-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M8 11V3" />
            <path d="M4.5 6.5 8 3l3.5 3.5" />
            <path d="M3 12.5h10" />
          </svg>
          ${w(p().uploadButton)}
        </button>
      </div>
    </div>
  `}function Ac(e){return Qo.includes(e.type)?e.size>jo?p().uploadTooLarge(Ei(jo)):null:p().uploadUnsupportedType}function kn(e,t){e.textContent=t,e.hidden=!1}function Rc(e,t,n){e.innerHTML=t.map((r,o)=>`
        <div class="bd-upload-item">
          <span class="bd-upload-item__name">${U(r.name)}</span>
          <span class="bd-upload-item__meta">${Ei(r.size)}</span>
          <button type="button" class="bd-upload-remove" data-index="${o}" aria-label="${w(p().removeAttachmentAriaLabel(r.name))}">&times;</button>
        </div>
      `).join(""),e.querySelectorAll(".bd-upload-remove").forEach(r=>{r.addEventListener("click",()=>{let o=Number(r.dataset.index);Number.isInteger(o)&&n(o)})})}function Mc(e){return new Promise((t,n)=>{let r=new FileReader;r.addEventListener("load",()=>{if(typeof r.result!="string"){n(new Error("Could not read file."));return}t({name:e.name,type:e.type,size:e.size,dataUrl:r.result})}),r.addEventListener("error",()=>n(new Error("Could not read file."))),r.readAsDataURL(e)})}function Ei(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${Math.round(e/(1024*1024)*10)/10} MB`}function Dc(e,t){if(e.screenshotMode==="auto"){let r=Ae()>0?` ${w(p().screenshotAutoRedactionNote)}`:"";return`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${w(p().screenshotAutoNote)}${r}
      </p>
    `}return e.screenshotMode==="required"?`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${w(p().screenshotRequiredNote)}
      </p>
    `:`
    <div class="bd-screenshot-control">
      <input type="checkbox" id="include-screenshot" ${t?.includeScreenshot??(!ee()||!fc(e.repo))?"checked":""} class="bd-checkbox" />
      <label for="include-screenshot" class="bd-checkbox-label">
        ${w(p().includeScreenshotLabel)}
      </label>
    </div>
  `}function Ic(e,t){return`
    <div class="bd-form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
      <input type="checkbox" id="send-console-logs" ${t?.sendConsoleLogs??e.sendConsoleLogs?"checked":""} style="width: 18px; height: 18px; accent-color: var(--bd-primary); cursor: pointer;" />
      <label for="send-console-logs" style="font-size: 0.95rem; color: var(--bd-text-secondary); cursor: pointer; user-select: none;">
        ${w(p().sendConsoleLogsLabel)}
      </label>
    </div>
  `}function Sn(e,t){return(e?.category||"bug")===t?"checked":""}async function ki(e,t,n){let r=H(e,p().submittingTitle,`
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <div class="bd-spinner bd-spinner--lg"></div>
        <p class="bd-loading-text" style="margin-top: 12px;">${w(p().creatingIssue)}</p>
      </div>
    `);try{let o=n.name||n.email?{name:n.name,email:n.email}:void 0,i=uc(),a=Pe(),s=n.sendConsoleLogs?Ft():void 0,l=await fetch(`${t.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await ge(t.authTokenProvider)},body:JSON.stringify({repo:t.repo,title:n.title,description:n.description,category:n.category,categoryLabels:t.categoryLabels,screenshot:n.screenshot,attachments:n.attachments,consoleLogs:s,submitter:o,metadata:{url:i.url,userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:n.elementSelector,fullElementSelector:n.fullElementSelector,selectedElementHighlightColor:n.selectedElementHighlightColor||void 0,domNodeCount:a,fullPageDisabled:ee(),browser:i.browser,os:i.os,devicePixelRatio:i.devicePixelRatio,language:i.language}})});if(r.remove(),l.status===429){let c=l.headers.get("Retry-After"),u=c?Math.ceil(parseInt(c,10)/60):15;Cn(e,t,n,p().rateLimited(u));return}let d=await l.json();d.success?await Fr(e,d.issueNumber,d.issueUrl,d.isPublic??!1,t.issueLinkVisibility):Cn(e,t,n,d.error||p().submitFailedFallback)}catch{r.remove(),Cn(e,t,n,p().networkError)}}function Cn(e,t,n,r){let o=H(e,p().submissionFailedTitle,`
      <div class="bd-error-message">
        <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
        <span class="bd-error-message__text">${U(r)}</span>
      </div>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${w(p().cancel)}</button>
        <button class="bd-btn bd-btn-primary" data-action="retry">${w(p().tryAgain)}</button>
      </div>
    `,!0),i=o.querySelector(".bd-close"),a=o.querySelector('[data-action="cancel"]'),s=o.querySelector('[data-action="retry"]');i?.addEventListener("click",()=>o.remove()),a?.addEventListener("click",()=>o.remove()),s?.addEventListener("click",async()=>{o.remove(),await ki(e,t,n)})}})();
