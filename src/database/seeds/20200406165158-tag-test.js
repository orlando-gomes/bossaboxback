module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'tags',
      [
        {
          title: 'PHP',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'C++',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: () => {},
};
