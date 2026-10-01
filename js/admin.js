// =====================================================
// ADMIN PAGE SCRIPT
// Runs only on the hidden admin page. You sign in with your
// Supabase email and password, then edit services, team,
// portfolio, FAQ and reviews (including photos).
// Files used: config.js, js/content.js (default content), this file.
// =====================================================

// ---------- 1. SETUP ----------

// Supabase connection (the URL and key come from config.js).
var CFG = window.BL_CFG || {};
var SB = (CFG.url && CFG.anon && window.supabase)
    ? window.supabase.createClient(CFG.url, CFG.anon)
    : null;

// $ = short for "find one element on the page".
var $ = function (selector) { return document.querySelector(selector); };

// Tailwind class lists used again and again below.
var INPUT = 'w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900';
var CARD = 'rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900';
var BTN = 'inline-block rounded-full bg-neutral-900 px-7 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-pink-600 dark:bg-white dark:text-black dark:hover:bg-pink-400';
var BTN_LINE = 'inline-block rounded-full border border-neutral-900 px-7 py-3.5 text-center text-sm font-bold uppercase tracking-wide hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:hover:bg-white dark:hover:text-black';
var MUTED = 'text-neutral-600 dark:text-neutral-400';

// The tabs on the admin page.
var TABS = {
    services: 'Services',
    team: 'Team',
    portfolio: 'Portfolio',
    faq: 'FAQ and aftercare',
    reviews: 'Reviews'
};

// Form fields for each kind of content, as [key, label, type].
// type: ''  = one-line text box        '*'      = big text box
//       'a|b|c' = dropdown             'photo'  = one photo
//       'photos' = 1 to 5 photos
// To add a new field to the website, add it here and show it in js/script.js.
var PICTURE_STYLES = 'lotus|foot|stones|tattoo|ring|reiki|chair|waves';
var FIELDS = {
    services: [
        ['n', 'Name', ''],
        ['c', 'Category', 'Massage|Tattoo|Piercing'],
        ['p', 'Price (for example $85)', ''],
        ['t', 'Duration (for example 60 min)', ''],
        ['k', 'Picture style (used when there is no photo)', PICTURE_STYLES],
        ['img', 'Photo', 'photo'],
        ['b', 'Badge (optional)', ''],
        ['d', 'Description', '*']
    ],
    team: [
        ['name', 'Name', ''],
        ['role', 'Role', ''],
        ['img', 'Photo', 'photo'],
        ['tags', 'Specialties, separated by commas', ''],
        ['bio', 'Bio', '*']
    ],
    portfolio: [
        ['title', 'Title', ''],
        ['cat', 'Category', 'Tattoo|Massage|Reiki'],
        ['k', 'Picture style (used when there is no photo)', PICTURE_STYLES],
        ['imgs', 'Photos (1 to 5)', 'photos'],
        ['note', 'Note', '*']
    ],
    faq: [
        ['g', 'Section', 'FAQ|Tattoo aftercare|Massage aftercare'],
        ['q', 'Question', ''],
        ['a', 'Answer', '*']
    ],
    reviews: [
        ['name', 'Name', ''],
        ['rating', 'Rating', '5|4|3|2|1'],
        ['visible', 'Shown on the website', 'Yes|No'],
        ['text', 'Comment', '*']
    ]
};

// ---------- 2. STATE (what the page remembers) ----------

var DATA = JSON.parse(JSON.stringify(SEED));   // working copy of the content
DATA.reviews = DATA.reviews || [];
var session = null;          // the signed-in user, or null
var tab = 'services';        // the tab currently shown
var openIndex = -1;          // which item is expanded
var removedReviews = [];     // ids of reviews deleted since the last save

// The parts of DATA kept in the Supabase table site_content (reviews have their own table).
var CONTENT_KEYS = ['services', 'team', 'portfolio', 'faq', 'heroImg'];

// ---------- 3. SMALL HELPERS ----------

// esc(text): makes typed text safe to put inside HTML.
function esc(text) {
    return String(text == null ? '' : text).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
}

// toast(message): small pop-up message at the bottom of the screen.
function toast(message) {
    var box = $('#toast');
    box.textContent = message;
    box.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { box.classList.add('hidden'); }, 6000);
}

