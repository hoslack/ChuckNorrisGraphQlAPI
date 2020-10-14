import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { UserError, AuthError, ConflictError } from '../utils/errors';
import { User } from '../entity/User'
import { signInResponse, IContext, signUpResponse } from '../utils/customTypes'
import { createAccessToken, createRefreshToken, isAuthenticated } from '../utils/helpers'

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuthenticated)
  users(){
    return User.find()
  }

  @Mutation(() => signInResponse)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: IContext
    ): Promise<signInResponse>
  {
    const user = await User.findOne({where:{email}})
    if(!user){
      throw new UserError({
        data: {
          key: 'email'
        },
        internalData: {
          error: 'The user email does not exist'
        }
      })
    }

    const valid = await compare(password, user.password)
    if(!valid){
      throw new AuthError({
        data: {
          key: 'password'
        },
        internalData: {
          error: 'Wrong email or password provided'
        }
      });
    }
    ctx.res.cookie('jid', createRefreshToken(user), {httpOnly: true})
    let response = new signInResponse()
    response.accessToken = createAccessToken(user)
    return response
  }

  @Mutation(() => signUpResponse)
  async signUp(
    @Arg('email') email: string,
    @Arg('password') password: string
    ):Promise<signUpResponse>
  {
    const user = await User.findOne({where:{email}})
    if(user){
      throw new ConflictError({
        data: {
          key: 'email'
        },
        internalData: {
          error: 'The user email already exists, please sign in'
        }
      })
    }
    const hashedPassword = await hash(password, 12)
    try{
      await User.insert({email, password: hashedPassword})
    } catch (err){
      throw new UserError({
        data: {
          key: 'internal Error '
        },
        internalData: {
          error: 'An error occurred, please try again'
        }
      })
    }
    const response = new signUpResponse()
    response.email = email
    return response
  }

}