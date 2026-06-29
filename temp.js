
    /* ── HERO CAROUSEL ─────────────────────────────── */
    const HERO_INTERVAL = 4000;
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots   = Array.from(document.querySelectorAll('.hero-dot'));
    let activeSlide = 0, timer = null;

    function isMobile() { return window.matchMedia('(max-width: 760px)').matches; }
    function getSrc(slide) { return isMobile() ? slide.dataset.srcMob : slide.dataset.srcPc; }

    function prepareSlides() {
      slides.forEach(slide => {
        if (slide.dataset.type === 'video') {
          const video = slide.querySelector('video');
          const src   = getSrc(slide);
          if (video.querySelector('source')?.getAttribute('src') !== src) {
            video.innerHTML = `<source src="${src}" type="video/mp4" />`;
            video.load();
          }
        } else {
          const img = slide.querySelector('img');
          const src = getSrc(slide);
          if (img && img.getAttribute('src') !== src) img.src = src;
        }
      });
    }

    function setActiveSlide(index) {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === activeSlide;
        slide.classList.toggle('active', active);
        const video = slide.querySelector('video');
        if (video) { active ? video.play().catch(()=>{}) : video.pause(); }
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === activeSlide));
    }

    function startCarousel() {
      if (timer) clearInterval(timer);
      prepareSlides(); setActiveSlide(0);
      timer = setInterval(() => setActiveSlide(activeSlide + 1), HERO_INTERVAL);
    }

    dots.forEach(dot => dot.addEventListener('click', () => {
      setActiveSlide(Number(dot.dataset.slide));
      if (timer) clearInterval(timer);
      timer = setInterval(() => setActiveSlide(activeSlide + 1), HERO_INTERVAL);
    }));

    /* ── ENTER SITE ─────────────────────────────────── */
    function enterSite() {
      const intro = document.getElementById('intro');
      const main  = document.getElementById('main-site');
      intro.classList.add('hide');
      main.classList.add('visible');
      setTimeout(() => { intro.style.display = 'none'; startCarousel(); }, 900);
    }

    /* ── MOBILE NAV ─────────────────────────────────── */
    function openMobileNav() { document.getElementById('mobileNav').classList.add('open'); document.getElementById('mobileOverlay').classList.add('open'); }
    function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); document.getElementById('mobileOverlay').classList.remove('open'); }

    /* ── BOOKING BAR DROPDOWNS ──────────────────────── */
    function togglePicker(evt, id) {
      evt.stopPropagation();
      document.querySelectorAll('.date-picker-dropdown, .guests-dropdown, .roomtype-dropdown').forEach(el => { if (el.id !== id) el.classList.remove('open'); });
      document.getElementById(id).classList.toggle('open');
    }
    document.addEventListener('click', () => {
      document.querySelectorAll('.date-picker-dropdown, .guests-dropdown, .roomtype-dropdown').forEach(el => el.classList.remove('open'));
      closeMobileNav();
    });

    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    function setDate(type) {
      const val = document.getElementById(type + '-input').value;
      if (!val) return;
      const d = new Date(val), p = type === 'checkin' ? 'ci' : 'co';
      document.getElementById(p + '-num').textContent   = String(d.getDate()).padStart(2, '0');
      document.getElementById(p + '-month').textContent = months[d.getMonth()];
      document.getElementById(p + '-year').textContent  = d.getFullYear();
      document.getElementById(p + '-day').textContent   = days[d.getDay()];
      document.getElementById(type + '-picker').classList.remove('open');
    }

    const counts = { guests: 2, rooms: 1 };
    let selectedRoomType = 'Deluxe Room';

    function changeCount(type, delta) {
      counts[type] = Math.min(type==='rooms'?10:20, Math.max(1, counts[type] + delta));
      document.getElementById(type + '-count').textContent = counts[type];
      document.getElementById('guests-num-giant').textContent = String(counts.guests).padStart(2,'0');
      document.getElementById('guests-sub-label').innerHTML = `Guests &bull; ${counts.rooms} Rm <span class="booking-field-caret">▾</span>`;
    }

    function setRoomType(val) {
      selectedRoomType = val;
      document.getElementById('roomtype-display').textContent = val;
      document.getElementById('roomtype-picker').classList.remove('open');
    }

    function checkAvailability() { document.getElementById('section-stays').scrollIntoView({ behavior: 'smooth' }); }

    /* ── WISHLIST ────────────────────────────────────── */
    function toggleWish(btn) { btn.classList.toggle('active'); }

    /* ── FILTER CHIPS ───────────────────────────────── */
    function setFilter(chip) {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    }

    /* ── MOBILE MAP TAB TOGGLE ──────────────────────── */
    function switchMapTab(tab) {
      const listPanel = document.getElementById('mapListPanel');
      const mapPanel  = document.getElementById('mapPanel');
      const tabList   = document.getElementById('tabList');
      const tabMap    = document.getElementById('tabMap');
      if (tab === 'list') {
        listPanel.classList.remove('hidden-mobile');
        mapPanel.classList.add('hidden-mobile');
        tabList.classList.add('active');
        tabMap.classList.remove('active');
      } else {
        mapPanel.classList.remove('hidden-mobile');
        listPanel.classList.add('hidden-mobile');
        tabMap.classList.add('active');
        tabList.classList.remove('active');
      }
    }

    /* ── BOOKING MODAL ──────────────────────────────── */
    const WHATSAPP_NUMBER = '919322273478';
    let currentHotel = {};
    const modalCounts = { rooms: 1, guests: 2 };

    function openBooking(hotel) {
      currentHotel = hotel;
      document.getElementById('modalHotelName').textContent = hotel.name;
      document.getElementById('modalHotelBrand').textContent = hotel.brand;
      document.getElementById('modalHotelImg').src = hotel.img;
      document.getElementById('modalHotelImg').alt = hotel.name;

      // Pre-fill today + tomorrow
      const today    = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      document.getElementById('modalCheckin').value  = today.toISOString().split('T')[0];
      document.getElementById('modalCheckout').value = tomorrow.toISOString().split('T')[0];

      modalCounts.rooms   = 1;
      modalCounts.guests  = 2;
      document.getElementById('modalRoomsVal').textContent  = 1;
      document.getElementById('modalGuestsVal').textContent = 2;

      updateSummary();
      document.getElementById('bookingModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeBooking() {
      document.getElementById('bookingModal').classList.remove('open');
      document.body.style.overflow = '';
    }

    function closeBookingOnOverlay(e) {
      if (e.target === document.getElementById('bookingModal')) closeBooking();
    }

    function modalCount(type, delta) {
      modalCounts[type] = Math.min(type === 'rooms' ? 10 : 20, Math.max(1, modalCounts[type] + delta));
      document.getElementById('modal' + type.charAt(0).toUpperCase() + type.slice(1) + 'Val').textContent = modalCounts[type];
      updateSummary();
    }

    function updateSummary() {
      const cin  = document.getElementById('modalCheckin').value;
      const cout = document.getElementById('modalCheckout').value;
      const price = currentHotel.price || 0;
      const rooms = modalCounts.rooms;

      document.getElementById('summaryPriceNight').textContent = '₹' + price.toLocaleString('en-IN');
      document.getElementById('summaryRooms').textContent = rooms;

      if (cin && cout) {
        const d1 = new Date(cin), d2 = new Date(cout);
        const nights = Math.max(0, Math.round((d2 - d1) / 86400000));
        document.getElementById('summaryNights').textContent = nights > 0 ? nights + (nights === 1 ? ' night' : ' nights') : '—';
        document.getElementById('summaryTotal').textContent  = nights > 0 ? '₹' + (price * rooms * nights).toLocaleString('en-IN') : '—';
      } else {
        document.getElementById('summaryNights').textContent = '—';
        document.getElementById('summaryTotal').textContent  = '—';
      }
    }

    function sendWhatsApp() {
      const cin  = document.getElementById('modalCheckin').value;
      const cout = document.getElementById('modalCheckout').value;
      const rooms   = modalCounts.rooms;
      const guests  = modalCounts.guests;
      const price   = currentHotel.price || 0;

      if (!cin || !cout) { alert('Please select check-in and check-out dates.'); return; }
      const d1 = new Date(cin), d2 = new Date(cout);
      const nights = Math.max(0, Math.round((d2 - d1) / 86400000));
      if (nights <= 0) { alert('Check-out must be after check-in.'); return; }

      const fmt = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
      };

      const total = (price * rooms * nights).toLocaleString('en-IN');

      const msg =
        `🙏 *Booking Request – Sahyadri Hotels*\n\n` +
        `🏨 *Hotel:* ${currentHotel.name}\n` +
        `🏢 *Brand:* ${currentHotel.brand}\n\n` +
        `📅 *Check-In:*  ${fmt(cin)}\n` +
        `📅 *Check-Out:* ${fmt(cout)}\n` +
        `🌙 *Nights:* ${nights}\n\n` +
        `🛏️ *Rooms:* ${rooms}\n` +
        `👥 *Guests:* ${guests}\n\n` +
        `💰 *Price per room/night:* ₹${price.toLocaleString('en-IN')}\n` +
        `💵 *Estimated Total:* ₹${total}\n\n` +
        `Please confirm my booking. Thank you! 🙏`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }

    /* ── SCROLL REVEAL ──────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));

    /* ── INIT ───────────────────────────────────────── */
    window.addEventListener('resize', prepareSlides);
    window.addEventListener('load', () => {
      document.getElementById('intro-bg').style.transform = 'scale(1)';
      prepareSlides();
      loadHotels();
    });
  
    /* -- DYNAMIC HOTELS ------------------------------- */
    async function loadHotels() {
      if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
        console.error('Supabase configuration missing');
        return;
      }
      try {
        const url = `${window.SUPABASE_URL}/rest/v1/hotels?is_active=eq.true&select=*`;
        const resp = await fetch(url, { headers: { 'apikey': window.SUPABASE_ANON_KEY } });
        if (!resp.ok) throw new Error('Failed to load hotels');
        const hotels = await resp.json();
        
        hotels.sort((a, b) => {
          if (a.manual_rank && b.manual_rank) return a.manual_rank - b.manual_rank;
          if (a.manual_rank) return -1;
          if (b.manual_rank) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });

        document.getElementById('stays-count-badge').textContent = `${hotels.length + 6} stays available near temple`;
        
        const grid = document.getElementById('stays-grid');
        grid.insertAdjacentHTML("beforeend", hotels.map((h, i) => {
          const img = h.images && h.images.length > 0 ? h.images[0] : '';
          const delay = (i % 3) + 1; // 1, 2, or 3
          const price = h.price_per_night ? '?' + h.price_per_night.toLocaleString('en-IN') : 'Contact for price';
          
          let amenitiesHtml = '';
          if (h.amenities && h.amenities.length) {
            amenitiesHtml = h.amenities.slice(0,3).map(a => `<span class="card-amenity">${a}</span>`).join('');
          }

          return `
            <div class="stay-card reveal reveal-delay-${delay} visible" onclick="window.location.href='hotel.html?slug=${h.slug}'" style="cursor:pointer; opacity:1; transform:translateY(0);">
              <div class="card-img-wrap">
                ${img ? `<img src="${img}" alt="${h.name}" loading="lazy" />` : '<div style="height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a1a;color:#555">No image</div>'}
                <button class="card-wish-btn" type="button" aria-label="Add to wishlist" onclick="event.stopPropagation(); toggleWish(this)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
              </div>
              <div class="card-body">
                <div class="card-top-row">
                  <div class="card-distance"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${h.distance_from_temple || 'Near Temple'}</div>
                </div>
                <h3 class="card-name">${h.name}</h3>
                <p class="card-brand">${h.brand || ''}</p>
                <div class="card-amenities">${amenitiesHtml}</div>
                <div class="card-footer">
                  <div class="card-price">${price} <span>/ night</span></div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      } catch(e) {
        console.error(e);
        document.getElementById('stays-grid').innerHTML = `<p style="color:#aaa; grid-column:1/-1;">Could not load hotels. Please try again later.</p>`;
      }
    }
  
