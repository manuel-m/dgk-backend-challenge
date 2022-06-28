export const k8s = { sbin: { start, watch } };

function start({ deploy, mservices_enabled }) {
  return [
    "#k3s start sequence",
    `kubectl create namespace ${deploy}`,
    ...mservices_enabled.map(
      (mservice_id) =>
        `kubectl apply -f dist/${mservice_id}/${mservice_id}.yaml`
    ),
  ].join("\n");
}

function watch({ deploy }) {
  return `watch -t kubectl get pods,svc,ep,deployment -n=${deploy}`;
}
