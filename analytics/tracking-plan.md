# +BarSportTV — Analytics Tracking Plan

**Brand**: +Bar / Mahou San Miguel
**Landing page**: mas-bar.es/masbarsporttv
**Social channel**: @masbar_oficial (Instagram)
**Last updated**: 2026-05-19
**Tools**: GA4 + Meta Pixel + Instagram Insights
**Compliance**: GDPR (Spain/EU) — consent required

---

## Business Context

This is a **B2B lead generation funnel** for a sports TV subscription service targeting Spanish bar owners (hosteleros).

**Conversion funnel:**
```
Instagram post / Story / Bio link
        ↓
mas-bar.es/masbarsporttv  (landing page)
        ↓
Phone call  OR  Callback form submission  (LEAD)
        ↓
Sales team call
        ↓
Contract signed  (REVENUE)
```

**Primary conversion**: Phone call click or form submission on the landing page
**Secondary conversions**: Instagram profile visit → link-in-bio click, Story swipe-up, DM inquiry

**Key questions this data should answer:**
1. Does Instagram drive qualified traffic to the landing page?
2. Which post types / content themes generate the most landing page visits?
3. What is the Instagram → lead conversion rate?
4. Which UTM sources produce the highest lead quality?
5. At what point do visitors drop off before converting?

---

## Tool Stack

| Tool | Purpose | Who implements |
|------|---------|---------------|
| **GA4** | Web analytics, event tracking, conversion attribution | Dev / marketing |
| **Google Tag Manager (GTM)** | Tag deployment without code deploys | Marketing |
| **Meta Pixel** | Instagram/Facebook ad retargeting, conversion tracking | Marketing |
| **Instagram Insights** | Native social metrics (reach, engagement, profile visits) | Marketing |
| **UTM parameters** | Source attribution for all Instagram links | Marketing |
| **Consent banner (CMP)** | GDPR compliance — cookie consent | Dev |

---

## Part 1: Instagram Insights Setup

### Enable Instagram Insights
Requires converting @masbar_oficial to a **Professional Account** (Creator or Business).

**Steps:**
1. Instagram → Settings → Account → Switch to Professional Account
2. Select category: "Product/Service" or "Brand"
3. Connect to a Facebook Page (required for full analytics)
4. Access Insights via the dashboard icon on profile

### Key Metrics to Track (Weekly)

| Metric | What it tells you | Target benchmark |
|--------|-------------------|-----------------|
| **Profile visits** | Awareness → consideration rate | Trending up week-over-week |
| **Link-in-bio clicks** | Instagram → landing page intent | >2% of reach per post |
| **Reach** | Unique accounts seeing content | Grow 10%/month from 1,470 base |
| **Accounts engaged** | Content resonance | >3% engagement rate |
| **Follower growth rate** | Net new audience | +50–100/month initially |
| **Story views** | Story content performance | Track per story type |
| **Reel plays / avg watch time** | Video content quality | >50% completion rate |

### Content Performance Tracking (per post)
Tag every post in a simple spreadsheet with:

```
Date | Format (Reel/Carousel/Static) | Theme | Reach | Likes | Comments | Saves | Shares | Profile visits | Link clicks
```

Themes to classify:
- `match_day` — content tied to upcoming fixtures
- `bar_tip` — operational advice for hosteleros
- `social_proof` — customer testimonials / bar stories
- `product` — BarSportTV features / content catalogue
- `beer` — Mahou / beer delivery angle
- `promotion` — seasonal offers, CTAs to contract

This lets you see which content theme drives the most link-in-bio clicks.

---

## Part 2: UTM Parameter Strategy

Every link from Instagram to the landing page must carry UTM parameters so GA4 knows where the traffic came from.

### UTM Naming Convention

All values: **lowercase, underscores**, no spaces.

| Parameter | Value | Notes |
|-----------|-------|-------|
| `utm_source` | `instagram` | Always |
| `utm_medium` | `social` | Always for organic; `paid_social` for ads |
| `utm_campaign` | See below | Describes the content context |
| `utm_content` | See below | Specific post or placement |

### Campaign Values by Context

| Content type | `utm_campaign` | `utm_content` |
|-------------|----------------|---------------|
| Bio link (default) | `bio_link` | `profile` |
| Match day Reel | `match_day` | `reel_[fixture_name]` e.g. `reel_clasico_oct` |
| Champions League post | `champions` | `carousel_oct` / `reel_oct` |
| Seasonal offer | `temporada_2526` | `reel_launch` / `story_cta` |
| Story with link | `stories` | `[content_theme]` |
| Paid Instagram ad | `bar_owners_retargeting` | `video_v1` / `carousel_v2` |

