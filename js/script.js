// =====================================================
// BLACK LOTUS SITE: main program
// Everything the browser runs is in this file, in this order:
//   1 settings and helpers      2 pictures and default content
//   3 public pages              4 Supabase (read-only)
//   5 forms, reviews and chat   6 router, menu, theme and event listeners  =====================================================

// ---------- 1. SETTINGS AND HELPERS ----------
// Shop phone, email and WhatsApp number (change them here). $ is short for "find one element on the page".
var PH = '+2349056456374',
    PHD = '+234 905 645 6374',
    MAIL = 'divineoghenemaro8@gmail.com',
    WA = '2349056456374',
    $ = function (s) { return document.querySelector(s) };

// Tailwind class lists we reuse: EY = small pink label, H2 = big heading, B1 / B2 = filled / outline button,
// INP = form field, CARD = white box, MUT = grey text.
var EY = 'mb-2 text-sm font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400',
    H2 = 'mb-4 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl',
    B1 = 'inline-block rounded-full bg-neutral-900 px-7 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-pink-600 dark:bg-white dark:text-black dark:hover:bg-pink-400',
    B2 = 'inline-block rounded-full border border-neutral-900 px-7 py-3.5 text-center text-sm font-bold uppercase tracking-wide hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:hover:bg-white dark:hover:text-black',
    INP = 'w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900',
    CARD = 'rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900',
    MUT = 'text-neutral-600 dark:text-neutral-400';

// Simple line icons. Each value is the inside of an SVG drawing.
var I = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    chk: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 16l2 2 4-4"/>',
    door: '<path d="M13 4.6v15.9a1 1 0 0 1-1.2 1L5 20V5.6a2 2 0 0 1 1.5-1.9l4-1A2 2 0 0 1 13 4.6z"/><path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'
};

// ic(name, size) returns a ready-to-use SVG icon.
function ic(k, c) {
    return '<svg viewBox="0 0 24 24" class="' + (c || 'h-5 w-5') + ' fill-none stroke-current" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + I[k] + '</svg>'
}

// ---------- 2. PICTURES AND DEFAULT CONTENT ----------
// Service pictures are drawn with SVG (outside photos cannot load on this page). C = background colors.
var C = {
    lotus: ['#2a1030', '#e0157f'],
    foot: ['#1b1b2f', '#7a2fb0'],
    stones: ['#2b2017', '#c8632a'],
    tattoo: ['#0b0b0b', '#8a1c1c'],
    ring: ['#10202b', '#1aa6b7'],
    reiki: ['#1f1a3a', '#4b3fd0'],
    chair: ['#1c2a22', '#3a9d6e'],
    waves: ['#20202a', '#3d6cc9']
};

// P = the shapes drawn on top of each background.
var P = {
    lotus: '<g fill="#fff" fill-opacity=".85"><path d="M200 55c-25 30-25 62 0 90 25-28 25-60 0-90z"/><path d="M200 145c-45-5-75-30-85-62 30 0 65 15 85 62z" fill-opacity=".6"/><path d="M200 145c45-5 75-30 85-62-30 0-65 15-85 62z" fill-opacity=".6"/></g>',
    foot: '<g fill="#fff" fill-opacity=".85"><rect x="90" y="45" width="220" height="9" rx="4"/><path d="M180 54h40v48c0 22-9 40-20 40s-20-18-20-40z"/></g><rect x="60" y="165" width="280" height="12" rx="6" fill="#fff" fill-opacity=".3"/>',
    stones: '<g fill="#fff" fill-opacity=".85"><ellipse cx="200" cy="150" rx="72" ry="20"/><ellipse cx="200" cy="120" rx="52" ry="16" fill-opacity=".7"/><ellipse cx="200" cy="96" rx="32" ry="12" fill-opacity=".55"/></g>',
    tattoo: '<g fill="#fff" fill-opacity=".85"><rect x="160" y="40" width="80" height="72" rx="12"/><rect x="192" y="112" width="16" height="42"/><path d="M200 154l-5 26h10z"/></g><circle cx="200" cy="76" r="12" fill="#000" fill-opacity=".35"/>',
    ring: '<circle cx="200" cy="105" r="44" fill="none" stroke="#fff" stroke-width="10" stroke-opacity=".85"/><circle cx="247" cy="80" r="11" fill="#fff"/>',
    reiki: '<g fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="4"><circle cx="200" cy="100" r="20"/><circle cx="200" cy="100" r="44"/><circle cx="200" cy="100" r="70"/></g>',
    chair: '<g fill="#fff" fill-opacity=".85"><rect x="165" y="50" width="70" height="62" rx="10"/><rect x="148" y="112" width="104" height="22" rx="8"/><rect x="165" y="134" width="10" height="42"/><rect x="225" y="134" width="10" height="42"/></g>',
    waves: '<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M90 78q27-28 55 0t55 0 55 0 55 0" stroke-opacity=".85"/><path d="M90 115q27-28 55 0t55 0 55 0 55 0" stroke-opacity=".6"/><path d="M90 152q27-28 55 0t55 0 55 0 55 0" stroke-opacity=".4"/></g>'
};

// scene(name) returns a complete colored picture.
function scene(k) {
    var c = C[k];
    return '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" class="h-full w-full" role="img" aria-label="Illustration"><defs><linearGradient id="g'
        + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="'
        + c[1] + '"/></linearGradient></defs><rect width="400" height="200" fill="url(#g'
        + k + ')"/>' + P[k] + '</svg>'
}

// DATA = the live content. It starts as a copy of SEED (js/content.js); Supabase content replaces it when connected.
// S is a shortcut to the services list.
var DATA = JSON.parse(JSON.stringify(SEED)),
    S = DATA.services;

// Opening hours for the Visit and Contact sections.
var H = [
    ['Monday', 'Closed'],
    ['Tuesday', '4:30 PM to 8 PM'],
    ['Wednesday', '4:30 PM to 8 PM'],
    ['Thursday', '12 PM to 8 PM'],
    ['Friday', '12 PM to 8 PM'],
    ['Saturday', '12 PM to 8 PM'],
    ['Sunday', 'Closed']
];

// F = service category selected on the Services page. (REVIEWS is old and unused.)
var REVIEWS = [];

var F = 'All';

