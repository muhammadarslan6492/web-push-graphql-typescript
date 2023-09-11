import { extendType, nonNull, objectType, stringArg } from "nexus";
import { User } from "../../db/entities/User";
import { Notification } from "../../db/entities/Notification";
import sockerServer from "../../index";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("username");
  },
});

export const UserMutation = extendType({
  type: "Mutation", // This should be "Mutation" as it's modifying data
  definition(t) {
    t.nonNull.field("createUser", {
      type: UserType, // Use the UserType here
      args: {
        username: nonNull(stringArg()),
      },
      resolve(_parent, args, _context, _info): Promise<User> {
        const { username } = args;
        let user = User.create({ username });
        return user.save();
      },
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("users", {
      type: UserType,
      resolve: async (_parent, _args, _context, _info): Promise<User[]> => {
        //const { conn } = context;
        //return conn.query(`select * from product`);
        const users = await User.find();
        for (const user of users) {
          const notification = await Notification.create({
            message: "Admin view your profile",
            user: user,
          });

          console.log(notification);
          const message = `Hi ${user.username}. Admin view all users list`;
          const userId = JSON.stringify(user.id);
          sockerServer.generateNotification(userId, message);
        }
        return users;
      },
    });
  },
});
