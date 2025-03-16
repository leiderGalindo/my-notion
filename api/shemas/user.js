import z from 'zod'

const userShema = z.object({
  username: z.string(
    {
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string'
    }
  ).min(3),
  email: z.string(
    {
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email address'
    }
  ).email(),
  password: z.string(
    {
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    }
  ).min(8),
  profile_image_url: z.string().url({
    invalid_type_error: "Movie poster must be a valid url",
  }),
})

/*
 Validamos los datos y solo retornamos los datos que estamos 
 validando en caso de dar error se retorna un objeto con el error
*/
export function validateUser(object){
  return userShema.safeParse(object)
}

export function validatePartialUser(object){
  return userShema.partial().safeParse(object)
}