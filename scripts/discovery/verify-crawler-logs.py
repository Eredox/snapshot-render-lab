#!/usr/bin/env python3
"""Corroborate crawler traffic in nginx access logs by OFFICIAL identity methods (a User-Agent string alone proves nothing).

  ssh Server1 'docker logs --since 168h nova_compliance_nginx 2>&1' | python scripts/discovery/verify-crawler-logs.py [--exclude-ip 203.0.113.9]

Methods: Googlebot / Bingbot = reverse DNS then forward-confirm; OAI-SearchBot, GPTBot, PerplexityBot, Perplexity-User = the vendor's
published IP-range JSON (fetched at run time). Crawlers without a published method (for example Claude-*) are reported as
"no official method" and are NEVER counted as verified. IP addresses are used in memory only and are never printed.
Log format expected (nova_compliance_nginx): $remote_addr - $remote_user [$time_local] "$request" $status $bytes "$referer" "$ua" $time
The log does not record the Host header, so traffic for other virtual hosts on the same nginx cannot be separated; judge by path.
"""
import collections, datetime, ipaddress, json, re, socket, sys, urllib.request

RX = re.compile(r'^(\S+) - \S+ \[([^\]]+)\] "(\S+) (\S+)[^"]*" (\d+) (\d+) "[^"]*" "([^"]*)"')
FAMILIES = ["googlebot", "bingbot", "oai-searchbot", "claude-searchbot", "claudebot", "claude-user", "perplexitybot",
            "perplexity-user", "gptbot", "chatgpt-user", "duckduckbot", "applebot", "yandexbot", "baiduspider", "ccbot"]
RDNS = {"googlebot": (".googlebot.com", ".google.com"), "bingbot": (".search.msn.com",), "applebot": (".applebot.apple.com",),
        "duckduckbot": None}
RANGES = {"oai-searchbot": "https://openai.com/searchbot.json", "gptbot": "https://openai.com/gptbot.json",
          "chatgpt-user": "https://openai.com/chatgpt-user.json",
          "perplexitybot": "https://www.perplexity.com/perplexitybot.json", "perplexity-user": "https://www.perplexity.com/perplexity-user.json"}


def fetch_ranges(url):
    try:
        data = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "nova-verify/1.0"}), timeout=20))
        return [ipaddress.ip_network(p.get("ipv4Prefix") or p.get("ipv6Prefix")) for p in data.get("prefixes", [])]
    except Exception:
        return None


def rdns_ok(ip, suffixes):
    try:
        host = socket.gethostbyaddr(ip)[0].lower()
        return ip in {a[4][0] for a in socket.getaddrinfo(host, None)} and host.endswith(suffixes)
    except Exception:
        return False


exclude = set(sys.argv[sys.argv.index("--exclude-ip") + 1].split(",")) if "--exclude-ip" in sys.argv else set()
rows = []
for line in sys.stdin:
    m = RX.match(line)
    if not m:
        continue
    ip, ts, method, path, status, size, ua = m.groups()
    fam = next((f for f in FAMILIES if f in ua.lower()), None)
    if fam and ip not in exclude:
        rows.append((fam, ip, ts, path.split("?")[0], status, ua))

ranges = {f: fetch_ranges(u) for f, u in RANGES.items()}
cache = {}
print(f"{'crawler':18} {'requests':>8} {'ips':>4} {'verified':>8}  method / statuses / sample website paths (verified only)")
for fam in FAMILIES:
    rs = [r for r in rows if r[0] == fam]
    if not rs:
        continue
    ips = collections.Counter(r[1] for r in rs)
    def verified(ip):
        if (fam, ip) in cache:
            return cache[(fam, ip)]
        if RDNS.get(fam):
            ok, how = rdns_ok(ip, RDNS[fam]), "reverse DNS + forward confirm"
        elif ranges.get(fam):
            a = ipaddress.ip_address(ip); ok, how = any(a in n for n in ranges[fam]), "vendor-published IP ranges"
        else:
            ok, how = False, "no official method available (not counted as verified)"
        cache[(fam, ip)] = (ok, how)
        return cache[(fam, ip)]
    ver = [r for r in rs if verified(r[1])[0]]
    how = verified(next(iter(ips)))[1]
    paths = collections.Counter(r[3] for r in ver if not r[3].startswith(("/api", "/assets"))).most_common(4)
    sts = dict(collections.Counter(r[4] for r in ver))
    days = sorted({r[2][:11] for r in ver}, key=lambda d: datetime.datetime.strptime(d, '%d/%b/%Y'))
    print(f"{fam:18} {len(rs):8} {len(ips):4} {len(ver):8}  {how}; statuses={sts}; days={days[0] if days else '-'}..{days[-1] if days else '-'}; paths={[p for p, _ in paths]}")
