module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'tags',
      [
        {
          title: 'php',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'ruby',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: () => {},
};
