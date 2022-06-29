# Digikare - backend engineering challenge

## Build

```
npm run setup
npm run build
```

## Setup

### prerequisites

- node v16+
- k3s

**k3s install**

```
#as root
curl -sfL https://get.k3s.io | sh -s - \
--disable traefik \
--disable metrics-server \
--disable local-storage \
--disable-cloud-controller \
--disable metrics-server
```

## Annexe

## Source

[Challenge](https://github.com/didomi/challenges/blob/master/backend/README.md)
