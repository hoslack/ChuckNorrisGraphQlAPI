import { Resolver, Query, UseMiddleware, Arg, Mutation } from 'type-graphql'
import axios from 'axios'
import { isAuthenticated } from '../utils/helpers'
import { jokeObject } from '../utils/customTypes'

@Resolver()
export class JokeResolver {

  @Query(() => [String])
  @UseMiddleware(isAuthenticated)
  async categories(): Promise<[String]>{
    const response = await axios.get('https://api.chucknorris.io/jokes/categories')
    return response.data
  }

  @Mutation(() => jokeObject)
  @UseMiddleware(isAuthenticated)
  async joke(@Arg('category') category: string): Promise<jokeObject>{
    const response = await axios.get(`https://api.chucknorris.io/jokes/random?category=${category}`);

    let resultObject = new jokeObject
    resultObject.icon_url=response.data.icon_url
    resultObject.id=response.data.id
    resultObject.url=response.data.url
    resultObject.value=response.data.value
    return resultObject;
  }
}