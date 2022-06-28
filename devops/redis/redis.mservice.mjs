export const redis = { Dockerfile };

function Dockerfile({ deploy, mservice_id, mservices }) {
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
      containers:
        - name: ${mservice_id}-container
          image: ${image}
          command: ["/bin/sh"]
          args:
            [
              "-c",
              "cd /tmp&&ln -s /usr/local/bin/redis-server ./${deploy}_redis&&./${deploy}_redis --port 5555",
            ]
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
