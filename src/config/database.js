module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'bossaboxback',
  define: {
    timestamps: true,
    underscored: true,
    undescoredAll: true,
  },
};