// ---------- 3. PUBLIC PAGES ----------
// W(html) puts content inside a centered container.
function W(x, c) {
    return '<div class="mx-auto max-w-6xl px-5 ' + (c || 'py-14') + '">' + x + '</div>'
}

// card(service, index) builds one service box: picture, name, price, time and Select button.
function card(s, i) {
    return '<article class="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"><div class="relative h-44">'
        + pic(s) + (s.b ? '<span class="absolute left-3 top-3 rounded-full bg-pink-200 px-3 py-1 text-xs font-bold uppercase text-black">'
        + esc(s.b) + '</span>' : '') + '</div><div class="flex flex-1 flex-col p-6"><h3 class="text-xl font-extrabold uppercase leading-tight tracking-tight">'
        + esc(s.n) + '</h3><p class="mt-2 flex-1 text-sm ' + MUT + '">' + esc(s.d) + '</p><div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-neutral-200 pt-4 dark:border-neutral-800"><span class="'
        + (s.p ? 'text-xl' : 'text-sm') + ' font-extrabold">' + esc(s.p || 'Ask for pricing')
        + '</span>' + (s.t ? '<span class="flex items-center gap-1 text-sm font-bold uppercase '
        + MUT + '">' + ic('clock', 'h-4 w-4') + esc(s.t) + '</span>' : '') + '</div><a href="#/booking?s='
        + i + '" class="' + B2 + ' mt-4">Select</a></div></article>'
}

// row([day, hours]) builds one line of the opening hours list.
function row(r) {
    return '<div class="flex justify-between gap-4 border-b border-neutral-200 py-3 text-sm font-medium uppercase dark:border-neutral-800"><span>'
        + r[0] + '</span><span class="' + (r[1] === 'Closed' ? MUT : '') + '">' + r[1] + '</span></div>'
}

// field(label, id, type, extra) builds one labelled form input.
function field(l, id, t, x) {
    return '<div><label for="' + id + '" class="mb-1 block text-sm font-bold">' + l + '</label><input id="'
        + id + '" name="' + id + '" type="' + (t || 'text') + '" class="' + INP + '" ' + (x || '')
        + '></div>'
}

// R is a list of page sections. R.hero() returns the HTML of the hero, and so on.
var R = {};

// HERO: welcome section with background, buttons and the two info boxes.
R.hero = function () {
    return '<div class="relative overflow-hidden bg-neutral-950 text-center text-white"><div class="absolute inset-0" aria-hidden="true">'
        + heroBg() + '</div><div class="relative mx-auto max-w-2xl px-5 py-16 sm:py-24"><svg class="mx-auto mb-6 h-14 w-14" viewBox="0 0 56 56" fill="none" stroke="#bdbdbd" stroke-width="2"><path d="M28 4 44 30H12z"/><path d="M28 18 52 42H4z" opacity=".7"/><circle cx="28" cy="52" r="1.5" fill="#bdbdbd"/></svg><h1 class="text-4xl font-extrabold uppercase leading-none tracking-tighter sm:text-6xl">Black Lotus Tattoo and Massage</h1><p class="mt-4 font-serif text-2xl italic text-neutral-300">Tattoo and Massage</p><div class="mt-6 flex flex-col items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-300"><span class="flex items-center gap-2 rounded-full bg-neutral-800 px-5 py-2"><span class="text-pink-500">'
        + ic('pin', 'h-4 w-4') + '</span>Lexington, NC</span><span class="rounded-full bg-neutral-800 px-5 py-2">American traditional tattooing</span><span class="rounded-full bg-neutral-800 px-5 py-2">Ashiatsu and bodywork</span></div><div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"><a href="#/booking" class="w-full max-w-xs rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-black hover:bg-pink-200 sm:w-auto">Book now</a><a href="#/services" class="w-full max-w-xs rounded-full border border-neutral-600 px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 sm:w-auto">View all services</a></div><div class="mt-10 grid gap-3 border-t border-neutral-800 pt-8 text-left sm:grid-cols-2"><div class="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5"><span class="text-pink-500">'
        + ic('door', 'h-7 w-7') + '</span><div><b class="block uppercase">Tattoo walk-ins</b><span class="text-sm text-neutral-400">Thursday to Saturday, 12 PM to 8 PM</span></div></div><div class="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5"><span class="text-pink-500">'
        + ic('chk', 'h-7 w-7') + '</span><div><b class="block uppercase">Massage and Reiki</b><span class="text-sm text-neutral-400">By appointment only</span></div></div></div></div></div>'
};

// PEEK: the first three services, shown on the home page.
R.peek = function () {
    return W('<p class="' + EY + '">Our services</p><h2 class="' + H2 + '">A peek at what we offer</h2><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">'
        + S.slice(0, 3).map(function (x, i) { return card(x, i) }).join('') + '</div><div class="mt-8 text-center"><a href="#/services" class="'
        + B1 + '">View all services</a></div>')
};

// ABOUT (short version for the home page).
R.about = function () {
    return W('<div class="grid items-center gap-10 md:grid-cols-2"><div class="h-64 overflow-hidden rounded-3xl">'
        + scene('lotus') + '</div><div><p class="' + EY + '">About us</p><h2 class="' + H2
        + '">A safe space for creativity and healing</h2><p class="' + MUT + '">We are a licensed massage therapist and permitted tattoo artist team serving Lexington, NC and the surrounding areas. We work in partnership with every client who walks in. Both our artist and our therapist are trained in Reiki II.</p><a href="#/about" class="'
        + B2 + ' mt-6">Meet the team</a></div></div>')
};

// MESSAGES: notes from the team on the home page.
R.msg = function () {
    return W('<p class="' + EY + '">From the team</p><h2 class="' + H2 + '">Words from the people you will meet</h2><div class="grid gap-6 md:grid-cols-2"><div class="'
        + CARD + '"><div class="mb-4 flex items-center gap-3"><span class="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-pink-600 font-bold text-white">CB</span><div><b class="block">Chenoa Brown</b><span class="text-sm '
        + MUT + '">Licensed Massage and Bodywork Therapist</span></div></div><p class="font-serif italic '
        + MUT + '">My approach is mindful, client-centered, and trauma-informed. My work is slow and intentional, and my first goal is a safe, comfortable room that supports your nervous system while keeping your goals in mind.</p></div><div class="'
        + CARD + '"><div class="mb-4 flex items-center gap-3"><span class="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-neutral-900 font-bold text-white dark:bg-white dark:text-black">BL</span><div><b class="block">The Black Lotus team</b><span class="text-sm '
        + MUT + '">Tattoo and massage</span></div></div><p class="font-serif italic ' + MUT
        + '">We hope to give you a comfortable and safe space for creativity and healing. Reach out any time about your next tattoo or massage. We can be available outside posted hours by appointment. See you soon.</p></div></div>')
};

