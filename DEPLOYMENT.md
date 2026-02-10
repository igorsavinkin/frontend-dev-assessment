# VPS Deployment (Debian 11, no Docker)

This guide deploys the app on a Debian 11 VPS with systemd + nginx.

## Prerequisites

- VPS OS: Debian 11
- Domain or subdomain pointing to the VPS IP
- SSH access with sudo privileges

## 1) Install Node.js and nginx

```bash
sudo apt update
sudo apt install -y curl git nginx

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v
```

## 2) Clone and build the app

```bash
sudo mkdir -p /var/www/frontend-dev-assessment
sudo chown -R $USER:$USER /var/www/frontend-dev-assessment
cd /var/www/frontend-dev-assessment

git clone <YOUR_REPO_URL> .
npm ci
npm run build
```

## 3) Create a systemd service

Create `/etc/systemd/system/frontend-dev-assessment.service`:

```
[Unit]
Description=Next.js app
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/frontend-dev-assessment
ExecStart=/usr/bin/npm run start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=5000
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now frontend-dev-assessment
sudo systemctl status frontend-dev-assessment
```

If it fails, check logs:

```bash
sudo journalctl -u frontend-dev-assessment -n 50 --no-pager
```

## 4) Nginx reverse proxy

If you use FastPanel, edit the generated config (example):

```
/etc/nginx/fastpanel2-available/webscraping__usr/frontend-app.webscraping.pro.conf
```

Use these locations (important for Next.js assets):

```
location ^~ /_next/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_cache_bypass $http_upgrade;
}

location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Remove or disable any `location ~* \.(css|js|...)` static block that uses `try_files`,
because it breaks `/_next/static/*`.

Apply nginx config:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5) DNS

Create an A record:

```
frontend-app.webscraping.pro -> 178.208.88.6
```

Wait for DNS propagation (5–30 minutes). Verify:

```bash
nslookup frontend-app.webscraping.pro 1.1.1.1
```

## 6) Health checks

```bash
curl -I http://127.0.0.1:5000
curl -I http://frontend-app.webscraping.pro
```

## 7) HTTPS (optional)

If FastPanel has SSL automation, enable it for the subdomain.
Otherwise:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d frontend-app.webscraping.pro
```
