const UserType = Object.freeze({
    STUDENT: "student",
    TEACHER: "teacher",
    PARENT: "parent",
    ADMIN:"admin"
  });
  
  const MedalType = Object.freeze({
    BRONZE: "Bronze",
    SILVER: "Silver",
    GOLD: "Gold",
    PLATINUM: "Platinum",
    DIAMOND: "Diamond",
  });
  
  const LevelType = Object.freeze({
    PRIMARY: 3,
    SECONDARY: 2,
    ADVANCED: 1,
  });

  const PostType = Object.freeze({
    Educational: 1,
    General:2
    
  })
  
  module.exports = { UserType, MedalType, LevelType, PostType };
  