### Link Examples

**Bio link (always-on):**
```
https://mas-bar.es/masbarsporttv?utm_source=instagram&utm_medium=social&utm_campaign=bio_link&utm_content=profile
```

**Match day Reel (El Clásico):**
```
https://mas-bar.es/masbarsporttv?utm_source=instagram&utm_medium=social&utm_campaign=match_day&utm_content=reel_clasico_oct26
```

**Story CTA for season start:**
```
https://mas-bar.es/masbarsporttv?utm_source=instagram&utm_medium=social&utm_campaign=temporada_2526&utm_content=story_sept_launch
```

### Link-in-Bio Tool
Use a single link-in-bio URL (e.g. Linktree, or a custom `/instagram` redirect page on mas-bar.es) with the UTM baked in. This way you never have to update the bio link — the single URL always routes correctly and carries attribution.

Recommended: Create `mas-bar.es/ig` → redirect to `mas-bar.es/masbarsporttv?utm_source=instagram&utm_medium=social&utm_campaign=bio_link&utm_content=profile`

---

## Part 3: GA4 Events — Landing Page

### Install GA4

**Option A (GTM — recommended):**
1. Create a GTM container for mas-bar.es
2. Add GA4 Configuration tag with your Measurement ID
3. Enable Enhanced Measurement (automatic pageviews, scrolls, clicks, form interactions)

**Option B (direct):**
```html
<!-- In <head> of mas-bar.es -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Core Events to Implement

#### 1. Phone Call Click (PRIMARY CONVERSION)
Fire when a visitor clicks the phone number CTA.

```javascript
// Trigger: click on tel: link
gtag('event', 'phone_call_clicked', {
  'phone_number': '+34919437963',
  'location': 'hero_cta',          // hero_cta | sticky_mobile | footer
  'source': document.referrer,
  'utm_campaign': getUTMParam('utm_campaign')
});
```

**Mark as conversion in GA4 Admin → Conversions.**

#### 2. Callback Form Submission (PRIMARY CONVERSION)
Fire on successful form submission (callback request).

```javascript
// Trigger: form submit success (not just button click)
gtag('event', 'callback_form_submitted', {
  'form_location': 'hero',         // hero | mid_page | footer
  'utm_source': getUTMParam('utm_source'),
  'utm_campaign': getUTMParam('utm_campaign'),
  'utm_content': getUTMParam('utm_content')
});
```

**Mark as conversion in GA4 Admin → Conversions.**

#### 3. Scroll Depth
Track how far visitors scroll — critical for understanding if they reach CTAs below the fold.

```javascript
// GA4 Enhanced Measurement handles this automatically
// Enable: Admin → Data Streams → Enhanced Measurement → Scrolls ON
// Default: fires at 90% scroll
// Custom: add triggers at 25%, 50%, 75%
```

#### 4. CTA Section Visibility
Fire when a visitor's viewport reaches each main CTA.

```javascript
// Via GTM: Intersection Observer or Element Visibility trigger
gtag('event', 'cta_section_viewed', {
  'section_name': 'hero_cta',       // hero_cta | comparison_table | pricing | form
  'scroll_depth_pct': 25
});
```

#### 5. Outbound Click (if any external links)
```javascript
gtag('event', 'outbound_click', {
  'link_url': clickedURL,
  'link_text': clickedText
});
```

#### 6. Video Play (if video exists on page)
```javascript
gtag('event', 'video_play', {
  'video_title': 'BarSportTV Explainer',
  'video_provider': 'youtube'       // or 'vimeo' | 'native'
});
```

### Event Naming Summary

| Event | Conversion? | Priority |
|-------|-------------|----------|
| `phone_call_clicked` | ✅ Yes | Critical |
| `callback_form_submitted` | ✅ Yes | Critical |
| `cta_section_viewed` | No | High |
| `scroll_depth` | No | High |
| `video_play` | No | Medium |
| `outbound_click` | No | Low |

### Custom Dimensions

Register these in GA4 Admin → Custom Definitions:

| Dimension | Scope | Parameter | Purpose |
|-----------|-------|-----------|---------|
| `utm_campaign` | Event | `utm_campaign` | Track campaign attribution per conversion |
| `utm_content` | Event | `utm_content` | Track post-level attribution |
| `cta_location` | Event | `location` | Which CTA placement converts best |

---

## Part 4: Meta Pixel

Install the Meta Pixel to:
1. Build a retargeting audience of landing page visitors who didn't convert
2. Track form submissions as Meta conversion events
3. Create lookalike audiences from converters for paid Instagram ads

### Implementation

```html
<!-- In <head> of mas-bar.es/masbarsporttv -->
<script>
!function(f,b,e,v,n,t,s){...}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