// REVIEWS: star reviews plus the "Leave a review" button.
R.rev = function () {
    var v = DATA.reviews.filter(function (r) { return r.visible !== 'No' });
    return W('<div class="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p class="'
        + EY + '">Reviews</p><h2 class="' + H2 + ' !mb-0">What clients say</h2></div><button data-a="rev" class="'
        + B1 + '">Leave a review</button></div>' + (v.length ? '<div class="grid gap-6 md:grid-cols-3">'
        + v.map(function (r) {
        var n = +r.rating || 5;
        return '<figure class="' + CARD + '"><div class="text-lg text-pink-600" aria-label="'
            + n + ' out of 5 stars">' + '\u2605'.repeat(n) + '<span class="text-neutral-300 dark:text-neutral-700">'
            + '\u2605'.repeat(5 - n) + '</span></div><blockquote class="mt-2 ' + MUT + '">'
            + esc(r.text) + '</blockquote><figcaption class="mt-4 font-bold">' + esc(r.name)
            + '</figcaption></figure>'
        }).join('') + '</div>' : '<div class="' + CARD + ' text-center ' + MUT + '">No reviews yet. Be the first to share your visit.</div>'))
};

// VISIT: opening hours, address and directions.
R.visit = function () {
    return W('<div class="grid gap-10 md:grid-cols-2"><div><p class="' + EY + '">Hours and location</p><h2 class="'
        + H2 + '">Visit us</h2>' + H.map(row).join('') + '</div><div class="' + CARD + ' self-start"><p class="flex items-start gap-2 font-bold"><span class="text-pink-600">'
        + ic('pin') + '</span>113 Young Drive, Lexington, NC 27292</p><p class="mt-3 ' + MUT
        + '">Massage services are by appointment only. Tattoo walk-ins are welcome Thursday, Friday, and Saturday.</p><div class="mt-5 flex flex-col gap-3 sm:flex-row"><a class="'
        + B1 + '" href="https://www.google.com/maps/search/?api=1&query=113%20Young%20Drive%2C%20Lexington%2C%20NC%2C%2027292">Get directions</a><a class="'
        + B2 + '" href="tel:' + PH + '">Call ' + PHD + '</a></div></div></div>')
};

// SERVICES page: heading.
R.shead = function () {
    return W('<p class="' + EY + '">Lexington, North Carolina</p><h1 class="' + H2 + '">Tattoo and massage services in Lexington</h1><p class="max-w-2xl text-lg '
        + MUT + '">Handcrafted tattoo sessions, Ashiatsu barefoot bodywork, therapeutic massage, and restorative Reiki.</p>', 'pt-14')
};

// SERVICES page: category buttons and the service boxes.
R.slist = function () {
    var l = S.map(function (s, i) { return [s, i] }).filter(function (x) { return F === 'All' || x[0].c === F });
    return W('<div class="mb-6 flex flex-wrap gap-2">' + ['All', 'Massage', 'Tattoo', 'Piercing'].map(function (c) {
        return '<button data-f="' + c + '" class="rounded-full border px-5 py-2 text-sm font-bold uppercase '
            + (c === F ? 'border-pink-600 bg-pink-600 text-white' : 'border-neutral-300 dark:border-neutral-700')
            + '">' + c + '</button>'
    }).join('') + '</div><p class="mb-6 border-b border-neutral-200 pb-4 text-sm font-medium uppercase tracking-wider dark:border-neutral-800 '
        + MUT + '">Showing ' + l.length + ' services</p><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">'
        + l.map(function (x) { return card(x[0], x[1]) }).join('') + '</div>', 'py-8')
};

// SERVICES page: memberships and savings.
R.memb = function () {
    var m = function (t, p) {
        return '<div class="' + CARD + '"><b class="text-xl font-extrabold uppercase">' + t
            + '</b><p class="my-2 text-3xl font-extrabold">' + p + '<span class="text-sm font-medium '
            + MUT + '"> per month</span></p><p class="text-sm ' + MUT + '">Save $15 each month. Unused credits roll over. Cancel any time up to 5 days before renewal.</p></div>'
    };
    return W('<p class="' + EY + '">Save more</p><h2 class="' + H2 + '">Memberships and savings</h2><div class="grid gap-6 md:grid-cols-2">'
        + m('60 minute membership', '$70') + m('90 minute membership', '$95') + '</div><ul class="mt-6 grid gap-3 text-sm sm:grid-cols-3 '
        + MUT + '"><li class="' + CARD + ' !p-4"><b class="text-neutral-900 dark:text-white">Rebook at checkout</b><br>60 minutes $75, 90 minutes $95.</li><li class="'
        + CARD + ' !p-4"><b class="text-neutral-900 dark:text-white">Pay with cash</b><br>60 minutes $80, 90 minutes $100.</li><li class="'
        + CARD + ' !p-4"><b class="text-neutral-900 dark:text-white">Buy one, get one 25% off</b><br>60 or 90 minutes, paid in full upfront ($148.75 to $192.50).</li></ul>')
};

// Deposit, cancellation and gift certificate rules.
R.pol = function () {
    return W('<div class="grid gap-6 md:grid-cols-2"><div class="' + CARD + '"><h3 class="mb-2 text-xl font-extrabold uppercase">Deposits and cancellations</h3><p class="text-sm '
        + MUT + '">New massage bookings need a $25 deposit. It is nonrefundable for no shows or cancellations with less than 24 hours notice, and may be moved once to a rescheduled appointment. Those cancellations carry a $25 fee that is paid before rebooking. Tattoos need a 50% deposit.</p></div><div class="'
        + CARD + '"><h3 class="mb-2 text-xl font-extrabold uppercase">Gift certificates</h3><p class="text-sm '
        + MUT + '">Available for 60 minute massage, 90 minute massage, or an open amount for tattoos (shop minimum is $100).</p></div></div>', 'pt-0 pb-14')
};

