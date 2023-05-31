module.exports = {
  defaultSubs: {
    groups: process.env.DEFAULT_SUB_GROUPS
      ? process.env.DEFAULT_SUB_GROUPS.split(',')
      : [],
    users: process.env.DEFAULT_SUB_USERS
      ? process.env.DEFAULT_SUB_USERS.split(',')
      : [],
  },
};
