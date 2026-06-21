/* ============================================
   ATLAS — shared data layer (localStorage-backed)
   NOTE: this is a client-only demo persistence layer.
   Data lives in the admin's browser, not a real server.
   ============================================ */

const STORE_POSTS = "atlas_posts_v1";
const STORE_RELEASES = "atlas_releases_v1";
const ADMIN_FLAG = "atlas_admin_session";

/* ---------- seed content (only runs once) ---------- */
function seedIfEmpty(){
  if(!localStorage.getItem(STORE_POSTS)){
    const seedPosts = [
      {
        id: "p3",
        title: "Why Atlas reads like a sentence, not a spell",
        date: "2026-06-14",
        tags: ["philosophy"],
        excerpt: "Every language claims to be 'simple.' Most just mean 'fewer symbols.' Atlas means something stricter: if you can say it, you can write it.",
        body: `Most "beginner-friendly" languages are really just other languages with the scary parts hidden behind a tutorial. Atlas takes a different stance: the syntax itself should read like an instruction you'd give a person.\n\nThat's why Atlas doesn't have a print() function. It has write. You're not calling a method on a console object, you're writing something down. Compare:\n\n<pre class="code-block"><span class="kw">write</span> <span class="str">"hello world"</span></pre>\n\nto the ceremony most languages demand just to get text on a screen. Atlas's whole design philosophy is built around removing ceremony without removing power. Background colors, app scaffolding, and file drafting all follow the same rule: name the thing, then say what it should be.\n\nMore on the grammar of Atlas next week — including how draftHTML actually assembles a real index.html behind the scenes.`
      },
      {
        id: "p2",
        title: "createApp, appName, draftHTML: scaffolding without the boilerplate",
        date: "2026-06-08",
        tags: ["syntax", "tutorial"],
        excerpt: "A look at Atlas's project scaffolding block — three lines instead of a folder structure tutorial.",
        body: `Starting a new project in most stacks means either running a CLI you have to memorize, or copy-pasting a folder structure from last time. Atlas treats project setup as just... three sentences:\n\n<pre class="code-block"><span class="kw">createApp</span> <span class="str">".atlas"</span>\n<span class="kw">appName</span> <span class="str">"AtlasDemo"</span>\n<span class="kw">draftHTML</span> <span class="str">"index.html"</span></pre>\n\ncreateApp tells the compiler what kind of project root you want. appName labels it — this becomes your folder name and your window title if you're building something with a UI. draftHTML is the part people ask about most: it scaffolds a real, valid index.html, pre-wired to whatever Atlas writes for you elsewhere in the file.\n\nNo package.json interview. No "select a template" wizard. You say what you want, Atlas drafts it.`
      },
      {
        id: "p1",
        title: "Introducing Atlas",
        date: "2026-05-30",
        tags: ["announcement"],
        excerpt: "The most straightforward coding language in the world, built for people who think in instructions, not syntax trees.",
        body: `I've spent the last few months building a language with one rule: if a sentence makes sense out loud, it should make sense to the compiler.\n\nAtlas is what happens when you ask "what if writing code felt like writing a list of instructions for a very literal friend?" No semicolon hunting. No bracket matching. Just plain commands:\n\n<pre class="code-block"><span class="kw">write</span> <span class="str">"hello world"</span>\n<span class="kw">background</span> <span class="str">#0000</span></pre>\n\nThat's a real, complete Atlas program. It writes text and sets a background. That's it. No main function, no imports, no boilerplate tax just to get started.\n\nThe IDE is coming soon. Until then, this blog is where I'll be documenting syntax decisions, design parameters, and the occasional argument I lost with myself about semicolons (there are none, I won).`
      }
    ];
    localStorage.setItem(STORE_POSTS, JSON.stringify(seedPosts));
  }

  if(!localStorage.getItem(STORE_RELEASES)){
    const seedReleases = [
      {
        id: "r1",
        version: "0.1.0-alpha",
        date: "2026-06-01",
        notes: "First public alpha. Core grammar: write, background, createApp, appName, draftHTML. No IDE yet — CLI only.",
        filename: "atlas-0.1.0-alpha.zip",
        sizeLabel: "4.2 MB",
        dataUrl: null
      }
    ];
    localStorage.setItem(STORE_RELEASES, JSON.stringify(seedReleases));
  }
}
seedIfEmpty();

/* ---------- generic helpers ---------- */
function getPosts(){ return JSON.parse(localStorage.getItem(STORE_POSTS) || "[]"); }
function savePosts(arr){ localStorage.setItem(STORE_POSTS, JSON.stringify(arr)); }
function getReleases(){ return JSON.parse(localStorage.getItem(STORE_RELEASES) || "[]"); }
function saveReleases(arr){ localStorage.setItem(STORE_RELEASES, JSON.stringify(arr)); }

function fmtDate(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
}

function uid(prefix){ return prefix + "_" + Math.random().toString(36).slice(2,9); }

/* ---------- admin session (client-side demo gate only) ---------- */
const ADMIN_PASSWORD = "atlas-admin"; // demo-only, change freely in this file

function isAdmin(){ return sessionStorage.getItem(ADMIN_FLAG) === "1"; }
function loginAdmin(pw){
  if(pw === ADMIN_PASSWORD){ sessionStorage.setItem(ADMIN_FLAG, "1"); return true; }
  return false;
}
function logoutAdmin(){ sessionStorage.removeItem(ADMIN_FLAG); }

/* ---------- active nav highlighting ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".dock-link").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
});