// ABOUT page: the full story.
R.abt = function () {
    return W('<div class="grid items-center gap-10 md:grid-cols-2"><div><p class="' + EY + '">About us</p><h1 class="'
        + H2 + '">A safe space for creativity and healing</h1><p class="' + MUT + '">We are a licensed massage therapist and permitted tattoo artist team serving Lexington, NC and the surrounding areas. We hope to provide a comfortable and safe space for creativity and healing by forming a partnership with each client who enters for a service.</p><p class="mt-4 '
        + MUT + '">Both artist and therapist are trained in Reiki II and are excited to bring this Japanese energy healing practice to clients looking for stress relief and relaxation. Walk-ins for tattoos are welcome on Thursdays, Fridays, and Saturdays. Massage is by appointment only.</p></div><div class="h-64 overflow-hidden rounded-3xl">'
        + scene('reiki') + '</div></div>')
};

// ABOUT page: team members (from DATA.team).
R.team = function () {
    return W('<p class="' + EY + '">Our team</p><h2 class="' + H2 + '">Meet the people</h2><div class="grid gap-6 md:grid-cols-2">'
        + DATA.team.map(function (m) {
        var tg = (m.tags || '').split(',').filter(function (x) { return x.trim() }).map(function (x) {
            return '<span class="rounded-full border border-neutral-300 px-3 py-1 text-xs font-bold uppercase dark:border-neutral-700">'
                + esc(x.trim()) + '</span>'
        }).join('');
        return '<div class="' + CARD + '"><div class="mb-3 flex items-center gap-4">' + av(m, 'h-16 w-16')
            + '<div class="min-w-0"><b class="block text-xl">' + esc(m.name) + '</b><span class="text-sm '
            + MUT + '">' + esc(m.role) + '</span></div></div>' + (m.bio ? '<p class="' + MUT
            + '">' + esc(m.bio) + '</p>' : '') + (tg ? '<div class="mt-4 flex flex-wrap gap-2">'
            + tg + '</div>' : '') + '</div>'
        }).join('') + '</div>', 'pt-0 pb-14')
};

// BOOKING page: the request form.
R.book = function () {
    var q = (location.hash.split('?s=')[1] || ''),
        sel = S[+q] ? +q : 0;
    return W('<div class="grid gap-10 md:grid-cols-5"><div class="md:col-span-2"><p class="'
        + EY + '">Book online</p><h1 class="' + H2 + '">Request your appointment</h1><p class="'
        + MUT + '">Choose a service and a time that works. We reply to confirm your slot. Massage is by appointment only. Tattoo walk-ins are welcome Thursday to Saturday.</p><p class="mt-4 text-sm '
        + MUT + '">New massage clients pay a $25 deposit and tattoos need a 50% deposit, collected when we confirm. Prefer to talk? Call or text <a class="font-bold underline" href="tel:'
        + PH + '">' + PHD + '</a>.</p></div><form id="bf" novalidate class="' + CARD + ' grid gap-4 md:col-span-3 sm:grid-cols-2"><div class="sm:col-span-2"><label for="svc" class="mb-1 block text-sm font-bold">Service</label><select id="svc" name="svc" class="'
        + INP + '">' + S.map(function (s, i) {
        return '<option' + (i === sel ? ' selected' : '') + '>' + esc(s.n) + '</option>'
        }).join('') + '</select></div>' + field('Preferred date', 'date', 'date', 'required')
        + '<div><label for="tm" class="mb-1 block text-sm font-bold">Time</label><select id="tm" name="tm" class="'
        + INP + '"><option>Afternoon (12 PM to 4 PM)</option><option>Evening (4:30 PM to 8 PM)</option><option>Any time</option></select></div>'
        + field('Name', 'name', 'text', 'required autocomplete="name"') + phoneF() + '<div class="sm:col-span-2">'
        + field('Email', 'email', 'email', 'required autocomplete="email"') + '</div><div class="sm:col-span-2"><label for="notes" class="mb-1 block text-sm font-bold">Notes</label><textarea id="notes" name="notes" rows="3" class="'
        + INP + '" placeholder="Design idea, areas of focus, questions"></textarea></div><div class="sm:col-span-2"><button class="'
        + B1 + ' w-full sm:w-auto" type="submit" id="sb">Send request</button><p id="fm" class="mt-3 text-sm text-red-600" role="alert"></p></div></form></div>', 'py-14')
};

// CONTACT page: message form, address and hours.
R.contact = function () {
    return W('<div class="grid gap-10 md:grid-cols-2"><div><p class="' + EY + '">Contact</p><h1 class="'
        + H2 + '">Ask us a question</h1><form id="cf" novalidate class="grid gap-4">' + field('Name', 'name', 'text', 'required')
        + field('Email', 'email', 'email', 'required') + '<div><label for="msg" class="mb-1 block text-sm font-bold">Message</label><textarea id="msg" name="msg" rows="5" required class="'
        + INP + '"></textarea></div><div><button class="' + B1 + ' w-full sm:w-auto" type="submit" id="sb">Send</button><p id="fm" class="mt-3 text-sm text-red-600" role="alert"></p></div></form></div><div><div class="'
        + CARD + ' mb-6"><p class="flex items-start gap-2 font-bold"><span class="text-pink-600">'
        + ic('pin') + '</span>113 Young Drive, Lexington, NC 27292</p><p class="mt-3"><a class="font-bold underline" href="tel:'
        + PH + '">' + PHD + '</a></p><p class="mt-3"><a class="underline" href="https://www.tiktok.com/@iammrdoe">Follow us on TikTok @iammrdoe</a></p></div>'
        + H.map(row).join('') + '</div></div>')
};

// esc(text) makes typed text safe to show inside HTML.
function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return{ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
    })
}

// pic(item) returns the item's uploaded photo, or a drawn picture when it has none.
function pic(o) {
    return o.img ? '<img src="' + o.img + '" alt="' + esc(o.n || o.title) + '" class="h-full w-full object-cover">' : scene(o.k || 'lotus')
}

// av(person, size) returns a round profile photo, or the person's initials.
function av(m, c) {
    return m.img ? '<img src="' + m.img + '" alt="" class="' + c + ' flex-none rounded-full object-cover">' : '<span class="flex '
        + c + ' flex-none items-center justify-center rounded-full bg-neutral-900 font-bold text-white dark:bg-white dark:text-black">'
        + esc((m.name || '?').split(' ').map(function (w) { return w[0] || '' }).join('').slice(0, 2))
        + '</span>'
}

