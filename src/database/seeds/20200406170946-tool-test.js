// $ yarn sequelize seed:generate --name user-test
// $ yarn sequelize db:seed:all

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'tools',
      [
        {
          title: 'Hotel',
          link: 'https://github.com/hotel',
          description: 'A tool created only for testing de API',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: () => {},
};
