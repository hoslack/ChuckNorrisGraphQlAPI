import { ObjectType, Field } from 'type-graphql'
import { Request, Response } from 'express'

@ObjectType()
export class signInResponse {
  @Field()
  accessToken: string
}

@ObjectType()
export class signUpResponse {
  @Field()
  email: string
}

export interface IContext {
  req: Request;
  res: Response;
  payload?: {userId:string};
}

@ObjectType()
export class jokeObject {
  @Field()
  created_at?: string
  @Field()
  icon_url: string
  @Field()
  id: string
  @Field()
  updated_at?: string
  @Field()
  url?: string
  @Field()
  value: string
}