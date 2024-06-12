
type Profile = 'admin' | 'invitado' | 'usuario' | 'tester';
type Gender = 'masculino' | 'femenino';

export interface TestUser {
  id: number,
  email: string,
  password: string,
  profile: Profile,
  gender: Gender,
  icon?: string
}