// G = selected portfolio category on the Portfolio page.
var G = 'All';

// FAQ and aftercare page: questions grouped by section.
R.faq = function () {
    var g = {};
    DATA.faq.forEach(function (f) { (g[f.g] = g[f.g] || []).push(f) });
    return W('<p class="' + EY + '">Help</p><h1 class="' + H2 + '">FAQ and aftercare</h1>'
        + Object.keys(g).map(function (k) {
        return '<h2 class="mb-3 mt-8 text-xl font-extrabold uppercase">' + esc(k) + '</h2><div class="'
            + CARD + ' divide-y divide-neutral-200 !p-0 dark:divide-neutral-800">' + g[k].map(function (f) {
            return '<details class="p-5"><summary class="cursor-pointer font-bold">' + esc(f.q)
                + '</summary><p class="mt-2 text-sm ' + MUT + '">' + esc(f.a) + '</p></details>'
            }).join('') + '</div>'
        }).join(''))
};

// PORTFOLIO page: photo gallery with category buttons.
R.gal = function () {
    var l = DATA.portfolio.filter(function (p) { return G === 'All' || p.cat === G });
    return W('<p class="' + EY + '">Portfolio</p><h1 class="' + H2 + '">Our work</h1><div class="mb-6 flex flex-wrap gap-2">'
        + ['All', 'Tattoo', 'Massage', 'Reiki'].map(function (c) {
        return '<button data-g="' + c + '" class="rounded-full border px-5 py-2 text-sm font-bold uppercase '
            + (c === G ? 'border-pink-600 bg-pink-600 text-white' : 'border-neutral-300 dark:border-neutral-700')
            + '">' + c + '</button>'
        }).join('') + '</div>' + (l.length ? '<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">'
        + l.map(function (p) {
        return '<figure class="overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"><div class="relative h-56">'
            + gimg(p) + '</div><figcaption class="p-4"><b class="block">' + esc(p.title) + '</b><span class="text-sm '
            + MUT + '">' + esc(p.note || p.cat) + '</span></figcaption></figure>'
        }).join('') + '</div>' : '<div class="' + CARD + ' text-center ' + MUT + '">New work is being added. Check back soon.</div>'))
};

// Phone box: when the number starts with +, detect the country code.
document.addEventListener('input', function (e) {
    if (e.target.id === 'phone') detect(e.target)
});

// ---------- 4. SUPABASE BACKEND (read-only for visitors) ----------
// Connects only when config.js has a URL and key. Otherwise the site runs on the default content.
var CFG = window.BL_CFG || {},
    SB = null;

if (CFG.url && CFG.anon && window.supabase) {
    SB = window.supabase.createClient(CFG.url, CFG.anon)
}

// Always have a reviews list. Without a backend, reload reviews saved on this device.
DATA.reviews = DATA.reviews || [];

if (!SB) {
    try {
        DATA.reviews = DATA.reviews.concat(JSON.parse(localStorage.getItem('bl-rev') || '[]'))
    } catch (x) {}
}

// CK = the parts of DATA stored in the Supabase table site_content (reviews have their own table).
var CK = ['services', 'team', 'portfolio', 'faq', 'heroImg'];

// cloudLoad(): download content and reviews from Supabase.
async function cloudLoad() {
    var c = await SB.from('site_content').select('data').eq('id', 1).maybeSingle();
    if (c.data && c.data.data) {
        CK.forEach(function (k) { if (c.data.data[k] != null) DATA[k] = c.data.data[k] });
        S = DATA.services
    }
    var r = await SB.from('reviews').select('*').order('created_at', { ascending: false });
    if (r.data) DATA.reviews = r.data.map(function (x) {
        return {
            id: x.id,
            name: x.name,
            rating: x.rating,
            text: x.text,
            visible: x.visible ? 'Yes' : 'No'
        }
    })
}

// ---------- 5. FORMS, REVIEWS AND CHAT ----------
// toast(message): small pop-up message at the bottom of the screen.
function toast(m) {
    var t = $('#ts');
    t.textContent = m;
    t.classList.remove('hidden');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.classList.add('hidden') }, 6000)
}

// gimg(): the swipeable strip of photos on a portfolio card.
function gimg(p) {
    var l = p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : []);
    return l.length ? '<div class="flex h-full snap-x snap-mandatory overflow-x-auto">' + l.map(function (u) {
        return '<img src="' + u + '" alt="' + esc(p.title) + '" loading="lazy" class="h-full w-full flex-none snap-center object-cover">'
    }).join('') + '</div>' + (l.length > 1 ? '<span class="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white">'
        + l.length + ' photos</span>' : '') : scene(p.k || 'lotus')
}

// heroBg(): hero background (uploaded image or drawn lotus) with a dark layer so text stays readable.
function heroBg() {
    return (DATA.heroImg ? '<img src="' + DATA.heroImg + '" alt="" class="h-full w-full object-cover">' : '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" class="h-full w-full"><defs><radialGradient id="hg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#5a1a3e"/><stop offset="1" stop-color="#0b0b0b"/></radialGradient></defs><rect width="800" height="600" fill="url(#hg)"/><g fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2"><path d="M400 90c-70 80-70 170 0 250 70-80 70-170 0-250z"/><path d="M400 340c-130-14-215-85-240-175 85 0 185 42 240 175z"/><path d="M400 340c130-14 215-85 240-175-85 0-185 42-240 175z"/><path d="M400 340c-170 10-290-40-350-130 100-20 240 10 350 130z"/><path d="M400 340c170 10 290-40 350-130-100-20-240 10-350 130z"/><circle cx="400" cy="340" r="190"/><circle cx="400" cy="340" r="260"/></g></svg>')
        + '<div class="absolute inset-0 bg-black/55"></div>'
}

// CT = supported countries and their phone codes.
var CT = 'US:1,CA:1,GB:44,AU:61,NZ:64,IE:353,DE:49,FR:33,ES:34,IT:39,NL:31,SE:46,NO:47,MX:52,BR:55,AR:54,CO:57,CL:56,PE:51,JM:1,PR:1,IN:91,PK:92,BD:880,PH:63,CN:86,JP:81,KR:82,AE:971,SA:966,TR:90,EG:20,NG:234,GH:233,KE:254,ZA:27'.split(',').map(function (x) {
    var q = x.split(':');
    return{ c: q[0], d: q[1] }
});

