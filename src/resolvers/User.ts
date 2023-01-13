import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePassword {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
}

@Resolver()
class UserResolver {
  @Mutation(() => User, { nullable: true })
  async registerUser(
    @Arg("options") options: UsernamePassword,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    try {
      const existingUser = await em.findOne(User, {
        username: options.username,
      });
      if (existingUser) {
        return null;
      }
      const hashPassword = await argon2.hash(options.password);
      console.log(hashPassword);
      const user = await em.create(User, {
        username: options.username,
        password: hashPassword,
      });

      em.persistAndFlush(user);
      return user;
    } catch (error) {
      return null;
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em }: MyContext,
    @Arg("options") options: UsernamePassword
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        error: { field: "username", message: "User does't exist" },
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        error: {
          field: "password",
          message: "Either username or password is incorrect!",
        },
      };
    }

    return { user };
  }

  @Query(() => [User])
  async users(@Ctx() { em }: MyContext): Promise<User[] | null> {
    const users = em.find(User, {});
    return users;
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Ctx() { em }: MyContext,
    @Arg("username") username: string
  ): Promise<boolean> {
    try {
      await em.nativeDelete(User, { username });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default UserResolver;
