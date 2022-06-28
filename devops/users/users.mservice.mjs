export const users = { Yaml };

function Yaml({ deploy, dist_path, mservice_id, mservices }) {
  const { image, port } = mservices[mservice_id];

  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${mservice_id}-deploy
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
      - name: app-vol
        hostPath:
          path: ${dist_path}
          type: Directory
      containers:
        - name: ${mservice_id}-container
          image: ${image}
          volumeMounts:
          - name: app-vol
            mountPath: /home/node/app
          workingDir: /home/node/app
          #command: ["node"]
          #args: ['${mservice_id}']    
          command: ['/bin/sh']      
          args: ['-c', 'while true; do echo waiting; sleep 10; done']
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
  name: ${mservice_id}-svc
  namespace: ${deploy}
  labels:
    app: ${mservice_id}
spec:
  selector:
    app: ${mservice_id}
  ports:
    - name: ${mservice_id}-port
      port: ${port}
      targetPort: ${port}
      protocol: TCP`;
}
