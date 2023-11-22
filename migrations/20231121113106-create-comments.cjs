'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      comment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Projects", // Users 모델을 참조한다.
          key: "project_id", // Users 모델의 user_id 참조한다.
        },
        onDelete: 'NO ACTION' // 만약 Users 모델의 user_id가 삭제되면, Comments 모델의 데이터가 삭제된다.
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // Project 모델을 참조한다.
          key: "user_id", // Project 모델의 project_id 참조한다.
        },
        onDelete: 'NO ACTION' // 만약 Project 모델의 project_id 삭제되면, Comments 모델의 데이터가 삭제된다.
      },
      contents: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};