"use strict";(()=>{function On(e,t){if(e.match(/^[a-z]+:\/\//i))return e;if(e.match(/^\/\//))return window.location.protocol+e;if(e.match(/^[a-z]+:/i))return e;let n=document.implementation.createHTMLDocument(),r=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(o),t&&(r.href=t),o.href=e,o.href}var Nn=(()=>{let e=0,t=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(e+=1,`u${t()}${e}`)})();function J(e){let t=[];for(let n=0,r=e.length;n<r;n++)t.push(e[n]);return t}var Se=null;function dt(e={}){return Se||(e.includeStyleProperties?(Se=e.includeStyleProperties,Se):(Se=J(window.getComputedStyle(document.documentElement)),Se))}function ct(e,t){let r=(e.ownerDocument.defaultView||window).getComputedStyle(e).getPropertyValue(t);return r?parseFloat(r.replace("px","")):0}function Ui(e){let t=ct(e,"border-left-width"),n=ct(e,"border-right-width");return e.clientWidth+t+n}function qi(e){let t=ct(e,"border-top-width"),n=ct(e,"border-bottom-width");return e.clientHeight+t+n}function Xt(e,t={}){let n=t.width||Ui(e),r=t.height||qi(e);return{width:n,height:r}}function Bn(){let e,t;try{t=process}catch{}let n=t&&t.env?t.env.devicePixelRatio:null;return n&&(e=parseInt(n,10),Number.isNaN(e)&&(e=1)),e||window.devicePixelRatio||1}var G=16384;function _n(e){(e.width>G||e.height>G)&&(e.width>G&&e.height>G?e.width>e.height?(e.height*=G/e.width,e.width=G):(e.width*=G/e.height,e.height=G):e.width>G?(e.height*=G/e.width,e.width=G):(e.width*=G/e.height,e.height=G))}function Ce(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>t(r))})},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=e})}async function Wi(e){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(e)).then(encodeURIComponent).then(t=>`data:image/svg+xml;charset=utf-8,${t}`)}async function Hn(e,t,n){let r="http://www.w3.org/2000/svg",o=document.createElementNS(r,"svg"),i=document.createElementNS(r,"foreignObject");return o.setAttribute("width",`${t}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${t} ${n}`),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("x","0"),i.setAttribute("y","0"),i.setAttribute("externalResourcesRequired","true"),o.appendChild(i),i.appendChild(e),Wi(o)}var V=(e,t)=>{if(e instanceof t)return!0;let n=Object.getPrototypeOf(e);return n===null?!1:n.constructor.name===t.name||V(n,t)};function ji(e){let t=e.getPropertyValue("content");return`${e.cssText} content: '${t.replace(/'|"/g,"")}';`}function Gi(e,t){return dt(t).map(n=>{let r=e.getPropertyValue(n),o=e.getPropertyPriority(n);return`${n}: ${r}${o?" !important":""};`}).join(" ")}function Xi(e,t,n,r){let o=`.${e}:${t}`,i=n.cssText?ji(n):Gi(n,r);return document.createTextNode(`${o}{${i}}`)}function Vn(e,t,n,r){let o=window.getComputedStyle(e,n),i=o.getPropertyValue("content");if(i===""||i==="none")return;let a=Nn();try{t.className=`${t.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(Xi(a,n,o,r)),t.appendChild(s)}function Un(e,t,n){Vn(e,t,":before",n),Vn(e,t,":after",n)}var qn="application/font-woff",Wn="image/jpeg",Ki={woff:qn,woff2:qn,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:Wn,jpeg:Wn,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Yi(e){let t=/\.([^./]*?)$/g.exec(e);return t?t[1]:""}function Te(e){let t=Yi(e).toLowerCase();return Ki[t]||""}function Zi(e){return e.split(/,/)[1]}function qe(e){return e.search(/^(data:)/)!==-1}function Yt(e,t){return`data:${t};base64,${e}`}async function Zt(e,t,n){let r=await fetch(e,t);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);let o=await r.blob();return new Promise((i,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{i(n({res:r,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var Kt={};function Ji(e,t,n){let r=e.replace(/\?.*/,"");return n&&(r=e),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),t?`[${t}]${r}`:r}async function Le(e,t,n){let r=Ji(e,t,n.includeQueryParams);if(Kt[r]!=null)return Kt[r];n.cacheBust&&(e+=(/\?/.test(e)?"&":"?")+new Date().getTime());let o;try{let i=await Zt(e,n.fetchRequestInit,({res:a,result:s})=>(t||(t=a.headers.get("Content-Type")||""),Zi(s)));o=Yt(i,t)}catch(i){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${e}`;i&&(a=typeof i=="string"?i:i.message),a&&console.warn(a)}return Kt[r]=o,o}async function Qi(e){let t=e.toDataURL();return t==="data:,"?e.cloneNode(!1):Ce(t)}async function ea(e,t){if(e.currentSrc){let i=document.createElement("canvas"),a=i.getContext("2d");i.width=e.clientWidth,i.height=e.clientHeight,a?.drawImage(e,0,0,i.width,i.height);let s=i.toDataURL();return Ce(s)}let n=e.poster,r=Te(n),o=await Le(n,r,t);return Ce(o)}async function ta(e,t){var n;try{if(!((n=e?.contentDocument)===null||n===void 0)&&n.body)return await We(e.contentDocument.body,t,!0)}catch{}return e.cloneNode(!1)}async function na(e,t){return V(e,HTMLCanvasElement)?Qi(e):V(e,HTMLVideoElement)?ea(e,t):V(e,HTMLIFrameElement)?ta(e,t):e.cloneNode(jn(e))}var ra=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SLOT",jn=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SVG";async function oa(e,t,n){var r,o;if(jn(t))return t;let i=[];return ra(e)&&e.assignedNodes?i=J(e.assignedNodes()):V(e,HTMLIFrameElement)&&(!((r=e.contentDocument)===null||r===void 0)&&r.body)?i=J(e.contentDocument.body.childNodes):i=J(((o=e.shadowRoot)!==null&&o!==void 0?o:e).childNodes),i.length===0||V(e,HTMLVideoElement)||await i.reduce((a,s)=>a.then(()=>We(s,n)).then(l=>{l&&t.appendChild(l)}),Promise.resolve()),t}function ia(e,t,n){let r=t.style;if(!r)return;let o=window.getComputedStyle(e);o.cssText?(r.cssText=o.cssText,r.transformOrigin=o.transformOrigin):dt(n).forEach(i=>{let a=o.getPropertyValue(i);i==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),V(e,HTMLIFrameElement)&&i==="display"&&a==="inline"&&(a="block"),i==="d"&&t.getAttribute("d")&&(a=`path(${t.getAttribute("d")})`),r.setProperty(i,a,o.getPropertyPriority(i))})}function aa(e,t){V(e,HTMLTextAreaElement)&&(t.innerHTML=e.value),V(e,HTMLInputElement)&&t.setAttribute("value",e.value)}function sa(e,t){if(V(e,HTMLSelectElement)){let r=Array.from(t.children).find(o=>e.value===o.getAttribute("value"));r&&r.setAttribute("selected","")}}function la(e,t,n){return V(t,Element)&&(ia(e,t,n),Un(e,t,n),aa(e,t),sa(e,t)),t}async function ca(e,t){let n=e.querySelectorAll?e.querySelectorAll("use"):[];if(n.length===0)return e;let r={};for(let i=0;i<n.length;i++){let s=n[i].getAttribute("xlink:href");if(s){let l=e.querySelector(s),c=document.querySelector(s);!l&&c&&!r[s]&&(r[s]=await We(c,t,!0))}}let o=Object.values(r);if(o.length){let i="http://www.w3.org/1999/xhtml",a=document.createElementNS(i,"svg");a.setAttribute("xmlns",i),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(i,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);e.appendChild(a)}return e}async function We(e,t,n){return!n&&t.filter&&!t.filter(e)?null:Promise.resolve(e).then(r=>na(r,t)).then(r=>oa(e,r,t)).then(r=>la(e,r,t)).then(r=>ca(r,t))}var Gn=/url\((['"]?)([^'"]+?)\1\)/g,da=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,ua=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function pa(e){let t=e.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`,"g")}function ma(e){let t=[];return e.replace(Gn,(n,r,o)=>(t.push(o),n)),t.filter(n=>!qe(n))}async function ba(e,t,n,r,o){try{let i=n?On(t,n):t,a=Te(t),s;if(o){let l=await o(i);s=Yt(l,a)}else s=await Le(i,a,r);return e.replace(pa(t),`$1${s}$3`)}catch{}return e}function fa(e,{preferredFontFormat:t}){return t?e.replace(ua,n=>{for(;;){let[r,,o]=da.exec(n)||[];if(!o)return"";if(o===t)return`src: ${r};`}}):e}function Jt(e){return e.search(Gn)!==-1}async function ut(e,t,n){if(!Jt(e))return e;let r=fa(e,n);return ma(r).reduce((i,a)=>i.then(s=>ba(s,a,t,n)),Promise.resolve(r))}async function Fe(e,t,n){var r;let o=(r=t.style)===null||r===void 0?void 0:r.getPropertyValue(e);if(o){let i=await ut(o,null,n);return t.style.setProperty(e,i,t.style.getPropertyPriority(e)),!0}return!1}async function ga(e,t){await Fe("background",e,t)||await Fe("background-image",e,t),await Fe("mask",e,t)||await Fe("-webkit-mask",e,t)||await Fe("mask-image",e,t)||await Fe("-webkit-mask-image",e,t)}async function ha(e,t){let n=V(e,HTMLImageElement);if(!(n&&!qe(e.src))&&!(V(e,SVGImageElement)&&!qe(e.href.baseVal)))return;let r=n?e.src:e.href.baseVal,o=await Le(r,Te(r),t);await new Promise((i,a)=>{e.onload=i,e.onerror=t.onImageErrorHandler?(...l)=>{try{i(t.onImageErrorHandler(...l))}catch(c){a(c)}}:a;let s=e;s.decode&&(s.decode=i),s.loading==="lazy"&&(s.loading="eager"),n?(e.srcset="",e.src=o):e.href.baseVal=o})}async function ya(e,t){let r=J(e.childNodes).map(o=>Qt(o,t));await Promise.all(r).then(()=>e)}async function Qt(e,t){V(e,Element)&&(await ga(e,t),await ha(e,t),await ya(e,t))}function Xn(e,t){let{style:n}=e;t.backgroundColor&&(n.backgroundColor=t.backgroundColor),t.width&&(n.width=`${t.width}px`),t.height&&(n.height=`${t.height}px`);let r=t.style;return r!=null&&Object.keys(r).forEach(o=>{n[o]=r[o]}),e}var Kn={};async function Yn(e){let t=Kn[e];if(t!=null)return t;let r=await(await fetch(e)).text();return t={url:e,cssText:r},Kn[e]=t,t}async function Zn(e,t){let n=e.cssText,r=/url\(["']?([^"')]+)["']?\)/g,i=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(r,"$1");return s.startsWith("https://")||(s=new URL(s,e.url).href),Zt(s,t.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(i).then(()=>n)}function Jn(e){if(e==null)return[];let t=[],n=/(\/\*[\s\S]*?\*\/)/gi,r=e.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(r);if(l===null)break;t.push(l[0])}r=r.replace(o,"");let i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=i.exec(r);if(l===null){if(l=s.exec(r),l===null)break;i.lastIndex=s.lastIndex}else s.lastIndex=i.lastIndex;t.push(l[0])}return t}async function wa(e,t){let n=[],r=[];return e.forEach(o=>{if("cssRules"in o)try{J(o.cssRules||[]).forEach((i,a)=>{if(i.type===CSSRule.IMPORT_RULE){let s=a+1,l=i.href,c=Yn(l).then(d=>Zn(d,t)).then(d=>Jn(d).forEach(u=>{try{o.insertRule(u,u.startsWith("@import")?s+=1:o.cssRules.length)}catch(g){console.error("Error inserting rule from remote css",{rule:u,error:g})}})).catch(d=>{console.error("Error loading remote css",d.toString())});r.push(c)}})}catch(i){let a=e.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&r.push(Yn(o.href).then(s=>Zn(s,t)).then(s=>Jn(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",i)}}),Promise.all(r).then(()=>(e.forEach(o=>{if("cssRules"in o)try{J(o.cssRules||[]).forEach(i=>{n.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${o.href}`,i)}}),n))}function va(e){return e.filter(t=>t.type===CSSRule.FONT_FACE_RULE).filter(t=>Jt(t.style.getPropertyValue("src")))}async function xa(e,t){if(e.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=J(e.ownerDocument.styleSheets),r=await wa(n,t);return va(r)}function Qn(e){return e.trim().replace(/["']/g,"")}function Ea(e){let t=new Set;function n(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(i=>{t.add(Qn(i))}),Array.from(r.children).forEach(i=>{i instanceof HTMLElement&&n(i)})}return n(e),t}async function er(e,t){let n=await xa(e,t),r=Ea(e);return(await Promise.all(n.filter(i=>r.has(Qn(i.style.fontFamily))).map(i=>{let a=i.parentStyleSheet?i.parentStyleSheet.href:null;return ut(i.cssText,a,t)}))).join(`
`)}async function tr(e,t){let n=t.fontEmbedCSS!=null?t.fontEmbedCSS:t.skipFonts?null:await er(e,t);if(n){let r=document.createElement("style"),o=document.createTextNode(n);r.appendChild(o),e.firstChild?e.insertBefore(r,e.firstChild):e.appendChild(r)}}async function ka(e,t={}){let{width:n,height:r}=Xt(e,t),o=await We(e,t,!0);return await tr(o,t),await Qt(o,t),Xn(o,t),await Hn(o,n,r)}async function Sa(e,t={}){let{width:n,height:r}=Xt(e,t),o=await ka(e,t),i=await Ce(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=t.pixelRatio||Bn(),c=t.canvasWidth||n,d=t.canvasHeight||r;return a.width=c*l,a.height=d*l,t.skipAutoScale||_n(a),a.style.width=`${c}`,a.style.height=`${d}`,t.backgroundColor&&(s.fillStyle=t.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(i,0,0,a.width,a.height),a}async function nr(e,t={}){return(await Sa(e,t)).toDataURL()}var rr={triggerLabel:"Feedback",triggerAriaLabel:"Fehler melden oder Feedback senden",dismissButtonAriaLabel:"Feedback-Button ausblenden",pullTabAriaLabel:"Feedback-Button anzeigen",dragHandleTitle:"Feedback-Button verschieben",installRequiredTitle:"Installation erforderlich",connectionErrorTitle:"Verbindungsfehler",installRequiredMessage:"BugDrop ben\xF6tigt die Installation der GitHub-App, um Issues zu erstellen.",apiUnreachableMessage:"Die BugDrop-API ist nicht erreichbar. \xDCberpr\xFCfen Sie Ihre Netzwerkverbindung oder die URL des Script-Tags.",installApp:"App installieren",welcomeTitle:"Teilen Sie Ihr Feedback",welcomeHeadline:"Helfen Sie uns, besser zu werden, indem Sie Ihre Meinung teilen",welcomeBodyLine1:"Melden Sie Fehler, schlagen Sie Funktionen vor oder hinterlassen Sie Feedback.",welcomeBodyLine2:"Sie k\xF6nnen optional kommentierte Screenshots hinzuf\xFCgen.",getStarted:"Los geht\u2019s",feedbackFormTitle:"Feedback senden",categoryLabel:"Kategorie",categoryBug:"Fehler",categoryFeature:"Funktion",categoryQuestion:"Frage",nameLabel:"Name",namePlaceholder:"Ihr Name",emailLabel:"E-Mail",emailPlaceholder:"ihre@email.de",titleLabel:"Titel",titlePlaceholder:"Kurze Beschreibung des Problems oder Vorschlags",descriptionLabel:"Beschreibung",descriptionPlaceholder:"Geben Sie weitere Details, Schritte zur Reproduktion oder Kontext an...",screenshotAutoNote:"Diese Website h\xE4ngt beim Absenden automatisch einen Screenshot der gesamten Seite an, ohne eine Vorschau anzuzeigen. \xDCberpr\xFCfen Sie Ihre Seite vor dem Senden auf sensible Informationen.",screenshotAutoRedactionNote:"Einige von dieser Website als privat markierte Felder k\xF6nnen auf unterst\xFCtzten Seiten optisch maskiert werden, nicht markierte sensible Informationen k\xF6nnen jedoch weiterhin enthalten sein.",screenshotRequiredNote:"\u{1F4F8} Vor dem Absenden ist ein Screenshot erforderlich.",includeScreenshotLabel:"\u{1F4F8} Screenshot hinzuf\xFCgen",sendConsoleLogsLabel:"Konsolenprotokolle mitsenden",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Dateien hochladen",uploadButton:"Hochladen",uploadTooMany:e=>`Laden Sie bis zu ${e} Dateien hoch. Entfernen Sie eine Datei, bevor Sie eine weitere hinzuf\xFCgen.`,uploadUnsupportedType:"Dieser Dateityp wird nicht unterst\xFCtzt. Laden Sie ein Bild, ein PDF oder ein kurzes Video hoch.",uploadTooLarge:e=>`Die Datei ist zu gro\xDF. Laden Sie Dateien bis zu ${e} hoch.`,uploadReadError:"Diese Datei konnte nicht gelesen werden. Versuchen Sie es mit einer anderen.",removeAttachmentAriaLabel:e=>`${e} entfernen`,cancel:"Abbrechen",continueButton:"Weiter",submit:"Absenden",submittingTitle:"Wird gesendet...",creatingIssue:"Issue wird erstellt...",rateLimited:e=>`Zu viele \xDCbermittlungen. Bitte versuchen Sie es in ${e} Minute${e===1?"":"n"} erneut.`,submitFailedFallback:"Senden fehlgeschlagen",networkError:"Netzwerkfehler. Bitte \xFCberpr\xFCfen Sie Ihre Verbindung.",submissionFailedTitle:"Senden fehlgeschlagen",tryAgain:"Erneut versuchen",successTitle:"Feedback gesendet!",issueCreated:e=>`Issue ${e} wurde erstellt.`,feedbackSubmittedMessage:"Ihr Feedback wurde erfolgreich gesendet.",viewOnGitHub:"Auf GitHub ansehen",done:"Fertig",captureScreenshotTitle:"Screenshot erstellen",chooseWhatToCapture:"W\xE4hlen Sie aus, was erfasst werden soll:",viewportRedactionWarning:"Bei der Erfassung des sichtbaren Bereichs \xFCber den Browser k\xF6nnen private Felder nicht automatisch maskiert werden. W\xE4hlen Sie \u201EElement ausw\xE4hlen\u201C, um die automatische Maskierung beizubehalten, oder \xFCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionReviewNote:"Diese Website hat einige Felder zur Schw\xE4rzung markiert. \xDCberpr\xFCfen Sie den Screenshot vor dem Senden.",pageTooComplexViewportNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. Erfassen Sie stattdessen den sichtbaren Bereich oder w\xE4hlen Sie ein bestimmtes Element aus.",pageTooComplexElementNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. W\xE4hlen Sie stattdessen ein bestimmtes Element aus.",fullPage:"Ganze Seite",captureViewport:"Sichtbaren Bereich erfassen",selectArea:"Bereich ausw\xE4hlen",selectElement:"Element ausw\xE4hlen",skipScreenshot:"Screenshot \xFCberspringen",areaPickerInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich",areaPickerRedactionInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich. Markierte private Felder k\xF6nnen maskiert werden, wenn sie darin enthalten sind.",elementPickerInstruction:"Klicken Sie auf ein beliebiges Element, um es zu erfassen",elementPickerTouchInstruction:"Tippen Sie auf ein beliebiges Element, um es zu erfassen",escToCancel:"ESC zum Abbrechen",capturingTitle:"Wird erfasst...",capturingScreenshot:"Screenshot wird erfasst...",captureFailedTitle:"Erfassung fehlgeschlagen",captureFailedMessage:"Der Screenshot konnte nicht erfasst werden. Die Seite ist m\xF6glicherweise zu komplex, oder Browsereinschr\xE4nkungen greifen.",chooseAnotherMethod:"Andere Methode w\xE4hlen",maskFailureTitle:"Datenschutz-Maskierung fehlgeschlagen",maskFailureMessage:"Die automatische Schw\xE4rzung privater Felder konnte nicht angewendet werden. Zum Schutz Ihrer Daten wurde dieser Screenshot verworfen. Sie k\xF6nnen Ihr Feedback weiterhin ohne Screenshot senden.",continueWithoutScreenshot:"Ohne Screenshot fortfahren",reviewScreenshotTitle:"Screenshot \xFCberpr\xFCfen",viewportRedactionUnavailableNote:"Bei diesem \xFCber den Browser erfassten sichtbaren Bereich konnten private Felder nicht automatisch maskiert werden. \xDCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionCountNote:e=>e===1?`${e} privates Element wurde zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`:`${e} private Elemente wurden zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`,redactionLimitationsNote:"BugDrop hat nur die gemessenen markierten Bereiche abgedeckt. Es untersucht keine Pixel innerhalb eingebetteter oder gerenderter Inhalte wie iFrames, Canvas, Bildern, SVGs, Videos, CSS-Hintergr\xFCnden oder benutzerdefinierten Steuerelementen. Stellen Sie vor dem Senden sicher, dass das schwarze Feld den sensiblen Bereich vollst\xE4ndig abdeckt, oder nehmen Sie den Screenshot nach Markierung eines gr\xF6\xDFeren Bereichs erneut auf.",annotationInstruction:"Stellen Sie vor dem Senden sicher, dass keine sensiblen Informationen sichtbar sind. Verdecken Sie sensible Bereiche vor dem Absenden. Schw\xE4rzungen werden dauerhaft in das hochgeladene Bild eingebettet.",selectedElementNote:e=>`Ben\xF6tigen Sie mehr umgebenden Kontext? Passen Sie ${e} im BugDrop-Script-Tag an.`,toolDraw:"Zeichnen",toolArrow:"Pfeil",toolRectangle:"Rechteck",toolRedact:"Schw\xE4rzen",undo:"R\xFCckg\xE4ngig",retake:"Erneut aufnehmen",submitFeedback:"Feedback senden",captureTimeout:"Zeit\xFCberschreitung bei der Screenshot-Erfassung \u2014 die Seite ist m\xF6glicherweise zu komplex"};var en={triggerLabel:"Feedback",triggerAriaLabel:"Report a bug or send feedback",dismissButtonAriaLabel:"Dismiss feedback button",pullTabAriaLabel:"Show feedback button",dragHandleTitle:"Drag feedback button",installRequiredTitle:"Install Required",connectionErrorTitle:"Connection Error",installRequiredMessage:"BugDrop requires GitHub App installation to create issues.",apiUnreachableMessage:"Unable to reach BugDrop API. Check your network connection or script tag URL.",installApp:"Install App",welcomeTitle:"Share Your Feedback",welcomeHeadline:"Help us improve by sharing your thoughts",welcomeBodyLine1:"Report bugs, suggest features, or leave feedback.",welcomeBodyLine2:"You can optionally include annotated screenshots.",getStarted:"Get Started",feedbackFormTitle:"Send Feedback",categoryLabel:"Category",categoryBug:"Bug",categoryFeature:"Feature",categoryQuestion:"Question",nameLabel:"Name",namePlaceholder:"Your name",emailLabel:"Email",emailPlaceholder:"your@email.com",titleLabel:"Title",titlePlaceholder:"Brief description of the issue or suggestion",descriptionLabel:"Description",descriptionPlaceholder:"Provide additional details, steps to reproduce, or context...",screenshotAutoNote:"This site will attach a full-page screenshot when you submit without showing a preview. Review your page for sensitive information before sending.",screenshotAutoRedactionNote:"Some fields this site marked private may be visually masked on supported pages, but unmarked sensitive information can still be included.",screenshotRequiredNote:"\u{1F4F8} A screenshot is required before submitting.",includeScreenshotLabel:"\u{1F4F8} Include a screenshot",sendConsoleLogsLabel:"Send Console Logs",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Upload files",uploadButton:"Upload",uploadTooMany:e=>`Upload up to ${e} files. Remove a file before adding another.`,uploadUnsupportedType:"That file type is not supported. Upload an image, PDF, or short video.",uploadTooLarge:e=>`File is too large. Upload files up to ${e}.`,uploadReadError:"Could not read that file. Try another one.",removeAttachmentAriaLabel:e=>`Remove ${e}`,cancel:"Cancel",continueButton:"Continue",submit:"Submit",submittingTitle:"Submitting...",creatingIssue:"Creating issue...",rateLimited:e=>`Too many submissions. Please try again in ${e} minute${e===1?"":"s"}.`,submitFailedFallback:"Failed to submit",networkError:"Network error. Please check your connection.",submissionFailedTitle:"Submission Failed",tryAgain:"Try Again",successTitle:"Feedback Submitted!",issueCreated:e=>`Issue ${e} has been created.`,feedbackSubmittedMessage:"Your feedback has been submitted successfully.",viewOnGitHub:"View on GitHub",done:"Done",captureScreenshotTitle:"Capture Screenshot",chooseWhatToCapture:"Choose what to capture:",viewportRedactionWarning:"Browser viewport capture cannot apply automatic private-field masks. Select Element to preserve automatic masking, or review and cover sensitive areas before sending.",redactionReviewNote:"This site marked some fields for redaction. Review the screenshot before sending.",pageTooComplexViewportNote:"This page is too complex for full-page or area capture. Capture the visible viewport or select a specific element instead.",pageTooComplexElementNote:"This page is too complex for full-page or area capture. Select a specific element instead.",fullPage:"Full Page",captureViewport:"Capture Viewport",selectArea:"Select Area",selectElement:"Select Element",skipScreenshot:"Skip Screenshot",areaPickerInstruction:"Draw a selection around the area to capture",areaPickerRedactionInstruction:"Draw a selection around the area to capture. Marked private fields may be masked if included.",elementPickerInstruction:"Click any element to capture it",elementPickerTouchInstruction:"Tap any element to capture it",escToCancel:"ESC to cancel",capturingTitle:"Capturing...",capturingScreenshot:"Capturing screenshot...",captureFailedTitle:"Capture Failed",captureFailedMessage:"Failed to capture screenshot. The page may be too complex or browser restrictions may apply.",chooseAnotherMethod:"Choose Another Method",maskFailureTitle:"Privacy masking failed",maskFailureMessage:"Automatic redaction of private fields could not be applied. To protect your data, this screenshot was discarded. You can still submit feedback without one.",continueWithoutScreenshot:"Continue without screenshot",reviewScreenshotTitle:"Review Screenshot",viewportRedactionUnavailableNote:"This browser viewport capture could not apply automatic private-field masks. Review and cover any sensitive areas before sending.",redactionCountNote:e=>`${e} private ${e===1?"item was":"items were"} marked for redaction in this screenshot. Review before sending.`,redactionLimitationsNote:"BugDrop only covered the measured marked boxes. It does not inspect pixels inside embedded or rendered content such as iframes, canvas, images, SVGs, videos, CSS backgrounds, or custom controls. Confirm the black box fully covers the sensitive region before sending, or retake after marking a larger wrapper.",annotationInstruction:"Check that no sensitive information is visible before sending. Cover sensitive areas before submitting. Redactions are baked into the uploaded image.",selectedElementNote:e=>`Need more surrounding context? Adjust ${e} on the BugDrop script tag.`,toolDraw:"Draw",toolArrow:"Arrow",toolRectangle:"Rectangle",toolRedact:"Redact",undo:"Undo",retake:"Retake",submitFeedback:"Submit Feedback",captureTimeout:"Screenshot capture timed out \u2014 the page may be too complex"};var or={triggerLabel:"Feedback",triggerAriaLabel:"Een fout melden of feedback versturen",dismissButtonAriaLabel:"Feedbackknop verbergen",pullTabAriaLabel:"Feedbackknop tonen",dragHandleTitle:"Feedbackknop verslepen",installRequiredTitle:"Installatie vereist",connectionErrorTitle:"Verbindingsfout",installRequiredMessage:"BugDrop vereist installatie van de GitHub-app om issues te kunnen aanmaken.",apiUnreachableMessage:"Kan de BugDrop-API niet bereiken. Controleer uw netwerkverbinding of de URL van de scripttag.",installApp:"App installeren",welcomeTitle:"Deel uw feedback",welcomeHeadline:"Help ons verbeteren door uw mening te delen",welcomeBodyLine1:"Meld fouten, stel functies voor of laat feedback achter.",welcomeBodyLine2:"U kunt optioneel schermafbeeldingen met aantekeningen toevoegen.",getStarted:"Aan de slag",feedbackFormTitle:"Feedback versturen",categoryLabel:"Categorie",categoryBug:"Fout",categoryFeature:"Suggestie",categoryQuestion:"Vraag",nameLabel:"Naam",namePlaceholder:"Uw naam",emailLabel:"E-mail",emailPlaceholder:"uw@email.nl",titleLabel:"Titel",titlePlaceholder:"Korte omschrijving van het probleem of de suggestie",descriptionLabel:"Omschrijving",descriptionPlaceholder:"Geef extra details, stappen om het te reproduceren of context...",screenshotAutoNote:"Deze site voegt bij het versturen automatisch een schermafbeelding van de volledige pagina toe, zonder voorbeeld. Controleer uw pagina op gevoelige informatie voordat u verstuurt.",screenshotAutoRedactionNote:"Sommige velden die deze site als priv\xE9 heeft gemarkeerd, kunnen op ondersteunde pagina\u2019s visueel worden gemaskeerd, maar niet-gemarkeerde gevoelige informatie kan nog steeds worden meegestuurd.",screenshotRequiredNote:"\u{1F4F8} Een schermafbeelding is vereist voordat u kunt versturen.",includeScreenshotLabel:"\u{1F4F8} Schermafbeelding toevoegen",sendConsoleLogsLabel:"Consolelogboeken meesturen",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Bestanden uploaden",uploadButton:"Uploaden",uploadTooMany:e=>`Upload maximaal ${e} bestanden. Verwijder een bestand voordat u er een toevoegt.`,uploadUnsupportedType:"Dat bestandstype wordt niet ondersteund. Upload een afbeelding, pdf of korte video.",uploadTooLarge:e=>`Het bestand is te groot. Upload bestanden tot ${e}.`,uploadReadError:"Kan dat bestand niet lezen. Probeer een ander bestand.",removeAttachmentAriaLabel:e=>`${e} verwijderen`,cancel:"Annuleren",continueButton:"Doorgaan",submit:"Versturen",submittingTitle:"Versturen...",creatingIssue:"Issue aanmaken...",rateLimited:e=>`Te veel inzendingen. Probeer het over ${e} ${e===1?"minuut":"minuten"} opnieuw.`,submitFailedFallback:"Versturen mislukt",networkError:"Netwerkfout. Controleer uw verbinding.",submissionFailedTitle:"Versturen mislukt",tryAgain:"Opnieuw proberen",successTitle:"Feedback verstuurd!",issueCreated:e=>`Issue ${e} is aangemaakt.`,feedbackSubmittedMessage:"Uw feedback is succesvol verstuurd.",viewOnGitHub:"Bekijken op GitHub",done:"Klaar",captureScreenshotTitle:"Schermafbeelding maken",chooseWhatToCapture:"Kies wat u wilt vastleggen:",viewportRedactionWarning:"Bij het vastleggen van het zichtbare deel via de browser kunnen priv\xE9velden niet automatisch worden gemaskeerd. Kies \u201CElement selecteren\u201D om automatische maskering te behouden, of controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionReviewNote:"Deze site heeft enkele velden gemarkeerd voor redactie. Controleer de schermafbeelding voordat u verstuurt.",pageTooComplexViewportNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Leg het zichtbare deel vast of selecteer een specifiek element.",pageTooComplexElementNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Selecteer in plaats daarvan een specifiek element.",fullPage:"Volledige pagina",captureViewport:"Zichtbaar deel vastleggen",selectArea:"Gebied selecteren",selectElement:"Element selecteren",skipScreenshot:"Schermafbeelding overslaan",areaPickerInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen",areaPickerRedactionInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen. Gemarkeerde priv\xE9velden kunnen worden gemaskeerd als ze binnen de selectie vallen.",elementPickerInstruction:"Klik op een element om het vast te leggen",elementPickerTouchInstruction:"Tik op een element om het vast te leggen",escToCancel:"ESC om te annuleren",capturingTitle:"Vastleggen...",capturingScreenshot:"Schermafbeelding wordt gemaakt...",captureFailedTitle:"Opname mislukt",captureFailedMessage:"Kan geen schermafbeelding maken. De pagina is mogelijk te complex of de browser staat dit niet toe.",chooseAnotherMethod:"Kies een andere methode",maskFailureTitle:"Privacymaskering mislukt",maskFailureMessage:"Automatische redactie van priv\xE9velden kon niet worden toegepast. Om uw gegevens te beschermen is deze schermafbeelding verwijderd. U kunt uw feedback nog steeds zonder schermafbeelding versturen.",continueWithoutScreenshot:"Doorgaan zonder schermafbeelding",reviewScreenshotTitle:"Schermafbeelding controleren",viewportRedactionUnavailableNote:"Bij deze via de browser vastgelegde schermafbeelding konden priv\xE9velden niet automatisch worden gemaskeerd. Controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionCountNote:e=>e===1?"1 priv\xE9-item is gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.":`${e} priv\xE9-items zijn gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.`,redactionLimitationsNote:"BugDrop heeft alleen de gemeten gemarkeerde vakken afgedekt. Het inspecteert geen pixels binnen ingesloten of gerenderde inhoud zoals iframes, canvas, afbeeldingen, SVG\u2019s, video\u2019s, CSS-achtergronden of aangepaste elementen. Controleer of het zwarte vak het gevoelige gebied volledig bedekt voordat u verstuurt, of maak de afbeelding opnieuw nadat u een groter element hebt gemarkeerd.",annotationInstruction:"Controleer of er geen gevoelige informatie zichtbaar is voordat u verstuurt. Dek gevoelige gebieden af voordat u indient. Redacties worden permanent in de ge\xFCploade afbeelding verwerkt.",selectedElementNote:e=>`Meer omringende context nodig? Pas ${e} aan op de BugDrop-scripttag.`,toolDraw:"Tekenen",toolArrow:"Pijl",toolRectangle:"Rechthoek",toolRedact:"Redigeren",undo:"Ongedaan maken",retake:"Opnieuw maken",submitFeedback:"Feedback versturen",captureTimeout:"Het maken van de schermafbeelding duurde te lang \u2014 de pagina is mogelijk te complex"};function tn(e){let t=e%10,n=e%100;return t>=2&&t<=4&&(n<12||n>14)}var ir={triggerLabel:"Opinia",triggerAriaLabel:"Zg\u0142o\u015B b\u0142\u0105d lub wy\u015Blij opini\u0119",dismissButtonAriaLabel:"Ukryj przycisk opinii",pullTabAriaLabel:"Poka\u017C przycisk opinii",dragHandleTitle:"Przeci\u0105gnij przycisk opinii",installRequiredTitle:"Wymagana instalacja",connectionErrorTitle:"B\u0142\u0105d po\u0142\u0105czenia",installRequiredMessage:"BugDrop wymaga instalacji aplikacji GitHub, aby tworzy\u0107 zg\u0142oszenia.",apiUnreachableMessage:"Nie mo\u017Cna po\u0142\u0105czy\u0107 si\u0119 z API BugDrop. Sprawd\u017A po\u0142\u0105czenie sieciowe lub adres URL w tagu skryptu.",installApp:"Zainstaluj aplikacj\u0119",welcomeTitle:"Podziel si\u0119 opini\u0105",welcomeHeadline:"Pom\xF3\u017C nam si\u0119 rozwija\u0107, dziel\u0105c si\u0119 swoimi uwagami",welcomeBodyLine1:"Zg\u0142aszaj b\u0142\u0119dy, proponuj funkcje lub zostaw opini\u0119.",welcomeBodyLine2:"Opcjonalnie mo\u017Cesz do\u0142\u0105czy\u0107 zrzuty ekranu z adnotacjami.",getStarted:"Rozpocznij",feedbackFormTitle:"Wy\u015Blij opini\u0119",categoryLabel:"Kategoria",categoryBug:"B\u0142\u0105d",categoryFeature:"Propozycja",categoryQuestion:"Pytanie",nameLabel:"Imi\u0119 i nazwisko",namePlaceholder:"Twoje imi\u0119 i nazwisko",emailLabel:"E-mail",emailPlaceholder:"twoj@email.com",titleLabel:"Tytu\u0142",titlePlaceholder:"Kr\xF3tki opis problemu lub sugestii",descriptionLabel:"Opis",descriptionPlaceholder:"Podaj dodatkowe szczeg\xF3\u0142y, kroki do odtworzenia lub kontekst...",screenshotAutoNote:"Ta strona automatycznie do\u0142\u0105czy zrzut ca\u0142ej strony podczas wysy\u0142ania, bez pokazywania podgl\u0105du. Przed wys\u0142aniem sprawd\u017A, czy strona nie zawiera poufnych informacji.",screenshotAutoRedactionNote:"Niekt\xF3re pola oznaczone przez t\u0119 stron\u0119 jako prywatne mog\u0105 zosta\u0107 zamaskowane na obs\u0142ugiwanych stronach, ale nieoznaczone poufne informacje nadal mog\u0105 zosta\u0107 do\u0142\u0105czone.",screenshotRequiredNote:"\u{1F4F8} Zrzut ekranu jest wymagany przed wys\u0142aniem.",includeScreenshotLabel:"\u{1F4F8} Do\u0142\u0105cz zrzut ekranu",sendConsoleLogsLabel:"Wy\u015Blij logi konsoli",uploadsAriaLabel:"Za\u0142\u0105czniki",uploadFilesAriaLabel:"Prze\u015Blij pliki",uploadButton:"Prze\u015Blij",uploadTooMany:e=>`Mo\u017Cna przes\u0142a\u0107 maksymalnie ${e} ${tn(e)?"pliki":"plik\xF3w"}. Usu\u0144 plik, aby doda\u0107 kolejny.`,uploadUnsupportedType:"Ten typ pliku nie jest obs\u0142ugiwany. Prze\u015Blij obraz, plik PDF lub kr\xF3tki film.",uploadTooLarge:e=>`Plik jest za du\u017Cy. Prze\u015Blij pliki o rozmiarze do ${e}.`,uploadReadError:"Nie uda\u0142o si\u0119 odczyta\u0107 pliku. Spr\xF3buj z innym.",removeAttachmentAriaLabel:e=>`Usu\u0144 ${e}`,cancel:"Anuluj",continueButton:"Dalej",submit:"Wy\u015Blij",submittingTitle:"Wysy\u0142anie...",creatingIssue:"Tworzenie zg\u0142oszenia...",rateLimited:e=>`Zbyt wiele zg\u0142osze\u0144. Spr\xF3buj ponownie za ${e} ${e===1?"minut\u0119":tn(e)?"minuty":"minut"}.`,submitFailedFallback:"Nie uda\u0142o si\u0119 wys\u0142a\u0107",networkError:"B\u0142\u0105d sieci. Sprawd\u017A po\u0142\u0105czenie z internetem.",submissionFailedTitle:"Wysy\u0142anie nie powiod\u0142o si\u0119",tryAgain:"Spr\xF3buj ponownie",successTitle:"Opinia wys\u0142ana!",issueCreated:e=>`Utworzono zg\u0142oszenie ${e}.`,feedbackSubmittedMessage:"Twoja opinia zosta\u0142a pomy\u015Blnie wys\u0142ana.",viewOnGitHub:"Zobacz na GitHubie",done:"Gotowe",captureScreenshotTitle:"Zr\xF3b zrzut ekranu",chooseWhatToCapture:"Wybierz, co przechwyci\u0107:",viewportRedactionWarning:"Przechwytywanie widocznego obszaru przez przegl\u0105dark\u0119 nie pozwala automatycznie zamaskowa\u0107 p\xF3l prywatnych. Wybierz \u201EZaznacz element\u201D, aby zachowa\u0107 automatyczne maskowanie, albo sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionReviewNote:"Ta strona oznaczy\u0142a niekt\xF3re pola do zamazania. Sprawd\u017A zrzut ekranu przed wys\u0142aniem.",pageTooComplexViewportNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Przechwy\u0107 widoczny obszar albo zaznacz konkretny element.",pageTooComplexElementNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Zamiast tego zaznacz konkretny element.",fullPage:"Ca\u0142a strona",captureViewport:"Przechwy\u0107 widoczny obszar",selectArea:"Zaznacz obszar",selectElement:"Zaznacz element",skipScreenshot:"Pomi\u0144 zrzut ekranu",areaPickerInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia",areaPickerRedactionInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia. Pola oznaczone jako prywatne mog\u0105 zosta\u0107 zamaskowane, je\u015Bli znajd\u0105 si\u0119 w zaznaczeniu.",elementPickerInstruction:"Kliknij dowolny element, aby go przechwyci\u0107",elementPickerTouchInstruction:"Dotknij dowolny element, aby go przechwyci\u0107",escToCancel:"ESC, aby anulowa\u0107",capturingTitle:"Przechwytywanie...",capturingScreenshot:"Trwa przechwytywanie zrzutu ekranu...",captureFailedTitle:"Przechwytywanie nie powiod\u0142o si\u0119",captureFailedMessage:"Nie uda\u0142o si\u0119 przechwyci\u0107 zrzutu ekranu. Strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona lub przegl\u0105darka na to nie pozwala.",chooseAnotherMethod:"Wybierz inn\u0105 metod\u0119",maskFailureTitle:"Maskowanie prywatno\u015Bci nie powiod\u0142o si\u0119",maskFailureMessage:"Nie uda\u0142o si\u0119 automatycznie zamaza\u0107 p\xF3l prywatnych. Aby chroni\u0107 Twoje dane, ten zrzut ekranu zosta\u0142 odrzucony. Nadal mo\u017Cesz wys\u0142a\u0107 opini\u0119 bez zrzutu ekranu.",continueWithoutScreenshot:"Kontynuuj bez zrzutu ekranu",reviewScreenshotTitle:"Sprawd\u017A zrzut ekranu",viewportRedactionUnavailableNote:"Na tym zrzucie przechwyconym przez przegl\u0105dark\u0119 nie uda\u0142o si\u0119 automatycznie zamaskowa\u0107 p\xF3l prywatnych. Sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionCountNote:e=>`${e} ${e===1?"prywatny element oznaczono":tn(e)?"prywatne elementy oznaczono":"prywatnych element\xF3w oznaczono"} do zamazania na tym zrzucie ekranu. Sprawd\u017A przed wys\u0142aniem.`,redactionLimitationsNote:"BugDrop zakrywa tylko zmierzone, oznaczone obszary. Nie analizuje pikseli wewn\u0105trz osadzonej lub renderowanej zawarto\u015Bci, takiej jak elementy iframe, canvas, obrazy, pliki SVG, filmy, t\u0142a CSS czy niestandardowe kontrolki. Przed wys\u0142aniem upewnij si\u0119, \u017Ce czarny prostok\u0105t w pe\u0142ni zakrywa poufny obszar, albo pon\xF3w zrzut po oznaczeniu wi\u0119kszego elementu.",annotationInstruction:"Przed wys\u0142aniem sprawd\u017A, czy nie wida\u0107 poufnych informacji. Zakryj poufne obszary przed przes\u0142aniem. Zamazania s\u0105 trwale zapisywane w przesy\u0142anym obrazie.",selectedElementNote:e=>`Potrzebujesz wi\u0119cej otaczaj\u0105cego kontekstu? Dostosuj ${e} w tagu skryptu BugDrop.`,toolDraw:"Rysuj",toolArrow:"Strza\u0142ka",toolRectangle:"Prostok\u0105t",toolRedact:"Zama\u017C",undo:"Cofnij",retake:"Pon\xF3w zrzut",submitFeedback:"Wy\u015Blij opini\u0119",captureTimeout:"Up\u0142yn\u0105\u0142 limit czasu przechwytywania zrzutu ekranu \u2014 strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona"};var ar=/[;{}<>]|\/\*|\*\/|@import|url\s*\(|<\/style/i,Ta=/^-?[_a-zA-Z][_a-zA-Z0-9-]*$/,La=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,Fa=/^(?:rgb|rgba|hsl|hsla)\(\s*[-+.\d%]+\s*(?:,\s*[-+.\d%]+\s*){2,3}\)$/i;function W(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function je(e){let t=e?.trim();if(!t||t==="none")return t;try{let n=new URL(t,window.location.href);if(n.protocol==="https:"||n.protocol==="http:")return t}catch{return}}function H(e){let t=e?.trim();if(!(!t||ar.test(t))&&(La.test(t)||Fa.test(t)||Ta.test(t)||typeof CSS<"u"&&CSS.supports?.("color",t)))return t}function Ae(e){let t=e?.trim();if(t){if(t==="inherit")return t;if(!ar.test(t)&&/^[\w\s"',.-]+$/.test(t))return t}}function nn(e){let t=e?.trim();if(!t||!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(t))return;let n=Number(t);return Number.isFinite(n)?n:void 0}function Q(e){let n=e?.trim()?.match(/^((?:0|[1-9]\d*)(?:\.\d+)?)(?:px)?$/);if(!n)return;let r=Number(n[1]);return Number.isFinite(r)?r:void 0}function sr(e){let t=e?.trim();if(!t||!/^[1-9]\d*$/.test(t))return;let n=Number(t);return Number.isSafeInteger(n)?n:void 0}function pt(e){if(e==="none"||e==="soft"||e==="hard")return e}var lr={en,de:rr,nl:or,pl:ir};function x(e){return W(e)}function cr(e){if(!e)return"en";let t=e.toLowerCase().split(/[-_]/)[0];return Object.prototype.hasOwnProperty.call(lr,t)?t:(console.warn(`[BugDrop] Unsupported data-locale "${e}"; falling back to English.`),"en")}var dr=en;function ur(e){dr=lr[e]}function p(){return dr}var Aa=15e3;function Ge(e,t){let n,r=new Promise((o,i)=>{n=setTimeout(()=>{try{t?.()}catch{}i(new Error(p().captureTimeout))},Aa)});return Promise.race([e,r]).finally(()=>clearTimeout(n))}var rn="#bugdrop-host, [data-bugdrop-owned]";function ne(e){if(e instanceof ShadowRoot)return ne(e.host);if(!(e instanceof Element))return!1;if(e.matches(rn)||e.closest(rn))return!0;let t=e.getRootNode();return t instanceof ShadowRoot&&ne(t.host)}async function pr(e){let n=Array.from(document.querySelectorAll(rn)).map(r=>({root:r,value:r.style.getPropertyValue("visibility"),priority:r.style.getPropertyPriority("visibility")}));for(let{root:r}of n)r.style.setProperty("visibility","hidden","important");try{return await e()}finally{for(let{root:r,value:o,priority:i}of n)o?r.style.setProperty("visibility",o,i):r.style.removeProperty("visibility")}}var Pe=class extends Error{constructor(t,n){super(t,n),this.name="MaskApplicationError"}},Pa="[data-bugdrop-mask], [data-bugdrop-redact], [data-bd-redact], [data-bugdrop-redacted]",Ra='input[type="password"], input[autocomplete*="cc-number"], input[autocomplete*="cc-csc"], input[autocomplete*="cc-exp"]',mr="iframe, canvas, img, svg, video",Ma=new Set(["CANVAS","IMG","SVG"]),Da=new Set(["VIDEO"]);function mt(e){return e.matches(Pa)?"developer-marked":e.matches(Ra)?"sensitive-input":null}function bt(e,t){let n=e.getBoundingClientRect();return n.width===0||n.height===0?null:{element:e,rect:{x:n.left+window.scrollX,y:n.top+window.scrollY,w:n.width,h:n.height},reason:t,strategy:"canvas-mask"}}function ft(e){let t=[],n=[];if(ne(e))return{targets:t,unsupportedSurfaces:n,redactionCount:0};let r=mt(e);if(r){let o=bt(e,r);return o&&(t.push(o),cn(e,n)),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}return sn(e,t,n),ln(e,t,n),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}function br(e=document.body,t){let n=ft(e).targets.map(r=>r.rect);return t?n.filter(r=>on(r,t)).length:n.length}function fr(e,t){let n=t?e.targets.filter(o=>on(o.rect,t)):e.targets,r=t?e.unsupportedSurfaces.filter(o=>on(o.rect,t)):e.unsupportedSurfaces;return{count:n.length,hasLimitations:r.length>0}}function on(e,t){return e.x<t.x+t.width&&e.x+e.w>t.x&&e.y<t.y+t.height&&e.y+e.h>t.y}function sn(e,t,n){for(let r of Array.from(e.children)){if(ne(r))continue;let o=mt(r);if(o){let i=bt(r,o);i&&(t.push(i),cn(r,n));continue}sn(r,t,n),ln(r,t,n)}}function ln(e,t,n){let r=e.shadowRoot;if(r)for(let o of Array.from(r.children)){let i=mt(o);if(i){let a=bt(o,i);a&&(t.push(a),cn(o,n));continue}sn(o,t,n),ln(o,t,n)}}function cn(e,t){an(e,t);for(let n of Array.from(e.querySelectorAll(mr)))an(n,t);gr(e,t)}function an(e,t){let n=Ia(e);if(!n)return;let r=bt(e,mt(e)??"developer-marked");r&&t.push({tagName:e.tagName,reason:n,rect:r.rect})}function Ia(e){let t=e.tagName.toUpperCase();return t==="IFRAME"?"embedded-document":Ma.has(t)?"pixel-content":Da.has(t)?"media-content":null}function gr(e,t){let n=e.shadowRoot;if(n)for(let r of Array.from(n.querySelectorAll(mr)))an(r,t);for(let r of Array.from(e.children))gr(r,t)}function za(e,t,n,r,o){let i=(e.x-n.x)*t,a=(e.y-n.y)*t,s=e.w*t,l=e.h*t,c=Math.max(0,Math.floor(i)-1),d=Math.max(0,Math.floor(a)-1),u=Math.min(r,Math.ceil(i+s)+1),g=Math.min(o,Math.ceil(a+l)+1);return{x:c,y:d,w:u-c,h:g-d}}async function dn(e,t,n,r={x:0,y:0}){if(t.length===0)return e;let o=await $a(e),i=document.createElement("canvas");i.width=o.naturalWidth||o.width,i.height=o.naturalHeight||o.height;let a=i.getContext("2d");if(!a)throw new Pe("Failed to get canvas context for privacy masking");a.drawImage(o,0,0),a.fillStyle="#000";for(let s of t){let l=za(s,n,r,i.width,i.height);l.w>0&&l.h>0&&a.fillRect(l.x,l.y,l.w,l.h)}return i.toDataURL("image/png")}function $a(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Pe("Failed to load image for privacy masking")),r.src=e})}var Xe="#14b8a6";function fe(e){return e||Xe}function gt(e){return`color-mix(in srgb, ${e} 85%, black)`}function hr(e){return e??0}function pn(){return pr(Oa)}function Oa(){if(window.__bugdropMockViewportCapture)return window.__bugdropMockViewportCapture();if(!navigator.mediaDevices?.getDisplayMedia)return Promise.reject(new Error("Screen Capture API is not available"));let e={video:{displaySurface:"browser"},audio:!1,preferCurrentTab:!0},t=new AbortController,n=navigator.mediaDevices.getDisplayMedia(e).then(r=>Na(r,t.signal));return Ge(n,()=>t.abort())}async function Na(e,t){let n=document.createElement("video");n.muted=!0,n.playsInline=!0;let r=_a(e,n,t);try{Ba(e),un(t),await Ha(n,e,t,r),un(t);let o=n.videoWidth||window.innerWidth,i=n.videoHeight||window.innerHeight;if(!o||!i)throw new Error("Screen capture stream did not provide a video frame");let a=document.createElement("canvas");a.width=o,a.height=i;let s=a.getContext("2d");if(!s)throw new Error("Failed to get canvas context");return s.drawImage(n,0,0,o,i),a.toDataURL("image/png")}finally{r.cleanup()}}function Ba(e){let[t]=e.getVideoTracks(),n=t?.getSettings().displaySurface;if(n&&n!=="browser")throw new Error("Please choose the current browser tab for viewport capture")}function _a(e,t,n){let r=!1,o=!1,i=[],a=()=>{if(!r){r=!0;for(let l of i.splice(0))l();for(let l of e.getTracks())l.stop();o&&(t.srcObject=null)}},s=()=>a();return n.addEventListener("abort",s,{once:!0}),i.push(()=>n.removeEventListener("abort",s)),n.aborted&&a(),{attachStream:()=>{r||(t.srcObject=e,o=!0)},cleanup:a}}async function Ha(e,t,n,r){r.attachStream(),un(n);let o;try{o=e.play()}catch{o=Promise.resolve()}await Va(o.then(()=>{},()=>{}),n),!(typeof e.requestVideoFrameCallback=="function"&&(await Ua(e,n),e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA))&&(e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA||await qa(e,n))}function Va(e,t){return t.aborted?Promise.reject(Ke()):new Promise((n,r)=>{let o=()=>{t.removeEventListener("abort",o),r(Ke())};t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})})}function Ua(e,t){return new Promise((n,r)=>{let o,i=setTimeout(()=>s(n),250),a=()=>s(()=>r(Ke())),s=l=>{clearTimeout(i),t.removeEventListener("abort",a),o!==void 0&&e.cancelVideoFrameCallback?.(o),o=void 0,l()};t.addEventListener("abort",a,{once:!0}),o=e.requestVideoFrameCallback?.(()=>s(n)),t.aborted&&a()})}function qa(e,t){return new Promise((n,r)=>{let o=setTimeout(()=>l(n),250),i=()=>l(n),a=()=>l(()=>r(new Error("Failed to load screen capture stream"))),s=()=>l(()=>r(Ke())),l=c=>{clearTimeout(o),e.removeEventListener("loadeddata",i),e.removeEventListener("canplay",i),e.removeEventListener("error",a),t.removeEventListener("abort",s),c()};e.addEventListener("loadeddata",i),e.addEventListener("canplay",i),e.addEventListener("error",a),t.addEventListener("abort",s,{once:!0}),t.aborted&&s()})}function un(e){if(e.aborted)throw Ke()}function Ke(){return new DOMException("Viewport capture aborted","AbortError")}var yr=3e3,wr="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",Wa=1e4,ja=yr;function Re(){return document.body.querySelectorAll("*").length}function re(){return Re()>=Ga()}function Ga(e=navigator.userAgent){return Xa(e)?ja:Wa}function Xa(e=navigator.userAgent){return/Safari\//.test(e)&&!/(Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|Opera)\//.test(e)}function vr(e,t){if(e&&Re()>yr)return 1;let n=t??2;return Math.max(window.devicePixelRatio||1,n)}function xr(){let e=window.isSecureContext||location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1",t=typeof window.__bugdropMockViewportCapture=="function"||typeof navigator.mediaDevices?.getDisplayMedia=="function";return e&&t}async function Er(e,t,n={}){let r=e||document.body,o=!e,i=ht(e||document.body),a=n.highlightElement&&r.contains(n.highlightElement)?ht(n.highlightElement):null,s=n.pixelRatio??vr(o,t),l=e?window.getComputedStyle(e):null,c=Cr(),d={cacheBust:!1,imagePlaceholder:wr,pixelRatio:s,filter:Sr,...l&&(l.marginLeft!=="0px"||l.marginRight!=="0px")?{style:{margin:`${l.marginTop} 0px ${l.marginBottom} 0px`}}:{}},u=ft(r),g=e?{x:i.x,y:i.y}:{x:0,y:0},m=c(r,d),b=await Ge(m),h=await dn(b,u.targets.map(k=>k.rect),s,g);return yt(a?await Tr(h,a,i,n.highlightStyle):h,u)}async function kr(e,t,n={}){let r=n.pixelRatio??vr(!0,t),o={x:e.x,y:e.y,w:e.width,h:e.height},i=n.highlightElement&&document.body.contains(n.highlightElement)?ht(n.highlightElement):null,a=Cr(),s={cacheBust:!1,imagePlaceholder:wr,pixelRatio:r,width:e.width,height:e.height,style:{transform:`translate(${-e.x}px, ${-e.y}px)`,transformOrigin:"top left",width:`${document.documentElement.scrollWidth}px`,height:`${document.documentElement.scrollHeight}px`},filter:Sr},l=ft(document.body),c=await Ge(a(document.body,s)),d=await dn(c,l.targets.map(u=>u.rect),r,{x:e.x,y:e.y});return yt(i?await Tr(d,i,o,n.highlightStyle):d,l,e)}function Me(e,t){return br(e??document.body,t)}function Sr(e){return!(ne(e)||Ka(e)&&Ya(e))}function Ka(e){return e.tagName?.toUpperCase()==="IMG"}function Ya(e){let t=(e.ownerDocument.defaultView??window).getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden")return!0;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0}function Cr(){return nr}function yt(e,t,n){return{dataUrl:e,redaction:fr(t,n)}}async function Tr(e,t,n,r={}){if(t.w<=0||t.h<=0)return e;let o=await es(e),i=o.naturalWidth||o.width,a=o.naturalHeight||o.height,s=i/Math.max(1,n.w),l=a/Math.max(1,n.h),c=Math.max(1,(s+l)/2),d=Ja(r.borderWidth,c),g=2*c+d/2,m=(t.x-n.x)*s-g,b=(t.y-n.y)*l-g,h=t.w*s+g*2,k=t.h*l+g*2,C=Math.max(0,Math.ceil(-m)),F=Math.max(0,Math.ceil(-b)),P=Math.max(0,Math.ceil(m+h-i)),L=Math.max(0,Math.ceil(b+k-a)),D=document.createElement("canvas");D.width=i+C+P,D.height=a+F+L;let v=D.getContext("2d");if(!v)throw new Error("Failed to get canvas context for selected element highlight");v.drawImage(o,C,F);let A=Math.round(m+C),z=Math.round(b+F),I=Math.round(h),$=Math.round(k),T=Qa(r.radius,c),B=fe(r.accentColor);return Za(v,A,z,I,$,T),v.lineWidth=d,v.strokeStyle=B,v.stroke(),D.toDataURL("image/png")}function Za(e,t,n,r,o,i){let a=Math.max(0,Math.min(i,r/2,o/2));e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+o-a),e.quadraticCurveTo(t+r,n+o,t+r-a,n+o),e.lineTo(t+a,n+o),e.quadraticCurveTo(t,n+o,t,n+o-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath()}function Ja(e,t){let n=Number.parseFloat(e||"3");return Math.max(1,Math.round((Number.isFinite(n)?n:3)*t))}function Qa(e,t){let n=Number.parseFloat(e||"6");return Math.max(0,Math.round((Number.isFinite(n)?n:6)*t))}function ht(e){let t=e.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function es(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Error("Failed to load image for selected element highlight")),r.src=e})}function wt(e){let t=e?.theme==="dark",n=Q(e?.radius),r=Q(e?.borderWidth),o=Ae(e?.font);return{accent:fe(H(e?.accentColor)),fontFamily:e?.font==="inherit"?"system-ui, sans-serif":o||"'Space Grotesk', system-ui, sans-serif",radius:n!==void 0?`${n}px`:"6px",bw:r!==void 0?String(r):"3",tooltipBg:H(e?.bgColor)||(t?"#0f172a":"#1a1a1a"),tooltipText:H(e?.textColor)||"#f1f5f9",tooltipBorder:H(e?.borderColor)||(t?"#334155":"#333")}}var ts=new Set(["alert","alertdialog","application","article","banner","button","cell","checkbox","columnheader","combobox","complementary","contentinfo","definition","dialog","directory","document","feed","figure","form","grid","gridcell","group","heading","img","link","list","listbox","listitem","log","main","marquee","math","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","meter","navigation","none","note","option","presentation","progressbar","radio","radiogroup","region","row","rowgroup","rowheader","scrollbar","search","searchbox","separator","slider","spinbutton","status","switch","tab","table","tablist","tabpanel","term","textbox","timer","toolbar","tooltip","tree","treegrid","treeitem"]),ns=new Set(["button","checkbox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","searchbox","switch","tab","textbox"]),rs=new Set(["button","input","select","textarea"]);function Lr(e){return os(e)??e}function os(e){let{body:t,documentElement:n}=e.ownerDocument,r=e;for(;r&&r!==t&&r!==n;){if(is(r))return r;r=r.parentElement}return null}function is(e){if(e.getAttribute("aria-disabled")==="true")return!1;let t=e.tagName.toLowerCase();if(t==="a")return e.hasAttribute("href");if(rs.has(t))return!("disabled"in e&&e.disabled);if(t==="summary")return!0;let n=as(e);if(n&&ns.has(n))return!0;let r=e.getAttribute("tabindex");return r!==null&&Number.parseInt(r,10)>=0}function as(e){let t=e.getAttribute("role");if(!t)return null;for(let n of t.split(/\s+/)){let r=n.toLowerCase();if(ts.has(r))return r}return null}var ss=new Set(["bugdrop-element-picker-overlay","bugdrop-element-picker-highlight","bugdrop-element-picker-tooltip","bugdrop-element-picker-cancel"]);function ls(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}function cs(){let e=document.createElement("div");return e.id="bugdrop-element-picker-overlay",e.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    cursor: crosshair;
    touch-action: none;
    user-select: none;
    background: transparent;
  `,e}function ds(e){let t=document.createElement("div");return t.id="bugdrop-element-picker-highlight",t.style.cssText=`
    position: fixed;
    box-sizing: content-box;
    pointer-events: none;
    border: ${e.bw}px solid ${e.accent};
    background: transparent;
    z-index: 2147483645;
    transition: all 0.05s ease-out;
    box-shadow: none;
    border-radius: ${e.radius};
  `,t}function us(e,t){let n=document.createElement("div");if(n.id="bugdrop-element-picker-tooltip",n.style.cssText=`
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
  `,!t)return n.textContent=`${p().elementPickerInstruction} (${p().escToCancel})`,{tooltip:n,cancelButton:null};let r=gs(e.accent);return n.append(`${p().elementPickerTouchInstruction} (`,r,")"),{tooltip:n,cancelButton:r}}function ps(e,t){let n=t.getBoundingClientRect();e.style.top=`${n.top-2}px`,e.style.left=`${n.left-2}px`,e.style.width=`${n.width+4}px`,e.style.height=`${n.height+4}px`,e.style.display="block"}function ms(e){e.overlay.addEventListener("pointerdown",e.onPointerDown),e.overlay.addEventListener("pointermove",e.onPointerMove),e.overlay.addEventListener("pointerup",e.onPointerUp),e.overlay.addEventListener("pointercancel",e.onPointerCancel),document.addEventListener("mousemove",e.onMouseMove,!0)}function bs(e){e.overlay.removeEventListener("pointerdown",e.onPointerDown),e.overlay.removeEventListener("pointermove",e.onPointerMove),e.overlay.removeEventListener("pointerup",e.onPointerUp),e.overlay.removeEventListener("pointercancel",e.onPointerCancel),document.removeEventListener("mousemove",e.onMouseMove,!0)}function Fr(e,t){return new Promise(n=>{setTimeout(()=>{t?.aborted?n(null):fs(n,e,t)},50)})}function fs(e,t,n){let{accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:c}=wt(t),d=cs();document.body.appendChild(d);let u=ds({accent:r,bw:a,radius:i});document.body.appendChild(u);let{tooltip:g,cancelButton:m}=us({accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:c},ls());document.body.appendChild(g);let b=null,h=null,k=!1,C;function F(y){return y===d||y===u||y===g||ss.has(y.id)}function P(y,Z){let te=d.style.pointerEvents;return d.style.pointerEvents="none",(()=>{try{return document.elementsFromPoint(y,Z)}finally{d.style.pointerEvents=te}})().find($n=>!(F($n)||ne($n)))}function L(y,Z,te){let ke=P(y,Z);return ke?Lr(ke):te}function D(y){b=L(y.clientX,y.clientY,b),b&&ps(u,b)}function v(y,Z,te=!1){b=L(y,Z,b),A(b,te)}function A(y,Z=!1){k||(k=!0,q(Z),e(y))}let z=()=>A(null);function I(y){h!==null||!y.isPrimary||(y.preventDefault(),y.stopPropagation(),h=y.pointerId,d.setPointerCapture?.(y.pointerId),b=L(y.clientX,y.clientY,b))}function $(y){h!==null&&y.pointerId!==h||(y.preventDefault(),y.stopPropagation(),D(y))}function T(y){h!==null&&y.pointerId!==h||(y.preventDefault(),y.stopPropagation(),h=null,d.releasePointerCapture?.(y.pointerId),v(y.clientX,y.clientY,!0))}function B(y){y.pointerId===h&&(h=null,d.releasePointerCapture?.(y.pointerId))}function w(y){if(k){if(document.removeEventListener("click",w,!0),ne(y.target))return;y.preventDefault(),y.stopImmediatePropagation();return}if(y.preventDefault(),y.stopImmediatePropagation(),y.target instanceof Element&&y.target.id==="bugdrop-element-picker-cancel"){A(null);return}v(y.clientX,y.clientY)}function f(y){y.target instanceof Element&&y.target.id==="bugdrop-element-picker-cancel"||(y.type==="pointerdown"&&I(y),y.type==="pointermove"&&$(y),y.type==="pointerup"&&T(y),y.type==="pointercancel"&&B(y),y.preventDefault(),y.stopImmediatePropagation())}function R(y){y.key==="Escape"&&A(null)}function O(y){y.preventDefault(),y.stopPropagation(),A(null)}function q(y=!1){C!==void 0&&(window.clearTimeout(C),C=void 0),bs({overlay:d,onPointerDown:I,onPointerMove:$,onPointerUp:T,onPointerCancel:B,onMouseMove:D}),y?C=window.setTimeout(()=>{document.removeEventListener("click",w,!0),C=void 0},1e3):document.removeEventListener("click",w,!0),document.removeEventListener("keydown",R),ae(),m?.removeEventListener("click",O),n?.removeEventListener("abort",z),d.remove(),u.remove(),g.remove(),document.body.style.cursor=""}function _(){window.addEventListener("pointerdown",f,!0),window.addEventListener("pointermove",f,!0),window.addEventListener("pointerup",f,!0),window.addEventListener("pointercancel",f,!0)}function ae(){window.removeEventListener("pointerdown",f,!0),window.removeEventListener("pointermove",f,!0),window.removeEventListener("pointerup",f,!0),window.removeEventListener("pointercancel",f,!0)}document.body.style.cursor="crosshair",_(),ms({overlay:d,onPointerDown:I,onPointerMove:$,onPointerUp:T,onPointerCancel:B,onMouseMove:D}),document.addEventListener("click",w,!0),document.addEventListener("keydown",R),m?.addEventListener("click",O),n?.addEventListener("abort",z,{once:!0})}function gs(e){let t=document.createElement("button");return t.id="bugdrop-element-picker-cancel",t.type="button",t.textContent=p().cancel,t.style.cssText=`
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
  `,t}var Ar=10;function Pr(e,t,n){return new Promise(r=>{setTimeout(()=>{n?.aborted?r(null):hs(r,e,t,n)},50)})}function hs(e,t,n,r){let{accent:o,fontFamily:i,radius:a,bw:s,tooltipBg:l,tooltipText:c,tooltipBorder:d}=wt(t),u=ys();document.body.appendChild(u);let g=ws({accent:o,bw:s,radius:a});document.body.appendChild(g);let m=n?.redactionsAvailable?p().areaPickerRedactionInstruction:p().areaPickerInstruction,b=xs(),h=vs({accent:o,fontFamily:i,radius:a,bw:s,tooltipBg:l,tooltipText:c,tooltipBorder:d},m,b);document.body.appendChild(h);let k=h.querySelector("#bugdrop-area-picker-cancel"),C=0,F=0,P=!1,L=null;function D(f,R,O,q){let _=Math.min(f,O),ae=Math.min(R,q),y=Math.abs(O-f),Z=Math.abs(q-R);g.style.left=`${_}px`,g.style.top=`${ae}px`,g.style.width=`${y}px`,g.style.height=`${Z}px`,g.style.display="block";let te=_+y,ke=ae+Z;u.style.clipPath=`polygon(
      0% 0%, 0% 100%, ${_}px 100%, ${_}px ${ae}px,
      ${te}px ${ae}px, ${te}px ${ke}px,
      ${_}px ${ke}px, ${_}px 100%, 100% 100%, 100% 0%
    )`}function v(f){L!==null||!f.isPrimary||(f.preventDefault(),C=f.clientX,F=f.clientY,P=!0,L=f.pointerId,u.setPointerCapture?.(f.pointerId))}function A(f){!P||f.pointerId!==L||(f.preventDefault(),D(C,F,f.clientX,f.clientY))}function z(f){if(!P||f.pointerId!==L)return;f.preventDefault(),P=!1,L=null,u.releasePointerCapture?.(f.pointerId);let R=Math.abs(f.clientX-C),O=Math.abs(f.clientY-F);if(R<Ar||O<Ar){g.style.display="none",u.style.clipPath="";return}let q=Math.min(C,f.clientX)+window.scrollX,_=Math.min(F,f.clientY)+window.scrollY;w(),e(new DOMRect(q,_,R,O))}function I(f){f.pointerId===L&&(P=!1,L=null,g.style.display="none",u.style.clipPath="")}function $(f){f.key==="Escape"&&(w(),e(null))}function T(){w(),e(null)}let B=()=>{w(),e(null)};function w(){u.removeEventListener("pointerdown",v),document.removeEventListener("pointermove",A),document.removeEventListener("pointerup",z),document.removeEventListener("pointercancel",I),document.removeEventListener("keydown",$),k?.removeEventListener("click",T),r?.removeEventListener("abort",B),u.remove(),g.remove(),h.remove()}u.addEventListener("pointerdown",v),document.addEventListener("pointermove",A),document.addEventListener("pointerup",z),document.addEventListener("pointercancel",I),document.addEventListener("keydown",$),k?.addEventListener("click",T),r?.addEventListener("abort",B,{once:!0})}function ys(){let e=document.createElement("div");return e.id="bugdrop-area-picker-overlay",e.style.cssText=`
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
  `,e}function ws(e){let t=document.createElement("div");return t.id="bugdrop-area-picker-selection",t.style.cssText=`
    position: fixed;
    border: ${e.bw}px solid ${e.accent};
    box-shadow: 0 0 0 4px color-mix(in srgb, ${e.accent} 30%, transparent);
    border-radius: ${e.radius};
    z-index: 2147483647;
    pointer-events: none;
    display: none;
  `,t}function vs(e,t,n){let r=document.createElement("div");if(r.id="bugdrop-area-picker-tooltip",r.style.cssText=`
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
    `,r.append(t," (",o,")")}else r.textContent=`${t} (${p().escToCancel})`;return r}function xs(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}var mn="#ff0000",Es="#000000";var vt=Math.PI/7,Rr=2,Mr=4,xt=1;function Dr(e,t){let n=document.createElement("canvas"),r=n.getContext("2d"),o="draw",i=!1,a=[],s=null,l=!1,c=[],d=new Image;d.onload=()=>{n.width=d.width,n.height=d.height,n.style.maxWidth="100%",n.style.height="auto",n.style.cursor="crosshair",r.drawImage(d,0,0),u()},d.src=t,e.appendChild(n);function u(){c.push(r.getImageData(0,0,n.width,n.height))}function g(w){r.putImageData(w,0,0)}function m(){return c[c.length-1]??null}function b(w,f){return Math.hypot(f.x-w.x,f.y-w.y)}function h(){window.removeEventListener("mouseup",B),i=!1,a=[],s=null,l=!1}function k(){s&&g(s),h()}function C(w){let f=n.getBoundingClientRect(),R=d.width/f.width,O=d.height/f.height,q=(w.clientX-f.left)*R,_=(w.clientY-f.top)*O;return{x:Math.max(0,Math.min(n.width,q)),y:Math.max(0,Math.min(n.height,_))}}function F(){let w=n.getBoundingClientRect(),f=Math.max(n.width/w.width,n.height/w.height,1);return Math.round(5.5*f)}function P(w,f){let R=F();r.beginPath(),r.moveTo(w.x,w.y),r.lineTo(f.x,f.y),r.strokeStyle=mn,r.lineWidth=R,r.lineCap="round",r.lineJoin="round",r.stroke()}function L(w,f){P(w,f);let R=Math.atan2(f.y-w.y,f.x-w.x),O=F()*5;r.beginPath(),r.moveTo(f.x,f.y),r.lineTo(f.x-O*Math.cos(R-vt),f.y-O*Math.sin(R-vt)),r.lineTo(f.x-O*Math.cos(R+vt),f.y-O*Math.sin(R+vt)),r.closePath(),r.fillStyle=mn,r.fill()}function D(w,f){r.strokeStyle=mn,r.lineWidth=F(),r.lineCap="round",r.lineJoin="round",r.strokeRect(w.x,w.y,f.x-w.x,f.y-w.y)}function v(w,f){let R=Math.min(w.x,f.x),O=Math.min(w.y,f.y),q=Math.abs(f.x-w.x),_=Math.abs(f.y-w.y);return{x:R,y:O,width:q,height:_}}function A(w,f){let{x:R,y:O,width:q,height:_}=v(w,f),ae=Math.max(0,Math.floor(R)-xt),y=Math.max(0,Math.floor(O)-xt),Z=Math.min(n.width,Math.ceil(R+q)+xt),te=Math.min(n.height,Math.ceil(O+_)+xt);return{x:ae,y,width:Math.max(0,Z-ae),height:Math.max(0,te-y)}}function z(w,f){let{width:R,height:O}=A(w,f);return R>=Mr&&O>=Mr}function I(w,f){let{x:R,y:O,width:q,height:_}=A(w,f);r.fillStyle=Es,r.fillRect(R,O,q,_)}function $(w){let f=m();f&&(i=!0,a=[C(w)],s=f,l=!1,window.addEventListener("mouseup",B))}function T(w){if(!i||!s)return;let f=C(w);o==="draw"?(P(a[a.length-1],f),a.push(f),l=l||b(a[0],f)>=Rr):(g(s),o==="arrow"?L(a[0],f):o==="rect"?D(a[0],f):o==="redact"&&I(a[0],f))}function B(w){if(!i||!s){h();return}let f=C(w),R=a[0];if(!(o==="redact"?z(R,f):l||b(R,f)>=Rr)){g(s),h();return}o==="arrow"?(g(s),L(R,f)):o==="rect"?(g(s),D(R,f)):o==="redact"?(g(s),I(R,f)):o==="draw"&&!l&&P(R,f),u(),h()}return n.addEventListener("mousedown",$),n.addEventListener("mousemove",T),n.addEventListener("mouseup",B),{setTool(w){k(),o=w},undo(){if(s){k();return}if(c.length<=1)return;h(),c.pop();let w=m();w&&g(w)},getImageData(){return n.toDataURL("image/png")},destroy(){h(),n.removeEventListener("mousedown",$),n.removeEventListener("mousemove",T),n.removeEventListener("mouseup",B),n.remove()}}}function ks(){return typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function De(e,t=ks){return e==="auto"?t():e}function Et(e){return e==="light"||e==="dark"||e==="auto"}function Ye(e,t){e.classList.toggle("bd-dark",t==="dark")}function Ze(e,t,n){let r=n==="dark",o=H(t.accentColor);if(o){let d=o;e.style.setProperty("--bd-primary",d),e.style.setProperty("--bd-primary-hover",gt(d)),e.style.setProperty("--bd-border-focus",d)}let i=H(t.bgColor);i&&(e.style.setProperty("--bd-bg-primary",i),r?(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 85%, white)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 70%, white)`)):(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 93%, black)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 85%, black)`)));let a=H(t.textColor);if(a){e.style.setProperty("--bd-text-primary",a);let d=i||(r?"#0f172a":"#fafaf9");e.style.setProperty("--bd-text-secondary",`color-mix(in srgb, ${a} 65%, ${d})`),e.style.setProperty("--bd-text-muted",`color-mix(in srgb, ${a} 40%, ${d})`)}let s=Q(t.borderWidth)??null,l=H(t.borderColor)||null;if(s!==null||l!==null){let d=s!==null?`${s}px`:"1px",u=l||"var(--bd-border)";e.style.setProperty("--bd-border-width",d),l&&e.style.setProperty("--bd-border",u),e.style.setProperty("--bd-border-style",`var(--bd-border-width) solid ${u}`)}let c=pt(t.shadow)||null;if(c==="none")e.style.setProperty("--bd-shadow-sm","none"),e.style.setProperty("--bd-shadow-md","none"),e.style.setProperty("--bd-shadow-lg","none"),e.style.setProperty("--bd-shadow-glow","none");else if(c==="hard"){let d=l||(r?"#000":"#1a1a1a"),u=s!==null?"calc(var(--bd-border-width) + 2px)":"6px";e.style.setProperty("--bd-shadow-sm",`${d} 2px 2px 0 0`),e.style.setProperty("--bd-shadow-md",`${d} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-lg",`${d} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-glow","none")}}function kt(e){if(typeof window>"u"||!window.matchMedia)return typeof console<"u"&&console.warn&&console.warn('[BugDrop] window.matchMedia unavailable; data-theme="auto" will not react to OS theme changes.'),()=>{};let t=window.matchMedia("(prefers-color-scheme: dark)"),n=r=>{try{e(r.matches?"dark":"light")}catch(o){console.warn("[BugDrop] Error applying system theme change:",o)}};return t.addEventListener("change",n),()=>t.removeEventListener("change",n)}var Ie=8,Ss="(hover: none), (pointer: coarse)",Cs="(max-width: 640px)";function Ts(e,t,n){let r=je(e);return!!(r&&r!=="none"&&r!=="#"&&n!=="never"&&(t||n==="always"))}function Ir(e,t){let n=t.position==="bottom-left"?"left: 0":"right: 0",r=De(t.theme),o=t.font==="inherit",i=t.font&&t.font!=="inherit"?Ae(t.font):null,a=o||i?"":"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');",s=o?"inherit":i?`${i}, system-ui, sans-serif`:"'Space Grotesk', system-ui, sans-serif",l=Q(t.radius)??null,c=l!==null?`${l}px`:"6px",d=l!==null?`${Math.round(l*1.4)}px`:"10px",u=l!==null?`${Math.round(l*2)}px`:"14px",g=Q(t.borderWidth)??null,m=document.createElement("style");m.textContent=`
    ${a}

    :host {
      /* Typography */
      --bd-font: ${s};

      /* Radius */
      --bd-radius-sm: ${c};
      --bd-radius-md: ${d};
      --bd-radius-lg: ${u};

      /* Border */
      --bd-border-width: ${g!==null?`${g}px`:"1px"};

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
      border: ${g!==null?"var(--bd-border-style)":"none"};
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
  `,e.appendChild(m);let b=document.createElement("div");return b.className="bd-root",Ye(b,r),Ze(b,t,r),e.appendChild(b),b}function Je(e){return`<p class="bd-redaction-note" style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-warning-bg, #fff8e1); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${W(e)}</p>`}function U(e,t,n,r=!1,o=""){let i=document.createElement("div");i.className="bd-overlay";let a=["bd-modal",o].filter(Boolean).join(" "),s=r?'<div class="bd-version">BugDrop v1.56.3</div>':"";return i.innerHTML=`
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
  `,e.appendChild(i),Ls(i),i}function Ls(e){if(typeof window.matchMedia!="function"||window.matchMedia(Ss).matches)return;let t=e.querySelector(".bd-modal"),n=e.querySelector(".bd-header");if(!t||!n)return;let r=t,o=n,i=null,a=0,s=0,l=0,c=0,d=!1,u=null,g=()=>{d||(d=!0,F(),window.removeEventListener("resize",h),window.visualViewport?.removeEventListener("resize",h),u?.disconnect())};function m(v,A){let z=r.getBoundingClientRect(),I=Math.max(Ie,window.innerWidth-z.width-Ie),$=Math.max(Ie,window.innerHeight-z.height-Ie);return{left:Math.min(Math.max(v,Ie),I),top:Math.min(Math.max(A,Ie),$)}}function b(v,A){let z=m(v,A);r.style.left=`${z.left}px`,r.style.top=`${z.top}px`}function h(){if(!e.isConnected){g();return}if(!r.classList.contains("bd-modal--positioned"))return;if(window.matchMedia(Cs).matches){C();return}k();let v=r.getBoundingClientRect();b(v.left,v.top)}function k(){r.style.removeProperty("width"),r.style.removeProperty("max-width");let v=r.getBoundingClientRect(),A=Math.floor(window.innerWidth*.9);r.style.width=`${Math.min(v.width,A)}px`,r.style.maxWidth="none"}function C(){r.classList.remove("bd-modal--positioned","bd-modal--dragging"),r.style.removeProperty("left"),r.style.removeProperty("top"),r.style.removeProperty("width"),r.style.removeProperty("max-width")}function F(){i!==null&&(i=null,r.classList.remove("bd-modal--dragging"),window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",L),window.removeEventListener("pointercancel",D))}function P(v){i===v.pointerId&&b(l+v.clientX-a,c+v.clientY-s)}function L(v){i===v.pointerId&&F()}function D(v){i===v.pointerId&&F()}o.addEventListener("pointerdown",v=>{if(v.target.closest("button, a, input, textarea, select, label"))return;v.preventDefault();let A=r.getBoundingClientRect();i=v.pointerId,a=v.clientX,s=v.clientY,l=A.left,c=A.top,r.classList.add("bd-modal--positioned","bd-modal--dragging"),r.style.width=`${A.width}px`,r.style.maxWidth="none",b(l,c),o.setPointerCapture(v.pointerId),window.addEventListener("pointermove",P),window.addEventListener("pointerup",L),window.addEventListener("pointercancel",D)}),window.addEventListener("resize",h),window.visualViewport?.addEventListener("resize",h),e.parentNode&&(u=new MutationObserver(()=>{e.isConnected||g()}),u.observe(e.parentNode,{childList:!0}))}function zr(e,t,n,r,o="public"){return new Promise(i=>{let a=je(n),s=Ts(n,r,o),l=s&&a?`<a href="${W(a)}" target="_blank" rel="noopener noreferrer" class="bd-issue-link">
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
      `,!0),u=d.querySelector(".bd-close"),g=d.querySelector('[data-action="done"]'),m=()=>{d.remove(),i()};u?.addEventListener("click",m),g?.addEventListener("click",m)})}function $r(e,t,n=0,r){return new Promise(o=>{let i=[];r?.redactionUnavailable?i.push(p().viewportRedactionUnavailableNote):(n>0&&i.push(p().redactionCountNote(n)),r?.redactionLimitations&&i.push(p().redactionLimitationsNote));let a=i.length?Je(i.join(" ")):"",l=r?.selectedElementCapture?`
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
      `,!1,"bd-modal--annotator"),d=c.querySelector("#annotation-canvas"),u=Dr(d,t),g=c.querySelectorAll("[data-tool]");g.forEach(C=>{C.addEventListener("click",F=>{let P=F.currentTarget,L=P.dataset.tool;L&&(g.forEach(D=>D.classList.remove("active")),P.classList.add("active"),u.setTool(L))})}),c.querySelector('[data-action="undo"]')?.addEventListener("click",()=>u.undo());let b=c.querySelector(".bd-close"),h=c.querySelector('[data-action="retake"]'),k=c.querySelector('[data-action="done"]');b?.addEventListener("click",()=>{u.destroy(),c.remove(),o("cancel")}),h?.addEventListener("click",()=>{u.destroy(),c.remove(),o("retake")}),k?.addEventListener("click",()=>{let C=u.getImageData();u.destroy(),c.remove(),o(C)})})}async function St(e,t,n,r){return Ct(e,()=>Er(t,n,r?.captureOptions),r)}async function Or(e,t,n,r){return Ct(e,()=>kr(t,n,r?.captureOptions),r)}async function Ct(e,t,n){let r=n?.showLoading===!1?null:U(e,p().capturingTitle,`
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
              <div class="bd-spinner bd-spinner--lg"></div>
              <p class="bd-loading-text" style="margin-top: 12px;">${x(p().capturingScreenshot)}</p>
            </div>
          `);try{if(r&&await As(),n?.signal?.aborted)return r?.remove(),{kind:"cancelled"};let o=typeof t=="function"?t():t,i=await Fs(o,n?.signal);return r?.remove(),i===null?{kind:"cancelled"}:Rs(i)}catch(o){if(r?.remove(),n?.signal?.aborted)return{kind:"cancelled"};console.warn("[BugDrop] Screenshot capture failed:",o);let i=n?.allowSkip!==!1,a=n?.allowChooseAgain!==!1;return o instanceof Pe?Ps(e):new Promise(s=>{let l=U(e,p().captureFailedTitle,`
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
        `,!0),c=l.querySelector(".bd-close"),d=l.querySelector('[data-action="skip"]'),u=l.querySelector('[data-action="choose-again"]');c?.addEventListener("click",()=>{l.remove(),s({kind:"cancelled"})}),d?.addEventListener("click",()=>{l.remove(),s({kind:"skipped"})}),u?.addEventListener("click",()=>{l.remove(),s({kind:"choose-again"})})})}}function Fs(e,t){return t?t.aborted?Promise.resolve(null):new Promise((n,r)=>{let o=()=>n(null);t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})}):e}function As(){return typeof requestAnimationFrame!="function"?new Promise(e=>setTimeout(e,0)):new Promise(e=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>e())})})}function Ps(e){return new Promise(t=>{let n=U(e,p().maskFailureTitle,`
        <div class="bd-error-message">
          <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
          <span class="bd-error-message__text">${x(p().maskFailureMessage)}</span>
        </div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-primary" data-action="skip">${x(p().continueWithoutScreenshot)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="skip"]');r?.addEventListener("click",()=>{n.remove(),t({kind:"cancelled"})}),o?.addEventListener("click",()=>{n.remove(),t({kind:"skipped"})})})}function Rs(e){return typeof e=="string"?{kind:"ok",dataUrl:e}:{kind:"ok",dataUrl:e.dataUrl,redaction:e.redaction}}function _r(e,t){let n=e.getBoundingClientRect();if(!Br(n))return e;let o=Math.max(1,window.innerWidth*window.innerHeight)*hr(t.maxViewportAreaMultiplier),i=e,a=e.parentElement;for(;a&&a!==document.body&&a!==document.documentElement;){let s=a.getBoundingClientRect(),l=s.width*s.height;Br(s)&&l<=o&&Ms(s,n)&&Ds(s,n)&&(i=a),a=a.parentElement}return i}function Br(e){return e.width>0&&e.height>0}function Ms(e,t){return e.left<=t.left&&e.top<=t.top&&e.right>=t.right&&e.bottom>=t.bottom}function Ds(e,t){let n=e.width>=t.width+160,r=e.height>=t.height+160,o=t.width*t.height,i=e.width*e.height;return n||r||i>=o*4}function Vr(e){let t=[],n=e.ownerDocument.body,r=e;if(r===n)return Tt(r);for(;r&&r!==n;){let o=Tt(r);if(r.id){o=`#${Qe(r.id)}`,t.unshift(o);break}let i=qr(r).slice(0,2);i.length&&(o+=`.${i.map(Qe).join(".")}`),t.unshift(o),r=r.parentElement}return t.join(" > ")}function Ur(e){let t=Is(e),n=t.map(zs),r=t.map(bn);return Os(n,r,e)}function Is(e){let t=[],n=e;for(;n;)t.unshift(n),n=n.parentElement;return t}function zs(e){let t=$s(e);return t.length<=128?t:bn(e)}function $s(e){let t=Tt(e);e.id&&(t+=`#${Qe(e.id)}`);let n=qr(e).slice(0,3);return n.length>0&&(t+=`.${n.map(Qe).join(".")}`),e.id||(t+=Wr(e)),t}function bn(e){return`${Tt(e)}${Wr(e)}`}function qr(e){return Array.from(e.classList).filter(Boolean)}function Tt(e){return Qe(e.localName||e.tagName.toLowerCase())}function Os(e,t,n){let r=e.join(" > ");return r.length<=1024?r:Hr(e,n)||Hr(t,n)||bn(n)}function Hr(e,t){for(let n=e.length-1;n>=0;n-=1){let r=e.slice(n).join(" > ");if(!(r.length>1024)&&Ns(r,t))return r}return null}function Ns(e,t){try{return t.ownerDocument.querySelector(e)===t}catch{return!1}}function Wr(e){let t=Bs(e);return t>1||_s(e)?`:nth-of-type(${t})`:""}function Bs(e){let t=1,n=e.previousElementSibling;for(;n;)n.tagName===e.tagName&&(t+=1),n=n.previousElementSibling;return t}function _s(e){let t=e.previousElementSibling;for(;t;){if(t.tagName===e.tagName)return!0;t=t.previousElementSibling}for(t=e.nextElementSibling;t;){if(t.tagName===e.tagName)return!0;t=t.nextElementSibling}return!1}function Qe(e){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):Hs(e)}function Hs(e){let t="";for(let n=0;n<e.length;n+=1){let r=e.charAt(n),o=e.charCodeAt(n),i=n===0,a=n===1,s=e.charCodeAt(0);if(o===0){t+="\uFFFD";continue}if(o>=1&&o<=31||o===127||i&&o>=48&&o<=57||a&&o>=48&&o<=57&&s===45){t+=`\\${o.toString(16)} `;continue}if(i&&o===45&&e.length===1){t+="\\-";continue}if(o>=128||o===45||o===95||o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122){t+=r;continue}t+=`\\${r}`}return t}function jr(e,t){let n=re(),r=n&&xr(),o=t?.allowSkip!==!1,i="";return r?i=Je(p().viewportRedactionWarning):Me()>0&&(i=Je(p().redactionReviewNote)),new Promise(a=>{let s=n?`<p style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-bg-secondary, #f5f5f5); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${r?x(p().pageTooComplexViewportNote):x(p().pageTooComplexElementNote)}</p>`:"",l="";n?r&&(l=`<button class="bd-btn bd-btn-primary" data-action="viewport">${x(p().captureViewport)}</button>`):l=`<button class="bd-btn bd-btn-primary" data-action="capture">${x(p().fullPage)}</button>`;let c=U(e,p().captureScreenshotTitle,`
        <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${x(p().chooseWhatToCapture)}</p>
        ${s}
        ${i}
        <div class="bd-actions bd-screenshot-actions">
          ${l}
          ${n?"":`<button class="bd-btn bd-btn-secondary" data-action="area">${x(p().selectArea)}</button>`}
          <button class="bd-btn bd-btn-secondary" data-action="element">${x(p().selectElement)}</button>
          ${o?`<button class="bd-btn bd-btn-quiet" data-action="skip">${x(p().skipScreenshot)}</button>`:""}
        </div>
      `),d=c.querySelector(".bd-close"),u=c.querySelector('[data-action="skip"]'),g=c.querySelector('[data-action="element"]'),m=c.querySelector('[data-action="area"]'),b=c.querySelector('[data-action="capture"]'),h=c.querySelector('[data-action="viewport"]');d?.addEventListener("click",()=>{c.remove(),a({kind:"cancel"})}),u?.addEventListener("click",()=>{c.remove(),a({kind:"skip"})}),g?.addEventListener("click",()=>{c.remove(),a({kind:"element"})}),m?.addEventListener("click",()=>{c.remove(),a({kind:"area"})}),b?.addEventListener("click",()=>{c.remove(),a({kind:"capture"})}),h?.addEventListener("click",()=>{c.remove();let k=pn();k.catch(()=>{}),a({kind:"viewport",capture:k})})})}function Gr(e,t,n,r){return new Promise((o,i)=>{let a=!1,s=()=>{n.removeEventListener("abort",l)},l=()=>{a||(a=!0,Vs(e),s(),o(r))};n.addEventListener("abort",l,{once:!0}),n.aborted&&l(),t.then(c=>{s(),a||o(c)},c=>{s(),a||i(c)})})}function Vs(e){let t=Array.from(e.querySelectorAll(".bd-overlay"));for(let n of t)n.querySelector(".bd-close")?.click(),n.remove();document.querySelector("#bugdrop-element-picker-cancel")?.click(),document.querySelector("#bugdrop-area-picker-cancel")?.click()}function oe(){return{screenshot:null,...fn(),returnToForm:!1}}function fn(){return{elementSelector:null,fullElementSelector:null}}function gn(e){return e==="explicit-skip"||e==="capture-failure-skip"}function Xr(e){throw new Error(`Unhandled screenshot choice: ${JSON.stringify(e)}`)}function hn(e){return{accentColor:e.accentColor,font:e.font,radius:e.radius,borderWidth:e.borderWidth,bgColor:e.bgColor,textColor:e.textColor,borderColor:e.borderColor,theme:e.theme}}async function Lt(e,t,n,r,o){if(o?.aborted)return{...oe(),returnToForm:!0};let i=qs(e,t,n,r,o);return o?Gr(e,i,o,{...oe(),returnToForm:!0}):i}async function qs(e,t,n,r,o){if(t.screenshotMode==="auto")return Ws(e,t,o);if(!n)return oe();let i=t.screenshotMode==="required";for(;;){let a=await js(e,t,i,o);if(o?.aborted)return{...oe(),returnToForm:!0};if(a.kind==="returnToForm")return{...oe(),returnToForm:!0};if(a.kind==="chooseAgain")continue;if(a.kind==="empty"){if(!i&&gn(a.reason)&&r(),i)continue;return{screenshot:null,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}let s=await $r(e,a.screenshot,a.redactionCount,{redactionUnavailable:a.redactionUnavailable,...a.redactionLimitations?{redactionLimitations:!0}:{},...a.elementSelector?{selectedElementCapture:!0}:{}});if(o?.aborted)return{...oe(),returnToForm:!0};if(s!=="retake")return s==="cancel"?{...oe(),returnToForm:!0}:{screenshot:s,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}}async function Ws(e,t,n){if(re())return oe();let r=await St(e,void 0,t.screenshotScale,{allowChooseAgain:!1,signal:n});return r.kind==="cancelled"?{...oe(),returnToForm:!0}:{screenshot:r.kind==="ok"?r.dataUrl:null,elementSelector:null,fullElementSelector:null,returnToForm:!1}}async function js(e,t,n,r){let o=await jr(e,{allowSkip:!n});switch(o.kind){case"cancel":return{kind:"returnToForm"};case"skip":return ge("explicit-skip");case"viewport":return Gs(e,o,n,r);case"capture":return Xs(e,t,n,r);case"element":return Ks(e,t,n,r);case"area":return Ys(e,t,n,r);default:return Xr(o)}}async function Gs(e,t,n,r){let o=await Ct(e,t.capture,{allowSkip:!n,showLoading:!1,signal:r});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?ge("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:0,redactionUnavailable:!0,redactionLimitations:!1}}async function Xs(e,t,n,r){let o=await St(e,void 0,t.screenshotScale,{allowSkip:!n,signal:r});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?ge("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:o.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:o.redaction?.hasLimitations??!1}}async function Ks(e,t,n,r){let o=await Fr(hn(t),r);if(!o)return ge("selection-cancelled");let i={elementSelector:Vr(o),fullElementSelector:Ur(o)},a=_r(o,{maxViewportAreaMultiplier:t.elementContextMaxArea}),s=await St(e,a,t.screenshotScale,{allowSkip:!n,captureOptions:{highlightElement:o,highlightStyle:{accentColor:t.accentColor,radius:t.radius,borderWidth:t.borderWidth},pixelRatio:1},signal:r});return s.kind==="cancelled"?{kind:"returnToForm"}:s.kind==="choose-again"?{kind:"chooseAgain"}:s.kind==="skipped"?ge("capture-failure-skip",i):{kind:"captured",screenshot:s.dataUrl,...i,redactionCount:s.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:s.redaction?.hasLimitations??!1}}async function Ys(e,t,n,r){let o=await Pr(hn(t),{redactionsAvailable:Me()>0},r);if(!o)return ge("selection-cancelled");let i=await Or(e,o,t.screenshotScale,{allowSkip:!n,signal:r});return i.kind==="cancelled"?{kind:"returnToForm"}:i.kind==="choose-again"?{kind:"chooseAgain"}:i.kind==="skipped"?ge("capture-failure-skip"):{kind:"captured",screenshot:i.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:i.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:i.redaction?.hasLimitations??!1}}function ge(e,t=fn()){return{kind:"empty",reason:e,...t}}function Kr(e,t=window){if(!e)return;let n=t[e];if(typeof n!="function"){console.warn(`[BugDrop] data-auth-token-provider "${e}" must reference a function.`);return}return n}async function he(e){if(!e)return{};let t=await e();return t?{Authorization:t.startsWith("Bearer ")?t:`Bearer ${t}`}:{}}var Ft=String.raw`(?:"|')?\b(?:password|passwd|pwd|token|api[_-]?key|secret|authorization|auth|cookie)\b(?:"|')?`,Zs=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[\s\S]|(?!\2)[^\\])*?\2`,"gi"),Js=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[^\r\n]|(?!\2)[^\\\r\n])*(?=\r?\n|$)`,"gi"),Qs=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(?:\[[^\]\r\n]*\]|\{[^\}\r\n]*\})`,"gi"),el=new RegExp(String.raw`(${Ft}\s*[:=]\s*)(?!Bearer\b)[^"',\s}&]+`,"gi"),tl=/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,nl=/\b[A-Za-z0-9+/_=-]{32,}\b/g;function Yr(e){return e.replace(tl,"Bearer [redacted]").replace(Qs,"$1[redacted]").replace(Zs,"$1$2[redacted]$2").replace(Js,"$1$2[redacted]").replace(el,"$1[redacted]").replace(nl,"[redacted]")}var rl=50,ol=1e3,Pt=[],Zr=!1;function Jr(){Zr||typeof window>"u"||typeof console>"u"||(Zr=!0,At("log"),At("info"),At("warn"),At("error"),window.addEventListener("error",e=>{yn({level:"error",message:e.message||"Unhandled error",timestamp:new Date().toISOString(),sourceUrl:e.filename||void 0,lineNumber:e.lineno||void 0,columnNumber:e.colno||void 0})}),window.addEventListener("unhandledrejection",e=>{yn({level:"error",message:`Unhandled promise rejection: ${Qr(e.reason)}`,timestamp:new Date().toISOString()})}))}function Rt(){return Pt.map(e=>({...e}))}function At(e){let t=console[e];typeof t=="function"&&(console[e]=(...n)=>{yn({level:e,message:n.map(Qr).join(" "),timestamp:new Date().toISOString(),...il()}),t.apply(console,n)})}function yn(e){for(Pt.push({...e,message:Yr(e.message).slice(0,ol)});Pt.length>rl;)Pt.shift()}function Qr(e){if(e instanceof Error)return e.stack||e.message;if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}function il(){let e=new Error().stack;if(!e)return{};for(let t of e.split(`
`).slice(2)){if(t.includes("console-logs"))continue;let n=t.match(/\(?((?:https?:|file:|\/)[^():]+):(\d+):(\d+)\)?$/);if(n)return{sourceUrl:n[1],lineNumber:Number(n[2]),columnNumber:Number(n[3])}}return{}}var Dt=new Set,eo=!1,wn=!1;function de(e){Dt.add(e),eo||al();let t=!1;return()=>{t||(t=!0,Dt.delete(e))}}function al(){eo=!0;let e=n=>{Mt(n)&&n.preventDefault()},t=n=>{if(!wn&&sl(n)){if(n.type==="focusin"){n.stopImmediatePropagation();return}if(n.type==="focusout"){wn=!0;try{ll(n)}finally{wn=!1}n.stopImmediatePropagation();return}n.stopImmediatePropagation()}};for(let n of["dismissableLayer.pointerDownOutside","dismissableLayer.interactOutside"])document.addEventListener(n,e,!0);window.addEventListener("focusin",t,!0),window.addEventListener("focusout",t,!0)}function Mt(e){let t=e.detail?.originalEvent,n=typeof t?.composedPath=="function"?t.composedPath():typeof e.composedPath=="function"?e.composedPath():[];return Array.from(Dt).some(r=>n.includes(r)||(t?.target??e.target)===r)}function sl(e){if(!(e instanceof FocusEvent)||e.type==="focusin")return Mt(e);if(e.type!=="focusout")return!1;let t=e.relatedTarget;return Array.from(Dt).some(r=>t===r||t instanceof Node&&(r.shadowRoot?.contains(t)??!1))&&!Mt(e)}function ll(e){let t=typeof e.composedPath=="function"?e.composedPath():[];for(let n of t)if(n instanceof HTMLElement&&(n.dispatchEvent(new FocusEvent("focusout",{bubbles:!1,composed:!1,relatedTarget:e instanceof FocusEvent?e.relatedTarget:null})),n===document.body))break}var It;function ze(){It?.close()}function zt(e){return It=e,()=>{It===e&&(It=void 0)}}var cl="bugdrop-variant@1";function to(e){let t=Object.freeze({kind:"variant",config:e}),n=Object.freeze([t]);return Object.freeze({id:cl,variantId:e.id,screens:n})}var se=class extends TypeError{constructor(n,r){super(r);this.fieldId=n;this.name="VariantAnswerError"}fieldId};function ye(e,t){if(!ul(t))throw new se(null,"BugDrop variant answers must be an object");let n=new Set(e.map(o=>o.id)),r=Object.keys(t).find(o=>!n.has(o));if(r)throw new se(null,`Unknown BugDrop variant answer: ${r}`)}function $e(e,t){return ye(e,t),Object.fromEntries(e.map(n=>[n.id,dl(n,t[n.id])]))}function dl(e,t){if(e.type==="shortText"||e.type==="longText"){if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(typeof t!="string")throw ue(e,`Answer ${e.id} must be text`);let n=t.trim();if(e.required&&!n)throw ue(e,`Answer ${e.id} is required`);let r=e.minLength??0,o=e.maxLength??(e.type==="shortText"?500:5e3);if(n.length<r||n.length>o)throw ue(e,`Answer ${e.id} must be ${r}-${o} characters`);return n}if(e.type==="rating"){let n=e.scale??5;if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(!Number.isInteger(t)||t<1||t>n)throw ue(e,`Answer ${e.id} must be a rating from 1-${n}`);return t}if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(typeof t!="string"||!e.options.some(n=>n.value===t))throw ue(e,`Answer ${e.id} must be a configured choice`);return t}function ue(e,t){return new se(e.id,t)}function ul(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function pe(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=`${r}-label`,i=`${r}-help`,a=`${r}-error`,s=document.createElement("label");if(s.className="bdv-label",s.id=o,s.htmlFor=r,s.textContent=e.label,e.required){let d=document.createElement("span");d.className="bdv-required",d.textContent=" *",d.setAttribute("aria-hidden","true"),s.appendChild(d)}n.appendChild(s);let l=[];if(e.helpText){let d=document.createElement("div");d.className="bdv-help",d.id=i,d.textContent=e.helpText,n.appendChild(d),l.push(i)}let c=document.createElement("div");return c.className="bdv-error",c.id=a,c.hidden=!0,c.setAttribute("aria-live","polite"),n.appendChild(c),l.push(a),{wrapper:n,label:s,controlId:r,labelId:o,describedBy:l.join(" ")||null,setError(d,u){c.textContent=u??"",c.hidden=!u,u?d.setAttribute("aria-invalid","true"):d.removeAttribute("aria-invalid")}}}function $t(e,t,n){e.id=n.controlId,e.className="bdv-input",e.required=t.required??!1,e.setAttribute("aria-required",String(t.required??!1)),n.describedBy&&e.setAttribute("aria-describedby",n.describedBy),t.placeholder&&(e.placeholder=t.placeholder),e.minLength=t.minLength??0,e.maxLength=t.maxLength??(t.type==="shortText"?500:5e3),n.wrapper.insertBefore(e,n.wrapper.querySelector(".bdv-error"))}function no(e,t){let n=pe(e,t),r=document.createElement("textarea");return r.rows=e.rows??4,$t(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function ro(e,t){let n=pe(e,t),r=e.scale??5,o=document.createElement("div");o.id=n.controlId,o.className="bdv-rating",o.setAttribute("role","radiogroup"),o.setAttribute("aria-labelledby",n.labelId),o.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&o.setAttribute("aria-describedby",n.describedBy);let i=[],a=null,s=null,l=()=>{for(let[m,b]of i.entries()){let h=m+1,k=s===null&&a!==null&&h<=a,C=s!==null&&h<=s;b.classList.toggle("bdv-rating-option--active",k),b.classList.toggle("bdv-rating-option--preview",C),b.setAttribute("aria-checked",String(h===a)),b.tabIndex=h===(a??1)?0:-1}},c=(m,b=!1)=>{a=m,s=null,l(),b&&i[m-1]?.focus()},d=[],u=()=>{s!==null&&(s=null,l())},g=m=>{let b=m.target;b instanceof HTMLButtonElement&&i.includes(b)&&!b.disabled||u()};for(let m=1;m<=r;m+=1){let b=document.createElement("button");b.type="button",b.className="bdv-rating-option",b.setAttribute("role","radio"),b.setAttribute("aria-label",`${m} ${m===1?"star":"stars"}`),b.textContent=e.icon==="number"?String(m):"\u2605";let h=()=>c(m),k=()=>{b.disabled||(s=m,l())},C=F=>{let P=null;F.key==="ArrowRight"||F.key==="ArrowDown"?P=m===r?1:m+1:F.key==="ArrowLeft"||F.key==="ArrowUp"?P=m===1?r:m-1:F.key==="Home"?P=1:F.key==="End"?P=r:(F.key==="Enter"||F.key===" ")&&(P=m),P!==null&&(F.preventDefault(),c(P,!0))};b.addEventListener("click",h),b.addEventListener("keydown",C),b.addEventListener("pointerenter",k),d.push({button:b,click:h,keydown:C,pointerenter:k}),i.push(b),o.appendChild(b)}if(o.addEventListener("pointermove",g),o.addEventListener("pointerleave",u),n.wrapper.insertBefore(o,n.wrapper.querySelector(".bdv-error")),e.lowLabel||e.highLabel){let m=document.createElement("div");m.className="bdv-rating-labels";let b=document.createElement("span");b.textContent=e.lowLabel??"";let h=document.createElement("span");h.textContent=e.highLabel??"",m.append(b,h),n.wrapper.insertBefore(m,n.wrapper.querySelector(".bdv-error"))}return l(),{field:e,element:n.wrapper,getValue:()=>a??"",setValue(m){a=Number.isInteger(m)&&m>=1&&m<=r?m:null,s=null,l()},setError:m=>n.setError(o,m),setDisabled(m){for(let b of i)b.disabled=m;m&&u()},focus(){i[(a??1)-1]?.focus()},dispose(){u(),o.removeEventListener("pointermove",g),o.removeEventListener("pointerleave",u);for(let m of d)m.button.removeEventListener("click",m.click),m.button.removeEventListener("keydown",m.keydown),m.button.removeEventListener("pointerenter",m.pointerenter)}}}function oo(e,t){let n=pe(e,t),r=document.createElement("input");return r.type="text",$t(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function io(e,t){let n=pe(e,t),r=document.createElement("div");r.className=`choice ${e.display??""}`,r.setAttribute("role","radiogroup"),r.setAttribute("aria-labelledby",n.labelId),r.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&r.setAttribute("aria-describedby",n.describedBy);let o=e.options.map(a=>{let s=document.createElement("label"),l=document.createElement("input");if(l.type="radio",l.name=n.controlId,l.value=a.value,s.append(l,a.label),a.description){let c=document.createElement("span");c.className="bdv-help",c.textContent=a.description,s.appendChild(c)}return r.appendChild(s),l});n.wrapper.insertBefore(r,n.wrapper.querySelector(".bdv-error"));let i=()=>r.querySelector(":checked");return{field:e,element:n.wrapper,getValue:()=>i()?.value??"",setValue(a){for(let s of o)s.checked=s.value===a},setError:a=>n.setError(r,a),setDisabled(a){for(let s of o)s.disabled=a},focus(){(i()??o[0])?.focus()},dispose(){}}}function Ot(e,t){return e.type==="shortText"?oo(e,t):e.type==="longText"?no(e,t):e.type==="rating"?ro(e,t):io(e,t)}function Nt(e){let{config:t,instanceId:n}=e,r={...e.context??{}},o={...e.initialAnswers??{}};ye(t.fields,o);let i=document.createElement("section");i.className="bdv-surface";let a=`${n}-title`;i.setAttribute("aria-labelledby",a);let s=document.createElement("div");s.className="bdv-header";let l=document.createElement("h2");if(l.className="bdv-title",l.id=a,l.textContent=t.content.title,s.appendChild(l),t.content.description){let T=document.createElement("p");T.className="bdv-description",T.textContent=t.content.description,s.appendChild(T)}i.appendChild(s);let c=document.createElement("form");c.className="bdv-form",c.noValidate=!0;let d=document.createElement("div");d.className="bdv-fields";let u=t.fields.map(T=>Ot(T,n));for(let T of u)d.appendChild(T.element);c.appendChild(d);let g=document.createElement("div");g.className="bdv-actions";let m=document.createElement("button");m.type="submit",m.className="bdv-submit",m.textContent=t.content.submitLabel??"Submit",g.appendChild(m);let b;e.cancel&&(b=document.createElement("button"),b.type="button",b.className="bdv-cancel",b.textContent=e.cancel.label,b.addEventListener("click",e.cancel.onCancel),g.appendChild(b)),c.appendChild(g);let h=document.createElement("p");h.className="bdv-status",h.setAttribute("role","status"),h.setAttribute("aria-live","polite"),c.appendChild(h),i.appendChild(c);let{success:k,successLink:C}=pl(t);i.appendChild(k);let F=ee("submission"),P=!1,L=!1,D=T=>{P=T,c.setAttribute("aria-busy",String(T)),m.disabled=T,b&&(b.disabled=T);for(let B of u)B.setDisabled(T)},v=()=>{h.textContent="",h.removeAttribute("data-kind");for(let T of u)T.setError(null)},A=()=>{for(let T of u)T.setValue(o[T.field.id]??"")},z=()=>Object.fromEntries(u.map(T=>[T.field.id,T.getValue()])),I=async T=>{if(T.preventDefault(),P||L)return;v();let B;try{B=$e(t.fields,z())}catch(w){if(w instanceof se&&w.fieldId){let f=u.find(R=>R.field.id===w.fieldId);f?.setError(ml(w)),f?.focus()}else h.textContent=w instanceof Error?w.message:"Please check your response.",h.dataset.kind="error";return}D(!0),h.textContent="Submitting\u2026";try{let w=await e.submit(B,{context:r,submissionId:F});if(L)return;D(!1),C.hidden=!w.isPublic,w.isPublic&&(C.href=w.issueUrl),c.hidden=!0,k.hidden=!1,k.focus(),e.onSubmitted?.(w)}catch(w){if(L)return;h.textContent=w instanceof Error?w.message:"Failed to submit feedback.",h.dataset.kind="error",D(!1)}},$=T=>{T.key==="Enter"&&T.target instanceof HTMLInputElement&&T.target.type!=="submit"&&T.preventDefault()};return c.addEventListener("submit",I),c.addEventListener("keydown",$),A(),{element:i,reset(){P||L||(F=ee("submission"),v(),A(),k.hidden=!0,C.removeAttribute("href"),c.hidden=!1)},dispose(){if(!L){L=!0,c.removeEventListener("submit",I),c.removeEventListener("keydown",$),b&&e.cancel&&b.removeEventListener("click",e.cancel.onCancel);for(let T of u)T.dispose()}}}}function ee(e){if(typeof globalThis.crypto?.randomUUID=="function")return`${e}-${globalThis.crypto.randomUUID()}`;if(typeof globalThis.crypto?.getRandomValues!="function")throw new Error("BugDrop rendered variants require a cryptographically secure random generator");let t=globalThis.crypto.getRandomValues(new Uint8Array(16));return`${e}-${Array.from(t,n=>n.toString(16).padStart(2,"0")).join("")}`}function pl(e){let t=document.createElement("div");t.className="bdv-success",t.hidden=!0,t.tabIndex=-1;let n=document.createElement("h3");n.className="bdv-success-title",n.textContent=e.content.successTitle??"Thanks for your feedback!";let r=document.createElement("p");r.className="bdv-success-message",r.textContent=e.content.successMessage??"Your response was submitted.";let o=document.createElement("a");return o.className="bdv-success-link",o.textContent="View GitHub Issue",o.target="_blank",o.rel="noopener noreferrer",t.append(n,r,o),{success:t,successLink:o}}function ml(e){if(!e.fieldId)return e.message;let t=`Answer ${e.fieldId} `,n=e.message.startsWith(t)?e.message.slice(t.length):e.message;return n.charAt(0).toUpperCase()+n.slice(1)}function Oe(e,t,n){let r=document.createElement("style");r.textContent=bl,e.appendChild(r);let o=document.createElement("div");o.className="bdv-root",o.dataset.presentation=n,t.presentation.kind==="modal"&&(o.dataset.size=t.presentation.size??"default"),o.dataset.density=t.appearance?.density??"comfortable",o.dataset.columns=String(t.presentation.columns??1);let i=H(t.appearance?.accentColor);i&&o.style.setProperty("--bdv-accent",i),e.appendChild(o);let a=t.appearance?.theme??"auto",s=c=>{o.classList.toggle("bdv-dark",c==="dark")};s(De(a));let l=a==="auto"?kt(s):()=>{};return{root:o,dispose(){l(),r.remove(),o.remove()}}}var bl=`
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
`;function ao(e){if(!(e.target instanceof HTMLElement))throw new TypeError("BugDrop inline variant target must be an HTMLElement");if(e.config.presentation.kind!=="inline")throw new TypeError("BugDrop mount() requires an inline variant");ye(e.config.fields,e.options?.initialAnswers??{});let t=ee(e.config.id),n=document.createElement("div");n.dataset.bugdropOwned="",n.dataset.bugdropInstance=t;let r=n.attachShadow({mode:"open"}),o=de(n),i=Oe(r,e.config,"inline"),a=Nt({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit});i.root.appendChild(a.element),e.target.appendChild(n);let s=!1;return Object.freeze({instanceId:t,reset(){s||a.reset()},unmount(){s||(s=!0,a.dispose(),o(),i.dispose(),n.remove())}})}function lo(e){if(e.config.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");ye(e.config.fields,e.options?.initialAnswers??{}),ze();let t=ee(e.config.id),n=document.activeElement instanceof HTMLElement?document.activeElement:null,r=document.body.style.getPropertyValue("overflow"),o=document.body.style.getPropertyPriority("overflow"),i=document.createElement("div");i.dataset.bugdropOwned="",i.dataset.bugdropInstance=t,Object.assign(i.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let a=i.attachShadow({mode:"open"}),s=Oe(a,e.config,"modal"),l=document.createElement("div");l.className="bdv-overlay",s.root.appendChild(l);let c,d=new Promise(v=>{c=v}),u=!1,g=!1,m=()=>{},b=v=>{u||(u=!0,c(v))},h=()=>{g||(g=!0,b({status:"closed"}),m(),a.removeEventListener("keydown",F),l.removeEventListener("pointerdown",P),k.dispose(),L(),s.dispose(),i.remove(),fl(r,o),n?.isConnected&&n.focus())},k=Nt({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit,cancel:{label:e.config.content.cancelLabel??"Cancel",onCancel:h},onSubmitted:v=>b({status:"submitted",result:v})});k.element.setAttribute("role","dialog"),k.element.setAttribute("aria-modal","true"),k.element.dataset.size=e.config.presentation.size??"default";let C=document.createElement("button");C.type="button",C.className="bdv-close",C.setAttribute("aria-label","Close"),C.textContent="\xD7",C.addEventListener("click",h,{once:!0}),k.element.prepend(C),l.appendChild(k.element);function F(v){if(!(v instanceof KeyboardEvent))return;if(v.key==="Escape"){v.preventDefault(),h();return}if(v.key!=="Tab")return;let A=so(k.element);if(A.length===0){v.preventDefault(),k.element.focus();return}let z=a.activeElement,I=A[0],$=A.at(-1);v.shiftKey&&(z===I||!k.element.contains(z))?(v.preventDefault(),$.focus()):!v.shiftKey&&z===$&&(v.preventDefault(),I.focus())}function P(v){v.target===l&&h()}document.body.style.setProperty("overflow","hidden"),document.body.appendChild(i);let L=de(i);a.addEventListener("keydown",F),l.addEventListener("pointerdown",P);let D=Object.freeze({instanceId:t,result:d,close:h});return m=zt(D),queueMicrotask(()=>{if(g)return;(k.element.querySelector('textarea:not(:disabled), input:not(:disabled), [role="radio"][tabindex="0"]')??so(k.element)[0]??k.element).focus()}),D}function co(e){return Object.freeze({instanceId:ee(e),result:Promise.resolve({status:"busy"}),close(){}})}function so(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&t.getAttribute("aria-hidden")!=="true")}function fl(e,t){e?document.body.style.setProperty("overflow",e,t):document.body.style.removeProperty("overflow")}var _t=/^[a-z][a-z0-9_-]{0,63}$/,uo=/{{\s*([^{}]+?)\s*}}/g,gl=new Set(["bug","feature","question","feedback"]),hl=new Set(["shortText","longText","rating","singleChoice"]),yl=new Set(["id","configVersion","presentation","appearance","content","fields","issue"]),wl=new Set(["title","description","submitLabel","cancelLabel","successTitle","successMessage"]),vl=new Set(["theme","accentColor","density"]),xl=new Set(["classification","title","sections"]),Bt=["id","type","label","helpText","required","layout"],El={shortText:new Set([...Bt,"placeholder","minLength","maxLength"]),longText:new Set([...Bt,"placeholder","rows","minLength","maxLength"]),rating:new Set([...Bt,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([...Bt,"options","display"])};function mo(e){if(!ie(e))throw new TypeError("BugDrop variant config must be an object");if(le(e,yl,"variant config"),typeof e.id!="string"||!_t.test(e.id)||e.id==="legacy")throw new TypeError("BugDrop variant id must match [a-z][a-z0-9_-]{0,63} and cannot be legacy");if(e.configVersion!==void 0&&e.configVersion!==1)throw new TypeError("BugDrop variant configVersion must be 1");if(kl(e.presentation),Sl(e.appearance),Cl(e.content),!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)throw new TypeError("BugDrop variant fields must contain 1-20 entries");let t=new Map;for(let n of e.fields)Tl(n,t);return Rl(e,t),bo(vn(e))}function kl(e){if(!ie(e)||e.kind!=="modal"&&e.kind!=="inline")throw new TypeError("BugDrop variant presentation must be modal or inline");if(le(e,e.kind==="modal"?new Set(["kind","size","columns"]):new Set(["kind","columns"]),"variant presentation"),e.columns!==void 0&&e.columns!==1&&e.columns!==2)throw new TypeError("BugDrop variant presentation columns must be 1 or 2");if(e.kind==="modal"&&e.size!==void 0&&!["compact","default","wide"].includes(e.size))throw new TypeError("BugDrop modal size must be compact, default, or wide")}function Sl(e){if(e!==void 0){if(!ie(e))throw new TypeError("BugDrop variant appearance must be an object");if(le(e,vl,"variant appearance"),e.theme!==void 0&&!["light","dark","auto"].includes(e.theme))throw new TypeError("BugDrop variant appearance theme is invalid");if(e.accentColor!==void 0&&(!X(e.accentColor,120)||Dl(e.accentColor)))throw new TypeError("BugDrop variant appearance accentColor is invalid");if(e.density!==void 0&&e.density!=="compact"&&e.density!=="comfortable")throw new TypeError("BugDrop variant appearance density is invalid")}}function Cl(e){if(!ie(e))throw new TypeError("BugDrop variant content must be an object");if(le(e,wl,"variant content"),!X(e.title,500))throw new TypeError("BugDrop variant content.title is required");et(e.description,"description",2e3),et(e.submitLabel,"submitLabel",120),et(e.cancelLabel,"cancelLabel",120),et(e.successTitle,"successTitle",500),et(e.successMessage,"successMessage",2e3)}function et(e,t,n){if(e!==void 0&&!X(e,n))throw new TypeError(`BugDrop variant content.${t} is invalid`)}function Tl(e,t){if(!ie(e)||!hl.has(e.type)||typeof e.id!="string"||!_t.test(e.id))throw new TypeError("BugDrop variant field has an invalid type or id");if(le(e,El[e.type],`field ${e.id}`),t.has(e.id))throw new TypeError(`Duplicate BugDrop variant field id: ${e.id}`);if(t.set(e.id,e),!X(e.label,500))throw new TypeError(`Field ${e.id} requires a label`);if(e.helpText!==void 0&&!X(e.helpText,1e3))throw new TypeError(`Field ${e.id} has invalid helpText`);if(e.required!==void 0&&typeof e.required!="boolean")throw new TypeError(`Field ${e.id} required must be boolean`);Ll(e),e.type==="shortText"||e.type==="longText"?Fl(e):e.type==="rating"?Al(e):Pl(e)}function Ll(e){if(e.layout!==void 0){if(!ie(e.layout))throw new TypeError(`Field ${e.id} layout must be an object`);if(le(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2)throw new TypeError(`Field ${e.id} layout span must be 1 or 2`)}}function Fl(e){if(e.placeholder!==void 0&&!X(e.placeholder,500))throw new TypeError(`Field ${e.id} has invalid placeholder`);let t=e.type==="shortText"?500:5e3;if(e.minLength!==void 0&&!tt(e.minLength,0,5e3)||e.maxLength!==void 0&&!tt(e.maxLength,1,5e3))throw new TypeError(`Field ${e.id} has invalid text bounds`);let n=e.minLength===void 0?0:e.minLength,r=e.maxLength===void 0?t:e.maxLength;if(!tt(n,0,5e3)||!tt(r,1,5e3)||n>r)throw new TypeError(`Field ${e.id} has invalid text bounds`);if(e.type==="longText"&&e.rows!==void 0&&!tt(e.rows,1,50))throw new TypeError(`Field ${e.id} rows must be an integer from 1-50`)}function Al(e){if(e.scale!==void 0&&e.scale!==5&&e.scale!==10)throw new TypeError(`Field ${e.id} rating scale must be 5 or 10`);if(e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number")throw new TypeError(`Field ${e.id} rating icon must be star or number`);if(e.lowLabel!==void 0&&!X(e.lowLabel,500))throw new TypeError(`Field ${e.id} has invalid lowLabel`);if(e.highLabel!==void 0&&!X(e.highLabel,500))throw new TypeError(`Field ${e.id} has invalid highLabel`)}function Pl(e){if(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)throw new TypeError(`Field ${e.id} requires 2-50 choices`);if(e.display!==void 0&&e.display!=="radio"&&e.display!=="cards"&&e.display!=="buttons")throw new TypeError(`Field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options){if(!ie(n))throw new TypeError(`Field ${e.id} has an invalid choice`);if(le(n,new Set(["value","label","description"]),`field ${e.id} choice`),!X(n.value,120)||!X(n.label,500))throw new TypeError(`Field ${e.id} has an invalid choice`);if(n.description!==void 0&&!X(n.description,1e3))throw new TypeError(`Field ${e.id} has an invalid choice description`);if(t.has(n.value))throw new TypeError(`Field ${e.id} has duplicate choices`);t.add(n.value)}}function Rl(e,t){if(!ie(e.issue))throw new TypeError("BugDrop variant issue must be an object");if(le(e.issue,xl,"variant issue"),!X(e.issue.title,2e3))throw new TypeError("BugDrop variant issue.title is required");if(e.issue.classification!==void 0&&!gl.has(e.issue.classification))throw new TypeError("BugDrop variant issue.classification is invalid");for(let o of e.issue.title.matchAll(uo)){let i=o[1];if(i.startsWith("context.")){if(!_t.test(i.slice(8)))throw po()}else if(!t.has(i))throw new TypeError(`Unknown BugDrop variant title field: ${i}`)}if(e.issue.title.replace(uo,"").includes("{{"))throw po();if(e.issue.sections!==void 0&&!Array.isArray(e.issue.sections))throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let n=e.issue.sections??[];if(n.length>20)throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let r=new Set;for(let o of n)Ml(o,t,r)}function Ml(e,t,n){if(!ie(e)||!X(e.heading,120))throw new TypeError("BugDrop variant Issue section requires a heading");let r="field"in e,o="context"in e;if(r===o)throw new TypeError("BugDrop variant Issue section must reference one field or context key");if(le(e,r?new Set(["heading","field","format","omitWhenEmpty"]):new Set(["heading","context","format","omitWhenEmpty"]),"variant Issue section"),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean")throw new TypeError("BugDrop variant Issue section omitWhenEmpty must be boolean");let i=e.heading.trim().toLowerCase();if(n.has(i))throw new TypeError(`Duplicate BugDrop Issue heading: ${e.heading}`);if(n.add(i),r){let a=t.get(e.field);if(!a)throw new TypeError(`Unknown Issue field: ${e.field}`);let s=e.format===void 0?"text":e.format;if(!["text","quote","stars","choice"].includes(s))throw new TypeError(`Invalid Issue field format: ${String(s)}`);if(s==="stars"&&a.type!=="rating")throw new TypeError("BugDrop stars format requires a rating field");if(s==="choice"&&a.type!=="singleChoice")throw new TypeError("BugDrop choice format requires a singleChoice field")}else{if(typeof e.context!="string"||!_t.test(e.context))throw new TypeError(`Invalid Issue context key: ${e.context}`);if(e.format!==void 0&&e.format!=="text"&&e.format!=="code")throw new TypeError(`Invalid Issue context format: ${String(e.format)}`)}}function po(){return new TypeError("BugDrop variant title contains an invalid placeholder")}function le(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));if(r)throw new TypeError(`Unknown BugDrop ${n} property: ${r}`)}function X(e,t){return typeof e=="string"&&e.trim().length>0&&e.length<=t}function tt(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function Dl(e){return Array.from(e).some(t=>{let n=t.charCodeAt(0);return n<32||n===127})}function ie(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function vn(e){return Array.isArray(e)?e.map(t=>vn(t)):ie(e)?Object.fromEntries(Object.entries(e).map(([t,n])=>[t,vn(n)])):e}function bo(e){if(e&&typeof e=="object"){Object.freeze(e);for(let t of Object.values(e))bo(t)}return e}function fo(e,t,n={}){$l(n);let r=$e(e.fields,t),o=e.issue.title.replace(/{{\s*([^{}]+?)\s*}}/g,(a,s)=>{let l=s.startsWith("context.")?n[s.slice(8)]:r[s];return go(e.fields,s,l,"text")}).replace(/\s+/g," ").trim().slice(0,256).trim();if(!o)throw new TypeError("BugDrop variant produced an empty Issue title");let i=(e.issue.sections??[]).flatMap(a=>{let s=Il(a,e.fields,r,n);return!s.trim()&&a.omitWhenEmpty?[]:[{heading:a.heading.trim(),value:s.trim()?s:"Not provided.",format:zl(a)}]});return{title:o,...e.issue.classification?{classification:e.issue.classification}:{},sections:i}}function Il(e,t,n,r){return"context"in e?String(r[e.context]??""):go(t,e.field,n[e.field],e.format??"text")}function go(e,t,n,r){if(n==null||n==="")return"";let o=e.find(i=>i.id===t);if(r==="stars"&&o?.type==="rating"&&typeof n=="number"){let i=o.scale??5;return`${"\u2605".repeat(n)}${"\u2606".repeat(i-n)} (${n}/${i})`}return r==="choice"&&o?.type==="singleChoice"?o.options.find(i=>i.value===n)?.label??String(n):String(n)}function zl(e){return e.format==="quote"||e.format==="code"?e.format:"text"}function $l(e){if(!Ol(e)||Object.keys(e).length>50)throw new TypeError("BugDrop variant context must contain at most 50 values");for(let[t,n]of Object.entries(e)){if(!/^[a-z][a-z0-9_-]{0,63}$/.test(t))throw new TypeError(`Invalid context key: ${t}`);if(!["string","number","boolean"].includes(typeof n)&&n!==null)throw new TypeError(`Invalid context value: ${t}`);if(typeof n=="number"&&!Number.isFinite(n))throw new TypeError(`Invalid context value: ${t}`);if(String(n??"").length>5e3)throw new TypeError(`Context value is too long: ${t}`)}}function Ol(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}async function ho(e,t,n,r={}){let o=r.submissionId??Nl(),i=fo(t,n,r.context),a=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(e.authTokenProvider)},body:JSON.stringify({kind:"bugdrop.variant-submission",schemaVersion:1,repo:e.repo,variantId:t.id,submissionId:o,issue:i,metadata:Bl()})}),s=await a.json();if(!a.ok||s.success!==!0)throw new Error(typeof s.error=="string"?s.error:"Failed to submit feedback");if(!Number.isInteger(s.issueNumber)||s.issueNumber<=0||typeof s.issueUrl!="string"||!Vl(s.issueUrl,e.repo,s.issueNumber)||typeof s.isPublic!="boolean")throw new Error("BugDrop received an invalid Issue result");return{issueNumber:s.issueNumber,issueUrl:s.issueUrl,isPublic:s.isPublic,...Array.isArray(s.labelMappingWarnings)&&s.labelMappingWarnings.every(l=>typeof l=="string")?{labelMappingWarnings:s.labelMappingWarnings}:{}}}function Nl(){if(typeof crypto?.randomUUID=="function")return crypto.randomUUID();if(typeof crypto?.getRandomValues!="function")throw new Error("BugDrop variants require a cryptographically secure random generator");let e=crypto.getRandomValues(new Uint8Array(16));return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Bl(){let e=new URL(window.location.href);return e.search="",e.hash="",{url:e.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),browser:_l(navigator.userAgent),os:Hl(navigator.userAgent),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function _l(e){for(let[t,n]of[["Edge",/Edg\/(\d+[\d.]*)/],["Chrome",/Chrome\/(\d+[\d.]*)/],["Safari",/Version\/(\d+[\d.]*).*Safari/],["Firefox",/Firefox\/(\d+[\d.]*)/]]){let r=e.match(n);if(r)return{name:t,version:r[1]??"unknown"}}return{name:"Unknown",version:"unknown"}}function Hl(e){let t=e.match(/(?:Mac OS X|Windows NT|Android) ([\d_.]+)/);return t?{name:e.includes("Mac OS X")?"macOS":e.includes("Windows NT")?"Windows":"Android",version:(t[1]??"unknown").replaceAll("_",".")}:{name:e.includes("Linux")?"Linux":"Unknown",version:"unknown"}}function Vl(e,t,n){try{let r=new URL(e);return r.protocol==="https:"&&r.hostname==="github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function yo(e,t={isLegacyModalOpen:()=>!1}){let n=new Map;return{register(r){let o=mo(r);if(n.has(o.id))throw new TypeError(`BugDrop variant is already registered: ${o.id}`);let i=to(o);n.set(o.id,i);let s=i.screens[0].config,l=(c,d={})=>ho(e,s,c,d);return Object.freeze({id:i.variantId,open(c){if(s.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");return t.isLegacyModalOpen()?co(i.variantId):lo({config:s,options:c,submit:l})},mount(c,d){return ao({config:s,target:c,options:d,submit:l})},submit(c,d={}){return l(c,d)}})}}}function nt(e,t,n){return e?"answer"in e?wo(t,e.answer,e.equals):"context"in e?wo(n,e.context,e.equals):"all"in e?e.all.every(r=>nt(r,t,n)):e.any.some(r=>nt(r,t,n)):!0}function wo(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)&&e[t]===n}function xn(e,t=1){if(t>4)throw new TypeError("BugDrop flow condition depth cannot exceed 4");if("answer"in e||"context"in e)return 1;let n="all"in e?e.all:e.any,r=1;for(let o of n)r+=xn(o,t+1);if(r>32)throw new TypeError("BugDrop flow conditions cannot exceed 32 nodes");return r}var Ne=class{constructor(t,n,r={}){this.definition=t;this.context=n;this.answers={...r},this.reconcileInitiallyHidden(),this.currentId=this.visibleScreens()[0]?.id??""}definition;context;answers;capture=null;currentId;current(){return this.route().screen}route(){let t=this.visibleScreens(),n=t.findIndex(o=>o.id===this.currentId),r=n>=0?n:0;return Object.freeze({screen:t[r],position:t.length===0?0:r+1,total:t.length,canGoBack:r>0,hasNext:r>=0&&r<t.length-1})}setFormAnswers(t,n){let r=new Set(this.visibleScreens().map(i=>i.id)),o=this.definition.screenAnswerPaths.get(this.definition.screens.find(i=>i.type==="form"&&i.form===t).id);for(let i of o){let a=i.slice(t.length+1);this.answers[i]=n[a]}this.reconcileNewlyHidden(r)}next(){let t=this.route(),n=this.visibleScreens();return t.hasNext?(this.currentId=n[t.position].id,!0):!1}back(){let t=this.route(),n=this.visibleScreens();return t.canGoBack?(this.currentId=n[t.position-2].id,!0):!1}hasNext(){return this.route().hasNext}visibleScreens(){return this.definition.screens.filter(t=>nt(t.when,this.answers,this.context))}reconcileInitiallyHidden(){for(let t of this.definition.screens)nt(t.when,this.answers,this.context)||this.clearScreenState(t)}reconcileNewlyHidden(t){let n=new Set(this.visibleScreens().map(o=>o.id)),r=!0;for(;r;){r=!1;for(let o of this.definition.screens)!t.has(o.id)||n.has(o.id)||(r=this.clearScreenState(o)||r);r&&(n=new Set(this.visibleScreens().map(o=>o.id)))}n.has(this.currentId)||(this.currentId=this.nearestVisibleId(n))}clearScreenState(t){let n=!1;for(let r of this.definition.screenAnswerPaths.get(t.id)??[])Object.prototype.hasOwnProperty.call(this.answers,r)&&(n=!0),delete this.answers[r];return t.type==="screenshot"&&this.capture!==null&&(this.capture=null,n=!0),n}nearestVisibleId(t){let n=this.definition.screens.findIndex(r=>r.id===this.currentId);for(let r=n;r>=0;r-=1){let o=this.definition.screens[r];if(o&&t.has(o.id))return o.id}return this.visibleScreens()[0]?.id??""}};async function vo(e,t){let n=await t.preflight(e.system.preflight);if(n.status!=="installed")return t.showPreflightFailure(n),"preflight-blocked";let r=e.steps[0],o=new Ne(e.flow,{"show-welcome":r.enabled});if(o.current()?.id==="welcome"){if(!await t.showWelcome(r))return"finished";r.remember&&t.rememberWelcome(r),o.next()}let i=e.steps[1],a=e.steps[2],s=null;for(;;){if(o.current()?.id!=="details")throw new Error("Default flow expected details screen");if(s=await t.showDetails(i,s),!s)return"finished";if(o.next(),o.current()?.id!=="screenshot")throw new Error("Default flow expected screenshot screen");let l=await t.capture(a,s);if(l.returnToDetails){o.back();continue}return await t.submit(e.system.submission,s,l),"finished"}}function Ht(e){let t=new Map;for(let o of e.forms)for(let i of o.fields)t.set(`${o.id}.${i.id}`,i);let n=new Map,r=new Set;for(let o of e.screens)En(o.when,r),n.set(o.id,o.type==="form"?e.forms.find(i=>i.id===o.form).fields.map(i=>`${o.form}.${i.id}`):[]);for(let o of e.issue.sections??[])"context"in o&&r.add(o.context);return Object.freeze({compiler:"bugdrop-flow@1",flowId:e.id,config:e,fields:t,contextKeys:r,screenAnswerPaths:n,screens:e.screens})}function En(e,t){e&&("context"in e?t.add(e.context):"all"in e?e.all.forEach(n=>En(n,t)):"any"in e&&e.any.forEach(n=>En(n,t)))}var Ul=/^[a-z][a-z0-9_-]{0,63}$/;function N(e,t,n){for(let r of Object.keys(e))t.has(r)||E(`${n} contains unknown key ${r}`)}function we(e,t){(typeof e!="string"||!Ul.test(e)||e==="legacy")&&E(`${t} is invalid`)}function ve(e,t,n){(typeof e!="string"||e.trim().length===0||e.length>n||[...e].some(r=>{let o=r.charCodeAt(0);return o<32&&o!==9&&o!==10&&o!==13}))&&E(`${t} is invalid`)}function me(e,t,n){e!==void 0&&ve(e,t,n)}function kn(e,t){(e!==null&&!["string","number","boolean"].includes(typeof e)||typeof e=="number"&&!Number.isFinite(e))&&E(`${t} must be scalar`)}function j(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function E(e){throw new TypeError(`BugDrop flow ${e}`)}function Sn(e){if(!e||typeof e!="object"||Object.isFrozen(e))return e;Object.freeze(e);for(let t of Object.values(e))Sn(t);return e}var ql=new Set(["slide-horizontal","slide-vertical","fade","scale-fade"]),Wl=new Set(["standard","linear","ease-in","ease-out","ease-in-out"]),jl=new Set(["opacity","translateX","translateY","scale"]);function So(e){if(e!==void 0){if(j(e)||E("screen transition must be an object"),e.kind==="none"){N(e,new Set(["kind"]),"screen transition");return}if(ql.has(e.kind)){N(e,new Set(["kind","durationMs"]),"screen transition"),xo(e.durationMs);return}e.kind!=="custom"&&E("screen transition kind is invalid"),N(e,new Set(["kind","durationMs","easing","forward","backward"]),"screen transition"),xo(e.durationMs),e.easing!==void 0&&!Wl.has(e.easing)&&E("custom screen transition easing is invalid"),Eo(e.forward,"forward"),Eo(e.backward,"backward")}}function xo(e){e!==void 0&&(!Number.isInteger(e)||e<100||e>1e3)&&E("screen transition durationMs must be an integer from 100 to 1000")}function Eo(e,t){j(e)||E(`custom screen transition ${t} motion must be an object`),N(e,new Set(["enterFrom","exitTo"]),`custom screen transition ${t} motion`),ko(e.enterFrom,`${t} enterFrom`),ko(e.exitTo,`${t} exitTo`)}function ko(e,t){j(e)||E(`custom screen transition ${t} must be an object`),N(e,jl,`custom screen transition ${t}`),Vt(e.opacity,0,1,`${t} opacity`),Vt(e.translateX,-200,200,`${t} translateX`),Vt(e.translateY,-200,200,`${t} translateY`),Vt(e.scale,.5,1.5,`${t} scale`)}function Vt(e,t,n,r){e!==void 0&&(typeof e!="number"||!Number.isFinite(e)||e<t||e>n)&&E(`custom screen transition ${r} is out of range`)}var Gl=new Set(["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"]),qt=e=>Gl.has(e);function Wt(e,t){let n=t;return t!==void 0&&!ce(t)&&S("open options must be an object"),xe(t??{},new Set(["context","initialAnswers"]),"open options"),{context:Object.freeze(Kl(e,n?.context)),initialAnswers:Yl(e,n?.initialAnswers)}}function Co(e){Zl(e),e.type==="shortText"||e.type==="longText"?Jl(e):e.type==="rating"?Ql(e):e.type==="singleChoice"?ec(e):e.type==="checkbox"?tc(e):nc(e)}function To(e,t){if(e.type==="rating"){let o=e.scale??5;(!Number.isInteger(t)||t<1||t>o)&&S(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="singleChoice"){(typeof t!="string"||!e.options.some(o=>o.value===t))&&S(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="checkbox"){typeof t!="boolean"&&S(`condition equals is not a valid value for field ${e.id}`);return}e.type==="attachments"&&S(`condition answer cannot reference attachments field ${e.id}`),(typeof t!="string"||t!==t.trim())&&S(`condition equals is not a valid value for field ${e.id}`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3);(t.length<n||t.length>r)&&S(`condition equals is not a valid value for field ${e.id}`)}function Lo(e){let{presentation:t,appearance:n,content:r}=e;ce(t)||S("presentation must be an object"),xe(t,new Set(["kind","size","columns","screenTransition"]),"presentation"),t.kind!=="modal"&&S("presentation kind must be modal"),t.size!==void 0&&!["compact","default","wide"].includes(t.size)&&S("modal size is invalid"),t.columns!==void 0&&![1,2].includes(t.columns)&&S("presentation columns must be 1 or 2"),So(t.screenTransition),n!==void 0&&(ce(n)||S("appearance must be an object"),xe(n,new Set(["theme","accentColor","density"]),"appearance"),n.theme!==void 0&&!["light","dark","auto"].includes(n.theme)&&S("appearance theme is invalid"),be(n.accentColor,"appearance accentColor",120),n.density!==void 0&&!["compact","comfortable"].includes(n.density)&&S("appearance density is invalid")),r!==void 0&&(ce(r)||S("content must be an object"),xe(r,new Set(["successTitle","successMessage","cancelLabel"]),"content"),be(r.successTitle,"successTitle",500),be(r.successMessage,"successMessage",2e3),be(r.cancelLabel,"cancelLabel",120))}function Xl(e,t){if(e.type==="shortText"||e.type==="longText"){typeof t!="string"&&S(`initial answer ${e.id} must be text`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3),o=t.trim();return(o.length<n||o.length>r)&&S(`initial answer ${e.id} has invalid length`),o}if(e.type==="rating"){let n=e.scale??5;return(!Number.isInteger(t)||t<1||t>n)&&S(`initial answer ${e.id} must be a rating from 1-${n}`),t}return e.type==="singleChoice"?((typeof t!="string"||!e.options.some(n=>n.value===t))&&S(`initial answer ${e.id} must be a configured choice`),t):e.type==="checkbox"?(typeof t!="boolean"&&S(`initial answer ${e.id} must be boolean`),t):rc(e,t)}function Kl(e,t){t!==void 0&&!ce(t)&&S("context must be an object");let n=t??{},r=Object.keys(n).find(i=>!e.contextKeys.has(i));r&&S(`context contains unknown key ${r}`);let o={};for(let[i,a]of Object.entries(n))(!ac(a)||typeof a=="number"&&!Number.isFinite(a))&&S(`context ${i} must be a finite scalar`),o[i]=a;return o}function Yl(e,t){t!==void 0&&!ce(t)&&S("initialAnswers must be an object");let n=t??{},r=Object.keys(n).find(o=>!e.fields.has(o));return r&&S(`initialAnswers contains unknown key ${r}`),Object.fromEntries(Object.entries(n).map(([o,i])=>[o,Xl(e.fields.get(o),i)]))}function Zl(e){e.layout!==void 0&&(ce(e.layout)||S(`field ${e.id} layout must be an object`),xe(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2&&S(`field ${e.id} layout span must be 1 or 2`))}function Jl(e){be(e.placeholder,`field ${e.id} placeholder`,500);let t=e.minLength??0,n=e.maxLength??(e.type==="shortText"?500:5e3);(!Be(t,0,5e3)||!Be(n,1,5e3)||t>n)&&S(`field ${e.id} has invalid text bounds`),e.type==="longText"&&e.rows!==void 0&&!Be(e.rows,1,50)&&S(`field ${e.id} rows must be 1-50`)}function Ql(e){e.scale!==void 0&&e.scale!==5&&e.scale!==10&&S(`field ${e.id} rating scale must be 5 or 10`),e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number"&&S(`field ${e.id} rating icon is invalid`),be(e.lowLabel,`field ${e.id} lowLabel`,500),be(e.highLabel,`field ${e.id} highLabel`,500)}function ec(e){(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)&&S(`field ${e.id} requires 2-50 choices`),e.display!==void 0&&!["radio","cards","buttons"].includes(e.display)&&S(`field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options)ce(n)||S(`field ${e.id} has an invalid choice`),xe(n,new Set(["value","label","description"]),`field ${e.id} choice`),Ut(n.value,`field ${e.id} choice value`,120),Ut(n.label,`field ${e.id} choice label`,500),be(n.description,`field ${e.id} choice description`,1e3),t.has(n.value)&&S(`field ${e.id} has duplicate choices`),t.add(n.value)}function tc(e){e.initialValue!==void 0&&typeof e.initialValue!="boolean"&&S(`field ${e.id} initialValue must be boolean`)}function nc(e){e.maxFiles!==void 0&&!Be(e.maxFiles,1,5)&&S(`field ${e.id} maxFiles must be 1-5`),e.maxFileSize!==void 0&&!Be(e.maxFileSize,1,5*1024*1024)&&S(`field ${e.id} maxFileSize is invalid`),e.accept!==void 0&&(!Array.isArray(e.accept)||e.accept.length===0||e.accept.length>20||e.accept.some(t=>typeof t!="string"||!t.trim()||t.length>120||!qt(t)))&&S(`field ${e.id} accept is invalid`)}function rc(e,t){return(!Array.isArray(t)||t.length>(e.maxFiles??5))&&S(`initial answer ${e.id} has too many attachments`),t.map(n=>{ce(n)||S(`initial answer ${e.id} has an invalid attachment`),xe(n,new Set(["name","type","size","dataUrl"]),"attachment"),Ut(n.name,"attachment name",500),(typeof n.type!="string"||!qt(n.type))&&S("attachment type is invalid"),e.accept&&!e.accept.includes(n.type)&&S(`initial answer ${e.id} has a disallowed attachment type`),Be(n.size,0,e.maxFileSize??5*1024*1024)||S("attachment size is invalid"),(typeof n.dataUrl!="string"||!new RegExp(`^data:${oc(n.type)};base64,[A-Za-z0-9+/]+={0,2}$`).test(n.dataUrl))&&S("attachment dataUrl is invalid");let r=n.dataUrl.slice(n.dataUrl.indexOf(",")+1);return r.length%4!==0&&S("attachment dataUrl is invalid"),atob(r).length>(e.maxFileSize??5*1024*1024)&&S("attachment size is invalid"),{name:n.name,type:n.type,size:n.size,dataUrl:n.dataUrl}})}function oc(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ut(e,t,n){(typeof e!="string"||!e.trim()||e.length>n||ic(e))&&S(`${t} is invalid`)}function be(e,t,n){e!==void 0&&Ut(e,t,n)}function ic(e){return[...e].some(t=>{let n=t.charCodeAt(0);return n<32&&n!==9&&n!==10&&n!==13||n===127})}function Be(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function ac(e){return e===null||["string","number","boolean"].includes(typeof e)}function ce(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function xe(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));r&&S(`${n} contains unknown key ${r}`)}function S(e){throw new TypeError(`BugDrop flow ${e}`)}var Ro=/^([a-z][a-z0-9_-]{0,63})\.([a-z][a-z0-9_-]{0,63})$/,sc=new Set(["configVersion","id","presentation","appearance","content","forms","screens","issue","evidence"]),_e=["id","type","label","helpText","required","layout"],Fo={shortText:new Set([..._e,"placeholder","minLength","maxLength"]),longText:new Set([..._e,"placeholder","rows","minLength","maxLength"]),rating:new Set([..._e,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([..._e,"options","display"]),checkbox:new Set([..._e,"initialValue"]),attachments:new Set([..._e,"maxFiles","maxFileSize","accept"])};function jt(e){j(e)||E("config must be an object"),N(e,sc,"config"),e.configVersion!==1&&E("configVersion must be 1"),we(e.id,"id"),Lo(e),(!Array.isArray(e.forms)||e.forms.length===0||e.forms.length>12)&&E("forms must contain 1-12 entries"),(!Array.isArray(e.screens)||e.screens.length===0||e.screens.length>20)&&E("screens must contain 1-20 entries");let t=new Map,n=new Map;for(let l of e.forms)lc(l,n,t);let r=new Set,o=new Set,i=new Map,a=0,s=new Set;for(let l of e.screens){if(cc(l,s,n,i),l.type==="form"){r.has(l.form)&&E(`form ${l.form} may be referenced only once`),r.add(l.form);for(let c of n.get(l.form).fields)i.set(`${l.form}.${c.id}`,c);if(l.when===void 0)for(let c of n.get(l.form).fields)c.required&&o.add(`${l.form}.${c.id}`)}l.type==="screenshot"&&++a>1&&E("only one screenshot screen is supported")}for(let l of n.keys())r.has(l)||E(`form ${l} is unused`);return e.screens.every(l=>l.when!==void 0)&&E("at least one screen must be unconditional"),dc(e.issue,t,o),pc(e.evidence,t),Sn(structuredClone(e))}function lc(e,t,n){j(e)||E("form must be an object"),N(e,new Set(["id","title","description","fields"]),"form"),we(e.id,"form id"),t.has(e.id)&&E(`duplicate form id ${e.id}`),ve(e.title,"form title",500),me(e.description,"form description",2e3),(!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)&&E("form fields must contain 1-20 entries");let r=new Set;for(let o of e.fields)(!j(o)||typeof o.type!="string"||!(o.type in Fo))&&E("field type is unsupported"),N(o,Fo[o.type],"field"),we(o.id,"field id"),r.has(o.id)&&E(`duplicate field id ${o.id}`),r.add(o.id),ve(o.label,"field label",500),me(o.helpText,"field helpText",1e3),o.required!==void 0&&typeof o.required!="boolean"&&E("field required must be boolean"),Co(o),n.set(`${e.id}.${o.id}`,o);t.set(e.id,e)}function cc(e,t,n,r){j(e)||E("screen must be an object"),we(e.id,"screen id"),t.has(e.id)&&E(`duplicate screen id ${e.id}`),t.add(e.id),["message","form","screenshot"].includes(e.type)||E("screen type is unsupported");let o=e.type==="message"?new Set(["id","type","when","title","description","continueLabel"]):e.type==="form"?new Set(["id","type","when","form","continueLabel","backLabel"]):new Set(["id","type","when","title","description","mode","continueLabel","backLabel"]);N(e,o,"screen"),Object.prototype.hasOwnProperty.call(e,"when")&&Mo(e.when,r),e.type==="message"&&(ve(e.title,"message title",500),me(e.description,"message description",2e3)),e.type==="form"&&!n.has(e.form)&&E(`screen references unknown form ${e.form}`),e.type==="screenshot"&&!["optional","auto","required"].includes(e.mode)&&E("screenshot mode is invalid"),e.type==="screenshot"&&(me(e.title,"screenshot title",500),me(e.description,"screenshot description",2e3)),me(e.continueLabel,"screen continueLabel",120),e.type!=="message"&&me(e.backLabel,"screen backLabel",120)}function Mo(e,t){if(j(e)||E("condition must be an object"),xn(e),"answer"in e){N(e,new Set(["answer","equals"]),"answer condition");let o=t.get(e.answer);o||E(`condition answer must reference an earlier field: ${e.answer}`),kn(e.equals,"condition equals"),To(o,e.equals);return}if("context"in e){N(e,new Set(["context","equals"]),"context condition"),we(e.context,"condition context"),kn(e.equals,"condition equals");return}let n="all"in e?"all":"any"in e?"any":null;n||E("condition must contain answer, context, all, or any"),N(e,new Set([n]),"condition group");let r=n==="all"?e.all:e.any;(!Array.isArray(r)||r.length<1||r.length>8)&&E(`condition ${n} must contain 1-8 entries`);for(let o of r)Mo(o,t)}function dc(e,t,n){if(j(e)||E("issue must be an object"),N(e,new Set(["classification","title","sections"]),"issue"),ve(e.title,"issue title",2e3),e.classification!==void 0&&!["bug","feature","question"].includes(e.classification)&&E("issue classification is invalid"),mc(e.title,t,n),e.sections!==void 0){(!Array.isArray(e.sections)||e.sections.length>20)&&E("issue sections are invalid");let r=new Set;for(let o of e.sections)uc(o,t,r)}}function uc(e,t,n){j(e)||E("issue section must be an object"),"answer"in e?(N(e,new Set(["heading","answer","format","omitWhenEmpty"]),"issue section"),Do(e.answer,t,"issue section")):(N(e,new Set(["heading","context","format","omitWhenEmpty"]),"issue section"),we(e.context,"issue context")),ve(e.heading,"issue section heading",120);let r=e.heading.trim().toLowerCase();n.has(r)&&E(`duplicate issue section heading ${e.heading}`),n.add(r),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean"&&E("issue section omitWhenEmpty must be boolean");let o=e.format??"text";if("answer"in e){["text","quote","stars","choice","code"].includes(o)||E("issue answer format is invalid");let i=t.get(e.answer);o==="stars"&&i.type!=="rating"&&E("stars format requires a rating field"),o==="choice"&&i.type!=="singleChoice"&&E("choice format requires a singleChoice field")}else["text","code"].includes(o)||E("issue context format is invalid")}function pc(e,t){e!==void 0&&(j(e)||E("evidence must be an object"),N(e,new Set(["attachments","sendConsoleLogs","submitter"]),"evidence"),Ao(e.attachments,"attachments",t,"attachments"),Ao(e.sendConsoleLogs,"checkbox",t,"sendConsoleLogs"),e.submitter!==void 0&&(j(e.submitter)||E("evidence submitter must be an object"),N(e.submitter,new Set(["name","email"]),"evidence submitter"),!e.submitter.name&&!e.submitter.email&&E("evidence submitter must map name or email"),e.submitter.name&&Po(e.submitter.name,t,"submitter name"),e.submitter.email&&Po(e.submitter.email,t,"submitter email")))}function Ao(e,t,n,r){e!==void 0&&n.get(e)?.type!==t&&E(`${r} must reference a ${t} field`)}function Do(e,t,n){(!Ro.test(e)||!t.has(e)||t.get(e)?.type==="attachments")&&E(`${n} references an unknown scalar answer: ${e}`)}function Po(e,t,n){let r=t.get(e)?.type;(!Ro.test(e)||r!=="shortText"&&r!=="longText")&&E(`${n} must reference a text field`)}function mc(e,t,n){let r=0,o=!1,i="";for(let s of e.matchAll(/{{\s*([^{}]+?)\s*}}/g)){let l=s.index,c=e.slice(r,l);i+=c,(c.includes("{{")||c.includes("}}")||c.endsWith("{"))&&E("issue title template is malformed");let d=s[1].trim();Do(d,t,"issue title"),o||=n.has(d),r=l+s[0].length,e[r]==="}"&&E("issue title template is malformed")}let a=e.slice(r);(a.includes("{{")||a.includes("}}"))&&E("issue title template is malformed"),i+=a,!i.trim()&&!o&&E("issue title must contain text or reference a required answer")}var bc="bugdrop-default@1";function fc(e){if(e)return Object.freeze(Object.fromEntries(Object.entries(e).map(([t,n])=>[t,Array.isArray(n)?Object.freeze([...n]):n])))}function Io(e){let t=!e.skipWelcome&&e.welcome!=="never"&&!(e.welcome==="once"&&e.hasSeenWelcome),n=Object.freeze([Object.freeze({kind:"welcome",enabled:t,remember:t&&e.welcome==="once"}),Object.freeze({kind:"details",repo:e.repo,showName:e.showName,requireName:e.requireName,showEmail:e.showEmail,requireEmail:e.requireEmail,sendConsoleLogs:e.sendConsoleLogs}),Object.freeze({kind:"screenshot",mode:e.screenshotMode,repo:e.repo,screenshotScale:e.screenshotScale,elementContextMaxArea:e.elementContextMaxArea,accentColor:e.accentColor})]),r={configVersion:1,id:"bugdrop-default-v1",presentation:{kind:"modal"},forms:[{id:"details",title:"Send Feedback",fields:[{id:"title",type:"shortText",label:"Title",required:!0},{id:"description",type:"longText",label:"Description"},{id:"category",type:"singleChoice",label:"Category",required:!0,options:[{value:"bug",label:"Bug"},{value:"feature",label:"Feature"},{value:"question",label:"Question"}]},{id:"attachments",type:"attachments",label:"Attachments"},{id:"send-console-logs",type:"checkbox",label:"Include console logs"},{id:"name",type:"shortText",label:"Name"},{id:"email",type:"shortText",label:"Email"}]}],screens:[{id:"welcome",type:"message",title:"Share feedback",when:{context:"show-welcome",equals:!0}},{id:"details",type:"form",form:"details"},{id:"screenshot",type:"screenshot",mode:e.screenshotMode}],issue:{classification:"bug",title:"{{details.title}}",sections:[{heading:"Description",answer:"details.description",omitWhenEmpty:!0}]},evidence:{attachments:"details.attachments",sendConsoleLogs:"details.send-console-logs",submitter:{name:"details.name",email:"details.email"}}},o=Ht(jt(r));return Object.freeze({id:bc,flow:o,steps:n,system:Object.freeze({preflight:Object.freeze({kind:"installation",repo:e.repo,apiUrl:e.apiUrl,authTokenProvider:e.authTokenProvider}),submission:Object.freeze({kind:"legacy-feedback",repo:e.repo,apiUrl:e.apiUrl,authTokenProvider:e.authTokenProvider,categoryLabels:fc(e.categoryLabels),issueLinkVisibility:e.issueLinkVisibility})})})}function zo(e){return Object.freeze({instanceId:ee(e),result:Promise.resolve({status:"busy"}),close(){}})}function Oo(e,t,n,r){let o=Bo(e,n),i=document.createElement("input");return i.type="checkbox",i.id=o.controlId,i.checked=typeof r[`${t}.${e.id}`]=="boolean"?!!r[`${t}.${e.id}`]:!!e.initialValue,i.setAttribute("aria-required",String(e.required??!1)),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy),o.wrapper.classList.add("bdf-checkbox"),o.wrapper.insertBefore(i,o.label),{id:e.id,required:!!e.required,element:o.wrapper,read:async()=>({ok:!0,value:i.checked}),setRequiredError(a){o.setError(i,a?"This checkbox is required.":null)},focus:()=>i.focus(),dispose(){}}}function No(e,t,n,r){let o=Bo(e,n);o.wrapper.classList.add("bdf-attachment");let i=document.createElement("input");i.className="bdv-input",i.type="file",i.id=o.controlId,i.multiple=(e.maxFiles??5)>1,i.setAttribute("aria-required",String(e.required??!1)),e.accept&&(i.accept=e.accept.join(",")),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy);let a=document.createElement("ul");a.className="bdf-file-list",a.setAttribute("aria-live","polite"),o.wrapper.insertBefore(i,o.error),o.wrapper.insertBefore(a,o.error);let s=r[`${t}.${e.id}`],l=Array.isArray(s)?[...s]:[],c=!1,d=Promise.resolve(),u=0;$o(a,l.map(m=>m.name));let g=()=>{let m=++u;c=!1,o.setError(i,null);let b=Array.from(i.files??[]);d=gc(b,e).then(h=>{m===u&&(l=h,$o(a,h.map(k=>k.name)))}).catch(h=>{m===u&&(c=!0,o.setError(i,h instanceof Error?h.message:"Could not read the selected attachment."))})};return i.addEventListener("change",g),{id:e.id,required:!!e.required,element:o.wrapper,async read(m){for(;;){let b=d;if(await b,b===d)break}return c&&m?{ok:!1}:{ok:!0,value:l}},setRequiredError(m){c||o.setError(i,m?"Select at least one attachment.":null)},focus:()=>i.focus(),dispose:()=>{u+=1,i.removeEventListener("change",g)}}}function Bo(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=document.createElement("label");if(o.className="bdv-label",o.htmlFor=r,o.textContent=e.label,e.required){let s=document.createElement("span");s.className="bdv-required",s.textContent=" *",s.setAttribute("aria-hidden","true"),o.appendChild(s)}n.appendChild(o);let i=[];if(e.helpText){let s=document.createElement("div");s.className="bdv-help",s.id=`${r}-help`,s.textContent=e.helpText,n.appendChild(s),i.push(s.id)}let a=document.createElement("div");return a.className="bdv-error",a.id=`${r}-error`,a.hidden=!0,a.setAttribute("aria-live","polite"),n.appendChild(a),i.push(a.id),{wrapper:n,label:o,error:a,controlId:r,describedBy:i.join(" ")||null,setError(s,l){a.textContent=l??"",a.hidden=!l,l?s.setAttribute("aria-invalid","true"):s.removeAttribute("aria-invalid")}}}async function gc(e,t){if(e.length>(t.maxFiles??5))throw new TypeError(`Select at most ${t.maxFiles??5} attachments.`);return Promise.all(e.map(n=>hc(n,t.maxFileSize??5*1024*1024,t.accept)))}async function hc(e,t,n){if(!qt(e.type))throw new TypeError(`${e.name} has an unsupported file type.`);if(n&&!n.includes(e.type))throw new TypeError(`${e.name} is not an accepted file type.`);if(e.size>t)throw new TypeError(`${e.name} is too large.`);let r=await new Promise((o,i)=>{let a=new FileReader;a.addEventListener("load",()=>typeof a.result=="string"?o(a.result):i(new Error("Could not read the selected attachment."))),a.addEventListener("error",()=>i(new Error("Could not read the selected attachment."))),a.readAsDataURL(e)});return{name:e.name,type:e.type,size:e.size,dataUrl:r}}function $o(e,t){e.replaceChildren(...t.map(n=>{let r=document.createElement("li");return r.textContent=n,r}))}function _o(e,t,n){let r=wc(e),o=document.createElement("div");o.className="bdv-fields",r.appendChild(o);let i=e.fields.map(s=>yc(s,e.id,t,n));for(let s of i)o.appendChild(s.element);let a=async s=>{let l=i.filter(Ec);for(let d of l)d.setError(null);let c=Object.fromEntries(l.map(d=>[d.field.id,d.getValue()]));if(s)try{c=$e(e.fields.filter(xc),c)}catch(d){return vc(d,l),null}for(let d of i.filter(kc)){d.setRequiredError(!1);let u=await d.read(s);if(!u.ok)return d.focus(),null;if(s&&d.required&&(u.value===!1||Array.isArray(u.value)&&u.value.length===0))return d.setRequiredError(!0),d.focus(),null;c[d.id]=u.value}return c};return{element:r,collect:()=>a(!0),snapshot:()=>a(!1),dispose(){for(let s of i)s.dispose()}}}function yc(e,t,n,r){if(e.type==="checkbox")return Oo(e,t,n,r);if(e.type==="attachments")return No(e,t,n,r);let o=Ot(e,n);return o.setValue(r[`${t}.${e.id}`]??""),o}function wc(e){let t=document.createElement("section");t.className="bdv-surface";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function vc(e,t){let n=e instanceof se?t.find(r=>r.field.id===e.fieldId):void 0;n?.setError(e instanceof Error?e.message.replace(/^Answer \S+ /,""):"Invalid answer"),n?.focus()}function xc(e){return e.type!=="checkbox"&&e.type!=="attachments"}function Ec(e){return"field"in e}function kc(e){return"read"in e}function Ho(e){let t=document.createElement("section");t.className="bdv-surface bdf-message";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function Vo(e,t,n,r,o){let i=document.activeElement instanceof HTMLElement?document.activeElement:null,a=document.body.style.getPropertyValue("overflow"),s=document.body.style.getPropertyPriority("overflow"),l=document.createElement("div");l.dataset.bugdropOwned="",l.dataset.bugdropFlow=e,l.dataset.bugdropInstance=t,Object.assign(l.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let c=l.attachShadow({mode:"open"}),d=n(c),u=document.createElement("div");u.className="bdv-overlay",d.root.appendChild(u);let g=()=>{},m=()=>{},b=!1;return{host:l,shadow:c,overlay:u,activate(h){document.body.style.setProperty("overflow","hidden"),document.body.appendChild(l),m=de(l),c.addEventListener("keydown",r),u.addEventListener("pointerdown",o),g=zt({close:h})},dispose(){b||(b=!0,g(),c.removeEventListener("keydown",r),u.removeEventListener("pointerdown",o),m(),d.dispose(),l.remove(),a?document.body.style.setProperty("overflow",a,s):document.body.style.removeProperty("overflow"),i?.isConnected&&i.focus())}}}function Uo(e,t,n){let r=e.querySelector(".bdv-title"),o=`${t}-title`;return r&&(r.id=o),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby",o),e.tabIndex=-1,e.dataset.size=n,e}function qo(e,t,n,r,o){let i=t.screen,a=He("\xD7","bdv-close");a.setAttribute("aria-label","Close"),a.addEventListener("click",o,{once:!0}),e.prepend(a);let s=document.createElement("p");s.className="bdf-progress",s.textContent=`Step ${t.position} of ${t.total}`,e.querySelector(".bdv-header")?.prepend(s);let l=document.createElement("div");if(l.className="bdv-actions",t.canGoBack){let u=He(i.type==="message"?"Back":i.backLabel??"Back","bdv-cancel bdf-back");u.addEventListener("click",n),l.appendChild(u)}let c=i.continueLabel??(t.hasNext?"Continue":"Submit"),d=He(c,"bdv-submit");d.addEventListener("click",r),l.appendChild(d),e.appendChild(l)}function Wo(e){let t=Ve(e.title??"Add a screenshot",e.description??(e.mode==="required"?"A screenshot is required before submitting.":"Include a screenshot to help explain your feedback."));if(e.mode==="optional"){let n=document.createElement("label");n.className="bdf-checkbox";let r=document.createElement("input");r.type="checkbox",r.checked=!0,r.dataset.screenshot="",n.append(r,document.createTextNode("Include a screenshot")),t.appendChild(n)}return t}function Ve(e,t){let n=document.createElement("section");n.className="bdv-surface";let r=document.createElement("div");r.className="bdv-header";let o=document.createElement("h2");o.className="bdv-title",o.textContent=e;let i=document.createElement("p");return i.className="bdv-description",i.textContent=t,r.append(o,i),n.appendChild(r),n}function jo(e,t,n,r){let o=Ve("Submission failed",e),i=document.createElement("div");i.className="bdv-actions";let a=He("Try again","bdv-submit");a.addEventListener("click",n);let s=He(t,"bdv-cancel");return s.addEventListener("click",r),i.append(a,s),o.appendChild(i),o}function Go(e,t,n){let r=Ve(e.config.content?.successTitle??"Thanks for your feedback!",e.config.content?.successMessage??"Your response was submitted.");if(t.isPublic){let i=document.createElement("a");i.className="bdv-success-link",i.href=t.issueUrl,i.target="_blank",i.rel="noopener noreferrer",i.textContent="View GitHub Issue",r.appendChild(i)}let o=He("Done","bdv-submit");return o.addEventListener("click",n),r.appendChild(o),r}function Xo(e){return e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href]")}function Ko(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}function Yo(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&!t.closest('[inert], [aria-hidden="true"]'))}function He(e,t){let n=document.createElement("button");return n.type="button",n.className=t,n.textContent=e,n}var Sc={"slide-horizontal":{defaultDurationMs:500,classes:e=>({enter:`bdf-slide-${e}-enter`,exit:`bdf-slide-${e}-exit`})},"slide-vertical":{defaultDurationMs:500,classes:e=>({enter:`bdf-slide-vertical-${e}-enter`,exit:`bdf-slide-vertical-${e}-exit`})},fade:{defaultDurationMs:350,classes:()=>({enter:"bdf-fade-enter",exit:"bdf-fade-exit"})},"scale-fade":{defaultDurationMs:450,classes:()=>({enter:"bdf-scale-fade-enter",exit:"bdf-scale-fade-exit"})}},Cc={defaultDurationMs:500,classes:()=>({enter:"bdf-custom-enter",exit:"bdf-custom-exit"})},Tc={standard:"cubic-bezier(.2, .8, .2, 1)",linear:"linear","ease-in":"ease-in","ease-out":"ease-out","ease-in-out":"ease-in-out"};function Jo(e,t){let n=()=>{},r=Lc(t),o=t&&t.kind!=="none"?t.durationMs??r?.defaultDurationMs:void 0;return o!==void 0&&e.style.setProperty("--bdf-screen-transition-duration",`${o}ms`),{show:(a,s)=>{n();let l=Array.from(e.children).find(b=>b instanceof HTMLElement&&b.classList.contains("bdv-surface"));if(!s||!l||!r||Ac()){e.replaceChildren(a);return}l.setAttribute("aria-hidden","true"),l.setAttribute("inert",""),t?.kind==="custom"&&Fc(e,t,s);let c=r.classes(s);l.classList.add(c.exit),a.classList.add(c.enter),e.classList.add("bdf-transitioning"),e.appendChild(a);let d=!1,u=()=>{d||(d=!0,window.clearTimeout(m),a.removeEventListener("animationend",g),l.remove(),a.classList.remove(c.enter),e.classList.remove("bdf-transitioning"),n=()=>{})},g=b=>{b.target===a&&u()};a.addEventListener("animationend",g);let m=window.setTimeout(u,(o??r.defaultDurationMs)+60);n=u},dispose(){n()}}}function Lc(e){if(!(!e||e.kind==="none"))return e.kind==="custom"?Cc:Sc[e.kind]}function Fc(e,t,n){let r=t[n];Zo(e,"enter",r.enterFrom),Zo(e,"exit",r.exitTo),e.style.setProperty("--bdf-screen-transition-easing",Tc[t.easing??"standard"])}function Zo(e,t,n){e.style.setProperty(`--bdf-custom-${t}-opacity`,String(n.opacity??1)),e.style.setProperty(`--bdf-custom-${t}-x`,`${n.translateX??0}px`),e.style.setProperty(`--bdf-custom-${t}-y`,`${n.translateY??0}px`),e.style.setProperty(`--bdf-custom-${t}-scale`,String(n.scale??1))}function Ac(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function Qo(e,t){let n={id:t.id,presentation:t.presentation,appearance:t.appearance,content:{title:t.id},fields:[{id:"placeholder",type:"shortText",label:"Placeholder"}],issue:{title:t.id}},r=Oe(e,n,"modal"),o=document.createElement("style");return o.textContent=`
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
  `,e.prepend(o),{root:r.root,dispose(){o.remove(),r.dispose()}}}function ei(e,t,n){let r=Wt(e,t);return ze(),new Cn(e,r,n).open()}var Cn=class{constructor(t,n,r){this.definition=t;this.ports=r;this.instanceId=ee(t.flowId),this.previousFocus=Ko(),this.runtime=new Ne(t,n.context,n.initialAnswers),this.result=new Promise(o=>{this.resolveOutcome=o}),this.state=Vo(t.flowId,this.instanceId,o=>Qo(o,t.config),o=>this.onKeydown(o),o=>this.onBackdrop(o)),this.screenTransition=Jo(this.state.overlay,t.config.presentation.screenTransition)}definition;ports;instanceId;previousFocus;runtime;result;resolveOutcome;state;screenTransition;currentForm=null;settled=!1;closed=!1;busy=!1;dialogVersion=0;routePreviewVersion=0;preflightVersion=0;captureAbortController=null;open(){let t=Object.freeze({instanceId:this.instanceId,result:this.result,close:()=>this.close()});this.state.activate(t.close);let n=Ve("Preparing feedback","Checking installation\u2026");return n.setAttribute("aria-busy","true"),this.show(n),this.preflight(),t}async preflight(){let t=++this.preflightVersion;try{let n=await this.ports.preflight();if(this.closed||t!==this.preflightVersion)return;if(n.status==="installed")this.render();else{let r=n.status==="not_installed"?`Install the ${n.appName??"BugDrop"} GitHub App to continue.`:"BugDrop could not reach the feedback service.";this.renderError(r,()=>{this.preflight()})}}catch{!this.closed&&t===this.preflightVersion&&this.renderError("BugDrop could not reach the feedback service.",()=>{this.preflight()})}}render(t){this.disposeForm();let n=this.runtime.route(),r=n.screen;if(!r){this.finish();return}let o;if(r.type==="message")o=Ho(r);else if(r.type==="form"){let i=this.definition.config.forms.find(a=>a.id===r.form);this.currentForm=_o(i,this.instanceId,this.runtime.answers),o=this.currentForm.element}else o=Wo(r);if(qo(o,n,()=>{this.back(r)},()=>{this.advance(r,o)},()=>this.close()),r.type==="form"){let i=()=>{this.previewFormRoute(r.form,o)};o.addEventListener("input",i),o.addEventListener("change",i)}this.show(o,t)}async previewFormRoute(t,n){let r=++this.routePreviewVersion,o=await this.currentForm?.snapshot();if(!o||r!==this.routePreviewVersion||!n.isConnected||this.closed)return;this.runtime.setFormAnswers(t,o);let i=this.runtime.route(),a=i.screen;if(!a)return;let s=n.querySelector(".bdf-progress");s&&(s.textContent=`Step ${i.position} of ${i.total}`);let l=n.querySelector(".bdv-submit");l&&(l.textContent=a.continueLabel??(i.hasNext?"Continue":"Submit"))}async back(t){if(!this.busy){if(this.busy=!0,t.type==="form"){let n=await this.currentForm?.snapshot();if(n===null||this.closed){this.busy=!1;return}n&&this.runtime.setFormAnswers(t.form,n)}this.runtime.back(),this.busy=!1,this.render("backward")}}async advance(t,n){if(!this.busy){if(this.busy=!0,t.type==="form"){let r=await this.currentForm?.collect();if(!r||this.closed){this.busy=!1;return}this.runtime.setFormAnswers(t.form,r)}if(t.type==="screenshot"){this.busy=!1,await this.capture(t,n);return}this.runtime.next()?(this.busy=!1,this.render("forward")):(this.busy=!1,await this.finish())}}async capture(t,n){let r=t.mode!=="optional"||!!n.querySelector("[data-screenshot]")?.checked;this.busy=!0,this.state.host.hidden=!0;let o=new AbortController;this.captureAbortController=o;let i;try{let a=await this.ports.capture(t,r,o.signal);if(this.closed)return;if(i=a.returnToForm?"backward":"forward",a.returnToForm)this.runtime.back();else if(this.runtime.capture=a,!this.runtime.next()){this.busy=!1,await this.finish();return}}finally{this.captureAbortController===o&&(this.captureAbortController=null),this.busy=!1,this.state.host.hidden=!1}this.closed||this.render(i)}async finish(){if(this.busy||this.closed)return;this.busy=!0;let t=Ve("Submitting feedback","Submitting\u2026");t.setAttribute("aria-busy","true"),this.show(t);try{let n=await this.ports.submit(this.runtime);if(this.closed)return;this.settle({status:"submitted",result:n}),this.busy=!1,this.show(Go(this.definition,n,()=>this.close(!1)))}catch(n){if(this.closed)return;this.busy=!1,this.renderError(n instanceof Error?n.message:"Failed to submit feedback",()=>{this.finish()})}}renderError(t,n){this.show(jo(t,this.definition.config.content?.cancelLabel??"Cancel",n,()=>this.close()))}show(t,n){Uo(t,`${this.instanceId}-surface-${++this.dialogVersion}`,this.definition.config.presentation.size??"default"),this.screenTransition.show(t,n),queueMicrotask(()=>(Xo(t)??t).focus())}close(t=!0){this.closed||(this.closed=!0,this.preflightVersion+=1,this.captureAbortController?.abort(),this.captureAbortController=null,t&&this.settle({status:"closed"}),this.disposeForm(),this.screenTransition.dispose(),this.state.dispose(),this.previousFocus?.isConnected&&this.previousFocus.focus())}settle(t){this.settled||(this.settled=!0,this.resolveOutcome(t))}disposeForm(){this.routePreviewVersion+=1,this.currentForm?.dispose(),this.currentForm=null}onKeydown(t){if(!(t instanceof KeyboardEvent))return;if(t.key==="Escape"){t.preventDefault(),this.close();return}if(t.key!=="Tab")return;let n=Yo(this.state.overlay);if(!n.length){t.preventDefault(),this.state.overlay.querySelector('[role="dialog"]')?.focus();return}let r=n[0],o=n.at(-1),i=this.state.shadow.activeElement;t.shiftKey&&(i===r||!this.state.overlay.contains(i))?(t.preventDefault(),o.focus()):!t.shiftKey&&i===o&&(t.preventDefault(),r.focus())}onBackdrop(t){t.target===this.state.overlay&&this.close()}};function ni(e,t,n){let r=Pc(e.issue.title,t).trim().slice(0,256);if(!r)throw new TypeError("BugDrop flow Issue title cannot be empty");let o=(e.issue.sections??[]).map(i=>Rc(e,i,t,n)).filter(i=>i!==null);return{title:r,description:o.join(`

`),category:e.issue.classification??"bug"}}function Pc(e,t){return e.replace(/{{\s*([^{}]+?)\s*}}/g,(n,r)=>ri(t[r.trim()]))}function Rc(e,t,n,r){let o="answer"in t?n[t.answer]:r[t.context];if(t.omitWhenEmpty&&(o==null||o===""))return null;let i=Mc(e,t,o);return`## ${t.heading}

${i}`}function Mc(e,t,n){let r=t.format,o=ri(n);if(r==="quote")return o.split(`
`).map(i=>`> ${i}`).join(`
`);if(r==="code")return Dc(o);if(r==="stars"&&typeof n=="number"&&"answer"in t){let i=ti(e,t.answer),a=i?.type==="rating"?i.scale??5:5;return`${"\u2605".repeat(n)}${"\u2606".repeat(Math.max(0,a-n))} (${n}/${a})`}if(r==="choice"&&typeof n=="string"&&"answer"in t){let i=ti(e,t.answer);if(i?.type==="singleChoice")return i.options.find(a=>a.value===n)?.label??o}return o}function Dc(e){let t=Math.max(0,...[...e.matchAll(/`+/g)].map(o=>o[0].length)),n="`".repeat(t+1),r=e.startsWith("`")||e.endsWith("`")?" ":"";return`${n}${r}${e}${r}${n}`}function ti(e,t){let n=t.indexOf("."),r=t.slice(0,n),o=t.slice(n+1);return e.forms.find(i=>i.id===r)?.fields.find(i=>i.id===o)}function ri(e){return e==null?"":typeof e=="string"?e.trim():String(e)}async function ii(e,t,n,r,o){let i=ni(t,n,r),a=t.evidence?.attachments,s=t.evidence?.sendConsoleLogs,l=t.evidence?.submitter?.name,c=t.evidence?.submitter?.email,d=l||c?{name:oi(n[l??""]),email:oi(n[c??""])}:void 0,u=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(e.authTokenProvider)},body:JSON.stringify({repo:e.repo,title:i.title,description:i.description,category:i.category,categoryLabels:e.categoryLabels,screenshot:o?.screenshot??null,attachments:a?n[a]??[]:[],consoleLogs:s&&n[s]===!0?Rt():void 0,submitter:d&&(d.name||d.email)?d:void 0,metadata:zc(o)})});if(u.status===429)throw new Error("Too many submissions. Please try again later.");let g=await u.json();if(!u.ok||g.success!==!0)throw new Error(typeof g.error=="string"?g.error:"Failed to submit feedback");if(!Number.isInteger(g.issueNumber)||g.issueNumber<=0||typeof g.issueUrl!="string"||typeof g.isPublic!="boolean"||!Ic(g.issueUrl,e.repo,g.issueNumber))throw new Error("BugDrop received an invalid Issue result");return{issueNumber:g.issueNumber,issueUrl:g.issueUrl,isPublic:g.isPublic,...Array.isArray(g.labelMappingWarnings)&&g.labelMappingWarnings.every(m=>typeof m=="string")?{labelMappingWarnings:g.labelMappingWarnings}:{}}}function Ic(e,t,n){try{let r=new URL(e);return r.origin==="https://github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function zc(e){let t=new URL(window.location.href);return t.search="",t.hash="",{url:t.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:e?.elementSelector??null,fullElementSelector:e?.fullElementSelector??null,domNodeCount:Re(),fullPageDisabled:re(),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function oi(e){return typeof e=="string"&&e.trim()?e.trim():void 0}function ai(e,t,n={isLegacyModalOpen:()=>!1}){let r=new Map;return{register(o){let i=jt(o);if(r.has(i.id))throw new TypeError(`BugDrop flow is already registered: ${i.id}`);let a=Ht(i);return r.set(i.id,a),Object.freeze({id:i.id,open(s){return n.isLegacyModalOpen()?(Wt(a,s),zo(i.id)):ei(a,s,{...t,submit:l=>ii(e,i,l.answers,l.context,l.capture)})}})}}}var lt="bugdrop_dismissed",$c="bugdrop_trigger_position_",bi="bugdrop_welcomed_",Oc="bugdrop_complex_screenshot_skipped_",Nc=10080*60*1e3,it=8,si=16,li=5,ci=5*1024*1024,fi=["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"];function Bc(e){let t=[{name:"Edge",pattern:/Edg(?:e|A|iOS)?\/(\d+[\d.]*)/},{name:"Opera",pattern:/(?:OPR|Opera)\/(\d+[\d.]*)/},{name:"Chrome",pattern:/Chrome\/(\d+[\d.]*)/},{name:"Safari",pattern:/Version\/(\d+[\d.]*).*Safari/},{name:"Firefox",pattern:/Firefox\/(\d+[\d.]*)/}];for(let{name:n,pattern:r}of t){let o=e.match(r);if(o)return{name:n,version:o[1]||"unknown"}}return{name:"Unknown",version:"unknown"}}function _c(e){let t=[{name:"iOS",pattern:/iPhone OS (\d+[_\d]*)/,versionIndex:1},{name:"iOS",pattern:/iPad.*OS (\d+[_\d]*)/,versionIndex:1},{name:"macOS",pattern:/Mac OS X (\d+[_.\d]*)/,versionIndex:1},{name:"Windows",pattern:/Windows NT (\d+\.\d+)/,versionIndex:1},{name:"Android",pattern:/Android (\d+[\d.]*)/,versionIndex:1},{name:"Linux",pattern:/Linux/,versionIndex:void 0},{name:"Chrome OS",pattern:/CrOS/,versionIndex:void 0}];for(let{name:n,pattern:r,versionIndex:o}of t){let i=e.match(r);if(i){let a=o!==void 0&&i[o]?i[o].replace(/_/g,"."):"";return{name:n,version:a}}}return{name:"Unknown",version:""}}function gi(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return e.split("?")[0].split("#")[0]}}function Hc(){let e=navigator.userAgent;return{browser:Bc(e),os:_c(e),devicePixelRatio:window.devicePixelRatio||1,language:navigator.language||"unknown",url:gi(window.location.href)}}var Vc=null,K=null,at=null,Y=!1,Uc=null,Ue=!1;function di(e){try{let t=localStorage.getItem(lt);if(!t)return!1;if(t==="true")return!0;let n=parseInt(t,10);if(isNaN(n))return!1;if(e===void 0)return!0;let r=e*24*60*60*1e3;return Date.now()-n<r}catch{return!1}}function hi(){try{localStorage.setItem(lt,Date.now().toString())}catch{}}function yi(e){try{return localStorage.getItem(bi+e)!==null}catch{return!1}}function wi(e){try{localStorage.setItem(bi+e,Date.now().toString())}catch{}}function Mn(e){return`${Oc}${e}:${gi(window.location.href)}`}function qc(e){try{let t=Mn(e),n=localStorage.getItem(t);if(!n)return!1;let r=parseInt(n,10);return isNaN(r)||Date.now()-r>Nc?(localStorage.removeItem(t),!1):!0}catch{return!1}}function Wc(e){try{localStorage.setItem(Mn(e),Date.now().toString())}catch{}}function jc(e){try{localStorage.removeItem(Mn(e))}catch{}}function vi(e,t){re()&&(Wc(e.repo),t.includeScreenshot=!1)}function Gc(e){if(!e)return;let t;try{t=JSON.parse(e)}catch(o){let i=o instanceof Error?`: ${o.message}`:"";console.warn(`[BugDrop] Invalid data-category-labels JSON${i}. Using default GitHub labels.`);return}if(!t||typeof t!="object"||Array.isArray(t)){console.warn("[BugDrop] Invalid data-category-labels: expected a JSON object. Using default GitHub labels.");return}let n=["bug","feature","question"],r={};for(let[o,i]of Object.entries(t)){if(!n.includes(o)){console.warn(`[BugDrop] Invalid data-category-labels: unknown category "${o}" (expected ${n.join(", ")}). Ignoring.`);continue}typeof i=="string"||Array.isArray(i)&&i.every(a=>typeof a=="string")?r[o]=i:console.warn(`[BugDrop] Invalid data-category-labels: value for "${o}" must be a string or string array. Ignoring.`)}return Object.keys(r).length>0?r:void 0}var M=document.currentScript||document.querySelector('script[src*="bugdrop"][src*="widget"]');document.currentScript||console.warn("[BugDrop] document.currentScript is null \u2014 do not use async or defer on the BugDrop script tag.");var st=M?.dataset.theme;st&&!Et(st)&&console.warn(`[BugDrop] Invalid data-theme "${st}". Expected "light", "dark", or "auto".`);var Xc=cr(M?.dataset.locale||document.documentElement.lang),ui=M?.dataset.requireName==="true",pi=M?.dataset.requireEmail==="true",rt=M?.dataset.position;rt&&rt!=="bottom-right"&&rt!=="bottom-left"&&console.warn(`[BugDrop] Invalid data-position "${rt}". Expected "bottom-right" or "bottom-left".`);var xi=M?.dataset.dismissDuration,Ei=sr(xi);xi&&Ei===void 0&&console.warn("[BugDrop] Invalid data-dismiss-duration. Expected a positive whole number of days.");var ki=M?.dataset.screenshotScale,Si=nn(ki);ki&&Si===void 0&&console.warn("[BugDrop] Invalid data-screenshot-scale. Expected a non-negative number.");var Ci=M?.dataset.elementContextMaxArea,Ti=nn(Ci);Ci&&Ti===void 0&&console.warn("[BugDrop] Invalid data-element-context-max-area. Expected a non-negative number.");var Li=M?.dataset.shadow,Fi=pt(Li);Li&&!Fi&&console.warn('[BugDrop] Invalid data-shadow. Expected "soft", "hard", or "none".');var Ee=M?.dataset.showIssueLink,Ai=Ee==="always"||Ee==="never"?Ee:"public";Ee&&Ee!=="public"&&Ee!==Ai&&console.warn(`[BugDrop] Invalid data-show-issue-link "${Ee}". Expected "public", "always", or "never".`);var ot={repo:M?.dataset.repo||"",apiUrl:M?.src.replace(/\/widget(?:\.v[\d.]+)?\.js$/,"/api")||"",authTokenProvider:Kr(M?.dataset.authTokenProvider),position:rt==="bottom-left"?"bottom-left":"bottom-right",theme:Et(st)?st:"auto",showName:M?.dataset.showName==="true"||ui,requireName:ui,showEmail:M?.dataset.showEmail==="true"||pi,requireEmail:pi,buttonDismissible:M?.dataset.buttonDismissible==="true",dismissDuration:Ei,showRestore:M?.dataset.showRestore!=="false",showButton:M?.dataset.button!=="false",accentColor:H(M?.dataset.color),iconUrl:je(M?.dataset.icon),label:M?.dataset.label||void 0,categoryLabels:Gc(M?.dataset.categoryLabels),font:Ae(M?.dataset.font),radius:Q(M?.dataset.radius)?.toString(),bgColor:H(M?.dataset.bg),textColor:H(M?.dataset.text),borderWidth:Q(M?.dataset.borderWidth)?.toString(),borderColor:H(M?.dataset.borderColor),shadow:Fi,welcome:(()=>{let e=M?.dataset.welcome;return e==="false"||e==="never"?"never":e==="always"?"always":"once"})(),screenshotMode:(()=>{let e=M?.dataset.screenshot;return e==="auto"||e==="required"?e:(e&&e!=="optional"&&console.warn(`[BugDrop] Invalid data-screenshot "${e}". Expected "optional", "auto", or "required".`),"optional")})(),screenshotScale:Si,elementContextMaxArea:Ti,issueLinkVisibility:Ai,sendConsoleLogs:M?.dataset.sendConsoleLogs==="true",locale:Xc};ur(ot.locale);Jr();ot.repo?/^[^/]+\/[^/]+$/.test(ot.repo)?Zc(ot):console.error(`[BugDrop] Invalid data-repo format "${ot.repo}". Expected "owner/repo" (e.g., "octocat/hello-world").`):console.error("[BugDrop] Missing data-repo attribute");function Kc(e){return e.label!==void 0?e.label:p().triggerLabel}function Pi(e,t){if(t.position==="bottom-left"&&e.appendChild(mi()),t.iconUrl!=="none"){let r=document.createElement("span");if(r.className="bd-trigger-icon",t.iconUrl){let o=document.createElement("img");o.src=t.iconUrl,o.alt="";let i=document.createElement("span");i.textContent="\u{1F41B}",i.style.display="none",o.addEventListener("error",()=>{o.style.display="none",i.style.display=""}),r.append(o,i)}else r.textContent="\u{1F41B}";e.appendChild(r)}let n=document.createElement("span");n.className="bd-trigger-label",n.textContent=Kc(t),e.appendChild(n),t.position!=="bottom-left"&&e.appendChild(mi())}function mi(){let e=document.createElement("span");return e.className="bd-trigger-drag-handle",e.setAttribute("aria-hidden","true"),e.title=p().dragHandleTitle,e.innerHTML=`
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
  `,e}function Ri(e,t=!1){let n=["bd-trigger",`bd-trigger--${e.position==="bottom-left"?"left":"right"}`];return t&&n.push("bd-trigger--restoring"),n.join(" ")}function Mi(e){return`${$c}${e.repo}_${e.position}`}function Di(e){try{let t=localStorage.getItem(Mi(e));if(!t)return null;let n=Number(t);return Number.isFinite(n)?n:null}catch{return null}}function Ii(e,t){try{localStorage.setItem(Mi(e),String(Math.round(t)))}catch{}}function Yc(e,t){let n=e.getBoundingClientRect(),r=Math.max(it,window.innerHeight-n.height-it);return Math.min(Math.max(t,it),r)}function Gt(e,t){let n=Yc(e,t);return e.style.top=`${n}px`,e.style.bottom="auto",n}function zi(e,t){let n=Di(t);n!==null&&(e.classList.add("bd-trigger--positioned"),Gt(e,n))}function An(e,t){if(!e.style.top)return;let n=e.getBoundingClientRect();if(n.width===0||n.height===0)return;let r=parseFloat(e.style.top);if(!Number.isFinite(r))return;let o=e.classList.contains("bd-trigger--dragging")?r:Di(t)??r;Gt(e,o)}function $i(e,t){let n=()=>{if(!e.isConnected){r();return}An(e,t)},r=()=>{window.removeEventListener("resize",n),window.visualViewport?.removeEventListener("resize",n)};window.addEventListener("resize",n),window.visualViewport?.addEventListener("resize",n)}function Oi(e,t){let n=e.querySelector(".bd-trigger-drag-handle");if(!n)return;let r=null,o=0,i=0,a=!1,s=()=>{r!==null&&(r=null,e.classList.remove("bd-trigger--dragging"),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",c),window.removeEventListener("pointercancel",d),a&&(Ii(t,e.getBoundingClientRect().top),window.setTimeout(()=>{Ue=!1},0)))};function l(u){if(r!==u.pointerId)return;let g=i+u.clientY-o;Math.abs(u.clientY-o)>3&&(a=!0,Ue=!0),Gt(e,g)}function c(u){r===u.pointerId&&s()}function d(u){r===u.pointerId&&s()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation();let g=e.getBoundingClientRect();r=u.pointerId,o=u.clientY,i=g.top,a=!1,e.classList.add("bd-trigger--dragging"),n.setPointerCapture(u.pointerId),window.addEventListener("pointermove",l),window.addEventListener("pointerup",c),window.addEventListener("pointercancel",d)}),n.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation()})}function Ni(e,t){e.addEventListener("keydown",n=>{if(n.target!==e||!["ArrowUp","ArrowDown","Home","End"].includes(n.key))return;n.preventDefault(),n.stopPropagation();let r=e.getBoundingClientRect(),o=window.innerHeight-r.height-it,i=n.key==="ArrowUp"?r.top-si:n.key==="ArrowDown"?r.top+si:n.key==="Home"?it:o;e.classList.add("bd-trigger--positioned"),Ii(t,Gt(e,i))})}function Pn(e,t){let n=document.createElement("div");n.className=t.position==="bottom-left"?"bd-pull-tab bd-pull-tab--left":"bd-pull-tab",n.innerHTML='<span class="bd-pull-tab-chevron">\u2039</span>',n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-label",p().pullTabAriaLabel);let r=()=>{try{localStorage.removeItem(lt)}catch{}n.remove(),at=null,Bi(e,t,!0)};return n.addEventListener("click",r),n.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),r())}),e.appendChild(n),at=n,n}function Zc(e){if(Uc=e,!e.buttonDismissible)try{localStorage.removeItem(lt)}catch{}let t=document.createElement("div");t.id="bugdrop-host",t.style.pointerEvents="auto",document.body.appendChild(t);let n=t.attachShadow({mode:"open"});de(t);for(let i of["keydown","keypress","keyup"])n.addEventListener(i,a=>{let s=a.target;(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&a.stopPropagation()});let r=Ir(n,e);if(Vc=r,e.showButton&&!(e.buttonDismissible&&di(e.dismissDuration))){let i=document.createElement("button");if(i.className=Ri(e),Pi(i,e),i.setAttribute("aria-label",p().triggerAriaLabel),e.buttonDismissible){let a=document.createElement("button");a.className="bd-trigger-close",a.textContent="\xD7",a.setAttribute("aria-label",p().dismissButtonAriaLabel),i.appendChild(a),a.addEventListener("click",s=>{s.stopPropagation(),hi(),i.classList.remove("bd-trigger--restoring"),i.classList.add("bd-trigger--dismissing"),i.addEventListener("animationend",()=>{i.remove(),K=null,e.showRestore&&Pn(r,e)},{once:!0})})}r.appendChild(i),K=i,zi(i,e),$i(i,e),Oi(i,e),Ni(i,e),i.addEventListener("click",()=>{if(Ue){Ue=!1;return}Dn(r,e)})}else e.showButton&&e.buttonDismissible&&e.showRestore&&di(e.dismissDuration)&&Pn(r,e);Jc(r,e),window.dispatchEvent(new CustomEvent("bugdrop:ready"))}function Jc(e,t){let n=t.theme,r,o;window.BugDrop={open:()=>{Y||Dn(e,t,{skipWelcome:!0})},close:()=>{if(Y){let i=e.querySelector(".bd-modal");i&&i.remove(),Y=!1}},hide:()=>{K&&(K.style.display="none")},show:()=>{try{localStorage.removeItem(lt)}catch{}at&&(at.remove(),at=null),K?(K.style.display="",An(K,t),window.requestAnimationFrame(()=>{K&&An(K,t)})):t.showButton&&Bi(e,t)},isOpen:()=>Y,isButtonVisible:()=>K!==null&&K.style.display!=="none",setTheme:i=>{if(!Et(i)){console.warn(`[BugDrop] Invalid theme ${String(i)}. Expected 'light' | 'dark' | 'auto'.`);return}n=i;let a=De(i);Ye(e,a),Ze(e,t,a)},registerVariant:i=>(r??=yo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider},{isLegacyModalOpen:()=>Y}),r.register(i)),registerFlow:i=>(o??=ai({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,categoryLabels:t.categoryLabels},{preflight:()=>In(t),capture:async(a,s,l)=>await Lt(e,{...t,screenshotMode:a.mode},s,()=>{},l)},{isLegacyModalOpen:()=>Y}),o.register(i))},kt(i=>{n==="auto"&&(Ye(e,i),Ze(e,t,i))})}function Bi(e,t,n=!1){let r=document.createElement("button");if(r.className=Ri(t,n),Pi(r,t),r.setAttribute("aria-label",p().triggerAriaLabel),t.buttonDismissible){let o=document.createElement("button");o.className="bd-trigger-close",o.textContent="\xD7",o.setAttribute("aria-label",p().dismissButtonAriaLabel),r.appendChild(o),o.addEventListener("click",i=>{i.stopPropagation(),hi(),r.classList.remove("bd-trigger--restoring"),r.classList.add("bd-trigger--dismissing"),r.addEventListener("animationend",()=>{r.remove(),K=null,t.showRestore&&Pn(e,t)},{once:!0})})}e.appendChild(r),K=r,zi(r,t),$i(r,t),Oi(r,t),Ni(r,t),r.addEventListener("click",()=>{if(Ue){Ue=!1;return}Dn(e,t)})}async function Dn(e,t,n){if(Y)return;ze(),Y=!0;let r=void 0;if(r==="private"||r!=="fixed"&&!0){if(await ed(e,t,n)==="preflight-blocked")return}else{let{status:i,appName:a}=await In(t);if(i==="not_installed"){Rn(e,t,void 0,a);return}if(i==="unreachable"){Rn(e,t,p().apiUnreachableMessage,a);return}await Qc(e,t,n)}Y=!1}async function Qc(e,t,n){if(!(n?.skipWelcome||t.welcome==="never"||t.welcome==="once"&&yi(t.repo))){if(!await _i(e)){Y=!1;return}t.welcome==="once"&&wi(t.repo)}let o=null;for(;;){if(o=await Hi(e,t,o),!o){Y=!1;return}let i=o,a=await Lt(e,t,i.includeScreenshot,()=>vi(t,i));if(!a.returnToForm){await zn(e,t,{title:o.title,description:o.description,category:o.category,name:o.name,email:o.email,screenshot:a.screenshot,attachments:o.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?fe(t.accentColor):null,sendConsoleLogs:o.sendConsoleLogs});break}}}async function ed(e,t,n){let r=Io({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,welcome:t.welcome,screenshotMode:t.screenshotMode,skipWelcome:!!n?.skipWelcome,hasSeenWelcome:yi(t.repo),showName:t.showName,requireName:t.requireName,showEmail:t.showEmail,requireEmail:t.requireEmail,sendConsoleLogs:t.sendConsoleLogs,screenshotScale:t.screenshotScale,elementContextMaxArea:t.elementContextMaxArea,accentColor:t.accentColor,categoryLabels:t.categoryLabels,issueLinkVisibility:t.issueLinkVisibility});return vo(r,{preflight:o=>In({...t,repo:o.repo,apiUrl:o.apiUrl,authTokenProvider:o.authTokenProvider}),showPreflightFailure:o=>Rn(e,t,o.status==="unreachable"?p().apiUnreachableMessage:void 0,o.appName),showWelcome:()=>_i(e),rememberWelcome:()=>wi(r.steps[1].repo),showDetails:(o,i)=>Hi(e,{...t,repo:o.repo,showName:o.showName,requireName:o.requireName,showEmail:o.showEmail,requireEmail:o.requireEmail,sendConsoleLogs:o.sendConsoleLogs,screenshotMode:r.steps[2].mode},i),capture:async(o,i)=>{let a={...t,repo:o.repo,screenshotMode:o.mode,screenshotScale:o.screenshotScale,elementContextMaxArea:o.elementContextMaxArea,accentColor:o.accentColor},s=await Lt(e,a,i.includeScreenshot,()=>vi(a,i));return{...s,returnToDetails:s.returnToForm}},submit:(o,i,a)=>zn(e,{...t,repo:o.repo,apiUrl:o.apiUrl,authTokenProvider:o.authTokenProvider,categoryLabels:o.categoryLabels,issueLinkVisibility:o.issueLinkVisibility},{title:i.title,description:i.description,category:i.category,name:i.name,email:i.email,screenshot:a.screenshot,attachments:i.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?fe(t.accentColor):null,sendConsoleLogs:i.sendConsoleLogs})})}async function In(e){try{let t=await fetch(`${e.apiUrl}/check/${e.repo}`,{headers:await he(e.authTokenProvider)});if(!t.ok)return{status:"unreachable"};let n=await t.json();return{status:n.installed===!0?"installed":"not_installed",appName:n.appName}}catch{return{status:"unreachable"}}}function Rn(e,t,n,r){let i=`https://github.com/apps/${r||(t.apiUrl.includes("bugdrop.neonwatty.workers.dev")?"neonwatty-bugdrop":t.apiUrl.replace(/https?:\/\//,"").replace(/\..*/,""))}/installations/new`,a=n||p().installRequiredMessage,s=n?p().connectionErrorTitle:p().installRequiredTitle,l=U(e,s,`
      <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${W(a)}</p>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${x(p().cancel)}</button>
        ${n?"":`<a href="${i}" target="_blank" class="bd-btn bd-btn-primary" style="text-decoration: none;">${x(p().installApp)}</a>`}
      </div>
    `,!0),c=l.querySelector(".bd-close"),d=l.querySelector('[data-action="cancel"]');c?.addEventListener("click",()=>{l.remove(),Y=!1}),d?.addEventListener("click",()=>{l.remove(),Y=!1})}function _i(e){return new Promise(t=>{let n=U(e,p().welcomeTitle,`
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
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="continue"]');r?.addEventListener("click",()=>{n.remove(),t(!1)}),o?.addEventListener("click",()=>{n.remove(),t(!0)})})}function Hi(e,t,n){return new Promise(r=>{let o=t.showName?`
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
                <input type="radio" name="category" value="bug" ${Ln(n,"bug")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u{1F41B} ${x(p().categoryBug)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="feature" ${Ln(n,"feature")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2728 ${x(p().categoryFeature)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="question" ${Ln(n,"question")} style="accent-color: var(--bd-primary);" />
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
              ${id(t,n)}
              ${td()}
            </div>
            <input type="file" id="attachment-upload" accept="${fi.join(",")}" multiple class="bd-upload-input" />
            <div id="attachment-list" class="bd-upload-list" aria-live="polite">${n?.attachments.length,""}</div>
            <p id="attachment-error" class="bd-field-error" hidden></p>
            ${ad(t,n)}
          </div>
          <div class="bd-actions">
            <button type="button" class="bd-btn bd-btn-secondary" data-action="cancel">${x(p().cancel)}</button>
            <button type="submit" class="bd-btn bd-btn-primary" id="submit-btn">${t.screenshotMode==="auto"?x(p().submit):x(p().continueButton)}</button>
          </div>
        </form>
      `),s=a.querySelector("#feedback-form"),l=a.querySelector("#name"),c=a.querySelector("#email"),d=a.querySelector("#title"),u=a.querySelector("#description"),g=a.querySelector("#include-screenshot"),m=a.querySelector("#attachment-upload"),b=a.querySelector('[data-action="choose-uploads"]'),h=a.querySelector("#attachment-list"),k=a.querySelector("#attachment-error"),C=a.querySelector("#send-console-logs"),F=a.querySelector(".bd-close"),P=a.querySelector('[data-action="cancel"]'),L=[...n?.attachments??[]],D=()=>{a.remove(),r(null)};F?.addEventListener("click",D),P?.addEventListener("click",D),s.addEventListener("submit",A=>{if(A.preventDefault(),!d.value.trim()){d.classList.add("bd-input--error"),d.focus();return}if(t.requireName&&l&&!l.value.trim()){l.classList.add("bd-input--error"),l.focus();return}if(t.requireEmail&&c&&!c.value.trim()){c.classList.add("bd-input--error"),c.focus();return}let I=a.querySelector('input[name="category"]:checked')?.value||"bug",$=t.screenshotMode==="optional"?g?.checked??!1:!0;t.screenshotMode==="optional"&&$&&jc(t.repo),a.remove(),r({title:d.value.trim(),description:u.value.trim(),category:I,name:l?.value.trim()||void 0,email:c?.value.trim()||void 0,includeScreenshot:$,attachments:L,sendConsoleLogs:C.checked})}),d.addEventListener("input",()=>d.classList.remove("bd-input--error")),l?.addEventListener("input",()=>l.classList.remove("bd-input--error")),c?.addEventListener("input",()=>c.classList.remove("bd-input--error"));let v=()=>{rd(h,L,A=>{L=L.filter((z,I)=>I!==A),v()})};b.addEventListener("click",()=>m.click()),m.addEventListener("change",async()=>{let A=Array.from(m.files??[]);m.value="",k.textContent="",k.hidden=!0;let z=li-L.length;if(A.length>z){Tn(k,p().uploadTooMany(li));return}for(let I of A){let $=nd(I);if($){Tn(k,$);return}}try{let I=await Promise.all(A.map(od));L=[...L,...I],v()}catch{Tn(k,p().uploadReadError)}}),v()})}function td(){return`
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
  `}function nd(e){return fi.includes(e.type)?e.size>ci?p().uploadTooLarge(Vi(ci)):null:p().uploadUnsupportedType}function Tn(e,t){e.textContent=t,e.hidden=!1}function rd(e,t,n){e.innerHTML=t.map((r,o)=>`
        <div class="bd-upload-item">
          <span class="bd-upload-item__name">${W(r.name)}</span>
          <span class="bd-upload-item__meta">${Vi(r.size)}</span>
          <button type="button" class="bd-upload-remove" data-index="${o}" aria-label="${x(p().removeAttachmentAriaLabel(r.name))}">&times;</button>
        </div>
      `).join(""),e.querySelectorAll(".bd-upload-remove").forEach(r=>{r.addEventListener("click",()=>{let o=Number(r.dataset.index);Number.isInteger(o)&&n(o)})})}function od(e){return new Promise((t,n)=>{let r=new FileReader;r.addEventListener("load",()=>{if(typeof r.result!="string"){n(new Error("Could not read file."));return}t({name:e.name,type:e.type,size:e.size,dataUrl:r.result})}),r.addEventListener("error",()=>n(new Error("Could not read file."))),r.readAsDataURL(e)})}function Vi(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${Math.round(e/(1024*1024)*10)/10} MB`}function id(e,t){if(e.screenshotMode==="auto"){let r=Me()>0?` ${x(p().screenshotAutoRedactionNote)}`:"";return`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${x(p().screenshotAutoNote)}${r}
      </p>
    `}return e.screenshotMode==="required"?`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${x(p().screenshotRequiredNote)}
      </p>
    `:`
    <div class="bd-screenshot-control">
      <input type="checkbox" id="include-screenshot" ${t?.includeScreenshot??(!re()||!qc(e.repo))?"checked":""} class="bd-checkbox" />
      <label for="include-screenshot" class="bd-checkbox-label">
        ${x(p().includeScreenshotLabel)}
      </label>
    </div>
  `}function ad(e,t){return`
    <div class="bd-form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
      <input type="checkbox" id="send-console-logs" ${t?.sendConsoleLogs??e.sendConsoleLogs?"checked":""} style="width: 18px; height: 18px; accent-color: var(--bd-primary); cursor: pointer;" />
      <label for="send-console-logs" style="font-size: 0.95rem; color: var(--bd-text-secondary); cursor: pointer; user-select: none;">
        ${x(p().sendConsoleLogsLabel)}
      </label>
    </div>
  `}function Ln(e,t){return(e?.category||"bug")===t?"checked":""}async function zn(e,t,n){let r=U(e,p().submittingTitle,`
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <div class="bd-spinner bd-spinner--lg"></div>
        <p class="bd-loading-text" style="margin-top: 12px;">${x(p().creatingIssue)}</p>
      </div>
    `);try{let o=n.name||n.email?{name:n.name,email:n.email}:void 0,i=Hc(),a=Re(),s=n.sendConsoleLogs?Rt():void 0,l=await fetch(`${t.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(t.authTokenProvider)},body:JSON.stringify({repo:t.repo,title:n.title,description:n.description,category:n.category,categoryLabels:t.categoryLabels,screenshot:n.screenshot,attachments:n.attachments,consoleLogs:s,submitter:o,metadata:{url:i.url,userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:n.elementSelector,fullElementSelector:n.fullElementSelector,selectedElementHighlightColor:n.selectedElementHighlightColor||void 0,domNodeCount:a,fullPageDisabled:re(),browser:i.browser,os:i.os,devicePixelRatio:i.devicePixelRatio,language:i.language}})});if(r.remove(),l.status===429){let d=l.headers.get("Retry-After"),u=d?Math.ceil(parseInt(d,10)/60):15;Fn(e,t,n,p().rateLimited(u));return}let c=await l.json();c.success?await zr(e,c.issueNumber,c.issueUrl,c.isPublic??!1,t.issueLinkVisibility):Fn(e,t,n,c.error||p().submitFailedFallback)}catch{r.remove(),Fn(e,t,n,p().networkError)}}function Fn(e,t,n,r){let o=U(e,p().submissionFailedTitle,`
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
    `,!0),i=o.querySelector(".bd-close"),a=o.querySelector('[data-action="cancel"]'),s=o.querySelector('[data-action="retry"]');i?.addEventListener("click",()=>o.remove()),a?.addEventListener("click",()=>o.remove()),s?.addEventListener("click",async()=>{o.remove(),await zn(e,t,n)})}})();
