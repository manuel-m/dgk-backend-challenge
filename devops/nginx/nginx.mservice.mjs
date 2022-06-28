export const nginx = { Dockerfile };

function Dockerfile({ deploy, mservice_id, mservices }) {
  const { image, port } = mservices[mservice_id];

  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${mservice_id}-deployment
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
      #      path: /home/gal/app/${deploy}/etc/nginx/templates/nginx.conf.template
      #      type: File
      containers:
        - name: nginx-container
          image: ${image}
          #command: ['/bin/sh']
          #args: ['-c', 'while true; do echo waiting; sleep 10; done']
          #imagePullPolicy: 'Never'
          #env:
          #- name: NGINX_ENVSUBST_OUTPUT_DIR
          #  value: /etc/nginx
          #- name: I4B_IP
          #  valueFrom:
          #    fieldRef:
          #      fieldPath: status.hostIP
          #volumeMounts:
          #  - name: nginxconf-file-tpl
          #    mountPath: /etc/nginx/templates/nginx.conf.template
          #    readOnly: true
---
apiVersion: v1
kind: Service
metadata:
  name: ${mservice_id}-svc
  namespace: ${deploy}
  labels:
    app: ${mservice_id}
spec:
  selector:
    app: ${mservice_id}
  ports:
    - name: nginx-http-net-listen-port
      port: ${port}
      targetPort: 80
      protocol: TCP     
  type: LoadBalancer`;
}
