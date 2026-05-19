/**
 * +BarSportTV — GA4 Event Tracking Snippets
 * Landing page: mas-bar.es/masbarsporttv
 *
 * Prerequisites:
 * - GTM container installed on page
 * - GA4 Configuration tag live in GTM (Measurement ID: G-XXXXXXXXXX)
 * - Cookie consent banner implemented (fire events only after consent)
 *
 * Deploy via GTM Custom HTML tag or directly in page <script> tags.
 */

// ─── Utility: read UTM params from URL ────────────────────────────────────────

function getUTMParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || '(not set)';
}

// ─── 1. Phone Call Click ──────────────────────────────────────────────────────
// GTM Trigger: Click - Just Links, Click URL contains "tel:"
// Mark as Conversion in GA4 Admin → Conversions

document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
  el.addEventListener('click', function() {
    gtag('event', 'phone_call_clicked', {
      phone_number: this.href.replace('tel:', ''),
      location: this.dataset.ctaLocation || 'unknown', // add data-cta-location attr to each tel: link
      utm_source: getUTMParam('utm_source'),
      utm_campaign: getUTMParam('utm_campaign'),
      utm_content: getUTMParam('utm_content')
    });

    // Meta Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Contact');
    }
  });
});

// ─── 2. Callback Form Submission ──────────────────────────────────────────────
// GTM Trigger: Form Submission, or fire on success callback from your form handler
// Mark as Conversion in GA4 Admin → Conversions

function trackCallbackFormSubmit(formLocation) {
  gtag('event', 'callback_form_submitted', {
    form_location: formLocation || 'unknown', // 'hero' | 'mid_page' | 'footer'
    utm_source: getUTMParam('utm_source'),
    utm_medium: getUTMParam('utm_medium'),
    utm_campaign: getUTMParam('utm_campaign'),
    utm_content: getUTMParam('utm_content')
  });

  // Meta Pixel — Lead event
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_name: 'BarSportTV Callback Request',
      content_category: 'hosteleria'
    });
  }
}

// Usage: call trackCallbackFormSubmit('hero') on your form's success handler
// Example with a form element:
var callbackForm = document.querySelector('#callback-form');
if (callbackForm) {
  callbackForm.addEventListener('submit', function(e) {
    // Fire after server confirms success, not just on button click
    trackCallbackFormSubmit('hero');
  });
}

// ─── 3. CTA Section Visibility ────────────────────────────────────────────────
// Fires when key sections scroll into the viewport
// Tells you how many visitors actually SEE each CTA

var ctaSections = [
  { selector: '#hero-cta', name: 'hero_cta' },
  { selector: '#comparison-table', name: 'comparison_table' },
  { selector: '#callback-form', name: 'callback_form' },
  { selector: '#social-proof', name: 'social_proof' }
];

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        gtag('event', 'cta_section_viewed', {
          section_name: entry.target.dataset.sectionName
        });
        observer.unobserve(entry.target); // fire once per session
      }
    });
  }, { threshold: 0.5 });

  ctaSections.forEach(function(section) {
    var el = document.querySelector(section.selector);
    if (el) {
      el.dataset.sectionName = section.name;
      observer.observe(el);
    }
  });
}

// ─── 4. GA4 Consent Mode v2 ────────────────────────────────────────────────────
// Must run BEFORE gtag('config', ...) — place in <head> before GTM snippet
// Update these defaults based on your CMP (Cookiebot, CookieYes, etc.)

// Default: all denied (GDPR compliant)
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});

// Call this after user grants analytics consent
function grantAnalyticsConsent() {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}

// Call this after user grants marketing consent (for Meta Pixel / ads)
function grantMarketingConsent() {
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted'
  });
}

// ─── 5. GTM dataLayer — use these pushes if implementing via GTM ──────────────

// Phone call click (push to dataLayer, then create GTM trigger on this event)
function dlPhoneCallClick(location) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'phone_call_clicked',
    cta_location: location,
    utm_source: getUTMParam('utm_source'),
    utm_campaign: getUTMParam('utm_campaign'),
    utm_content: getUTMParam('utm_content')
  });
}

// Callback form success (push to dataLayer)
function dlCallbackFormSubmit(formLocation) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'callback_form_submitted',
    form_location: formLocation,
    utm_source: getUTMParam('utm_source'),
    utm_campaign: getUTMParam('utm_campaign'),
    utm_content: getUTMParam('utm_content')
  });
}
