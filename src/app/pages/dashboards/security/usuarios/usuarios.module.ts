import { Base } from '../../../../generic/base.module';

export interface Usuario extends Base {
  userName: string | any;
  password: string | any;
  personaId: number | any;
  persona: string;
}