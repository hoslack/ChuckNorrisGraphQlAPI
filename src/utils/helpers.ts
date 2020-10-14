import 'dotenv/config'
import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql'
import { sign, verify } from 'jsonwebtoken'
import { User } from '../entity/User'
import { IContext } from './customTypes'
import { config } from '../config'

export const createAccessToken = (user: User) => {
return sign({userId: user.id}, config.SECRET, {expiresIn: '2d'})
}

export const createRefreshToken = (user: User) => {
  return sign({userId: user.id}, config.REFRESH_SECRET, {expiresIn: '7d'})
  }
  

export const isAuthenticated: MiddlewareFn<IContext> = ({context}, next) => {
  const authorization = context.req.headers['authorization']
  if(!authorization){
    throw new AuthenticationError('Authentication Error')
  }

  try{
    const token = authorization.split(' ')[1]
    const payload = verify(token, config.SECRET)
    context.payload = payload as any
  }
  catch(err){
    throw new AuthenticationError('Authentication Error')
  }

  return next()
}