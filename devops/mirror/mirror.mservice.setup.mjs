import { k8s } from "../k8s.mjs";

export const mirror = { Yaml };

function Yaml({ deploy, dist_path, mservice_id, mservicesMap }) {
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
      - name: data-dir
        hostPath:
          path: ${dist_path}/data
          type: Directory
      containers:
        - name: ${k8s.yaml.container.name(mservice_id)}
          image: ${image}
          volumeMounts:
          - name: app-file
            mountPath: /home/node/${mservice_id}.js
            readOnly: true
          - name: data-dir
            mountPath: /home/node/data
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
