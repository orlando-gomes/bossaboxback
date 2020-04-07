// $ yarn sequelize seed:generate --name user-test
// $ yarn sequelize db:seed:all

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'tooltags',
      [
        {
          toolid: '1',
          tagid: '1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          toolid: '1',
          tagid: '2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: () => {},
};
