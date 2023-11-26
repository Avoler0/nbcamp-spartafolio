'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      project_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      like: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      team_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      over_view: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      view: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      tech_stack: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      github_address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      demo_site: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      core_function: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT('long'),
      },
      images_path: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};