// shrinkPhoto(file): resize a photo to 900px at most and compress it as JPEG.
function shrinkPhoto(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onload = function () {
            var img = new Image();
            img.onerror = reject;
            img.onload = function () {
                var scale = Math.min(1, 900 / Math.max(img.width, img.height));
                var canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(function (blob) { resolve(blob); }, 'image/jpeg', 0.75);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

// uploadPhoto(blob): upload one photo to the "site-media" bucket and return its public link.
async function uploadPhoto(blob) {
    var name = 'img/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.jpg';
    var result = await SB.storage.from('site-media').upload(name, blob, { contentType: 'image/jpeg' });
    if (result.error) throw result.error;
    return SB.storage.from('site-media').getPublicUrl(name).data.publicUrl;
}

// ---------- 4. SUPABASE: LOAD AND SAVE ----------

// loadFromSupabase(): get the saved content and every review (including hidden ones).
async function loadFromSupabase() {
    var content = await SB.from('site_content').select('data').eq('id', 1).maybeSingle();
    if (content.data && content.data.data) {
        CONTENT_KEYS.forEach(function (key) {
            if (content.data.data[key] != null) DATA[key] = content.data.data[key];
        });
    }
    var rows = await SB.from('reviews').select('*').order('created_at', { ascending: false });
    if (rows.data) {
        DATA.reviews = rows.data.map(function (r) {
            return { id: r.id, name: r.name, rating: String(r.rating), text: r.text, visible: r.visible ? 'Yes' : 'No' };
        });
    }
}

// saveToSupabase(): store the content, then add, update and delete reviews.
async function saveToSupabase() {
    var content = {};
    CONTENT_KEYS.forEach(function (key) { content[key] = DATA[key]; });
    var saved = await SB.from('site_content').upsert({ id: 1, data: content });
    if (saved.error) throw saved.error;

    for (var i = 0; i < DATA.reviews.length; i++) {
        var review = DATA.reviews[i];
        var row = { name: review.name, rating: Number(review.rating) || 5, text: review.text, visible: review.visible !== 'No' };
        if (review.id) {
            var updated = await SB.from('reviews').update(row).eq('id', review.id);
            if (updated.error) throw updated.error;
        } else {
            var added = await SB.from('reviews').insert(row).select().single();
            if (added.error) throw added.error;
            review.id = added.data.id;
        }
    }
    for (var j = 0; j < removedReviews.length; j++) {
        var removed = await SB.from('reviews').delete().eq('id', removedReviews[j]);
        if (removed.error) throw removed.error;
    }
    removedReviews = [];
}

// ---------- 5. DRAWING THE PAGE ----------

// render(): show the login form or the editor, depending on whether you are signed in.
function render() {
    var box = $('#admin');
    if (!SB) {
        box.innerHTML = '<div class="' + CARD + '"><h1 class="text-2xl font-extrabold uppercase">Supabase is not connected</h1>'
            + '<p class="mt-2 ' + MUTED + '">Add your project URL and anon key to config.js, then reload this page.</p></div>';
    } else {
        box.innerHTML = session ? editorHTML() : loginHTML();
    }
}

// loginHTML(): the sign-in form.
function loginHTML() {
    return '<h1 class="mb-6 text-3xl font-extrabold uppercase">Staff login</h1>'
        + '<form id="login" class="' + CARD + ' mx-auto grid max-w-md gap-4">'
        + '<div><label for="email" class="mb-1 block text-sm font-bold">Email</label>'
        + '<input id="email" name="email" type="email" required autocomplete="username" class="' + INPUT + '"></div>'
        + '<div><label for="password" class="mb-1 block text-sm font-bold">Password</label>'
        + '<input id="password" name="password" type="password" required autocomplete="current-password" class="' + INPUT + '"></div>'
        + '<p id="login-error" class="text-sm text-red-600" role="alert"></p>'
        + '<button class="' + BTN + '" type="submit">Sign in</button></form>';
}

// editorHTML(): tabs, the list of items for the current tab, and the buttons.
function editorHTML() {
    var tabButtons = Object.keys(TABS).map(function (key) {
        var active = key === tab ? 'border-pink-600 bg-pink-600 text-white' : 'border-neutral-300 dark:border-neutral-700';
        return '<button data-action="tab" data-tab="' + key + '" class="rounded-full border px-5 py-2 text-sm font-bold uppercase ' + active + '">' + TABS[key] + '</button>';
    }).join('');

    var items = DATA[tab].map(function (item, index) {
        var title = item.n || item.name || item.title || item.q || 'New item';
        var fields = FIELDS[tab].map(function (field) { return fieldHTML(index, field, item[field[0]]); }).join('');
        return '<details class="' + CARD + '"' + (index === openIndex ? ' open' : '') + '>'
            + '<summary class="cursor-pointer font-bold">' + esc(title) + '</summary>'
            + '<div class="mt-4 grid gap-4 sm:grid-cols-2">' + fields + '</div>'
            + '<button data-action="delete" data-index="' + index + '" class="mt-4 text-sm font-bold text-red-600 underline">Delete this item</button>'
            + '</details>';
    }).join('');

    return '<div class="mb-6 flex flex-wrap items-center justify-between gap-3">'
        + '<h1 class="text-3xl font-extrabold uppercase">Edit your site</h1>'
        + '<div class="flex gap-4 text-sm font-bold"><a class="underline" href="index.html" target="_blank">View site</a>'
        + '<button data-action="signout" class="underline">Sign out</button></div></div>'
        + '<p class="mb-6 text-sm ' + MUTED + '">Nothing goes live until you press Save changes. Reload this page to undo unsaved edits.</p>'
        + '<div class="mb-6 flex flex-wrap gap-2">' + tabButtons + '</div>'
        + '<div class="space-y-4">' + items + '</div>'
        + '<div class="mt-6 flex flex-wrap items-center gap-3">'
        + '<button data-action="add" class="' + BTN_LINE + '">Add new</button>'
        + '<button data-action="save" class="' + BTN + '">Save changes</button>'
        + '<span id="status" class="text-sm ' + MUTED + '" role="status"></span></div>';
}

// fieldHTML(index, field, value): one form control (text box, dropdown, photo upload ...).
function fieldHTML(index, field, value) {
    var key = field[0], label = field[1], type = field[2];
    var attrs = ' data-index="' + index + '" data-key="' + key + '"';   // tells the listeners which value this is
    var control, wide = '';

    if (type === 'photos') {
        var photos = value || [];
        control = '<div class="flex flex-wrap gap-2">' + photos.map(function (url, n) {
            return '<div class="relative"><img src="' + url + '" alt="" class="h-20 w-20 rounded-xl object-cover">'
                + '<button type="button" data-action="remove-photo" data-index="' + index + '" data-n="' + n + '" aria-label="Remove photo" '
                + 'class="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 text-sm text-white">x</button></div>';
        }).join('') + '</div>'
            + '<p class="my-2 text-xs ' + MUTED + '">' + photos.length + ' of 5 photos. At least 1 is required.</p>'
            + (photos.length < 5 ? '<input type="file" multiple accept="image/*"' + attrs + ' class="w-full text-sm">' : '');
    } else if (type === 'photo') {
        control = (value
            ? '<img src="' + value + '" alt="" class="mb-2 h-20 w-20 rounded-xl object-cover">'
              + '<button type="button" data-action="clear-photo"' + attrs + ' class="mb-2 block text-sm underline">Remove photo</button>'
            : '')
            + '<input type="file" accept="image/*"' + attrs + ' class="w-full text-sm">';
    } else if (type === '*') {
        control = '<textarea rows="4" class="' + INPUT + '"' + attrs + '>' + esc(value) + '</textarea>';
        wide = ' class="sm:col-span-2"';
    } else if (type) {
        control = '<select class="' + INPUT + '"' + attrs + '>' + type.split('|').map(function (option) {
            return '<option' + (option === String(value) ? ' selected' : '') + '>' + option + '</option>';
        }).join('') + '</select>';
    } else {
        control = '<input class="' + INPUT + '" value="' + esc(value) + '"' + attrs + '>';
    }
    return '<div' + wide + '><label class="mb-1 block text-sm font-bold">' + label + '</label>' + control + '</div>';
}

// ---------- 6. SAVING ----------

// save(): check every portfolio item has 1 to 5 photos, then save to Supabase.
async function save() {
    var status = $('#status');
    var missing = DATA.portfolio.filter(function (p) { return !(p.imgs && p.imgs.length); })[0];
    if (missing) {
        status.textContent = 'Add 1 to 5 photos to "' + (missing.title || 'Untitled') + '" before saving.';
        return;
    }
    status.textContent = 'Saving...';
    try {
        await saveToSupabase();
        status.textContent = 'Saved. Your changes are live.';
    } catch (error) {
        status.textContent = 'Could not save: ' + (error.message || 'unknown error');
    }
}

// ---------- 7. EVENT LISTENERS ----------

// Buttons: change tab, add, delete, remove photos, save, sign out.
document.addEventListener('click', async function (e) {
    var button = e.target.closest('[data-action]');
    if (!button) return;
    var action = button.dataset.action;
    var list = DATA[tab];

    if (action === 'save') return save();                 // saving does not redraw the page
    if (action === 'signout') { await SB.auth.signOut(); return; }

    if (action === 'tab') {
        tab = button.dataset.tab;
        openIndex = -1;
    } else if (action === 'add') {
        var blank = {};
        FIELDS[tab].forEach(function (f) {                // start every field empty (dropdowns start on their first option)
            blank[f[0]] = (f[2] && f[2] !== '*' && f[2] !== 'photo' && f[2] !== 'photos') ? f[2].split('|')[0] : '';
        });
        list.push(blank);
        openIndex = list.length - 1;
    } else if (action === 'delete') {
        var gone = list.splice(Number(button.dataset.index), 1)[0];
        if (tab === 'reviews' && gone && gone.id) removedReviews.push(gone.id);
        openIndex = -1;
    } else if (action === 'remove-photo') {
        list[Number(button.dataset.index)].imgs.splice(Number(button.dataset.n), 1);
        openIndex = Number(button.dataset.index);
    } else if (action === 'clear-photo') {
        delete list[Number(button.dataset.index)][button.dataset.key];
        openIndex = Number(button.dataset.index);
    }
    render();
});

// Text boxes and dropdowns: copy what you type into DATA. Photos are handled separately.
function copyValue(e) {
    var d = e.target.dataset;
    if (d.key && e.target.type !== 'file') DATA[tab][Number(d.index)][d.key] = e.target.value;
}
document.addEventListener('input', copyValue);
document.addEventListener('change', copyValue);

// Photo upload: shrink each photo, upload it, and add it to the item (max 5 for portfolio items).
document.addEventListener('change', async function (e) {
    var input = e.target;
    if (input.type !== 'file' || !input.files.length) return;
    var item = DATA[tab][Number(input.dataset.index)];
    var key = input.dataset.key;
    var files = Array.prototype.slice.call(input.files);

    if (input.multiple) {
        var room = 5 - (item[key] || []).length;
        if (files.length > room) toast('Only 5 photos are allowed per item.');
        files = files.slice(0, room);
    } else {
        files = files.slice(0, 1);
    }

    toast('Uploading...');
    try {
        for (var i = 0; i < files.length; i++) {
            var url = await uploadPhoto(await shrinkPhoto(files[i]));
            if (input.multiple) (item[key] = item[key] || []).push(url);
            else item[key] = url;
        }
        toast('Photos added. Press Save changes to publish them.');
    } catch (error) {
        toast('Upload failed. Check that you are signed in and the site-media bucket exists.');
    }
    openIndex = Number(input.dataset.index);
    render();
});

// Login form.
document.addEventListener('submit', async function (e) {
    if (e.target.id !== 'login') return;
    e.preventDefault();
    var result = await SB.auth.signInWithPassword({
        email: e.target.elements.email.value.trim(),
        password: e.target.elements.password.value
    });
    if (result.error) {
        $('#login-error').textContent = 'Incorrect email or password.';
        return;
    }
    session = result.data.session;
    try { await loadFromSupabase(); } catch (error) {}
    render();
});

// ---------- 8. START ----------

if (SB) {
    // If you are already signed in from earlier, go straight to the editor.
    SB.auth.getSession().then(async function (r) {
        session = r.data.session;
        if (session) { try { await loadFromSupabase(); } catch (error) {} }
        render();
    });
    // Signing out (here or in another tab) brings back the login form.
    SB.auth.onAuthStateChange(function (event, s) {
        session = s;
        if (event === 'SIGNED_OUT') render();
    });
} else {
    render();
}
