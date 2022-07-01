import { k8s } from "../k8s.mjs";

// postgres anonymous data
export const postgresad = { Yaml };

function Yaml({
  deploy,
  dist_path,
  mservice_id,
  ad_user,
  ad_password,
  mservicesMap,
}) {
  const { image, port } = mservicesMap[mservice_id];

  return `apiVersion: apps/v1
kind: StatefulSet
#kind: Deployment
metadata:
  name: ${k8s.yaml.deploy.name(mservice_id)}
  namespace: ${deploy}
spec:
  serviceName: database
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
      #- name: postgresad-rw
      #  hostPath:
      #    path: ${dist_path}/data/${mservice_id}
      #    type: Directory    
      containers:
      - name: ${k8s.yaml.container.name(mservice_id)}
        image: ${image}
        #volumeMounts:
        #- name: postgresad-rw
        #  mountPath: /data/db
        env:
          - name: POSTGRES_USER
            value: ${ad_user}
          - name: POSTGRES_PASSWORD
            value: ${ad_password}
          - name: POSTGRES_DB
            value: ${ad_user}
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
      targetPort: 5432
      protocol: TCP
`;
}
