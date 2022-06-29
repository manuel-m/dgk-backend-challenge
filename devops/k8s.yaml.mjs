export const yaml = {
  container: {
    name(mservice_id) {
      return `${mservice_id}-container`;
    },
  },
  deploy: {
    name(mservice_id) {
      return `${mservice_id}-deploy`;
    },
  },
  port: {
    name(mservice_id) {
      return `${mservice_id}-port`;
    },
  },
  service: {
    name(mservice_id) {
      return `${mservice_id}-svc`;
    },
  },
};
