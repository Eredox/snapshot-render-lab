#!/bin/sh
set -eu

domain="www.nova.eredox.com"
lineage="${RENEWED_LINEAGE:-/etc/letsencrypt/live/$domain}"
nginx_container="nova_compliance_nginx"

fullchain="$lineage/fullchain.pem"
privkey="$lineage/privkey.pem"
[ -r "$fullchain" ]
[ -r "$privkey" ]

cert_dir="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination \"/etc/nginx/certs\"}}{{.Source}}{{end}}{{end}}' "$nginx_container")"
[ -n "$cert_dir" ]

stage_dir="$(mktemp -d /opt/nova/secrets/.nova-public-tls-stage.XXXXXX)"
backup_dir="$(mktemp -d /opt/nova/secrets/.nova-public-tls-backup.XXXXXX)"

cleanup() {
    rm -rf "$stage_dir" "$backup_dir"
}
trap cleanup EXIT HUP INT TERM

install -o root -g root -m 644 "$fullchain" "$stage_dir/$domain.fullchain.pem"
install -o root -g root -m 640 "$privkey" "$stage_dir/$domain.privkey.pem"

if [ -f "$cert_dir/$domain.fullchain.pem" ]; then
    install -o root -g root -m 644 "$cert_dir/$domain.fullchain.pem" "$backup_dir/$domain.fullchain.pem"
fi
if [ -f "$cert_dir/$domain.privkey.pem" ]; then
    install -o root -g root -m 640 "$cert_dir/$domain.privkey.pem" "$backup_dir/$domain.privkey.pem"
fi

restore_previous() {
    if [ -f "$backup_dir/$domain.fullchain.pem" ]; then
        mv -f "$backup_dir/$domain.fullchain.pem" "$cert_dir/$domain.fullchain.pem"
    fi
    if [ -f "$backup_dir/$domain.privkey.pem" ]; then
        mv -f "$backup_dir/$domain.privkey.pem" "$cert_dir/$domain.privkey.pem"
    fi
    docker kill -s HUP "$nginx_container" >/dev/null 2>&1 || true
}

mv -f "$stage_dir/$domain.fullchain.pem" "$cert_dir/$domain.fullchain.pem"
mv -f "$stage_dir/$domain.privkey.pem" "$cert_dir/$domain.privkey.pem"

if ! docker exec "$nginx_container" nginx -t >/dev/null 2>&1; then
    restore_previous
    exit 1
fi

if ! docker kill -s HUP "$nginx_container" >/dev/null 2>&1; then
    restore_previous
    exit 1
fi

sleep 1
if ! docker exec "$nginx_container" nginx -t >/dev/null 2>&1; then
    restore_previous
    exit 1
fi
