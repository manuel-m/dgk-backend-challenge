import { k8s } from "../k8s.mjs";

export const nginx = { Yaml, hookSyncArray: [NginxConfTemplate] };

function NginxConfTemplate({ deploy, dist_path, mservice_id, mservicesMap }) {
  return {
    content: _Content(),
    absPath: _template_path({ dist_path, mservice_id }),
  };

  function _Content() {
    return `user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    server {
      listen 80;
      resolver kube-dns.kube-system.svc.cluster.local;
      
      ${Object.keys(mservicesMap)
        .filter((id) => mservicesMap[id].proxy_pass)
        .map(_ContentProxy)
        .join("\n")}

      mirror /mirror;
      mirror_request_body on;

      set $mirror mirror-svc.${deploy}.svc.cluster.local;
      #mirror
      location /mirror {
        internal;
        proxy_pass http://$mirror:${mservicesMap.mirror.port}$request_uri;
      }
    }

    #gzip  on;

    #include /etc/nginx/conf.d/*.conf;
}
  `;

    function _ContentProxy(id) {
      const mservice = mservicesMap[id];
      const serviceName = k8s.yaml.service.name(id);

      return `
    set $${id} ${serviceName}.${deploy}.svc.cluster.local;
    #${id}
    location /${mservice.proxy_pass} {
      proxy_pass http://$${id}:${mservice.port}$request_uri;
      proxy_read_timeout  90;
    }`;
    }
  }
}

function Yaml({ deploy, dist_path, mservice_id, mservicesMap }) {
  const { image, port } = mservicesMap[mservice_id];

  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${k8s.yaml.deploy.name(mservice_id)}
  namespace: ${deploy}
spec:
  selector:
    matchLabels:
      app: ${mservice_id}
  template:
    metadata:
      labels:
        app: ${mservice_id}
    spec:
      volumes:
        - name: nginxconf-file-tpl
          hostPath:
            path: ${_template_path({ dist_path, mservice_id })}
            type: File
      containers:
        - name: ${k8s.yaml.container.name(mservice_id)}
          image: ${image}
          #command: ['/bin/sh']
          #args: ['-c', 'while true; do echo waiting; sleep 10; done']
          #imagePullPolicy: 'Never'
          env:
          - name: NGINX_ENVSUBST_OUTPUT_DIR
            value: /etc/nginx
          volumeMounts:
            - name: nginxconf-file-tpl
              mountPath: /etc/nginx/templates/nginx.conf.template
              readOnly: true
---
apiVersion: v1
kind: Service
metadata:
  name: ${k8s.yaml.service.name(mservice_id)}
  namespace: ${deploy}
  labels:
    app: ${mservice_id}
spec:
  selector:
    app: ${mservice_id}
  ports:
    - name: ${k8s.yaml.port.name(mservice_id)}
      port: ${port}
      targetPort: 80
      protocol: TCP     
  type: LoadBalancer`;
}

function _template_path({ dist_path, mservice_id }) {
  return `${dist_path}/${mservice_id}.nginx.conf.template`;
}
