import { k8s } from "../k8s.mjs";

export const redis = { Yaml };

function Yaml({ deploy, mservice_id, mservicesMap }) {
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
      containers:
      - name: ${k8s.yaml.container.name(mservice_id)}
          image: ${image}
          command: ["/bin/sh"]
          args:
            [
              "-c",
              "cd /tmp&&ln -s /usr/local/bin/redis-server ./${deploy}_redis&&./${deploy}_redis --port ${port}",
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
  name: ${k8s.yaml.container.name(mservice_id)}
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
      protocol: TCP`;
}
