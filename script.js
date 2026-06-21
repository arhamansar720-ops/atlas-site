/* ============================================
   ATLAS — Supabase-backed data layer
   Real database, real auth, real file storage.
   ============================================ */

const SUPABASE_URL = "https://juvxjcbnpmzboaempqwi.supabase.co";
const SUPABASE_KEY = "sb_publishable_PaBgDBCRUE0Y6355cofiSw_ViSHx2LL";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------- posts ---------- */
async function getPosts(){
  const { data, error } = await sb.from('posts').select('*').order('date', { ascending: false });
  if(error){ console.error(error); return []; }
  return data;
}

async function getPostById(id){
  const { data, error } = await sb.from('posts').select('*').eq('id', id).single();
  if(error) return null;
  return data;
}

async function upsertPost(post){
  const { error } = await sb.from('posts').upsert(post);
  if(error){ alert("Couldn't save post: " + error.message); return false; }
  return true;
}

async function deletePostById(id){
  const { error } = await sb.from('posts').delete().eq('id', id);
  if(error){ alert("Couldn't delete post: " + error.message); return false; }
  return true;
}

/* ---------- releases ---------- */
async function getReleases(){
  const { data, error } = await sb.from('releases').select('*').order('date', { ascending: false });
  if(error){ console.error(error); return []; }
  return data;
}

async function upsertRelease(release){
  const { error } = await sb.from('releases').upsert(release);
  if(error){ alert("Couldn't save release: " + error.message); return false; }
  return true;
}

async function deleteReleaseById(id, filePath){
  if(filePath){ await sb.storage.from('releases').remove([filePath]); }
  const { error } = await sb.from('releases').delete().eq('id', id);
  if(error){ alert("Couldn't delete release: " + error.message); return false; }
  return true;
}

/* uploads a file to the 'releases' storage bucket, returns its storage path */
async function uploadReleaseFile(file){
  const path = `${Date.now()}-${file.name}`;
  const { error } = await sb.storage.from('releases').upload(path, file);
  if(error){ alert("Upload failed: " + error.message); return null; }
  return path;
}

function getReleaseFileUrl(path){
  if(!path) return null;
  return sb.storage.from('releases').getPublicUrl(path).data.publicUrl;
}

/* ---------- admin auth (real Supabase auth) ---------- */
async function isAdmin(){
  const { data } = await sb.auth.getSession();
  return !!data.session;
}

async function loginAdmin(email, password){
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return !error;
}

async function logoutAdmin(){
  await sb.auth.signOut();
}

/* ---------- helpers ---------- */
function fmtDate(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
}

function uid(prefix){ return prefix + "_" + Math.random().toString(36).slice(2,9); }

/* ---------- active nav highlighting ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".dock-link").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
});