// flag(code): turns a country code such as US into a flag symbol.
function flag(c) {
    return String.fromCodePoint.apply(null, c.split('').map(function (h) { return 127397 + h.charCodeAt(0) }))
}

// phoneF(): phone input with a country selector; starts from the browser language.
function phoneF() {
    var d = ((navigator.language || 'en-US').split('-')[1] || 'US').toUpperCase();
    if (!CT.some(function (x) { return x.c === d })) d = 'US';
    return '<div><label for="phone" class="mb-1 block text-sm font-bold">Phone</label><div class="flex gap-2"><select id="cc" name="cc" aria-label="Country code" class="'
        + INP + ' !w-auto !px-2">' + CT.map(function (x) {
        return '<option value="' + x.c + '"' + (x.c === d ? ' selected' : '') + '>' + flag(x.c)
            + ' +' + x.d + '</option>'
        }).join('') + '</select><input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="Phone number" class="'
        + INP + ' min-w-0"></div></div>'
}

// detect(): if the number starts with +, pick the matching country and remove the code from the box.
function detect(el) {
    var v = el.value.replace(/[^\d+]/g, '');
    if (v[0] !== '+') return;
    var n = v.slice(1),
        sel = $('#cc'),
        cur = CT.filter(function (x) { return x.c === sel.value })[0],
        best = cur && n.indexOf(cur.d) === 0 ? cur : null;
    if (!best) CT.forEach(function (x) {
        if (n.indexOf(x.d) === 0 && (!best || x.d.length > best.d.length)) best = x
    });
    if (best) { sel.value = best.c; el.value = n.slice(best.d.length) }
}

// TYPO = common email domain typos we warn about.
var TYPO = {
    'gmial.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'hotmial.com': 'hotmail.com',
    'yaho.com': 'yahoo.com',
    'outlok.com': 'outlook.com'
};

// mxOk(): checks that an email domain can receive mail (works once the site is hosted normally).
async function mxOk(d) {
    try {
        var r = await fetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(d)
            + '&type=MX', {
            headers: { accept: 'application/dns-json' }
            }),
            j = await r.json();
        return !!(j.Answer && j.Answer.length)
    } catch (x) { return true }
}

