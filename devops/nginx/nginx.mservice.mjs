import { k8s } from "../k8s.mjs";

export const nginx = { Yaml, Xtra: [NginxConfTemplate] };

function NginxConfTemplate({ deploy, dist_path, mservice_id, mservices }) {
  return [
    {
      content: _Content(),
      path: `${dist_path}/nginx.conf.template`,
    },
  ];

  function _Content() {
    return `user  nginx;
worker_processes  auto;

error_log  /dev/stdout info;
pid        /tmp/nginx.pid;
  
events {
    worker_connections  1024;
}
 
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path       /tmp/proxy_temp_path;
    fastcgi_temp_path     /tmp/fastcgi_temp;
    uwsgi_temp_path       /tmp/uwsgi_temp;
    scgi_temp_path        /tmp/scgi_temp;

    log_format  main  'nginx - $remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log off;
    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;
    client_max_body_size 20M;
    server {
      listen 80;
      resolver kube-dns.kube-system.svc.cluster.local;
      ${_ContentProxy("users")}
    }
    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
    `;
  }

  function _ContentProxy(target_mservice_id) {
    const serviceName = k8s.yaml.service.name(target_mservice_id);

    return `
    set $${target_mservice_id} ${serviceName}.${deploy}.svc.cluster.local;
    #${target_mservice_id}
    location /${target_mservice_id} {
      proxy_pass http://$${target_mservice_id}:5555;
      proxy_read_timeout  90;
    }
  }
  `;
  }
}
function Yaml({ deploy, dist_path, mservice_id, mservices }) {
  const { image, port } = mservices[mservice_id];

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
      #volumes:
      #  - name: nginxconf-file-tpl
      #    hostPath:
      #      path: ${dist_path}/nginx.conf.template
      #      type: File
      containers:
        - name: ${k8s.yaml.container.name(mservice_id)}
          image: ${image}
          #command: ['/bin/sh']
          #args: ['-c', 'while true; do echo waiting; sleep 10; done']
          #imagePullPolicy: 'Never'
          #env:
          #- name: NGINX_ENVSUBST_OUTPUT_DIR
          #  value: /etc/nginx
          #volumeMounts:
          #  - name: nginxconf-file-tpl
          #    mountPath: /etc/nginx/templates/nginx.conf.template
          #    readOnly: true
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
