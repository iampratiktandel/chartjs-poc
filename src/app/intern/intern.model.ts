export interface Intern {
  city: string;
  department: string;
  email: string;
  gender: string;
  hireDate: string;
  id: number;
  mobile: string;
  name: string;
  permanent: boolean;
}

export class FontStyle {
  constructor(
    public family: string,
    public size: number,
    public lineHeight: number,
    public style: string,
    public weight: string
  ) { }
}