// checkForm(): checks name, email, date and phone. Returns [field, message] for the first problem, or null.
function checkForm(f) {
    var v = function (k) { return f.elements[k] ? f.elements[k].value.trim() : '' },
        em = v('email').toLowerCase(),
        d = em.split('@')[1];
    if (v('name').length < 2) return ['name', 'Please enter your name.'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return ['email', 'Please enter a valid email address.'];
    if (TYPO[d]) return ['email', 'Did you mean ' + em.split('@')[0] + '@' + TYPO[d] + '?'];
    if (f.id === 'bf') {
        var dt = v('date'),
            dd = new Date(dt + 'T12:00:00'),
            t = new Date();
        t.setHours(0, 0, 0, 0);
        if (!dt || isNaN(dd)) return ['date', 'Please choose a preferred date.'];
        if (dd < t) return ['date', 'Please choose today or a later date.'];
        if (dd.getDay() < 2 && dd.getDay() !== 6) return [
            'date',
            'We are closed Sunday and Monday. Please pick Tuesday to Saturday.'
        ];
        var ph = v('phone').replace(/\D/g, '');
        if (ph) {
            var c = CT.filter(function (x) { return x.c === v('cc') })[0],
                ok = c.d === '1' ? ph.length === 10 : ph.length >= 6 && ph.length <= 12;
            if (!ok) return [
                'phone',
                'That phone number does not look right for ' + flag(c.c) + ' +' + c.d + '.'
            ]
        }
    } else if (v('msg').length < 5) return ['msg', 'Please write a short message.'];
    return null
}

// openRev(): opens the review pop-up form.
function openRev() {
    var d = document.createElement('div');
    d.id = 'rm';
    d.className = 'fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center';
    d.innerHTML = '<form id="rf" novalidate class="' + CARD + ' max-h-full w-full max-w-md overflow-y-auto"><h2 class="mb-4 text-2xl font-extrabold uppercase">Leave a review</h2><div class="grid gap-4">'
        + field('Name', 'name', 'text', 'required autocomplete="name"') + '<div><label for="rating" class="mb-1 block text-sm font-bold">Rating</label><select id="rating" name="rating" class="'
        + INP + '"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></div><div><label for="text" class="mb-1 block text-sm font-bold">Your comment</label><textarea id="text" name="text" rows="4" required class="'
        + INP + '"></textarea></div><p id="rme" class="text-sm text-red-600" role="alert"></p><div class="flex gap-3"><button class="'
        + B1 + '" type="submit">Post review</button><button type="button" data-a="rc" class="'
        + B2 + '">Cancel</button></div></div></form>';
    document.body.appendChild(d);
    d.querySelector('input').focus()
}

// subRev(): saves a review (Supabase if connected, otherwise this device) and shows it at once.
async function subRev(f) {
    var v = function (k) { return f.elements[k].value.trim() };
    if (v('name').length < 2 || v('text').length < 3) {
        $('#rme').textContent = 'Please add your name and a short comment.';
        return
    }
    var row = { name: v('name'), rating: +v('rating'), text: v('text') };
    try {
        if (SB) {
            var r = await SB.from('reviews').insert({ name: row.name, rating: row.rating, text: row.text, visible: true }).select().single();
            if (r.error) throw r.error;
            DATA.reviews.unshift({
                id: r.data.id,
                name: row.name,
                rating: row.rating,
                text: row.text,
                visible: 'Yes'
            })
        } else {
            DATA.reviews.unshift({
                name: row.name,
                rating: row.rating,
                text: row.text,
                visible: 'Yes',
                local: 1
            });
            try {
                localStorage.setItem('bl-rev', JSON.stringify(DATA.reviews.filter(function (x) { return x.local })))
            } catch (x) {}
        }
        $('#rm').remove();
        toast('Thank you! Your review is now live.');
        var el = $('[data-l="rev"]');
        if (el) el.innerHTML = R.rev()
    } catch (x) {
        $('#rme').textContent = 'Could not post your review. Please try again.'
    }
}

// Chat: cmsg(text, isVisitor, question) adds a chat bubble.
// When "question" is given, a WhatsApp button is added under the bubble (used for questions the bot cannot answer).
function cmsg(t, me, question) {
    var d = document.createElement('div');
    d.className = (me ? 'ml-auto bg-neutral-900 text-white dark:bg-white dark:text-black' : 'bg-neutral-100 dark:bg-neutral-800')
        + ' max-w-[85%] rounded-2xl px-3 py-2';
    d.textContent = t;
    if (question) {
        var a = document.createElement('a');
        a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hello Black Lotus, ' + question);
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'mt-2 block rounded-full bg-green-600 px-4 py-2 text-center font-bold text-white';
        a.textContent = 'Chat on WhatsApp';
        d.appendChild(a)
    }
    $('#cl').appendChild(d);
    $('#cl').scrollTop = 1e5
}

// bot(question): simple keyword matching on hours, services and FAQ. No AI involved.
// Returns null when it has no answer (the chat then offers WhatsApp).
function bot(q) {
    q = q.toLowerCase();
    var h = [
        [
            /Hi|hi|Hello|hello|how are you?/,
            'Hello, how can I assist you?'
        ],
        [
            /hour|open|close|when/,
            'We are open Tuesday and Wednesday 4:30 PM to 8 PM, and Thursday to Saturday 12 PM to 8 PM. Closed Sunday and Monday.'
        ],
        [
            /walk/,
            'Tattoo walk-ins are welcome Thursday to Saturday, 12 PM to 8 PM. Massage is by appointment only.'
        ],
        [
            /deposit/,
            'New massage bookings need a $25 deposit. Tattoos need a 50% deposit.'
        ],
        [
            /where|address|locat|direction/,
            'We are at 113 Young Drive, Lexington, NC 27292.'
        ],
        [
            /book|appointment|schedule/,
            'You can request a time on the Book online page. Tap the calendar icon at the top.'
        ],
        [/phone|call|text|contact/, 'Call or text ' + PHD + '.']
    ];
    for (var i = 0; i < h.length; i++) if (h[i][0].test(q)) return h[i][1];
    var w = q.split(/\W+/).filter(function (x) { return x.length > 3 }),
        hit = function (t) {
        return w.some(function (x) { return t.toLowerCase().indexOf(x) > -1 })
        },
        s = S.filter(function (x) { return hit(x.n) })[0];
    if (s) return s.n + ': ' + (s.p ? s.p + '. ' : '') + (s.t ? s.t + '. ' : '') + s.d;
    var f = DATA.faq.filter(function (x) { return hit(x.q) })[0];
    if (f) return f.a;
    return null
}

// Chat button and panel: show the icons, then open and close the panel.
$('#cb').innerHTML = ic('chat', 'h-7 w-7');

$('#cx').innerHTML = ic('x');

$('#cb').addEventListener('click', function () {
    var p = $('#cp'),
        o = p.classList.contains('hidden');
    p.classList.toggle('hidden', !o);
    p.classList.toggle('flex', o);
    if (o && !$('#cl').children.length) cmsg('Hi, I am the Black Lotus assistant, available 24/7. Ask about hours, prices, walk-ins, or booking.')
});

$('#cx').addEventListener('click', function () {
    $('#cp').classList.add('hidden');
    $('#cp').classList.remove('flex')
});

// ---------- 6. ROUTER, MENU, THEME AND LISTENERS ----------
// PG = which sections each page shows. NAV = menu links.
var PG = {
    home: ['hero', 'peek', 'about', 'msg', 'rev', 'visit'],
    services: ['shead', 'slist', 'memb', 'pol'],
    portfolio: ['gal'],
    about: ['abt', 'team', 'pol'],
    faq: ['faq'],
    booking: ['book'],
    contact: ['contact']
};

var NAV = [
    ['home', 'Home'],
    ['services', 'Services'],
    ['portfolio', 'Portfolio'],
    ['about', 'About'],
    ['faq', 'FAQ'],
    ['booking', 'Book online'],
    ['contact', 'Contact']
];

// sk(): the grey loading skeleton shown until a section scrolls into view.
function sk() {
    var b = 'bg-neutral-200 dark:bg-neutral-800';
    return '<div class="mx-auto max-w-6xl animate-pulse space-y-4 px-5 py-14" aria-hidden="true"><div class="h-4 w-28 rounded-full '
        + b + '"></div><div class="h-9 w-3/4 max-w-md rounded-xl ' + b + '"></div><div class="grid gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3"><div class="h-52 rounded-3xl '
        + b + '"></div><div class="hidden h-52 rounded-3xl sm:block ' + b + '"></div><div class="hidden h-52 rounded-3xl lg:block '
        + b + '"></div></div></div>'
}

// io: when a skeleton comes into view, wait 0.6 seconds, then swap in the real section.
var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        setTimeout(function () {
            el.innerHTML = R[el.dataset.l]();
            el.style.minHeight = '0';
            el.classList.add('rv')
        }, 600)
    })
}, { rootMargin: '0px 0px -40px 0px' });

// route(): runs on every page change. Draws skeletons, builds the menus, sets the page title.
function route() {
    var r = (location.hash.slice(2).split('?')[0]) || 'home';
    if (!PG[r]) r = 'home';
    F = 'All';
    $('#app').innerHTML = PG[r].map(function (id) {
        return '<div data-l="' + id + '" style="min-height:360px">' + sk() + '</div>'
    }).join('');
    document.querySelectorAll('[data-l]').forEach(function (el) { io.observe(el) });
    var lk = function (c) {
        return NAV.map(function (n) {
            return '<a href="#/' + (n[0] === 'home' ? '' : n[0]) + '" class="' + c + (n[0] === r ? ' text-pink-600 dark:text-pink-400' : '')
                + '">' + n[1] + '</a>'
        }).join('')
    };
    $('#dn').innerHTML = lk('hover:text-pink-600');
    $('#mn').innerHTML = '<div class="flex items-center justify-between py-4"><b class="font-extrabold uppercase">Black Lotus Tattoo and Massage</b><button data-a="mc" aria-label="Close menu" class="p-1">'
        + ic('x', 'h-7 w-7') + '</button></div><div class="mt-4 flex flex-1 flex-col">' + lk('border-b border-neutral-200 py-5 text-2xl font-extrabold uppercase tracking-tight dark:border-neutral-800')
        + '</div><a href="#/booking" class="' + B1 + ' mt-6 w-full">Book online</a>';
    mnu(false);
    $('#mb').innerHTML = ic('menu', 'h-7 w-7');
    $('#bk').innerHTML = ic('cal');
    window.scrollTo(0, 0);
    document.title = (r === 'home' ? '' : NAV.filter(function (n) { return n[0] === r })[0][1]
        + ' | ') + 'Black Lotus Tattoo and Massage'
}