### Key Meta Events

```javascript
// On callback form submission
fbq('track', 'Lead', {
  content_name: 'BarSportTV Callback Request',
  content_category: 'hosteleria'
});

// On phone click
fbq('track', 'Contact');
```

### Audiences to Create

| Audience | Definition | Use for |
|----------|------------|---------|
| Landing page visitors | Visited /masbarsporttv in last 30d | Retargeting |
| Non-converters | Visited but no Lead event in 30d | Retargeting with different creative |
| Converters | Lead event fired | Exclusion from acquisition ads |
| Lookalike 1% | Based on converters | New acquisition |

---

## Part 5: Reporting Dashboard

### Weekly Instagram Report (manual, 15 min)

Pull from Instagram Insights every Monday:

| Metric | This week | Last week | Delta |
|--------|-----------|-----------|-------|
| Reach | | | |
| Profile visits | | | |
| Link clicks | | | |
| New followers | | | |
| Top post (reach) | | | |
| Top post (link clicks) | | | |

### GA4 Dashboard (automated)

Create a GA4 Exploration or Looker Studio report tracking:

1. **Traffic from Instagram** — Sessions by source/medium filtered to `instagram / social`
2. **Conversion rate** — `phone_call_clicked` + `callback_form_submitted` ÷ sessions
3. **Campaign performance** — Conversions by `utm_campaign` and `utm_content`
4. **Scroll depth** — % of visitors reaching 50%, 75%, 90% scroll
5. **Top converting content** — Which Instagram post UTMs drove the most leads

### Monthly Attribution Report

Answer these questions monthly:
- How many leads came from Instagram? (GA4 source/medium)
- Which specific post drove the most leads? (utm_content breakdown)
- What was the Instagram → lead conversion rate vs. other channels?
- What content theme (match_day / social_proof / product) drove the most clicks?

---

## Part 6: GDPR Compliance (Spain/EU)

**Required before deploying any tracking:**

1. **Cookie consent banner** — Must appear before GA4 or Meta Pixel fires
   - Recommended tool: Cookiebot, CookieYes, or Axeptio (Spanish-friendly)
   - Categories: Necessary / Analytics / Marketing
   - GA4 should only fire after analytics consent
   - Meta Pixel should only fire after marketing consent

2. **GA4 Consent Mode v2** — Required for EU properties
```javascript
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'wait_for_update': 500
});
// Update after user accepts:
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

3. **IP anonymization** — Enabled by default in GA4 (no action needed)
4. **Data retention** — Set to 14 months in GA4 Admin → Data Settings
5. **No PII in events** — Never include email, phone, or name in GA4 properties

---

## Implementation Priority

| Step | Owner | Effort | Priority |
|------|-------|--------|----------|
| Install GTM on mas-bar.es | Dev | 30 min | Critical |
| Set up GA4 property + data stream | Marketing | 30 min | Critical |
| Add GA4 tag via GTM | Marketing | 15 min | Critical |
| Implement consent banner | Dev | 2–4h | Critical (GDPR) |
| Track `phone_call_clicked` | Dev/GTM | 1h | Critical |
| Track `callback_form_submitted` | Dev/GTM | 1h | Critical |
| Enable Enhanced Measurement | Marketing | 5 min | High |
| UTM parameters on bio link | Marketing | 15 min | High |
| Meta Pixel install | Dev/Marketing | 1h | High |
| UTM strategy for all posts | Marketing | 1h (doc) | High |
| Custom GA4 dimensions | Marketing | 30 min | Medium |
| Looker Studio dashboard | Marketing | 2h | Medium |
| Instagram Insights spreadsheet | Marketing | 30 min | Medium |
| Retargeting audiences in Meta | Marketing | 30 min | Medium |

---

## Quick-Start Checklist

- [ ] GA4 property created (get Measurement ID: G-XXXXXXXXXX)
- [ ] GTM container created and snippet on mas-bar.es
- [ ] GA4 Configuration tag live in GTM
- [ ] Enhanced Measurement enabled
- [ ] Cookie consent banner live (GDPR — do this FIRST)
- [ ] GA4 Consent Mode v2 configured
- [ ] `phone_call_clicked` event firing and marked as conversion
- [ ] `callback_form_submitted` event firing and marked as conversion
- [ ] Bio link updated with UTM parameters
- [ ] UTM naming convention documented and shared with content team
- [ ] Meta Pixel installed and Lead event firing
- [ ] @masbar_oficial switched to Professional Account
- [ ] Instagram Insights weekly tracking spreadsheet created
