# Aesthetic Nursing P&P — Main Website (static)

Public marketing site for Aesthetic Nursing Policy & Procedures, Inc.

- `index.html` — homepage (Accusation Review, self-audit, consulting, CE, RN-to-Owner, contact)
- `blueprint/` — the free Binder Blueprint (90-second state + menu tool)
- `assets/` — images and the Findings Brief PDF

Hosting: GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/root`).
Custom domain: `aestheticnursingpnp.com` (see `CNAME`). DNS is managed in Cloudflare.

Forms send through EmailJS (lead template `template_igi8str`, brief template `template_jhitevp`)
to cindiaestheticnurse@gmail.com. Settings live at the top of `home.js`.

The Manual Builder is a separate private app at https://theaestheticmanual.com (hosted on Render).
The master manual template is NOT part of this repository.
