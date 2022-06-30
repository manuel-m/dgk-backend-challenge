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
--disable metrics-server \
--write-kubeconfig-mode 644
```

## Annexe

### Source

[Challenge](https://github.com/didomi/challenges/blob/master/backend/README.md)

### postgresql

```
#psql debug (from container)
psql -u <pi_user>

#psql shortcuts

\d 	  list of all tables
\d+ 	list of all relations
\d    [table name] 	list of the columns, indexes and relations for the [table name]
\dn 	list of all schemas (namespaces)
\l 	  list of all databases
\z 	  list tables with access privileges
```
