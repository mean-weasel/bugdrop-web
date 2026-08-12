"use strict";(()=>{function zn(e,t){if(e.match(/^[a-z]+:\/\//i))return e;if(e.match(/^\/\//))return window.location.protocol+e;if(e.match(/^[a-z]+:/i))return e;let n=document.implementation.createHTMLDocument(),r=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(o),t&&(r.href=t),o.href=e,o.href}var $n=(()=>{let e=0,t=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(e+=1,`u${t()}${e}`)})();function Z(e){let t=[];for(let n=0,r=e.length;n<r;n++)t.push(e[n]);return t}var Se=null;function ct(e={}){return Se||(e.includeStyleProperties?(Se=e.includeStyleProperties,Se):(Se=Z(window.getComputedStyle(document.documentElement)),Se))}function lt(e,t){let r=(e.ownerDocument.defaultView||window).getComputedStyle(e).getPropertyValue(t);return r?parseFloat(r.replace("px","")):0}function $i(e){let t=lt(e,"border-left-width"),n=lt(e,"border-right-width");return e.clientWidth+t+n}function Oi(e){let t=lt(e,"border-top-width"),n=lt(e,"border-bottom-width");return e.clientHeight+t+n}function Wt(e,t={}){let n=t.width||$i(e),r=t.height||Oi(e);return{width:n,height:r}}function On(){let e,t;try{t=process}catch{}let n=t&&t.env?t.env.devicePixelRatio:null;return n&&(e=parseInt(n,10),Number.isNaN(e)&&(e=1)),e||window.devicePixelRatio||1}var W=16384;function Nn(e){(e.width>W||e.height>W)&&(e.width>W&&e.height>W?e.width>e.height?(e.height*=W/e.width,e.width=W):(e.width*=W/e.height,e.height=W):e.width>W?(e.height*=W/e.width,e.width=W):(e.width*=W/e.height,e.height=W))}function Ce(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>t(r))})},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=e})}async function Ni(e){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(e)).then(encodeURIComponent).then(t=>`data:image/svg+xml;charset=utf-8,${t}`)}async function Bn(e,t,n){let r="http://www.w3.org/2000/svg",o=document.createElementNS(r,"svg"),i=document.createElementNS(r,"foreignObject");return o.setAttribute("width",`${t}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${t} ${n}`),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("x","0"),i.setAttribute("y","0"),i.setAttribute("externalResourcesRequired","true"),o.appendChild(i),i.appendChild(e),Ni(o)}var H=(e,t)=>{if(e instanceof t)return!0;let n=Object.getPrototypeOf(e);return n===null?!1:n.constructor.name===t.name||H(n,t)};function Bi(e){let t=e.getPropertyValue("content");return`${e.cssText} content: '${t.replace(/'|"/g,"")}';`}function _i(e,t){return ct(t).map(n=>{let r=e.getPropertyValue(n),o=e.getPropertyPriority(n);return`${n}: ${r}${o?" !important":""};`}).join(" ")}function Hi(e,t,n,r){let o=`.${e}:${t}`,i=n.cssText?Bi(n):_i(n,r);return document.createTextNode(`${o}{${i}}`)}function _n(e,t,n,r){let o=window.getComputedStyle(e,n),i=o.getPropertyValue("content");if(i===""||i==="none")return;let a=$n();try{t.className=`${t.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(Hi(a,n,o,r)),t.appendChild(s)}function Hn(e,t,n){_n(e,t,":before",n),_n(e,t,":after",n)}var Vn="application/font-woff",Un="image/jpeg",Vi={woff:Vn,woff2:Vn,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:Un,jpeg:Un,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Ui(e){let t=/\.([^./]*?)$/g.exec(e);return t?t[1]:""}function Te(e){let t=Ui(e).toLowerCase();return Vi[t]||""}function qi(e){return e.split(/,/)[1]}function Ue(e){return e.search(/^(data:)/)!==-1}function Gt(e,t){return`data:${t};base64,${e}`}async function Xt(e,t,n){let r=await fetch(e,t);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);let o=await r.blob();return new Promise((i,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{i(n({res:r,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var jt={};function Wi(e,t,n){let r=e.replace(/\?.*/,"");return n&&(r=e),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),t?`[${t}]${r}`:r}async function Le(e,t,n){let r=Wi(e,t,n.includeQueryParams);if(jt[r]!=null)return jt[r];n.cacheBust&&(e+=(/\?/.test(e)?"&":"?")+new Date().getTime());let o;try{let i=await Xt(e,n.fetchRequestInit,({res:a,result:s})=>(t||(t=a.headers.get("Content-Type")||""),qi(s)));o=Gt(i,t)}catch(i){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${e}`;i&&(a=typeof i=="string"?i:i.message),a&&console.warn(a)}return jt[r]=o,o}async function ji(e){let t=e.toDataURL();return t==="data:,"?e.cloneNode(!1):Ce(t)}async function Gi(e,t){if(e.currentSrc){let i=document.createElement("canvas"),a=i.getContext("2d");i.width=e.clientWidth,i.height=e.clientHeight,a?.drawImage(e,0,0,i.width,i.height);let s=i.toDataURL();return Ce(s)}let n=e.poster,r=Te(n),o=await Le(n,r,t);return Ce(o)}async function Xi(e,t){var n;try{if(!((n=e?.contentDocument)===null||n===void 0)&&n.body)return await qe(e.contentDocument.body,t,!0)}catch{}return e.cloneNode(!1)}async function Ki(e,t){return H(e,HTMLCanvasElement)?ji(e):H(e,HTMLVideoElement)?Gi(e,t):H(e,HTMLIFrameElement)?Xi(e,t):e.cloneNode(qn(e))}var Yi=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SLOT",qn=e=>e.tagName!=null&&e.tagName.toUpperCase()==="SVG";async function Zi(e,t,n){var r,o;if(qn(t))return t;let i=[];return Yi(e)&&e.assignedNodes?i=Z(e.assignedNodes()):H(e,HTMLIFrameElement)&&(!((r=e.contentDocument)===null||r===void 0)&&r.body)?i=Z(e.contentDocument.body.childNodes):i=Z(((o=e.shadowRoot)!==null&&o!==void 0?o:e).childNodes),i.length===0||H(e,HTMLVideoElement)||await i.reduce((a,s)=>a.then(()=>qe(s,n)).then(l=>{l&&t.appendChild(l)}),Promise.resolve()),t}function Ji(e,t,n){let r=t.style;if(!r)return;let o=window.getComputedStyle(e);o.cssText?(r.cssText=o.cssText,r.transformOrigin=o.transformOrigin):ct(n).forEach(i=>{let a=o.getPropertyValue(i);i==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),H(e,HTMLIFrameElement)&&i==="display"&&a==="inline"&&(a="block"),i==="d"&&t.getAttribute("d")&&(a=`path(${t.getAttribute("d")})`),r.setProperty(i,a,o.getPropertyPriority(i))})}function Qi(e,t){H(e,HTMLTextAreaElement)&&(t.innerHTML=e.value),H(e,HTMLInputElement)&&t.setAttribute("value",e.value)}function ea(e,t){if(H(e,HTMLSelectElement)){let r=Array.from(t.children).find(o=>e.value===o.getAttribute("value"));r&&r.setAttribute("selected","")}}function ta(e,t,n){return H(t,Element)&&(Ji(e,t,n),Hn(e,t,n),Qi(e,t),ea(e,t)),t}async function na(e,t){let n=e.querySelectorAll?e.querySelectorAll("use"):[];if(n.length===0)return e;let r={};for(let i=0;i<n.length;i++){let s=n[i].getAttribute("xlink:href");if(s){let l=e.querySelector(s),d=document.querySelector(s);!l&&d&&!r[s]&&(r[s]=await qe(d,t,!0))}}let o=Object.values(r);if(o.length){let i="http://www.w3.org/1999/xhtml",a=document.createElementNS(i,"svg");a.setAttribute("xmlns",i),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(i,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);e.appendChild(a)}return e}async function qe(e,t,n){return!n&&t.filter&&!t.filter(e)?null:Promise.resolve(e).then(r=>Ki(r,t)).then(r=>Zi(e,r,t)).then(r=>ta(e,r,t)).then(r=>na(r,t))}var Wn=/url\((['"]?)([^'"]+?)\1\)/g,ra=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,oa=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function ia(e){let t=e.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`,"g")}function aa(e){let t=[];return e.replace(Wn,(n,r,o)=>(t.push(o),n)),t.filter(n=>!Ue(n))}async function sa(e,t,n,r,o){try{let i=n?zn(t,n):t,a=Te(t),s;if(o){let l=await o(i);s=Gt(l,a)}else s=await Le(i,a,r);return e.replace(ia(t),`$1${s}$3`)}catch{}return e}function la(e,{preferredFontFormat:t}){return t?e.replace(oa,n=>{for(;;){let[r,,o]=ra.exec(n)||[];if(!o)return"";if(o===t)return`src: ${r};`}}):e}function Kt(e){return e.search(Wn)!==-1}async function dt(e,t,n){if(!Kt(e))return e;let r=la(e,n);return aa(r).reduce((i,a)=>i.then(s=>sa(s,a,t,n)),Promise.resolve(r))}async function Fe(e,t,n){var r;let o=(r=t.style)===null||r===void 0?void 0:r.getPropertyValue(e);if(o){let i=await dt(o,null,n);return t.style.setProperty(e,i,t.style.getPropertyPriority(e)),!0}return!1}async function ca(e,t){await Fe("background",e,t)||await Fe("background-image",e,t),await Fe("mask",e,t)||await Fe("-webkit-mask",e,t)||await Fe("mask-image",e,t)||await Fe("-webkit-mask-image",e,t)}async function da(e,t){let n=H(e,HTMLImageElement);if(!(n&&!Ue(e.src))&&!(H(e,SVGImageElement)&&!Ue(e.href.baseVal)))return;let r=n?e.src:e.href.baseVal,o=await Le(r,Te(r),t);await new Promise((i,a)=>{e.onload=i,e.onerror=t.onImageErrorHandler?(...l)=>{try{i(t.onImageErrorHandler(...l))}catch(d){a(d)}}:a;let s=e;s.decode&&(s.decode=i),s.loading==="lazy"&&(s.loading="eager"),n?(e.srcset="",e.src=o):e.href.baseVal=o})}async function ua(e,t){let r=Z(e.childNodes).map(o=>Yt(o,t));await Promise.all(r).then(()=>e)}async function Yt(e,t){H(e,Element)&&(await ca(e,t),await da(e,t),await ua(e,t))}function jn(e,t){let{style:n}=e;t.backgroundColor&&(n.backgroundColor=t.backgroundColor),t.width&&(n.width=`${t.width}px`),t.height&&(n.height=`${t.height}px`);let r=t.style;return r!=null&&Object.keys(r).forEach(o=>{n[o]=r[o]}),e}var Gn={};async function Xn(e){let t=Gn[e];if(t!=null)return t;let r=await(await fetch(e)).text();return t={url:e,cssText:r},Gn[e]=t,t}async function Kn(e,t){let n=e.cssText,r=/url\(["']?([^"')]+)["']?\)/g,i=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(r,"$1");return s.startsWith("https://")||(s=new URL(s,e.url).href),Xt(s,t.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(i).then(()=>n)}function Yn(e){if(e==null)return[];let t=[],n=/(\/\*[\s\S]*?\*\/)/gi,r=e.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(r);if(l===null)break;t.push(l[0])}r=r.replace(o,"");let i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=i.exec(r);if(l===null){if(l=s.exec(r),l===null)break;i.lastIndex=s.lastIndex}else s.lastIndex=i.lastIndex;t.push(l[0])}return t}async function pa(e,t){let n=[],r=[];return e.forEach(o=>{if("cssRules"in o)try{Z(o.cssRules||[]).forEach((i,a)=>{if(i.type===CSSRule.IMPORT_RULE){let s=a+1,l=i.href,d=Xn(l).then(c=>Kn(c,t)).then(c=>Yn(c).forEach(u=>{try{o.insertRule(u,u.startsWith("@import")?s+=1:o.cssRules.length)}catch(m){console.error("Error inserting rule from remote css",{rule:u,error:m})}})).catch(c=>{console.error("Error loading remote css",c.toString())});r.push(d)}})}catch(i){let a=e.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&r.push(Xn(o.href).then(s=>Kn(s,t)).then(s=>Yn(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",i)}}),Promise.all(r).then(()=>(e.forEach(o=>{if("cssRules"in o)try{Z(o.cssRules||[]).forEach(i=>{n.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${o.href}`,i)}}),n))}function ma(e){return e.filter(t=>t.type===CSSRule.FONT_FACE_RULE).filter(t=>Kt(t.style.getPropertyValue("src")))}async function ba(e,t){if(e.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=Z(e.ownerDocument.styleSheets),r=await pa(n,t);return ma(r)}function Zn(e){return e.trim().replace(/["']/g,"")}function ga(e){let t=new Set;function n(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(i=>{t.add(Zn(i))}),Array.from(r.children).forEach(i=>{i instanceof HTMLElement&&n(i)})}return n(e),t}async function Jn(e,t){let n=await ba(e,t),r=ga(e);return(await Promise.all(n.filter(i=>r.has(Zn(i.style.fontFamily))).map(i=>{let a=i.parentStyleSheet?i.parentStyleSheet.href:null;return dt(i.cssText,a,t)}))).join(`
`)}async function Qn(e,t){let n=t.fontEmbedCSS!=null?t.fontEmbedCSS:t.skipFonts?null:await Jn(e,t);if(n){let r=document.createElement("style"),o=document.createTextNode(n);r.appendChild(o),e.firstChild?e.insertBefore(r,e.firstChild):e.appendChild(r)}}async function fa(e,t={}){let{width:n,height:r}=Wt(e,t),o=await qe(e,t,!0);return await Qn(o,t),await Yt(o,t),jn(o,t),await Bn(o,n,r)}async function ha(e,t={}){let{width:n,height:r}=Wt(e,t),o=await fa(e,t),i=await Ce(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=t.pixelRatio||On(),d=t.canvasWidth||n,c=t.canvasHeight||r;return a.width=d*l,a.height=c*l,t.skipAutoScale||Nn(a),a.style.width=`${d}`,a.style.height=`${c}`,t.backgroundColor&&(s.fillStyle=t.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(i,0,0,a.width,a.height),a}async function er(e,t={}){return(await ha(e,t)).toDataURL()}var tr={triggerLabel:"Feedback",triggerAriaLabel:"Fehler melden oder Feedback senden",dismissButtonAriaLabel:"Feedback-Button ausblenden",pullTabAriaLabel:"Feedback-Button anzeigen",dragHandleTitle:"Feedback-Button verschieben",installRequiredTitle:"Installation erforderlich",connectionErrorTitle:"Verbindungsfehler",installRequiredMessage:"BugDrop ben\xF6tigt die Installation der GitHub-App, um Issues zu erstellen.",apiUnreachableMessage:"Die BugDrop-API ist nicht erreichbar. \xDCberpr\xFCfen Sie Ihre Netzwerkverbindung oder die URL des Script-Tags.",installApp:"App installieren",welcomeTitle:"Teilen Sie Ihr Feedback",welcomeHeadline:"Helfen Sie uns, besser zu werden, indem Sie Ihre Meinung teilen",welcomeBodyLine1:"Melden Sie Fehler, schlagen Sie Funktionen vor oder hinterlassen Sie Feedback.",welcomeBodyLine2:"Sie k\xF6nnen optional kommentierte Screenshots hinzuf\xFCgen.",getStarted:"Los geht\u2019s",feedbackFormTitle:"Feedback senden",categoryLabel:"Kategorie",categoryBug:"Fehler",categoryFeature:"Funktion",categoryQuestion:"Frage",nameLabel:"Name",namePlaceholder:"Ihr Name",emailLabel:"E-Mail",emailPlaceholder:"ihre@email.de",titleLabel:"Titel",titlePlaceholder:"Kurze Beschreibung des Problems oder Vorschlags",descriptionLabel:"Beschreibung",descriptionPlaceholder:"Geben Sie weitere Details, Schritte zur Reproduktion oder Kontext an...",screenshotAutoNote:"Diese Website h\xE4ngt beim Absenden automatisch einen Screenshot der gesamten Seite an, ohne eine Vorschau anzuzeigen. \xDCberpr\xFCfen Sie Ihre Seite vor dem Senden auf sensible Informationen.",screenshotAutoRedactionNote:"Einige von dieser Website als privat markierte Felder k\xF6nnen auf unterst\xFCtzten Seiten optisch maskiert werden, nicht markierte sensible Informationen k\xF6nnen jedoch weiterhin enthalten sein.",screenshotRequiredNote:"\u{1F4F8} Vor dem Absenden ist ein Screenshot erforderlich.",includeScreenshotLabel:"\u{1F4F8} Screenshot hinzuf\xFCgen",sendConsoleLogsLabel:"Konsolenprotokolle mitsenden",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Dateien hochladen",uploadButton:"Hochladen",uploadTooMany:e=>`Laden Sie bis zu ${e} Dateien hoch. Entfernen Sie eine Datei, bevor Sie eine weitere hinzuf\xFCgen.`,uploadUnsupportedType:"Dieser Dateityp wird nicht unterst\xFCtzt. Laden Sie ein Bild, ein PDF oder ein kurzes Video hoch.",uploadTooLarge:e=>`Die Datei ist zu gro\xDF. Laden Sie Dateien bis zu ${e} hoch.`,uploadReadError:"Diese Datei konnte nicht gelesen werden. Versuchen Sie es mit einer anderen.",removeAttachmentAriaLabel:e=>`${e} entfernen`,cancel:"Abbrechen",continueButton:"Weiter",submit:"Absenden",submittingTitle:"Wird gesendet...",creatingIssue:"Issue wird erstellt...",rateLimited:e=>`Zu viele \xDCbermittlungen. Bitte versuchen Sie es in ${e} Minute${e===1?"":"n"} erneut.`,submitFailedFallback:"Senden fehlgeschlagen",networkError:"Netzwerkfehler. Bitte \xFCberpr\xFCfen Sie Ihre Verbindung.",submissionFailedTitle:"Senden fehlgeschlagen",tryAgain:"Erneut versuchen",successTitle:"Feedback gesendet!",issueCreated:e=>`Issue ${e} wurde erstellt.`,feedbackSubmittedMessage:"Ihr Feedback wurde erfolgreich gesendet.",viewOnGitHub:"Auf GitHub ansehen",done:"Fertig",captureScreenshotTitle:"Screenshot erstellen",chooseWhatToCapture:"W\xE4hlen Sie aus, was erfasst werden soll:",viewportRedactionWarning:"Bei der Erfassung des sichtbaren Bereichs \xFCber den Browser k\xF6nnen private Felder nicht automatisch maskiert werden. W\xE4hlen Sie \u201EElement ausw\xE4hlen\u201C, um die automatische Maskierung beizubehalten, oder \xFCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionReviewNote:"Diese Website hat einige Felder zur Schw\xE4rzung markiert. \xDCberpr\xFCfen Sie den Screenshot vor dem Senden.",pageTooComplexViewportNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. Erfassen Sie stattdessen den sichtbaren Bereich oder w\xE4hlen Sie ein bestimmtes Element aus.",pageTooComplexElementNote:"Diese Seite ist zu komplex f\xFCr eine vollst\xE4ndige Erfassung oder eine Bereichserfassung. W\xE4hlen Sie stattdessen ein bestimmtes Element aus.",fullPage:"Ganze Seite",captureViewport:"Sichtbaren Bereich erfassen",selectArea:"Bereich ausw\xE4hlen",selectElement:"Element ausw\xE4hlen",skipScreenshot:"Screenshot \xFCberspringen",areaPickerInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich",areaPickerRedactionInstruction:"Ziehen Sie eine Auswahl um den zu erfassenden Bereich. Markierte private Felder k\xF6nnen maskiert werden, wenn sie darin enthalten sind.",elementPickerInstruction:"Klicken Sie auf ein beliebiges Element, um es zu erfassen",elementPickerTouchInstruction:"Tippen Sie auf ein beliebiges Element, um es zu erfassen",escToCancel:"ESC zum Abbrechen",capturingTitle:"Wird erfasst...",capturingScreenshot:"Screenshot wird erfasst...",captureFailedTitle:"Erfassung fehlgeschlagen",captureFailedMessage:"Der Screenshot konnte nicht erfasst werden. Die Seite ist m\xF6glicherweise zu komplex, oder Browsereinschr\xE4nkungen greifen.",chooseAnotherMethod:"Andere Methode w\xE4hlen",maskFailureTitle:"Datenschutz-Maskierung fehlgeschlagen",maskFailureMessage:"Die automatische Schw\xE4rzung privater Felder konnte nicht angewendet werden. Zum Schutz Ihrer Daten wurde dieser Screenshot verworfen. Sie k\xF6nnen Ihr Feedback weiterhin ohne Screenshot senden.",continueWithoutScreenshot:"Ohne Screenshot fortfahren",reviewScreenshotTitle:"Screenshot \xFCberpr\xFCfen",viewportRedactionUnavailableNote:"Bei diesem \xFCber den Browser erfassten sichtbaren Bereich konnten private Felder nicht automatisch maskiert werden. \xDCberpr\xFCfen und verdecken Sie sensible Bereiche vor dem Senden.",redactionCountNote:e=>e===1?`${e} privates Element wurde zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`:`${e} private Elemente wurden zur Schw\xE4rzung in diesem Screenshot markiert. \xDCberpr\xFCfen Sie ihn vor dem Senden.`,redactionLimitationsNote:"BugDrop hat nur die gemessenen markierten Bereiche abgedeckt. Es untersucht keine Pixel innerhalb eingebetteter oder gerenderter Inhalte wie iFrames, Canvas, Bildern, SVGs, Videos, CSS-Hintergr\xFCnden oder benutzerdefinierten Steuerelementen. Stellen Sie vor dem Senden sicher, dass das schwarze Feld den sensiblen Bereich vollst\xE4ndig abdeckt, oder nehmen Sie den Screenshot nach Markierung eines gr\xF6\xDFeren Bereichs erneut auf.",annotationInstruction:"Stellen Sie vor dem Senden sicher, dass keine sensiblen Informationen sichtbar sind. Verdecken Sie sensible Bereiche vor dem Absenden. Schw\xE4rzungen werden dauerhaft in das hochgeladene Bild eingebettet.",selectedElementNote:e=>`Ben\xF6tigen Sie mehr umgebenden Kontext? Passen Sie ${e} im BugDrop-Script-Tag an.`,toolDraw:"Zeichnen",toolArrow:"Pfeil",toolRectangle:"Rechteck",toolRedact:"Schw\xE4rzen",undo:"R\xFCckg\xE4ngig",retake:"Erneut aufnehmen",submitFeedback:"Feedback senden",captureTimeout:"Zeit\xFCberschreitung bei der Screenshot-Erfassung \u2014 die Seite ist m\xF6glicherweise zu komplex"};var Zt={triggerLabel:"Feedback",triggerAriaLabel:"Report a bug or send feedback",dismissButtonAriaLabel:"Dismiss feedback button",pullTabAriaLabel:"Show feedback button",dragHandleTitle:"Drag feedback button",installRequiredTitle:"Install Required",connectionErrorTitle:"Connection Error",installRequiredMessage:"BugDrop requires GitHub App installation to create issues.",apiUnreachableMessage:"Unable to reach BugDrop API. Check your network connection or script tag URL.",installApp:"Install App",welcomeTitle:"Share Your Feedback",welcomeHeadline:"Help us improve by sharing your thoughts",welcomeBodyLine1:"Report bugs, suggest features, or leave feedback.",welcomeBodyLine2:"You can optionally include annotated screenshots.",getStarted:"Get Started",feedbackFormTitle:"Send Feedback",categoryLabel:"Category",categoryBug:"Bug",categoryFeature:"Feature",categoryQuestion:"Question",nameLabel:"Name",namePlaceholder:"Your name",emailLabel:"Email",emailPlaceholder:"your@email.com",titleLabel:"Title",titlePlaceholder:"Brief description of the issue or suggestion",descriptionLabel:"Description",descriptionPlaceholder:"Provide additional details, steps to reproduce, or context...",screenshotAutoNote:"This site will attach a full-page screenshot when you submit without showing a preview. Review your page for sensitive information before sending.",screenshotAutoRedactionNote:"Some fields this site marked private may be visually masked on supported pages, but unmarked sensitive information can still be included.",screenshotRequiredNote:"\u{1F4F8} A screenshot is required before submitting.",includeScreenshotLabel:"\u{1F4F8} Include a screenshot",sendConsoleLogsLabel:"Send Console Logs",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Upload files",uploadButton:"Upload",uploadTooMany:e=>`Upload up to ${e} files. Remove a file before adding another.`,uploadUnsupportedType:"That file type is not supported. Upload an image, PDF, or short video.",uploadTooLarge:e=>`File is too large. Upload files up to ${e}.`,uploadReadError:"Could not read that file. Try another one.",removeAttachmentAriaLabel:e=>`Remove ${e}`,cancel:"Cancel",continueButton:"Continue",submit:"Submit",submittingTitle:"Submitting...",creatingIssue:"Creating issue...",rateLimited:e=>`Too many submissions. Please try again in ${e} minute${e===1?"":"s"}.`,submitFailedFallback:"Failed to submit",networkError:"Network error. Please check your connection.",submissionFailedTitle:"Submission Failed",tryAgain:"Try Again",successTitle:"Feedback Submitted!",issueCreated:e=>`Issue ${e} has been created.`,feedbackSubmittedMessage:"Your feedback has been submitted successfully.",viewOnGitHub:"View on GitHub",done:"Done",captureScreenshotTitle:"Capture Screenshot",chooseWhatToCapture:"Choose what to capture:",viewportRedactionWarning:"Browser viewport capture cannot apply automatic private-field masks. Select Element to preserve automatic masking, or review and cover sensitive areas before sending.",redactionReviewNote:"This site marked some fields for redaction. Review the screenshot before sending.",pageTooComplexViewportNote:"This page is too complex for full-page or area capture. Capture the visible viewport or select a specific element instead.",pageTooComplexElementNote:"This page is too complex for full-page or area capture. Select a specific element instead.",fullPage:"Full Page",captureViewport:"Capture Viewport",selectArea:"Select Area",selectElement:"Select Element",skipScreenshot:"Skip Screenshot",areaPickerInstruction:"Draw a selection around the area to capture",areaPickerRedactionInstruction:"Draw a selection around the area to capture. Marked private fields may be masked if included.",elementPickerInstruction:"Click any element to capture it",elementPickerTouchInstruction:"Tap any element to capture it",escToCancel:"ESC to cancel",capturingTitle:"Capturing...",capturingScreenshot:"Capturing screenshot...",captureFailedTitle:"Capture Failed",captureFailedMessage:"Failed to capture screenshot. The page may be too complex or browser restrictions may apply.",chooseAnotherMethod:"Choose Another Method",maskFailureTitle:"Privacy masking failed",maskFailureMessage:"Automatic redaction of private fields could not be applied. To protect your data, this screenshot was discarded. You can still submit feedback without one.",continueWithoutScreenshot:"Continue without screenshot",reviewScreenshotTitle:"Review Screenshot",viewportRedactionUnavailableNote:"This browser viewport capture could not apply automatic private-field masks. Review and cover any sensitive areas before sending.",redactionCountNote:e=>`${e} private ${e===1?"item was":"items were"} marked for redaction in this screenshot. Review before sending.`,redactionLimitationsNote:"BugDrop only covered the measured marked boxes. It does not inspect pixels inside embedded or rendered content such as iframes, canvas, images, SVGs, videos, CSS backgrounds, or custom controls. Confirm the black box fully covers the sensitive region before sending, or retake after marking a larger wrapper.",annotationInstruction:"Check that no sensitive information is visible before sending. Cover sensitive areas before submitting. Redactions are baked into the uploaded image.",selectedElementNote:e=>`Need more surrounding context? Adjust ${e} on the BugDrop script tag.`,toolDraw:"Draw",toolArrow:"Arrow",toolRectangle:"Rectangle",toolRedact:"Redact",undo:"Undo",retake:"Retake",submitFeedback:"Submit Feedback",captureTimeout:"Screenshot capture timed out \u2014 the page may be too complex"};var nr={triggerLabel:"Feedback",triggerAriaLabel:"Een fout melden of feedback versturen",dismissButtonAriaLabel:"Feedbackknop verbergen",pullTabAriaLabel:"Feedbackknop tonen",dragHandleTitle:"Feedbackknop verslepen",installRequiredTitle:"Installatie vereist",connectionErrorTitle:"Verbindingsfout",installRequiredMessage:"BugDrop vereist installatie van de GitHub-app om issues te kunnen aanmaken.",apiUnreachableMessage:"Kan de BugDrop-API niet bereiken. Controleer uw netwerkverbinding of de URL van de scripttag.",installApp:"App installeren",welcomeTitle:"Deel uw feedback",welcomeHeadline:"Help ons verbeteren door uw mening te delen",welcomeBodyLine1:"Meld fouten, stel functies voor of laat feedback achter.",welcomeBodyLine2:"U kunt optioneel schermafbeeldingen met aantekeningen toevoegen.",getStarted:"Aan de slag",feedbackFormTitle:"Feedback versturen",categoryLabel:"Categorie",categoryBug:"Fout",categoryFeature:"Suggestie",categoryQuestion:"Vraag",nameLabel:"Naam",namePlaceholder:"Uw naam",emailLabel:"E-mail",emailPlaceholder:"uw@email.nl",titleLabel:"Titel",titlePlaceholder:"Korte omschrijving van het probleem of de suggestie",descriptionLabel:"Omschrijving",descriptionPlaceholder:"Geef extra details, stappen om het te reproduceren of context...",screenshotAutoNote:"Deze site voegt bij het versturen automatisch een schermafbeelding van de volledige pagina toe, zonder voorbeeld. Controleer uw pagina op gevoelige informatie voordat u verstuurt.",screenshotAutoRedactionNote:"Sommige velden die deze site als priv\xE9 heeft gemarkeerd, kunnen op ondersteunde pagina\u2019s visueel worden gemaskeerd, maar niet-gemarkeerde gevoelige informatie kan nog steeds worden meegestuurd.",screenshotRequiredNote:"\u{1F4F8} Een schermafbeelding is vereist voordat u kunt versturen.",includeScreenshotLabel:"\u{1F4F8} Schermafbeelding toevoegen",sendConsoleLogsLabel:"Consolelogboeken meesturen",uploadsAriaLabel:"Uploads",uploadFilesAriaLabel:"Bestanden uploaden",uploadButton:"Uploaden",uploadTooMany:e=>`Upload maximaal ${e} bestanden. Verwijder een bestand voordat u er een toevoegt.`,uploadUnsupportedType:"Dat bestandstype wordt niet ondersteund. Upload een afbeelding, pdf of korte video.",uploadTooLarge:e=>`Het bestand is te groot. Upload bestanden tot ${e}.`,uploadReadError:"Kan dat bestand niet lezen. Probeer een ander bestand.",removeAttachmentAriaLabel:e=>`${e} verwijderen`,cancel:"Annuleren",continueButton:"Doorgaan",submit:"Versturen",submittingTitle:"Versturen...",creatingIssue:"Issue aanmaken...",rateLimited:e=>`Te veel inzendingen. Probeer het over ${e} ${e===1?"minuut":"minuten"} opnieuw.`,submitFailedFallback:"Versturen mislukt",networkError:"Netwerkfout. Controleer uw verbinding.",submissionFailedTitle:"Versturen mislukt",tryAgain:"Opnieuw proberen",successTitle:"Feedback verstuurd!",issueCreated:e=>`Issue ${e} is aangemaakt.`,feedbackSubmittedMessage:"Uw feedback is succesvol verstuurd.",viewOnGitHub:"Bekijken op GitHub",done:"Klaar",captureScreenshotTitle:"Schermafbeelding maken",chooseWhatToCapture:"Kies wat u wilt vastleggen:",viewportRedactionWarning:"Bij het vastleggen van het zichtbare deel via de browser kunnen priv\xE9velden niet automatisch worden gemaskeerd. Kies \u201CElement selecteren\u201D om automatische maskering te behouden, of controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionReviewNote:"Deze site heeft enkele velden gemarkeerd voor redactie. Controleer de schermafbeelding voordat u verstuurt.",pageTooComplexViewportNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Leg het zichtbare deel vast of selecteer een specifiek element.",pageTooComplexElementNote:"Deze pagina is te complex om volledig of per gebied vast te leggen. Selecteer in plaats daarvan een specifiek element.",fullPage:"Volledige pagina",captureViewport:"Zichtbaar deel vastleggen",selectArea:"Gebied selecteren",selectElement:"Element selecteren",skipScreenshot:"Schermafbeelding overslaan",areaPickerInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen",areaPickerRedactionInstruction:"Trek een selectie rond het gebied dat u wilt vastleggen. Gemarkeerde priv\xE9velden kunnen worden gemaskeerd als ze binnen de selectie vallen.",elementPickerInstruction:"Klik op een element om het vast te leggen",elementPickerTouchInstruction:"Tik op een element om het vast te leggen",escToCancel:"ESC om te annuleren",capturingTitle:"Vastleggen...",capturingScreenshot:"Schermafbeelding wordt gemaakt...",captureFailedTitle:"Opname mislukt",captureFailedMessage:"Kan geen schermafbeelding maken. De pagina is mogelijk te complex of de browser staat dit niet toe.",chooseAnotherMethod:"Kies een andere methode",maskFailureTitle:"Privacymaskering mislukt",maskFailureMessage:"Automatische redactie van priv\xE9velden kon niet worden toegepast. Om uw gegevens te beschermen is deze schermafbeelding verwijderd. U kunt uw feedback nog steeds zonder schermafbeelding versturen.",continueWithoutScreenshot:"Doorgaan zonder schermafbeelding",reviewScreenshotTitle:"Schermafbeelding controleren",viewportRedactionUnavailableNote:"Bij deze via de browser vastgelegde schermafbeelding konden priv\xE9velden niet automatisch worden gemaskeerd. Controleer en dek gevoelige gebieden af voordat u verstuurt.",redactionCountNote:e=>e===1?"1 priv\xE9-item is gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.":`${e} priv\xE9-items zijn gemarkeerd voor redactie in deze schermafbeelding. Controleer voordat u verstuurt.`,redactionLimitationsNote:"BugDrop heeft alleen de gemeten gemarkeerde vakken afgedekt. Het inspecteert geen pixels binnen ingesloten of gerenderde inhoud zoals iframes, canvas, afbeeldingen, SVG\u2019s, video\u2019s, CSS-achtergronden of aangepaste elementen. Controleer of het zwarte vak het gevoelige gebied volledig bedekt voordat u verstuurt, of maak de afbeelding opnieuw nadat u een groter element hebt gemarkeerd.",annotationInstruction:"Controleer of er geen gevoelige informatie zichtbaar is voordat u verstuurt. Dek gevoelige gebieden af voordat u indient. Redacties worden permanent in de ge\xFCploade afbeelding verwerkt.",selectedElementNote:e=>`Meer omringende context nodig? Pas ${e} aan op de BugDrop-scripttag.`,toolDraw:"Tekenen",toolArrow:"Pijl",toolRectangle:"Rechthoek",toolRedact:"Redigeren",undo:"Ongedaan maken",retake:"Opnieuw maken",submitFeedback:"Feedback versturen",captureTimeout:"Het maken van de schermafbeelding duurde te lang \u2014 de pagina is mogelijk te complex"};function Jt(e){let t=e%10,n=e%100;return t>=2&&t<=4&&(n<12||n>14)}var rr={triggerLabel:"Opinia",triggerAriaLabel:"Zg\u0142o\u015B b\u0142\u0105d lub wy\u015Blij opini\u0119",dismissButtonAriaLabel:"Ukryj przycisk opinii",pullTabAriaLabel:"Poka\u017C przycisk opinii",dragHandleTitle:"Przeci\u0105gnij przycisk opinii",installRequiredTitle:"Wymagana instalacja",connectionErrorTitle:"B\u0142\u0105d po\u0142\u0105czenia",installRequiredMessage:"BugDrop wymaga instalacji aplikacji GitHub, aby tworzy\u0107 zg\u0142oszenia.",apiUnreachableMessage:"Nie mo\u017Cna po\u0142\u0105czy\u0107 si\u0119 z API BugDrop. Sprawd\u017A po\u0142\u0105czenie sieciowe lub adres URL w tagu skryptu.",installApp:"Zainstaluj aplikacj\u0119",welcomeTitle:"Podziel si\u0119 opini\u0105",welcomeHeadline:"Pom\xF3\u017C nam si\u0119 rozwija\u0107, dziel\u0105c si\u0119 swoimi uwagami",welcomeBodyLine1:"Zg\u0142aszaj b\u0142\u0119dy, proponuj funkcje lub zostaw opini\u0119.",welcomeBodyLine2:"Opcjonalnie mo\u017Cesz do\u0142\u0105czy\u0107 zrzuty ekranu z adnotacjami.",getStarted:"Rozpocznij",feedbackFormTitle:"Wy\u015Blij opini\u0119",categoryLabel:"Kategoria",categoryBug:"B\u0142\u0105d",categoryFeature:"Propozycja",categoryQuestion:"Pytanie",nameLabel:"Imi\u0119 i nazwisko",namePlaceholder:"Twoje imi\u0119 i nazwisko",emailLabel:"E-mail",emailPlaceholder:"twoj@email.com",titleLabel:"Tytu\u0142",titlePlaceholder:"Kr\xF3tki opis problemu lub sugestii",descriptionLabel:"Opis",descriptionPlaceholder:"Podaj dodatkowe szczeg\xF3\u0142y, kroki do odtworzenia lub kontekst...",screenshotAutoNote:"Ta strona automatycznie do\u0142\u0105czy zrzut ca\u0142ej strony podczas wysy\u0142ania, bez pokazywania podgl\u0105du. Przed wys\u0142aniem sprawd\u017A, czy strona nie zawiera poufnych informacji.",screenshotAutoRedactionNote:"Niekt\xF3re pola oznaczone przez t\u0119 stron\u0119 jako prywatne mog\u0105 zosta\u0107 zamaskowane na obs\u0142ugiwanych stronach, ale nieoznaczone poufne informacje nadal mog\u0105 zosta\u0107 do\u0142\u0105czone.",screenshotRequiredNote:"\u{1F4F8} Zrzut ekranu jest wymagany przed wys\u0142aniem.",includeScreenshotLabel:"\u{1F4F8} Do\u0142\u0105cz zrzut ekranu",sendConsoleLogsLabel:"Wy\u015Blij logi konsoli",uploadsAriaLabel:"Za\u0142\u0105czniki",uploadFilesAriaLabel:"Prze\u015Blij pliki",uploadButton:"Prze\u015Blij",uploadTooMany:e=>`Mo\u017Cna przes\u0142a\u0107 maksymalnie ${e} ${Jt(e)?"pliki":"plik\xF3w"}. Usu\u0144 plik, aby doda\u0107 kolejny.`,uploadUnsupportedType:"Ten typ pliku nie jest obs\u0142ugiwany. Prze\u015Blij obraz, plik PDF lub kr\xF3tki film.",uploadTooLarge:e=>`Plik jest za du\u017Cy. Prze\u015Blij pliki o rozmiarze do ${e}.`,uploadReadError:"Nie uda\u0142o si\u0119 odczyta\u0107 pliku. Spr\xF3buj z innym.",removeAttachmentAriaLabel:e=>`Usu\u0144 ${e}`,cancel:"Anuluj",continueButton:"Dalej",submit:"Wy\u015Blij",submittingTitle:"Wysy\u0142anie...",creatingIssue:"Tworzenie zg\u0142oszenia...",rateLimited:e=>`Zbyt wiele zg\u0142osze\u0144. Spr\xF3buj ponownie za ${e} ${e===1?"minut\u0119":Jt(e)?"minuty":"minut"}.`,submitFailedFallback:"Nie uda\u0142o si\u0119 wys\u0142a\u0107",networkError:"B\u0142\u0105d sieci. Sprawd\u017A po\u0142\u0105czenie z internetem.",submissionFailedTitle:"Wysy\u0142anie nie powiod\u0142o si\u0119",tryAgain:"Spr\xF3buj ponownie",successTitle:"Opinia wys\u0142ana!",issueCreated:e=>`Utworzono zg\u0142oszenie ${e}.`,feedbackSubmittedMessage:"Twoja opinia zosta\u0142a pomy\u015Blnie wys\u0142ana.",viewOnGitHub:"Zobacz na GitHubie",done:"Gotowe",captureScreenshotTitle:"Zr\xF3b zrzut ekranu",chooseWhatToCapture:"Wybierz, co przechwyci\u0107:",viewportRedactionWarning:"Przechwytywanie widocznego obszaru przez przegl\u0105dark\u0119 nie pozwala automatycznie zamaskowa\u0107 p\xF3l prywatnych. Wybierz \u201EZaznacz element\u201D, aby zachowa\u0107 automatyczne maskowanie, albo sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionReviewNote:"Ta strona oznaczy\u0142a niekt\xF3re pola do zamazania. Sprawd\u017A zrzut ekranu przed wys\u0142aniem.",pageTooComplexViewportNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Przechwy\u0107 widoczny obszar albo zaznacz konkretny element.",pageTooComplexElementNote:"Ta strona jest zbyt z\u0142o\u017Cona, aby przechwyci\u0107 ca\u0142\u0105 stron\u0119 lub zaznaczony obszar. Zamiast tego zaznacz konkretny element.",fullPage:"Ca\u0142a strona",captureViewport:"Przechwy\u0107 widoczny obszar",selectArea:"Zaznacz obszar",selectElement:"Zaznacz element",skipScreenshot:"Pomi\u0144 zrzut ekranu",areaPickerInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia",areaPickerRedactionInstruction:"Narysuj zaznaczenie wok\xF3\u0142 obszaru do przechwycenia. Pola oznaczone jako prywatne mog\u0105 zosta\u0107 zamaskowane, je\u015Bli znajd\u0105 si\u0119 w zaznaczeniu.",elementPickerInstruction:"Kliknij dowolny element, aby go przechwyci\u0107",elementPickerTouchInstruction:"Dotknij dowolny element, aby go przechwyci\u0107",escToCancel:"ESC, aby anulowa\u0107",capturingTitle:"Przechwytywanie...",capturingScreenshot:"Trwa przechwytywanie zrzutu ekranu...",captureFailedTitle:"Przechwytywanie nie powiod\u0142o si\u0119",captureFailedMessage:"Nie uda\u0142o si\u0119 przechwyci\u0107 zrzutu ekranu. Strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona lub przegl\u0105darka na to nie pozwala.",chooseAnotherMethod:"Wybierz inn\u0105 metod\u0119",maskFailureTitle:"Maskowanie prywatno\u015Bci nie powiod\u0142o si\u0119",maskFailureMessage:"Nie uda\u0142o si\u0119 automatycznie zamaza\u0107 p\xF3l prywatnych. Aby chroni\u0107 Twoje dane, ten zrzut ekranu zosta\u0142 odrzucony. Nadal mo\u017Cesz wys\u0142a\u0107 opini\u0119 bez zrzutu ekranu.",continueWithoutScreenshot:"Kontynuuj bez zrzutu ekranu",reviewScreenshotTitle:"Sprawd\u017A zrzut ekranu",viewportRedactionUnavailableNote:"Na tym zrzucie przechwyconym przez przegl\u0105dark\u0119 nie uda\u0142o si\u0119 automatycznie zamaskowa\u0107 p\xF3l prywatnych. Sprawd\u017A i zakryj poufne obszary przed wys\u0142aniem.",redactionCountNote:e=>`${e} ${e===1?"prywatny element oznaczono":Jt(e)?"prywatne elementy oznaczono":"prywatnych element\xF3w oznaczono"} do zamazania na tym zrzucie ekranu. Sprawd\u017A przed wys\u0142aniem.`,redactionLimitationsNote:"BugDrop zakrywa tylko zmierzone, oznaczone obszary. Nie analizuje pikseli wewn\u0105trz osadzonej lub renderowanej zawarto\u015Bci, takiej jak elementy iframe, canvas, obrazy, pliki SVG, filmy, t\u0142a CSS czy niestandardowe kontrolki. Przed wys\u0142aniem upewnij si\u0119, \u017Ce czarny prostok\u0105t w pe\u0142ni zakrywa poufny obszar, albo pon\xF3w zrzut po oznaczeniu wi\u0119kszego elementu.",annotationInstruction:"Przed wys\u0142aniem sprawd\u017A, czy nie wida\u0107 poufnych informacji. Zakryj poufne obszary przed przes\u0142aniem. Zamazania s\u0105 trwale zapisywane w przesy\u0142anym obrazie.",selectedElementNote:e=>`Potrzebujesz wi\u0119cej otaczaj\u0105cego kontekstu? Dostosuj ${e} w tagu skryptu BugDrop.`,toolDraw:"Rysuj",toolArrow:"Strza\u0142ka",toolRectangle:"Prostok\u0105t",toolRedact:"Zama\u017C",undo:"Cofnij",retake:"Pon\xF3w zrzut",submitFeedback:"Wy\u015Blij opini\u0119",captureTimeout:"Up\u0142yn\u0105\u0142 limit czasu przechwytywania zrzutu ekranu \u2014 strona mo\u017Ce by\u0107 zbyt z\u0142o\u017Cona"};var or=/[;{}<>]|\/\*|\*\/|@import|url\s*\(|<\/style/i,wa=/^-?[_a-zA-Z][_a-zA-Z0-9-]*$/,va=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,xa=/^(?:rgb|rgba|hsl|hsla)\(\s*[-+.\d%]+\s*(?:,\s*[-+.\d%]+\s*){2,3}\)$/i;function q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function We(e){let t=e?.trim();if(!t||t==="none")return t;try{let n=new URL(t,window.location.href);if(n.protocol==="https:"||n.protocol==="http:")return t}catch{return}}function _(e){let t=e?.trim();if(!(!t||or.test(t))&&(va.test(t)||xa.test(t)||wa.test(t)||typeof CSS<"u"&&CSS.supports?.("color",t)))return t}function Ae(e){let t=e?.trim();if(t){if(t==="inherit")return t;if(!or.test(t)&&/^[\w\s"',.-]+$/.test(t))return t}}function Qt(e){let t=e?.trim();if(!t||!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(t))return;let n=Number(t);return Number.isFinite(n)?n:void 0}function J(e){let n=e?.trim()?.match(/^((?:0|[1-9]\d*)(?:\.\d+)?)(?:px)?$/);if(!n)return;let r=Number(n[1]);return Number.isFinite(r)?r:void 0}function ir(e){let t=e?.trim();if(!t||!/^[1-9]\d*$/.test(t))return;let n=Number(t);return Number.isSafeInteger(n)?n:void 0}function ut(e){if(e==="none"||e==="soft"||e==="hard")return e}var ar={en:Zt,de:tr,nl:nr,pl:rr};function v(e){return q(e)}function sr(e){if(!e)return"en";let t=e.toLowerCase().split(/[-_]/)[0];return Object.prototype.hasOwnProperty.call(ar,t)?t:(console.warn(`[BugDrop] Unsupported data-locale "${e}"; falling back to English.`),"en")}var lr=Zt;function cr(e){lr=ar[e]}function p(){return lr}var Ea=15e3;function je(e,t){let n,r=new Promise((o,i)=>{n=setTimeout(()=>{try{t?.()}catch{}i(new Error(p().captureTimeout))},Ea)});return Promise.race([e,r]).finally(()=>clearTimeout(n))}var en="#bugdrop-host, [data-bugdrop-owned]";function te(e){if(e instanceof ShadowRoot)return te(e.host);if(!(e instanceof Element))return!1;if(e.matches(en)||e.closest(en))return!0;let t=e.getRootNode();return t instanceof ShadowRoot&&te(t.host)}async function dr(e){let n=Array.from(document.querySelectorAll(en)).map(r=>({root:r,value:r.style.getPropertyValue("visibility"),priority:r.style.getPropertyPriority("visibility")}));for(let{root:r}of n)r.style.setProperty("visibility","hidden","important");try{return await e()}finally{for(let{root:r,value:o,priority:i}of n)o?r.style.setProperty("visibility",o,i):r.style.removeProperty("visibility")}}var Pe=class extends Error{constructor(t,n){super(t,n),this.name="MaskApplicationError"}},ka="[data-bugdrop-mask], [data-bugdrop-redact], [data-bd-redact], [data-bugdrop-redacted]",Sa='input[type="password"], input[autocomplete*="cc-number"], input[autocomplete*="cc-csc"], input[autocomplete*="cc-exp"]',ur="iframe, canvas, img, svg, video",Ca=new Set(["CANVAS","IMG","SVG"]),Ta=new Set(["VIDEO"]);function pt(e){return e.matches(ka)?"developer-marked":e.matches(Sa)?"sensitive-input":null}function mt(e,t){let n=e.getBoundingClientRect();return n.width===0||n.height===0?null:{element:e,rect:{x:n.left+window.scrollX,y:n.top+window.scrollY,w:n.width,h:n.height},reason:t,strategy:"canvas-mask"}}function bt(e){let t=[],n=[];if(te(e))return{targets:t,unsupportedSurfaces:n,redactionCount:0};let r=pt(e);if(r){let o=mt(e,r);return o&&(t.push(o),an(e,n)),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}return rn(e,t,n),on(e,t,n),{targets:t,unsupportedSurfaces:n,redactionCount:t.length}}function pr(e=document.body,t){let n=bt(e).targets.map(r=>r.rect);return t?n.filter(r=>tn(r,t)).length:n.length}function mr(e,t){let n=t?e.targets.filter(o=>tn(o.rect,t)):e.targets,r=t?e.unsupportedSurfaces.filter(o=>tn(o.rect,t)):e.unsupportedSurfaces;return{count:n.length,hasLimitations:r.length>0}}function tn(e,t){return e.x<t.x+t.width&&e.x+e.w>t.x&&e.y<t.y+t.height&&e.y+e.h>t.y}function rn(e,t,n){for(let r of Array.from(e.children)){if(te(r))continue;let o=pt(r);if(o){let i=mt(r,o);i&&(t.push(i),an(r,n));continue}rn(r,t,n),on(r,t,n)}}function on(e,t,n){let r=e.shadowRoot;if(r)for(let o of Array.from(r.children)){let i=pt(o);if(i){let a=mt(o,i);a&&(t.push(a),an(o,n));continue}rn(o,t,n),on(o,t,n)}}function an(e,t){nn(e,t);for(let n of Array.from(e.querySelectorAll(ur)))nn(n,t);br(e,t)}function nn(e,t){let n=La(e);if(!n)return;let r=mt(e,pt(e)??"developer-marked");r&&t.push({tagName:e.tagName,reason:n,rect:r.rect})}function La(e){let t=e.tagName.toUpperCase();return t==="IFRAME"?"embedded-document":Ca.has(t)?"pixel-content":Ta.has(t)?"media-content":null}function br(e,t){let n=e.shadowRoot;if(n)for(let r of Array.from(n.querySelectorAll(ur)))nn(r,t);for(let r of Array.from(e.children))br(r,t)}function Fa(e,t,n,r,o){let i=(e.x-n.x)*t,a=(e.y-n.y)*t,s=e.w*t,l=e.h*t,d=Math.max(0,Math.floor(i)-1),c=Math.max(0,Math.floor(a)-1),u=Math.min(r,Math.ceil(i+s)+1),m=Math.min(o,Math.ceil(a+l)+1);return{x:d,y:c,w:u-d,h:m-c}}async function sn(e,t,n,r={x:0,y:0}){if(t.length===0)return e;let o=await Aa(e),i=document.createElement("canvas");i.width=o.naturalWidth||o.width,i.height=o.naturalHeight||o.height;let a=i.getContext("2d");if(!a)throw new Pe("Failed to get canvas context for privacy masking");a.drawImage(o,0,0),a.fillStyle="#000";for(let s of t){let l=Fa(s,n,r,i.width,i.height);l.w>0&&l.h>0&&a.fillRect(l.x,l.y,l.w,l.h)}return i.toDataURL("image/png")}function Aa(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Pe("Failed to load image for privacy masking")),r.src=e})}var Ge="#14b8a6";function ge(e){return e||Ge}function gt(e){return`color-mix(in srgb, ${e} 85%, black)`}function gr(e){return e??0}function cn(){return dr(Pa)}function Pa(){if(window.__bugdropMockViewportCapture)return window.__bugdropMockViewportCapture();if(!navigator.mediaDevices?.getDisplayMedia)return Promise.reject(new Error("Screen Capture API is not available"));let e={video:{displaySurface:"browser"},audio:!1,preferCurrentTab:!0},t=new AbortController,n=navigator.mediaDevices.getDisplayMedia(e).then(r=>Ra(r,t.signal));return je(n,()=>t.abort())}async function Ra(e,t){let n=document.createElement("video");n.muted=!0,n.playsInline=!0;let r=Da(e,n,t);try{Ma(e),ln(t),await Ia(n,e,t,r),ln(t);let o=n.videoWidth||window.innerWidth,i=n.videoHeight||window.innerHeight;if(!o||!i)throw new Error("Screen capture stream did not provide a video frame");let a=document.createElement("canvas");a.width=o,a.height=i;let s=a.getContext("2d");if(!s)throw new Error("Failed to get canvas context");return s.drawImage(n,0,0,o,i),a.toDataURL("image/png")}finally{r.cleanup()}}function Ma(e){let[t]=e.getVideoTracks(),n=t?.getSettings().displaySurface;if(n&&n!=="browser")throw new Error("Please choose the current browser tab for viewport capture")}function Da(e,t,n){let r=!1,o=!1,i=[],a=()=>{if(!r){r=!0;for(let l of i.splice(0))l();for(let l of e.getTracks())l.stop();o&&(t.srcObject=null)}},s=()=>a();return n.addEventListener("abort",s,{once:!0}),i.push(()=>n.removeEventListener("abort",s)),n.aborted&&a(),{attachStream:()=>{r||(t.srcObject=e,o=!0)},cleanup:a}}async function Ia(e,t,n,r){r.attachStream(),ln(n);let o;try{o=e.play()}catch{o=Promise.resolve()}await za(o.then(()=>{},()=>{}),n),!(typeof e.requestVideoFrameCallback=="function"&&(await $a(e,n),e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA))&&(e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA||await Oa(e,n))}function za(e,t){return t.aborted?Promise.reject(Xe()):new Promise((n,r)=>{let o=()=>{t.removeEventListener("abort",o),r(Xe())};t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})})}function $a(e,t){return new Promise((n,r)=>{let o,i=setTimeout(()=>s(n),250),a=()=>s(()=>r(Xe())),s=l=>{clearTimeout(i),t.removeEventListener("abort",a),o!==void 0&&e.cancelVideoFrameCallback?.(o),o=void 0,l()};t.addEventListener("abort",a,{once:!0}),o=e.requestVideoFrameCallback?.(()=>s(n)),t.aborted&&a()})}function Oa(e,t){return new Promise((n,r)=>{let o=setTimeout(()=>l(n),250),i=()=>l(n),a=()=>l(()=>r(new Error("Failed to load screen capture stream"))),s=()=>l(()=>r(Xe())),l=d=>{clearTimeout(o),e.removeEventListener("loadeddata",i),e.removeEventListener("canplay",i),e.removeEventListener("error",a),t.removeEventListener("abort",s),d()};e.addEventListener("loadeddata",i),e.addEventListener("canplay",i),e.addEventListener("error",a),t.addEventListener("abort",s,{once:!0}),t.aborted&&s()})}function ln(e){if(e.aborted)throw Xe()}function Xe(){return new DOMException("Viewport capture aborted","AbortError")}var fr=3e3,hr="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",Na=1e4,Ba=fr;function Re(){return document.body.querySelectorAll("*").length}function ne(){return Re()>=_a()}function _a(e=navigator.userAgent){return Ha(e)?Ba:Na}function Ha(e=navigator.userAgent){return/Safari\//.test(e)&&!/(Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|Opera)\//.test(e)}function yr(e,t){if(e&&Re()>fr)return 1;let n=t??2;return Math.max(window.devicePixelRatio||1,n)}function wr(){let e=window.isSecureContext||location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1",t=typeof window.__bugdropMockViewportCapture=="function"||typeof navigator.mediaDevices?.getDisplayMedia=="function";return e&&t}async function vr(e,t,n={}){let r=e||document.body,o=!e,i=ft(e||document.body),a=n.highlightElement&&r.contains(n.highlightElement)?ft(n.highlightElement):null,s=n.pixelRatio??yr(o,t),l=e?window.getComputedStyle(e):null,d=kr(),c={cacheBust:!1,imagePlaceholder:hr,pixelRatio:s,filter:Er,...l&&(l.marginLeft!=="0px"||l.marginRight!=="0px")?{style:{margin:`${l.marginTop} 0px ${l.marginBottom} 0px`}}:{}},u=bt(r),m=e?{x:i.x,y:i.y}:{x:0,y:0},x=d(r,c),y=await je(x),f=await sn(y,u.targets.map(S=>S.rect),s,m);return ht(a?await Sr(f,a,i,n.highlightStyle):f,u)}async function xr(e,t,n={}){let r=n.pixelRatio??yr(!0,t),o={x:e.x,y:e.y,w:e.width,h:e.height},i=n.highlightElement&&document.body.contains(n.highlightElement)?ft(n.highlightElement):null,a=kr(),s={cacheBust:!1,imagePlaceholder:hr,pixelRatio:r,width:e.width,height:e.height,style:{transform:`translate(${-e.x}px, ${-e.y}px)`,transformOrigin:"top left",width:`${document.documentElement.scrollWidth}px`,height:`${document.documentElement.scrollHeight}px`},filter:Er},l=bt(document.body),d=await je(a(document.body,s)),c=await sn(d,l.targets.map(u=>u.rect),r,{x:e.x,y:e.y});return ht(i?await Sr(c,i,o,n.highlightStyle):c,l,e)}function Me(e,t){return pr(e??document.body,t)}function Er(e){return!(te(e)||Va(e)&&Ua(e))}function Va(e){return e.tagName?.toUpperCase()==="IMG"}function Ua(e){let t=(e.ownerDocument.defaultView??window).getComputedStyle(e);if(t.display==="none"||t.visibility==="hidden")return!0;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0}function kr(){return window.__bugdropMockToPng?window.__bugdropMockToPng:er}function ht(e,t,n){return{dataUrl:e,redaction:mr(t,n)}}async function Sr(e,t,n,r={}){if(t.w<=0||t.h<=0)return e;let o=await Ga(e),i=o.naturalWidth||o.width,a=o.naturalHeight||o.height,s=i/Math.max(1,n.w),l=a/Math.max(1,n.h),d=Math.max(1,(s+l)/2),c=Wa(r.borderWidth,d),m=2*d+c/2,x=(t.x-n.x)*s-m,y=(t.y-n.y)*l-m,f=t.w*s+m*2,S=t.h*l+m*2,F=Math.max(0,Math.ceil(-x)),R=Math.max(0,Math.ceil(-y)),M=Math.max(0,Math.ceil(x+f-i)),T=Math.max(0,Math.ceil(y+S-a)),D=document.createElement("canvas");D.width=i+F+M,D.height=a+R+T;let w=D.getContext("2d");if(!w)throw new Error("Failed to get canvas context for selected element highlight");w.drawImage(o,F,R);let L=Math.round(x+F),z=Math.round(y+R),I=Math.round(f),$=Math.round(S),C=ja(r.radius,d),N=ge(r.accentColor);return qa(w,L,z,I,$,C),w.lineWidth=c,w.strokeStyle=N,w.stroke(),D.toDataURL("image/png")}function qa(e,t,n,r,o,i){let a=Math.max(0,Math.min(i,r/2,o/2));e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+o-a),e.quadraticCurveTo(t+r,n+o,t+r-a,n+o),e.lineTo(t+a,n+o),e.quadraticCurveTo(t,n+o,t,n+o-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath()}function Wa(e,t){let n=Number.parseFloat(e||"3");return Math.max(1,Math.round((Number.isFinite(n)?n:3)*t))}function ja(e,t){let n=Number.parseFloat(e||"6");return Math.max(0,Math.round((Number.isFinite(n)?n:6)*t))}function ft(e){let t=e.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function Ga(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(new Error("Failed to load image for selected element highlight")),r.src=e})}function yt(e){let t=e?.theme==="dark",n=J(e?.radius),r=J(e?.borderWidth),o=Ae(e?.font);return{accent:ge(_(e?.accentColor)),fontFamily:e?.font==="inherit"?"system-ui, sans-serif":o||"'Space Grotesk', system-ui, sans-serif",radius:n!==void 0?`${n}px`:"6px",bw:r!==void 0?String(r):"3",tooltipBg:_(e?.bgColor)||(t?"#0f172a":"#1a1a1a"),tooltipText:_(e?.textColor)||"#f1f5f9",tooltipBorder:_(e?.borderColor)||(t?"#334155":"#333")}}var Xa=new Set(["alert","alertdialog","application","article","banner","button","cell","checkbox","columnheader","combobox","complementary","contentinfo","definition","dialog","directory","document","feed","figure","form","grid","gridcell","group","heading","img","link","list","listbox","listitem","log","main","marquee","math","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","meter","navigation","none","note","option","presentation","progressbar","radio","radiogroup","region","row","rowgroup","rowheader","scrollbar","search","searchbox","separator","slider","spinbutton","status","switch","tab","table","tablist","tabpanel","term","textbox","timer","toolbar","tooltip","tree","treegrid","treeitem"]),Ka=new Set(["button","checkbox","link","menuitem","menuitemcheckbox","menuitemradio","option","radio","searchbox","switch","tab","textbox"]),Ya=new Set(["button","input","select","textarea"]);function Cr(e){return Za(e)??e}function Za(e){let{body:t,documentElement:n}=e.ownerDocument,r=e;for(;r&&r!==t&&r!==n;){if(Ja(r))return r;r=r.parentElement}return null}function Ja(e){if(e.getAttribute("aria-disabled")==="true")return!1;let t=e.tagName.toLowerCase();if(t==="a")return e.hasAttribute("href");if(Ya.has(t))return!("disabled"in e&&e.disabled);if(t==="summary")return!0;let n=Qa(e);if(n&&Ka.has(n))return!0;let r=e.getAttribute("tabindex");return r!==null&&Number.parseInt(r,10)>=0}function Qa(e){let t=e.getAttribute("role");if(!t)return null;for(let n of t.split(/\s+/)){let r=n.toLowerCase();if(Xa.has(r))return r}return null}var es=new Set(["bugdrop-element-picker-overlay","bugdrop-element-picker-highlight","bugdrop-element-picker-tooltip","bugdrop-element-picker-cancel"]);function ts(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}function ns(){let e=document.createElement("div");return e.id="bugdrop-element-picker-overlay",e.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    cursor: crosshair;
    touch-action: none;
    user-select: none;
    background: transparent;
  `,e}function rs(e){let t=document.createElement("div");return t.id="bugdrop-element-picker-highlight",t.style.cssText=`
    position: fixed;
    box-sizing: content-box;
    pointer-events: none;
    border: ${e.bw}px solid ${e.accent};
    background: transparent;
    z-index: 2147483645;
    transition: all 0.05s ease-out;
    box-shadow: none;
    border-radius: ${e.radius};
  `,t}function os(e,t){let n=document.createElement("div");if(n.id="bugdrop-element-picker-tooltip",n.style.cssText=`
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
  `,!t)return n.textContent=`${p().elementPickerInstruction} (${p().escToCancel})`,{tooltip:n,cancelButton:null};let r=cs(e.accent);return n.append(`${p().elementPickerTouchInstruction} (`,r,")"),{tooltip:n,cancelButton:r}}function is(e,t){let n=t.getBoundingClientRect();e.style.top=`${n.top-2}px`,e.style.left=`${n.left-2}px`,e.style.width=`${n.width+4}px`,e.style.height=`${n.height+4}px`,e.style.display="block"}function as(e){e.overlay.addEventListener("pointerdown",e.onPointerDown),e.overlay.addEventListener("pointermove",e.onPointerMove),e.overlay.addEventListener("pointerup",e.onPointerUp),e.overlay.addEventListener("pointercancel",e.onPointerCancel),document.addEventListener("mousemove",e.onMouseMove,!0)}function ss(e){e.overlay.removeEventListener("pointerdown",e.onPointerDown),e.overlay.removeEventListener("pointermove",e.onPointerMove),e.overlay.removeEventListener("pointerup",e.onPointerUp),e.overlay.removeEventListener("pointercancel",e.onPointerCancel),document.removeEventListener("mousemove",e.onMouseMove,!0)}function Tr(e,t){return new Promise(n=>{setTimeout(()=>{t?.aborted?n(null):ls(n,e,t)},50)})}function ls(e,t,n){let{accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:d}=yt(t),c=ns();document.body.appendChild(c);let u=rs({accent:r,bw:a,radius:i});document.body.appendChild(u);let{tooltip:m,cancelButton:x}=os({accent:r,fontFamily:o,radius:i,bw:a,tooltipBg:s,tooltipText:l,tooltipBorder:d},ts());document.body.appendChild(m);let y=null,f=null,S=!1,F;function R(g){return g===c||g===u||g===m||es.has(g.id)}function M(g,Y){let ee=c.style.pointerEvents;return c.style.pointerEvents="none",(()=>{try{return document.elementsFromPoint(g,Y)}finally{c.style.pointerEvents=ee}})().find(In=>!(R(In)||te(In)))}function T(g,Y,ee){let ke=M(g,Y);return ke?Cr(ke):ee}function D(g){y=T(g.clientX,g.clientY,y),y&&is(u,y)}function w(g,Y,ee=!1){y=T(g,Y,y),L(y,ee)}function L(g,Y=!1){S||(S=!0,U(Y),e(g))}let z=()=>L(null);function I(g){f!==null||!g.isPrimary||(g.preventDefault(),g.stopPropagation(),f=g.pointerId,c.setPointerCapture?.(g.pointerId),y=T(g.clientX,g.clientY,y))}function $(g){f!==null&&g.pointerId!==f||(g.preventDefault(),g.stopPropagation(),D(g))}function C(g){f!==null&&g.pointerId!==f||(g.preventDefault(),g.stopPropagation(),f=null,c.releasePointerCapture?.(g.pointerId),w(g.clientX,g.clientY,!0))}function N(g){g.pointerId===f&&(f=null,c.releasePointerCapture?.(g.pointerId))}function h(g){if(S){if(document.removeEventListener("click",h,!0),te(g.target))return;g.preventDefault(),g.stopImmediatePropagation();return}if(g.preventDefault(),g.stopImmediatePropagation(),g.target instanceof Element&&g.target.id==="bugdrop-element-picker-cancel"){L(null);return}w(g.clientX,g.clientY)}function b(g){g.target instanceof Element&&g.target.id==="bugdrop-element-picker-cancel"||(g.type==="pointerdown"&&I(g),g.type==="pointermove"&&$(g),g.type==="pointerup"&&C(g),g.type==="pointercancel"&&N(g),g.preventDefault(),g.stopImmediatePropagation())}function A(g){g.key==="Escape"&&L(null)}function O(g){g.preventDefault(),g.stopPropagation(),L(null)}function U(g=!1){F!==void 0&&(window.clearTimeout(F),F=void 0),ss({overlay:c,onPointerDown:I,onPointerMove:$,onPointerUp:C,onPointerCancel:N,onMouseMove:D}),g?F=window.setTimeout(()=>{document.removeEventListener("click",h,!0),F=void 0},1e3):document.removeEventListener("click",h,!0),document.removeEventListener("keydown",A),ae(),x?.removeEventListener("click",O),n?.removeEventListener("abort",z),c.remove(),u.remove(),m.remove(),document.body.style.cursor=""}function B(){window.addEventListener("pointerdown",b,!0),window.addEventListener("pointermove",b,!0),window.addEventListener("pointerup",b,!0),window.addEventListener("pointercancel",b,!0)}function ae(){window.removeEventListener("pointerdown",b,!0),window.removeEventListener("pointermove",b,!0),window.removeEventListener("pointerup",b,!0),window.removeEventListener("pointercancel",b,!0)}document.body.style.cursor="crosshair",B(),as({overlay:c,onPointerDown:I,onPointerMove:$,onPointerUp:C,onPointerCancel:N,onMouseMove:D}),document.addEventListener("click",h,!0),document.addEventListener("keydown",A),x?.addEventListener("click",O),n?.addEventListener("abort",z,{once:!0})}function cs(e){let t=document.createElement("button");return t.id="bugdrop-element-picker-cancel",t.type="button",t.textContent=p().cancel,t.style.cssText=`
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
  `,t}var Lr=10;function Fr(e,t,n){return new Promise(r=>{setTimeout(()=>{n?.aborted?r(null):ds(r,e,t,n)},50)})}function ds(e,t,n,r){let{accent:o,fontFamily:i,radius:a,bw:s,tooltipBg:l,tooltipText:d,tooltipBorder:c}=yt(t),u=us();document.body.appendChild(u);let m=ps({accent:o,bw:s,radius:a});document.body.appendChild(m);let x=n?.redactionsAvailable?p().areaPickerRedactionInstruction:p().areaPickerInstruction,y=bs(),f=ms({accent:o,fontFamily:i,radius:a,bw:s,tooltipBg:l,tooltipText:d,tooltipBorder:c},x,y);document.body.appendChild(f);let S=f.querySelector("#bugdrop-area-picker-cancel"),F=0,R=0,M=!1,T=null;function D(b,A,O,U){let B=Math.min(b,O),ae=Math.min(A,U),g=Math.abs(O-b),Y=Math.abs(U-A);m.style.left=`${B}px`,m.style.top=`${ae}px`,m.style.width=`${g}px`,m.style.height=`${Y}px`,m.style.display="block";let ee=B+g,ke=ae+Y;u.style.clipPath=`polygon(
      0% 0%, 0% 100%, ${B}px 100%, ${B}px ${ae}px,
      ${ee}px ${ae}px, ${ee}px ${ke}px,
      ${B}px ${ke}px, ${B}px 100%, 100% 100%, 100% 0%
    )`}function w(b){T!==null||!b.isPrimary||(b.preventDefault(),F=b.clientX,R=b.clientY,M=!0,T=b.pointerId,u.setPointerCapture?.(b.pointerId))}function L(b){!M||b.pointerId!==T||(b.preventDefault(),D(F,R,b.clientX,b.clientY))}function z(b){if(!M||b.pointerId!==T)return;b.preventDefault(),M=!1,T=null,u.releasePointerCapture?.(b.pointerId);let A=Math.abs(b.clientX-F),O=Math.abs(b.clientY-R);if(A<Lr||O<Lr){m.style.display="none",u.style.clipPath="";return}let U=Math.min(F,b.clientX)+window.scrollX,B=Math.min(R,b.clientY)+window.scrollY;h(),e(new DOMRect(U,B,A,O))}function I(b){b.pointerId===T&&(M=!1,T=null,m.style.display="none",u.style.clipPath="")}function $(b){b.key==="Escape"&&(h(),e(null))}function C(){h(),e(null)}let N=()=>{h(),e(null)};function h(){u.removeEventListener("pointerdown",w),document.removeEventListener("pointermove",L),document.removeEventListener("pointerup",z),document.removeEventListener("pointercancel",I),document.removeEventListener("keydown",$),S?.removeEventListener("click",C),r?.removeEventListener("abort",N),u.remove(),m.remove(),f.remove()}u.addEventListener("pointerdown",w),document.addEventListener("pointermove",L),document.addEventListener("pointerup",z),document.addEventListener("pointercancel",I),document.addEventListener("keydown",$),S?.addEventListener("click",C),r?.addEventListener("abort",N,{once:!0})}function us(){let e=document.createElement("div");return e.id="bugdrop-area-picker-overlay",e.style.cssText=`
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
  `,e}function ps(e){let t=document.createElement("div");return t.id="bugdrop-area-picker-selection",t.style.cssText=`
    position: fixed;
    border: ${e.bw}px solid ${e.accent};
    box-shadow: 0 0 0 4px color-mix(in srgb, ${e.accent} 30%, transparent);
    border-radius: ${e.radius};
    z-index: 2147483647;
    pointer-events: none;
    display: none;
  `,t}function ms(e,t,n){let r=document.createElement("div");if(r.id="bugdrop-area-picker-tooltip",r.style.cssText=`
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
    `,r.append(t," (",o,")")}else r.textContent=`${t} (${p().escToCancel})`;return r}function bs(){let e=navigator.maxTouchPoints>0;return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches||e}var dn="#ff0000",gs="#000000";var wt=Math.PI/7,Ar=2,Pr=4,vt=1;function Rr(e,t){let n=document.createElement("canvas"),r=n.getContext("2d"),o="draw",i=!1,a=[],s=null,l=!1,d=[],c=new Image;c.onload=()=>{n.width=c.width,n.height=c.height,n.style.maxWidth="100%",n.style.height="auto",n.style.cursor="crosshair",r.drawImage(c,0,0),u()},c.src=t,e.appendChild(n);function u(){d.push(r.getImageData(0,0,n.width,n.height))}function m(h){r.putImageData(h,0,0)}function x(){return d[d.length-1]??null}function y(h,b){return Math.hypot(b.x-h.x,b.y-h.y)}function f(){window.removeEventListener("mouseup",N),i=!1,a=[],s=null,l=!1}function S(){s&&m(s),f()}function F(h){let b=n.getBoundingClientRect(),A=c.width/b.width,O=c.height/b.height,U=(h.clientX-b.left)*A,B=(h.clientY-b.top)*O;return{x:Math.max(0,Math.min(n.width,U)),y:Math.max(0,Math.min(n.height,B))}}function R(){let h=n.getBoundingClientRect(),b=Math.max(n.width/h.width,n.height/h.height,1);return Math.round(5.5*b)}function M(h,b){let A=R();r.beginPath(),r.moveTo(h.x,h.y),r.lineTo(b.x,b.y),r.strokeStyle=dn,r.lineWidth=A,r.lineCap="round",r.lineJoin="round",r.stroke()}function T(h,b){M(h,b);let A=Math.atan2(b.y-h.y,b.x-h.x),O=R()*5;r.beginPath(),r.moveTo(b.x,b.y),r.lineTo(b.x-O*Math.cos(A-wt),b.y-O*Math.sin(A-wt)),r.lineTo(b.x-O*Math.cos(A+wt),b.y-O*Math.sin(A+wt)),r.closePath(),r.fillStyle=dn,r.fill()}function D(h,b){r.strokeStyle=dn,r.lineWidth=R(),r.lineCap="round",r.lineJoin="round",r.strokeRect(h.x,h.y,b.x-h.x,b.y-h.y)}function w(h,b){let A=Math.min(h.x,b.x),O=Math.min(h.y,b.y),U=Math.abs(b.x-h.x),B=Math.abs(b.y-h.y);return{x:A,y:O,width:U,height:B}}function L(h,b){let{x:A,y:O,width:U,height:B}=w(h,b),ae=Math.max(0,Math.floor(A)-vt),g=Math.max(0,Math.floor(O)-vt),Y=Math.min(n.width,Math.ceil(A+U)+vt),ee=Math.min(n.height,Math.ceil(O+B)+vt);return{x:ae,y:g,width:Math.max(0,Y-ae),height:Math.max(0,ee-g)}}function z(h,b){let{width:A,height:O}=L(h,b);return A>=Pr&&O>=Pr}function I(h,b){let{x:A,y:O,width:U,height:B}=L(h,b);r.fillStyle=gs,r.fillRect(A,O,U,B)}function $(h){let b=x();b&&(i=!0,a=[F(h)],s=b,l=!1,window.addEventListener("mouseup",N))}function C(h){if(!i||!s)return;let b=F(h);o==="draw"?(M(a[a.length-1],b),a.push(b),l=l||y(a[0],b)>=Ar):(m(s),o==="arrow"?T(a[0],b):o==="rect"?D(a[0],b):o==="redact"&&I(a[0],b))}function N(h){if(!i||!s){f();return}let b=F(h),A=a[0];if(!(o==="redact"?z(A,b):l||y(A,b)>=Ar)){m(s),f();return}o==="arrow"?(m(s),T(A,b)):o==="rect"?(m(s),D(A,b)):o==="redact"?(m(s),I(A,b)):o==="draw"&&!l&&M(A,b),u(),f()}return n.addEventListener("mousedown",$),n.addEventListener("mousemove",C),n.addEventListener("mouseup",N),{setTool(h){S(),o=h},undo(){if(s){S();return}if(d.length<=1)return;f(),d.pop();let h=x();h&&m(h)},getImageData(){return n.toDataURL("image/png")},destroy(){f(),n.removeEventListener("mousedown",$),n.removeEventListener("mousemove",C),n.removeEventListener("mouseup",N),n.remove()}}}function fs(){return typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function De(e,t=fs){return e==="auto"?t():e}function xt(e){return e==="light"||e==="dark"||e==="auto"}function Ke(e,t){e.classList.toggle("bd-dark",t==="dark")}function Ye(e,t,n){let r=n==="dark",o=_(t.accentColor);if(o){let c=o;e.style.setProperty("--bd-primary",c),e.style.setProperty("--bd-primary-hover",gt(c)),e.style.setProperty("--bd-border-focus",c)}let i=_(t.bgColor);i&&(e.style.setProperty("--bd-bg-primary",i),r?(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 85%, white)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 70%, white)`)):(e.style.setProperty("--bd-bg-secondary",`color-mix(in srgb, ${i} 93%, black)`),e.style.setProperty("--bd-bg-tertiary",`color-mix(in srgb, ${i} 85%, black)`)));let a=_(t.textColor);if(a){e.style.setProperty("--bd-text-primary",a);let c=i||(r?"#0f172a":"#fafaf9");e.style.setProperty("--bd-text-secondary",`color-mix(in srgb, ${a} 65%, ${c})`),e.style.setProperty("--bd-text-muted",`color-mix(in srgb, ${a} 40%, ${c})`)}let s=J(t.borderWidth)??null,l=_(t.borderColor)||null;if(s!==null||l!==null){let c=s!==null?`${s}px`:"1px",u=l||"var(--bd-border)";e.style.setProperty("--bd-border-width",c),l&&e.style.setProperty("--bd-border",u),e.style.setProperty("--bd-border-style",`var(--bd-border-width) solid ${u}`)}let d=ut(t.shadow)||null;if(d==="none")e.style.setProperty("--bd-shadow-sm","none"),e.style.setProperty("--bd-shadow-md","none"),e.style.setProperty("--bd-shadow-lg","none"),e.style.setProperty("--bd-shadow-glow","none");else if(d==="hard"){let c=l||(r?"#000":"#1a1a1a"),u=s!==null?"calc(var(--bd-border-width) + 2px)":"6px";e.style.setProperty("--bd-shadow-sm",`${c} 2px 2px 0 0`),e.style.setProperty("--bd-shadow-md",`${c} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-lg",`${c} ${u} ${u} 0 0`),e.style.setProperty("--bd-shadow-glow","none")}}function Et(e){if(typeof window>"u"||!window.matchMedia)return typeof console<"u"&&console.warn&&console.warn('[BugDrop] window.matchMedia unavailable; data-theme="auto" will not react to OS theme changes.'),()=>{};let t=window.matchMedia("(prefers-color-scheme: dark)"),n=r=>{try{e(r.matches?"dark":"light")}catch(o){console.warn("[BugDrop] Error applying system theme change:",o)}};return t.addEventListener("change",n),()=>t.removeEventListener("change",n)}var Ie=8,hs="(hover: none), (pointer: coarse)",ys="(max-width: 640px)";function ws(e,t,n){let r=We(e);return!!(r&&r!=="none"&&r!=="#"&&n!=="never"&&(t||n==="always"))}function Mr(e,t){let n=t.position==="bottom-left"?"left: 0":"right: 0",r=De(t.theme),o=t.font==="inherit",i=t.font&&t.font!=="inherit"?Ae(t.font):null,a=o||i?"":"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');",s=o?"inherit":i?`${i}, system-ui, sans-serif`:"'Space Grotesk', system-ui, sans-serif",l=J(t.radius)??null,d=l!==null?`${l}px`:"6px",c=l!==null?`${Math.round(l*1.4)}px`:"10px",u=l!==null?`${Math.round(l*2)}px`:"14px",m=J(t.borderWidth)??null,x=document.createElement("style");x.textContent=`
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
      --bd-border-focus: ${Ge};
      --bd-primary: ${Ge};
      --bd-primary-hover: ${gt(Ge)};
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
  `,e.appendChild(x);let y=document.createElement("div");return y.className="bd-root",Ke(y,r),Ye(y,t,r),e.appendChild(y),y}function Ze(e){return`<p class="bd-redaction-note" style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-warning-bg, #fff8e1); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${q(e)}</p>`}function V(e,t,n,r=!1,o=""){let i=document.createElement("div");i.className="bd-overlay";let a=["bd-modal",o].filter(Boolean).join(" "),s=r?'<div class="bd-version">BugDrop vdevelopment:local</div>':"";return i.innerHTML=`
    <div class="${a}">
      <div class="bd-header">
        <span class="bd-modal-drag-indicator" aria-hidden="true">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </span>
        <h2 class="bd-title">${q(t)}</h2>
        <button class="bd-close">&times;</button>
      </div>
      <div class="bd-body">
        ${n}
      </div>
      ${s}
    </div>
  `,e.appendChild(i),vs(i),i}function vs(e){if(typeof window.matchMedia!="function"||window.matchMedia(hs).matches)return;let t=e.querySelector(".bd-modal"),n=e.querySelector(".bd-header");if(!t||!n)return;let r=t,o=n,i=null,a=0,s=0,l=0,d=0,c=!1,u=null,m=()=>{c||(c=!0,R(),window.removeEventListener("resize",f),window.visualViewport?.removeEventListener("resize",f),u?.disconnect())};function x(w,L){let z=r.getBoundingClientRect(),I=Math.max(Ie,window.innerWidth-z.width-Ie),$=Math.max(Ie,window.innerHeight-z.height-Ie);return{left:Math.min(Math.max(w,Ie),I),top:Math.min(Math.max(L,Ie),$)}}function y(w,L){let z=x(w,L);r.style.left=`${z.left}px`,r.style.top=`${z.top}px`}function f(){if(!e.isConnected){m();return}if(!r.classList.contains("bd-modal--positioned"))return;if(window.matchMedia(ys).matches){F();return}S();let w=r.getBoundingClientRect();y(w.left,w.top)}function S(){r.style.removeProperty("width"),r.style.removeProperty("max-width");let w=r.getBoundingClientRect(),L=Math.floor(window.innerWidth*.9);r.style.width=`${Math.min(w.width,L)}px`,r.style.maxWidth="none"}function F(){r.classList.remove("bd-modal--positioned","bd-modal--dragging"),r.style.removeProperty("left"),r.style.removeProperty("top"),r.style.removeProperty("width"),r.style.removeProperty("max-width")}function R(){i!==null&&(i=null,r.classList.remove("bd-modal--dragging"),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",T),window.removeEventListener("pointercancel",D))}function M(w){i===w.pointerId&&y(l+w.clientX-a,d+w.clientY-s)}function T(w){i===w.pointerId&&R()}function D(w){i===w.pointerId&&R()}o.addEventListener("pointerdown",w=>{if(w.target.closest("button, a, input, textarea, select, label"))return;w.preventDefault();let L=r.getBoundingClientRect();i=w.pointerId,a=w.clientX,s=w.clientY,l=L.left,d=L.top,r.classList.add("bd-modal--positioned","bd-modal--dragging"),r.style.width=`${L.width}px`,r.style.maxWidth="none",y(l,d),o.setPointerCapture(w.pointerId),window.addEventListener("pointermove",M),window.addEventListener("pointerup",T),window.addEventListener("pointercancel",D)}),window.addEventListener("resize",f),window.visualViewport?.addEventListener("resize",f),e.parentNode&&(u=new MutationObserver(()=>{e.isConnected||m()}),u.observe(e.parentNode,{childList:!0}))}function Dr(e,t,n,r,o="public"){return new Promise(i=>{let a=We(n),s=ws(n,r,o),l=s&&a?`<a href="${q(a)}" target="_blank" rel="noopener noreferrer" class="bd-issue-link">
          <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
          </svg>
          ${v(p().viewOnGitHub)}
        </a>`:"",d=r||o==="always"&&s?`
        <p class="bd-success-issue">${p().issueCreated(`<strong>#${t}</strong>`)}</p>
        ${l}
      `:`<p class="bd-success-issue">${v(p().feedbackSubmittedMessage)}</p>`,c=V(e,p().successTitle,`
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
          <button class="bd-btn bd-btn-primary" data-action="done">${v(p().done)}</button>
        </div>
        <div class="bd-powered-by">
          <a href="https://github.com/mean-weasel/bugdrop" target="_blank" rel="noopener noreferrer">Powered by BugDrop</a>
        </div>
      `,!0),u=c.querySelector(".bd-close"),m=c.querySelector('[data-action="done"]'),x=()=>{c.remove(),i()};u?.addEventListener("click",x),m?.addEventListener("click",x)})}function Ir(e,t,n=0,r){return new Promise(o=>{let i=[];r?.redactionUnavailable?i.push(p().viewportRedactionUnavailableNote):(n>0&&i.push(p().redactionCountNote(n)),r?.redactionLimitations&&i.push(p().redactionLimitationsNote));let a=i.length?Ze(i.join(" ")):"",l=r?.selectedElementCapture?`
        <p class="bd-selected-element-note" style="margin: -4px 0 12px; color: var(--bd-text-secondary); font-size: 13px;">
          ${p().selectedElementNote('<a href="https://bugdrop.dev/docs/configuration#select-element-screenshots" target="_blank" rel="noopener noreferrer">data-element-context-max-area</a>')}
        </p>
      `:"",d=V(e,p().reviewScreenshotTitle,`
        ${a}
        <p style="margin: 0 0 12px; color: var(--bd-text-secondary); font-size: 13px;">
          ${v(p().annotationInstruction)}
        </p>
        ${l}
        <div class="bd-tools">
          <button class="bd-tool active" data-tool="draw">\u270F\uFE0F ${v(p().toolDraw)}</button>
          <button class="bd-tool" data-tool="arrow">\u27A1\uFE0F ${v(p().toolArrow)}</button>
          <button class="bd-tool" data-tool="rect">\u25A2 ${v(p().toolRectangle)}</button>
          <button class="bd-tool" data-tool="redact">${v(p().toolRedact)}</button>
          <button class="bd-tool" data-action="undo">\u21B6 ${v(p().undo)}</button>
        </div>
        <div id="annotation-canvas" class="bd-annotation-stage"></div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-secondary" data-action="retake">${v(p().retake)}</button>
          <button class="bd-btn bd-btn-primary" data-action="done">${v(p().submitFeedback)}</button>
        </div>
      `,!1,"bd-modal--annotator"),c=d.querySelector("#annotation-canvas"),u=Rr(c,t),m=d.querySelectorAll("[data-tool]");m.forEach(F=>{F.addEventListener("click",R=>{let M=R.currentTarget,T=M.dataset.tool;T&&(m.forEach(D=>D.classList.remove("active")),M.classList.add("active"),u.setTool(T))})}),d.querySelector('[data-action="undo"]')?.addEventListener("click",()=>u.undo());let y=d.querySelector(".bd-close"),f=d.querySelector('[data-action="retake"]'),S=d.querySelector('[data-action="done"]');y?.addEventListener("click",()=>{u.destroy(),d.remove(),o("cancel")}),f?.addEventListener("click",()=>{u.destroy(),d.remove(),o("retake")}),S?.addEventListener("click",()=>{let F=u.getImageData();u.destroy(),d.remove(),o(F)})})}async function kt(e,t,n,r){return St(e,()=>vr(t,n,r?.captureOptions),r)}async function zr(e,t,n,r){return St(e,()=>xr(t,n,r?.captureOptions),r)}async function St(e,t,n){let r=n?.showLoading===!1?null:V(e,p().capturingTitle,`
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
              <div class="bd-spinner bd-spinner--lg"></div>
              <p class="bd-loading-text" style="margin-top: 12px;">${v(p().capturingScreenshot)}</p>
            </div>
          `);try{if(r&&await Es(),n?.signal?.aborted)return r?.remove(),{kind:"cancelled"};let o=typeof t=="function"?t():t,i=await xs(o,n?.signal);return r?.remove(),i===null?{kind:"cancelled"}:Ss(i)}catch(o){if(r?.remove(),n?.signal?.aborted)return{kind:"cancelled"};console.warn("[BugDrop] Screenshot capture failed:",o);let i=n?.allowSkip!==!1,a=n?.allowChooseAgain!==!1;return o instanceof Pe?ks(e):new Promise(s=>{let l=V(e,p().captureFailedTitle,`
          <div class="bd-error-message">
            <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            <span class="bd-error-message__text">${v(p().captureFailedMessage)}</span>
          </div>
          <div class="bd-actions">
            ${i?`<button class="bd-btn bd-btn-secondary" data-action="skip">${v(p().skipScreenshot)}</button>`:""}
            ${a?`<button class="bd-btn bd-btn-primary" data-action="choose-again">${v(p().chooseAnotherMethod)}</button>`:""}
          </div>
        `,!0),d=l.querySelector(".bd-close"),c=l.querySelector('[data-action="skip"]'),u=l.querySelector('[data-action="choose-again"]');d?.addEventListener("click",()=>{l.remove(),s({kind:"cancelled"})}),c?.addEventListener("click",()=>{l.remove(),s({kind:"skipped"})}),u?.addEventListener("click",()=>{l.remove(),s({kind:"choose-again"})})})}}function xs(e,t){return t?t.aborted?Promise.resolve(null):new Promise((n,r)=>{let o=()=>n(null);t.addEventListener("abort",o,{once:!0}),e.then(i=>{t.removeEventListener("abort",o),n(i)},i=>{t.removeEventListener("abort",o),r(i)})}):e}function Es(){return typeof requestAnimationFrame!="function"?new Promise(e=>setTimeout(e,0)):new Promise(e=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>e())})})}function ks(e){return new Promise(t=>{let n=V(e,p().maskFailureTitle,`
        <div class="bd-error-message">
          <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
          <span class="bd-error-message__text">${v(p().maskFailureMessage)}</span>
        </div>
        <div class="bd-actions">
          <button class="bd-btn bd-btn-primary" data-action="skip">${v(p().continueWithoutScreenshot)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="skip"]');r?.addEventListener("click",()=>{n.remove(),t({kind:"cancelled"})}),o?.addEventListener("click",()=>{n.remove(),t({kind:"skipped"})})})}function Ss(e){return typeof e=="string"?{kind:"ok",dataUrl:e}:{kind:"ok",dataUrl:e.dataUrl,redaction:e.redaction}}function Nr(e,t){let n=e.getBoundingClientRect();if(!Or(n))return e;let o=Math.max(1,window.innerWidth*window.innerHeight)*gr(t.maxViewportAreaMultiplier),i=e,a=e.parentElement;for(;a&&a!==document.body&&a!==document.documentElement;){let s=a.getBoundingClientRect(),l=s.width*s.height;Or(s)&&l<=o&&Cs(s,n)&&Ts(s,n)&&(i=a),a=a.parentElement}return i}function Or(e){return e.width>0&&e.height>0}function Cs(e,t){return e.left<=t.left&&e.top<=t.top&&e.right>=t.right&&e.bottom>=t.bottom}function Ts(e,t){let n=e.width>=t.width+160,r=e.height>=t.height+160,o=t.width*t.height,i=e.width*e.height;return n||r||i>=o*4}function _r(e){let t=[],n=e.ownerDocument.body,r=e;if(r===n)return Ct(r);for(;r&&r!==n;){let o=Ct(r);if(r.id){o=`#${Je(r.id)}`,t.unshift(o);break}let i=Vr(r).slice(0,2);i.length&&(o+=`.${i.map(Je).join(".")}`),t.unshift(o),r=r.parentElement}return t.join(" > ")}function Hr(e){let t=Ls(e),n=t.map(Fs),r=t.map(un);return Ps(n,r,e)}function Ls(e){let t=[],n=e;for(;n;)t.unshift(n),n=n.parentElement;return t}function Fs(e){let t=As(e);return t.length<=128?t:un(e)}function As(e){let t=Ct(e);e.id&&(t+=`#${Je(e.id)}`);let n=Vr(e).slice(0,3);return n.length>0&&(t+=`.${n.map(Je).join(".")}`),e.id||(t+=Ur(e)),t}function un(e){return`${Ct(e)}${Ur(e)}`}function Vr(e){return Array.from(e.classList).filter(Boolean)}function Ct(e){return Je(e.localName||e.tagName.toLowerCase())}function Ps(e,t,n){let r=e.join(" > ");return r.length<=1024?r:Br(e,n)||Br(t,n)||un(n)}function Br(e,t){for(let n=e.length-1;n>=0;n-=1){let r=e.slice(n).join(" > ");if(!(r.length>1024)&&Rs(r,t))return r}return null}function Rs(e,t){try{return t.ownerDocument.querySelector(e)===t}catch{return!1}}function Ur(e){let t=Ms(e);return t>1||Ds(e)?`:nth-of-type(${t})`:""}function Ms(e){let t=1,n=e.previousElementSibling;for(;n;)n.tagName===e.tagName&&(t+=1),n=n.previousElementSibling;return t}function Ds(e){let t=e.previousElementSibling;for(;t;){if(t.tagName===e.tagName)return!0;t=t.previousElementSibling}for(t=e.nextElementSibling;t;){if(t.tagName===e.tagName)return!0;t=t.nextElementSibling}return!1}function Je(e){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):Is(e)}function Is(e){let t="";for(let n=0;n<e.length;n+=1){let r=e.charAt(n),o=e.charCodeAt(n),i=n===0,a=n===1,s=e.charCodeAt(0);if(o===0){t+="\uFFFD";continue}if(o>=1&&o<=31||o===127||i&&o>=48&&o<=57||a&&o>=48&&o<=57&&s===45){t+=`\\${o.toString(16)} `;continue}if(i&&o===45&&e.length===1){t+="\\-";continue}if(o>=128||o===45||o===95||o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122){t+=r;continue}t+=`\\${r}`}return t}function qr(e,t){let n=ne(),r=n&&wr(),o=t?.allowSkip!==!1,i="";return r?i=Ze(p().viewportRedactionWarning):Me()>0&&(i=Ze(p().redactionReviewNote)),new Promise(a=>{let s=n?`<p style="margin: 0 0 12px; padding: 8px 12px; background: var(--bd-bg-secondary, #f5f5f5); border-radius: 6px; font-size: 13px; color: var(--bd-text-secondary);">${r?v(p().pageTooComplexViewportNote):v(p().pageTooComplexElementNote)}</p>`:"",l="";n?r&&(l=`<button class="bd-btn bd-btn-primary" data-action="viewport">${v(p().captureViewport)}</button>`):l=`<button class="bd-btn bd-btn-primary" data-action="capture">${v(p().fullPage)}</button>`;let d=V(e,p().captureScreenshotTitle,`
        <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${v(p().chooseWhatToCapture)}</p>
        ${s}
        ${i}
        <div class="bd-actions bd-screenshot-actions">
          ${l}
          ${n?"":`<button class="bd-btn bd-btn-secondary" data-action="area">${v(p().selectArea)}</button>`}
          <button class="bd-btn bd-btn-secondary" data-action="element">${v(p().selectElement)}</button>
          ${o?`<button class="bd-btn bd-btn-quiet" data-action="skip">${v(p().skipScreenshot)}</button>`:""}
        </div>
      `),c=d.querySelector(".bd-close"),u=d.querySelector('[data-action="skip"]'),m=d.querySelector('[data-action="element"]'),x=d.querySelector('[data-action="area"]'),y=d.querySelector('[data-action="capture"]'),f=d.querySelector('[data-action="viewport"]');c?.addEventListener("click",()=>{d.remove(),a({kind:"cancel"})}),u?.addEventListener("click",()=>{d.remove(),a({kind:"skip"})}),m?.addEventListener("click",()=>{d.remove(),a({kind:"element"})}),x?.addEventListener("click",()=>{d.remove(),a({kind:"area"})}),y?.addEventListener("click",()=>{d.remove(),a({kind:"capture"})}),f?.addEventListener("click",()=>{d.remove();let S=cn();S.catch(()=>{}),a({kind:"viewport",capture:S})})})}function Wr(e,t,n,r){return new Promise((o,i)=>{let a=!1,s=()=>{n.removeEventListener("abort",l)},l=()=>{a||(a=!0,zs(e),s(),o(r))};n.addEventListener("abort",l,{once:!0}),n.aborted&&l(),t.then(d=>{s(),a||o(d)},d=>{s(),a||i(d)})})}function zs(e){let t=Array.from(e.querySelectorAll(".bd-overlay"));for(let n of t)n.querySelector(".bd-close")?.click(),n.remove();document.querySelector("#bugdrop-element-picker-cancel")?.click(),document.querySelector("#bugdrop-area-picker-cancel")?.click()}function re(){return{screenshot:null,...pn(),returnToForm:!1}}function pn(){return{elementSelector:null,fullElementSelector:null}}function mn(e){return e==="explicit-skip"||e==="capture-failure-skip"}function jr(e){throw new Error(`Unhandled screenshot choice: ${JSON.stringify(e)}`)}function bn(e){return{accentColor:e.accentColor,font:e.font,radius:e.radius,borderWidth:e.borderWidth,bgColor:e.bgColor,textColor:e.textColor,borderColor:e.borderColor,theme:e.theme}}async function Tt(e,t,n,r,o){if(o?.aborted)return{...re(),returnToForm:!0};let i=Os(e,t,n,r,o);return o?Wr(e,i,o,{...re(),returnToForm:!0}):i}async function Os(e,t,n,r,o){if(t.screenshotMode==="auto")return Ns(e,t,o);if(!n)return re();let i=t.screenshotMode==="required";for(;;){let a=await Bs(e,t,i,o);if(o?.aborted)return{...re(),returnToForm:!0};if(a.kind==="returnToForm")return{...re(),returnToForm:!0};if(a.kind==="chooseAgain")continue;if(a.kind==="empty"){if(!i&&mn(a.reason)&&r(),i)continue;return{screenshot:null,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}let s=await Ir(e,a.screenshot,a.redactionCount,{redactionUnavailable:a.redactionUnavailable,...a.redactionLimitations?{redactionLimitations:!0}:{},...a.elementSelector?{selectedElementCapture:!0}:{}});if(o?.aborted)return{...re(),returnToForm:!0};if(s!=="retake")return s==="cancel"?{...re(),returnToForm:!0}:{screenshot:s,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,returnToForm:!1}}}async function Ns(e,t,n){if(ne())return re();let r=await kt(e,void 0,t.screenshotScale,{allowChooseAgain:!1,signal:n});return r.kind==="cancelled"?{...re(),returnToForm:!0}:{screenshot:r.kind==="ok"?r.dataUrl:null,elementSelector:null,fullElementSelector:null,returnToForm:!1}}async function Bs(e,t,n,r){let o=await qr(e,{allowSkip:!n});switch(o.kind){case"cancel":return{kind:"returnToForm"};case"skip":return fe("explicit-skip");case"viewport":return _s(e,o,n,r);case"capture":return Hs(e,t,n,r);case"element":return Vs(e,t,n,r);case"area":return Us(e,t,n,r);default:return jr(o)}}async function _s(e,t,n,r){let o=await St(e,t.capture,{allowSkip:!n,showLoading:!1,signal:r});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?fe("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:0,redactionUnavailable:!0,redactionLimitations:!1}}async function Hs(e,t,n,r){let o=await kt(e,void 0,t.screenshotScale,{allowSkip:!n,signal:r});return o.kind==="cancelled"?{kind:"returnToForm"}:o.kind==="choose-again"?{kind:"chooseAgain"}:o.kind==="skipped"?fe("capture-failure-skip"):{kind:"captured",screenshot:o.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:o.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:o.redaction?.hasLimitations??!1}}async function Vs(e,t,n,r){let o=await Tr(bn(t),r);if(!o)return fe("selection-cancelled");let i={elementSelector:_r(o),fullElementSelector:Hr(o)},a=Nr(o,{maxViewportAreaMultiplier:t.elementContextMaxArea}),s=await kt(e,a,t.screenshotScale,{allowSkip:!n,captureOptions:{highlightElement:o,highlightStyle:{accentColor:t.accentColor,radius:t.radius,borderWidth:t.borderWidth},pixelRatio:1},signal:r});return s.kind==="cancelled"?{kind:"returnToForm"}:s.kind==="choose-again"?{kind:"chooseAgain"}:s.kind==="skipped"?fe("capture-failure-skip",i):{kind:"captured",screenshot:s.dataUrl,...i,redactionCount:s.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:s.redaction?.hasLimitations??!1}}async function Us(e,t,n,r){let o=await Fr(bn(t),{redactionsAvailable:Me()>0},r);if(!o)return fe("selection-cancelled");let i=await zr(e,o,t.screenshotScale,{allowSkip:!n,signal:r});return i.kind==="cancelled"?{kind:"returnToForm"}:i.kind==="choose-again"?{kind:"chooseAgain"}:i.kind==="skipped"?fe("capture-failure-skip"):{kind:"captured",screenshot:i.dataUrl,elementSelector:null,fullElementSelector:null,redactionCount:i.redaction?.count??0,redactionUnavailable:!1,redactionLimitations:i.redaction?.hasLimitations??!1}}function fe(e,t=pn()){return{kind:"empty",reason:e,...t}}function Gr(e,t=window){if(!e)return;let n=t[e];if(typeof n!="function"){console.warn(`[BugDrop] data-auth-token-provider "${e}" must reference a function.`);return}return n}async function he(e){if(!e)return{};let t=await e();return t?{Authorization:t.startsWith("Bearer ")?t:`Bearer ${t}`}:{}}var Lt=String.raw`(?:"|')?\b(?:password|passwd|pwd|token|api[_-]?key|secret|authorization|auth|cookie)\b(?:"|')?`,qs=new RegExp(String.raw`(${Lt}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[\s\S]|(?!\2)[^\\])*?\2`,"gi"),Ws=new RegExp(String.raw`(${Lt}\s*[:=]\s*)(["'])(?!Bearer\b)(?:\\[^\r\n]|(?!\2)[^\\\r\n])*(?=\r?\n|$)`,"gi"),js=new RegExp(String.raw`(${Lt}\s*[:=]\s*)(?:\[[^\]\r\n]*\]|\{[^\}\r\n]*\})`,"gi"),Gs=new RegExp(String.raw`(${Lt}\s*[:=]\s*)(?!Bearer\b)[^"',\s}&]+`,"gi"),Xs=/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,Ks=/\b[A-Za-z0-9+/_=-]{32,}\b/g;function Xr(e){return e.replace(Xs,"Bearer [redacted]").replace(js,"$1[redacted]").replace(qs,"$1$2[redacted]$2").replace(Ws,"$1$2[redacted]").replace(Gs,"$1[redacted]").replace(Ks,"[redacted]")}var Ys=50,Zs=1e3,At=[],Kr=!1;function Yr(){Kr||typeof window>"u"||typeof console>"u"||(Kr=!0,Ft("log"),Ft("info"),Ft("warn"),Ft("error"),window.addEventListener("error",e=>{gn({level:"error",message:e.message||"Unhandled error",timestamp:new Date().toISOString(),sourceUrl:e.filename||void 0,lineNumber:e.lineno||void 0,columnNumber:e.colno||void 0})}),window.addEventListener("unhandledrejection",e=>{gn({level:"error",message:`Unhandled promise rejection: ${Zr(e.reason)}`,timestamp:new Date().toISOString()})}))}function Pt(){return At.map(e=>({...e}))}function Ft(e){let t=console[e];typeof t=="function"&&(console[e]=(...n)=>{gn({level:e,message:n.map(Zr).join(" "),timestamp:new Date().toISOString(),...Js()}),t.apply(console,n)})}function gn(e){for(At.push({...e,message:Xr(e.message).slice(0,Zs)});At.length>Ys;)At.shift()}function Zr(e){if(e instanceof Error)return e.stack||e.message;if(typeof e=="string")return e;try{return JSON.stringify(e)}catch{return String(e)}}function Js(){let e=new Error().stack;if(!e)return{};for(let t of e.split(`
`).slice(2)){if(t.includes("console-logs"))continue;let n=t.match(/\(?((?:https?:|file:|\/)[^():]+):(\d+):(\d+)\)?$/);if(n)return{sourceUrl:n[1],lineNumber:Number(n[2]),columnNumber:Number(n[3])}}return{}}var Mt=new Set,Jr=!1,fn=!1;function de(e){Mt.add(e),Jr||Qs();let t=!1;return()=>{t||(t=!0,Mt.delete(e))}}function Qs(){Jr=!0;let e=n=>{Rt(n)&&n.preventDefault()},t=n=>{if(!fn&&el(n)){if(n.type==="focusin"){n.stopImmediatePropagation();return}if(n.type==="focusout"){fn=!0;try{tl(n)}finally{fn=!1}n.stopImmediatePropagation();return}n.stopImmediatePropagation()}};for(let n of["dismissableLayer.pointerDownOutside","dismissableLayer.interactOutside"])document.addEventListener(n,e,!0);window.addEventListener("focusin",t,!0),window.addEventListener("focusout",t,!0)}function Rt(e){let t=e.detail?.originalEvent,n=typeof t?.composedPath=="function"?t.composedPath():typeof e.composedPath=="function"?e.composedPath():[];return Array.from(Mt).some(r=>n.includes(r)||(t?.target??e.target)===r)}function el(e){if(!(e instanceof FocusEvent)||e.type==="focusin")return Rt(e);if(e.type!=="focusout")return!1;let t=e.relatedTarget;return Array.from(Mt).some(r=>t===r||t instanceof Node&&(r.shadowRoot?.contains(t)??!1))&&!Rt(e)}function tl(e){let t=typeof e.composedPath=="function"?e.composedPath():[];for(let n of t)if(n instanceof HTMLElement&&(n.dispatchEvent(new FocusEvent("focusout",{bubbles:!1,composed:!1,relatedTarget:e instanceof FocusEvent?e.relatedTarget:null})),n===document.body))break}var Dt;function ze(){Dt?.close()}function It(e){return Dt=e,()=>{Dt===e&&(Dt=void 0)}}var nl="bugdrop-variant@1";function Qr(e){let t=Object.freeze({kind:"variant",config:e}),n=Object.freeze([t]);return Object.freeze({id:nl,variantId:e.id,screens:n})}var se=class extends TypeError{constructor(n,r){super(r);this.fieldId=n;this.name="VariantAnswerError"}fieldId};function ye(e,t){if(!ol(t))throw new se(null,"BugDrop variant answers must be an object");let n=new Set(e.map(o=>o.id)),r=Object.keys(t).find(o=>!n.has(o));if(r)throw new se(null,`Unknown BugDrop variant answer: ${r}`)}function $e(e,t){return ye(e,t),Object.fromEntries(e.map(n=>[n.id,rl(n,t[n.id])]))}function rl(e,t){if(e.type==="shortText"||e.type==="longText"){if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(typeof t!="string")throw ue(e,`Answer ${e.id} must be text`);let n=t.trim();if(e.required&&!n)throw ue(e,`Answer ${e.id} is required`);let r=e.minLength??0,o=e.maxLength??(e.type==="shortText"?500:5e3);if(n.length<r||n.length>o)throw ue(e,`Answer ${e.id} must be ${r}-${o} characters`);return n}if(e.type==="rating"){let n=e.scale??5;if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(!Number.isInteger(t)||t<1||t>n)throw ue(e,`Answer ${e.id} must be a rating from 1-${n}`);return t}if(t==null||t===""){if(e.required)throw ue(e,`Answer ${e.id} is required`);return""}if(typeof t!="string"||!e.options.some(n=>n.value===t))throw ue(e,`Answer ${e.id} must be a configured choice`);return t}function ue(e,t){return new se(e.id,t)}function ol(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function pe(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=`${r}-label`,i=`${r}-help`,a=`${r}-error`,s=document.createElement("label");if(s.className="bdv-label",s.id=o,s.htmlFor=r,s.textContent=e.label,e.required){let c=document.createElement("span");c.className="bdv-required",c.textContent=" *",c.setAttribute("aria-hidden","true"),s.appendChild(c)}n.appendChild(s);let l=[];if(e.helpText){let c=document.createElement("div");c.className="bdv-help",c.id=i,c.textContent=e.helpText,n.appendChild(c),l.push(i)}let d=document.createElement("div");return d.className="bdv-error",d.id=a,d.hidden=!0,d.setAttribute("aria-live","polite"),n.appendChild(d),l.push(a),{wrapper:n,label:s,controlId:r,labelId:o,describedBy:l.join(" ")||null,setError(c,u){d.textContent=u??"",d.hidden=!u,u?c.setAttribute("aria-invalid","true"):c.removeAttribute("aria-invalid")}}}function zt(e,t,n){e.id=n.controlId,e.className="bdv-input",e.required=t.required??!1,e.setAttribute("aria-required",String(t.required??!1)),n.describedBy&&e.setAttribute("aria-describedby",n.describedBy),t.placeholder&&(e.placeholder=t.placeholder),e.minLength=t.minLength??0,e.maxLength=t.maxLength??(t.type==="shortText"?500:5e3),n.wrapper.insertBefore(e,n.wrapper.querySelector(".bdv-error"))}function eo(e,t){let n=pe(e,t),r=document.createElement("textarea");return r.rows=e.rows??4,zt(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function to(e,t){let n=pe(e,t),r=e.scale??5,o=document.createElement("div");o.id=n.controlId,o.className="bdv-rating",o.setAttribute("role","radiogroup"),o.setAttribute("aria-labelledby",n.labelId),o.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&o.setAttribute("aria-describedby",n.describedBy);let i=[],a=null,s=()=>{for(let[c,u]of i.entries()){let m=c+1,x=a!==null&&m<=a;u.classList.toggle("bdv-rating-option--active",x),u.setAttribute("aria-checked",String(m===a)),u.tabIndex=m===(a??1)?0:-1}},l=(c,u=!1)=>{a=c,s(),u&&i[c-1]?.focus()},d=[];for(let c=1;c<=r;c+=1){let u=document.createElement("button");u.type="button",u.className="bdv-rating-option",u.setAttribute("role","radio"),u.setAttribute("aria-label",`${c} ${c===1?"star":"stars"}`),u.textContent=e.icon==="number"?String(c):"\u2605";let m=()=>l(c),x=y=>{let f=null;y.key==="ArrowRight"||y.key==="ArrowDown"?f=c===r?1:c+1:y.key==="ArrowLeft"||y.key==="ArrowUp"?f=c===1?r:c-1:y.key==="Home"?f=1:y.key==="End"?f=r:(y.key==="Enter"||y.key===" ")&&(f=c),f!==null&&(y.preventDefault(),l(f,!0))};u.addEventListener("click",m),u.addEventListener("keydown",x),d.push({button:u,click:m,keydown:x}),i.push(u),o.appendChild(u)}if(n.wrapper.insertBefore(o,n.wrapper.querySelector(".bdv-error")),e.lowLabel||e.highLabel){let c=document.createElement("div");c.className="bdv-rating-labels";let u=document.createElement("span");u.textContent=e.lowLabel??"";let m=document.createElement("span");m.textContent=e.highLabel??"",c.append(u,m),n.wrapper.insertBefore(c,n.wrapper.querySelector(".bdv-error"))}return s(),{field:e,element:n.wrapper,getValue:()=>a??"",setValue(c){a=Number.isInteger(c)&&c>=1&&c<=r?c:null,s()},setError:c=>n.setError(o,c),setDisabled(c){for(let u of i)u.disabled=c},focus(){i[(a??1)-1]?.focus()},dispose(){for(let c of d)c.button.removeEventListener("click",c.click),c.button.removeEventListener("keydown",c.keydown)}}}function no(e,t){let n=pe(e,t),r=document.createElement("input");return r.type="text",zt(r,e,n),{field:e,element:n.wrapper,getValue:()=>r.value,setValue(o){r.value=typeof o=="string"?o:""},setError:o=>n.setError(r,o),setDisabled:o=>{r.disabled=o},focus:()=>r.focus(),dispose(){}}}function ro(e,t){let n=pe(e,t),r=document.createElement("div");r.className=`choice ${e.display??""}`,r.setAttribute("role","radiogroup"),r.setAttribute("aria-labelledby",n.labelId),r.setAttribute("aria-required",String(e.required??!1)),n.describedBy&&r.setAttribute("aria-describedby",n.describedBy);let o=e.options.map(a=>{let s=document.createElement("label"),l=document.createElement("input");if(l.type="radio",l.name=n.controlId,l.value=a.value,s.append(l,a.label),a.description){let d=document.createElement("span");d.className="bdv-help",d.textContent=a.description,s.appendChild(d)}return r.appendChild(s),l});n.wrapper.insertBefore(r,n.wrapper.querySelector(".bdv-error"));let i=()=>r.querySelector(":checked");return{field:e,element:n.wrapper,getValue:()=>i()?.value??"",setValue(a){for(let s of o)s.checked=s.value===a},setError:a=>n.setError(r,a),setDisabled(a){for(let s of o)s.disabled=a},focus(){(i()??o[0])?.focus()},dispose(){}}}function $t(e,t){return e.type==="shortText"?no(e,t):e.type==="longText"?eo(e,t):e.type==="rating"?to(e,t):ro(e,t)}function Ot(e){let{config:t,instanceId:n}=e,r={...e.context??{}},o={...e.initialAnswers??{}};ye(t.fields,o);let i=document.createElement("section");i.className="bdv-surface";let a=`${n}-title`;i.setAttribute("aria-labelledby",a);let s=document.createElement("div");s.className="bdv-header";let l=document.createElement("h2");if(l.className="bdv-title",l.id=a,l.textContent=t.content.title,s.appendChild(l),t.content.description){let C=document.createElement("p");C.className="bdv-description",C.textContent=t.content.description,s.appendChild(C)}i.appendChild(s);let d=document.createElement("form");d.className="bdv-form",d.noValidate=!0;let c=document.createElement("div");c.className="bdv-fields";let u=t.fields.map(C=>$t(C,n));for(let C of u)c.appendChild(C.element);d.appendChild(c);let m=document.createElement("div");m.className="bdv-actions";let x=document.createElement("button");x.type="submit",x.className="bdv-submit",x.textContent=t.content.submitLabel??"Submit",m.appendChild(x);let y;e.cancel&&(y=document.createElement("button"),y.type="button",y.className="bdv-cancel",y.textContent=e.cancel.label,y.addEventListener("click",e.cancel.onCancel),m.appendChild(y)),d.appendChild(m);let f=document.createElement("p");f.className="bdv-status",f.setAttribute("role","status"),f.setAttribute("aria-live","polite"),d.appendChild(f),i.appendChild(d);let{success:S,successLink:F}=il(t);i.appendChild(S);let R=Q("submission"),M=!1,T=!1,D=C=>{M=C,d.setAttribute("aria-busy",String(C)),x.disabled=C,y&&(y.disabled=C);for(let N of u)N.setDisabled(C)},w=()=>{f.textContent="",f.removeAttribute("data-kind");for(let C of u)C.setError(null)},L=()=>{for(let C of u)C.setValue(o[C.field.id]??"")},z=()=>Object.fromEntries(u.map(C=>[C.field.id,C.getValue()])),I=async C=>{if(C.preventDefault(),M||T)return;w();let N;try{N=$e(t.fields,z())}catch(h){if(h instanceof se&&h.fieldId){let b=u.find(A=>A.field.id===h.fieldId);b?.setError(al(h)),b?.focus()}else f.textContent=h instanceof Error?h.message:"Please check your response.",f.dataset.kind="error";return}D(!0),f.textContent="Submitting\u2026";try{let h=await e.submit(N,{context:r,submissionId:R});if(T)return;D(!1),F.hidden=!h.isPublic,h.isPublic&&(F.href=h.issueUrl),d.hidden=!0,S.hidden=!1,S.focus(),e.onSubmitted?.(h)}catch(h){if(T)return;f.textContent=h instanceof Error?h.message:"Failed to submit feedback.",f.dataset.kind="error",D(!1)}},$=C=>{C.key==="Enter"&&C.target instanceof HTMLInputElement&&C.target.type!=="submit"&&C.preventDefault()};return d.addEventListener("submit",I),d.addEventListener("keydown",$),L(),{element:i,reset(){M||T||(R=Q("submission"),w(),L(),S.hidden=!0,F.removeAttribute("href"),d.hidden=!1)},dispose(){if(!T){T=!0,d.removeEventListener("submit",I),d.removeEventListener("keydown",$),y&&e.cancel&&y.removeEventListener("click",e.cancel.onCancel);for(let C of u)C.dispose()}}}}function Q(e){if(typeof globalThis.crypto?.randomUUID=="function")return`${e}-${globalThis.crypto.randomUUID()}`;if(typeof globalThis.crypto?.getRandomValues!="function")throw new Error("BugDrop rendered variants require a cryptographically secure random generator");let t=globalThis.crypto.getRandomValues(new Uint8Array(16));return`${e}-${Array.from(t,n=>n.toString(16).padStart(2,"0")).join("")}`}function il(e){let t=document.createElement("div");t.className="bdv-success",t.hidden=!0,t.tabIndex=-1;let n=document.createElement("h3");n.className="bdv-success-title",n.textContent=e.content.successTitle??"Thanks for your feedback!";let r=document.createElement("p");r.className="bdv-success-message",r.textContent=e.content.successMessage??"Your response was submitted.";let o=document.createElement("a");return o.className="bdv-success-link",o.textContent="View GitHub Issue",o.target="_blank",o.rel="noopener noreferrer",t.append(n,r,o),{success:t,successLink:o}}function al(e){if(!e.fieldId)return e.message;let t=`Answer ${e.fieldId} `,n=e.message.startsWith(t)?e.message.slice(t.length):e.message;return n.charAt(0).toUpperCase()+n.slice(1)}function Oe(e,t,n){let r=document.createElement("style");r.textContent=sl,e.appendChild(r);let o=document.createElement("div");o.className="bdv-root",o.dataset.presentation=n,t.presentation.kind==="modal"&&(o.dataset.size=t.presentation.size??"default"),o.dataset.density=t.appearance?.density??"comfortable",o.dataset.columns=String(t.presentation.columns??1);let i=_(t.appearance?.accentColor);i&&o.style.setProperty("--bdv-accent",i),e.appendChild(o);let a=t.appearance?.theme??"auto",s=d=>{o.classList.toggle("bdv-dark",d==="dark")};s(De(a));let l=a==="auto"?Et(s):()=>{};return{root:o,dispose(){l(),r.remove(),o.remove()}}}var sl=`
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
`;function oo(e){if(!(e.target instanceof HTMLElement))throw new TypeError("BugDrop inline variant target must be an HTMLElement");if(e.config.presentation.kind!=="inline")throw new TypeError("BugDrop mount() requires an inline variant");ye(e.config.fields,e.options?.initialAnswers??{});let t=Q(e.config.id),n=document.createElement("div");n.dataset.bugdropOwned="",n.dataset.bugdropInstance=t;let r=n.attachShadow({mode:"open"}),o=de(n),i=Oe(r,e.config,"inline"),a=Ot({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit});i.root.appendChild(a.element),e.target.appendChild(n);let s=!1;return Object.freeze({instanceId:t,reset(){s||a.reset()},unmount(){s||(s=!0,a.dispose(),o(),i.dispose(),n.remove())}})}function ao(e){if(e.config.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");ye(e.config.fields,e.options?.initialAnswers??{}),ze();let t=Q(e.config.id),n=document.activeElement instanceof HTMLElement?document.activeElement:null,r=document.body.style.getPropertyValue("overflow"),o=document.body.style.getPropertyPriority("overflow"),i=document.createElement("div");i.dataset.bugdropOwned="",i.dataset.bugdropInstance=t,Object.assign(i.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let a=i.attachShadow({mode:"open"}),s=Oe(a,e.config,"modal"),l=document.createElement("div");l.className="bdv-overlay",s.root.appendChild(l);let d,c=new Promise(w=>{d=w}),u=!1,m=!1,x=()=>{},y=w=>{u||(u=!0,d(w))},f=()=>{m||(m=!0,y({status:"closed"}),x(),a.removeEventListener("keydown",R),l.removeEventListener("pointerdown",M),S.dispose(),T(),s.dispose(),i.remove(),ll(r,o),n?.isConnected&&n.focus())},S=Ot({config:e.config,instanceId:t,context:e.options?.context,initialAnswers:e.options?.initialAnswers,submit:e.submit,cancel:{label:e.config.content.cancelLabel??"Cancel",onCancel:f},onSubmitted:w=>y({status:"submitted",result:w})});S.element.setAttribute("role","dialog"),S.element.setAttribute("aria-modal","true"),S.element.dataset.size=e.config.presentation.size??"default";let F=document.createElement("button");F.type="button",F.className="bdv-close",F.setAttribute("aria-label","Close"),F.textContent="\xD7",F.addEventListener("click",f,{once:!0}),S.element.prepend(F),l.appendChild(S.element);function R(w){if(!(w instanceof KeyboardEvent))return;if(w.key==="Escape"){w.preventDefault(),f();return}if(w.key!=="Tab")return;let L=io(S.element);if(L.length===0){w.preventDefault(),S.element.focus();return}let z=a.activeElement,I=L[0],$=L.at(-1);w.shiftKey&&(z===I||!S.element.contains(z))?(w.preventDefault(),$.focus()):!w.shiftKey&&z===$&&(w.preventDefault(),I.focus())}function M(w){w.target===l&&f()}document.body.style.setProperty("overflow","hidden"),document.body.appendChild(i);let T=de(i);a.addEventListener("keydown",R),l.addEventListener("pointerdown",M);let D=Object.freeze({instanceId:t,result:c,close:f});return x=It(D),queueMicrotask(()=>{if(m)return;(S.element.querySelector('textarea:not(:disabled), input:not(:disabled), [role="radio"][tabindex="0"]')??io(S.element)[0]??S.element).focus()}),D}function so(e){return Object.freeze({instanceId:Q(e),result:Promise.resolve({status:"busy"}),close(){}})}function io(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&t.getAttribute("aria-hidden")!=="true")}function ll(e,t){e?document.body.style.setProperty("overflow",e,t):document.body.style.removeProperty("overflow")}var Bt=/^[a-z][a-z0-9_-]{0,63}$/,lo=/{{\s*([^{}]+?)\s*}}/g,cl=new Set(["bug","feature","question","feedback"]),dl=new Set(["shortText","longText","rating","singleChoice"]),ul=new Set(["id","configVersion","presentation","appearance","content","fields","issue"]),pl=new Set(["title","description","submitLabel","cancelLabel","successTitle","successMessage"]),ml=new Set(["theme","accentColor","density"]),bl=new Set(["classification","title","sections"]),Nt=["id","type","label","helpText","required","layout"],gl={shortText:new Set([...Nt,"placeholder","minLength","maxLength"]),longText:new Set([...Nt,"placeholder","rows","minLength","maxLength"]),rating:new Set([...Nt,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([...Nt,"options","display"])};function uo(e){if(!oe(e))throw new TypeError("BugDrop variant config must be an object");if(le(e,ul,"variant config"),typeof e.id!="string"||!Bt.test(e.id)||e.id==="legacy")throw new TypeError("BugDrop variant id must match [a-z][a-z0-9_-]{0,63} and cannot be legacy");if(e.configVersion!==void 0&&e.configVersion!==1)throw new TypeError("BugDrop variant configVersion must be 1");if(fl(e.presentation),hl(e.appearance),yl(e.content),!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)throw new TypeError("BugDrop variant fields must contain 1-20 entries");let t=new Map;for(let n of e.fields)wl(n,t);return Sl(e,t),po(hn(e))}function fl(e){if(!oe(e)||e.kind!=="modal"&&e.kind!=="inline")throw new TypeError("BugDrop variant presentation must be modal or inline");if(le(e,e.kind==="modal"?new Set(["kind","size","columns"]):new Set(["kind","columns"]),"variant presentation"),e.columns!==void 0&&e.columns!==1&&e.columns!==2)throw new TypeError("BugDrop variant presentation columns must be 1 or 2");if(e.kind==="modal"&&e.size!==void 0&&!["compact","default","wide"].includes(e.size))throw new TypeError("BugDrop modal size must be compact, default, or wide")}function hl(e){if(e!==void 0){if(!oe(e))throw new TypeError("BugDrop variant appearance must be an object");if(le(e,ml,"variant appearance"),e.theme!==void 0&&!["light","dark","auto"].includes(e.theme))throw new TypeError("BugDrop variant appearance theme is invalid");if(e.accentColor!==void 0&&(!j(e.accentColor,120)||Tl(e.accentColor)))throw new TypeError("BugDrop variant appearance accentColor is invalid");if(e.density!==void 0&&e.density!=="compact"&&e.density!=="comfortable")throw new TypeError("BugDrop variant appearance density is invalid")}}function yl(e){if(!oe(e))throw new TypeError("BugDrop variant content must be an object");if(le(e,pl,"variant content"),!j(e.title,500))throw new TypeError("BugDrop variant content.title is required");Qe(e.description,"description",2e3),Qe(e.submitLabel,"submitLabel",120),Qe(e.cancelLabel,"cancelLabel",120),Qe(e.successTitle,"successTitle",500),Qe(e.successMessage,"successMessage",2e3)}function Qe(e,t,n){if(e!==void 0&&!j(e,n))throw new TypeError(`BugDrop variant content.${t} is invalid`)}function wl(e,t){if(!oe(e)||!dl.has(e.type)||typeof e.id!="string"||!Bt.test(e.id))throw new TypeError("BugDrop variant field has an invalid type or id");if(le(e,gl[e.type],`field ${e.id}`),t.has(e.id))throw new TypeError(`Duplicate BugDrop variant field id: ${e.id}`);if(t.set(e.id,e),!j(e.label,500))throw new TypeError(`Field ${e.id} requires a label`);if(e.helpText!==void 0&&!j(e.helpText,1e3))throw new TypeError(`Field ${e.id} has invalid helpText`);if(e.required!==void 0&&typeof e.required!="boolean")throw new TypeError(`Field ${e.id} required must be boolean`);vl(e),e.type==="shortText"||e.type==="longText"?xl(e):e.type==="rating"?El(e):kl(e)}function vl(e){if(e.layout!==void 0){if(!oe(e.layout))throw new TypeError(`Field ${e.id} layout must be an object`);if(le(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2)throw new TypeError(`Field ${e.id} layout span must be 1 or 2`)}}function xl(e){if(e.placeholder!==void 0&&!j(e.placeholder,500))throw new TypeError(`Field ${e.id} has invalid placeholder`);let t=e.type==="shortText"?500:5e3;if(e.minLength!==void 0&&!et(e.minLength,0,5e3)||e.maxLength!==void 0&&!et(e.maxLength,1,5e3))throw new TypeError(`Field ${e.id} has invalid text bounds`);let n=e.minLength===void 0?0:e.minLength,r=e.maxLength===void 0?t:e.maxLength;if(!et(n,0,5e3)||!et(r,1,5e3)||n>r)throw new TypeError(`Field ${e.id} has invalid text bounds`);if(e.type==="longText"&&e.rows!==void 0&&!et(e.rows,1,50))throw new TypeError(`Field ${e.id} rows must be an integer from 1-50`)}function El(e){if(e.scale!==void 0&&e.scale!==5&&e.scale!==10)throw new TypeError(`Field ${e.id} rating scale must be 5 or 10`);if(e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number")throw new TypeError(`Field ${e.id} rating icon must be star or number`);if(e.lowLabel!==void 0&&!j(e.lowLabel,500))throw new TypeError(`Field ${e.id} has invalid lowLabel`);if(e.highLabel!==void 0&&!j(e.highLabel,500))throw new TypeError(`Field ${e.id} has invalid highLabel`)}function kl(e){if(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)throw new TypeError(`Field ${e.id} requires 2-50 choices`);if(e.display!==void 0&&e.display!=="radio"&&e.display!=="cards"&&e.display!=="buttons")throw new TypeError(`Field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options){if(!oe(n))throw new TypeError(`Field ${e.id} has an invalid choice`);if(le(n,new Set(["value","label","description"]),`field ${e.id} choice`),!j(n.value,120)||!j(n.label,500))throw new TypeError(`Field ${e.id} has an invalid choice`);if(n.description!==void 0&&!j(n.description,1e3))throw new TypeError(`Field ${e.id} has an invalid choice description`);if(t.has(n.value))throw new TypeError(`Field ${e.id} has duplicate choices`);t.add(n.value)}}function Sl(e,t){if(!oe(e.issue))throw new TypeError("BugDrop variant issue must be an object");if(le(e.issue,bl,"variant issue"),!j(e.issue.title,2e3))throw new TypeError("BugDrop variant issue.title is required");if(e.issue.classification!==void 0&&!cl.has(e.issue.classification))throw new TypeError("BugDrop variant issue.classification is invalid");for(let o of e.issue.title.matchAll(lo)){let i=o[1];if(i.startsWith("context.")){if(!Bt.test(i.slice(8)))throw co()}else if(!t.has(i))throw new TypeError(`Unknown BugDrop variant title field: ${i}`)}if(e.issue.title.replace(lo,"").includes("{{"))throw co();if(e.issue.sections!==void 0&&!Array.isArray(e.issue.sections))throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let n=e.issue.sections??[];if(n.length>20)throw new TypeError("BugDrop variant Issue accepts at most 20 sections");let r=new Set;for(let o of n)Cl(o,t,r)}function Cl(e,t,n){if(!oe(e)||!j(e.heading,120))throw new TypeError("BugDrop variant Issue section requires a heading");let r="field"in e,o="context"in e;if(r===o)throw new TypeError("BugDrop variant Issue section must reference one field or context key");if(le(e,r?new Set(["heading","field","format","omitWhenEmpty"]):new Set(["heading","context","format","omitWhenEmpty"]),"variant Issue section"),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean")throw new TypeError("BugDrop variant Issue section omitWhenEmpty must be boolean");let i=e.heading.trim().toLowerCase();if(n.has(i))throw new TypeError(`Duplicate BugDrop Issue heading: ${e.heading}`);if(n.add(i),r){let a=t.get(e.field);if(!a)throw new TypeError(`Unknown Issue field: ${e.field}`);let s=e.format===void 0?"text":e.format;if(!["text","quote","stars","choice"].includes(s))throw new TypeError(`Invalid Issue field format: ${String(s)}`);if(s==="stars"&&a.type!=="rating")throw new TypeError("BugDrop stars format requires a rating field");if(s==="choice"&&a.type!=="singleChoice")throw new TypeError("BugDrop choice format requires a singleChoice field")}else{if(typeof e.context!="string"||!Bt.test(e.context))throw new TypeError(`Invalid Issue context key: ${e.context}`);if(e.format!==void 0&&e.format!=="text"&&e.format!=="code")throw new TypeError(`Invalid Issue context format: ${String(e.format)}`)}}function co(){return new TypeError("BugDrop variant title contains an invalid placeholder")}function le(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));if(r)throw new TypeError(`Unknown BugDrop ${n} property: ${r}`)}function j(e,t){return typeof e=="string"&&e.trim().length>0&&e.length<=t}function et(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function Tl(e){return Array.from(e).some(t=>{let n=t.charCodeAt(0);return n<32||n===127})}function oe(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function hn(e){return Array.isArray(e)?e.map(t=>hn(t)):oe(e)?Object.fromEntries(Object.entries(e).map(([t,n])=>[t,hn(n)])):e}function po(e){if(e&&typeof e=="object"){Object.freeze(e);for(let t of Object.values(e))po(t)}return e}function mo(e,t,n={}){Al(n);let r=$e(e.fields,t),o=e.issue.title.replace(/{{\s*([^{}]+?)\s*}}/g,(a,s)=>{let l=s.startsWith("context.")?n[s.slice(8)]:r[s];return bo(e.fields,s,l,"text")}).replace(/\s+/g," ").trim().slice(0,256).trim();if(!o)throw new TypeError("BugDrop variant produced an empty Issue title");let i=(e.issue.sections??[]).flatMap(a=>{let s=Ll(a,e.fields,r,n);return!s.trim()&&a.omitWhenEmpty?[]:[{heading:a.heading.trim(),value:s.trim()?s:"Not provided.",format:Fl(a)}]});return{title:o,...e.issue.classification?{classification:e.issue.classification}:{},sections:i}}function Ll(e,t,n,r){return"context"in e?String(r[e.context]??""):bo(t,e.field,n[e.field],e.format??"text")}function bo(e,t,n,r){if(n==null||n==="")return"";let o=e.find(i=>i.id===t);if(r==="stars"&&o?.type==="rating"&&typeof n=="number"){let i=o.scale??5;return`${"\u2605".repeat(n)}${"\u2606".repeat(i-n)} (${n}/${i})`}return r==="choice"&&o?.type==="singleChoice"?o.options.find(i=>i.value===n)?.label??String(n):String(n)}function Fl(e){return e.format==="quote"||e.format==="code"?e.format:"text"}function Al(e){if(!Pl(e)||Object.keys(e).length>50)throw new TypeError("BugDrop variant context must contain at most 50 values");for(let[t,n]of Object.entries(e)){if(!/^[a-z][a-z0-9_-]{0,63}$/.test(t))throw new TypeError(`Invalid context key: ${t}`);if(!["string","number","boolean"].includes(typeof n)&&n!==null)throw new TypeError(`Invalid context value: ${t}`);if(typeof n=="number"&&!Number.isFinite(n))throw new TypeError(`Invalid context value: ${t}`);if(String(n??"").length>5e3)throw new TypeError(`Context value is too long: ${t}`)}}function Pl(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}async function go(e,t,n,r={}){let o=r.submissionId??Rl(),i=mo(t,n,r.context),a=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(e.authTokenProvider)},body:JSON.stringify({kind:"bugdrop.variant-submission",schemaVersion:1,repo:e.repo,variantId:t.id,submissionId:o,issue:i,metadata:Ml()})}),s=await a.json();if(!a.ok||s.success!==!0)throw new Error(typeof s.error=="string"?s.error:"Failed to submit feedback");if(!Number.isInteger(s.issueNumber)||s.issueNumber<=0||typeof s.issueUrl!="string"||!zl(s.issueUrl,e.repo,s.issueNumber)||typeof s.isPublic!="boolean")throw new Error("BugDrop received an invalid Issue result");return{issueNumber:s.issueNumber,issueUrl:s.issueUrl,isPublic:s.isPublic,...Array.isArray(s.labelMappingWarnings)&&s.labelMappingWarnings.every(l=>typeof l=="string")?{labelMappingWarnings:s.labelMappingWarnings}:{}}}function Rl(){if(typeof crypto?.randomUUID=="function")return crypto.randomUUID();if(typeof crypto?.getRandomValues!="function")throw new Error("BugDrop variants require a cryptographically secure random generator");let e=crypto.getRandomValues(new Uint8Array(16));return Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Ml(){let e=new URL(window.location.href);return e.search="",e.hash="",{url:e.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),browser:Dl(navigator.userAgent),os:Il(navigator.userAgent),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function Dl(e){for(let[t,n]of[["Edge",/Edg\/(\d+[\d.]*)/],["Chrome",/Chrome\/(\d+[\d.]*)/],["Safari",/Version\/(\d+[\d.]*).*Safari/],["Firefox",/Firefox\/(\d+[\d.]*)/]]){let r=e.match(n);if(r)return{name:t,version:r[1]??"unknown"}}return{name:"Unknown",version:"unknown"}}function Il(e){let t=e.match(/(?:Mac OS X|Windows NT|Android) ([\d_.]+)/);return t?{name:e.includes("Mac OS X")?"macOS":e.includes("Windows NT")?"Windows":"Android",version:(t[1]??"unknown").replaceAll("_",".")}:{name:e.includes("Linux")?"Linux":"Unknown",version:"unknown"}}function zl(e,t,n){try{let r=new URL(e);return r.protocol==="https:"&&r.hostname==="github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function fo(e,t={isLegacyModalOpen:()=>!1}){let n=new Map;return{register(r){let o=uo(r);if(n.has(o.id))throw new TypeError(`BugDrop variant is already registered: ${o.id}`);let i=Qr(o);n.set(o.id,i);let s=i.screens[0].config,l=(d,c={})=>go(e,s,d,c);return Object.freeze({id:i.variantId,open(d){if(s.presentation.kind!=="modal")throw new TypeError("BugDrop open() requires a modal variant");return t.isLegacyModalOpen()?so(i.variantId):ao({config:s,options:d,submit:l})},mount(d,c){return oo({config:s,target:d,options:c,submit:l})},submit(d,c={}){return l(d,c)}})}}}async function ho(e,t){let n=await t.preflight(e.system.preflight);if(n.status!=="installed")return t.showPreflightFailure(n),"preflight-blocked";let r=e.steps[0];if(r.enabled){if(!await t.showWelcome(r))return"finished";r.remember&&t.rememberWelcome(r)}let o=e.steps[1],i=e.steps[2],a=null;for(;;){if(a=await t.showDetails(o,a),!a)return"finished";let s=await t.capture(i,a);if(!s.returnToDetails)return await t.submit(e.system.submission,a,s),"finished"}}var $l="bugdrop-default@1";function Ol(e){if(e)return Object.freeze(Object.fromEntries(Object.entries(e).map(([t,n])=>[t,Array.isArray(n)?Object.freeze([...n]):n])))}function yo(e){let t=!e.skipWelcome&&e.welcome!=="never"&&!(e.welcome==="once"&&e.hasSeenWelcome),n=Object.freeze([Object.freeze({kind:"welcome",enabled:t,remember:t&&e.welcome==="once"}),Object.freeze({kind:"details",repo:e.repo,showName:e.showName,requireName:e.requireName,showEmail:e.showEmail,requireEmail:e.requireEmail,sendConsoleLogs:e.sendConsoleLogs}),Object.freeze({kind:"screenshot",mode:e.screenshotMode,repo:e.repo,screenshotScale:e.screenshotScale,elementContextMaxArea:e.elementContextMaxArea,accentColor:e.accentColor})]);return Object.freeze({id:$l,steps:n,system:Object.freeze({preflight:Object.freeze({kind:"installation",repo:e.repo,apiUrl:e.apiUrl,authTokenProvider:e.authTokenProvider}),submission:Object.freeze({kind:"legacy-feedback",repo:e.repo,apiUrl:e.apiUrl,authTokenProvider:e.authTokenProvider,categoryLabels:Ol(e.categoryLabels),issueLinkVisibility:e.issueLinkVisibility})})})}function wo(e){let t=new Map;for(let o of e.forms)for(let i of o.fields)t.set(`${o.id}.${i.id}`,i);let n=new Map,r=new Set;for(let o of e.screens)yn(o.when,r),n.set(o.id,o.type==="form"?e.forms.find(i=>i.id===o.form).fields.map(i=>`${o.form}.${i.id}`):[]);for(let o of e.issue.sections??[])"context"in o&&r.add(o.context);return Object.freeze({compiler:"bugdrop-flow@1",flowId:e.id,config:e,fields:t,contextKeys:r,screenAnswerPaths:n,screens:e.screens})}function yn(e,t){e&&("context"in e?t.add(e.context):"all"in e?e.all.forEach(n=>yn(n,t)):"any"in e&&e.any.forEach(n=>yn(n,t)))}function vo(e){return Object.freeze({instanceId:Q(e),result:Promise.resolve({status:"busy"}),close(){}})}var Nl=new Set(["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"]);function Ht(e){return Nl.has(e)}function Vt(e,t){let n=t;return t!==void 0&&!ce(t)&&E("open options must be an object"),we(t??{},new Set(["context","initialAnswers"]),"open options"),{context:Object.freeze(_l(e,n?.context)),initialAnswers:Hl(e,n?.initialAnswers)}}function xo(e){Vl(e),e.type==="shortText"||e.type==="longText"?Ul(e):e.type==="rating"?ql(e):e.type==="singleChoice"?Wl(e):e.type==="checkbox"?jl(e):Gl(e)}function Eo(e,t){if(e.type==="rating"){let o=e.scale??5;(!Number.isInteger(t)||t<1||t>o)&&E(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="singleChoice"){(typeof t!="string"||!e.options.some(o=>o.value===t))&&E(`condition equals is not a valid value for field ${e.id}`);return}if(e.type==="checkbox"){typeof t!="boolean"&&E(`condition equals is not a valid value for field ${e.id}`);return}e.type==="attachments"&&E(`condition answer cannot reference attachments field ${e.id}`),(typeof t!="string"||t!==t.trim())&&E(`condition equals is not a valid value for field ${e.id}`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3);(t.length<n||t.length>r)&&E(`condition equals is not a valid value for field ${e.id}`)}function ko(e){let{presentation:t,appearance:n,content:r}=e;ce(t)||E("presentation must be an object"),we(t,new Set(["kind","size","columns"]),"presentation"),t.kind!=="modal"&&E("presentation kind must be modal"),t.size!==void 0&&!["compact","default","wide"].includes(t.size)&&E("modal size is invalid"),t.columns!==void 0&&t.columns!==1&&t.columns!==2&&E("presentation columns must be 1 or 2"),n!==void 0&&(ce(n)||E("appearance must be an object"),we(n,new Set(["theme","accentColor","density"]),"appearance"),n.theme!==void 0&&!["light","dark","auto"].includes(n.theme)&&E("appearance theme is invalid"),me(n.accentColor,"appearance accentColor",120),n.density!==void 0&&!["compact","comfortable"].includes(n.density)&&E("appearance density is invalid")),r!==void 0&&(ce(r)||E("content must be an object"),we(r,new Set(["successTitle","successMessage","cancelLabel"]),"content"),me(r.successTitle,"successTitle",500),me(r.successMessage,"successMessage",2e3),me(r.cancelLabel,"cancelLabel",120))}function Bl(e,t){if(e.type==="shortText"||e.type==="longText"){typeof t!="string"&&E(`initial answer ${e.id} must be text`);let n=e.minLength??0,r=e.maxLength??(e.type==="shortText"?500:5e3),o=t.trim();return(o.length<n||o.length>r)&&E(`initial answer ${e.id} has invalid length`),o}if(e.type==="rating"){let n=e.scale??5;return(!Number.isInteger(t)||t<1||t>n)&&E(`initial answer ${e.id} must be a rating from 1-${n}`),t}return e.type==="singleChoice"?((typeof t!="string"||!e.options.some(n=>n.value===t))&&E(`initial answer ${e.id} must be a configured choice`),t):e.type==="checkbox"?(typeof t!="boolean"&&E(`initial answer ${e.id} must be boolean`),t):Xl(e,t)}function _l(e,t){t!==void 0&&!ce(t)&&E("context must be an object");let n=t??{},r=Object.keys(n).find(i=>!e.contextKeys.has(i));r&&E(`context contains unknown key ${r}`);let o={};for(let[i,a]of Object.entries(n))(!Zl(a)||typeof a=="number"&&!Number.isFinite(a))&&E(`context ${i} must be a finite scalar`),o[i]=a;return o}function Hl(e,t){t!==void 0&&!ce(t)&&E("initialAnswers must be an object");let n=t??{},r=Object.keys(n).find(o=>!e.fields.has(o));return r&&E(`initialAnswers contains unknown key ${r}`),Object.fromEntries(Object.entries(n).map(([o,i])=>[o,Bl(e.fields.get(o),i)]))}function Vl(e){e.layout!==void 0&&(ce(e.layout)||E(`field ${e.id} layout must be an object`),we(e.layout,new Set(["span"]),`field ${e.id} layout`),e.layout.span!==void 0&&e.layout.span!==1&&e.layout.span!==2&&E(`field ${e.id} layout span must be 1 or 2`))}function Ul(e){me(e.placeholder,`field ${e.id} placeholder`,500);let t=e.minLength??0,n=e.maxLength??(e.type==="shortText"?500:5e3);(!Ne(t,0,5e3)||!Ne(n,1,5e3)||t>n)&&E(`field ${e.id} has invalid text bounds`),e.type==="longText"&&e.rows!==void 0&&!Ne(e.rows,1,50)&&E(`field ${e.id} rows must be 1-50`)}function ql(e){e.scale!==void 0&&e.scale!==5&&e.scale!==10&&E(`field ${e.id} rating scale must be 5 or 10`),e.icon!==void 0&&e.icon!=="star"&&e.icon!=="number"&&E(`field ${e.id} rating icon is invalid`),me(e.lowLabel,`field ${e.id} lowLabel`,500),me(e.highLabel,`field ${e.id} highLabel`,500)}function Wl(e){(!Array.isArray(e.options)||e.options.length<2||e.options.length>50)&&E(`field ${e.id} requires 2-50 choices`),e.display!==void 0&&!["radio","cards","buttons"].includes(e.display)&&E(`field ${e.id} choice display is invalid`);let t=new Set;for(let n of e.options)ce(n)||E(`field ${e.id} has an invalid choice`),we(n,new Set(["value","label","description"]),`field ${e.id} choice`),_t(n.value,`field ${e.id} choice value`,120),_t(n.label,`field ${e.id} choice label`,500),me(n.description,`field ${e.id} choice description`,1e3),t.has(n.value)&&E(`field ${e.id} has duplicate choices`),t.add(n.value)}function jl(e){e.initialValue!==void 0&&typeof e.initialValue!="boolean"&&E(`field ${e.id} initialValue must be boolean`)}function Gl(e){e.maxFiles!==void 0&&!Ne(e.maxFiles,1,5)&&E(`field ${e.id} maxFiles must be 1-5`),e.maxFileSize!==void 0&&!Ne(e.maxFileSize,1,5*1024*1024)&&E(`field ${e.id} maxFileSize is invalid`),e.accept!==void 0&&(!Array.isArray(e.accept)||e.accept.length===0||e.accept.length>20||e.accept.some(t=>typeof t!="string"||!t.trim()||t.length>120||!Ht(t)))&&E(`field ${e.id} accept is invalid`)}function Xl(e,t){return(!Array.isArray(t)||t.length>(e.maxFiles??5))&&E(`initial answer ${e.id} has too many attachments`),t.map(n=>{ce(n)||E(`initial answer ${e.id} has an invalid attachment`),we(n,new Set(["name","type","size","dataUrl"]),"attachment"),_t(n.name,"attachment name",500),(typeof n.type!="string"||!Ht(n.type))&&E("attachment type is invalid"),e.accept&&!e.accept.includes(n.type)&&E(`initial answer ${e.id} has a disallowed attachment type`),Ne(n.size,0,e.maxFileSize??5*1024*1024)||E("attachment size is invalid"),(typeof n.dataUrl!="string"||!new RegExp(`^data:${Kl(n.type)};base64,[A-Za-z0-9+/]+={0,2}$`).test(n.dataUrl))&&E("attachment dataUrl is invalid");let r=n.dataUrl.slice(n.dataUrl.indexOf(",")+1);return r.length%4!==0&&E("attachment dataUrl is invalid"),atob(r).length>(e.maxFileSize??5*1024*1024)&&E("attachment size is invalid"),{name:n.name,type:n.type,size:n.size,dataUrl:n.dataUrl}})}function Kl(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function _t(e,t,n){(typeof e!="string"||!e.trim()||e.length>n||Yl(e))&&E(`${t} is invalid`)}function me(e,t,n){e!==void 0&&_t(e,t,n)}function Yl(e){return[...e].some(t=>{let n=t.charCodeAt(0);return n<32&&n!==9&&n!==10&&n!==13||n===127})}function Ne(e,t,n){return Number.isInteger(e)&&e>=t&&e<=n}function Zl(e){return e===null||["string","number","boolean"].includes(typeof e)}function ce(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function we(e,t,n){let r=Object.keys(e).find(o=>!t.has(o));r&&E(`${n} contains unknown key ${r}`)}function E(e){throw new TypeError(`BugDrop flow ${e}`)}function Co(e,t,n,r){let o=Lo(e,n),i=document.createElement("input");return i.type="checkbox",i.id=o.controlId,i.checked=typeof r[`${t}.${e.id}`]=="boolean"?!!r[`${t}.${e.id}`]:!!e.initialValue,i.setAttribute("aria-required",String(e.required??!1)),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy),o.wrapper.classList.add("bdf-checkbox"),o.wrapper.insertBefore(i,o.label),{id:e.id,required:!!e.required,element:o.wrapper,read:async()=>({ok:!0,value:i.checked}),setRequiredError(a){o.setError(i,a?"This checkbox is required.":null)},focus:()=>i.focus(),dispose(){}}}function To(e,t,n,r){let o=Lo(e,n);o.wrapper.classList.add("bdf-attachment");let i=document.createElement("input");i.className="bdv-input",i.type="file",i.id=o.controlId,i.multiple=(e.maxFiles??5)>1,i.setAttribute("aria-required",String(e.required??!1)),e.accept&&(i.accept=e.accept.join(",")),o.describedBy&&i.setAttribute("aria-describedby",o.describedBy);let a=document.createElement("ul");a.className="bdf-file-list",a.setAttribute("aria-live","polite"),o.wrapper.insertBefore(i,o.error),o.wrapper.insertBefore(a,o.error);let s=r[`${t}.${e.id}`],l=Array.isArray(s)?[...s]:[],d=!1,c=Promise.resolve(),u=0;So(a,l.map(x=>x.name));let m=()=>{let x=++u;d=!1,o.setError(i,null);let y=Array.from(i.files??[]);c=Jl(y,e).then(f=>{x===u&&(l=f,So(a,f.map(S=>S.name)))}).catch(f=>{x===u&&(d=!0,o.setError(i,f instanceof Error?f.message:"Could not read the selected attachment."))})};return i.addEventListener("change",m),{id:e.id,required:!!e.required,element:o.wrapper,async read(x){for(;;){let y=c;if(await y,y===c)break}return d&&x?{ok:!1}:{ok:!0,value:l}},setRequiredError(x){d||o.setError(i,x?"Select at least one attachment.":null)},focus:()=>i.focus(),dispose:()=>{u+=1,i.removeEventListener("change",m)}}}function Lo(e,t){let n=document.createElement("div");n.className="bdv-field",n.dataset.bugdropField=e.id,n.dataset.span=String(e.layout?.span??1);let r=`${t}-${e.id}`,o=document.createElement("label");if(o.className="bdv-label",o.htmlFor=r,o.textContent=e.label,e.required){let s=document.createElement("span");s.className="bdv-required",s.textContent=" *",s.setAttribute("aria-hidden","true"),o.appendChild(s)}n.appendChild(o);let i=[];if(e.helpText){let s=document.createElement("div");s.className="bdv-help",s.id=`${r}-help`,s.textContent=e.helpText,n.appendChild(s),i.push(s.id)}let a=document.createElement("div");return a.className="bdv-error",a.id=`${r}-error`,a.hidden=!0,a.setAttribute("aria-live","polite"),n.appendChild(a),i.push(a.id),{wrapper:n,label:o,error:a,controlId:r,describedBy:i.join(" ")||null,setError(s,l){a.textContent=l??"",a.hidden=!l,l?s.setAttribute("aria-invalid","true"):s.removeAttribute("aria-invalid")}}}async function Jl(e,t){if(e.length>(t.maxFiles??5))throw new TypeError(`Select at most ${t.maxFiles??5} attachments.`);return Promise.all(e.map(n=>Ql(n,t.maxFileSize??5*1024*1024,t.accept)))}async function Ql(e,t,n){if(!Ht(e.type))throw new TypeError(`${e.name} has an unsupported file type.`);if(n&&!n.includes(e.type))throw new TypeError(`${e.name} is not an accepted file type.`);if(e.size>t)throw new TypeError(`${e.name} is too large.`);let r=await new Promise((o,i)=>{let a=new FileReader;a.addEventListener("load",()=>typeof a.result=="string"?o(a.result):i(new Error("Could not read the selected attachment."))),a.addEventListener("error",()=>i(new Error("Could not read the selected attachment."))),a.readAsDataURL(e)});return{name:e.name,type:e.type,size:e.size,dataUrl:r}}function So(e,t){e.replaceChildren(...t.map(n=>{let r=document.createElement("li");return r.textContent=n,r}))}function Fo(e,t,n){let r=tc(e),o=document.createElement("div");o.className="bdv-fields",r.appendChild(o);let i=e.fields.map(s=>ec(s,e.id,t,n));for(let s of i)o.appendChild(s.element);let a=async s=>{let l=i.filter(oc);for(let c of l)c.setError(null);let d=Object.fromEntries(l.map(c=>[c.field.id,c.getValue()]));if(s)try{d=$e(e.fields.filter(rc),d)}catch(c){return nc(c,l),null}for(let c of i.filter(ic)){c.setRequiredError(!1);let u=await c.read(s);if(!u.ok)return c.focus(),null;if(s&&c.required&&(u.value===!1||Array.isArray(u.value)&&u.value.length===0))return c.setRequiredError(!0),c.focus(),null;d[c.id]=u.value}return d};return{element:r,collect:()=>a(!0),snapshot:()=>a(!1),dispose(){for(let s of i)s.dispose()}}}function ec(e,t,n,r){if(e.type==="checkbox")return Co(e,t,n,r);if(e.type==="attachments")return To(e,t,n,r);let o=$t(e,n);return o.setValue(r[`${t}.${e.id}`]??""),o}function tc(e){let t=document.createElement("section");t.className="bdv-surface";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function nc(e,t){let n=e instanceof se?t.find(r=>r.field.id===e.fieldId):void 0;n?.setError(e instanceof Error?e.message.replace(/^Answer \S+ /,""):"Invalid answer"),n?.focus()}function rc(e){return e.type!=="checkbox"&&e.type!=="attachments"}function oc(e){return"field"in e}function ic(e){return"read"in e}function Ao(e){let t=document.createElement("section");t.className="bdv-surface bdf-message";let n=document.createElement("div");n.className="bdv-header";let r=document.createElement("h2");if(r.className="bdv-title",r.textContent=e.title,n.appendChild(r),e.description){let o=document.createElement("p");o.className="bdv-description",o.textContent=e.description,n.appendChild(o)}return t.appendChild(n),t}function Po(e,t,n,r,o){let i=document.activeElement instanceof HTMLElement?document.activeElement:null,a=document.body.style.getPropertyValue("overflow"),s=document.body.style.getPropertyPriority("overflow"),l=document.createElement("div");l.dataset.bugdropOwned="",l.dataset.bugdropFlow=e,l.dataset.bugdropInstance=t,Object.assign(l.style,{position:"fixed",inset:"0",zIndex:"2147483646"});let d=l.attachShadow({mode:"open"}),c=n(d),u=document.createElement("div");u.className="bdv-overlay",c.root.appendChild(u);let m=()=>{},x=()=>{},y=!1;return{host:l,shadow:d,overlay:u,activate(f){document.body.style.setProperty("overflow","hidden"),document.body.appendChild(l),x=de(l),d.addEventListener("keydown",r),u.addEventListener("pointerdown",o),m=It({close:f})},dispose(){y||(y=!0,m(),d.removeEventListener("keydown",r),u.removeEventListener("pointerdown",o),x(),c.dispose(),l.remove(),a?document.body.style.setProperty("overflow",a,s):document.body.style.removeProperty("overflow"),i?.isConnected&&i.focus())}}}function wn(e,t,n){let r=e.querySelector(".bdv-title"),o=`${t}-title`;return r&&(r.id=o),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby",o),e.tabIndex=-1,e.dataset.size=n,e}function Ro(e,t,n,r,o){let i=t.screen,a=Be("\xD7","bdv-close");a.setAttribute("aria-label","Close"),a.addEventListener("click",o,{once:!0}),e.prepend(a);let s=document.createElement("p");s.className="bdf-progress",s.textContent=`Step ${t.position} of ${t.total}`,e.querySelector(".bdv-header")?.prepend(s);let l=document.createElement("div");if(l.className="bdv-actions",t.canGoBack){let u=Be(i.type==="message"?"Back":i.backLabel??"Back","bdv-cancel bdf-back");u.addEventListener("click",n),l.appendChild(u)}let d=i.continueLabel??(t.hasNext?"Continue":"Submit"),c=Be(d,"bdv-submit");c.addEventListener("click",r),l.appendChild(c),e.appendChild(l)}function Mo(e){let t=_e(e.title??"Add a screenshot",e.description??(e.mode==="required"?"A screenshot is required before submitting.":"Include a screenshot to help explain your feedback."));if(e.mode==="optional"){let n=document.createElement("label");n.className="bdf-checkbox";let r=document.createElement("input");r.type="checkbox",r.checked=!0,r.dataset.screenshot="",n.append(r,document.createTextNode("Include a screenshot")),t.appendChild(n)}return t}function _e(e,t){let n=document.createElement("section");n.className="bdv-surface";let r=document.createElement("div");r.className="bdv-header";let o=document.createElement("h2");o.className="bdv-title",o.textContent=e;let i=document.createElement("p");return i.className="bdv-description",i.textContent=t,r.append(o,i),n.appendChild(r),n}function Do(e,t,n,r){let o=_e("Submission failed",e),i=document.createElement("div");i.className="bdv-actions";let a=Be("Try again","bdv-submit");a.addEventListener("click",n);let s=Be(t,"bdv-cancel");return s.addEventListener("click",r),i.append(a,s),o.appendChild(i),o}function Io(e,t,n){let r=_e(e.config.content?.successTitle??"Thanks for your feedback!",e.config.content?.successMessage??"Your response was submitted.");if(t.isPublic){let i=document.createElement("a");i.className="bdv-success-link",i.href=t.issueUrl,i.target="_blank",i.rel="noopener noreferrer",i.textContent="View GitHub Issue",r.appendChild(i)}let o=Be("Done","bdv-submit");return o.addEventListener("click",n),r.appendChild(o),r}function zo(e){return e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href]")}function $o(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}function Oo(e){return Array.from(e.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hidden&&t.getAttribute("aria-hidden")!=="true")}function Be(e,t){let n=document.createElement("button");return n.type="button",n.className=t,n.textContent=e,n}function tt(e,t,n){return e?"answer"in e?No(t,e.answer,e.equals):"context"in e?No(n,e.context,e.equals):"all"in e?e.all.every(r=>tt(r,t,n)):e.any.some(r=>tt(r,t,n)):!0}function No(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)&&e[t]===n}function vn(e,t=1){if(t>4)throw new TypeError("BugDrop flow condition depth cannot exceed 4");if("answer"in e||"context"in e)return 1;let n="all"in e?e.all:e.any,r=1;for(let o of n)r+=vn(o,t+1);if(r>32)throw new TypeError("BugDrop flow conditions cannot exceed 32 nodes");return r}var Ut=class{constructor(t,n,r={}){this.definition=t;this.context=n;this.answers={...r},this.reconcileInitiallyHidden(),this.currentId=this.visibleScreens()[0]?.id??""}definition;context;answers;capture=null;currentId;current(){return this.route().screen}route(){let t=this.visibleScreens(),n=t.findIndex(o=>o.id===this.currentId),r=n>=0?n:0;return Object.freeze({screen:t[r],position:t.length===0?0:r+1,total:t.length,canGoBack:r>0,hasNext:r>=0&&r<t.length-1})}setFormAnswers(t,n){let r=new Set(this.visibleScreens().map(i=>i.id)),o=this.definition.screenAnswerPaths.get(this.definition.screens.find(i=>i.type==="form"&&i.form===t).id);for(let i of o){let a=i.slice(t.length+1);this.answers[i]=n[a]}this.reconcileNewlyHidden(r)}next(){let t=this.route(),n=this.visibleScreens();return t.hasNext?(this.currentId=n[t.position].id,!0):!1}back(){let t=this.route(),n=this.visibleScreens();return t.canGoBack?(this.currentId=n[t.position-2].id,!0):!1}hasNext(){return this.route().hasNext}visibleScreens(){return this.definition.screens.filter(t=>tt(t.when,this.answers,this.context))}reconcileInitiallyHidden(){for(let t of this.definition.screens)tt(t.when,this.answers,this.context)||this.clearScreenState(t)}reconcileNewlyHidden(t){let n=new Set(this.visibleScreens().map(o=>o.id)),r=!0;for(;r;){r=!1;for(let o of this.definition.screens)!t.has(o.id)||n.has(o.id)||(r=this.clearScreenState(o)||r);r&&(n=new Set(this.visibleScreens().map(o=>o.id)))}n.has(this.currentId)||(this.currentId=this.nearestVisibleId(n))}clearScreenState(t){let n=!1;for(let r of this.definition.screenAnswerPaths.get(t.id)??[])Object.prototype.hasOwnProperty.call(this.answers,r)&&(n=!0),delete this.answers[r];return t.type==="screenshot"&&this.capture!==null&&(this.capture=null,n=!0),n}nearestVisibleId(t){let n=this.definition.screens.findIndex(r=>r.id===this.currentId);for(let r=n;r>=0;r-=1){let o=this.definition.screens[r];if(o&&t.has(o.id))return o.id}return this.visibleScreens()[0]?.id??""}};function Bo(e,t){let n={id:t.id,presentation:t.presentation,appearance:t.appearance,content:{title:t.id},fields:[{id:"placeholder",type:"shortText",label:"Placeholder"}],issue:{title:t.id}},r=Oe(e,n,"modal"),o=document.createElement("style");return o.textContent=`
    .bdf-progress { margin: 0 0 12px; color: var(--bdv-text-muted); font-size: .8rem; }
    .bdf-message { min-height: 180px; display: grid; align-content: center; }
    .bdf-attachment { display: grid; gap: 7px; }
    .bdf-checkbox { display: flex; min-height: 44px; align-items: center; gap: 10px; }
    .bdf-checkbox input { width: 20px; height: 20px; accent-color: var(--bdv-accent); }
    .bdf-file-list { margin: 0; padding-left: 20px; color: var(--bdv-text-muted); }
    .bdf-back { order: -1; }
  `,e.prepend(o),{root:r.root,dispose(){o.remove(),r.dispose()}}}function _o(e,t,n){let r=Vt(e,t);return ze(),new xn(e,r,n).open()}var xn=class{constructor(t,n,r){this.definition=t;this.ports=r;this.instanceId=Q(t.flowId),this.previousFocus=$o(),this.runtime=new Ut(t,n.context,n.initialAnswers),this.result=new Promise(o=>{this.resolveOutcome=o}),this.state=Po(t.flowId,this.instanceId,o=>Bo(o,t.config),o=>this.onKeydown(o),o=>this.onBackdrop(o))}definition;ports;instanceId;previousFocus;runtime;result;resolveOutcome;state;currentForm=null;settled=!1;closed=!1;busy=!1;routePreviewVersion=0;preflightVersion=0;captureAbortController=null;open(){let t=Object.freeze({instanceId:this.instanceId,result:this.result,close:()=>this.close()});this.state.activate(t.close);let n=_e("Preparing feedback","Checking installation\u2026");return n.setAttribute("aria-busy","true"),this.show(n),this.preflight(),t}async preflight(){let t=++this.preflightVersion;try{let n=await this.ports.preflight();if(this.closed||t!==this.preflightVersion)return;if(n.status==="installed")this.render();else{let r=n.status==="not_installed"?`Install the ${n.appName??"BugDrop"} GitHub App to continue.`:"BugDrop could not reach the feedback service.";this.renderError(r,()=>{this.preflight()})}}catch{!this.closed&&t===this.preflightVersion&&this.renderError("BugDrop could not reach the feedback service.",()=>{this.preflight()})}}render(){this.disposeForm();let t=this.runtime.route(),n=t.screen;if(!n){this.finish();return}let r;if(n.type==="message")r=Ao(n);else if(n.type==="form"){let o=this.definition.config.forms.find(i=>i.id===n.form);this.currentForm=Fo(o,this.instanceId,this.runtime.answers),r=this.currentForm.element}else r=Mo(n);if(wn(r,this.instanceId,this.definition.config.presentation.size??"default"),Ro(r,t,()=>{this.back(n)},()=>{this.advance(n,r)},()=>this.close()),n.type==="form"){let o=()=>{this.previewFormRoute(n.form,r)};r.addEventListener("input",o),r.addEventListener("change",o)}this.show(r)}async previewFormRoute(t,n){let r=++this.routePreviewVersion,o=await this.currentForm?.snapshot();if(!o||r!==this.routePreviewVersion||!n.isConnected||this.closed)return;this.runtime.setFormAnswers(t,o);let i=this.runtime.route(),a=i.screen;if(!a)return;let s=n.querySelector(".bdf-progress");s&&(s.textContent=`Step ${i.position} of ${i.total}`);let l=n.querySelector(".bdv-submit");l&&(l.textContent=a.continueLabel??(i.hasNext?"Continue":"Submit"))}async back(t){if(!this.busy){if(this.busy=!0,t.type==="form"){let n=await this.currentForm?.snapshot();if(n===null||this.closed){this.busy=!1;return}n&&this.runtime.setFormAnswers(t.form,n)}this.runtime.back(),this.busy=!1,this.render()}}async advance(t,n){if(!this.busy){if(this.busy=!0,t.type==="form"){let r=await this.currentForm?.collect();if(!r||this.closed){this.busy=!1;return}this.runtime.setFormAnswers(t.form,r)}if(t.type==="screenshot"){this.busy=!1,await this.capture(t,n);return}this.runtime.next()?(this.busy=!1,this.render()):(this.busy=!1,await this.finish())}}async capture(t,n){let r=t.mode!=="optional"||!!n.querySelector("[data-screenshot]")?.checked;this.busy=!0,this.state.host.hidden=!0;let o=new AbortController;this.captureAbortController=o;try{let i=await this.ports.capture(t,r,o.signal);if(this.closed)return;if(i.returnToForm)this.runtime.back();else if(this.runtime.capture=i,!this.runtime.next()){this.busy=!1,await this.finish();return}}finally{this.captureAbortController===o&&(this.captureAbortController=null),this.busy=!1,this.state.host.hidden=!1}this.closed||this.render()}async finish(){if(this.busy||this.closed)return;this.busy=!0;let t=_e("Submitting feedback","Submitting\u2026");t.setAttribute("aria-busy","true"),this.show(t);try{let n=await this.ports.submit(this.runtime);if(this.closed)return;this.settle({status:"submitted",result:n}),this.busy=!1,this.show(Io(this.definition,n,()=>this.close(!1)))}catch(n){if(this.closed)return;this.busy=!1,this.renderError(n instanceof Error?n.message:"Failed to submit feedback",()=>{this.finish()})}}renderError(t,n){this.show(Do(t,this.definition.config.content?.cancelLabel??"Cancel",n,()=>this.close()))}show(t){wn(t,this.instanceId,this.definition.config.presentation.size??"default"),this.state.overlay.replaceChildren(t),queueMicrotask(()=>(zo(t)??t).focus())}close(t=!0){this.closed||(this.closed=!0,this.preflightVersion+=1,this.captureAbortController?.abort(),this.captureAbortController=null,t&&this.settle({status:"closed"}),this.disposeForm(),this.state.dispose(),this.previousFocus?.isConnected&&this.previousFocus.focus())}settle(t){this.settled||(this.settled=!0,this.resolveOutcome(t))}disposeForm(){this.routePreviewVersion+=1,this.currentForm?.dispose(),this.currentForm=null}onKeydown(t){if(!(t instanceof KeyboardEvent))return;if(t.key==="Escape"){t.preventDefault(),this.close();return}if(t.key!=="Tab")return;let n=Oo(this.state.overlay);if(!n.length){t.preventDefault(),this.state.overlay.querySelector('[role="dialog"]')?.focus();return}let r=n[0],o=n.at(-1),i=this.state.shadow.activeElement;t.shiftKey&&(i===r||!this.state.overlay.contains(i))?(t.preventDefault(),o.focus()):!t.shiftKey&&i===o&&(t.preventDefault(),r.focus())}onBackdrop(t){t.target===this.state.overlay&&this.close()}};function Vo(e,t,n){let r=ac(e.issue.title,t).trim().slice(0,256);if(!r)throw new TypeError("BugDrop flow Issue title cannot be empty");let o=(e.issue.sections??[]).map(i=>sc(e,i,t,n)).filter(i=>i!==null);return{title:r,description:o.join(`

`),category:e.issue.classification??"bug"}}function ac(e,t){return e.replace(/{{\s*([^{}]+?)\s*}}/g,(n,r)=>Uo(t[r.trim()]))}function sc(e,t,n,r){let o="answer"in t?n[t.answer]:r[t.context];if(t.omitWhenEmpty&&(o==null||o===""))return null;let i=lc(e,t,o);return`## ${t.heading}

${i}`}function lc(e,t,n){let r=t.format,o=Uo(n);if(r==="quote")return o.split(`
`).map(i=>`> ${i}`).join(`
`);if(r==="code")return cc(o);if(r==="stars"&&typeof n=="number"&&"answer"in t){let i=Ho(e,t.answer),a=i?.type==="rating"?i.scale??5:5;return`${"\u2605".repeat(n)}${"\u2606".repeat(Math.max(0,a-n))} (${n}/${a})`}if(r==="choice"&&typeof n=="string"&&"answer"in t){let i=Ho(e,t.answer);if(i?.type==="singleChoice")return i.options.find(a=>a.value===n)?.label??o}return o}function cc(e){let t=Math.max(0,...[...e.matchAll(/`+/g)].map(o=>o[0].length)),n="`".repeat(t+1),r=e.startsWith("`")||e.endsWith("`")?" ":"";return`${n}${r}${e}${r}${n}`}function Ho(e,t){let n=t.indexOf("."),r=t.slice(0,n),o=t.slice(n+1);return e.forms.find(i=>i.id===r)?.fields.find(i=>i.id===o)}function Uo(e){return e==null?"":typeof e=="string"?e.trim():String(e)}async function Wo(e,t,n,r,o){let i=Vo(t,n,r),a=t.evidence?.attachments,s=t.evidence?.sendConsoleLogs,l=t.evidence?.submitter?.name,d=t.evidence?.submitter?.email,c=l||d?{name:qo(n[l??""]),email:qo(n[d??""])}:void 0,u=await fetch(`${e.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(e.authTokenProvider)},body:JSON.stringify({repo:e.repo,title:i.title,description:i.description,category:i.category,categoryLabels:e.categoryLabels,screenshot:o?.screenshot??null,attachments:a?n[a]??[]:[],consoleLogs:s&&n[s]===!0?Pt():void 0,submitter:c&&(c.name||c.email)?c:void 0,metadata:uc(o)})});if(u.status===429)throw new Error("Too many submissions. Please try again later.");let m=await u.json();if(!u.ok||m.success!==!0)throw new Error(typeof m.error=="string"?m.error:"Failed to submit feedback");if(!Number.isInteger(m.issueNumber)||m.issueNumber<=0||typeof m.issueUrl!="string"||typeof m.isPublic!="boolean"||!dc(m.issueUrl,e.repo,m.issueNumber))throw new Error("BugDrop received an invalid Issue result");return{issueNumber:m.issueNumber,issueUrl:m.issueUrl,isPublic:m.isPublic,...Array.isArray(m.labelMappingWarnings)&&m.labelMappingWarnings.every(x=>typeof x=="string")?{labelMappingWarnings:m.labelMappingWarnings}:{}}}function dc(e,t,n){try{let r=new URL(e);return r.origin==="https://github.com"&&r.pathname.toLowerCase()===`/${t}/issues/${n}`.toLowerCase()&&!r.search&&!r.hash}catch{return!1}}function uc(e){let t=new URL(window.location.href);return t.search="",t.hash="",{url:t.toString(),userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:e?.elementSelector??null,fullElementSelector:e?.fullElementSelector??null,domNodeCount:Re(),fullPageDisabled:ne(),devicePixelRatio:window.devicePixelRatio,language:navigator.language}}function qo(e){return typeof e=="string"&&e.trim()?e.trim():void 0}var pc=/^[a-z][a-z0-9_-]{0,63}$/;function G(e,t,n){for(let r of Object.keys(e))t.has(r)||k(`${n} contains unknown key ${r}`)}function ve(e,t){(typeof e!="string"||!pc.test(e)||e==="legacy")&&k(`${t} is invalid`)}function xe(e,t,n){(typeof e!="string"||e.trim().length===0||e.length>n||[...e].some(r=>{let o=r.charCodeAt(0);return o<32&&o!==9&&o!==10&&o!==13}))&&k(`${t} is invalid`)}function be(e,t,n){e!==void 0&&xe(e,t,n)}function En(e,t){(e!==null&&!["string","number","boolean"].includes(typeof e)||typeof e=="number"&&!Number.isFinite(e))&&k(`${t} must be scalar`)}function ie(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function k(e){throw new TypeError(`BugDrop flow ${e}`)}function kn(e){if(!e||typeof e!="object"||Object.isFrozen(e))return e;Object.freeze(e);for(let t of Object.values(e))kn(t);return e}var Ko=/^([a-z][a-z0-9_-]{0,63})\.([a-z][a-z0-9_-]{0,63})$/,mc=new Set(["configVersion","id","presentation","appearance","content","forms","screens","issue","evidence"]),He=["id","type","label","helpText","required","layout"],jo={shortText:new Set([...He,"placeholder","minLength","maxLength"]),longText:new Set([...He,"placeholder","rows","minLength","maxLength"]),rating:new Set([...He,"scale","icon","lowLabel","highLabel"]),singleChoice:new Set([...He,"options","display"]),checkbox:new Set([...He,"initialValue"]),attachments:new Set([...He,"maxFiles","maxFileSize","accept"])};function Yo(e){ie(e)||k("config must be an object"),G(e,mc,"config"),e.configVersion!==1&&k("configVersion must be 1"),ve(e.id,"id"),ko(e),(!Array.isArray(e.forms)||e.forms.length===0||e.forms.length>12)&&k("forms must contain 1-12 entries"),(!Array.isArray(e.screens)||e.screens.length===0||e.screens.length>20)&&k("screens must contain 1-20 entries");let t=new Map,n=new Map;for(let l of e.forms)bc(l,n,t);let r=new Set,o=new Set,i=new Map,a=0,s=new Set;for(let l of e.screens){if(gc(l,s,n,i),l.type==="form"){r.has(l.form)&&k(`form ${l.form} may be referenced only once`),r.add(l.form);for(let d of n.get(l.form).fields)i.set(`${l.form}.${d.id}`,d);if(l.when===void 0)for(let d of n.get(l.form).fields)d.required&&o.add(`${l.form}.${d.id}`)}l.type==="screenshot"&&++a>1&&k("only one screenshot screen is supported")}for(let l of n.keys())r.has(l)||k(`form ${l} is unused`);return e.screens.every(l=>l.when!==void 0)&&k("at least one screen must be unconditional"),fc(e.issue,t,o),yc(e.evidence,t),kn(structuredClone(e))}function bc(e,t,n){ie(e)||k("form must be an object"),G(e,new Set(["id","title","description","fields"]),"form"),ve(e.id,"form id"),t.has(e.id)&&k(`duplicate form id ${e.id}`),xe(e.title,"form title",500),be(e.description,"form description",2e3),(!Array.isArray(e.fields)||e.fields.length===0||e.fields.length>20)&&k("form fields must contain 1-20 entries");let r=new Set;for(let o of e.fields)(!ie(o)||typeof o.type!="string"||!(o.type in jo))&&k("field type is unsupported"),G(o,jo[o.type],"field"),ve(o.id,"field id"),r.has(o.id)&&k(`duplicate field id ${o.id}`),r.add(o.id),xe(o.label,"field label",500),be(o.helpText,"field helpText",1e3),o.required!==void 0&&typeof o.required!="boolean"&&k("field required must be boolean"),xo(o),n.set(`${e.id}.${o.id}`,o);t.set(e.id,e)}function gc(e,t,n,r){ie(e)||k("screen must be an object"),ve(e.id,"screen id"),t.has(e.id)&&k(`duplicate screen id ${e.id}`),t.add(e.id),["message","form","screenshot"].includes(e.type)||k("screen type is unsupported");let o=e.type==="message"?new Set(["id","type","when","title","description","continueLabel"]):e.type==="form"?new Set(["id","type","when","form","continueLabel","backLabel"]):new Set(["id","type","when","title","description","mode","continueLabel","backLabel"]);G(e,o,"screen"),Object.prototype.hasOwnProperty.call(e,"when")&&Zo(e.when,r),e.type==="message"&&(xe(e.title,"message title",500),be(e.description,"message description",2e3)),e.type==="form"&&!n.has(e.form)&&k(`screen references unknown form ${e.form}`),e.type==="screenshot"&&!["optional","auto","required"].includes(e.mode)&&k("screenshot mode is invalid"),e.type==="screenshot"&&(be(e.title,"screenshot title",500),be(e.description,"screenshot description",2e3)),be(e.continueLabel,"screen continueLabel",120),e.type!=="message"&&be(e.backLabel,"screen backLabel",120)}function Zo(e,t){if(ie(e)||k("condition must be an object"),vn(e),"answer"in e){G(e,new Set(["answer","equals"]),"answer condition");let o=t.get(e.answer);o||k(`condition answer must reference an earlier field: ${e.answer}`),En(e.equals,"condition equals"),Eo(o,e.equals);return}if("context"in e){G(e,new Set(["context","equals"]),"context condition"),ve(e.context,"condition context"),En(e.equals,"condition equals");return}let n="all"in e?"all":"any"in e?"any":null;n||k("condition must contain answer, context, all, or any"),G(e,new Set([n]),"condition group");let r=n==="all"?e.all:e.any;(!Array.isArray(r)||r.length<1||r.length>8)&&k(`condition ${n} must contain 1-8 entries`);for(let o of r)Zo(o,t)}function fc(e,t,n){if(ie(e)||k("issue must be an object"),G(e,new Set(["classification","title","sections"]),"issue"),xe(e.title,"issue title",2e3),e.classification!==void 0&&!["bug","feature","question"].includes(e.classification)&&k("issue classification is invalid"),wc(e.title,t,n),e.sections!==void 0){(!Array.isArray(e.sections)||e.sections.length>20)&&k("issue sections are invalid");let r=new Set;for(let o of e.sections)hc(o,t,r)}}function hc(e,t,n){ie(e)||k("issue section must be an object"),"answer"in e?(G(e,new Set(["heading","answer","format","omitWhenEmpty"]),"issue section"),Jo(e.answer,t,"issue section")):(G(e,new Set(["heading","context","format","omitWhenEmpty"]),"issue section"),ve(e.context,"issue context")),xe(e.heading,"issue section heading",120);let r=e.heading.trim().toLowerCase();n.has(r)&&k(`duplicate issue section heading ${e.heading}`),n.add(r),e.omitWhenEmpty!==void 0&&typeof e.omitWhenEmpty!="boolean"&&k("issue section omitWhenEmpty must be boolean");let o=e.format??"text";if("answer"in e){["text","quote","stars","choice","code"].includes(o)||k("issue answer format is invalid");let i=t.get(e.answer);o==="stars"&&i.type!=="rating"&&k("stars format requires a rating field"),o==="choice"&&i.type!=="singleChoice"&&k("choice format requires a singleChoice field")}else["text","code"].includes(o)||k("issue context format is invalid")}function yc(e,t){e!==void 0&&(ie(e)||k("evidence must be an object"),G(e,new Set(["attachments","sendConsoleLogs","submitter"]),"evidence"),Go(e.attachments,"attachments",t,"attachments"),Go(e.sendConsoleLogs,"checkbox",t,"sendConsoleLogs"),e.submitter!==void 0&&(ie(e.submitter)||k("evidence submitter must be an object"),G(e.submitter,new Set(["name","email"]),"evidence submitter"),!e.submitter.name&&!e.submitter.email&&k("evidence submitter must map name or email"),e.submitter.name&&Xo(e.submitter.name,t,"submitter name"),e.submitter.email&&Xo(e.submitter.email,t,"submitter email")))}function Go(e,t,n,r){e!==void 0&&n.get(e)?.type!==t&&k(`${r} must reference a ${t} field`)}function Jo(e,t,n){(!Ko.test(e)||!t.has(e)||t.get(e)?.type==="attachments")&&k(`${n} references an unknown scalar answer: ${e}`)}function Xo(e,t,n){let r=t.get(e)?.type;(!Ko.test(e)||r!=="shortText"&&r!=="longText")&&k(`${n} must reference a text field`)}function wc(e,t,n){let r=0,o=!1,i="";for(let s of e.matchAll(/{{\s*([^{}]+?)\s*}}/g)){let l=s.index,d=e.slice(r,l);i+=d,(d.includes("{{")||d.includes("}}")||d.endsWith("{"))&&k("issue title template is malformed");let c=s[1].trim();Jo(c,t,"issue title"),o||=n.has(c),r=l+s[0].length,e[r]==="}"&&k("issue title template is malformed")}let a=e.slice(r);(a.includes("{{")||a.includes("}}"))&&k("issue title template is malformed"),i+=a,!i.trim()&&!o&&k("issue title must contain text or reference a required answer")}function Qo(e,t,n={isLegacyModalOpen:()=>!1}){let r=new Map;return{register(o){let i=Yo(o);if(r.has(i.id))throw new TypeError(`BugDrop flow is already registered: ${i.id}`);let a=wo(i);return r.set(i.id,a),Object.freeze({id:i.id,open(s){return n.isLegacyModalOpen()?(Vt(a,s),vo(i.id)):_o(a,s,{...t,submit:l=>Wo(e,i,l.answers,l.context,l.capture)})}})}}}var st="bugdrop_dismissed",vc="bugdrop_trigger_position_",si="bugdrop_welcomed_",xc="bugdrop_complex_screenshot_skipped_",Ec=10080*60*1e3,ot=8,ei=16,ti=5,ni=5*1024*1024,li=["image/png","image/jpeg","image/gif","image/webp","application/pdf","video/mp4","video/webm","video/quicktime"];function kc(e){let t=[{name:"Edge",pattern:/Edg(?:e|A|iOS)?\/(\d+[\d.]*)/},{name:"Opera",pattern:/(?:OPR|Opera)\/(\d+[\d.]*)/},{name:"Chrome",pattern:/Chrome\/(\d+[\d.]*)/},{name:"Safari",pattern:/Version\/(\d+[\d.]*).*Safari/},{name:"Firefox",pattern:/Firefox\/(\d+[\d.]*)/}];for(let{name:n,pattern:r}of t){let o=e.match(r);if(o)return{name:n,version:o[1]||"unknown"}}return{name:"Unknown",version:"unknown"}}function Sc(e){let t=[{name:"iOS",pattern:/iPhone OS (\d+[_\d]*)/,versionIndex:1},{name:"iOS",pattern:/iPad.*OS (\d+[_\d]*)/,versionIndex:1},{name:"macOS",pattern:/Mac OS X (\d+[_.\d]*)/,versionIndex:1},{name:"Windows",pattern:/Windows NT (\d+\.\d+)/,versionIndex:1},{name:"Android",pattern:/Android (\d+[\d.]*)/,versionIndex:1},{name:"Linux",pattern:/Linux/,versionIndex:void 0},{name:"Chrome OS",pattern:/CrOS/,versionIndex:void 0}];for(let{name:n,pattern:r,versionIndex:o}of t){let i=e.match(r);if(i){let a=o!==void 0&&i[o]?i[o].replace(/_/g,"."):"";return{name:n,version:a}}}return{name:"Unknown",version:""}}function ci(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return e.split("?")[0].split("#")[0]}}function Cc(){let e=navigator.userAgent;return{browser:kc(e),os:Sc(e),devicePixelRatio:window.devicePixelRatio||1,language:navigator.language||"unknown",url:ci(window.location.href)}}var Tc=null,X=null,it=null,K=!1,Lc=null,Ve=!1;function ri(e){try{let t=localStorage.getItem(st);if(!t)return!1;if(t==="true")return!0;let n=parseInt(t,10);if(isNaN(n))return!1;if(e===void 0)return!0;let r=e*24*60*60*1e3;return Date.now()-n<r}catch{return!1}}function di(){try{localStorage.setItem(st,Date.now().toString())}catch{}}function ui(e){try{return localStorage.getItem(si+e)!==null}catch{return!1}}function pi(e){try{localStorage.setItem(si+e,Date.now().toString())}catch{}}function Pn(e){return`${xc}${e}:${ci(window.location.href)}`}function Fc(e){try{let t=Pn(e),n=localStorage.getItem(t);if(!n)return!1;let r=parseInt(n,10);return isNaN(r)||Date.now()-r>Ec?(localStorage.removeItem(t),!1):!0}catch{return!1}}function Ac(e){try{localStorage.setItem(Pn(e),Date.now().toString())}catch{}}function Pc(e){try{localStorage.removeItem(Pn(e))}catch{}}function mi(e,t){ne()&&(Ac(e.repo),t.includeScreenshot=!1)}function Rc(e){if(!e)return;let t;try{t=JSON.parse(e)}catch(o){let i=o instanceof Error?`: ${o.message}`:"";console.warn(`[BugDrop] Invalid data-category-labels JSON${i}. Using default GitHub labels.`);return}if(!t||typeof t!="object"||Array.isArray(t)){console.warn("[BugDrop] Invalid data-category-labels: expected a JSON object. Using default GitHub labels.");return}let n=["bug","feature","question"],r={};for(let[o,i]of Object.entries(t)){if(!n.includes(o)){console.warn(`[BugDrop] Invalid data-category-labels: unknown category "${o}" (expected ${n.join(", ")}). Ignoring.`);continue}typeof i=="string"||Array.isArray(i)&&i.every(a=>typeof a=="string")?r[o]=i:console.warn(`[BugDrop] Invalid data-category-labels: value for "${o}" must be a string or string array. Ignoring.`)}return Object.keys(r).length>0?r:void 0}var P=document.currentScript||document.querySelector('script[src*="bugdrop"][src*="widget"]');document.currentScript||console.warn("[BugDrop] document.currentScript is null \u2014 do not use async or defer on the BugDrop script tag.");var at=P?.dataset.theme;at&&!xt(at)&&console.warn(`[BugDrop] Invalid data-theme "${at}". Expected "light", "dark", or "auto".`);var Mc=sr(P?.dataset.locale||document.documentElement.lang),oi=P?.dataset.requireName==="true",ii=P?.dataset.requireEmail==="true",nt=P?.dataset.position;nt&&nt!=="bottom-right"&&nt!=="bottom-left"&&console.warn(`[BugDrop] Invalid data-position "${nt}". Expected "bottom-right" or "bottom-left".`);var bi=P?.dataset.dismissDuration,gi=ir(bi);bi&&gi===void 0&&console.warn("[BugDrop] Invalid data-dismiss-duration. Expected a positive whole number of days.");var fi=P?.dataset.screenshotScale,hi=Qt(fi);fi&&hi===void 0&&console.warn("[BugDrop] Invalid data-screenshot-scale. Expected a non-negative number.");var yi=P?.dataset.elementContextMaxArea,wi=Qt(yi);yi&&wi===void 0&&console.warn("[BugDrop] Invalid data-element-context-max-area. Expected a non-negative number.");var vi=P?.dataset.shadow,xi=ut(vi);vi&&!xi&&console.warn('[BugDrop] Invalid data-shadow. Expected "soft", "hard", or "none".');var Ee=P?.dataset.showIssueLink,Ei=Ee==="always"||Ee==="never"?Ee:"public";Ee&&Ee!=="public"&&Ee!==Ei&&console.warn(`[BugDrop] Invalid data-show-issue-link "${Ee}". Expected "public", "always", or "never".`);var rt={repo:P?.dataset.repo||"",apiUrl:P?.src.replace(/\/widget(?:\.v[\d.]+)?\.js$/,"/api")||"",authTokenProvider:Gr(P?.dataset.authTokenProvider),position:nt==="bottom-left"?"bottom-left":"bottom-right",theme:xt(at)?at:"auto",showName:P?.dataset.showName==="true"||oi,requireName:oi,showEmail:P?.dataset.showEmail==="true"||ii,requireEmail:ii,buttonDismissible:P?.dataset.buttonDismissible==="true",dismissDuration:gi,showRestore:P?.dataset.showRestore!=="false",showButton:P?.dataset.button!=="false",accentColor:_(P?.dataset.color),iconUrl:We(P?.dataset.icon),label:P?.dataset.label||void 0,categoryLabels:Rc(P?.dataset.categoryLabels),font:Ae(P?.dataset.font),radius:J(P?.dataset.radius)?.toString(),bgColor:_(P?.dataset.bg),textColor:_(P?.dataset.text),borderWidth:J(P?.dataset.borderWidth)?.toString(),borderColor:_(P?.dataset.borderColor),shadow:xi,welcome:(()=>{let e=P?.dataset.welcome;return e==="false"||e==="never"?"never":e==="always"?"always":"once"})(),screenshotMode:(()=>{let e=P?.dataset.screenshot;return e==="auto"||e==="required"?e:(e&&e!=="optional"&&console.warn(`[BugDrop] Invalid data-screenshot "${e}". Expected "optional", "auto", or "required".`),"optional")})(),screenshotScale:hi,elementContextMaxArea:wi,issueLinkVisibility:Ei,sendConsoleLogs:P?.dataset.sendConsoleLogs==="true",locale:Mc};cr(rt.locale);Yr();rt.repo?/^[^/]+\/[^/]+$/.test(rt.repo)?zc(rt):console.error(`[BugDrop] Invalid data-repo format "${rt.repo}". Expected "owner/repo" (e.g., "octocat/hello-world").`):console.error("[BugDrop] Missing data-repo attribute");function Dc(e){return e.label!==void 0?e.label:p().triggerLabel}function ki(e,t){if(t.position==="bottom-left"&&e.appendChild(ai()),t.iconUrl!=="none"){let r=document.createElement("span");if(r.className="bd-trigger-icon",t.iconUrl){let o=document.createElement("img");o.src=t.iconUrl,o.alt="";let i=document.createElement("span");i.textContent="\u{1F41B}",i.style.display="none",o.addEventListener("error",()=>{o.style.display="none",i.style.display=""}),r.append(o,i)}else r.textContent="\u{1F41B}";e.appendChild(r)}let n=document.createElement("span");n.className="bd-trigger-label",n.textContent=Dc(t),e.appendChild(n),t.position!=="bottom-left"&&e.appendChild(ai())}function ai(){let e=document.createElement("span");return e.className="bd-trigger-drag-handle",e.setAttribute("aria-hidden","true"),e.title=p().dragHandleTitle,e.innerHTML=`
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
  `,e}function Si(e,t=!1){let n=["bd-trigger",`bd-trigger--${e.position==="bottom-left"?"left":"right"}`];return t&&n.push("bd-trigger--restoring"),n.join(" ")}function Ci(e){return`${vc}${e.repo}_${e.position}`}function Ti(e){try{let t=localStorage.getItem(Ci(e));if(!t)return null;let n=Number(t);return Number.isFinite(n)?n:null}catch{return null}}function Li(e,t){try{localStorage.setItem(Ci(e),String(Math.round(t)))}catch{}}function Ic(e,t){let n=e.getBoundingClientRect(),r=Math.max(ot,window.innerHeight-n.height-ot);return Math.min(Math.max(t,ot),r)}function qt(e,t){let n=Ic(e,t);return e.style.top=`${n}px`,e.style.bottom="auto",n}function Fi(e,t){let n=Ti(t);n!==null&&(e.classList.add("bd-trigger--positioned"),qt(e,n))}function Ln(e,t){if(!e.style.top)return;let n=e.getBoundingClientRect();if(n.width===0||n.height===0)return;let r=parseFloat(e.style.top);if(!Number.isFinite(r))return;let o=e.classList.contains("bd-trigger--dragging")?r:Ti(t)??r;qt(e,o)}function Ai(e,t){let n=()=>{if(!e.isConnected){r();return}Ln(e,t)},r=()=>{window.removeEventListener("resize",n),window.visualViewport?.removeEventListener("resize",n)};window.addEventListener("resize",n),window.visualViewport?.addEventListener("resize",n)}function Pi(e,t){let n=e.querySelector(".bd-trigger-drag-handle");if(!n)return;let r=null,o=0,i=0,a=!1,s=()=>{r!==null&&(r=null,e.classList.remove("bd-trigger--dragging"),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",c),a&&(Li(t,e.getBoundingClientRect().top),window.setTimeout(()=>{Ve=!1},0)))};function l(u){if(r!==u.pointerId)return;let m=i+u.clientY-o;Math.abs(u.clientY-o)>3&&(a=!0,Ve=!0),qt(e,m)}function d(u){r===u.pointerId&&s()}function c(u){r===u.pointerId&&s()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation();let m=e.getBoundingClientRect();r=u.pointerId,o=u.clientY,i=m.top,a=!1,e.classList.add("bd-trigger--dragging"),n.setPointerCapture(u.pointerId),window.addEventListener("pointermove",l),window.addEventListener("pointerup",d),window.addEventListener("pointercancel",c)}),n.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation()})}function Ri(e,t){e.addEventListener("keydown",n=>{if(n.target!==e||!["ArrowUp","ArrowDown","Home","End"].includes(n.key))return;n.preventDefault(),n.stopPropagation();let r=e.getBoundingClientRect(),o=window.innerHeight-r.height-ot,i=n.key==="ArrowUp"?r.top-ei:n.key==="ArrowDown"?r.top+ei:n.key==="Home"?ot:o;e.classList.add("bd-trigger--positioned"),Li(t,qt(e,i))})}function Fn(e,t){let n=document.createElement("div");n.className=t.position==="bottom-left"?"bd-pull-tab bd-pull-tab--left":"bd-pull-tab",n.innerHTML='<span class="bd-pull-tab-chevron">\u2039</span>',n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-label",p().pullTabAriaLabel);let r=()=>{try{localStorage.removeItem(st)}catch{}n.remove(),it=null,Mi(e,t,!0)};return n.addEventListener("click",r),n.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),r())}),e.appendChild(n),it=n,n}function zc(e){if(Lc=e,!e.buttonDismissible)try{localStorage.removeItem(st)}catch{}let t=document.createElement("div");t.id="bugdrop-host",t.style.pointerEvents="auto",document.body.appendChild(t);let n=t.attachShadow({mode:"open"});de(t);for(let i of["keydown","keypress","keyup"])n.addEventListener(i,a=>{let s=a.target;(s.tagName==="INPUT"||s.tagName==="TEXTAREA")&&a.stopPropagation()});let r=Mr(n,e);if(Tc=r,e.showButton&&!(e.buttonDismissible&&ri(e.dismissDuration))){let i=document.createElement("button");if(i.className=Si(e),ki(i,e),i.setAttribute("aria-label",p().triggerAriaLabel),e.buttonDismissible){let a=document.createElement("button");a.className="bd-trigger-close",a.textContent="\xD7",a.setAttribute("aria-label",p().dismissButtonAriaLabel),i.appendChild(a),a.addEventListener("click",s=>{s.stopPropagation(),di(),i.classList.remove("bd-trigger--restoring"),i.classList.add("bd-trigger--dismissing"),i.addEventListener("animationend",()=>{i.remove(),X=null,e.showRestore&&Fn(r,e)},{once:!0})})}r.appendChild(i),X=i,Fi(i,e),Ai(i,e),Pi(i,e),Ri(i,e),i.addEventListener("click",()=>{if(Ve){Ve=!1;return}Rn(r,e)})}else e.showButton&&e.buttonDismissible&&e.showRestore&&ri(e.dismissDuration)&&Fn(r,e);$c(r,e),window.dispatchEvent(new CustomEvent("bugdrop:ready"))}function $c(e,t){let n=t.theme,r,o;window.BugDrop={open:()=>{K||Rn(e,t,{skipWelcome:!0})},close:()=>{if(K){let i=e.querySelector(".bd-modal");i&&i.remove(),K=!1}},hide:()=>{X&&(X.style.display="none")},show:()=>{try{localStorage.removeItem(st)}catch{}it&&(it.remove(),it=null),X?(X.style.display="",Ln(X,t),window.requestAnimationFrame(()=>{X&&Ln(X,t)})):t.showButton&&Mi(e,t)},isOpen:()=>K,isButtonVisible:()=>X!==null&&X.style.display!=="none",setTheme:i=>{if(!xt(i)){console.warn(`[BugDrop] Invalid theme ${String(i)}. Expected 'light' | 'dark' | 'auto'.`);return}n=i;let a=De(i);Ke(e,a),Ye(e,t,a)},registerVariant:i=>(r??=fo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider},{isLegacyModalOpen:()=>K}),r.register(i)),registerFlow:i=>(o??=Qo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,categoryLabels:t.categoryLabels},{preflight:()=>Mn(t),capture:async(a,s,l)=>await Tt(e,{...t,screenshotMode:a.mode},s,()=>{},l)},{isLegacyModalOpen:()=>K}),o.register(i))},Et(i=>{n==="auto"&&(Ke(e,i),Ye(e,t,i))})}function Mi(e,t,n=!1){let r=document.createElement("button");if(r.className=Si(t,n),ki(r,t),r.setAttribute("aria-label",p().triggerAriaLabel),t.buttonDismissible){let o=document.createElement("button");o.className="bd-trigger-close",o.textContent="\xD7",o.setAttribute("aria-label",p().dismissButtonAriaLabel),r.appendChild(o),o.addEventListener("click",i=>{i.stopPropagation(),di(),r.classList.remove("bd-trigger--restoring"),r.classList.add("bd-trigger--dismissing"),r.addEventListener("animationend",()=>{r.remove(),X=null,t.showRestore&&Fn(e,t)},{once:!0})})}e.appendChild(r),X=r,Fi(r,t),Ai(r,t),Pi(r,t),Ri(r,t),r.addEventListener("click",()=>{if(Ve){Ve=!1;return}Rn(e,t)})}async function Rn(e,t,n){if(!K){if(ze(),K=!0,Oc()){if(await Bc(e,t,n)==="preflight-blocked")return}else{let{status:r,appName:o}=await Mn(t);if(r==="not_installed"){An(e,t,void 0,o);return}if(r==="unreachable"){An(e,t,p().apiUnreachableMessage,o);return}await Nc(e,t,n)}K=!1}}function Oc(){return window.__bugdropDefaultFlowRuntime==="private"}async function Nc(e,t,n){if(!(n?.skipWelcome||t.welcome==="never"||t.welcome==="once"&&ui(t.repo))){if(!await Di(e)){K=!1;return}t.welcome==="once"&&pi(t.repo)}let o=null;for(;;){if(o=await Ii(e,t,o),!o){K=!1;return}let i=o,a=await Tt(e,t,i.includeScreenshot,()=>mi(t,i));if(!a.returnToForm){await Dn(e,t,{title:o.title,description:o.description,category:o.category,name:o.name,email:o.email,screenshot:a.screenshot,attachments:o.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?ge(t.accentColor):null,sendConsoleLogs:o.sendConsoleLogs});break}}}async function Bc(e,t,n){let r=yo({repo:t.repo,apiUrl:t.apiUrl,authTokenProvider:t.authTokenProvider,welcome:t.welcome,screenshotMode:t.screenshotMode,skipWelcome:!!n?.skipWelcome,hasSeenWelcome:ui(t.repo),showName:t.showName,requireName:t.requireName,showEmail:t.showEmail,requireEmail:t.requireEmail,sendConsoleLogs:t.sendConsoleLogs,screenshotScale:t.screenshotScale,elementContextMaxArea:t.elementContextMaxArea,accentColor:t.accentColor,categoryLabels:t.categoryLabels,issueLinkVisibility:t.issueLinkVisibility});return ho(r,{preflight:o=>Mn({...t,repo:o.repo,apiUrl:o.apiUrl,authTokenProvider:o.authTokenProvider}),showPreflightFailure:o=>An(e,t,o.status==="unreachable"?p().apiUnreachableMessage:void 0,o.appName),showWelcome:()=>Di(e),rememberWelcome:()=>pi(r.steps[1].repo),showDetails:(o,i)=>Ii(e,{...t,repo:o.repo,showName:o.showName,requireName:o.requireName,showEmail:o.showEmail,requireEmail:o.requireEmail,sendConsoleLogs:o.sendConsoleLogs,screenshotMode:r.steps[2].mode},i),capture:async(o,i)=>{let a={...t,repo:o.repo,screenshotMode:o.mode,screenshotScale:o.screenshotScale,elementContextMaxArea:o.elementContextMaxArea,accentColor:o.accentColor},s=await Tt(e,a,i.includeScreenshot,()=>mi(a,i));return{...s,returnToDetails:s.returnToForm}},submit:(o,i,a)=>Dn(e,{...t,repo:o.repo,apiUrl:o.apiUrl,authTokenProvider:o.authTokenProvider,categoryLabels:o.categoryLabels,issueLinkVisibility:o.issueLinkVisibility},{title:i.title,description:i.description,category:i.category,name:i.name,email:i.email,screenshot:a.screenshot,attachments:i.attachments,elementSelector:a.elementSelector,fullElementSelector:a.fullElementSelector,selectedElementHighlightColor:a.elementSelector?ge(t.accentColor):null,sendConsoleLogs:i.sendConsoleLogs})})}async function Mn(e){try{let t=await fetch(`${e.apiUrl}/check/${e.repo}`,{headers:await he(e.authTokenProvider)});if(!t.ok)return{status:"unreachable"};let n=await t.json();return{status:n.installed===!0?"installed":"not_installed",appName:n.appName}}catch{return{status:"unreachable"}}}function An(e,t,n,r){let i=`https://github.com/apps/${r||(t.apiUrl.includes("bugdrop.neonwatty.workers.dev")?"neonwatty-bugdrop":t.apiUrl.replace(/https?:\/\//,"").replace(/\..*/,""))}/installations/new`,a=n||p().installRequiredMessage,s=n?p().connectionErrorTitle:p().installRequiredTitle,l=V(e,s,`
      <p style="margin: 0 0 16px; color: var(--bd-text-secondary);">${q(a)}</p>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${v(p().cancel)}</button>
        ${n?"":`<a href="${i}" target="_blank" class="bd-btn bd-btn-primary" style="text-decoration: none;">${v(p().installApp)}</a>`}
      </div>
    `,!0),d=l.querySelector(".bd-close"),c=l.querySelector('[data-action="cancel"]');d?.addEventListener("click",()=>{l.remove(),K=!1}),c?.addEventListener("click",()=>{l.remove(),K=!1})}function Di(e){return new Promise(t=>{let n=V(e,p().welcomeTitle,`
        <div style="text-align: center; padding: 8px 0 16px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">\u{1F4AC}</div>
          <p style="margin: 0 0 12px; color: var(--bd-text-primary); font-size: 1.05rem; font-weight: 500;">
            ${v(p().welcomeHeadline)}
          </p>
          <p style="margin: 0 0 8px; color: var(--bd-text-secondary); font-size: 0.95rem; line-height: 1.6;">
            ${v(p().welcomeBodyLine1)}<br/>
            ${v(p().welcomeBodyLine2)}
          </p>
        </div>
        <div class="bd-actions" style="justify-content: center;">
          <button class="bd-btn bd-btn-primary" data-action="continue">${v(p().getStarted)}</button>
        </div>
      `,!0),r=n.querySelector(".bd-close"),o=n.querySelector('[data-action="continue"]');r?.addEventListener("click",()=>{n.remove(),t(!1)}),o?.addEventListener("click",()=>{n.remove(),t(!0)})})}function Ii(e,t,n){return new Promise(r=>{let o=t.showName?`
          <div class="bd-form-group">
            <label class="bd-label" for="name">${v(p().nameLabel)}${t.requireName?" *":""}</label>
            <input type="text" id="name" class="bd-input" ${t.requireName?"required":""} placeholder="${v(p().namePlaceholder)}" value="${q(n?.name||"")}" />
          </div>
        `:"",i=t.showEmail?`
          <div class="bd-form-group">
            <label class="bd-label" for="email">${v(p().emailLabel)}${t.requireEmail?" *":""}</label>
            <input type="email" id="email" class="bd-input" ${t.requireEmail?"required":""} placeholder="${v(p().emailPlaceholder)}" value="${q(n?.email||"")}" />
          </div>
        `:"",a=V(e,p().feedbackFormTitle,`
        <form id="feedback-form">
          <div class="bd-form-group">
            <label class="bd-label">${v(p().categoryLabel)}</label>
            <div class="bd-category-selector" style="display: flex; gap: 8px; margin-top: 6px;">
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="bug" ${Cn(n,"bug")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u{1F41B} ${v(p().categoryBug)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="feature" ${Cn(n,"feature")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2728 ${v(p().categoryFeature)}</span>
              </label>
              <label class="bd-category-option" style="flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: var(--bd-border-style); border-radius: var(--bd-radius-sm); cursor: pointer; transition: all 0.15s ease;">
                <input type="radio" name="category" value="question" ${Cn(n,"question")} style="accent-color: var(--bd-primary);" />
                <span style="font-size: 0.9rem;">\u2753 ${v(p().categoryQuestion)}</span>
              </label>
            </div>
          </div>
          <div class="bd-form-group">
            <label class="bd-label" for="title">${v(p().titleLabel)} *</label>
            <input type="text" id="title" class="bd-input" required placeholder="${v(p().titlePlaceholder)}" value="${q(n?.title||"")}" />
          </div>
          <div class="bd-form-group">
            <label class="bd-label" for="description">${v(p().descriptionLabel)}</label>
            <textarea id="description" class="bd-textarea" placeholder="${v(p().descriptionPlaceholder)}">${q(n?.description||"")}</textarea>
          </div>
          ${o}
          ${i}
          <div class="bd-evidence-block">
            <div class="bd-evidence-row">
              ${qc(t,n)}
              ${_c()}
            </div>
            <input type="file" id="attachment-upload" accept="${li.join(",")}" multiple class="bd-upload-input" />
            <div id="attachment-list" class="bd-upload-list" aria-live="polite">${n?.attachments.length,""}</div>
            <p id="attachment-error" class="bd-field-error" hidden></p>
            ${Wc(t,n)}
          </div>
          <div class="bd-actions">
            <button type="button" class="bd-btn bd-btn-secondary" data-action="cancel">${v(p().cancel)}</button>
            <button type="submit" class="bd-btn bd-btn-primary" id="submit-btn">${t.screenshotMode==="auto"?v(p().submit):v(p().continueButton)}</button>
          </div>
        </form>
      `),s=a.querySelector("#feedback-form"),l=a.querySelector("#name"),d=a.querySelector("#email"),c=a.querySelector("#title"),u=a.querySelector("#description"),m=a.querySelector("#include-screenshot"),x=a.querySelector("#attachment-upload"),y=a.querySelector('[data-action="choose-uploads"]'),f=a.querySelector("#attachment-list"),S=a.querySelector("#attachment-error"),F=a.querySelector("#send-console-logs"),R=a.querySelector(".bd-close"),M=a.querySelector('[data-action="cancel"]'),T=[...n?.attachments??[]],D=()=>{a.remove(),r(null)};R?.addEventListener("click",D),M?.addEventListener("click",D),s.addEventListener("submit",L=>{if(L.preventDefault(),!c.value.trim()){c.classList.add("bd-input--error"),c.focus();return}if(t.requireName&&l&&!l.value.trim()){l.classList.add("bd-input--error"),l.focus();return}if(t.requireEmail&&d&&!d.value.trim()){d.classList.add("bd-input--error"),d.focus();return}let I=a.querySelector('input[name="category"]:checked')?.value||"bug",$=t.screenshotMode==="optional"?m?.checked??!1:!0;t.screenshotMode==="optional"&&$&&Pc(t.repo),a.remove(),r({title:c.value.trim(),description:u.value.trim(),category:I,name:l?.value.trim()||void 0,email:d?.value.trim()||void 0,includeScreenshot:$,attachments:T,sendConsoleLogs:F.checked})}),c.addEventListener("input",()=>c.classList.remove("bd-input--error")),l?.addEventListener("input",()=>l.classList.remove("bd-input--error")),d?.addEventListener("input",()=>d.classList.remove("bd-input--error"));let w=()=>{Vc(f,T,L=>{T=T.filter((z,I)=>I!==L),w()})};y.addEventListener("click",()=>x.click()),x.addEventListener("change",async()=>{let L=Array.from(x.files??[]);x.value="",S.textContent="",S.hidden=!0;let z=ti-T.length;if(L.length>z){Sn(S,p().uploadTooMany(ti));return}for(let I of L){let $=Hc(I);if($){Sn(S,$);return}}try{let I=await Promise.all(L.map(Uc));T=[...T,...I],w()}catch{Sn(S,p().uploadReadError)}}),w()})}function _c(){return`
    <div class="bd-upload-group">
      <div class="bd-upload-row" aria-label="${v(p().uploadsAriaLabel)}">
        <button type="button" class="bd-btn bd-btn-secondary bd-upload-button" data-action="choose-uploads" aria-label="${v(p().uploadFilesAriaLabel)}">
          <svg class="bd-upload-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M8 11V3" />
            <path d="M4.5 6.5 8 3l3.5 3.5" />
            <path d="M3 12.5h10" />
          </svg>
          ${v(p().uploadButton)}
        </button>
      </div>
    </div>
  `}function Hc(e){return li.includes(e.type)?e.size>ni?p().uploadTooLarge(zi(ni)):null:p().uploadUnsupportedType}function Sn(e,t){e.textContent=t,e.hidden=!1}function Vc(e,t,n){e.innerHTML=t.map((r,o)=>`
        <div class="bd-upload-item">
          <span class="bd-upload-item__name">${q(r.name)}</span>
          <span class="bd-upload-item__meta">${zi(r.size)}</span>
          <button type="button" class="bd-upload-remove" data-index="${o}" aria-label="${v(p().removeAttachmentAriaLabel(r.name))}">&times;</button>
        </div>
      `).join(""),e.querySelectorAll(".bd-upload-remove").forEach(r=>{r.addEventListener("click",()=>{let o=Number(r.dataset.index);Number.isInteger(o)&&n(o)})})}function Uc(e){return new Promise((t,n)=>{let r=new FileReader;r.addEventListener("load",()=>{if(typeof r.result!="string"){n(new Error("Could not read file."));return}t({name:e.name,type:e.type,size:e.size,dataUrl:r.result})}),r.addEventListener("error",()=>n(new Error("Could not read file."))),r.readAsDataURL(e)})}function zi(e){return e<1024?`${e} B`:e<1024*1024?`${Math.round(e/1024)} KB`:`${Math.round(e/(1024*1024)*10)/10} MB`}function qc(e,t){if(e.screenshotMode==="auto"){let r=Me()>0?` ${v(p().screenshotAutoRedactionNote)}`:"";return`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${v(p().screenshotAutoNote)}${r}
      </p>
    `}return e.screenshotMode==="required"?`
      <p style="margin: 8px 0 0; color: var(--bd-text-secondary); font-size: 0.95rem;">
        ${v(p().screenshotRequiredNote)}
      </p>
    `:`
    <div class="bd-screenshot-control">
      <input type="checkbox" id="include-screenshot" ${t?.includeScreenshot??(!ne()||!Fc(e.repo))?"checked":""} class="bd-checkbox" />
      <label for="include-screenshot" class="bd-checkbox-label">
        ${v(p().includeScreenshotLabel)}
      </label>
    </div>
  `}function Wc(e,t){return`
    <div class="bd-form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
      <input type="checkbox" id="send-console-logs" ${t?.sendConsoleLogs??e.sendConsoleLogs?"checked":""} style="width: 18px; height: 18px; accent-color: var(--bd-primary); cursor: pointer;" />
      <label for="send-console-logs" style="font-size: 0.95rem; color: var(--bd-text-secondary); cursor: pointer; user-select: none;">
        ${v(p().sendConsoleLogsLabel)}
      </label>
    </div>
  `}function Cn(e,t){return(e?.category||"bug")===t?"checked":""}async function Dn(e,t,n){let r=V(e,p().submittingTitle,`
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <div class="bd-spinner bd-spinner--lg"></div>
        <p class="bd-loading-text" style="margin-top: 12px;">${v(p().creatingIssue)}</p>
      </div>
    `);try{let o=n.name||n.email?{name:n.name,email:n.email}:void 0,i=Cc(),a=Re(),s=n.sendConsoleLogs?Pt():void 0,l=await fetch(`${t.apiUrl}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",...await he(t.authTokenProvider)},body:JSON.stringify({repo:t.repo,title:n.title,description:n.description,category:n.category,categoryLabels:t.categoryLabels,screenshot:n.screenshot,attachments:n.attachments,consoleLogs:s,submitter:o,metadata:{url:i.url,userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},timestamp:new Date().toISOString(),elementSelector:n.elementSelector,fullElementSelector:n.fullElementSelector,selectedElementHighlightColor:n.selectedElementHighlightColor||void 0,domNodeCount:a,fullPageDisabled:ne(),browser:i.browser,os:i.os,devicePixelRatio:i.devicePixelRatio,language:i.language}})});if(r.remove(),l.status===429){let c=l.headers.get("Retry-After"),u=c?Math.ceil(parseInt(c,10)/60):15;Tn(e,t,n,p().rateLimited(u));return}let d=await l.json();d.success?await Dr(e,d.issueNumber,d.issueUrl,d.isPublic??!1,t.issueLinkVisibility):Tn(e,t,n,d.error||p().submitFailedFallback)}catch{r.remove(),Tn(e,t,n,p().networkError)}}function Tn(e,t,n,r){let o=V(e,p().submissionFailedTitle,`
      <div class="bd-error-message">
        <svg class="bd-error-message__icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-9.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5.5zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
        <span class="bd-error-message__text">${q(r)}</span>
      </div>
      <div class="bd-actions">
        <button class="bd-btn bd-btn-secondary" data-action="cancel">${v(p().cancel)}</button>
        <button class="bd-btn bd-btn-primary" data-action="retry">${v(p().tryAgain)}</button>
      </div>
    `,!0),i=o.querySelector(".bd-close"),a=o.querySelector('[data-action="cancel"]'),s=o.querySelector('[data-action="retry"]');i?.addEventListener("click",()=>o.remove()),a?.addEventListener("click",()=>o.remove()),s?.addEventListener("click",async()=>{o.remove(),await Dn(e,t,n)})}})();