// START: redraw when the part of the address after # changes. Load Supabase data first if connected.
window.addEventListener('hashchange', route);

(SB ? cloudLoad().catch(function () {}) : Promise.resolve()).then(route);

// mnu(true / false): open or close the full-screen mobile menu.
function mnu(o) {
    var m = $('#mn');
    m.classList.toggle('hidden', !o);
    m.classList.toggle('flex', o);
    document.body.style.overflow = o ? 'hidden' : ''
}

$('#mb').addEventListener('click', function () { mnu(true) });

// Light / dark mode button.
function theme() {
    var d = document.documentElement.classList.contains('dark');
    $('#tt').innerHTML = ic(d ? 'sun' : 'moon')
}

theme();

$('#tt').addEventListener('click', function () {
    var r = document.documentElement,
        d = !r.classList.contains('dark');
    r.classList.toggle('dark', d);
    r.dataset.theme = d ? 'dark' : 'light';
    try { localStorage.setItem('bl-theme', d ? 'dark' : 'light') } catch (e) {}
    theme()
});

// One click listener for every button with data-f (services filter), data-g (gallery filter) or data-a (action).
document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f],[data-g],[data-a]');
    if (!b) return;
    var el = b.closest('[data-l]');
    if (b.dataset.f) { F = b.dataset.f; el.innerHTML = R.slist() } else if (b.dataset.g) { G = b.dataset.g; el.innerHTML = R.gal() } else if (b.dataset.a === 'mc') mnu(false);
    else if (b.dataset.a === 'rev') openRev();
    else if (b.dataset.a === 'rc') $('#rm').remove()
});

// One submit listener for every form: chat, review, booking and contact.
document.addEventListener('submit', async function (e) {
    e.preventDefault();
    var f = e.target;
    // Chat form: show the visitor's message, then the answer.
    if (f.id === 'cf2') {
        var q = $('#ci').value.trim();
        if (!q) return;
        cmsg(q, 1);
        $('#ci').value = '';
        setTimeout(function () {
            var answer = bot(q);
            if (answer) cmsg(answer);
            else cmsg('I am not sure about that one. You can message the team directly on WhatsApp.', 0, q)
        }, 400);
        return
    }
    // Review pop-up form.
    if (f.id === 'rf') return subRev(f);
    if (f.id !== 'bf' && f.id !== 'cf') return;
    // Booking and contact forms: check the inputs and show the first problem.
    var m = $('#fm'),
        sb = $('#sb'),
        er = checkForm(f),
        v = function (k) { return f.elements[k] ? f.elements[k].value.trim() : '' };
    m.textContent = '';
    f.querySelectorAll('[aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid') });
    if (er) {
        m.textContent = er[1];
        var el = f.elements[er[0]];
        if (el) { el.setAttribute('aria-invalid', 'true'); el.focus() }
        return
    }
    // Build the data to send. Phone numbers get the country code in front.
    var bk = f.id === 'bf',
        ct = bk ? CT.filter(function (x) { return x.c === v('cc') })[0] : null,
        ph = bk && v('phone') ? '+' + ct.d + ' ' + v('phone').replace(/\D/g, '') : '';
    var p = bk ? {
        type: 'booking',
        service: v('svc'),
        date: v('date'),
        time: v('tm'),
        name: v('name'),
        phone: ph,
        email: v('email'),
        notes: v('notes')
    } : {
        type: 'contact',
        name: v('name'),
        email: v('email'),
        message: v('msg')
    };
    // Button says "Sending...". With Supabase: save, then email. Without it: open the visitor's email app.
    sb.disabled = true;
    sb.textContent = 'Sending...';
    if (SB) {
        try {
            if (!(await mxOk(p.email.split('@')[1]))) throw new Error('mx');
            var ins = await SB.from(bk ? 'bookings' : 'contact_messages').insert(bk ? {
                service: p.service,
                pref_date: p.date,
                pref_time: p.time,
                name: p.name,
                phone: p.phone,
                email: p.email,
                notes: p.notes
            } : { name: p.name, email: p.email, message: p.message });
            if (ins.error) throw ins.error;
            var nf = await SB.functions.invoke('notify', { body: p });
            if (nf.error || !(nf.data && nf.data.ok)) throw new Error('mail');
            sb.textContent = 'Delivered!';
            sb.classList.add('!bg-green-600', '!text-white', 'dark:!bg-green-600');
            f.reset();
            var t = 'Delivered! A confirmation email is on its way to ' + p.email + '.';
            toast(t);
            try {
                if (window.Notification && Notification.permission === 'granted') new Notification('Black Lotus Tattoo and Massage', { body: t })
            } catch (x) {}
        } catch (x) {
            sb.disabled = false;
            sb.textContent = 'Try again';
            m.textContent = x.message === 'mx' ? 'That email domain cannot receive mail. Please check the address.' : x.message === 'mail' ? 'Your request was saved, but the confirmation email could not be sent. Please check your email address or call '
                + PHD + '.' : 'Something went wrong. Please try again or call ' + PHD + '.'
        }
    } else {
        var body = bk ? 'Service: ' + p.service + '\nDate: ' + p.date + '\nTime: ' + p.time
            + '\nName: ' + p.name + '\nPhone: ' + p.phone + '\nEmail: ' + p.email + '\n\n'
            + p.notes : p.message + '\n\nFrom: ' + p.name + ' (' + p.email + ')';
        location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent((bk ? 'Booking request: '
            + p.service : 'Question from ' + p.name)) + '&body=' + encodeURIComponent(body);
        sb.disabled = false;
        sb.textContent = 'Opened in email app';
        toast('Your email app opened. Press send there to finish. Instant delivery needs the Supabase backend connected.')
    }
});

