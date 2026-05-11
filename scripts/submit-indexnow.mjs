const key = "9e9b2f84b7c74e7c95ff41b4d1a4d10f";
const host = "bugdrop.dev";
const keyLocation = `https://${host}/${key}.txt`;

const sitemap = await fetch(`https://${host}/sitemap.xml`).then((response) => {
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }
  return response.text();
});

const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const response = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow.`);
