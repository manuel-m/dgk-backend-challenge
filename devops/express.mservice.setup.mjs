import { k8s } from "./k8s.mjs";

export function Yaml({
  ad_user,
  ad_password,
  deploy,
  dist_path,
  pi_user,
  pi_password,
  mservice_id,
  mservicesMap,
}) {
  const { image, port } = mservicesMap[mservice_id];

  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${k8s.yaml.deploy.name(mservice_id)}
  namespace: ${deploy}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${mservice_id}
  template:
    metadata:
      labels:
        app: ${mservice_id}
    spec:
      volumes:
      - name: app-file
        hostPath:
          path: ${dist_path}/app/${mservice_id}.js
          type: File
      containers:
        - name: ${k8s.yaml.container.name(mservice_id)}
          image: ${image}
          volumeMounts:
          - name: app-file
            mountPath: /home/node/${mservice_id}.js
          workingDir: /home/node/
          command: ["node"]
          args: ['${mservice_id}.js']    
          #command: ['/bin/sh']      
          #args: ['-c', 'while true; do echo waiting; sleep 10; done']
          # imagePullPolicy: "Never"
          # non root user
          securityContext:
            runAsUser: 1000
            runAsGroup: 1000
            allowPrivilegeEscalation: false
          env:
          - name: PI_USER
            value: ${pi_user}
          - name: PI_PASSWORD
            value: ${pi_password}
          - name: AD_USER
            value: ${ad_user}
          - name: AD_PASSWORD
            value: ${ad_password}            
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
      targetPort: ${port}
      protocol: TCP
`;
}
