import z from 'zod'

const userShema = z.object({
  username: z.array(
    z.string().min(3),
    {
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string'
    }
  ),
  email: z.array(
    z.string().email(),
    {
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email address'
    }
  ),
  password: z.array(
    z.string().min(8),
    {
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    }
  ),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

/*
 Validamos los datos y solo retornamos los datos que estamos 
 validando en caso de dar error se retorna un objeto con el error
*/
export function validateUser(object){
  return userShema.safeParse(object)
}